import { EventBus } from './core/event-bus.ts';
import { createLogger } from './core/logger.ts';
import { createPattern } from './domain/pattern.ts';
import { Scheduler } from './engine/scheduler.ts';
import { NullAudioDriver } from './engine/audio-driver.ts';
import type { ProtocolMessage } from './protocol/messages.ts';
import { uiReducer, initialUiState } from './ui/state.ts';
import { renderStatus } from './ui/render.ts';

export function createPsystarApp() {
  const logger = createLogger('psystar');
  const bus = new EventBus<ProtocolMessage>();
  const audio = new NullAudioDriver();

  const pattern = createPattern([
    { active: true, velocity: 100, note: 36, channel: 0 },
    { active: false, velocity: 0 },
    { active: true, velocity: 80, note: 38, channel: 0 },
    { active: false, velocity: 0 }
  ]);

  const scheduler = new Scheduler(pattern, bus);

  let uiState = initialUiState;

  bus.on((message) => {
    if (message.type === 'note_on') {
      audio.trigger(message.payload.note ?? 60, message.payload.velocity ?? 100);
    }

    logger.log('info', 'protocol message: ' + message.type);
  });

  return {
    logger,
    bus,
    scheduler,
    getState() {
      return uiState;
    },
    start() {
      uiState = uiReducer(uiState, { type: 'start' });
      logger.log('info', renderStatus(uiState));
      scheduler.tick(0);
    },
    stop() {
      uiState = uiReducer(uiState, { type: 'stop' });
      logger.log('info', renderStatus(uiState));
    },
    setBpm(bpm: number) {
      uiState = uiReducer(uiState, { type: 'setBpm', bpm });
      logger.log('info', 'bpm: ' + String(uiState.bpm));
    }
  };
}
