import type { AffiliateProps } from "./schema";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TRANSITION_FRAMES = 10;

const toFrames = (sec: number) => Math.max(1, Math.round(sec * FPS));

// Lays out hook -> segments -> CTA in composition frames. Used both by
// calculateMetadata (total length) and the component (placing SFX).
export const buildTimeline = (props: AffiliateProps) => {
  const hookFrames = toFrames(props.hook.endSec - props.hook.startSec);
  const segments = props.segments.map((s) => ({
    ...s,
    frames: toFrames(s.endSec - s.startSec),
  }));
  const mainFrames = segments.reduce((sum, s) => sum + s.frames, 0);
  const ctaFrames = toFrames(props.cta.durationSec);

  // Two transitions overlap neighbouring scenes: hook->main, main->CTA.
  const mainStart = hookFrames - TRANSITION_FRAMES;
  const ctaStart = mainStart + mainFrames - TRANSITION_FRAMES;
  const total = ctaStart + ctaFrames;

  // Where each kept segment starts in the final video, so source-time events
  // (memes, callouts) can be mapped onto the edited timeline.
  let cursor = mainStart;
  const placed = segments.map((s) => {
    const from = cursor;
    cursor += s.frames;
    return { ...s, from };
  });

  const sourceToFrame = (sec: number): number | null => {
    const seg = placed.find((s) => sec >= s.startSec && sec < s.endSec);
    if (!seg) return null;
    return seg.from + Math.round((sec - seg.startSec) * FPS);
  };

  // The CTA keeps playing the footage from where the last segment ended.
  const last = segments[segments.length - 1];
  const ctaSourceStartSec = last ? last.endSec : props.hook.endSec;

  return {
    hookFrames,
    segments,
    ctaFrames,
    mainStart,
    ctaStart,
    total,
    sourceToFrame,
    ctaSourceStartSec,
  };
};

export const sfxSrc = (name: string): string | null => {
  if (!name) return null;
  if (/^https?:\/\//.test(name)) return name;
  if (name.includes(".")) return name; // a file in public/
  return `sfx/${name}.wav`;
};
