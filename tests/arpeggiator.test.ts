import { test, expect } from 'bun:test';
import { arpSequence } from '../src/engine/arpeggiator.ts';
import { mulberry32 } from './helpers.ts';

const cMajor = [60, 64, 67];

test('up mode cycles ascending', () => {
  const seq = arpSequence(cMajor, 'up', 6, mulberry32(1));

  expect(seq).toEqual([60, 64, 67, 60, 64, 67]);
});

test('down mode cycles descending', () => {
  const seq = arpSequence(cMajor, 'down', 4, mulberry32(1));

  expect(seq).toEqual([67, 64, 60, 67]);
});

test('updown mode folds back through the chord', () => {
  const seq = arpSequence(cMajor, 'updown', 8, mulberry32(1));

  expect(seq).toEqual([60, 64, 67, 64, 60, 64, 67, 64]);
});

test('updown with two notes alternates', () => {
  const seq = arpSequence([60, 64], 'updown', 4, mulberry32(1));

  expect(seq).toEqual([60, 64, 60, 64]);
});

test('random mode is deterministic and stays inside the chord', () => {
  const a = arpSequence(cMajor, 'random', 12, mulberry32(42));
  const b = arpSequence(cMajor, 'random', 12, mulberry32(42));

  expect(a).toEqual(b);

  for (const note of a) {
    expect(cMajor).toContain(note);
  }
});

test('arpSequence guards empty input and zero length', () => {
  expect(arpSequence([], 'up', 4, mulberry32(1))).toEqual([]);
  expect(arpSequence(cMajor, 'up', 0, mulberry32(1))).toEqual([]);
});

test('arpSequence is input-order independent', () => {
  expect(arpSequence([67, 60, 64], 'up', 3, mulberry32(1))).toEqual([60, 64, 67]);
});
