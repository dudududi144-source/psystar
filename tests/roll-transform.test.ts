import { test, expect } from 'bun:test';
import { transposeDegrees, reverseRoll, rollAxis, invertRoll, randomRoll } from '../src/domain/roll-transform.ts';
import { mulberry32 } from './helpers.ts';

test('transposeDegrees shifts active degrees and skips holes', () => {
  const roll = [0, -1, 2, 4];
  const shifted = transposeDegrees(roll, 2, 10);

  expect(shifted).toEqual([2, -1, 4, 6]);
});

test('transposeDegrees clamps into range', () => {
  const roll = [0, 9];

  expect(transposeDegrees(roll, 5, 10)).toEqual([5, 10]);
  expect(transposeDegrees(roll, -5, 10)).toEqual([0, 4]);
});

test('reverseRoll reverses without mutating', () => {
  const roll = [1, -1, 3];
  const reversed = reverseRoll(roll);

  expect(reversed).toEqual([3, -1, 1]);
  expect(roll).toEqual([1, -1, 3]);
});

test('rollAxis finds the melodic center', () => {
  expect(rollAxis([0, 4, 8])).toBe(4);
  expect(rollAxis([1, 2])).toBe(1);
  expect(rollAxis([])).toBe(0);
  expect(rollAxis([-1, -1])).toBe(0);
});

test('invertRoll mirrors around the axis', () => {
  const roll = [0, 2, 4];
  const inverted = invertRoll(roll, rollAxis(roll));

  expect(inverted).toEqual([4, 2, 0]);
});

test('invertRoll preserves holes', () => {
  expect(invertRoll([0, -1, 4], 2)).toEqual([4, -1, 0]);
});

test('randomRoll is deterministic and bounded', () => {
  const a = randomRoll(16, 9, 0.6, mulberry32(7));
  const b = randomRoll(16, 9, 0.6, mulberry32(7));

  expect(a).toEqual(b);

  for (const degree of a) {
    expect(degree).toBeGreaterThanOrEqual(-1);
    expect(degree).toBeLessThanOrEqual(9);
  }
});

test('randomRoll honors density extremes', () => {
  const empty = randomRoll(16, 9, 0, mulberry32(1));
  const full = randomRoll(16, 9, 1, mulberry32(1));

  expect(empty.every(function (d) { return d === -1; })).toBe(true);
  expect(full.every(function (d) { return d >= 0; })).toBe(true);
});
