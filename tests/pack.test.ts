import { test, expect } from 'bun:test';
import { createPack, isValidPack, packSize, packItemsByKind, mergePackIntoLibrary, libraryToPack, encodePack, decodePack, builtInPack } from '../src/domain/pack.ts';
import { createLibrary, addItem } from '../src/domain/library.ts';

test('createPack builds version 1 pack with copied items', () => {
  const items = [{ name: 'a', kind: 'scene' as const, createdAt: 1, payload: '{}' }];
  const pack = createPack('חבילה', items);

  expect(pack.name).toBe('חבילה');
  expect(pack.version).toBe(1);
  expect(pack.items.length).toBe(1);

  items.push({ name: 'b', kind: 'scene', createdAt: 2, payload: '{}' });
  expect(pack.items.length).toBe(1);
});

test('isValidPack rejects malformed packs', () => {
  expect(isValidPack(null as unknown as never)).toBe(false);
  expect(isValidPack({ name: '', version: 1, items: [] })).toBe(false);
  expect(isValidPack({ name: 'x', version: 'a', items: [] } as never)).toBe(false);
  expect(isValidPack({ name: 'x', version: 1, items: [{ name: '' }] } as never)).toBe(false);
});

test('builtInPack is valid and covers all three kinds', () => {
  const pack = builtInPack();

  expect(isValidPack(pack)).toBe(true);
  expect(packSize(pack)).toBe(4);
  expect(packItemsByKind(pack, 'scene').length).toBe(2);
  expect(packItemsByKind(pack, 'journey').length).toBe(1);
  expect(packItemsByKind(pack, 'song').length).toBe(1);
});

test('builtInPack scene payloads parse into 4x16 grids', () => {
  const pack = builtInPack();
  const scenes = packItemsByKind(pack, 'scene');

  for (const scene of scenes) {
    const preset = JSON.parse(scene.payload);
    expect(preset.rows.length).toBe(4);
    expect(preset.rows[0].length).toBe(16);
    expect(typeof preset.params.bpm).toBe('number');
  }
});

test('mergePackIntoLibrary merges every item', () => {
  const pack = builtInPack();
  const library = mergePackIntoLibrary(pack, createLibrary());

  expect(library.items.length).toBe(4);
});

test('mergePackIntoLibrary respects library capacity', () => {
  const pack = builtInPack();
  let library = createLibrary();

  for (let i = 0; i < 12; i++) {
    library = addItem(library, { name: ' filler-' + i, kind: 'scene', createdAt: i, payload: '{}' });
  }

  const merged = mergePackIntoLibrary(pack, library);

  expect(merged.items.length).toBeLessThanOrEqual(12);
});

test('libraryToPack and encode/decode roundtrip', () => {
  let library = createLibrary();
  library = addItem(library, { name: 'חלום', kind: 'scene', createdAt: 5, payload: '{"rows":[]}' });

  const pack = libraryToPack(library, 'גיבוי');
  const decoded = decodePack(encodePack(pack));

  expect(decoded).not.toBeNull();
  expect(decoded?.name).toBe('גיבוי');
  expect(decoded?.items[0].name).toBe('חלום');
});

test('decodePack rejects garbage', () => {
  expect(decodePack('not-json')).toBeNull();
  expect(decodePack('{"name":"x"}')).toBeNull();
});
