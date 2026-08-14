export function pitchClassOf(midiNote: number): number {
  return ((Math.floor(midiNote) % 12) + 12) % 12;
}

export function noteToDegree(midiNote: number, keyPc: number, intervals: number[]): number {
  if (!Array.isArray(intervals) || intervals.length === 0) return 0;

  var notePc = pitchClassOf(midiNote);
  var keyBase = pitchClassOf(keyPc);
  var best = 0;
  var bestDist = Infinity;

  for (var d = 0; d < intervals.length; d++) {
    var degPc = (keyBase + intervals[d]) % 12;
    var direct = Math.abs(notePc - degPc);
    var dist = Math.min(direct, 12 - direct);

    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }

  return best;
}
