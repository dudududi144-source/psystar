import { test, expect } from 'bun:test';
import {
  MIDI_ROWS_CHANNEL,
  MIDI_MELODY_CHANNEL,
  MIDI_CHORD_CHANNEL,
  degreeToMidi,
  noteOnFor,
  noteOffFor
} from '../src/engine/midi-melody.ts';

const MAJOR = [0, 2, 4, 5, 7, 9, 11];

test('channels are distinct', () => {
  const channels = [MIDI_ROWS_CHANNEL, MIDI_MELODY_CHANNEL, MIDI_CHORD_CHANNEL];

  expect(new Set(channels).size).toBe(3);
});

test('degreeToMidi maps scale degrees onto the key', () => {
  expect(degreeToMidi(0, MAJOR, 60)).toBe(60);
  expect(degreeToMidi(2, MAJOR, 60)).toBe(64);
  expect(degreeToMidi(4, MAJOR, 60)).toBe(67);
});

test('degreeToMidi guards invalid degrees', () => {
  expect(degreeToMidi(-1, MAJOR, 60)).toBeNull();
  expect(degreeToMidi(9, MAJOR, 60)).toBeNull();
  expect(degreeToMidi(0, [], 60)).toBeNull();
});

test('degreeToMidi clamps into midi range', () => {
  expect(degreeToMidi(0, MAJOR, 126)).toBe(126);
  expect(degreeToMidi(1, MAJOR, 126)).toBe(127);
});

test('noteOnFor builds status byte per channel with velocity clamp', () => {
  expect(noteOnFor(1, 60, 100)).toEqual([0x91, 60, 100]);
  expect(noteOnFor(2, 64, 200)).toEqual([0x92, 64, 127]);
  expect(noteOnFor(0, 48, 0)).toEqual([0x90, 48, 1]);
});

test('noteOffFor builds note-off bytes', () => {
  expect(noteOffFor(1, 60)).toEqual([0x81, 60, 0x40]);
  expect(noteOffFor(15, 0)).toEqual([0x8f, 0, 0x40]);
});
