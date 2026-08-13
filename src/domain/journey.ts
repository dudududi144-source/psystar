export type JourneyEventType = 'step' | 'scene' | 'start' | 'stop';

export interface JourneyEvent {
  time: number;
  type: JourneyEventType;
  data: Record<string, number>;
}

export interface Journey {
  name: string;
  bpm: number;
  duration: number;
  events: JourneyEvent[];
}

var JOURNEY_EVENT_TYPES: JourneyEventType[] = ['step', 'scene', 'start', 'stop'];

export function createJourney(name: string, bpm: number, events: JourneyEvent[]): Journey {
  var duration = 0;

  for (var i = 0; i < events.length; i++) {
    if (events[i].time > duration) duration = events[i].time;
  }

  return {
    name: name,
    bpm: bpm,
    duration: duration,
    events: events.slice()
  };
}

export function isValidEvent(event: JourneyEvent): boolean {
  if (!event) return false;
  if (JOURNEY_EVENT_TYPES.indexOf(event.type) === -1) return false;
  if (typeof event.time !== 'number' || event.time < 0) return false;
  if (!event.data || typeof event.data !== 'object') return false;

  return true;
}

export function isValidJourney(journey: Journey): boolean {
  if (!journey || typeof journey.name !== 'string') return false;
  if (typeof journey.bpm !== 'number' || journey.bpm <= 0) return false;
  if (!Array.isArray(journey.events)) return false;

  for (var i = 0; i < journey.events.length; i++) {
    if (!isValidEvent(journey.events[i])) return false;
  }

  return true;
}

export function encodeJourney(journey: Journey): string {
  return JSON.stringify(journey);
}

export function decodeJourney(raw: string): Journey | null {
  try {
    var parsed = JSON.parse(raw);
    if (!isValidJourney(parsed)) return null;
    return parsed as Journey;
  } catch {
    return null;
  }
}
