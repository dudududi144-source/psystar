export function interpolateTempo(startBpm: number, endBpm: number, bars: number, currentBar: number): number {
  if (bars <= 0) return startBpm;

  var t = Math.max(0, Math.min(1, currentBar / bars));

  return startBpm + (endBpm - startBpm) * t;
}

export function isValidTempoRange(startBpm: number, endBpm: number): boolean {
  return typeof startBpm === 'number' && typeof endBpm === 'number' &&
    startBpm > 0 && endBpm > 0 && isFinite(startBpm) && isFinite(endBpm);
}
