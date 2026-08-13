import { test, expect } from 'bun:test';
import { createEmptyRoll, isValidRoll, rollSetNote, rollClearStep, rollNoteAt, rollDensity, encodeRoll, decodeRoll } from '../src/domain/roll.ts';

test('createEmptyRoll builds all-empty roll', () => {
  const roll = createEmptyRoll(16);

  expect(roll.steps.length).toBe(16);
  expect(roll.steps.every(function (v) { return v === -1; })).toBe(true);
});

test('createEmptyRoll floors and clamps size', () => {
  expect(createEmptyRoll(4.9).steps.length).toBe(4);
  expect(createEmptyRoll(-3).steps.length).toBe(0);
});

test('isValidRoll accepts empty and valid degrees', () => {
  expect(isValidRoll(createEmptyRoll(8), 6)).toBe(true);

  const roll = rollSetNote(createEmptyRoll(8), 2, 5);
  expect(isValidRoll(roll, 6)).toBe(true);
});

test('isValidRoll rejects out-of-range degrees', () => {
  const roll = rollSetNote(createEmptyRoll(8), 2, 9);
  expect(isValidRoll(roll, 6)).toBe(false);
});

test('isValidRoll rejects malformed rolls', () => {
  expect(isValidRoll(null as unknown as never, 6)).toBe(false);
  expect(isValidRoll({ steps: [0, 'x'] } as never, 6)).toBe(false);
});

test('rollSetNote is immutable', () => {
  const original = createEmptyRoll(8);
  const changed = rollSetNote(original, 3, 4);

  expect(original.steps[3]).toBe(-1);
  expect(changed.steps[3]).toBe(4);
});

test('rollSetNote ignores out-of-bounds steps', () => {
  const roll = createEmptyRoll(8);
  const same = rollSetNote(roll, 99, 2);

  expect(same).toBe(roll);
});

test('rollClearStep and rollNoteAt roundtrip', () => {
  let roll = createEmptyRoll(8);
  roll = rollSetNote(roll, 5, 3);

  expect(rollNoteAt(roll, 5)).toBe(3);

  roll = rollClearStep(roll, 5);
  expect(rollNoteAt(roll, 5)).toBe(-1);
});

test('rollNoteAt guards bad input', () => {
  expect(rollNoteAt(null as unknown as never, 0)).toBe(-1);
  expect(rollNoteAt(createEmptyRoll(4), 10)).toBe(-1);
});

test('rollDensity computes active ratio', () => {
  let roll = createEmptyRoll(4);
  roll = rollSetNote(roll, 0, 1);
  roll = rollSetNote(roll, 2, 2);

  expect(rollDensity(roll)).toBeCloseTo(0.5, 6);
  expect(rollDensity(createEmptyRoll(0))).toBe(0);
});

test('encode/decode roundtrip with validation', () => {
  let roll = createEmptyRoll(16);
  roll = rollSetNote(roll, 7, 4);

  const decoded = decodeRoll(encodeRoll(roll), 6);

  expect(decoded).not.toBeNull();
  expect(decoded?.steps[7]).toBe(4);
});

test('decodeRoll rejects garbage and invalid degrees', () => {
  expect(decodeRoll('not-json', 6)).toBeNull();
  expect(decodeRoll('{"steps":[99]}', 6)).toBeNull();
});
