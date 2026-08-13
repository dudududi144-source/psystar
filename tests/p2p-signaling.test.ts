import { test, expect } from 'bun:test';
import { encodeSignal, decodeSignal, SIGNAL_MARKER } from '../src/integration/p2p-signaling.ts';

test('signal encode/decode roundtrip', () => {
  const encoded = encodeSignal('offer', { type: 'offer', sdp: 'abc' });
  const decoded = decodeSignal(encoded);

  expect(decoded).not.toBeNull();
  expect(decoded?.kind).toBe('offer');
  expect(decoded?.psystar).toBe(SIGNAL_MARKER);
  expect(decoded?.payload.sdp).toBe('abc');
});

test('decode accepts answer kind', () => {
  const decoded = decodeSignal(encodeSignal('answer', { type: 'answer', sdp: 'xyz' }));

  expect(decoded).not.toBeNull();
  expect(decoded?.kind).toBe('answer');
});

test('decode rejects foreign markers', () => {
  const foreign = JSON.stringify({ psystar: 'other-app', kind: 'offer', payload: { type: 'offer' } });

  expect(decodeSignal(foreign)).toBeNull();
});

test('decode rejects invalid kinds and payloads', () => {
  expect(decodeSignal(JSON.stringify({ psystar: SIGNAL_MARKER, kind: 'candidate', payload: { type: 'x' } }))).toBeNull();
  expect(decodeSignal(JSON.stringify({ psystar: SIGNAL_MARKER, kind: 'offer', payload: {} }))).toBeNull();
});

test('decode rejects garbage', () => {
  expect(decodeSignal('not-json')).toBeNull();
  expect(decodeSignal('')).toBeNull();
});
