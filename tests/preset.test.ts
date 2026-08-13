import { test, expect } from 'bun:test';
import { createDefaultParams, isValidPreset, morphPresets, builtInPresets } from '../src/domain/preset.ts';

test('default params are valid baseline', () => {
  const params = createDefaultParams();

  expect(params.bpm).toBe(122);
  expect(params.swing).toBe(0);
});

test('all built-in presets are structurally valid', () => {
  const presets = builtInPresets();

  expect(presets.length).toBe(4);

  for (const preset of presets) {
    expect(isValidPreset(preset)).toBe(true);
  }
});

test('isValidPreset rejects malformed data', () => {
  expect(isValidPreset(null as unknown as never)).toBe(false);
  expect(isValidPreset({ name: 'x', rows: [], params: createDefaultParams() })).toBe(false);
});

test('morphPresets at edges returns endpoints', () => {
  const presets = builtInPresets();
  const a = presets[0];
  const b = presets[1];

  const atZero = morphPresets(a, b, 0);
  const atOne = morphPresets(a, b, 1);

  expect(atZero.params.bpm).toBe(a.params.bpm);
  expect(atZero.rows[0]).toEqual(a.rows[0]);
  expect(atOne.params.bpm).toBe(b.params.bpm);
  expect(atOne.rows[0]).toEqual(b.rows[0]);
});

test('morphPresets clamps t into range', () => {
  const presets = builtInPresets();
  const a = presets[0];
  const b = presets[3];

  const clamped = morphPresets(a, b, 5);

  expect(clamped.params.bpm).toBe(b.params.bpm);
});

test('morphPresets blends bpm at midpoint', () => {
  const presets = builtInPresets();
  const mid = morphPresets(presets[0], presets[1], 0.5);

  expect(mid.params.bpm).toBe(Math.round((presets[0].params.bpm + presets[1].params.bpm) / 2));
});
