export type SyncRole = 'solo' | 'leader' | 'follower';

export type SyncKind = 'presence' | 'play' | 'stop' | 'grid' | 'bpm' | 'scene';

export interface SyncMessage {
  kind: SyncKind;
  deviceId: string;
  time: number;
  payload: Record<string, number>;
}

var SYNC_KINDS: SyncKind[] = ['presence', 'play', 'stop', 'grid', 'bpm', 'scene'];

export function createSyncMessage(kind: SyncKind, deviceId: string, time: number, payload: Record<string, number>): SyncMessage {
  return { kind: kind, deviceId: deviceId, time: time, payload: payload };
}

export function isValidSyncMessage(message: SyncMessage): boolean {
  if (!message) return false;
  if (SYNC_KINDS.indexOf(message.kind) === -1) return false;
  if (typeof message.deviceId !== 'string' || message.deviceId.length === 0) return false;
  if (typeof message.time !== 'number') return false;
  if (!message.payload || typeof message.payload !== 'object') return false;

  return true;
}

export function resolveLeader(deviceIds: string[]): string {
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) return '';

  var sorted = deviceIds.slice().sort();
  return sorted[sorted.length - 1];
}

export function nextRole(current: SyncRole): SyncRole {
  if (current === 'solo') return 'leader';
  if (current === 'leader') return 'follower';
  return 'solo';
}
