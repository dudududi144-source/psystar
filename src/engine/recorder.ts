export interface RecordedEvent {
  time: number;
  type: string;
  data: Record<string, number>;
}

export class SessionRecorder {
  private events: RecordedEvent[];
  private recording: boolean;
  private startTime: number;
  private lastTime: number;

  constructor() {
    this.events = [];
    this.recording = false;
    this.startTime = 0;
    this.lastTime = 0;
  }

  start(now: number): void {
    this.recording = true;
    this.startTime = now;
    this.lastTime = now;
    this.events = [];
  }

  stop(): void {
    this.recording = false;
  }

  isRecording(): boolean {
    return this.recording;
  }

  record(now: number, type: string, data: Record<string, number>): boolean {
    if (!this.recording) return false;

    this.lastTime = now;
    this.events.push({
      time: now - this.startTime,
      type: type,
      data: Object.assign({}, data)
    });

    return true;
  }

  duration(): number {
    if (this.events.length === 0) return 0;
    return this.lastTime - this.startTime;
  }

  count(): number {
    return this.events.length;
  }

  take(): RecordedEvent[] {
    var copy = this.events.slice();
    this.events = [];
    return copy;
  }
}
