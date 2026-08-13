// Mirror of @psy-foundation/device-sdk v1 (canonical candidate).
// Transport is passed as the serializable TransportState because the
// foundation transport is not canonical yet (FOUNDATION_STATUS.md).

import type { FoundationMusicalEvent } from './foundation-protocol.ts';
import { isValidMusicalEvent } from './foundation-protocol.ts';

export interface FoundationTransportState {
  bpm: number;
  beat: number;
  bar: number;
  phase: number;
  locked: boolean;
  confidence: number;
  revision: number;
}

export interface FoundationMusicalContext {
  key: string;
  rootPc: number;
  scale: string;
  energy: number;
  style: string;
  section: string;
  beatsPerBar: number;
}

export interface FoundationDeviceCapabilities {
  audio: boolean;
  midi: boolean;
  inputs: number;
  outputs: number;
  voices: number;
  latencyMs: number;
  roles: string[];
}

export interface FoundationPsyDevice {
  id: string;
  capabilities(): FoundationDeviceCapabilities;
  onTransport(state: FoundationTransportState): void;
  onContext(context: FoundationMusicalContext): void;
  onEvent(event: FoundationMusicalEvent): void;
  onStart?(): void;
  onStop?(): void;
  reportLatencyMs?(): number;
}

export interface PsystarDeviceOptions {
  id?: string;
  voices?: number;
}

export class PsystarDevice implements FoundationPsyDevice {
  id: string;
  private voiceCount: number;
  private lastTransport: FoundationTransportState | null;
  private lastContext: FoundationMusicalContext | null;
  private eventCount: number;
  private started: boolean;
  private stopped: boolean;
  private handler: ((event: FoundationMusicalEvent) => void) | null;

  constructor(opts: PsystarDeviceOptions) {
    this.id = (opts && opts.id) || 'psystar';
    this.voiceCount = (opts && opts.voices) || 28;
    this.lastTransport = null;
    this.lastContext = null;
    this.eventCount = 0;
    this.started = false;
    this.stopped = false;
    this.handler = null;
  }

  capabilities(): FoundationDeviceCapabilities {
    return {
      audio: true,
      midi: true,
      inputs: 2,
      outputs: 2,
      voices: this.voiceCount,
      latencyMs: 12,
      roles: ['instrument', 'sequencer', 'visualizer', 'bridge']
    };
  }

  onTransport(state: FoundationTransportState): void {
    this.lastTransport = state;
  }

  onContext(context: FoundationMusicalContext): void {
    this.lastContext = context;
  }

  onEvent(event: FoundationMusicalEvent): void {
    if (!isValidMusicalEvent(event)) return;

    this.eventCount++;
    if (this.handler) this.handler(event);
  }

  onStart(): void {
    this.started = true;
  }

  onStop(): void {
    this.stopped = true;
  }

  reportLatencyMs(): number {
    return 12;
  }

  setEventHandler(handler: (event: FoundationMusicalEvent) => void): void {
    this.handler = handler;
  }

  get eventsReceived(): number {
    return this.eventCount;
  }

  get isStarted(): boolean {
    return this.started;
  }

  get isStopped(): boolean {
    return this.stopped;
  }

  get lastKnownTransport(): FoundationTransportState | null {
    return this.lastTransport;
  }

  get lastKnownContext(): FoundationMusicalContext | null {
    return this.lastContext;
  }
}
