export type MidiSendFn = (bytes: number[]) => void;

export function clamp7(value: number): number {
  if (isNaN(value)) return 0;
  return Math.max(0, Math.min(127, Math.floor(value)));
}

export function clampChannel(channel: number): number {
  if (isNaN(channel)) return 0;
  return Math.max(0, Math.min(15, Math.floor(channel)));
}

export function noteOnBytes(channel: number, note: number, velocity: number): number[] {
  return [0x90 | clampChannel(channel), clamp7(note), clamp7(velocity)];
}

export function noteOffBytes(channel: number, note: number): number[] {
  return [0x80 | clampChannel(channel), clamp7(note), 0x40];
}

export class MidiDriver {
  private send: MidiSendFn;
  private channel: number;
  private activeNotes: Map<number, number>;

  constructor(send: MidiSendFn, channel: number) {
    this.send = send;
    this.channel = clampChannel(channel);
    this.activeNotes = new Map<number, number>();
  }

  trigger(note: number, velocity: number): void {
    var n = clamp7(note);
    this.activeNotes.set(n, clamp7(velocity));
    this.send(noteOnBytes(this.channel, n, velocity));
  }

  release(note: number): void {
    var n = clamp7(note);
    if (!this.activeNotes.has(n)) return;

    this.activeNotes.delete(n);
    this.send(noteOffBytes(this.channel, n));
  }

  panic(): void {
    var notes: number[] = [];

    this.activeNotes.forEach(function (_velocity, note) {
      notes.push(note);
    });

    for (var i = 0; i < notes.length; i++) {
      this.release(notes[i]);
    }
  }

  activeCount(): number {
    return this.activeNotes.size;
  }

  channelOf(): number {
    return this.channel;
  }
}
