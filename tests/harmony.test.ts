import { test, expect } from 'bun:test';
import { midiToNoteName, noteToMidi, buildScale, buildScaleSpanning, buildChord, diatonicChord, buildProgression, scaleNoteNames, SCALE_INTERVALS, progressionChordAt } from '../src/domain/harmony.ts';

test('midiToNoteName maps middle C', () => {
  const info = midiToNoteName(60);

  expect(info.name).toBe('C');
  expect(info.octave).toBe(4);
});

test('noteToMidi is inverse of midiToNoteName', () => {
  expect(noteToMidi('A', 4)).toBe(69);
  expect(noteToMidi('C', 4)).toBe(60);
});

test('buildScale constructs C major', () => {
  const scale = buildScale(60, 'major');

  expect(scale).toEqual([60, 62, 64, 65, 67, 69, 71]);
});

test('buildScale constructs A minor pentatonic', () => {
  const scale = buildScale(57, 'pentatonicMinor');

  expect(scale).toEqual([57, 60, 62, 64, 67]);
});

test('buildScaleSpanning spans multiple octaves', () => {
  const scale = buildScaleSpanning(60, 'major', 2);

  expect(scale.length).toBe(14);
  expect(scale[0]).toBe(60);
  expect(scale[7]).toBe(72);
});

test('buildChord constructs major and minor triads', () => {
  expect(buildChord(60, 'maj')).toEqual([60, 64, 67]);
  expect(buildChord(60, 'min')).toEqual([60, 63, 67]);
});

test('buildChord constructs sevenths', () => {
  expect(buildChord(60, 'maj7')).toEqual([60, 64, 67, 71]);
  expect(buildChord(60, 'dom7')).toEqual([60, 64, 67, 70]);
});

test('diatonicChord returns I chord for major key', () => {
  expect(diatonicChord(60, 'major', 1)).toEqual([60, 64, 67]);
});

test('diatonicChord returns correct qualities across major degrees', () => {
  const ii = diatonicChord(60, 'major', 2);
  const iii = diatonicChord(60, 'major', 3);
  const iv = diatonicChord(60, 'major', 4);
  const v = diatonicChord(60, 'major', 5);

  expect(ii).toEqual([62, 65, 69]);
  expect(iii).toEqual([64, 67, 71]);
  expect(iv).toEqual([65, 69, 72]);
  expect(v).toEqual([67, 71, 74]);
});

test('buildProgression builds I-IV-V-I in C', () => {
  const prog = buildProgression(60, 'major', 'I-IV-V-I');

  expect(prog.length).toBe(4);
  expect(prog[0]).toEqual([60, 64, 67]);
  expect(prog[1]).toEqual([65, 69, 72]);
});

test('buildProgression returns empty for unknown name', () => {
  expect(buildProgression(60, 'major', 'nope')).toEqual([]);
});

test('scaleNoteNames returns note letters', () => {
  const names = scaleNoteNames(60, 'major');

  expect(names).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
});

test('all scale types produce their declared interval count', () => {
  const keys = Object.keys(SCALE_INTERVALS) as Array<keyof typeof SCALE_INTERVALS>;

  for (const key of keys) {
    expect(buildScale(60, key).length).toBe(SCALE_INTERVALS[key].length);
  }
});


test('progressionChordAt cycles chords every bar', () => {
  const prog = [[60, 64, 67], [65, 69, 72], [67, 71, 74]];

  expect(progressionChordAt(prog, 0, 1)).toEqual(prog[0]);
  expect(progressionChordAt(prog, 1, 1)).toEqual(prog[1]);
  expect(progressionChordAt(prog, 2, 1)).toEqual(prog[2]);
  expect(progressionChordAt(prog, 3, 1)).toEqual(prog[0]);
});

test('progressionChordAt holds chords for multiple bars', () => {
  const prog = [[1], [2], [3]];

  expect(progressionChordAt(prog, 0, 2)).toEqual([1]);
  expect(progressionChordAt(prog, 1, 2)).toEqual([1]);
  expect(progressionChordAt(prog, 2, 2)).toEqual([2]);
  expect(progressionChordAt(prog, 5, 2)).toEqual([3]);
  expect(progressionChordAt(prog, 6, 2)).toEqual([1]);
});

test('progressionChordAt guards empty progressions', () => {
  expect(progressionChordAt([], 0, 1)).toEqual([]);
});
