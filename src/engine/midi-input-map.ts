export function mapMidiNoteToRow(note: number): number {
  if (note < 48) return 0;
  if (note < 72) return 1;
  if (note < 84) return 2;
  return 3;
}

export function isNoteOn(status: number, velocity: number): boolean {
  var type = status & 0xf0;
  return type === 0x90 && velocity > 0;
}

export function isNoteOff(status: number, velocity: number): boolean {
  var type = status & 0xf0;
  return type === 0x80 || (type === 0x90 && velocity === 0);
}

export function midiChannelOf(status: number): number {
  return status & 0x0f;
}

export function normalizeVelocity(velocity: number): number {
  return Math.max(0, Math.min(1, velocity / 127));
}
