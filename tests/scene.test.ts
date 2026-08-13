import { test, expect } from 'bun:test';
import { builtInScenes, isValidScene, ROW_COUNT, STEP_COUNT } from '../src/domain/scene.ts';

test('all built-in scenes are structurally valid', () => {
  expect(builtInScenes.length).toBe(4);

  for (const scene of builtInScenes) {
    expect(isValidScene(scene)).toBe(true);
  }
});

test('scene rows match canonical grid size', () => {
  for (const scene of builtInScenes) {
    expect(scene.rows.length).toBe(ROW_COUNT);

    for (const row of scene.rows) {
      expect(row.length).toBe(STEP_COUNT);
    }
  }
});

test('isValidScene rejects malformed scenes', () => {
  expect(isValidScene(null as unknown as never)).toBe(false);
  expect(isValidScene({ name: 'x', rows: [] })).toBe(false);
  expect(isValidScene({ name: 'x', rows: [[true]] } as never)).toBe(false);
});
