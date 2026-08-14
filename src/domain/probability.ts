export var PROBABILITY_TIERS = [1.0, 0.75, 0.5, 0.25];

export function nextProbabilityTier(current: number): number {
  var idx = PROBABILITY_TIERS.indexOf(current);

  if (idx === -1) return PROBABILITY_TIERS[0];

  return PROBABILITY_TIERS[(idx + 1) % PROBABILITY_TIERS.length];
}

export function shouldFire(probability: number, random: () => number): boolean {
  var p = Math.max(0, Math.min(1, probability));

  if (p >= 1) return true;
  if (p <= 0) return false;

  return random() < p;
}

export function loopSeed(loopIndex: number, baseSeed: number): number {
  var loop = Math.max(0, Math.floor(loopIndex)) >>> 0;
  var base = baseSeed >>> 0;

  return (base + Math.imul(loop, 0x9e3779b9)) >>> 0;
}
