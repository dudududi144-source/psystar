import { existsSync } from 'node:fs';

const requiredFiles = [
  'package.json',
  'README.md',
  'tsconfig.json',
  'src/index.ts',
  'src/main.ts',
  'src/app.ts',
  'src/core/result.ts',
  'src/core/event-bus.ts',
  'src/domain/pattern.ts',
  'src/domain/scene.ts',
  'src/domain/song.ts',
  'src/domain/euclidean.ts',
  'src/domain/preset.ts',
  'src/domain/journey.ts',
  'src/domain/library.ts',
  'src/protocol/codec.ts',
  'src/engine/scheduler.ts',
  'src/engine/lookahead-scheduler.ts',
  'src/engine/envelope.ts',
  'src/engine/voice-manager.ts',
  'src/engine/effects-rack.ts',
  'src/engine/foundation-adapter.ts',
  'src/engine/midi-driver.ts',
  'src/engine/recorder.ts',
  'src/integration/foundation-bridge.ts',
  'src/integration/device-registry.ts',
  'src/integration/sync-protocol.ts',
  'tests/core.test.ts',
  'tests/integration.test.ts',
  'tests/scene.test.ts',
  'tests/lookahead.test.ts',
  'tests/envelope.test.ts',
  'tests/voice-manager.test.ts',
  'tests/effects-rack.test.ts',
  'tests/song.test.ts',
  'tests/euclidean.test.ts',
  'tests/preset.test.ts',
  'tests/journey.test.ts',
  'tests/library.test.ts',
  'tests/foundation-bridge.test.ts',
  'tests/device-registry.test.ts',
  'tests/sync-protocol.test.ts',
  'tests/midi-driver.test.ts',
  'tests/recorder.test.ts',
  'web/index.html',
  'docs/design.md',
  'docs/integration.md'
];

let failed = false;

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.error('missing required file: ' + file);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('structure check passed - PSYSTAR skeleton is canonical');
