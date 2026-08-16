import { test, expect } from 'bun:test';
import { interpolateTempo, isValidTempoRange } from '../src/domain/tempo-ramp.ts';

test('interpolateTempo starts at startBpm', () => {
  expect(interpolateTempo(100, 140, 8, 0)).toBe(100);
});

test('interpolateTempo reaches endBpm at the end', () => {
  expect(interpolateTempo(100, 140, 8, 8)).toBe(140);
  expect(interpolateTempo(100, 140, 8, 16)).toBe(140);
});

test('interpolateTempo ramps linearly', () => {
  expect(interpolateTempo(100, 140, 8, 4)).toBe(120);
  expect(interpolateTempo(120, 180, 6, 3)).toBe(150);
});

test('interpolateTempo guards zero bars', () => {
  expect(interpolateTempo(100, 140, 0, 5)).toBe(100);
});

test('interpolateTempo supports decreasing tempo', () => {
  expect(interpolateTempo(140, 100, 8, 0)).toBe(140);
  expect(interpolateTempo(140, 100, 8, 8)).toBe(100);
  expect(interpolateTempo(140, 100, 8, 4)).toBe(120);
});

test('isValidTempoRange validates ranges', () => {
  expect(isValidTempoRange(100, 140)).toBe(true);
  expect(isValidTempoRange(0, 140)).toBe(false);
  expect(isValidTempoRange(100, -1)).toBe(false);
  expect(isValidTempoRange(NaN, 140)).toBe(false);
});
