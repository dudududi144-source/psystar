import { test, expect } from 'bun:test';
import { sustainDuration, sustainOverlap, shouldSustain } from '../src/domain/legato.ts';

test('sustainDuration with zero amount equals the bar', () => {
  expect(sustainDuration(2, 0)).toBe(2);
});

test('sustainDuration scales with amount', () => {
  expect(sustainDuration(2, 1)).toBe(4);
  expect(sustainDuration(2, 0.5)).toBe(3);
});

test('sustainDuration clamps amount and guards duration', () => {
  expect(sustainDuration(2, 5)).toBe(4);
  expect(sustainDuration(2, -1)).toBe(2);
  expect(sustainDuration(0, 1)).toBe(0);
  expect(sustainDuration(-1, 1)).toBe(0);
});

test('sustainOverlap returns the bleed into the next bar', () => {
  expect(sustainOverlap(2, 0)).toBe(0);
  expect(sustainOverlap(2, 1)).toBe(2);
  expect(sustainOverlap(2, 0.5)).toBe(1);
});

test('shouldSustain detects positive sustain', () => {
  expect(shouldSustain(0)).toBe(false);
  expect(shouldSustain(0.5)).toBe(true);
  expect(shouldSustain(-0.1)).toBe(false);
});
