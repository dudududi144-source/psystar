import type { UiState } from './state.ts';

export function renderStatus(state: UiState): string {
  if (state.running) {
    return 'PSYSTAR במסע ✦ הקיילודוסקוב נושם';
  }

  return 'PSYSTAR נח ✦ המנדלה עדיין זוהרת';
}
