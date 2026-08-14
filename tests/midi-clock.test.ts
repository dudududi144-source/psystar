import { test, expect } from 'bun:test';
import {
  MIDI_CLOCK_PPQ,
  MIDI_CLOCK_BYTE,
  MIDI_START_BYTE,
  MIDI_STOP_BYTE,
  clockIntervalMs,
  pulsesPerStep,
  clockOffsetsForStep,
  songPositionBytes
} from '../src/engine/midi-clock.ts';

test('clock interval at 120 bpm is 24 ppq timing', () => {
  expect(clockIntervalMs(120)).toBeCloseTo(60000 / 120 / 24, 6);
  expect(clockIntervalMs(0)).toBe(0);
  expect(clockIntervalMs(-5)).toBe(0);
});

test('pulses per sixteenth step at 24 ppq is six', () => {
  expect(pulsesPerStep(4)).toBe(6);
  expect(pulsesPerStep(0)).toBe(0);
});

test('clock offsets divide the step evenly', () => {
  const offsets = clockOffsetsForStep(120, 4);

  expect(offsets.length).toBe(6);
  expect(offsets[0]).toBe(0);

  for (let i = 1; i < offsets.length; i++) {
    expect(offsets[i] - offsets[i - 1]).toBeCloseTo(20, 6);
  }

  expect(offsets[offsets.length - 1]).toBeLessThan(120);
});

test('clock offsets guard invalid input', () => {
  expect(clockOffsetsForStep(0, 4)).toEqual([]);
  expect(clockOffsetsForStep(120, 0)).toEqual([]);
});

test('song position pointer encodes steps as midi beats', () => {
  expect(songPositionBytes(0)).toEqual([0xf2, 0, 0]);
  expect(songPositionBytes(100)).toEqual([0xf2, 100, 0]);
  expect(songPositionBytes(200)).toEqual([0xf2, 200 & 0x7f, 1]);
  expect(songPositionBytes(-3)).toEqual([0xf2, 0, 0]);
});

test('protocol bytes match the midi spec', () => {
  expect(MIDI_CLOCK_BYTE).toBe(0xf8);
  expect(MIDI_START_BYTE).toBe(0xfa);
  expect(MIDI_STOP_BYTE).toBe(0xfc);
  expect(MIDI_CLOCK_PPQ).toBe(24);
});
