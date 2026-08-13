import { test, expect } from 'bun:test';
import { encodeWav, wavByteLength } from '../src/engine/wav-encoder.ts';

test('wavByteLength computes header plus stereo pcm', () => {
  expect(wavByteLength(0)).toBe(44);
  expect(wavByteLength(10)).toBe(44 + 40);
  expect(wavByteLength(-5)).toBe(44);
});

test('encodeWav writes riff header', () => {
  const bytes = encodeWav({
    left: new Float32Array(2),
    right: new Float32Array(2),
    sampleRate: 44100
  });

  expect(bytes.length).toBe(wavByteLength(2));

  const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  const wave = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);

  expect(magic).toBe('RIFF');
  expect(wave).toBe('WAVE');
});

test('encodeWav writes sample rate and channel count', () => {
  const bytes = encodeWav({
    left: new Float32Array(1),
    right: new Float32Array(1),
    sampleRate: 48000
  });

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  expect(view.getUint16(22, true)).toBe(2);
  expect(view.getUint32(24, true)).toBe(48000);
  expect(view.getUint16(34, true)).toBe(16);
});

test('encodeWav converts samples to 16-bit little endian', () => {
  const bytes = encodeWav({
    left: new Float32Array([1.0]),
    right: new Float32Array([-1.0]),
    sampleRate: 44100
  });

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  expect(view.getInt16(44, true)).toBe(0x7fff);
  expect(view.getInt16(46, true)).toBe(-0x8000);
});

test('encodeWav clamps out-of-range samples', () => {
  const bytes = encodeWav({
    left: new Float32Array([5.0]),
    right: new Float32Array([-5.0]),
    sampleRate: 44100
  });

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  expect(view.getInt16(44, true)).toBe(0x7fff);
  expect(view.getInt16(46, true)).toBe(-0x8000);
});

test('encodeWav uses shorter channel length', () => {
  const bytes = encodeWav({
    left: new Float32Array(4),
    right: new Float32Array(2),
    sampleRate: 44100
  });

  expect(bytes.length).toBe(wavByteLength(2));
});
