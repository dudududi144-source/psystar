export var MIDI_ROWS_CHANNEL = 0;
export var MIDI_MELODY_CHANNEL = 1;
export var MIDI_CHORD_CHANNEL = 2;

export function degreeToMidi(degree: number, scaleIntervals: number[], keyMidi: number): number | null {
  if (degree < 0) return null;
  if (!Array.isArray(scaleIntervals) || scaleIntervals.length === 0) return null;
  if (degree >= scaleIntervals.length) return null;

  var note = Math.floor(keyMidi) + Math.floor(scaleIntervals[degree]);

  return Math.max(0, Math.min(127, note));
}

export function noteOnFor(channel: number, note: number, velocity: number): number[] {
  return [0x90 | (channel & 0x0f), note & 0x7f, Math.max(1, Math.min(127, Math.round(velocity)))];
}

export function noteOffFor(channel: number, note: number): number[] {
  return [0x80 | (channel & 0x0f), note & 0x7f, 0x40];
}
