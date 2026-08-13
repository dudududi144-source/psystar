import { test, expect } from 'bun:test';
import { SessionRecorder } from '../src/engine/recorder.ts';

test('recorder ignores events before start', () => {
  const recorder = new SessionRecorder();

  expect(recorder.record(10, 'note_on', { note: 60 })).toBe(false);
  expect(recorder.count()).toBe(0);
});

test('recorder captures events relative to start', () => {
  const recorder = new SessionRecorder();

  recorder.start(100);
  recorder.record(150, 'note_on', { note: 60 });
  recorder.record(200, 'note_off', { note: 60 });

  expect(recorder.isRecording()).toBe(true);
  expect(recorder.count()).toBe(2);
  expect(recorder.duration()).toBe(100);

  const events = recorder.take();
  expect(events[0].time).toBe(50);
  expect(events[1].time).toBe(100);
  expect(recorder.count()).toBe(0);
});

test('recorder stops capturing after stop', () => {
  const recorder = new SessionRecorder();

  recorder.start(0);
  recorder.record(10, 'clock', {});
  recorder.stop();

  expect(recorder.record(20, 'clock', {})).toBe(false);
  expect(recorder.count()).toBe(1);
});
