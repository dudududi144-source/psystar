export type LibraryItemKind = 'scene' | 'journey';

export interface LibraryItem {
  name: string;
  kind: LibraryItemKind;
  createdAt: number;
  payload: string;
}

export interface Library {
  items: LibraryItem[];
}

export var MAX_LIBRARY_ITEMS = 12;

export function createLibrary(): Library {
  return { items: [] };
}

export function isValidItem(item: LibraryItem): boolean {
  if (!item) return false;
  if (typeof item.name !== 'string' || item.name.length === 0) return false;
  if (item.kind !== 'scene' && item.kind !== 'journey') return false;
  if (typeof item.createdAt !== 'number') return false;
  if (typeof item.payload !== 'string') return false;

  return true;
}

export function addItem(library: Library, item: LibraryItem): Library {
  var withoutSameName = library.items.filter(function (existing) {
    return existing.name !== item.name;
  });

  var next = withoutSameName.concat([item]);

  if (next.length > MAX_LIBRARY_ITEMS) {
    next = next.slice(next.length - MAX_LIBRARY_ITEMS);
  }

  return { items: next };
}

export function removeItem(library: Library, name: string): Library {
  return {
    items: library.items.filter(function (item) {
      return item.name !== name;
    })
  };
}

export function findItem(library: Library, name: string): LibraryItem | null {
  for (var i = 0; i < library.items.length; i++) {
    if (library.items[i].name === name) return library.items[i];
  }

  return null;
}

export function listNames(library: Library): string[] {
  return library.items.map(function (item) {
    return item.name;
  });
}

export function encodeLibrary(library: Library): string {
  return JSON.stringify(library);
}

export function decodeLibrary(raw: string): Library | null {
  try {
    var parsed = JSON.parse(raw);

    if (!parsed || !Array.isArray(parsed.items)) return null;

    for (var i = 0; i < parsed.items.length; i++) {
      if (!isValidItem(parsed.items[i])) return null;
    }

    return parsed as Library;
  } catch {
    return null;
  }
}
