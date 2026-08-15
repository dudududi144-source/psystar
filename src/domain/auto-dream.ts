export function nextDreamTarget(current: number, count: number, random: () => number): number {
  if (count <= 1) return current;

  var candidate = Math.floor(random() * count);

  if (candidate === current) {
    candidate = (candidate + 1) % count;
  }

  return candidate;
}

export function morphProgress(elapsedBars: number, morphBars: number): number {
  if (morphBars <= 0) return 1;

  return Math.max(0, Math.min(1, elapsedBars / morphBars));
}

export function shouldDream(barIndex: number, intervalBars: number): boolean {
  if (intervalBars <= 0) return false;
  if (barIndex <= 0) return false;

  return barIndex % intervalBars === 0;
}
