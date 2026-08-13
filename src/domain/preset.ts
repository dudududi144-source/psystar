export interface PresetParams {
  bpm: number;
  swing: number;
  intensity: number;
  attack: number;
  release: number;
  crush: number;
  phaser: number;
  delay: number;
  reverb: number;
}

export interface Preset {
  name: string;
  rows: boolean[][];
  params: PresetParams;
}

export function createDefaultParams(): PresetParams {
  return {
    bpm: 122,
    swing: 0,
    intensity: 6,
    attack: 8,
    release: 300,
    crush: 0,
    phaser: 0,
    delay: 50,
    reverb: 45
  };
}

export function isValidPreset(preset: Preset): boolean {
  if (!preset || typeof preset.name !== 'string') return false;
  if (!Array.isArray(preset.rows) || preset.rows.length !== 4) return false;

  for (var r = 0; r < preset.rows.length; r++) {
    var row = preset.rows[r];
    if (!Array.isArray(row) || row.length !== 16) return false;

    for (var c = 0; c < row.length; c++) {
      if (typeof row[c] !== 'boolean') return false;
    }
  }

  if (!preset.params) return false;
  if (typeof preset.params.bpm !== 'number') return false;

  return true;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function numOrZero(value: unknown): number {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
}

export function morphPresets(a: Preset, b: Preset, t: number): Preset {
  var clamped = Math.max(0, Math.min(1, t));

  var rows = a.rows.map(function (rowA, r) {
    var rowB = Array.isArray(b.rows[r]) ? b.rows[r] : [];

    return rowA.map(function (cellA, c) {
      var va = cellA ? 1 : 0;
      var vb = rowB[c] ? 1 : 0;
      return lerp(va, vb, clamped) >= 0.5;
    });
  });

  var params: PresetParams = {
    bpm: Math.round(lerp(numOrZero(a.params.bpm), numOrZero(b.params.bpm), clamped)),
    swing: Math.round(lerp(numOrZero(a.params.swing), numOrZero(b.params.swing), clamped)),
    intensity: Math.round(lerp(numOrZero(a.params.intensity), numOrZero(b.params.intensity), clamped)),
    attack: Math.round(lerp(numOrZero(a.params.attack), numOrZero(b.params.attack), clamped)),
    release: Math.round(lerp(numOrZero(a.params.release), numOrZero(b.params.release), clamped)),
    crush: Math.round(lerp(numOrZero(a.params.crush), numOrZero(b.params.crush), clamped)),
    phaser: Math.round(lerp(numOrZero(a.params.phaser), numOrZero(b.params.phaser), clamped)),
    delay: Math.round(lerp(numOrZero(a.params.delay), numOrZero(b.params.delay), clamped)),
    reverb: Math.round(lerp(numOrZero(a.params.reverb), numOrZero(b.params.reverb), clamped))
  };

  return { name: a.name + ' ⇄ ' + b.name, rows: rows, params: params };
}

export function builtInPresets(): Preset[] {
  return [
    {
      name: 'שחר קריסטלי',
      rows: [
        [true,false,false,true,false,false,true,false,true,false,true,false,true,false,false,false],
        [false,false,true,false,false,false,false,true,false,false,true,false,false,false,true,false],
        [true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
        [false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,true]
      ],
      params: { bpm: 122, swing: 0, intensity: 6, attack: 8, release: 300, crush: 0, phaser: 0, delay: 50, reverb: 45 }
    },
    {
      name: 'נהר מגנטה',
      rows: [
        [true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false],
        [false,true,false,false,true,false,false,true,false,true,false,false,true,false,false,true],
        [true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false],
        [false,false,true,false,false,false,true,false,false,false,true,false,false,false,true,false]
      ],
      params: { bpm: 132, swing: 14, intensity: 7, attack: 12, release: 380, crush: 0, phaser: 28, delay: 62, reverb: 40 }
    },
    {
      name: 'ספירלת העומק',
      rows: [
        [true,false,false,false,true,false,false,true,false,false,true,false,false,true,false,false],
        [false,false,true,false,false,true,false,false,false,true,false,false,true,false,true,false],
        [false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false],
        [true,false,false,true,false,false,true,false,false,true,false,false,true,false,false,true]
      ],
      params: { bpm: 112, swing: 8, intensity: 5, attack: 40, release: 900, crush: 22, phaser: 18, delay: 44, reverb: 68 }
    },
    {
      name: 'לב התהום',
      rows: [
        [true,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false],
        [false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false],
        [true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,true,false,false,false,false,false,false,true,false,false]
      ],
      params: { bpm: 96, swing: 0, intensity: 9, attack: 60, release: 1600, crush: 10, phaser: 52, delay: 30, reverb: 78 }
    }
  ];
}
