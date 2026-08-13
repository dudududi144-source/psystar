import { test, expect } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';

test('pwa manifest exists and is valid', () => {
  expect(existsSync('web/manifest.webmanifest')).toBe(true);

  const manifest = JSON.parse(readFileSync('web/manifest.webmanifest', 'utf-8'));

  expect(manifest.name).toContain('PSYSTAR');
  expect(manifest.display).toBe('standalone');
  expect(manifest.dir).toBe('rtl');
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
});

test('service worker exists with install and fetch handlers', () => {
  expect(existsSync('web/sw.js')).toBe(true);

  const sw = readFileSync('web/sw.js', 'utf-8');

  expect(sw.indexOf('install') !== -1).toBe(true);
  expect(sw.indexOf('fetch') !== -1).toBe(true);
  expect(sw.indexOf('activate') !== -1).toBe(true);
});

test('app icons exist as real files', () => {
  expect(existsSync('web/icons/icon-192.png')).toBe(true);
  expect(existsSync('web/icons/icon-512.png')).toBe(true);
});
