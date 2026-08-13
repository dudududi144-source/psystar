import { test, expect } from 'bun:test';
import { createPattern, stepAt } from '../src/domain/pattern.ts';
import { createTransport, advanceTransport, startTransport, stopTransport } from '../src/domain/transport.ts';

test('pattern wraps forward', () => {
  const pattern = createPattern([
    { active: true, velocity: 1 },
    { active: false, velocity: 0 }
  ]);

  expect(stepAt(pattern, 2).active).toBe(true);
});

test('pattern wraps backward safely', () => {
  const pattern = createPattern([
    { active: true, velocity: 1 },
    { active: false, velocity: 0 }
  ]);

  expect(stepAt(pattern, -1).active).toBe(false);
});

test('pattern handles empty safely', () => {
  const pattern = createPattern([]);
  const step = stepAt(pattern, 3);

  expect(step.active).toBe(false);
  expect(step.velocity).toBe(0);
});

test('transport starts, advances and stops', () => {
  let state = createTransport(122);
  state = startTransport(state);
  state = advanceTransport(state);

  expect(state.running).toBe(true);
  expect(state.currentStep).toBe(1);

  state = stopTransport(state);
  expect(state.running).toBe(false);
});
