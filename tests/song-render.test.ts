import { test, expect } from 'bun:test';
import { buildRenderSegments, totalSegmentSteps, gridAtStep } from '../src/engine/song-render.ts';

const sceneA = [[true, false], [false, true]];
const sceneB = [[false, false], [true, true]];

test('buildRenderSegments maps scene indexes to grids', () => {
  const segments = buildRenderSegments(
    [{ sceneIndex: 0, bars: 2 }, { sceneIndex: 1, bars: 1 }],
    [sceneA, sceneB]
  );

  expect(segments.length).toBe(2);
  expect(segments[0].grid).toEqual(sceneA);
  expect(segments[1].grid).toEqual(sceneB);
});

test('buildRenderSegments skips invalid scene indexes', () => {
  const segments = buildRenderSegments(
    [{ sceneIndex: 0, bars: 1 }, { sceneIndex: 9, bars: 1 }],
    [sceneA]
  );

  expect(segments.length).toBe(1);
});

test('buildRenderSegments floors bars and keeps minimum one', () => {
  const segments = buildRenderSegments(
    [{ sceneIndex: 0, bars: 2.9 }, { sceneIndex: 0, bars: 0 }],
    [sceneA]
  );

  expect(segments[0].bars).toBe(2);
  expect(segments[1].bars).toBe(1);
});

test('totalSegmentSteps sums bars times sixteen', () => {
  const segments = buildRenderSegments(
    [{ sceneIndex: 0, bars: 2 }, { sceneIndex: 1, bars: 3 }],
    [sceneA, sceneB]
  );

  expect(totalSegmentSteps(segments)).toBe(80);
  expect(totalSegmentSteps([])).toBe(0);
});

test('gridAtStep resolves across segment boundaries', () => {
  const segments = buildRenderSegments(
    [{ sceneIndex: 0, bars: 1 }, { sceneIndex: 1, bars: 1 }],
    [sceneA, sceneB]
  );

  expect(gridAtStep(segments, 0)).toEqual(sceneA);
  expect(gridAtStep(segments, 15)).toEqual(sceneA);
  expect(gridAtStep(segments, 16)).toEqual(sceneB);
  expect(gridAtStep(segments, 31)).toEqual(sceneB);
});

test('gridAtStep returns null past the end and for empty input', () => {
  const segments = buildRenderSegments([{ sceneIndex: 0, bars: 1 }], [sceneA]);

  expect(gridAtStep(segments, 16)).toBeNull();
  expect(gridAtStep([], 0)).toBeNull();
});
