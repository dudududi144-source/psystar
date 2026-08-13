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
  'src/core/history.ts',
  'src/domain/pattern.ts',
  'src/domain/scene.ts',
  'src/domain/song.ts',
  'src/domain/euclidean.ts',
  'src/domain/preset.ts',
  'src/domain/journey.ts',
  'src/domain/library.ts',
  'src/domain/accent.ts',
  'src/domain/harmony.ts',
  'src/domain/evolution.ts',
  'src/domain/pack.ts',
  'src/domain/velocity.ts',
  'src/domain/roll.ts',
  'src/protocol/codec.ts',
  'src/engine/scheduler.ts',
  'src/engine/lookahead-scheduler.ts',
  'src/engine/envelope.ts',
  'src/engine/voice-manager.ts',
  'src/engine/effects-rack.ts',
  'src/engine/foundation-adapter.ts',
  'src/engine/midi-driver.ts',
  'src/engine/recorder.ts',
  'src/engine/tap-tempo.ts',
  'src/engine/humanizer.ts',
  'src/engine/midi-input-map.ts',
  'src/integration/foundation-bridge.ts',
  'src/integration/device-registry.ts',
  'src/integration/sync-protocol.ts',
  'src/integration/p2p-signaling.ts',
  'src/integration/foundation-protocol.ts',
  'src/integration/foundation-device.ts',
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
  'tests/pwa.test.ts',
  'tests/tap-tempo.test.ts',
  'tests/history.test.ts',
  'tests/midi-input-map.test.ts',
  'tests/humanizer.test.ts',
  'tests/accent.test.ts',
  'tests/harmony.test.ts',
  'tests/evolution.test.ts',
  'tests/pack.test.ts',
  'tests/velocity.test.ts',
  'tests/roll.test.ts',
  'tests/foundation-bridge.test.ts',
  'tests/device-registry.test.ts',
  'tests/sync-protocol.test.ts',
  'tests/p2p-signaling.test.ts',
  'tests/foundation-protocol.test.ts',
  'tests/foundation-device.test.ts',
  'tests/midi-driver.test.ts',
  'tests/recorder.test.ts',
  'web/index.html',
  'web/manifest.webmanifest',
  'web/sw.js',
  'web/icons/icon-192.png',
  'web/icons/icon-512.png',
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
