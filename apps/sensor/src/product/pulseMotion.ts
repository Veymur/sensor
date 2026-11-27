export const contourSettleDurationMs = 720;
export const sessionContourPhaseStep = 0.45;
export const readyContourPhaseStep = 0.3;
export const sessionContourRestingEnergy = 0.8;
export const readyContourRestingEnergy = 0.7;
export const pulseBeatEmphasisMs = 180;
export const minimumGapBetweenReadingsMs = 400;

export type PulseReading = {
  hr: number | null;
  hrAgeMs: number | null;
  hrStatus: "fresh" | "stale" | "missing";
};

export type ContourMotion = { phase: number; energy: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function pulseReadingAtMs(
  reading: PulseReading,
  nowMs: number,
): number | null {
  if (
    reading.hrStatus !== "fresh" ||
    reading.hr === null ||
    reading.hrAgeMs === null
  )
    return null;
  return nowMs - reading.hrAgeMs;
}

export function isNewPulseReading(
  previousReadingAtMs: number | null,
  readingAtMs: number | null,
): boolean {
  if (readingAtMs === null) return false;
  if (previousReadingAtMs === null) return true;
  return readingAtMs - previousReadingAtMs >= minimumGapBetweenReadingsMs;
}

export function sessionContourEnergy(bpm: number): number {
  return clamp((bpm - 70) / 80, 0.45, 1);
}

export function readyContourEnergy(bpm: number): number {
  return clamp(0.55 + (bpm - 74) * 0.05, 0.55, 0.8);
}

export function contourSettleFrame(
  from: ContourMotion,
  to: ContourMotion,
  elapsedMs: number,
  durationMs = contourSettleDurationMs,
): ContourMotion & { done: boolean } {
  const progress = durationMs <= 0 ? 1 : clamp(elapsedMs / durationMs, 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  return {
    phase: from.phase + (to.phase - from.phase) * eased,
    energy: from.energy + (to.energy - from.energy) * eased,
    done: progress >= 1,
  };
}
