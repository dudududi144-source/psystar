export interface ManualClock {
  start(intervalMs: number): void;
  stop(): void;
  tick(): void;
}

export function createManualClock(onTick: (tickIndex: number) => void): ManualClock {
  let tickIndex = 0;
  let running = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  return {
    start(intervalMs: number) {
      if (running) return;

      running = true;

      timer = setInterval(() => {
        tickIndex += 1;
        onTick(tickIndex);
      }, intervalMs);
    },

    stop() {
      if (timer) {
        clearInterval(timer);
      }

      timer = null;
      running = false;
    },

    tick() {
      tickIndex += 1;
      onTick(tickIndex);
    }
  };
}
