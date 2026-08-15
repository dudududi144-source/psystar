import { test, expect } from 'bun:test';
import {
  dbToLinear,
  linearToDb,
  clampCompressorSettings,
  estimateMakeupGainDb
} from '../src/engine/mastering.ts';

test('dbToLinear converts standard values', () => {
  expect(dbToLinear(0)).toBeCloseTo(1, 6);
  expect(dbToLinear(-6)).toBeCloseTo(0.5012, 3);
  expect(dbToLinear(-20)).toBeCloseTo(0.1, 6);
  expect(dbToLinear(6)).toBeCloseTo(1.9953, 3);
});

test('dbToLinear clamps extremes and guards NaN', () => {
  expect(dbToLinear(-100)).toBeCloseTo(dbToLinear(-60), 9);
  expect(dbToLinear(100)).toBeCloseTo(dbToLinear(12), 9);
  expect(dbToLinear(NaN)).toBe(1);
});

test('linearToDb roundtrips with dbToLinear', () => {
  for (const db of [-24, -12, -6, 0, 3]) {
    expect(linearToDb(dbToLinear(db))).toBeCloseTo(db, 6);
  }
});

test('linearToDb guards zero', () => {
  expect(isFinite(linearToDb(0))).toBe(true);
});

test('clampCompressorSettings clamps every field', () => {
  const clamped = clampCompressorSettings({
    thresholdDb: -999,
    ratio: 999,
    attackSec: 0,
    releaseSec: 99
  });

  expect(clamped.thresholdDb).toBe(-60);
  expect(clamped.ratio).toBe(20);
  expect(clamped.attackSec).toBe(0.001);
  expect(clamped.releaseSec).toBe(2);
});

test('estimateMakeupGainDb behaves musically', () => {
  expect(estimateMakeupGainDb(0, 4)).toBe(0);
  expect(estimateMakeupGainDb(-12, 1)).toBe(0);
  expect(estimateMakeupGainDb(-12, 4)).toBeCloseTo(5.4, 6);
  expect(estimateMakeupGainDb(-24, 4)).toBeGreaterThan(estimateMakeupGainDb(-12, 4));
  expect(estimateMakeupGainDb(-12, 8)).toBeGreaterThan(estimateMakeupGainDb(-12, 4));
});
