import { test, expect } from 'bun:test';
import {
  isValidPerformanceState,
  isValidSetlistEntry,
  encodeSetlistEntry,
  decodeSetlistEntry,
  setlistNames
} from '../src/domain/setlist.ts';

const state = {
  grid: [[true, false], [false, true], [true, true], [false, false]],
  velocity: [[1, 0.5], [0.7, 1], [1, 1], [0.5, 0.5]],
  accents: [[true, false], [false, false], [false, true], [false, false]],
  roll: [0, -1, 2, -1]
};

const entry = { name: 'סט ראשון', state: state };

test('isValidPerformanceState accepts a complete state', () => {
  expect(isValidPerformanceState(state)).toBe(true);
});

test('isValidPerformanceState rejects incomplete states', () => {
  expect(isValidPerformanceState(null as unknown as never)).toBe(false);
  expect(isValidPerformanceState({ ...state, grid: [] })).toBe(false);
  expect(isValidPerformanceState({ ...state, roll: null as unknown as never })).toBe(false);
});

test('isValidSetlistEntry validates name and state', () => {
  expect(isValidSetlistEntry(entry)).toBe(true);
  expect(isValidSetlistEntry({ ...entry, name: '' })).toBe(false);
});

test('encode/decode roundtrip', () => {
  const decoded = decodeSetlistEntry(encodeSetlistEntry(entry));

  expect(decoded).toEqual(entry);
});

test('decode rejects garbage', () => {
  expect(decodeSetlistEntry('not-json')).toBeNull();
  expect(decodeSetlistEntry(JSON.stringify({ name: 'x' }))).toBeNull();
});

test('setlistNames extracts names', () => {
  expect(setlistNames([entry, { name: 'סט שני', state: state }])).toEqual(['סט ראשון', 'סט שני']);
  expect(setlistNames([])).toEqual([]);
});
