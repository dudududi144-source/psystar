export var EQ_GAIN_MIN = -12;
export var EQ_GAIN_MAX = 12;
export var MID_FREQ_MIN = 200;
export var MID_FREQ_MAX = 4000;

export interface EqSettings {
  lowDb: number;
  midDb: number;
  highDb: number;
  midFreqHz: number;
}

export function clampEqGain(db: number): number {
  if (!isFinite(db)) return 0;

  return Math.max(EQ_GAIN_MIN, Math.min(EQ_GAIN_MAX, db));
}

export function defaultEqSettings(): EqSettings {
  return { lowDb: 0, midDb: 0, highDb: 0, midFreqHz: 1000 };
}

export function clampEqSettings(settings: EqSettings): EqSettings {
  return {
    lowDb: clampEqGain(settings.lowDb),
    midDb: clampEqGain(settings.midDb),
    highDb: clampEqGain(settings.highDb),
    midFreqHz: Math.max(MID_FREQ_MIN, Math.min(MID_FREQ_MAX, settings.midFreqHz))
  };
}

export function eqDeltaDb(settings: EqSettings): number {
  var clamped = clampEqSettings(settings);

  return Math.abs(clamped.lowDb) + Math.abs(clamped.midDb) + Math.abs(clamped.highDb);
}
