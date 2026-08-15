export interface TimelineMarker {
  position: number;
  type: string;
  time: number;
}

export function journeyDuration(events: { time: number }[]): number {
  if (!Array.isArray(events) || events.length === 0) return 0;

  var max = 0;

  for (var i = 0; i < events.length; i++) {
    if (events[i].time > max) max = events[i].time;
  }

  return max;
}

export function mapToTimeline(events: { time: number; type: string }[], duration: number): TimelineMarker[] {
  if (!Array.isArray(events) || duration <= 0) return [];

  var markers = events.map(function (e) {
    return {
      position: Math.max(0, Math.min(1, e.time / duration)),
      type: e.type,
      time: e.time
    };
  });

  markers.sort(function (a, b) {
    return a.time - b.time;
  });

  return markers;
}

export function countByType(events: { type: string }[]): Record<string, number> {
  var counts: Record<string, number> = {};

  if (!Array.isArray(events)) return counts;

  for (var i = 0; i < events.length; i++) {
    var type = events[i].type;

    counts[type] = (counts[type] || 0) + 1;
  }

  return counts;
}
