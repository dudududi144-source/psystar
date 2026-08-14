import { test, expect } from 'bun:test';
import { chooseAction } from '../src/engine/autopilot.ts';
import { mulberry32 } from './helpers.ts';

test('chooseAction is deterministic for a seeded stream', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);

  for (let i = 0; i < 20; i++) {
    const da = chooseAction(a);
    const db = chooseAction(b);

    expect(da.action).toBe(db.action);
  }
});

test('chooseAction covers all five actions over many rolls', () => {
  const random = mulberry32(7);
  const seen = new Set<string>();

  for (let i = 0; i < 2000; i++) {
    seen.add(chooseAction(random).action);
  }

  expect(seen.has('mutate')).toBe(true);
  expect(seen.has('groove')).toBe(true);
  expect(seen.has('scene')).toBe(true);
  expect(seen.has('progression')).toBe(true);
  expect(seen.has('rest')).toBe(true);
});

test('mutate strength stays gentle', () => {
  const random = mulberry32(11);

  for (let i = 0; i < 2000; i++) {
    const decision = chooseAction(random);

    if (decision.action === 'mutate') {
      expect(decision.strength).toBeGreaterThanOrEqual(0.05);
      expect(decision.strength).toBeLessThanOrEqual(0.15);
    }

    if (decision.action === 'rest') {
      expect(decision.strength).toBe(0);
    }
  }
});
