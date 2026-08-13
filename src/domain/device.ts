import type { EventBus } from '../core/event-bus.ts';
import type { Logger } from '../core/logger.ts';

export interface DeviceContext {
  logger: Logger;
  bus: EventBus<unknown>;
}

export interface Device {
  name: string;
  start(): void;
  stop(): void;
}

export function createDevice(name: string, start: () => void, stop: () => void): Device {
  return { name, start, stop };
}
