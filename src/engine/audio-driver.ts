export interface AudioDriver {
  trigger(note: number, velocity: number): void;
}

export class NullAudioDriver implements AudioDriver {
  trigger(_note: number, _velocity: number): void {
    return;
  }
}
