import { test, expect } from 'bun:test';
import { secondsPerStep, applySwing, collectWindow } from '../src/engine/lookahead-scheduler.ts';

test('secondsPerStep computes sixteenth at 120 bpm', () => {
  expect(secondsPerStep(120, 4)).toBeCloseTo(0.125, 6);
});

test('secondsPerStep guards invalid input', () => {
  expect(secondsPerStep(0, 4)).toBeCloseTo(0.125, 6);
  expect(secondsPerStep(120, 0)).toBeCloseTo(0.125, 6);
});

test('collectWindow schedules steps within horizon', () => {
  const win = collectWindow(0, 0, 0.3, 0.125, 16, 0);

  expect(win.due.length).toBe(3);
  expect(win.due[0].step).toBe(0);
  expect(win.due[1].step).toBe(1);
  expect(win.due[2].step).toBe(2);
  expect(win.nextStep).toBe(3);
  expect(win.nextStepTime).toBeCloseTo(0.375, 6);
});

test('collectWindow wraps around pattern length', () => {
  const win = collectWindow(15, 0, 0.3, 0.125, 16, 0);

  expect(win.due[0].step).toBe(15);
  expect(win.due[1].step).toBe(0);
  expect(win.nextStep).toBe(2);
});

test('applySwing offsets only odd steps', () => {
  const even = applySwing(1.0, 2, 0.5, 0.125);
  const odd = applySwing(1.0, 3, 0.5, 0.125);

  expect(even).toBeCloseTo(1.0, 6);
  expect(odd).toBeCloseTo(1.0 + 0.5 * 0.125 * 0.5, 6);
});
