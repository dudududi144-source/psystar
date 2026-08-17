import { test, expect } from 'bun:test';
import {
  gridDensity,
  energyCurve,
  syncopationScore,
  analyzeGrid,
  analyzeMelody
} from '../src/domain/analysis.ts';

const empty = [
  [false, false, false, false],
  [false, false, false, false]
];

const full = [
  [true, true, true, true],
  [true, true, true, true]
];

test('gridDensity computes active fraction', () => {
  expect(gridDensity(empty)).toBe(0);
  expect(gridDensity(full)).toBe(1);
  expect(gridDensity([[true, false], [false, false]])).toBeCloseTo(0.25, 6);
});

test('energyCurve returns one value per step', () => {
  const curve = energyCurve([[true, false, true, false]]);

  expect(curve.length).toBe(4);
  expect(curve[0]).toBe(1);
  expect(curve[1]).toBe(0);
});

test('syncopationScore rewards off-beat activity', () => {
  const onBeat = [[true, false, false, false, true, false, false, false]];
  const offBeat = [[false, false, true, false, false, false, true, false]];
  const weak = [[false, true, false, false, false, true, false, false]];

  expect(syncopationScore(onBeat)).toBe(0);
  expect(syncopationScore(offBeat)).toBeCloseTo(0.5, 6);
  expect(syncopationScore(weak)).toBe(1);
});

test('analyzeGrid composes the analysis', () => {
  const analysis = analyzeGrid([[true, false, false, false]]);

  expect(analysis.density).toBeCloseTo(0.25, 6);
  expect(analysis.energyCurve.length).toBe(4);
  expect(analysis.activeSteps).toBe(1);
});

test('analyzeMelody counts notes and range', () => {
  const analysis = analyzeMelody([0, 2, 4, -1, 6]);

  expect(analysis.noteCount).toBe(4);
  expect(analysis.range).toBe(6);
});

test('analyzeMelody detects ascending contour', () => {
  expect(analyzeMelody([0, 1, 2, 3]).contour).toBe('ascending');
});

test('analyzeMelody detects descending contour', () => {
  expect(analyzeMelody([5, 4, 3, 2]).contour).toBe('descending');
});

test('analyzeMelody detects arch contour', () => {
  expect(analyzeMelody([0, 2, 4, 2, 0]).contour).toBe('arch');
});

test('analyzeMelody detects wave contour', () => {
  expect(analyzeMelody([0, 2, 0, 2, 0]).contour).toBe('wave');
});

test('analyzeMelody handles static and empty', () => {
  expect(analyzeMelody([3, 3, 3]).contour).toBe('static');
  expect(analyzeMelody([-1, -1]).noteCount).toBe(0);
  expect(analyzeMelody([]).contour).toBe('static');
});
