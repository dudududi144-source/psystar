import { test, expect } from 'bun:test';
import { GROOVES, isValidGroove, grooveNames, grooveByName, grooveDensity, mergeGroove } from '../src/domain/groove.ts';

test('all built-in grooves are valid 4x16 grids', () => {
  expect(GROOVES.length).toBe(6);

  for (const groove of GROOVES) {
    expect(isValidGroove(groove)).toBe(true);
  }
});

test('grooveNames lists every groove', () => {
  const names = grooveNames();

  expect(names.length).toBe(6);
  expect(names).toContain('Four on the Floor');
  expect(names).toContain('Psytrance Gallop');
});

test('grooveByName finds and misses correctly', () => {
  expect(grooveByName('Breakbeat')).not.toBeNull();
  expect(grooveByName('nope')).toBeNull();
});

test('isValidGroove rejects malformed grooves', () => {
  expect(isValidGroove(null as unknown as never)).toBe(false);
  expect(isValidGroove({ name: 'x', rows: [] })).toBe(false);
  expect(isValidGroove({ name: 'x', rows: [[true]] } as never)).toBe(false);
});

test('grooveDensity computes active ratio', () => {
  const four = grooveByName('Four on the Floor');

  expect(four).not.toBeNull();
  if (four) {
    expect(grooveDensity(four)).toBeCloseTo((4 + 4 + 2 + 2) / 64, 6);
  }
});

test('mergeGroove replace mode overwrites grid', () => {
  const empty = [[false], [false], [false], [false]];
  const groove = grooveByName('Four on the Floor');

  if (!groove) throw new Error('missing groove');

  const merged = mergeGroove(empty, groove, 'replace');

  expect(merged.length).toBe(4);
  expect(merged[0].length).toBe(16);
  expect(merged[0][0]).toBe(true);
  expect(merged[0][1]).toBe(false);
});

test('mergeGroove or mode unions grids', () => {
  const full = [
    new Array(16).fill(true),
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false)
  ];
  const groove = grooveByName('Half-Time');

  if (!groove) throw new Error('missing groove');

  const merged = mergeGroove(full, groove, 'or');

  expect(merged[0].every(function (cell) { return cell === true; })).toBe(true);
});

test('mergeGroove and mode intersects grids', () => {
  const none = [
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false)
  ];
  const groove = grooveByName('Tribal');

  if (!groove) throw new Error('missing groove');

  const merged = mergeGroove(none, groove, 'and');

  expect(merged[0].every(function (cell) { return cell === false; })).toBe(true);
});

test('mergeGroove does not mutate input grid', () => {
  const grid = [
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false),
    new Array(16).fill(false)
  ];
  const groove = grooveByName('Dub Step');

  if (!groove) throw new Error('missing groove');

  mergeGroove(grid, groove, 'replace');

  expect(grid[0].every(function (cell) { return cell === false; })).toBe(true);
});
