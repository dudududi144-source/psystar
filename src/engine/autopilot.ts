export type AutopilotAction = 'mutate' | 'groove' | 'scene' | 'progression' | 'rest';

export interface AutopilotDecision {
  action: AutopilotAction;
  strength: number;
}

export function chooseAction(random: () => number): AutopilotDecision {
  var roll = random();

  if (roll < 0.30) {
    return { action: 'mutate', strength: 0.05 + random() * 0.10 };
  }

  if (roll < 0.50) {
    return { action: 'groove', strength: random() };
  }

  if (roll < 0.70) {
    return { action: 'scene', strength: random() };
  }

  if (roll < 0.85) {
    return { action: 'progression', strength: random() };
  }

  return { action: 'rest', strength: 0 };
}
