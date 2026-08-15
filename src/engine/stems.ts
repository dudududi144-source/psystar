export var STEM_SUFFIXES = ['bass', 'lead', 'pad', 'spark'];

export function soloGrid(grid: boolean[][], soloIndex: number): boolean[][] {
  if (!Array.isArray(grid)) return [];

  return grid.map(function (row, i) {
    return row.map(function (cell) {
      return i === soloIndex && cell === true;
    });
  });
}

export function stemFileName(base: string, rowIndex: number): string {
  var suffix = STEM_SUFFIXES[rowIndex] || 'row-' + rowIndex;

  return base + '-' + suffix + '.wav';
}

export function activeStemCount(grid: boolean[][]): number {
  if (!Array.isArray(grid)) return 0;

  var count = 0;

  for (var i = 0; i < grid.length; i++) {
    if (Array.isArray(grid[i]) && grid[i].some(Boolean)) {
      count++;
    }
  }

  return count;
}
