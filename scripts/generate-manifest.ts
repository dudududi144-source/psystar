import { readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceFiles: walk('src'),
  testFiles: walk('tests'),
  docsFiles: walk('docs')
};

writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest.json generated');
