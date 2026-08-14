import { test, expect } from 'bun:test';
import {
  METRONOME_DOWNBEAT_HZ,
  METRONOME_BEAT_HZ,
  clickFrequency,
  countInSteps,
  isClickStep
} from '../src/engine/metronome.ts';

test('click frequency marks the downbeat', () => {
  expect(clickFrequency(0, 16)).toBe(METRONOME_DOWNBEAT_HZ);
  expect(clickFrequency(16, 16)).toBe(METRONOME_DOWNBEAT_HZ);
  expect(clickFrequency(4, 16)).toBe(METRONOME_BEAT_HZ);
  expect(clickFrequency(7, 16)).toBe(METRONOME_BEAT_HZ);
});

test('click frequency guards invalid bars', () => {
  expect(clickFrequency(0, 0)).toBe(METRONOME_DOWNBEAT_HZ);
  expect(clickFrequency(-2, 16)).toBe(METRONOME_DOWNBEAT_HZ);
});

test('countInSteps multiplies bars by steps', () => {
  expect(countInSteps(1, 16)).toBe(16);
  expect(countInSteps(2, 16)).toBe(32);
  expect(countInSteps(0, 16)).toBe(0);
  expect(countInSteps(-3, 16)).toBe(0);
});

test('isClickStep honors the click rate', () => {
  expect(isClickStep(0, 4)).toBe(true);
  expect(isClickStep(4, 4)).toBe(true);
  expect(isClickStep(5, 4)).toBe(false);
  expect(isClickStep(3, 0)).toBe(true);
});
