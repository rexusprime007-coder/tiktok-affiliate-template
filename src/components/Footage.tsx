import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AffiliateProps } from "../schema";
import { Captions } from "./Captions";

export const resolveSrc = (src: string) =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

// Punch-in scale from the `zooms` list at a given source time: snaps in over
// ~4 frames, holds, then eases back out.
const zoomAt = (zooms: AffiliateProps["zooms"], sec: number, fps: number) => {
  let scale = 1;
  for (const z of zooms) {
    const inEnd = z.atSec + 4 / fps;
    const outStart = z.atSec + z.durationSec;
    const outEnd = outStart + 8 / fps;
    if (sec < z.atSec || sec > outEnd) continue;
    const s = interpolate(
      sec,
      [z.atSec, inEnd, outStart, outEnd],
      [1, z.scale, z.scale, 1],
      { easing: Easing.bezier(0.2, 0.9, 0.3, 1) },
    );
    scale = Math.max(scale, s);
  }
  return scale;
};

// A slice of the raw footage. Overlays that are tied to what's being said
// (captions, zooms) live in here so they stay in sync with the source clock.
export const Footage: React.FC<{
  readonly src: string;
  readonly startSec: number;
  readonly baseScale?: number;
  readonly muted?: boolean;
  readonly zooms?: AffiliateProps["zooms"];
  readonly captions?: AffiliateProps["captions"];
  readonly captionHighlight?: string;
  readonly style?: React.CSSProperties;
}> = ({
  src,
  startSec,
  baseScale = 1,
  muted = false,
  zooms = [],
  captions,
  captionHighlight = "#FFE600",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sourceSec = startSec + frame / fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          scale: String(baseScale * zoomAt(zooms, sourceSec, fps)),
          ...style,
        }}
      >
        <Video
          name="Footage"
          src={resolveSrc(src)}
          trimBefore={Math.round(startSec * fps)}
          muted={muted}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
      {captions && captions.length > 0 ? (
        <Captions
          captions={captions}
          sourceMs={sourceSec * 1000}
          highlight={captionHighlight}
        />
      ) : null}
    </AbsoluteFill>
  );
};
