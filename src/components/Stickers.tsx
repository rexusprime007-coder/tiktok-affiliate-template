import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AffiliateProps } from "../schema";
import { FONT, OUTLINE } from "./fonts";

// Shared pop-in / pop-out envelope for everything sticker-like.
const usePop = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 260, mass: 0.5 },
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 5, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return { frame, fps, scale: enter * exit };
};

// Gen-Z reaction: a big wobbling emoji with a reaction line underneath.
export const MemeSticker: React.FC<{
  readonly meme: AffiliateProps["memes"][number];
  readonly durationInFrames: number;
  readonly index: number;
}> = ({ meme, durationInFrames, index }) => {
  const { frame, scale } = usePop(durationInFrames);
  // Alternate sides so consecutive memes don't stack on the same spot.
  const left = index % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: left ? "flex-start" : "flex-end",
        top: 560,
        paddingLeft: 90,
        paddingRight: 190,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: String(scale),
          rotate: `${(left ? -8 : 8) + Math.sin(frame / 3) * 4}deg`,
        }}
      >
        {meme.emoji ? (
          <div style={{ fontFamily: FONT, fontSize: 190, lineHeight: 1 }}>
            {meme.emoji}
          </div>
        ) : null}
        {meme.text ? (
          <div
            style={{
              marginTop: 10,
              padding: "10px 26px",
              backgroundColor: "white",
              color: "black",
              borderRadius: 18,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 54,
              boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {meme.text}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Motion-design callouts: product banner, price tag, ✓ benefit, urgency badge.
export const Callout: React.FC<{
  readonly callout: AffiliateProps["callouts"][number];
  readonly durationInFrames: number;
  readonly product: AffiliateProps["product"];
  readonly accent: string;
}> = ({ callout, durationInFrames, product, accent }) => {
  const { frame, scale } = usePop(durationInFrames);

  if (callout.kind === "price") {
    return (
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-end",
          top: 760,
          paddingRight: 170,
        }}
      >
        <div
          style={{
            scale: String(scale),
            rotate: `${6 + Math.sin(frame / 6) * 2}deg`,
            backgroundColor: accent,
            borderRadius: 28,
            border: "8px solid black",
            padding: "18px 34px",
            fontFamily: FONT,
            fontWeight: 900,
            textAlign: "center",
            boxShadow: "0 14px 0 rgba(0,0,0,0.4)",
          }}
        >
          {product.oldPrice ? (
            <div
              style={{
                fontSize: 50,
                color: "black",
                opacity: 0.6,
                textDecoration: "line-through 6px",
              }}
            >
              {product.oldPrice}
            </div>
          ) : null}
          <div style={{ fontSize: 110, color: "black", lineHeight: 1 }}>
            {callout.text || product.price}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  if (callout.kind === "benefit") {
    const slide = interpolate(scale, [0, 1], [-700, 0]);
    return (
      <AbsoluteFill
        style={{ justifyContent: "flex-start", top: 880, paddingLeft: 70 }}
      >
        <div
          style={{
            translate: `${slide}px 0px`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            alignSelf: "flex-start",
            backgroundColor: "rgba(0,0,0,0.78)",
            borderRadius: 999,
            padding: "16px 36px 16px 16px",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 54,
            color: "white",
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 999,
              backgroundColor: accent,
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
            }}
          >
            ✓
          </div>
          {callout.text}
        </div>
      </AbsoluteFill>
    );
  }

  if (callout.kind === "badge") {
    const pulse = 1 + Math.sin(frame / 3) * 0.04;
    return (
      <AbsoluteFill
        style={{ justifyContent: "flex-start", alignItems: "center", top: 210 }}
      >
        <div
          style={{
            scale: String(scale * pulse),
            backgroundColor: "#FF1F4B",
            color: "white",
            borderRadius: 16,
            padding: "12px 30px",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 56,
            border: "6px solid white",
            boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
          }}
        >
          {callout.text}
        </div>
      </AbsoluteFill>
    );
  }

  // product
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", top: 200 }}
    >
      <div
        style={{
          scale: String(scale),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: FONT,
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: accent,
            color: "black",
            padding: "6px 22px",
            borderRadius: 12,
            fontSize: 40,
            rotate: "-3deg",
          }}
        >
          {callout.text || "THE PRODUCT"}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 88,
            color: "white",
            maxWidth: 860,
            ...OUTLINE,
          }}
        >
          {product.name}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ProgressBar: React.FC<{ readonly color: string }> = ({
  color,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <div style={{ height: 12, backgroundColor: "rgba(0,0,0,0.35)" }}>
        <div
          style={{
            height: "100%",
            width: `${((frame + 1) / durationInFrames) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
