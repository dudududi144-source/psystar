export type Listener<T> = (payload: T) => void;
export type Unsubscribe = () => void;

export class EventBus<T> {
  private listeners = new Set<Listener<T>>();

  on(listener: Listener<T>): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(payload: T): void {
    for (const listener of this.listeners) {
      listener(payload);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
