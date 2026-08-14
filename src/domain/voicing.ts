export type VoicingType = 'closed' | 'open' | 'first' | 'second';

export var VOICING_TYPES: VoicingType[] = ['closed', 'open', 'first', 'second'];

export function voiceChordNotes(notes: number[], voicing: VoicingType): number[] {
  if (!Array.isArray(notes) || notes.length === 0) return [];

  var sorted = notes.slice().sort(function (a, b) {
    return a - b;
  });

  if (voicing === 'first') {
    var bottom = sorted.shift() as number;
    sorted.push(bottom + 12);
    return sorted;
  }

  if (voicing === 'second') {
    if (sorted.length < 2) return sorted;

    var first = sorted.shift() as number;
    var second = sorted.shift() as number;
    sorted.push(first + 12, second + 12);
    return sorted;
  }

  if (voicing === 'open') {
    return sorted.map(function (n, i) {
      return i % 2 === 1 ? n + 12 : n;
    });
  }

  return sorted;
}
