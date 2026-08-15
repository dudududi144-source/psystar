import { test, expect } from 'bun:test';
import { journeyDuration, mapToTimeline, countByType } from '../src/domain/journey-timeline.ts';

const events = [
  { time: 0, type: 'step' },
  { time: 500, type: 'scene' },
  { time: 1000, type: 'step' },
  { time: 2000, type: 'step' }
];

test('journeyDuration finds the last event time', () => {
  expect(journeyDuration(events)).toBe(2000);
  expect(journeyDuration([])).toBe(0);
});

test('mapToTimeline maps events into 0..1 positions', () => {
  const markers = mapToTimeline(events, 2000);

  expect(markers.length).toBe(4);
  expect(markers[0].position).toBe(0);
  expect(markers[markers.length - 1].position).toBe(1);
});

test('mapToTimeline sorts by time', () => {
  const shuffled = [
    { time: 1000, type: 'step' },
    { time: 0, type: 'step' },
    { time: 500, type: 'scene' }
  ];
  const markers = mapToTimeline(shuffled, 1000);

  expect(markers[0].time).toBe(0);
  expect(markers[1].time).toBe(500);
  expect(markers[2].time).toBe(1000);
});

test('mapToTimeline clamps and guards', () => {
  const markers = mapToTimeline([{ time: 9999, type: 'step' }], 100);

  expect(markers[0].position).toBe(1);
  expect(mapToTimeline(events, 0)).toEqual([]);
  expect(mapToTimeline([], 100)).toEqual([]);
});

test('countByType tallies event types', () => {
  const counts = countByType(events);

  expect(counts.step).toBe(3);
  expect(counts.scene).toBe(1);
  expect(countByType([])).toEqual({});
});
