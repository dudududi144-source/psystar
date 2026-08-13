export interface EnvelopeParams {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function createEnvelope(attack: number, decay: number, sustain: number, release: number): EnvelopeParams {
  return {
    attack: Math.max(0, attack),
    decay: Math.max(0, decay),
    sustain: Math.min(1, Math.max(0, sustain)),
    release: Math.max(0, release)
  };
}

export function envelopeValueAt(env: EnvelopeParams, t: number, gateDuration: number): number {
  if (t < 0) return 0;

  if (t < env.attack) {
    return env.attack > 0 ? t / env.attack : 1;
  }

  var afterAttack = t - env.attack;

  if (afterAttack < env.decay) {
    var dp = env.decay > 0 ? afterAttack / env.decay : 1;
    return 1 - (1 - env.sustain) * dp;
  }

  if (t < gateDuration) {
    return env.sustain;
  }

  var releaseT = t - gateDuration;
  if (env.release > 0 && releaseT < env.release) {
    return env.sustain * (1 - releaseT / env.release);
  }

  return 0;
}
