import type { Pattern } from '../domain/pattern.ts';
import { stepAt } from '../domain/pattern.ts';
import type { ProtocolMessage } from '../protocol/messages.ts';
import type { EventBus } from '../core/event-bus.ts';

export class Scheduler {
  private pattern: Pattern;
  private bus: EventBus<ProtocolMessage>;

  constructor(pattern: Pattern, bus: EventBus<ProtocolMessage>) {
    this.pattern = pattern;
    this.bus = bus;
  }

  tick(stepIndex: number): void {
    const step = stepAt(this.pattern, stepIndex);

    if (!step.active) {
      return;
    }

    const message: ProtocolMessage = {
      type: 'note_on',
      channel: step.channel ?? 0,
      payload: {
        note: step.note ?? 60,
        velocity: step.velocity
      }
    };

    this.bus.emit(message);
  }
}
