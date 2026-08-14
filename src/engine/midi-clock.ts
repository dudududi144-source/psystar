export var MIDI_CLOCK_PPQ = 24;
export var MIDI_CLOCK_BYTE = 0xf8;
export var MIDI_START_BYTE = 0xfa;
export var MIDI_CONTINUE_BYTE = 0xfb;
export var MIDI_STOP_BYTE = 0xfc;
export var MIDI_SPP_BYTE = 0xf2;

export function clockIntervalMs(bpm: number): number {
  if (bpm <= 0) return 0;

  return 60000 / bpm / MIDI_CLOCK_PPQ;
}

export function pulsesPerStep(stepsPerBeat: number): number {
  if (stepsPerBeat <= 0) return 0;

  return MIDI_CLOCK_PPQ / stepsPerBeat;
}

export function clockOffsetsForStep(stepDurationMs: number, stepsPerBeat: number): number[] {
  var pulses = pulsesPerStep(stepsPerBeat);
  var offsets: number[] = [];

  if (pulses <= 0 || stepDurationMs <= 0) return offsets;

  var perPulse = stepDurationMs / pulses;

  for (var i = 0; i < pulses; i++) {
    offsets.push(i * perPulse);
  }

  return offsets;
}

export function songPositionBytes(stepsPlayed: number): number[] {
  var beats = Math.max(0, Math.floor(stepsPlayed));

  return [MIDI_SPP_BYTE, beats & 0x7f, (beats >> 7) & 0x7f];
}
