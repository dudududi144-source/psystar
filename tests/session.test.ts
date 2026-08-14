import { test, expect } from 'bun:test';
import { SESSION_VERSION, isValidSession, encodeSession, decodeSession } from '../src/engine/session.ts';

function validSnapshot() {
  return {
    version: SESSION_VERSION,
    grid: [
      new Array(16).fill(true),
      new Array(16).fill(false),
      new Array(16).fill(false),
      new Array(16).fill(true)
    ],
    velocity: [
      new Array(16).fill(1.0),
      new Array(16).fill(1.0),
      new Array(16).fill(1.0),
      new Array(16).fill(1.0)
    ],
    accents: [
      new Array(16).fill(false),
      new Array(16).fill(false),
      new Array(16).fill(false),
      new Array(16).fill(false)
    ],
    roll: new Array(16).fill(-1),
    bpm: 122,
    swing: 0,
    intensity: 6,
    attack: 8,
    release: 300,
    crush: 0,
    phaser: 0,
    delay: 50,
    reverb: 45,
    harmonyKey: 57,
    harmonyScale: 'pentatonicMinor',
    songSteps: [{ sceneIndex: 0, bars: 2 }],
    songLoop: true
  };
}

test('isValidSession accepts a complete snapshot', () => {
  expect(isValidSession(validSnapshot())).toBe(true);
});

test('isValidSession rejects wrong version', () => {
  const snapshot = validSnapshot();
  snapshot.version = 99;

  expect(isValidSession(snapshot)).toBe(false);
});

test('isValidSession rejects malformed grids', () => {
  const snapshot = validSnapshot();
  snapshot.grid = [[true]];

  expect(isValidSession(snapshot)).toBe(false);
});

test('isValidSession rejects bad bpm and roll length', () => {
  const badBpm = validSnapshot();
  badBpm.bpm = 0;
  expect(isValidSession(badBpm)).toBe(false);

  const badRoll = validSnapshot();
  badRoll.roll = new Array(8).fill(-1);
  expect(isValidSession(badRoll)).toBe(false);
});

test('encode/decode roundtrip preserves the snapshot', () => {
  const snapshot = validSnapshot();
  const decoded = decodeSession(encodeSession(snapshot));

  expect(decoded).not.toBeNull();
  expect(decoded?.bpm).toBe(122);
  expect(decoded?.harmonyScale).toBe('pentatonicMinor');
  expect(decoded?.songSteps[0].bars).toBe(2);
});

test('decodeSession rejects garbage', () => {
  expect(decodeSession('not-json')).toBeNull();
  expect(decodeSession('{"version":1}')).toBeNull();
});
