export interface WavInput {
  left: Float32Array;
  right: Float32Array;
  sampleRate: number;
}

export function wavByteLength(numFrames: number): number {
  return 44 + Math.max(0, Math.floor(numFrames)) * 4;
}

function floatTo16(value: number): number {
  var clamped = Math.max(-1, Math.min(1, value));

  return clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
}

function writeString(view: DataView, offset: number, text: string): void {
  for (var i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

export function encodeWav(input: WavInput): Uint8Array {
  var numChannels = 2;
  var sampleRate = Math.max(1, Math.floor(input.sampleRate));
  var numFrames = Math.min(input.left.length, input.right.length);
  var bytesPerSample = 2;
  var blockAlign = numChannels * bytesPerSample;
  var dataSize = numFrames * blockAlign;
  var buffer = new ArrayBuffer(44 + dataSize);
  var view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  var offset = 44;

  for (var i = 0; i < numFrames; i++) {
    view.setInt16(offset, floatTo16(input.left[i]), true);
    offset += 2;
    view.setInt16(offset, floatTo16(input.right[i]), true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}
