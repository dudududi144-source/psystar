import type { ProtocolMessage } from './messages.ts';

export function encodeMessage(message: ProtocolMessage): string {
  return JSON.stringify(message);
}

export function decodeMessage(raw: string): ProtocolMessage | null {
  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.type !== 'string') return null;
    if (typeof parsed.channel !== 'number') return null;
    if (!parsed.payload || typeof parsed.payload !== 'object') return null;

    return parsed as ProtocolMessage;
  } catch {
    return null;
  }
}
