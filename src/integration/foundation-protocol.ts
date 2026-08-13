// Mirror of @psy-foundation/protocol v1 (canonical candidate).
// PSYSTAR mirrors these types instead of importing the foundation runtime:
// Rule 0 forbids modifying or replacing the foundation, and its transport is
// not canonical yet (see psy-foundation FOUNDATION_STATUS.md). The BeatEvent
// runtime transport reference is intentionally replaced by serializable fields.

export type FoundationEventType = 'beat' | 'section' | 'energy' | 'drop' | 'note' | 'pattern';

export interface FoundationBeatEvent {
  type: 'beat';
  beat: number;
  bar: number;
  at: number;
}

export interface FoundationSectionEvent {
  type: 'section';
  section: string;
  bar: number;
  at: number;
}

export interface FoundationEnergyEvent {
  type: 'energy';
  energy: number;
  at: number;
}

export interface FoundationDropEvent {
  type: 'drop';
  intensity: number;
  at: number;
}

export interface FoundationNoteEvent {
  type: 'note';
  note: number;
  velocity: number;
  duration: number;
  channel: string;
  at: number;
}

export interface FoundationPatternEvent {
  type: 'pattern';
  patternId: string;
  trackId: string;
  at: number;
}

export type FoundationMusicalEvent =
  | FoundationBeatEvent
  | FoundationSectionEvent
  | FoundationEnergyEvent
  | FoundationDropEvent
  | FoundationNoteEvent
  | FoundationPatternEvent;

export function isValidMusicalEvent(event: FoundationMusicalEvent): boolean {
  if (!event || typeof event !== 'object') return false;
  if (typeof event.at !== 'number') return false;

  switch (event.type) {
    case 'beat':
      return typeof event.beat === 'number' && typeof event.bar === 'number';
    case 'section':
      return typeof event.section === 'string' && typeof event.bar === 'number';
    case 'energy':
      return typeof event.energy === 'number';
    case 'drop':
      return typeof event.intensity === 'number';
    case 'note':
      return typeof event.note === 'number' &&
        typeof event.velocity === 'number' &&
        typeof event.duration === 'number' &&
        typeof event.channel === 'string';
    case 'pattern':
      return typeof event.patternId === 'string' && typeof event.trackId === 'string';
    default:
      return false;
  }
}

export function encodeMusicalEvent(event: FoundationMusicalEvent): string | null {
  if (!isValidMusicalEvent(event)) return null;
  return JSON.stringify(event);
}

export function decodeMusicalEvent(raw: string): FoundationMusicalEvent | null {
  try {
    var parsed = JSON.parse(raw);
    if (!isValidMusicalEvent(parsed)) return null;
    return parsed as FoundationMusicalEvent;
  } catch {
    return null;
  }
}

export type FoundationChannelListener = (event: FoundationMusicalEvent) => void;
export type FoundationUnsubscribe = () => void;

export interface FoundationChannel {
  readonly name: string;
  subscribe(listener: FoundationChannelListener): FoundationUnsubscribe;
  publish(event: FoundationMusicalEvent): void;
  close(): void;
}

export class FoundationInMemoryChannel implements FoundationChannel {
  readonly name: string;
  private listeners: FoundationChannelListener[];
  private closed: boolean;

  constructor(name: string) {
    this.name = name || 'in-memory';
    this.listeners = [];
    this.closed = false;
  }

  subscribe(listener: FoundationChannelListener): FoundationUnsubscribe {
    if (this.closed) throw new Error('Channel "' + this.name + '" is closed');

    this.listeners.push(listener);
    var self = this;

    return function () {
      var idx = self.listeners.indexOf(listener);
      if (idx !== -1) self.listeners.splice(idx, 1);
    };
  }

  publish(event: FoundationMusicalEvent): void {
    if (this.closed) return;

    var snapshot = this.listeners.slice();
    for (var i = 0; i < snapshot.length; i++) {
      snapshot[i](event);
    }
  }

  close(): void {
    this.closed = true;
    this.listeners = [];
  }

  get subscriberCount(): number {
    return this.listeners.length;
  }

  get isClosed(): boolean {
    return this.closed;
  }
}
