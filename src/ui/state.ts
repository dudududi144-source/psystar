export interface UiState {
  running: boolean;
  bpm: number;
  status: string;
}

export type UiAction =
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'setBpm'; bpm: number };

export const initialUiState: UiState = {
  running: false,
  bpm: 122,
  status: 'נושם'
};

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case 'start':
      return { ...state, running: true, status: 'במסע' };

    case 'stop':
      return { ...state, running: false, status: 'נח' };

    case 'setBpm':
      return { ...state, bpm: action.bpm };

    default:
      return state;
  }
}
