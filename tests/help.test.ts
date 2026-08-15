import { test, expect } from 'bun:test';
import { getKeyboardShortcuts, getMouseGestures, hasDuplicateKeys } from '../src/ui/help.ts';

test('keyboard shortcuts list is populated and complete', () => {
  const shortcuts = getKeyboardShortcuts();

  expect(shortcuts.length).toBeGreaterThanOrEqual(7);

  for (const s of shortcuts) {
    expect(typeof s.key).toBe('string');
    expect(s.key.length).toBeGreaterThan(0);
    expect(typeof s.action).toBe('string');
    expect(s.action.length).toBeGreaterThan(0);
  }
});

test('mouse gestures list is populated and complete', () => {
  const gestures = getMouseGestures();

  expect(gestures.length).toBe(3);

  for (const g of gestures) {
    expect(g.key.length).toBeGreaterThan(0);
    expect(g.action.length).toBeGreaterThan(0);
  }
});

test('no duplicate shortcut keys', () => {
  expect(hasDuplicateKeys(getKeyboardShortcuts())).toBe(false);
  expect(hasDuplicateKeys(getMouseGestures())).toBe(false);
});

test('hasDuplicateKeys detects duplicates', () => {
  expect(hasDuplicateKeys([
    { key: 'Space', action: 'a' },
    { key: 'Space', action: 'b' }
  ])).toBe(true);
});
