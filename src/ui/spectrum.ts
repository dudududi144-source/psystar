export function spectrumBars(freqData: Uint8Array, count: number, startBin: number): number[] {
  var bars: number[] = [];
  var n = Math.max(1, Math.floor(count));
  var start = Math.max(0, Math.floor(startBin));

  for (var i = 0; i < n; i++) {
    var bin = start + i;
    var v = bin < freqData.length ? freqData[bin] : 0;

    bars.push(Math.max(0, Math.min(1, v / 255)));
  }

  return bars;
}

export function smoothSpectrum(current: number[], next: number[], alpha: number): number[] {
  var a = Math.max(0, Math.min(1, alpha));
  var out: number[] = [];
  var n = Math.max(current.length, next.length);

  for (var i = 0; i < n; i++) {
    var c = i < current.length ? current[i] : 0;
    var nx = i < next.length ? next[i] : 0;

    out.push(c + (nx - c) * a);
  }

  return out;
}
