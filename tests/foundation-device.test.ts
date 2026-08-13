import { test, expect } from 'bun:test';
import { PsystarDevice } from '../src/integration/foundation-device.ts';
import type { FoundationMusicalEvent } from '../src/integration/foundation-protocol.ts';

test('capabilities describe a real instrument', () => {
  const device = new PsystarDevice({ id: 'psystar-test', voices: 28 });
  const caps = device.capabilities();

  expect(caps.audio).toBe(true);
  expect(caps.midi).toBe(true);
  expect(caps.voices).toBe(28);
  expect(caps.roles).toContain('instrument');
  expect(caps.roles).toContain('bridge');
});

test('device counts valid events only', () => {
  const device = new PsystarDevice({ id: 'x' });

  device.onEvent({ type: 'note', note: 60, velocity: 1, duration: 1, channel: 'a', at: 1 } as FoundationMusicalEvent);
  device.onEvent({ type: 'explode', at: 1 } as never);

  expect(device.eventsReceived).toBe(1);
});

test('device handler receives events', () => {
  const device = new PsystarDevice({ id: 'x' });
  const seen: FoundationMusicalEvent[] = [];

  device.setEventHandler((e) => seen.push(e));
  device.onEvent({ type: 'energy', energy: 0.5, at: 1 } as FoundationMusicalEvent);

  expect(seen.length).toBe(1);
});

test('device stores transport and context', () => {
  const device = new PsystarDevice({ id: 'x' });

  device.onTransport({ bpm: 122, beat: 1, bar: 0, phase: 0.5, locked: true, confidence: 0.9, revision: 1 });
  device.onContext({ key: 'A', rootPc: 9, scale: 'minor', energy: 0.7, style: 'psy', section: 'build', beatsPerBar: 4 });

  expect(device.lastKnownTransport?.bpm).toBe(122);
  expect(device.lastKnownContext?.rootPc).toBe(9);
});

test('device start/stop lifecycle', () => {
  const device = new PsystarDevice({ id: 'x' });

  device.onStart();
  expect(device.isStarted).toBe(true);

  device.onStop();
  expect(device.isStopped).toBe(true);
  expect(device.reportLatencyMs()).toBe(12);
});
