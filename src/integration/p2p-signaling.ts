export type SignalKind = 'offer' | 'answer';

export interface SignalEnvelope {
  psystar: string;
  kind: SignalKind;
  payload: Record<string, unknown>;
}

export var SIGNAL_MARKER = 'p2p-signal';

export function encodeSignal(kind: SignalKind, payload: Record<string, unknown>): string {
  return JSON.stringify({
    psystar: SIGNAL_MARKER,
    kind: kind,
    payload: payload
  });
}

export function decodeSignal(raw: string): SignalEnvelope | null {
  try {
    var parsed = JSON.parse(raw);

    if (!parsed || parsed.psystar !== SIGNAL_MARKER) return null;
    if (parsed.kind !== 'offer' && parsed.kind !== 'answer') return null;
    if (!parsed.payload || typeof parsed.payload.type !== 'string') return null;

    return parsed as SignalEnvelope;
  } catch {
    return null;
  }
}
