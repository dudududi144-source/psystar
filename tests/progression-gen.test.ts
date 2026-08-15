import { test, expect } from 'bun:test';
import { DEGREE_FUNCTIONS, nextDegreeCandidates, generateProgression } from '../src/domain/progression-gen.ts';
import { mulberry32 } from './helpers.ts';

test('all seven degrees have a harmonic function', () => {
  for (let d = 1; d <= 7; d++) {
    expect(['T', 'SD', 'D']).toContain(DEGREE_FUNCTIONS[d]);
  }
});

test('nextDegreeCandidates follows functional harmony', () => {
  expect(nextDegreeCandidates(1)).toEqual([2, 4, 5, 6]);
  expect(nextDegreeCandidates(4)).toEqual([5, 7, 6]);
  expect(nextDegreeCandidates(5)).toEqual([1, 6]);
});

test('generateProgression starts on the tonic', () => {
  const prog = generateProgression(8, mulberry32(1));

  expect(prog[0]).toBe(1);
});

test('generateProgression honors length with minimum two', () => {
  expect(generateProgression(8, mulberry32(1)).length).toBe(8);
  expect(generateProgression(1, mulberry32(1)).length).toBe(2);
  expect(generateProgression(16, mulberry32(1)).length).toBe(16);
});

test('every degree stays diatonic', () => {
  const prog = generateProgression(64, mulberry32(5));

  for (const degree of prog) {
    expect(degree).toBeGreaterThanOrEqual(1);
    expect(degree).toBeLessThanOrEqual(7);
  }
});

test('every transition is functionally valid', () => {
  const prog = generateProgression(32, mulberry32(9));

  for (let i = 1; i < prog.length; i++) {
    const candidates = nextDegreeCandidates(prog[i - 1]);
    expect(candidates).toContain(prog[i]);
  }
});

test('generateProgression is deterministic for a seed', () => {
  const a = generateProgression(12, mulberry32(42));
  const b = generateProgression(12, mulberry32(42));

  expect(a).toEqual(b);
});

test('progressions close on a valid cadence', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const prog = generateProgression(8, mulberry32(seed));
    const closers = nextDegreeCandidates(prog[prog.length - 2]);

    expect(closers).toContain(prog[prog.length - 1]);
  }
});
