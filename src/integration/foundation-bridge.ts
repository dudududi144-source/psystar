import type { EventBus, Unsubscribe } from '../core/event-bus.ts';
import type { ProtocolMessage } from '../protocol/messages.ts';
import type { FoundationEventShape } from '../engine/foundation-adapter.ts';
import { toFoundationEvent, fromFoundationEvent } from '../engine/foundation-adapter.ts';

export interface BridgePort {
  send(event: FoundationEventShape): void;
}

export interface BridgeCounters {
  sent: number;
  received: number;
}

export class FoundationBridge {
  private bus: EventBus<ProtocolMessage>;
  private port: BridgePort;
  private sentCount: number;
  private receivedCount: number;

  constructor(bus: EventBus<ProtocolMessage>, port: BridgePort) {
    this.bus = bus;
    this.port = port;
    this.sentCount = 0;
    this.receivedCount = 0;
  }

  attach(): Unsubscribe {
    var self = this;
    return this.bus.on(function (message) {
      self.sentCount += 1;
      self.port.send(toFoundationEvent(message));
    });
  }

  ingest(event: FoundationEventShape): boolean {
    var message = fromFoundationEvent(event);
    if (!message) return false;

    this.receivedCount += 1;
    this.bus.emit(message);
    return true;
  }

  counters(): BridgeCounters {
    return { sent: this.sentCount, received: this.receivedCount };
  }
}
