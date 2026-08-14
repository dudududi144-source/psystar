import { test, expect } from 'bun:test';
import { pitchClassOf, noteToDegree } from '../src/engine/transcribe.ts';

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const PENTA_MINOR = [0, 3, 5, 7, 10];

test('pitchClassOf wraps correctly', () => {
  expect(pitchClassOf(60)).toBe(0);
  expect(pitchClassOf(69)).toBe(9);
  expect(pitchClassOf(72)).toBe(0);
  expect(pitchClassOf(-1)).toBe(11);
});

test('noteToDegree maps exact scale notes in C major', () => {
  expect(noteToDegree(60, 0, MAJOR)).toBe(0);
  expect(noteToDegree(62, 0, MAJOR)).toBe(1);
  expect(noteToDegree(64, 0, MAJOR)).toBe(2);
  expect(noteToDegree(67, 0, MAJOR)).toBe(4);
  expect(noteToDegree(71, 0, MAJOR)).toBe(6);
  expect(noteToDegree(72, 0, MAJOR)).toBe(0);
});

test('noteToDegree snaps to nearest degree', () => {
  expect(noteToDegree(65, 0, MAJOR)).toBe(3);
  expect(noteToDegree(68, 0, MAJOR)).toBe(4);
});

test('noteToDegree works with other keys', () => {
  expect(noteToDegree(69, 9, PENTA_MINOR)).toBe(0);
  expect(noteToDegree(72, 9, PENTA_MINOR)).toBe(1);
  expect(noteToDegree(74, 9, PENTA_MINOR)).toBe(2);
});

test('noteToDegree guards empty intervals', () => {
  expect(noteToDegree(60, 0, [])).toBe(0);
});
