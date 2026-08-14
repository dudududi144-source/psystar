export interface SongStepSpec {
  sceneIndex: number;
  bars: number;
}

export interface RenderSegment {
  grid: boolean[][];
  bars: number;
}

export function buildRenderSegments(steps: SongStepSpec[], scenes: boolean[][][]): RenderSegment[] {
  var segments: RenderSegment[] = [];

  if (!Array.isArray(steps) || !Array.isArray(scenes)) return segments;

  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];

    if (!step || typeof step.sceneIndex !== 'number') continue;

    var grid = scenes[step.sceneIndex];
    if (!Array.isArray(grid)) continue;

    segments.push({ grid: grid, bars: Math.max(1, Math.floor(step.bars)) });
  }

  return segments;
}

export function totalSegmentSteps(segments: RenderSegment[]): number {
  var total = 0;

  if (!Array.isArray(segments)) return 0;

  for (var i = 0; i < segments.length; i++) {
    total += Math.max(0, Math.floor(segments[i].bars)) * 16;
  }

  return total;
}

export function gridAtStep(segments: RenderSegment[], stepIndex: number): boolean[][] | null {
  if (!Array.isArray(segments) || segments.length === 0) return null;

  var remaining = Math.max(0, Math.floor(stepIndex));

  for (var i = 0; i < segments.length; i++) {
    var segSteps = Math.max(0, Math.floor(segments[i].bars)) * 16;

    if (remaining < segSteps) return segments[i].grid;

    remaining -= segSteps;
  }

  return null;
}
