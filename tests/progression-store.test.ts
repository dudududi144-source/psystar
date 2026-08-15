import { test, expect } from 'bun:test';
import {
  PROGRESSION_VERSION,
  isValidDegrees,
  encodeProgression,
  decodeProgression,
  degreeRoman,
  progressionLabel
} from '../src/domain/progression-store.ts';

test('isValidDegrees accepts diatonic degrees', () => {
  expect(isValidDegrees([1, 4, 5, 1])).toBe(true);
  expect(isValidDegrees([1, 5, 6, 4])).toBe(true);
});

test('isValidDegrees rejects invalid input', () => {
  expect(isValidDegrees([])).toBe(false);
  expect(isValidDegrees([0, 4, 5])).toBe(false);
  expect(isValidDegrees([1, 8, 5])).toBe(false);
  expect(isValidDegrees([1, 2.5, 5])).toBe(false);
  expect(isValidDegrees([1, 'x', 5] as never)).toBe(false);
});

test('encode/decode roundtrip', () => {
  const degrees = [1, 6, 4, 5];
  const decoded = decodeProgression(encodeProgression(degrees, 'test'));

  expect(decoded).toEqual(degrees);
});

test('decode rejects wrong version and garbage', () => {
  expect(decodeProgression(JSON.stringify({ version: 99, degrees: [1, 2] }))).toBeNull();
  expect(decodeProgression(JSON.stringify({ version: PROGRESSION_VERSION, degrees: [1, 9] }))).toBeNull();
  expect(decodeProgression('not-json')).toBeNull();
});

test('degreeRoman renders major qualities', () => {
  expect(degreeRoman(1, false)).toBe('I');
  expect(degreeRoman(2, false)).toBe('ii');
  expect(degreeRoman(3, false)).toBe('iii');
  expect(degreeRoman(4, false)).toBe('IV');
  expect(degreeRoman(5, false)).toBe('V');
  expect(degreeRoman(6, false)).toBe('vi');
  expect(degreeRoman(7, false)).toBe('vii°');
});

test('degreeRoman renders minor qualities', () => {
  expect(degreeRoman(1, true)).toBe('i');
  expect(degreeRoman(2, true)).toBe('ii°');
  expect(degreeRoman(3, true)).toBe('III');
  expect(degreeRoman(4, true)).toBe('iv');
  expect(degreeRoman(5, true)).toBe('v');
  expect(degreeRoman(6, true)).toBe('VI');
  expect(degreeRoman(7, true)).toBe('VII');
});

test('degreeRoman guards out of range', () => {
  expect(degreeRoman(0, false)).toBe('?');
  expect(degreeRoman(9, true)).toBe('?');
});

test('progressionLabel joins romans with arrows', () => {
  expect(progressionLabel([1, 4, 5, 1], false)).toBe('I → IV → V → I');
  expect(progressionLabel([1, 6, 3, 7], true)).toBe('i → VI → III → VII');
  expect(progressionLabel([9], false)).toBe('');
});
