export var METRONOME_DOWNBEAT_HZ = 1760;
export var METRONOME_BEAT_HZ = 880;

export function clickFrequency(stepIndex: number, stepsPerBar: number): number {
  var sib = Math.max(1, Math.floor(stepsPerBar));
  var idx = Math.max(0, Math.floor(stepIndex));

  return idx % sib === 0 ? METRONOME_DOWNBEAT_HZ : METRONOME_BEAT_HZ;
}

export function countInSteps(bars: number, stepsPerBar: number): number {
  return Math.max(0, Math.floor(bars)) * Math.max(1, Math.floor(stepsPerBar));
}

export function isClickStep(stepIndex: number, stepsPerClick: number): boolean {
  var soc = Math.max(1, Math.floor(stepsPerClick));

  return Math.max(0, Math.floor(stepIndex)) % soc === 0;
}
