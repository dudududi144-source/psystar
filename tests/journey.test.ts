import { test, expect } from 'bun:test';
import { createJourney, isValidEvent, isValidJourney, encodeJourney, decodeJourney } from '../src/domain/journey.ts';

test('createJourney computes duration from last event', () => {
  const journey = createJourney('מסע בדיקה', 122, [
    { time: 0, type: 'step', data: { step: 0, mask: 1 } },
    { time: 400, type: 'scene', data: { index: 1 } },
    { time: 250, type: 'step', data: { step: 4, mask: 3 } }
  ]);

  expect(journey.duration).toBe(400);
  expect(journey.events.length).toBe(3);
});

test('isValidEvent rejects malformed events', () => {
  expect(isValidEvent(null as unknown as never)).toBe(false);
  expect(isValidEvent({ time: -1, type: 'step', data: {} })).toBe(false);
  expect(isValidEvent({ time: 0, type: 'explode', data: {} } as never)).toBe(false);
});

test('journey encode/decode roundtrip preserves data', () => {
  const journey = createJourney('מסע', 130, [
    { time: 0, type: 'step', data: { step: 0, mask: 5 } }
  ]);

  const decoded = decodeJourney(encodeJourney(journey));

  expect(decoded).not.toBeNull();
  expect(decoded?.name).toBe('מסע');
  expect(decoded?.bpm).toBe(130);
  expect(decoded?.events[0].data.mask).toBe(5);
});

test('decodeJourney rejects garbage', () => {
  expect(decodeJourney('not-json')).toBeNull();
  expect(decodeJourney('{"name":"x"}')).toBeNull();
});

test('isValidJourney validates full structure', () => {
  const journey = createJourney('ok', 120, []);

  expect(isValidJourney(journey)).toBe(true);
  expect(isValidJourney({ name: 'bad', bpm: 0, duration: 0, events: [] })).toBe(false);
});
