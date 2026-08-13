export var VELOCITY_TIERS = [1.0, 0.75, 0.5];

export function clampVelocity(value: number): number {
  if (isNaN(value)) return 1.0;

  return Math.max(0.1, Math.min(1.5, value));
}

export function nextVelocityTier(current: number): number {
  var idx = VELOCITY_TIERS.indexOf(current);

  if (idx === -1) return VELOCITY_TIERS[0];

  return VELOCITY_TIERS[(idx + 1) % VELOCITY_TIERS.length];
}

export function createVelocityGrid(rows: number, steps: number): number[][] {
  var grid: number[][] = [];

  for (var r = 0; r < rows; r++) {
    var row: number[] = [];
    for (var c = 0; c < steps; c++) {
      row.push(1.0);
    }
    grid.push(row);
  }

  return grid;
}

export function effectiveVelocity(base: number, tier: number, accented: boolean): number {
  var accentFactor = accented ? 1.35 : 1.0;

  return clampVelocity(base * tier * accentFactor);
}
