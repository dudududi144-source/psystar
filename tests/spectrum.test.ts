import { test, expect } from 'bun:test';
import { spectrumBars, smoothSpectrum } from '../src/ui/spectrum.ts';

test('spectrumBars normalizes bytes to 0..1', () => {
  const data = new Uint8Array([0, 128, 255, 64]);
  const bars = spectrumBars(data, 4, 0);

  expect(bars[0]).toBe(0);
  expect(bars[1]).toBeCloseTo(128 / 255, 6);
  expect(bars[2]).toBe(1);
  expect(bars[3]).toBeCloseTo(64 / 255, 6);
});

test('spectrumBars honors start bin and pads missing bins', () => {
  const data = new Uint8Array([255, 255, 255]);
  const bars = spectrumBars(data, 4, 2);

  expect(bars.length).toBe(4);
  expect(bars[0]).toBe(1);
  expect(bars[1]).toBe(0);
  expect(bars[2]).toBe(0);
  expect(bars[3]).toBe(0);
});

test('spectrumBars guards invalid sizes', () => {
  const data = new Uint8Array([100]);
  const bars = spectrumBars(data, 0, 0);

  expect(bars.length).toBe(1);
});

test('smoothSpectrum interpolates toward the next frame', () => {
  const smoothed = smoothSpectrum([0, 1], [1, 0], 0.5);

  expect(smoothed[0]).toBeCloseTo(0.5, 6);
  expect(smoothed[1]).toBeCloseTo(0.5, 6);
});

test('smoothSpectrum handles mismatched lengths', () => {
  const smoothed = smoothSpectrum([1], [0, 0, 0], 1);

  expect(smoothed.length).toBe(3);
  expect(smoothed[0]).toBeCloseTo(0, 6);
  expect(smoothed[1]).toBeCloseTo(0, 6);
});

test('smoothSpectrum clamps alpha', () => {
  const fast = smoothSpectrum([0], [1], 5);
  const frozen = smoothSpectrum([0], [1], -1);

  expect(fast[0]).toBeCloseTo(1, 6);
  expect(frozen[0]).toBeCloseTo(0, 6);
});
