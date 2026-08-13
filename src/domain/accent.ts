export var ACCENT_BOOST = 1.35;
export var VELOCITY_CAP = 1.6;

export function accentVelocity(base: number, accented: boolean): number {
  if (!accented) return base;

  return Math.min(VELOCITY_CAP, base * ACCENT_BOOST);
}

export function createAccentGrid(rows: number, steps: number): boolean[][] {
  var grid: boolean[][] = [];

  for (var r = 0; r < rows; r++) {
    var row: boolean[] = [];
    for (var s = 0; s < steps; s++) {
      row.push(false);
    }
    grid.push(row);
  }

  return grid;
}
