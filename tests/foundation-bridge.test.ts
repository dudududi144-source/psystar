import { test, expect } from 'bun:test';
import { EventBus } from '../src/core/event-bus.ts';
import { FoundationBridge } from '../src/integration/foundation-bridge.ts';
import type { BridgePort } from '../src/integration/foundation-bridge.ts';
import type { ProtocolMessage } from '../src/protocol/messages.ts';
import type { FoundationEventShape } from '../src/engine/foundation-adapter.ts';

test('bridge forwards bus events to port', () => {
  const bus = new EventBus<ProtocolMessage>();
  const sent: FoundationEventShape[] = [];
  const port: BridgePort = {
    send(event) {
      sent.push(event);
    }
  };

  const bridge = new FoundationBridge(bus, port);
  bridge.attach();

  bus.emit({ type: 'note_on', channel: 0, payload: { note: 60, velocity: 100 } });

  expect(sent.length).toBe(1);
  expect(sent[0].type).toBe('note_on');
  expect(bridge.counters().sent).toBe(1);
});

test('bridge ingest emits valid events into bus', () => {
  const bus = new EventBus<ProtocolMessage>();
  const received: ProtocolMessage[] = [];
  bus.on((message) => received.push(message));

  const bridge = new FoundationBridge(bus, { send() {} });
  const ok = bridge.ingest({ type: 'note_off', channel: 2, data: { note: 50 } });

  expect(ok).toBe(true);
  expect(received.length).toBe(1);
  expect(received[0].type).toBe('note_off');
  expect(bridge.counters().received).toBe(1);
});

test('bridge rejects invalid inbound events', () => {
  const bus = new EventBus<ProtocolMessage>();
  const bridge = new FoundationBridge(bus, { send() {} });

  const ok = bridge.ingest({ type: 'explode', channel: 0, data: {} });

  expect(ok).toBe(false);
  expect(bridge.counters().received).toBe(0);
});

test('bridge detach stops forwarding', () => {
  const bus = new EventBus<ProtocolMessage>();
  const sent: FoundationEventShape[] = [];
  const bridge = new FoundationBridge(bus, {
    send(event) {
      sent.push(event);
    }
  });

  const detach = bridge.attach();
  detach();

  bus.emit({ type: 'clock', channel: 0, payload: {} });

  expect(sent.length).toBe(0);
});
