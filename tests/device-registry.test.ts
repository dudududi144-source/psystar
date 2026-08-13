import { test, expect } from 'bun:test';
import { DeviceRegistry } from '../src/integration/device-registry.ts';

test('registry registers and lists devices', () => {
  const registry = new DeviceRegistry();

  registry.register({ id: 'a', name: 'PSYSTAR', kind: 'device', lastSeen: 10 });
  registry.register({ id: 'b', name: 'PSY6', kind: 'device', lastSeen: 20 });

  expect(registry.size()).toBe(2);
  expect(registry.has('a')).toBe(true);
  expect(registry.list()[0].id).toBe('b');
});

test('registry heartbeat updates lastSeen', () => {
  const registry = new DeviceRegistry();

  registry.register({ id: 'a', name: 'PSYSTAR', kind: 'device', lastSeen: 10 });

  expect(registry.heartbeat('a', 99)).toBe(true);
  expect(registry.heartbeat('ghost', 99)).toBe(false);
  expect(registry.list()[0].lastSeen).toBe(99);
});

test('registry prunes stale devices only', () => {
  const registry = new DeviceRegistry();

  registry.register({ id: 'fresh', name: 'A', kind: 'device', lastSeen: 100 });
  registry.register({ id: 'stale', name: 'B', kind: 'device', lastSeen: 10 });

  const removed = registry.prune(110, 50);

  expect(removed.length).toBe(1);
  expect(removed[0].id).toBe('stale');
  expect(registry.size()).toBe(1);
  expect(registry.has('fresh')).toBe(true);
});
