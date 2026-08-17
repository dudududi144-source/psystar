import { test, expect } from 'bun:test';
import { buildSongPlan, isValidSongPlan } from '../src/domain/song-builder.ts';
import { mulberry32 } from './helpers.ts';

test('buildSongPlan produces a melody and indices', () => {
  const plan = buildSongPlan(16, 11, 5, 4, mulberry32(1));

  expect(plan.melody.length).toBe(16);
  expect(plan.progressionIndex).toBeGreaterThanOrEqual(0);
  expect(plan.progressionIndex).toBeLessThan(5);
  expect(plan.grooveIndex).toBeGreaterThanOrEqual(0);
  expect(plan.grooveIndex).toBeLessThan(4);
});

test('buildSongPlan is deterministic for a seed', () => {
  const a = buildSongPlan(16, 11, 5, 4, mulberry32(42));
  const b = buildSongPlan(16, 11, 5, 4, mulberry32(42));

  expect(a).toEqual(b);
});

test('buildSongPlan guards zero counts', () => {
  const plan = buildSongPlan(8, 11, 0, 0, mulberry32(1));

  expect(plan.progressionIndex).toBe(0);
  expect(plan.grooveIndex).toBe(0);
});

test('buildSongPlan melody values are valid', () => {
  const plan = buildSongPlan(32, 11, 5, 4, mulberry32(7));

  for (const value of plan.melody) {
    expect(value === -1 || (value >= 0 && value <= 11)).toBe(true);
  }
});

test('isValidSongPlan validates plans', () => {
  const plan = buildSongPlan(8, 11, 5, 4, mulberry32(1));

  expect(isValidSongPlan(plan)).toBe(true);
  expect(isValidSongPlan(null as unknown as never)).toBe(false);
  expect(isValidSongPlan({ ...plan, melody: null as unknown as never })).toBe(false);
});
