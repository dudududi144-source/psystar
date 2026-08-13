import { test, expect } from 'bun:test';
import { createLibrary, addItem, removeItem, findItem, listNames, isValidItem, encodeLibrary, decodeLibrary, MAX_LIBRARY_ITEMS } from '../src/domain/library.ts';

test('addItem stores and findItem retrieves', () => {
  let library = createLibrary();

  library = addItem(library, { name: 'חלום ראשון', kind: 'scene', createdAt: 1, payload: '{}' });

  expect(findItem(library, 'חלום ראשון')).not.toBeNull();
  expect(listNames(library)).toEqual(['חלום ראשון']);
});

test('addItem overwrites same name', () => {
  let library = createLibrary();

  library = addItem(library, { name: 'x', kind: 'scene', createdAt: 1, payload: 'a' });
  library = addItem(library, { name: 'x', kind: 'scene', createdAt: 2, payload: 'b' });

  expect(library.items.length).toBe(1);
  expect(findItem(library, 'x')?.payload).toBe('b');
});

test('library enforces capacity by evicting oldest', () => {
  let library = createLibrary();

  for (let i = 0; i < MAX_LIBRARY_ITEMS + 3; i++) {
    library = addItem(library, { name: 'item-' + i, kind: 'scene', createdAt: i, payload: '{}' });
  }

  expect(library.items.length).toBe(MAX_LIBRARY_ITEMS);
  expect(findItem(library, 'item-0')).toBeNull();
  expect(findItem(library, 'item-' + (MAX_LIBRARY_ITEMS + 2))).not.toBeNull();
});

test('removeItem removes only the named item', () => {
  let library = createLibrary();

  library = addItem(library, { name: 'a', kind: 'scene', createdAt: 1, payload: '{}' });
  library = addItem(library, { name: 'b', kind: 'journey', createdAt: 2, payload: '{}' });
  library = removeItem(library, 'a');

  expect(library.items.length).toBe(1);
  expect(library.items[0].name).toBe('b');
});

test('isValidItem rejects malformed items', () => {
  expect(isValidItem(null as unknown as never)).toBe(false);
  expect(isValidItem({ name: '', kind: 'scene', createdAt: 1, payload: '{}' })).toBe(false);
  expect(isValidItem({ name: 'x', kind: 'explode', createdAt: 1, payload: '{}' } as never)).toBe(false);
});

test('library encode/decode roundtrip', () => {
  let library = createLibrary();

  library = addItem(library, { name: 'מסע', kind: 'journey', createdAt: 5, payload: '{"events":[]}' });

  const decoded = decodeLibrary(encodeLibrary(library));

  expect(decoded).not.toBeNull();
  expect(decoded?.items[0].name).toBe('מסע');
});

test('decodeLibrary rejects garbage', () => {
  expect(decodeLibrary('not-json')).toBeNull();
  expect(decodeLibrary('{"items":[{"name":""}]}')).toBeNull();
});


test('isValidItem accepts song kind', () => {
  expect(isValidItem({ name: 'שיר ראשון', kind: 'song', createdAt: 1, payload: '{}' })).toBe(true);
});
