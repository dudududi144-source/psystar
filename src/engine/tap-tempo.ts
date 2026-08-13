export var MIN_TAP_BPM = 60;
export var MAX_TAP_BPM = 180;
export var TAP_RESET_MS = 2000;
export var MAX_TAPS = 8;

export function tapsToBpm(taps: number[]): number | null {
  if (!Array.isArray(taps) || taps.length < 2) return null;

  var sorted = taps.slice().sort(function (a, b) {
    return a - b;
  });

  var intervals: number[] = [];
  for (var i = 1; i < sorted.length; i++) {
    var gap = sorted[i] - sorted[i - 1];
    if (gap > 0 && gap <= TAP_RESET_MS) intervals.push(gap);
  }

  if (intervals.length === 0) return null;

  var sum = 0;
  for (var j = 0; j < intervals.length; j++) sum += intervals[j];

  var avg = sum / intervals.length;
  var bpm = 60000 / avg;

  return Math.max(MIN_TAP_BPM, Math.min(MAX_TAP_BPM, Math.round(bpm)));
}

export function recordTap(taps: number[], now: number): number[] {
  if (!Array.isArray(taps) || taps.length === 0) return [now];

  var last = taps[taps.length - 1];
  if (now - last > TAP_RESET_MS) return [now];

  var next = taps.slice();
  next.push(now);

  if (next.length > MAX_TAPS) {
    next = next.slice(next.length - MAX_TAPS);
  }

  return next;
}
