import { test, expect } from 'bun:test';
import { ok, fail } from '../src/core/result.ts';
import { EventBus } from '../src/core/event-bus.ts';
import { createLogger } from '../src/core/logger.ts';

test('result ok contains value', () => {
  const result = ok(42);

  expect(result.ok).toBe(true);

  if (result.ok) {
    expect(result.value).toBe(42);
  }
});

test('result fail contains error', () => {
  const result = fail('boom');

  expect(result.ok).toBe(false);

  if (!result.ok) {
    expect(result.error).toBe('boom');
  }
});

test('event bus emits to listeners', () => {
  const bus = new EventBus<number>();
  const received: number[] = [];

  bus.on((value) => received.push(value));
  bus.emit(7);

  expect(received.length).toBe(1);
  expect(received[0]).toBe(7);
});

test('event bus unsubscribe works', () => {
  const bus = new EventBus<number>();
  const received: number[] = [];
  const off = bus.on((value) => received.push(value));

  off();
  bus.emit(1);

  expect(received.length).toBe(0);
});

test('logger exposes log function', () => {
  const logger = createLogger('test');

  expect(typeof logger.log).toBe('function');
});
