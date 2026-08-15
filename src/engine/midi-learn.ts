export interface CcMapping {
  cc: number;
  target: string;
}

export interface CcMap {
  mappings: CcMapping[];
}

export function createCcMap(): CcMap {
  return { mappings: [] };
}

export function isValidCc(cc: number): boolean {
  return typeof cc === 'number' && !isNaN(cc) && cc >= 0 && cc <= 127;
}

export function addMapping(map: CcMap, cc: number, target: string): CcMap {
  if (!map || !Array.isArray(map.mappings)) return map;
  if (!isValidCc(cc)) return map;
  if (typeof target !== 'string' || target.length === 0) return map;

  var kept = map.mappings.filter(function (m) {
    return m.cc !== cc && m.target !== target;
  });

  kept.push({ cc: Math.floor(cc), target: target });

  return { mappings: kept };
}

export function removeMapping(map: CcMap, cc: number): CcMap {
  if (!map || !Array.isArray(map.mappings)) return map;

  return {
    mappings: map.mappings.filter(function (m) {
      return m.cc !== cc;
    })
  };
}

export function findTarget(map: CcMap, cc: number): string | null {
  if (!map || !Array.isArray(map.mappings)) return null;

  for (var i = 0; i < map.mappings.length; i++) {
    if (map.mappings[i].cc === cc) return map.mappings[i].target;
  }

  return null;
}

export function scaleCc(value: number, min: number, max: number): number {
  var v = Math.max(0, Math.min(127, Math.floor(value)));
  var lo = Math.min(min, max);
  var hi = Math.max(min, max);

  return lo + (v / 127) * (hi - lo);
}


export interface CcTargetSpec {
  min: number;
  max: number;
  label: string;
}

export var MASTERING_CC_SPECS: Record<string, CcTargetSpec> = {
  masterDb: { min: -24, max: 6, label: 'מאסטר dB' },
  compThreshold: { min: -40, max: 0, label: 'סף קומפרסיה' },
  compRatio: { min: 1, max: 20, label: 'יחס קומפרסיה' },
  eqLow: { min: -12, max: 12, label: 'EQ בס' },
  eqMid: { min: -12, max: 12, label: 'EQ אמצע' },
  eqHigh: { min: -12, max: 12, label: 'EQ גבוה' }
};

export function isMasteringTarget(name: string): boolean {
  return typeof name === 'string' && Object.prototype.hasOwnProperty.call(MASTERING_CC_SPECS, name);
}
