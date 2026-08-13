import type { ProtocolMessage } from '../protocol/messages.ts';

export interface FoundationEventShape {
  type: string;
  channel: number;
  data: Record<string, number>;
}

const ALLOWED_TYPES = ['note_on', 'note_off', 'control', 'clock'];

export function toFoundationEvent(message: ProtocolMessage): FoundationEventShape {
  const data: Record<string, number> = {};

  for (const key of Object.keys(message.payload)) {
    data[key] = message.payload[key];
  }

  return { type: message.type, channel: message.channel, data: data };
}

export function fromFoundationEvent(event: FoundationEventShape): ProtocolMessage | null {
  if (!event || typeof event.type !== 'string') return null;
  if (typeof event.channel !== 'number') return null;
  if (ALLOWED_TYPES.indexOf(event.type) === -1) return null;

  const payload: Record<string, number> = {};
  const data = event.data || {};

  for (const key of Object.keys(data)) {
    const value = data[key];
    if (typeof value === 'number') payload[key] = value;
  }

  return {
    type: event.type as ProtocolMessage['type'],
    channel: event.channel,
    payload: payload
  };
}
