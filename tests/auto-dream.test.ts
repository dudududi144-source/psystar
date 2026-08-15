import { test, expect } from 'bun:test';
import { nextDreamTarget, morphProgress, shouldDream } from '../src/domain/auto-dream.ts';
import { mulberry32 } from './helpers.ts';

test('nextDreamTarget never stays in place when there are choices', () => {
  const random = mulberry32(7);

  for (let i = 0; i < 200; i++) {
    const target = nextDreamTarget(2, 5, random);

    expect(target).not.toBe(2);
    expect(target).toBeGreaterThanOrEqual(0);
    expect(target).toBeLessThan(5);
  }
});

test('nextDreamTarget returns current when there is nowhere to dream', () => {
  expect(nextDreamTarget(0, 1, mulberry32(1))).toBe(0);
  expect(nextDreamTarget(0, 0, mulberry32(1))).toBe(0);
});

test('nextDreamTarget is deterministic for a seed', () => {
  expect(nextDreamTarget(0, 8, mulberry32(42))).toBe(nextDreamTarget(0, 8, mulberry32(42)));
});

test('morphProgress maps bars into 0..1', () => {
  expect(morphProgress(0, 4)).toBe(0);
  expect(morphProgress(2, 4)).toBeCloseTo(0.5, 6);
  expect(morphProgress(4, 4)).toBe(1);
  expect(morphProgress(99, 4)).toBe(1);
});

test('morphProgress guards zero duration', () => {
  expect(morphProgress(5, 0)).toBe(1);
});

test('shouldDream fires only on interval bars after the first', () => {
  expect(shouldDream(0, 4)).toBe(false);
  expect(shouldDream(4, 4)).toBe(true);
  expect(shouldDream(8, 4)).toBe(true);
  expect(shouldDream(3, 4)).toBe(false);
  expect(shouldDream(4, 0)).toBe(false);
});
