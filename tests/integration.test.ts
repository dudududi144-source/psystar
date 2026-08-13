import { test, expect } from 'bun:test';
import { EventBus } from '../src/core/event-bus.ts';
import { createPattern } from '../src/domain/pattern.ts';
import { Scheduler } from '../src/engine/scheduler.ts';
import type { ProtocolMessage } from '../src/protocol/messages.ts';

test('scheduler emits note_on for active step', () => {
  const bus = new EventBus<ProtocolMessage>();
  const seen: ProtocolMessage[] = [];

  bus.on((message) => seen.push(message));

  const pattern = createPattern([
    { active: true, velocity: 100, note: 60, channel: 2 }
  ]);

  const scheduler = new Scheduler(pattern, bus);
  scheduler.tick(0);

  expect(seen.length).toBe(1);
  expect(seen[0].type).toBe('note_on');
  expect(seen[0].channel).toBe(2);
});

test('scheduler stays silent for inactive step', () => {
  const bus = new EventBus<ProtocolMessage>();
  const seen: ProtocolMessage[] = [];

  bus.on((message) => seen.push(message));

  const scheduler = new Scheduler(createPattern([{ active: false, velocity: 0 }]), bus);
  scheduler.tick(0);

  expect(seen.length).toBe(0);
});
