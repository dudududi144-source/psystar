import { test, expect } from 'bun:test';
import {
  METER_DB_FLOOR,
  dbFromPeak,
  dbFromRms,
  normalizeDbToMeter,
  gainReductionDb
} from '../src/engine/metering.ts';

test('dbFromPeak converts amplitude to db', () => {
  expect(dbFromPeak(1)).toBeCloseTo(0, 6);
  expect(dbFromPeak(0.5)).toBeCloseTo(-6.02, 1);
  expect(dbFromPeak(0.1)).toBeCloseTo(-20, 6);
});

test('dbFromPeak guards silence and clamps', () => {
  expect(dbFromPeak(0)).toBe(METER_DB_FLOOR);
  expect(dbFromPeak(-0.5)).toBeCloseTo(-6.02, 1);
  expect(dbFromPeak(100)).toBeCloseTo(6, 6);
});

test('dbFromRms computes rms energy', () => {
  const samples = [0.5, -0.5, 0.5, -0.5];

  expect(dbFromRms(samples)).toBeCloseTo(-6.02, 1);
  expect(dbFromRms([])).toBe(METER_DB_FLOOR);
});

test('normalizeDbToMeter maps the full range into 0..1', () => {
  expect(normalizeDbToMeter(-60)).toBe(0);
  expect(normalizeDbToMeter(6)).toBe(1);
  expect(normalizeDbToMeter(-27)).toBeCloseTo(0.5, 6);
  expect(normalizeDbToMeter(-999)).toBe(0);
  expect(normalizeDbToMeter(999)).toBe(1);
});

test('gainReductionDb is zero below threshold', () => {
  expect(gainReductionDb(-20, -14, 4)).toBe(0);
});

test('gainReductionDb compresses above threshold', () => {
  const reduction = gainReductionDb(-8, -14, 4);

  expect(reduction).toBeCloseTo(6 * 0.75, 6);
});

test('gainReductionDb clamps ratio and grows with input', () => {
  expect(gainReductionDb(-2, -14, 100)).toBeCloseTo(12 * (1 - 1 / 20), 6);
  expect(gainReductionDb(-4, -14, 4)).toBeGreaterThan(gainReductionDb(-8, -14, 4));
});
