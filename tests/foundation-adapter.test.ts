import { test, expect } from 'bun:test';
import { toFoundationEvent, fromFoundationEvent } from '../src/engine/foundation-adapter.ts';
import type { ProtocolMessage } from '../src/protocol/messages.ts';

test('adapter roundtrip preserves message', () => {
  const message: ProtocolMessage = {
    type: 'note_on',
    channel: 3,
    payload: { note: 62, velocity: 90 }
  };

  const shaped = toFoundationEvent(message);
  const back = fromFoundationEvent(shaped);

  expect(back).not.toBeNull();
  expect(back?.type).toBe('note_on');
  expect(back?.channel).toBe(3);
  expect(back?.payload.note).toBe(62);
});

test('adapter rejects unknown event type', () => {
  const back = fromFoundationEvent({ type: 'explode', channel: 0, data: {} });

  expect(back).toBeNull();
});

test('adapter rejects malformed event', () => {
  expect(fromFoundationEvent(null as unknown as never)).toBeNull();
  expect(fromFoundationEvent({ type: 'note_on', channel: 'x', data: {} } as never)).toBeNull();
});
