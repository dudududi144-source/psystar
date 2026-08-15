import { test, expect } from 'bun:test';
import {
  createCcMap,
  isValidCc,
  addMapping,
  removeMapping,
  findTarget,
  scaleCc,
  MASTERING_CC_SPECS,
  isMasteringTarget
} from '../src/engine/midi-learn.ts';

test('isValidCc accepts the midi cc range only', () => {
  expect(isValidCc(0)).toBe(true);
  expect(isValidCc(127)).toBe(true);
  expect(isValidCc(-1)).toBe(false);
  expect(isValidCc(128)).toBe(false);
  expect(isValidCc(NaN)).toBe(false);
});

test('addMapping stores and findTarget retrieves', () => {
  let map = createCcMap();
  map = addMapping(map, 74, 'crush');

  expect(findTarget(map, 74)).toBe('crush');
  expect(findTarget(map, 71)).toBeNull();
});

test('addMapping replaces same cc and same target', () => {
  let map = createCcMap();
  map = addMapping(map, 74, 'crush');
  map = addMapping(map, 74, 'phaser');

  expect(map.mappings.length).toBe(1);
  expect(findTarget(map, 74)).toBe('phaser');

  map = addMapping(map, 71, 'phaser');

  expect(map.mappings.length).toBe(1);
  expect(findTarget(map, 71)).toBe('phaser');
  expect(findTarget(map, 74)).toBeNull();
});

test('addMapping guards invalid input', () => {
  let map = createCcMap();

  expect(addMapping(map, 200, 'crush')).toBe(map);
  expect(addMapping(map, 74, '')).toBe(map);
});

test('removeMapping removes only the chosen cc', () => {
  let map = createCcMap();
  map = addMapping(map, 74, 'crush');
  map = addMapping(map, 71, 'phaser');
  map = removeMapping(map, 74);

  expect(findTarget(map, 74)).toBeNull();
  expect(findTarget(map, 71)).toBe('phaser');
});

test('scaleCc maps 0-127 onto the target range', () => {
  expect(scaleCc(0, 60, 180)).toBeCloseTo(60, 6);
  expect(scaleCc(127, 60, 180)).toBeCloseTo(180, 6);
  // scaleCc floors cc values (real cc messages are integers): 63.5 -> 63
  expect(scaleCc(63.5, 0, 100)).toBeCloseTo((63 / 127) * 100, 6);
  expect(scaleCc(200, 0, 100)).toBeCloseTo(100, 6);
  // the range is direction-agnostic: lo..hi always maps 0..127
  expect(scaleCc(5, 100, 0)).toBeCloseTo((5 / 127) * 100, 6);
});


test('MASTERING_CC_SPECS exposes six mastering targets', () => {
  const names = Object.keys(MASTERING_CC_SPECS);

  expect(names.length).toBe(6);
  expect(names).toContain('masterDb');
  expect(names).toContain('eqHigh');
});

test('every mastering spec has a valid range', () => {
  for (const name of Object.keys(MASTERING_CC_SPECS)) {
    const spec = MASTERING_CC_SPECS[name];

    expect(spec.min).toBeLessThan(spec.max);
    expect(typeof spec.label).toBe('string');
  }
});

test('isMasteringTarget classifies targets', () => {
  expect(isMasteringTarget('masterDb')).toBe(true);
  expect(isMasteringTarget('eqLow')).toBe(true);
  expect(isMasteringTarget('bpm')).toBe(false);
  expect(isMasteringTarget('')).toBe(false);
});

test('scaleCc maps mastering ranges end to end', () => {
  expect(scaleCc(0, MASTERING_CC_SPECS.masterDb.min, MASTERING_CC_SPECS.masterDb.max)).toBe(-24);
  expect(scaleCc(127, MASTERING_CC_SPECS.masterDb.min, MASTERING_CC_SPECS.masterDb.max)).toBe(6);
});
