import { test, expect } from 'bun:test';
import { spectrumToWaterfallRow, waterfallColor, rowBrightness } from '../src/ui/waterfall.ts';

test('spectrumToWaterfallRow normalizes bytes to 0..1', () => {
  const data = new Uint8Array([0, 0, 255, 128]);
  const row = spectrumToWaterfallRow(data, 3, 1);

  expect(row.length).toBe(3);
  expect(row[0]).toBe(0);
  expect(row[1]).toBe(1);
  expect(row[2]).toBeCloseTo(128 / 255, 6);
});

test('spectrumToWaterfallRow pads missing bins', () => {
  const data = new Uint8Array([255]);
  const row = spectrumToWaterfallRow(data, 4, 0);

  expect(row).toEqual([1, 0, 0, 0]);
});

test('waterfallColor is black for silence', () => {
  expect(waterfallColor(0)).toEqual([5, 2, 15]);
  expect(waterfallColor(0.01)).toEqual([5, 2, 15]);
});

test('waterfallColor is white-hot for peaks', () => {
  expect(waterfallColor(1)).toEqual([255, 255, 255]);
});

test('waterfallColor clamps and brightens monotonically', () => {
  expect(waterfallColor(-1)).toEqual([5, 2, 15]);
  expect(waterfallColor(5)).toEqual([255, 255, 255]);

  const levels = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0];
  let lastSum = -1;

  for (const level of levels) {
    const rgb = waterfallColor(level);
    const sum = rgb[0] + rgb[1] + rgb[2];

    expect(sum).toBeGreaterThan(lastSum);
    lastSum = sum;
  }
});

test('rowBrightness averages the row', () => {
  expect(rowBrightness([1, 1, 1, 1])).toBe(1);
  expect(rowBrightness([0, 0, 0, 0])).toBe(0);
  expect(rowBrightness([1, 0, 1, 0])).toBeCloseTo(0.5, 6);
  expect(rowBrightness([])).toBe(0);
});
