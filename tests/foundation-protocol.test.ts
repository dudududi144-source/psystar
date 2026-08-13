import { test, expect } from 'bun:test';
import { isValidMusicalEvent, encodeMusicalEvent, decodeMusicalEvent, FoundationInMemoryChannel } from '../src/integration/foundation-protocol.ts';
import type { FoundationMusicalEvent } from '../src/integration/foundation-protocol.ts';

const beat = { type: 'beat', beat: 1, bar: 0, at: 100 } as FoundationMusicalEvent;
const note = { type: 'note', note: 60, velocity: 100, duration: 0.2, channel: 'bass', at: 100 } as FoundationMusicalEvent;
const section = { type: 'section', section: 'drop', bar: 4, at: 100 } as FoundationMusicalEvent;
const energy = { type: 'energy', energy: 0.8, at: 100 } as FoundationMusicalEvent;
const drop = { type: 'drop', intensity: 1, at: 100 } as FoundationMusicalEvent;
const pattern = { type: 'pattern', patternId: 'p1', trackId: 't1', at: 100 } as FoundationMusicalEvent;

test('all six event types validate', () => {
  expect(isValidMusicalEvent(beat)).toBe(true);
  expect(isValidMusicalEvent(note)).toBe(true);
  expect(isValidMusicalEvent(section)).toBe(true);
  expect(isValidMusicalEvent(energy)).toBe(true);
  expect(isValidMusicalEvent(drop)).toBe(true);
  expect(isValidMusicalEvent(pattern)).toBe(true);
});

test('invalid events are rejected', () => {
  expect(isValidMusicalEvent(null as never)).toBe(false);
  expect(isValidMusicalEvent({ type: 'beat', beat: 1, bar: 0 } as never)).toBe(false);
  expect(isValidMusicalEvent({ type: 'note', note: 60, velocity: 1, duration: 1, at: 1 } as never)).toBe(false);
  expect(isValidMusicalEvent({ type: 'explode', at: 1 } as never)).toBe(false);
});

test('encode/decode roundtrip preserves note event', () => {
  const encoded = encodeMusicalEvent(note);
  expect(encoded).not.toBeNull();

  const decoded = decodeMusicalEvent(encoded as string);
  expect(decoded).not.toBeNull();
  expect(decoded?.type).toBe('note');
  if (decoded?.type === 'note') {
    expect(decoded.note).toBe(60);
    expect(decoded.channel).toBe('bass');
  }
});

test('decode rejects garbage', () => {
  expect(decodeMusicalEvent('not-json')).toBeNull();
  expect(decodeMusicalEvent('{"type":"beat"}')).toBeNull();
});

test('channel publish reaches subscribers', () => {
  const channel = new FoundationInMemoryChannel('test');
  const seen: FoundationMusicalEvent[] = [];

  channel.subscribe((e) => seen.push(e));
  channel.publish(beat);

  expect(seen.length).toBe(1);
  expect(channel.subscriberCount).toBe(1);
});

test('channel unsubscribe stops delivery', () => {
  const channel = new FoundationInMemoryChannel('test');
  const seen: FoundationMusicalEvent[] = [];

  const unsub = channel.subscribe((e) => seen.push(e));
  unsub();
  channel.publish(beat);

  expect(seen.length).toBe(0);
  expect(channel.subscriberCount).toBe(0);
});

test('channel close blocks publish and subscribe', () => {
  const channel = new FoundationInMemoryChannel('test');
  channel.close();

  expect(channel.isClosed).toBe(true);
  expect(() => channel.subscribe(() => {})).toThrow();

  const seen: FoundationMusicalEvent[] = [];
  channel.publish(beat);
  expect(seen.length).toBe(0);
});
