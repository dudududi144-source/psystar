export interface TransportState {
  bpm: number;
  currentStep: number;
  running: boolean;
}

export function createTransport(bpm: number): TransportState {
  return {
    bpm,
    currentStep: 0,
    running: false
  };
}

export function startTransport(state: TransportState): TransportState {
  return { ...state, running: true };
}

export function stopTransport(state: TransportState): TransportState {
  return { ...state, running: false };
}

export function advanceTransport(state: TransportState): TransportState {
  return { ...state, currentStep: state.currentStep + 1 };
}
