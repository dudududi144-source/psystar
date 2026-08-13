import { test, expect } from 'bun:test';
import { mulberry32, jitterVelocity, driftTime, shouldSkip } from '../src/engine/humanizer.ts';

test('mulberry32 is deterministic for same seed', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);

  for (let i = 0; i < 10; i++) {
    expect(a()).toBe(b());
  }
});

test('mulberry32 stays inside 0..1', () => {
  const random = mulberry32(7);

  for (let i = 0; i < 1000; i++) {
    const value = random();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  }
});

test('jitterVelocity stays within musical bounds', () => {
  const random = mulberry32(99);

  for (let i = 0; i < 500; i++) {
    const value = jitterVelocity(1.0, 1.0, random);
    expect(value).toBeGreaterThanOrEqual(0.2);
    expect(value).toBeLessThanOrEqual(1.6);
  }
});

test('jitterVelocity with zero amount returns original', () => {
  const random = mulberry32(5);

  expect(jitterVelocity(0.8, 0, random)).toBeCloseTo(0.8, 6);
});

test('driftTime bounded by plus-minus 18ms', () => {
  const random = mulberry32(11);

  for (let i = 0; i < 500; i++) {
    const value = driftTime(1.0, random);
    expect(Math.abs(value)).toBeLessThanOrEqual(0.018);
  }
});

test('shouldSkip never skips bass', () => {
  const random = mulberry32(3);

  for (let i = 0; i < 200; i++) {
    expect(shouldSkip(0, 1.0, random)).toBe(false);
  }
});

test('shouldSkip is off below half humanity', () => {
  const random = mulberry32(3);

  expect(shouldSkip(2, 0.4, random)).toBe(false);
  expect(shouldSkip(3, 0.5, random)).toBe(false);
});
