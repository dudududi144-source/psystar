import { test, expect } from 'bun:test';
import { encodeMessage, decodeMessage } from '../src/protocol/codec.ts';

test('codec roundtrip preserves message', () => {
  const message = {
    type: 'note_on',
    channel: 1,
    payload: { note: 60, velocity: 100 }
  };

  const decoded = decodeMessage(encodeMessage(message));

  expect(decoded).not.toBeNull();
  expect(decoded?.type).toBe('note_on');
  expect(decoded?.channel).toBe(1);
});

test('decode rejects invalid json', () => {
  expect(decodeMessage('not-json')).toBeNull();
});

test('decode rejects missing fields', () => {
  expect(decodeMessage('{"type":"note_on"}')).toBeNull();
});
