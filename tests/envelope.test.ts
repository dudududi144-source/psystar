import { test, expect } from 'bun:test';
import { createEnvelope, envelopeValueAt } from '../src/engine/envelope.ts';

test('envelope clamps params into valid range', () => {
  const env = createEnvelope(-1, 2, 3, -0.5);

  expect(env.attack).toBe(0);
  expect(env.sustain).toBe(1);
  expect(env.release).toBe(0);
});

test('envelope rises through attack', () => {
  const env = createEnvelope(0.1, 0.1, 0.5, 0.2);

  expect(envelopeValueAt(env, 0, 0.5)).toBeCloseTo(0, 6);
  expect(envelopeValueAt(env, 0.05, 0.5)).toBeCloseTo(0.5, 6);
  expect(envelopeValueAt(env, 0.1, 0.5)).toBeCloseTo(1, 6);
});

test('envelope decays to sustain then releases', () => {
  const env = createEnvelope(0.1, 0.1, 0.5, 0.2);

  expect(envelopeValueAt(env, 0.15, 0.5)).toBeCloseTo(0.75, 6);
  expect(envelopeValueAt(env, 0.3, 0.5)).toBeCloseTo(0.5, 6);
  expect(envelopeValueAt(env, 0.6, 0.5)).toBeCloseTo(0.25, 6);
  expect(envelopeValueAt(env, 1.0, 0.5)).toBeCloseTo(0, 6);
});
