import { test, expect } from 'bun:test';
import { VELOCITY_TIERS, clampVelocity, nextVelocityTier, createVelocityGrid, effectiveVelocity } from '../src/domain/velocity.ts';

test('nextVelocityTier cycles through tiers', () => {
  expect(nextVelocityTier(1.0)).toBe(0.75);
  expect(nextVelocityTier(0.75)).toBe(0.5);
  expect(nextVelocityTier(0.5)).toBe(1.0);
});

test('nextVelocityTier resets unknown values to full', () => {
  expect(nextVelocityTier(0.33)).toBe(1.0);
});

test('clampVelocity keeps musical bounds', () => {
  expect(clampVelocity(0)).toBe(0.1);
  expect(clampVelocity(3)).toBe(1.5);
  expect(clampVelocity(0.9)).toBeCloseTo(0.9, 6);
});

test('clampVelocity survives NaN', () => {
  expect(clampVelocity(NaN)).toBe(1.0);
});

test('createVelocityGrid builds all-full grid', () => {
  const grid = createVelocityGrid(4, 16);

  expect(grid.length).toBe(4);
  expect(grid[0].length).toBe(16);
  expect(grid.every(function (row) {
    return row.every(function (cell) { return cell === 1.0; });
  })).toBe(true);
});

test('effectiveVelocity combines base, tier and accent', () => {
  expect(effectiveVelocity(1.0, 1.0, false)).toBeCloseTo(1.0, 6);
  expect(effectiveVelocity(1.0, 0.5, false)).toBeCloseTo(0.5, 6);
  expect(effectiveVelocity(1.0, 1.0, true)).toBeCloseTo(1.35, 6);
});

test('effectiveVelocity caps at ceiling', () => {
  expect(effectiveVelocity(1.4, 1.0, true)).toBe(1.5);
});
