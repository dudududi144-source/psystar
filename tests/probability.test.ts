import { test, expect } from 'bun:test';
import { PROBABILITY_TIERS, nextProbabilityTier, shouldFire, loopSeed } from '../src/domain/probability.ts';
import { mulberry32 } from './helpers.ts';

test('nextProbabilityTier cycles through all tiers', () => {
  expect(nextProbabilityTier(1.0)).toBe(0.75);
  expect(nextProbabilityTier(0.75)).toBe(0.5);
  expect(nextProbabilityTier(0.5)).toBe(0.25);
  expect(nextProbabilityTier(0.25)).toBe(1.0);
});

test('nextProbabilityTier resets unknown values to full', () => {
  expect(nextProbabilityTier(0.33)).toBe(1.0);
});

test('shouldFire honors absolute probabilities', () => {
  const random = mulberry32(3);

  for (let i = 0; i < 100; i++) {
    expect(shouldFire(1.0, random)).toBe(true);
    expect(shouldFire(0.0, random)).toBe(false);
    expect(shouldFire(1.5, random)).toBe(true);
    expect(shouldFire(-1, random)).toBe(false);
  }
});

test('shouldFire lands near the expected rate', () => {
  const random = mulberry32(42);
  let fired = 0;

  for (let i = 0; i < 4000; i++) {
    if (shouldFire(0.5, random)) fired++;
  }

  const rate = fired / 4000;

  expect(rate).toBeGreaterThan(0.45);
  expect(rate).toBeLessThan(0.55);
});

test('loopSeed is deterministic and loop-unique', () => {
  expect(loopSeed(0, 7)).toBe(loopSeed(0, 7));
  expect(loopSeed(1, 7)).toBe(loopSeed(1, 7));
  expect(loopSeed(0, 7)).not.toBe(loopSeed(1, 7));
  expect(loopSeed(-2, 7)).toBe(loopSeed(0, 7));
});
