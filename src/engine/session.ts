export interface SessionSongStep {
  sceneIndex: number;
  bars: number;
}

export interface SessionSnapshot {
  version: number;
  grid: boolean[][];
  velocity: number[][];
  accents: boolean[][];
  roll: number[];
  bpm: number;
  swing: number;
  intensity: number;
  attack: number;
  release: number;
  crush: number;
  phaser: number;
  delay: number;
  reverb: number;
  harmonyKey: number;
  harmonyScale: string;
  songSteps: SessionSongStep[];
  songLoop: boolean;
}

export var SESSION_VERSION = 1;

export function isValidSession(snapshot: SessionSnapshot): boolean {
  if (!snapshot) return false;
  if (snapshot.version !== SESSION_VERSION) return false;

  if (!Array.isArray(snapshot.grid) || snapshot.grid.length !== 4) return false;

  for (var r = 0; r < snapshot.grid.length; r++) {
    if (!Array.isArray(snapshot.grid[r]) || snapshot.grid[r].length !== 16) return false;
  }

  if (!Array.isArray(snapshot.velocity) || snapshot.velocity.length !== 4) return false;
  if (!Array.isArray(snapshot.accents) || snapshot.accents.length !== 4) return false;
  if (!Array.isArray(snapshot.roll) || snapshot.roll.length !== 16) return false;

  if (typeof snapshot.bpm !== 'number' || snapshot.bpm <= 0) return false;
  if (typeof snapshot.harmonyKey !== 'number') return false;
  if (typeof snapshot.harmonyScale !== 'string') return false;
  if (!Array.isArray(snapshot.songSteps)) return false;

  return true;
}

export function encodeSession(snapshot: SessionSnapshot): string {
  return JSON.stringify(snapshot);
}

export function decodeSession(raw: string): SessionSnapshot | null {
  try {
    var parsed = JSON.parse(raw);

    if (!isValidSession(parsed)) return null;

    return parsed as SessionSnapshot;
  } catch {
    return null;
  }
}
