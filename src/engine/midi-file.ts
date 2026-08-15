export interface MidiNoteEvent {
  tick: number;
  note: number;
  velocity: number;
  duration: number;
}

export var DEFAULT_TICKS_PER_QUARTER = 480;

export function writeVarLen(value: number): number[] {
  var v = Math.max(0, Math.floor(value));
  var buffer = v & 0x7f;
  var out: number[] = [];

  v = v >> 7;

  while (v > 0) {
    buffer = buffer << 8;
    buffer = buffer | ((v & 0x7f) | 0x80);
    v = v >> 7;
  }

  while (true) {
    out.push(buffer & 0xff);

    if (buffer & 0x80) {
      buffer = buffer >> 8;
    } else {
      break;
    }
  }

  return out;
}

export function buildTrack(events: MidiNoteEvent[], ticksPerQuarter: number): number[] {
  var sorted = events.slice().sort(function (a, b) {
    return a.tick - b.tick;
  });

  var timeline: { tick: number; data: number[] }[] = [];

  for (var i = 0; i < sorted.length; i++) {
    var e = sorted[i];
    var note = Math.max(0, Math.min(127, Math.floor(e.note)));
    var vel = Math.max(1, Math.min(127, Math.floor(e.velocity)));
    var dur = Math.max(1, Math.floor(e.duration));

    timeline.push({ tick: e.tick, data: [0x90, note, vel] });
    timeline.push({ tick: e.tick + dur, data: [0x80, note, 0] });
  }

  timeline.sort(function (a, b) {
    return a.tick - b.tick;
  });

  var bytes: number[] = [];
  var lastTick = 0;

  for (var j = 0; j < timeline.length; j++) {
    var delta = timeline[j].tick - lastTick;

    bytes = bytes.concat(writeVarLen(delta));
    bytes = bytes.concat(timeline[j].data);
    lastTick = timeline[j].tick;
  }

  bytes = bytes.concat(writeVarLen(0));
  bytes = bytes.concat([0xff, 0x2f, 0x00]);

  return bytes;
}

export function buildMidiFile(events: MidiNoteEvent[], ticksPerQuarter: number): number[] {
  var tpq = Math.max(1, Math.floor(ticksPerQuarter || DEFAULT_TICKS_PER_QUARTER));
  var track = buildTrack(events, tpq);

  var header = [
    0x4d, 0x54, 0x68, 0x64,
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x00,
    0x00, 0x01,
    (tpq >> 8) & 0xff, tpq & 0xff
  ];

  var trackHeader = [
    0x4d, 0x54, 0x72, 0x6b,
    (track.length >> 24) & 0xff,
    (track.length >> 16) & 0xff,
    (track.length >> 8) & 0xff,
    track.length & 0xff
  ];

  return header.concat(trackHeader).concat(track);
}
