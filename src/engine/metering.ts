export var METER_DB_FLOOR = -60;
export var METER_DB_TOP = 6;

export function dbFromPeak(peak: number): number {
  var v = Math.abs(peak);

  if (v <= 0.000001) return METER_DB_FLOOR;

  return Math.max(METER_DB_FLOOR, Math.min(METER_DB_TOP, 20 * Math.log10(v)));
}

export function dbFromRms(samples: ArrayLike<number>): number {
  if (!samples || samples.length === 0) return METER_DB_FLOOR;

  var sum = 0;

  for (var i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }

  var rms = Math.sqrt(sum / samples.length);

  return dbFromPeak(rms);
}

export function normalizeDbToMeter(db: number): number {
  var range = METER_DB_TOP - METER_DB_FLOOR;
  var value = (db - METER_DB_FLOOR) / range;

  return Math.max(0, Math.min(1, value));
}

export function gainReductionDb(inputDb: number, thresholdDb: number, ratio: number): number {
  var input = Math.max(METER_DB_FLOOR, Math.min(METER_DB_TOP, inputDb));
  var threshold = Math.max(METER_DB_FLOOR, Math.min(METER_DB_TOP, thresholdDb));
  var safeRatio = Math.max(1, Math.min(20, ratio));

  if (input <= threshold) return 0;

  return (input - threshold) * (1 - 1 / safeRatio);
}
