import { createTikTokStyleCaptions } from "@remotion/captions";
import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import type { Caption } from "../schema";
import { FONT, OUTLINE } from "./fonts";

// Word-by-word TikTok captions: short pages of 1-3 words, the spoken word
// lit up in the highlight colour, each page popping in.
export const Captions: React.FC<{
  readonly captions: Caption[];
  readonly sourceMs: number;
  readonly highlight: string;
}> = ({ captions, sourceMs, highlight }) => {
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 700,
      }),
    [captions],
  );

  const page = pages.find(
    (p) => sourceMs >= p.startMs && sourceMs < p.startMs + p.durationMs,
  );
  if (!page) return null;

  const sincePageMs = sourceMs - page.startMs;

  return (
    // Sits just under the centre: clear of the TikTok caption/username area
    // at the bottom and the like/share buttons on the right.
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", top: 1120 }}
    >
      <div
        style={{
          width: 860,
          marginRight: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.1,
          textTransform: "uppercase",
          color: "white",
          ...OUTLINE,
          scale: String(
            interpolate(sincePageMs, [0, 90, 160], [0.7, 1.08, 1], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            }),
          ),
        }}
      >
        {page.tokens.map((t) => {
          const active = sourceMs >= t.fromMs && sourceMs < t.toMs;
          return (
            <span
              key={t.fromMs}
              style={{
                color: active ? highlight : "white",
                whiteSpace: "pre",
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
