import { test, expect } from 'bun:test';
import { tapsToBpm, recordTap, TAP_RESET_MS } from '../src/engine/tap-tempo.ts';

test('tapsToBpm computes 120 bpm from 500ms intervals', () => {
  const taps = [0, 500, 1000, 1500];

  expect(tapsToBpm(taps)).toBe(120);
});

test('tapsToBpm returns null for too few taps', () => {
  expect(tapsToBpm([])).toBeNull();
  expect(tapsToBpm([100])).toBeNull();
});

test('tapsToBpm clamps into valid range', () => {
  const fast = tapsToBpm([0, 100, 200, 300]);
  const slow = tapsToBpm([0, 5000, 10000]);

  expect(fast).toBe(180);
  expect(slow).toBeNull();
});

test('recordTap starts fresh after long gap', () => {
  let taps = recordTap([], 1000);
  taps = recordTap(taps, 1500);

  expect(taps.length).toBe(2);

  const fresh = recordTap(taps, 1500 + TAP_RESET_MS + 100);

  expect(fresh.length).toBe(1);
});

test('recordTap keeps only the last taps', () => {
  let taps: number[] = [];
  for (let i = 0; i < 20; i++) {
    taps = recordTap(taps, i * 500);
  }

  expect(taps.length).toBeLessThanOrEqual(8);
});
