export type EditorialScrollState = {
  progress: number;
  mediaProgress: number;
  overlayProgress: number;
  copyOpacity: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (start: number, end: number, value: number) => {
  const normalized = clamp01((value - start) / (end - start));
  return normalized * normalized * (3 - 2 * normalized);
};

export function getEditorialScrollState(rawProgress: number): EditorialScrollState {
  const progress = clamp01(rawProgress);

  return {
    progress,
    mediaProgress: smoothstep(0.18, 0.55, progress),
    overlayProgress: smoothstep(0.68, 0.82, progress),
    copyOpacity: 1 - smoothstep(0.18, 0.34, progress),
  };
}
