import { test, expect } from 'bun:test';
import { clamp7, clampChannel, noteOnBytes, noteOffBytes, MidiDriver } from '../src/engine/midi-driver.ts';

test('clamp7 keeps values inside MIDI range', () => {
  expect(clamp7(-5)).toBe(0);
  expect(clamp7(200)).toBe(127);
  expect(clamp7(64.9)).toBe(64);
});

test('clampChannel keeps channels inside 0-15', () => {
  expect(clampChannel(-1)).toBe(0);
  expect(clampChannel(20)).toBe(15);
});

test('noteOnBytes builds status byte per channel', () => {
  expect(noteOnBytes(0, 60, 100)).toEqual([0x90, 60, 100]);
  expect(noteOnBytes(3, 60, 100)).toEqual([0x93, 60, 100]);
});

test('noteOffBytes builds proper bytes', () => {
  expect(noteOffBytes(1, 48)).toEqual([0x81, 48, 0x40]);
});

test('driver tracks active notes and releases them', () => {
  const sent: number[][] = [];
  const driver = new MidiDriver((bytes) => sent.push(bytes), 0);

  driver.trigger(60, 100);
  expect(driver.activeCount()).toBe(1);

  driver.release(60);
  expect(driver.activeCount()).toBe(0);
  expect(sent.length).toBe(2);
  expect(sent[1][0]).toBe(0x80);
});

test('driver panic releases every stuck note', () => {
  const sent: number[][] = [];
  const driver = new MidiDriver((bytes) => sent.push(bytes), 2);

  driver.trigger(50, 90);
  driver.trigger(55, 90);
  driver.panic();

  expect(driver.activeCount()).toBe(0);
  expect(sent.length).toBe(4);
  expect(driver.channelOf()).toBe(2);
});
