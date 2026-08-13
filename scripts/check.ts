import { existsSync } from 'node:fs';

const requiredFiles = [
  'package.json',
  'README.md',
  'tsconfig.json',
  'src/index.ts',
  'src/main.ts',
  'src/app.ts',
  'tests/core.test.ts',
  'tests/integration.test.ts',
  'web/index.html',
  'docs/design.md'
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
