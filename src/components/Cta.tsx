import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AffiliateProps } from "../schema";
import { FONT, OUTLINE } from "./fonts";
import { Footage } from "./Footage";

const mmss = (sec: number) => {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// End card: footage keeps playing blurred behind a CTA card with price,
// urgency badge, ticking countdown and an arrow pointing at the shop link.
export const Cta: React.FC<{
  readonly props: AffiliateProps;
  readonly sourceStartSec: number;
}> = ({ props, sourceStartSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cta, product, brand } = props;

  const pop = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 10, stiffness: 200, mass: 0.6 },
    });
  const bounce = Math.abs(Math.sin((frame / fps) * Math.PI * 2.2)) * 34;
  const pulse = 1 + Math.sin(frame / 3) * 0.05;

  return (
    <AbsoluteFill>
      <Footage
        src={props.footage}
        startSec={sourceStartSec}
        baseScale={1.12}
        style={{ filter: "blur(18px) brightness(0.55)" }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 300,
          paddingRight: 60,
          fontFamily: FONT,
          textAlign: "center",
        }}
      >
        <div
          style={{
            scale: String(pop(0)),
            fontWeight: 900,
            fontSize: 124,
            lineHeight: 1,
            color: "white",
            textTransform: "uppercase",
            width: 900,
            ...OUTLINE,
          }}
        >
          {cta.headline}
        </div>

        <div
          style={{
            scale: String(pop(6)),
            marginTop: 50,
            backgroundColor: "white",
            borderRadius: 36,
            padding: "30px 50px",
            boxShadow: `0 16px 0 ${brand.accent}`,
            width: 800,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 52, color: "#111" }}>
            {product.name}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 24,
            }}
          >
            {product.oldPrice ? (
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 60,
                  color: "#888",
                  textDecoration: "line-through 6px",
                }}
              >
                {product.oldPrice}
              </div>
            ) : null}
            <div
              style={{
                fontWeight: 900,
                fontSize: 130,
                color: "#111",
                lineHeight: 1.05,
              }}
            >
              {product.price}
            </div>
          </div>
          {cta.subtext ? (
            <div style={{ fontWeight: 800, fontSize: 44, color: "#444" }}>
              {cta.subtext}
            </div>
          ) : null}
        </div>

        {cta.urgency ? (
          <div
            style={{
              scale: String(pop(12) * pulse),
              marginTop: 54,
              backgroundColor: "#FF1F4B",
              color: "white",
              fontWeight: 900,
              fontSize: 60,
              padding: "14px 34px",
              borderRadius: 18,
              border: "6px solid white",
              rotate: "-2deg",
            }}
          >
            🔥 {cta.urgency}
          </div>
        ) : null}

        {cta.countdownSec > 0 ? (
          <div
            style={{
              opacity: interpolate(frame, [14, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              marginTop: 30,
              fontWeight: 900,
              fontSize: 96,
              color: brand.accent,
              fontVariantNumeric: "tabular-nums",
              ...OUTLINE,
            }}
          >
            ⏰ {mmss(cta.countdownSec - frame / fps)}
          </div>
        ) : null}
      </AbsoluteFill>

      {/* Arrow toward the TikTok Shop / product link at the bottom left */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          paddingLeft: 140,
          paddingBottom: 330,
        }}
      >
        <div
          style={{
            opacity: interpolate(frame, [18, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            }),
            translate: `0px ${bounce}px`,
            fontSize: 170,
            lineHeight: 1,
            alignSelf: "flex-start",
            fontFamily: FONT,
          }}
        >
          👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
