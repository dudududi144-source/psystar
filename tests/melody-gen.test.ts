import { test, expect } from 'bun:test';
import { generateMelody, melodyNoteCount } from '../src/domain/melody-gen.ts';
import { mulberry32 } from './helpers.ts';

test('generateMelody returns the requested length', () => {
  const melody = generateMelody(16, 11, mulberry32(1));

  expect(melody.length).toBe(16);
});

test('generateMelody values are rests or valid degrees', () => {
  const melody = generateMelody(64, 11, mulberry32(7));

  for (const value of melody) {
    expect(value === -1 || (value >= 0 && value <= 11)).toBe(true);
  }
});

test('generateMelody is deterministic for a seed', () => {
  const a = generateMelody(16, 11, mulberry32(42));
  const b = generateMelody(16, 11, mulberry32(42));

  expect(a).toEqual(b);
});

test('generateMelody guards invalid input', () => {
  expect(generateMelody(0, 11, mulberry32(1))).toEqual([]);
  expect(generateMelody(16, 0, mulberry32(1))).toEqual([]);
});

test('generateMelody produces some notes', () => {
  const melody = generateMelody(32, 11, mulberry32(5));

  expect(melodyNoteCount(melody)).toBeGreaterThan(0);
});

test('melodyNoteCount counts non-rest notes', () => {
  expect(melodyNoteCount([-1, 0, 5, -1, 3])).toBe(3);
  expect(melodyNoteCount([])).toBe(0);
});
