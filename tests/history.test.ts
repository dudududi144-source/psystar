import { test, expect } from 'bun:test';
import { History } from '../src/core/history.ts';

test('history push and current', () => {
  const history = new History<number>(10);

  history.push(1);
  history.push(2);

  expect(history.current()).toBe(2);
  expect(history.canUndo()).toBe(true);
  expect(history.canRedo()).toBe(false);
});

test('history undo and redo walk states', () => {
  const history = new History<string>(10);

  history.push('a');
  history.push('b');
  history.push('c');

  expect(history.undo()).toBe('b');
  expect(history.undo()).toBe('a');
  expect(history.canUndo()).toBe(false);
  expect(history.redo()).toBe('b');
  expect(history.redo()).toBe('c');
  expect(history.canRedo()).toBe(false);
});

test('push clears redo branch', () => {
  const history = new History<number>(10);

  history.push(1);
  history.push(2);
  history.undo();
  history.push(3);

  expect(history.canRedo()).toBe(false);
  expect(history.current()).toBe(3);
});

test('history respects capacity limit', () => {
  const history = new History<number>(3);

  for (let i = 0; i < 10; i++) history.push(i);

  expect(history.size()).toBeLessThanOrEqual(4);
});
