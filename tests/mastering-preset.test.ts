import { test, expect } from 'bun:test';
import {
  isValidMasteringPreset,
  encodeMasteringPreset,
  decodeMasteringPreset,
  defaultMasteringPresets
} from '../src/domain/mastering-preset.ts';

const preset = {
  name: 'בדיקה',
  masterDb: -2,
  eqLowDb: 3,
  eqMidDb: -1,
  eqHighDb: 2,
  compThreshold: -14,
  compRatio: 8
};

test('isValidMasteringPreset accepts a complete preset', () => {
  expect(isValidMasteringPreset(preset)).toBe(true);
});

test('isValidMasteringPreset rejects incomplete presets', () => {
  expect(isValidMasteringPreset(null as unknown as never)).toBe(false);
  expect(isValidMasteringPreset({ ...preset, name: '' })).toBe(false);
  expect(isValidMasteringPreset({ ...preset, masterDb: NaN })).toBe(false);
});

test('encode/decode roundtrip', () => {
  const decoded = decodeMasteringPreset(encodeMasteringPreset(preset));

  expect(decoded).toEqual(preset);
});

test('decode rejects garbage', () => {
  expect(decodeMasteringPreset('not-json')).toBeNull();
  expect(decodeMasteringPreset(JSON.stringify({ name: 'x' }))).toBeNull();
});

test('default presets are all valid', () => {
  const defaults = defaultMasteringPresets();

  expect(defaults.length).toBeGreaterThanOrEqual(5);

  for (const p of defaults) {
    expect(isValidMasteringPreset(p)).toBe(true);
  }
});
