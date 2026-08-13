import { test, expect } from 'bun:test';
import { euclidean, euclideanDensity } from '../src/domain/euclidean.ts';

test('euclidean E(5,8) matches canonical pattern', () => {
  const pattern = euclidean(5, 8, 0);
  const expected = [true, false, true, false, true, true, false, true];

  expect(pattern).toEqual(expected);
});

test('euclidean E(3,8) matches canonical pattern', () => {
  const pattern = euclidean(3, 8, 0);
  const expected = [true, false, false, true, false, false, true, false];

  expect(pattern).toEqual(expected);
});

test('euclidean handles empty and full cases', () => {
  expect(euclidean(0, 4, 0)).toEqual([false, false, false, false]);
  expect(euclidean(4, 4, 0)).toEqual([true, true, true, true]);
  expect(euclidean(3, 0, 0)).toEqual([]);
});

test('euclidean clamps pulses above steps', () => {
  const pattern = euclidean(9, 4, 0);

  expect(pattern.length).toBe(4);
  expect(pattern.every(function (cell) { return cell === true; })).toBe(true);
});

test('euclidean rotation shifts pattern right', () => {
  const rotated = euclidean(1, 4, 1);

  expect(rotated).toEqual([false, true, false, false]);
});

test('euclidean density computes ratio', () => {
  expect(euclideanDensity(4, 16)).toBeCloseTo(0.25, 6);
  expect(euclideanDensity(5, 0)).toBe(0);
});
