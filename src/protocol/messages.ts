export type MessageType = 'note_on' | 'note_off' | 'control' | 'clock';

export interface ProtocolMessage {
  type: MessageType;
  channel: number;
  payload: Record<string, number>;
}
