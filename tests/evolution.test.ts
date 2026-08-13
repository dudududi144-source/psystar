import { test, expect } from 'bun:test';
import { mulberry32 } from '../src/engine/humanizer.ts';
import { mutateGrid, rotateRow, rotateGrid, invertGrid, retrogradeGrid, gridDensity, evolveGrid } from '../src/domain/evolution.ts';

const baseGrid = [
  [true, false, true, false],
  [false, true, false, false]
];

test('mutateGrid with rate 0 returns identical grid', () => {
  const result = mutateGrid(baseGrid, 0, mulberry32(1));

  expect(result).toEqual(baseGrid);
});

test('mutateGrid with rate 1 inverts everything', () => {
  const result = mutateGrid(baseGrid, 1, mulberry32(1));

  expect(result).toEqual(invertGrid(baseGrid));
});

test('mutateGrid is deterministic with same seed', () => {
  const a = mutateGrid(baseGrid, 0.5, mulberry32(42));
  const b = mutateGrid(baseGrid, 0.5, mulberry32(42));

  expect(a).toEqual(b);
});

test('mutateGrid does not mutate input', () => {
  const copy = baseGrid.map(function (row) { return row.slice(); });

  mutateGrid(baseGrid, 0.5, mulberry32(7));

  expect(baseGrid).toEqual(copy);
});

test('rotateRow rotates right by one', () => {
  expect(rotateRow([true, false, false, false], 1)).toEqual([false, true, false, false]);
});

test('rotateRow wraps negative shifts', () => {
  expect(rotateRow([true, false, false, false], -1)).toEqual([false, false, false, true]);
});

test('rotateRow full cycle returns original', () => {
  expect(rotateRow([true, false, true, false], 4)).toEqual([true, false, true, false]);
});

test('rotateGrid rotates every row', () => {
  const result = rotateGrid(baseGrid, 1);

  expect(result[0]).toEqual([false, true, false, true]);
  expect(result[1]).toEqual([false, false, true, false]);
});

test('retrogradeGrid reverses each row', () => {
  const result = retrogradeGrid(baseGrid);

  expect(result[0]).toEqual([false, true, false, true]);
  expect(result[1]).toEqual([false, false, true, false]);
});

test('invertGrid flips every cell', () => {
  const result = invertGrid([[true, false]]);

  expect(result).toEqual([[false, true]]);
});

test('gridDensity computes active ratio', () => {
  expect(gridDensity([[true, false], [true, false]])).toBeCloseTo(0.5, 6);
  expect(gridDensity([])).toBe(0);
});

test('evolveGrid keeps shape and bass anchor', () => {
  const result = evolveGrid(baseGrid, 0.5, mulberry32(9));

  expect(result.length).toBe(2);
  expect(result[0].length).toBe(4);
  expect(result[0][0]).toBe(true);
});
