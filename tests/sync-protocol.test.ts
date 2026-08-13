import { test, expect } from 'bun:test';
import { createSyncMessage, isValidSyncMessage, resolveLeader, nextRole } from '../src/integration/sync-protocol.ts';

test('createSyncMessage builds valid message', () => {
  const message = createSyncMessage('play', 'psy-1', 123, { bpm: 122 });

  expect(isValidSyncMessage(message)).toBe(true);
});

test('isValidSyncMessage rejects malformed messages', () => {
  expect(isValidSyncMessage(null as unknown as never)).toBe(false);
  expect(isValidSyncMessage({ kind: 'explode', deviceId: 'x', time: 1, payload: {} } as never)).toBe(false);
  expect(isValidSyncMessage({ kind: 'play', deviceId: '', time: 1, payload: {} })).toBe(false);
  expect(isValidSyncMessage({ kind: 'play', deviceId: 'x', time: 'now', payload: {} } as never)).toBe(false);
});

test('resolveLeader is deterministic', () => {
  expect(resolveLeader(['psy-a', 'psy-c', 'psy-b'])).toBe('psy-c');
  expect(resolveLeader([])).toBe('');
});

test('nextRole cycles solo to leader to follower', () => {
  expect(nextRole('solo')).toBe('leader');
  expect(nextRole('leader')).toBe('follower');
  expect(nextRole('follower')).toBe('solo');
});
