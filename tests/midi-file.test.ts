import { test, expect } from 'bun:test';
import { writeVarLen, buildTrack, buildMidiFile, DEFAULT_TICKS_PER_QUARTER } from '../src/engine/midi-file.ts';

test('writeVarLen encodes small values as one byte', () => {
  expect(writeVarLen(0)).toEqual([0]);
  expect(writeVarLen(127)).toEqual([127]);
});

test('writeVarLen encodes multi-byte values', () => {
  expect(writeVarLen(128)).toEqual([0x81, 0x00]);
  expect(writeVarLen(0x3fff)).toEqual([0xff, 0x7f]);
});

test('buildTrack emits note on and off pairs', () => {
  const track = buildTrack([{ tick: 0, note: 60, velocity: 100, duration: 480 }], 480);

  expect(track[0]).toBe(0);
  expect(track[1]).toBe(0x90);
  expect(track[2]).toBe(60);
  expect(track[3]).toBe(100);
});

test('buildTrack ends with end-of-track meta', () => {
  const track = buildTrack([{ tick: 0, note: 60, velocity: 100, duration: 10 }], 480);

  expect(track[track.length - 3]).toBe(0xff);
  expect(track[track.length - 2]).toBe(0x2f);
  expect(track[track.length - 1]).toBe(0x00);
});

test('buildMidiFile starts with MThd header', () => {
  const file = buildMidiFile([{ tick: 0, note: 60, velocity: 100, duration: 10 }], 480);

  expect(file[0]).toBe(0x4d);
  expect(file[1]).toBe(0x54);
  expect(file[2]).toBe(0x68);
  expect(file[3]).toBe(0x64);
});

test('buildMidiFile embeds ticks per quarter', () => {
  const file = buildMidiFile([], 960);

  expect(file[12]).toBe((960 >> 8) & 0xff);
  expect(file[13]).toBe(960 & 0xff);
});

test('buildMidiFile has MTrk chunk', () => {
  const file = buildMidiFile([{ tick: 0, note: 60, velocity: 100, duration: 10 }], 480);

  expect(file[14]).toBe(0x4d);
  expect(file[15]).toBe(0x54);
  expect(file[16]).toBe(0x72);
  expect(file[17]).toBe(0x6b);
});

test('default ticks per quarter is sane', () => {
  expect(DEFAULT_TICKS_PER_QUARTER).toBe(480);
});
