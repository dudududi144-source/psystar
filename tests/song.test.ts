import { test, expect } from 'bun:test';
import { createSong, totalBars, sceneAtBar } from '../src/domain/song.ts';

test('totalBars sums step bars', () => {
  const song = createSong([
    { sceneIndex: 0, bars: 2 },
    { sceneIndex: 1, bars: 3 }
  ], true);

  expect(totalBars(song)).toBe(5);
});

test('sceneAtBar resolves looping song', () => {
  const song = createSong([
    { sceneIndex: 0, bars: 2 },
    { sceneIndex: 1, bars: 2 }
  ], true);

  expect(sceneAtBar(song, 0)).toBe(0);
  expect(sceneAtBar(song, 1)).toBe(0);
  expect(sceneAtBar(song, 2)).toBe(1);
  expect(sceneAtBar(song, 3)).toBe(1);
  expect(sceneAtBar(song, 4)).toBe(0);
});

test('sceneAtBar ends non-looping song', () => {
  const song = createSong([
    { sceneIndex: 2, bars: 2 }
  ], false);

  expect(sceneAtBar(song, 1)).toBe(2);
  expect(sceneAtBar(song, 2)).toBe(-1);
});
