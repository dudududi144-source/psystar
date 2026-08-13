import type { Library, LibraryItem, LibraryItemKind } from './library.ts';
import { addItem, isValidItem } from './library.ts';

export interface Pack {
  name: string;
  version: number;
  items: LibraryItem[];
}

export function createPack(name: string, items: LibraryItem[]): Pack {
  return { name: name, version: 1, items: items.slice() };
}

export function isValidPack(pack: Pack): boolean {
  if (!pack || typeof pack.name !== 'string' || pack.name.length === 0) return false;
  if (typeof pack.version !== 'number') return false;
  if (!Array.isArray(pack.items)) return false;

  for (var i = 0; i < pack.items.length; i++) {
    if (!isValidItem(pack.items[i])) return false;
  }

  return true;
}

export function packSize(pack: Pack): number {
  return pack.items.length;
}

export function packItemsByKind(pack: Pack, kind: LibraryItemKind): LibraryItem[] {
  return pack.items.filter(function (item) {
    return item.kind === kind;
  });
}

export function mergePackIntoLibrary(pack: Pack, library: Library): Library {
  var result = library;

  for (var i = 0; i < pack.items.length; i++) {
    result = addItem(result, pack.items[i]);
  }

  return result;
}

export function libraryToPack(library: Library, name: string): Pack {
  return createPack(name, library.items.slice());
}

export function encodePack(pack: Pack): string {
  return JSON.stringify(pack);
}

export function decodePack(raw: string): Pack | null {
  try {
    var parsed = JSON.parse(raw);
    if (!isValidPack(parsed)) return null;
    return parsed as Pack;
  } catch {
    return null;
  }
}

export function builtInPack(): Pack {
  var items: LibraryItem[] = [];

  var goldenGate = {
    name: 'שער הזהב',
    rows: [
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    ],
    params: { bpm: 128, swing: 10, intensity: 6, attack: 10, release: 350, crush: 0, phaser: 20, delay: 55, reverb: 50 }
  };
  items.push({ name: goldenGate.name, kind: 'scene', createdAt: 0, payload: JSON.stringify(goldenGate) });

  var deepSpiral = {
    name: 'ספירלת המעמקים',
    rows: [
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
    ],
    params: { bpm: 112, swing: 8, intensity: 5, attack: 45, release: 900, crush: 25, phaser: 30, delay: 45, reverb: 70 }
  };
  items.push({ name: deepSpiral.name, kind: 'scene', createdAt: 0, payload: JSON.stringify(deepSpiral) });

  var firstSpark = {
    name: 'ניצוץ ראשון',
    bpm: 122,
    events: [
      { time: 0, type: 'step', data: { step: 0, mask: 1 } },
      { time: 492, type: 'step', data: { step: 4, mask: 9 } },
      { time: 984, type: 'step', data: { step: 8, mask: 5 } },
      { time: 1476, type: 'step', data: { step: 12, mask: 9 } },
      { time: 1968, type: 'scene', data: { index: 1 } }
    ]
  };
  items.push({ name: firstSpark.name, kind: 'journey', createdAt: 0, payload: JSON.stringify(firstSpark) });

  var dawnSong = {
    name: 'שיר השחר',
    steps: [
      { sceneIndex: 0, bars: 2 },
      { sceneIndex: 1, bars: 2 },
      { sceneIndex: 2, bars: 2 },
      { sceneIndex: 0, bars: 2 }
    ],
    loop: true
  };
  items.push({ name: dawnSong.name, kind: 'song', createdAt: 0, payload: JSON.stringify(dawnSong) });

  return createPack('החבילה המשפחתית', items);
}
