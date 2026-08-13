export class History<T> {
  private past: T[];
  private present: T | null;
  private future: T[];
  private limit: number;

  constructor(limit: number) {
    this.past = [];
    this.present = null;
    this.future = [];
    this.limit = Math.max(1, limit);
  }

  push(state: T): void {
    if (this.present !== null) this.past.push(this.present);
    if (this.past.length > this.limit) this.past.shift();

    this.present = state;
    this.future = [];
  }

  undo(): T | null {
    if (this.past.length === 0) return this.present;

    var prev = this.past.pop() as T;
    if (this.present !== null) this.future.push(this.present);
    this.present = prev;

    return this.present;
  }

  redo(): T | null {
    if (this.future.length === 0) return this.present;

    var next = this.future.pop() as T;
    if (this.present !== null) this.past.push(this.present);
    this.present = next;

    return this.present;
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  current(): T | null {
    return this.present;
  }

  size(): number {
    return this.past.length + this.future.length + (this.present !== null ? 1 : 0);
  }
}
