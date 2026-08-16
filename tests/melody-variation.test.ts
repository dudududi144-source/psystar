import { test, expect } from 'bun:test';
import { varyMelody, melodyChanged } from '../src/domain/melody-variation.ts';
import { mulberry32 } from './helpers.ts';

test('varyMelody returns the same length', () => {
  const melody = [0, 2, 4, -1, 5, 3, 1, -1];
  const varied = varyMelody(melody, 0.5, 11, mulberry32(1));

  expect(varied.length).toBe(melody.length);
});

test('varyMelody keeps values in range', () => {
  const melody = [0, 2, 4, 6, 8, 10, 11, 1];
  const varied = varyMelody(melody, 1, 11, mulberry32(7));

  for (const value of varied) {
    expect(value === -1 || (value >= 0 && value <= 11)).toBe(true);
  }
});

test('varyMelody is deterministic for a seed', () => {
  const melody = [0, 2, 4, 6, 8, 10];
  const a = varyMelody(melody, 0.5, 11, mulberry32(42));
  const b = varyMelody(melody, 0.5, 11, mulberry32(42));

  expect(a).toEqual(b);
});

test('varyMelody with zero amount returns the same melody', () => {
  const melody = [0, 2, 4, 6];
  const varied = varyMelody(melody, 0, 11, mulberry32(1));

  expect(varied).toEqual(melody);
});

test('varyMelody preserves rests', () => {
  const melody = [-1, -1, -1, -1];
  const varied = varyMelody(melody, 1, 11, mulberry32(3));

  expect(varied).toEqual(melody);
});

test('melodyChanged detects changes', () => {
  expect(melodyChanged([0, 1], [0, 2])).toBe(true);
  expect(melodyChanged([0, 1], [0, 1])).toBe(false);
  expect(melodyChanged([0], [0, 1])).toBe(true);
});
