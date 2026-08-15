import { test, expect } from 'bun:test';
import {
  EQ_GAIN_MIN,
  EQ_GAIN_MAX,
  clampEqGain,
  defaultEqSettings,
  clampEqSettings,
  eqDeltaDb
} from '../src/engine/eq.ts';

test('clampEqGain clamps into the gain range', () => {
  expect(clampEqGain(0)).toBe(0);
  expect(clampEqGain(99)).toBe(EQ_GAIN_MAX);
  expect(clampEqGain(-99)).toBe(EQ_GAIN_MIN);
});

test('clampEqGain guards NaN', () => {
  expect(clampEqGain(NaN)).toBe(0);
});

test('defaultEqSettings is flat', () => {
  const settings = defaultEqSettings();

  expect(settings.lowDb).toBe(0);
  expect(settings.midDb).toBe(0);
  expect(settings.highDb).toBe(0);
  expect(settings.midFreqHz).toBe(1000);
});

test('clampEqSettings clamps every band and the mid frequency', () => {
  const clamped = clampEqSettings({
    lowDb: 99,
    midDb: -99,
    highDb: 0,
    midFreqHz: 99999
  });

  expect(clamped.lowDb).toBe(EQ_GAIN_MAX);
  expect(clamped.midDb).toBe(EQ_GAIN_MIN);
  expect(clamped.midFreqHz).toBe(4000);
});

test('eqDeltaDb measures total deviation from flat', () => {
  expect(eqDeltaDb(defaultEqSettings())).toBe(0);
  expect(eqDeltaDb({ lowDb: 3, midDb: -4, highDb: 2, midFreqHz: 1000 })).toBe(9);
});
