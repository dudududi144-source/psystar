import { test, expect } from 'bun:test';
import {
  VARIATION_SLOT_COUNT,
  createVariationSlots,
  captureSlot,
  loadSlot,
  clearSlot,
  filledSlotCount
} from '../src/domain/variation.ts';

const gridA = [
  [true, false, true, false],
  [false, true, false, true],
  [true, true, false, false],
  [false, false, true, true]
];

const gridB = [
  [false, false, false, false],
  [true, true, true, true],
  [false, false, false, false],
  [true, true, true, true]
];

test('createVariationSlots builds empty slots', () => {
  const store = createVariationSlots(VARIATION_SLOT_COUNT);

  expect(store.slots.length).toBe(4);
  expect(filledSlotCount(store)).toBe(0);
  expect(createVariationSlots(-2).slots.length).toBe(1);
});

test('capture and load roundtrip', () => {
  let store = createVariationSlots(4);
  store = captureSlot(store, 0, gridA);
  store = captureSlot(store, 2, gridB);

  expect(filledSlotCount(store)).toBe(2);
  expect(loadSlot(store, 0)).toEqual(gridA);
  expect(loadSlot(store, 2)).toEqual(gridB);
  expect(loadSlot(store, 1)).toBeNull();
});

test('capture does not mutate the source grid', () => {
  let store = createVariationSlots(4);
  const source = [[true, false], [false, true]];

  store = captureSlot(store, 0, source);
  source[0][0] = false;

  expect(loadSlot(store, 0)?.[0][0]).toBe(true);
});

test('capture and load guard out-of-range indexes', () => {
  let store = createVariationSlots(4);

  expect(captureSlot(store, 9, gridA)).toBe(store);
  expect(captureSlot(store, -1, gridA)).toBe(store);
  expect(loadSlot(store, 9)).toBeNull();
});

test('clearSlot empties only the chosen slot', () => {
  let store = createVariationSlots(4);
  store = captureSlot(store, 0, gridA);
  store = captureSlot(store, 1, gridB);
  store = clearSlot(store, 0);

  expect(loadSlot(store, 0)).toBeNull();
  expect(loadSlot(store, 1)).toEqual(gridB);
  expect(filledSlotCount(store)).toBe(1);
});
