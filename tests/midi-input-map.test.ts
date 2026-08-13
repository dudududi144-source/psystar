import { test, expect } from 'bun:test';
import { mapMidiNoteToRow, isNoteOn, isNoteOff, midiChannelOf, normalizeVelocity } from '../src/engine/midi-input-map.ts';

test('mapMidiNoteToRow splits note ranges into rows', () => {
  expect(mapMidiNoteToRow(36)).toBe(0);
  expect(mapMidiNoteToRow(60)).toBe(1);
  expect(mapMidiNoteToRow(76)).toBe(2);
  expect(mapMidiNoteToRow(96)).toBe(3);
});

test('isNoteOn detects note-on with velocity', () => {
  expect(isNoteOn(0x90, 100)).toBe(true);
  expect(isNoteOn(0x90, 0)).toBe(false);
  expect(isNoteOn(0x80, 100)).toBe(false);
});

test('isNoteOff detects note-off and zero-velocity note-on', () => {
  expect(isNoteOff(0x80, 64)).toBe(true);
  expect(isNoteOff(0x90, 0)).toBe(true);
  expect(isNoteOff(0x90, 100)).toBe(false);
});

test('midiChannelOf extracts channel', () => {
  expect(midiChannelOf(0x93)).toBe(3);
  expect(midiChannelOf(0x80)).toBe(0);
});

test('normalizeVelocity maps to 0..1', () => {
  expect(normalizeVelocity(0)).toBe(0);
  expect(normalizeVelocity(127)).toBe(1);
  expect(normalizeVelocity(200)).toBe(1);
});
