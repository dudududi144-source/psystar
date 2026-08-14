import { test, expect } from 'bun:test';
import { voiceChordNotes } from '../src/domain/voicing.ts';

const cMajor = [60, 64, 67];

test('closed voicing sorts ascending and keeps notes', () => {
  expect(voiceChordNotes([67, 60, 64], 'closed')).toEqual([60, 64, 67]);
});

test('first inversion lifts the bottom note an octave', () => {
  expect(voiceChordNotes(cMajor, 'first')).toEqual([64, 67, 72]);
});

test('second inversion lifts the two bottom notes', () => {
  expect(voiceChordNotes(cMajor, 'second')).toEqual([67, 72, 76]);
});

test('open voicing spreads odd voices up an octave', () => {
  expect(voiceChordNotes([60, 64, 67, 71], 'open')).toEqual([60, 76, 67, 83]);
});

test('voicing guards empty and tiny chords', () => {
  expect(voiceChordNotes([], 'open')).toEqual([]);
  expect(voiceChordNotes([60], 'second')).toEqual([60]);
});

test('voicing is input-order independent', () => {
  expect(voiceChordNotes([67, 60, 64], 'first')).toEqual(voiceChordNotes([60, 64, 67], 'first'));
});
