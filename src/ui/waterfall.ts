export function spectrumToWaterfallRow(freqData: Uint8Array, bins: number, startBin: number): number[] {
  var row: number[] = [];
  var n = Math.max(1, Math.floor(bins));
  var start = Math.max(0, Math.floor(startBin));

  for (var i = 0; i < n; i++) {
    var bin = start + i;
    var v = bin < freqData.length ? freqData[bin] / 255 : 0;

    row.push(Math.max(0, Math.min(1, v)));
  }

  return row;
}

export function waterfallColor(value: number): [number, number, number] {
  var v = Math.max(0, Math.min(1, value));

  if (v <= 0.02) return [5, 2, 15];

  if (v < 0.3) {
    var t1 = v / 0.3;

    return [Math.round(5 + t1 * 118), Math.round(2 + t1 * 45), Math.round(15 + t1 * 232)];
  }

  if (v < 0.6) {
    var t2 = (v - 0.3) / 0.3;

    return [Math.round(123 + t2 * 132), Math.round(47 - t2 * 4), Math.round(247 - t2 * 33)];
  }

  if (v < 0.85) {
    var t3 = (v - 0.6) / 0.25;

    return [Math.round(255 - t3 * 255), Math.round(43 + t3 * 197), Math.round(214 + t3 * 41)];
  }

  var t4 = (v - 0.85) / 0.15;

  return [Math.round(0 + t4 * 255), Math.round(240 + t4 * 15), Math.round(255)];
}

export function rowBrightness(row: number[]): number {
  if (!Array.isArray(row) || row.length === 0) return 0;

  var sum = 0;

  for (var i = 0; i < row.length; i++) {
    sum += Math.max(0, Math.min(1, row[i]));
  }

  return sum / row.length;
}
