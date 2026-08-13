export interface VoiceSlot {
  id: number;
  active: boolean;
  startedAt: number;
}

export class VoiceManager {
  private capacity: number;
  private slots: VoiceSlot[];
  private counter: number;

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.slots = [];
    for (var i = 0; i < this.capacity; i++) {
      this.slots.push({ id: 0, active: false, startedAt: 0 });
    }
    this.counter = 0;
  }

  allocate(time: number): number {
    for (var i = 0; i < this.capacity; i++) {
      if (!this.slots[i].active) {
        return this.activate(i, time);
      }
    }
    return this.activate(this.findOldest(), time);
  }

  release(index: number): void {
    if (index >= 0 && index < this.capacity) {
      this.slots[index].active = false;
    }
  }

  releaseAll(): void {
    for (var i = 0; i < this.capacity; i++) {
      this.slots[i].active = false;
    }
  }

  activeCount(): number {
    var count = 0;
    for (var i = 0; i < this.capacity; i++) {
      if (this.slots[i].active) count++;
    }
    return count;
  }

  capacityOf(): number {
    return this.capacity;
  }

  private activate(index: number, time: number): number {
    this.counter += 1;
    this.slots[index] = { id: this.counter, active: true, startedAt: time };
    return index;
  }

  private findOldest(): number {
    var oldest = 0;
    var min = Infinity;
    for (var i = 0; i < this.capacity; i++) {
      if (this.slots[i].startedAt < min) {
        min = this.slots[i].startedAt;
        oldest = i;
      }
    }
    return oldest;
  }
}
