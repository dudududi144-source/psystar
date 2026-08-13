import { test, expect } from 'bun:test';
import { createDefaultRack, getEffect, setEffectParam, setEffectEnabled, activeEffects } from '../src/engine/effects-rack.ts';

test('default rack has six stages', () => {
  const rack = createDefaultRack();

  expect(rack.length).toBe(6);
  expect(getEffect(rack, 'limiter')).not.toBeNull();
});

test('setEffectParam is immutable and updates value', () => {
  const rack = createDefaultRack();
  const next = setEffectParam(rack, 'filter', 'cutoff', 4000);

  expect(getEffect(next, 'filter')?.params.cutoff).toBe(4000);
  expect(getEffect(rack, 'filter')?.params.cutoff).toBe(1100);
});

test('setEffectEnabled toggles and activeEffects filters', () => {
  let rack = createDefaultRack();
  rack = setEffectEnabled(rack, 'phaser', true);

  expect(getEffect(rack, 'phaser')?.enabled).toBe(true);
  expect(activeEffects(rack).length).toBe(activeEffects(createDefaultRack()).length + 1);
});
