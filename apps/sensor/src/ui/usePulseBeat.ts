import { useEffect, useRef, useState } from "react";
import {
  isNewPulseReading,
  pulseBeatEmphasisMs,
  pulseReadingAtMs,
  type PulseReading,
} from "../product/pulseMotion";

export type PulseBeat = { count: number; bpm: number | null };

export function usePulseBeat(
  reading: PulseReading,
  listening: boolean,
): PulseBeat {
  const [beat, setBeat] = useState<PulseBeat>({ count: 0, bpm: null });
  const lastReadingAtMs = useRef<number | null>(null);
  const { hr, hrAgeMs, hrStatus } = reading;
  useEffect(() => {
    if (!listening) return;
    const readingAtMs = pulseReadingAtMs({ hr, hrAgeMs, hrStatus }, Date.now());
    if (!isNewPulseReading(lastReadingAtMs.current, readingAtMs)) return;
    lastReadingAtMs.current = readingAtMs;
    setBeat((previous) => ({ count: previous.count + 1, bpm: hr }));
  }, [listening, hr, hrAgeMs, hrStatus]);
  return beat;
}

export function useBeatEmphasis(beatCount: number): boolean {
  const [settledBeatCount, setSettledBeatCount] = useState(beatCount);
  useEffect(() => {
    const timer = setTimeout(
      () => setSettledBeatCount(beatCount),
      pulseBeatEmphasisMs,
    );
    return () => clearTimeout(timer);
  }, [beatCount]);
  return beatCount !== settledBeatCount;
}
