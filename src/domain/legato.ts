export function sustainDuration(barDurationSec: number, sustainAmount: number): number {
  if (barDurationSec <= 0) return 0;

  var amount = Math.max(0, Math.min(1, sustainAmount));

  return barDurationSec * (1 + amount);
}

export function sustainOverlap(barDurationSec: number, sustainAmount: number): number {
  if (barDurationSec <= 0) return 0;

  var amount = Math.max(0, Math.min(1, sustainAmount));

  return barDurationSec * amount;
}

export function shouldSustain(sustainAmount: number): boolean {
  return sustainAmount > 0;
}
