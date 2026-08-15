import { test, expect } from 'bun:test';
import { STEM_SUFFIXES, soloGrid, stemFileName, activeStemCount } from '../src/engine/stems.ts';

const grid = [
  [true, false, true, false],
  [false, true, false, true],
  [false, false, false, false],
  [true, true, false, false]
];

test('soloGrid isolates exactly one row', () => {
  const solo = soloGrid(grid, 1);

  expect(solo[0].every(function (c) { return c === false; })).toBe(true);
  expect(solo[1]).toEqual([false, true, false, true]);
  expect(solo[2].every(function (c) { return c === false; })).toBe(true);
  expect(solo[3].every(function (c) { return c === false; })).toBe(true);
});

test('soloGrid does not mutate the source grid', () => {
  const copy = grid.map(function (row) { return row.slice(); });

  soloGrid(grid, 0);

  expect(grid).toEqual(copy);
});

test('stemFileName builds standard names', () => {
  expect(stemFileName('psystar', 0)).toBe('psystar-bass.wav');
  expect(stemFileName('psystar', 3)).toBe('psystar-spark.wav');
  expect(stemFileName('psystar', 9)).toBe('psystar-row-9.wav');
});

test('activeStemCount counts rows that have notes', () => {
  expect(activeStemCount(grid)).toBe(3);
  expect(activeStemCount([])).toBe(0);
  expect(activeStemCount([[false, false]])).toBe(0);
});

test('stem suffixes cover all four voices', () => {
  expect(STEM_SUFFIXES.length).toBe(4);
  expect(STEM_SUFFIXES).toEqual(['bass', 'lead', 'pad', 'spark']);
});
