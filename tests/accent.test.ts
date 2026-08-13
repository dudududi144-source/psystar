import { test, expect } from 'bun:test';
import { accentVelocity, createAccentGrid, ACCENT_BOOST, VELOCITY_CAP } from '../src/domain/accent.ts';

test('accentVelocity boosts accented steps', () => {
  expect(accentVelocity(1.0, true)).toBeCloseTo(ACCENT_BOOST, 6);
  expect(accentVelocity(1.0, false)).toBe(1.0);
});

test('accentVelocity respects the cap', () => {
  expect(accentVelocity(1.5, true)).toBe(VELOCITY_CAP);
});

test('createAccentGrid builds all-false grid', () => {
  const grid = createAccentGrid(4, 16);

  expect(grid.length).toBe(4);
  expect(grid[0].length).toBe(16);
  expect(grid.every(function (row) {
    return row.every(function (cell) { return cell === false; });
  })).toBe(true);
});
