import { Composition, type CalculateMetadataFunction } from "remotion";
import { affiliateSchema, type AffiliateProps } from "./schema";
import { TikTokAffiliate } from "./TikTokAffiliate";
import { buildTimeline, FPS, HEIGHT, WIDTH } from "./timeline";

// Length is derived from the hook, kept segments and CTA.
const calculateMetadata: CalculateMetadataFunction<AffiliateProps> = ({
  props,
}) => ({
  durationInFrames: buildTimeline(props).total,
  defaultOutName: props.product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
});

// The defaults below are a demo. For a real video, copy videos/example.json,
// fill it in, and render with --props (see README).
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TikTokAffiliate"
      component={TikTokAffiliate}
      schema={affiliateSchema}
      calculateMetadata={calculateMetadata}
      durationInFrames={900}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{
        footage: "footage/demo.mp4",
        product: {
          name: "GlowUp LED Mirror",
          price: "$19.99",
          oldPrice: "$49.99",
        },
        brand: { accent: "#FFE600", captionHighlight: "#39FF88" },
        hook: {
          text: "I can't believe this is only *$19* 😭",
          startSec: 14,
          endSec: 16.5,
          sfx: "boom",
          muted: false,
        },
        transition: "flash",
        segments: [
          { startSec: 0.3, endSec: 5 },
          { startSec: 5.8, endSec: 11 },
          { startSec: 12, endSec: 19 },
        ],
        captions: [
          {
            text: "Okay",
            startMs: 400,
            endMs: 800,
            timestampMs: 600,
            confidence: null,
          },
          {
            text: " so",
            startMs: 800,
            endMs: 1100,
            timestampMs: 950,
            confidence: null,
          },
          {
            text: " I",
            startMs: 1100,
            endMs: 1300,
            timestampMs: 1200,
            confidence: null,
          },
          {
            text: " finally",
            startMs: 1300,
            endMs: 1800,
            timestampMs: 1550,
            confidence: null,
          },
          {
            text: " tried",
            startMs: 1800,
            endMs: 2200,
            timestampMs: 2000,
            confidence: null,
          },
          {
            text: " the",
            startMs: 2200,
            endMs: 2400,
            timestampMs: 2300,
            confidence: null,
          },
          {
            text: " viral",
            startMs: 2400,
            endMs: 2900,
            timestampMs: 2650,
            confidence: null,
          },
          {
            text: " mirror",
            startMs: 2900,
            endMs: 3500,
            timestampMs: 3200,
            confidence: null,
          },
          {
            text: " and",
            startMs: 3600,
            endMs: 3900,
            timestampMs: 3750,
            confidence: null,
          },
          {
            text: " wow",
            startMs: 3900,
            endMs: 4800,
            timestampMs: 4300,
            confidence: null,
          },
          {
            text: " the",
            startMs: 6000,
            endMs: 6300,
            timestampMs: 6150,
            confidence: null,
          },
          {
            text: " lighting",
            startMs: 6300,
            endMs: 6900,
            timestampMs: 6600,
            confidence: null,
          },
          {
            text: " is",
            startMs: 6900,
            endMs: 7100,
            timestampMs: 7000,
            confidence: null,
          },
          {
            text: " actually",
            startMs: 7100,
            endMs: 7700,
            timestampMs: 7400,
            confidence: null,
          },
          {
            text: " perfect",
            startMs: 7700,
            endMs: 8400,
            timestampMs: 8000,
            confidence: null,
          },
          {
            text: " three",
            startMs: 8800,
            endMs: 9200,
            timestampMs: 9000,
            confidence: null,
          },
          {
            text: " light",
            startMs: 9200,
            endMs: 9600,
            timestampMs: 9400,
            confidence: null,
          },
          {
            text: " modes",
            startMs: 9600,
            endMs: 10400,
            timestampMs: 10000,
            confidence: null,
          },
          {
            text: " and",
            startMs: 12200,
            endMs: 12500,
            timestampMs: 12350,
            confidence: null,
          },
          {
            text: " it's",
            startMs: 12500,
            endMs: 12800,
            timestampMs: 12650,
            confidence: null,
          },
          {
            text: " rechargeable",
            startMs: 12800,
            endMs: 13700,
            timestampMs: 13250,
            confidence: null,
          },
          {
            text: " no",
            startMs: 14000,
            endMs: 14300,
            timestampMs: 14150,
            confidence: null,
          },
          {
            text: " cables",
            startMs: 14300,
            endMs: 15000,
            timestampMs: 14650,
            confidence: null,
          },
          {
            text: " and",
            startMs: 15400,
            endMs: 15700,
            timestampMs: 15550,
            confidence: null,
          },
          {
            text: " it's",
            startMs: 15700,
            endMs: 16000,
            timestampMs: 15850,
            confidence: null,
          },
          {
            text: " only",
            startMs: 16000,
            endMs: 16400,
            timestampMs: 16200,
            confidence: null,
          },
          {
            text: " nineteen",
            startMs: 16400,
            endMs: 17000,
            timestampMs: 16700,
            confidence: null,
          },
          {
            text: " bucks",
            startMs: 17000,
            endMs: 17800,
            timestampMs: 17400,
            confidence: null,
          },
        ],
        zooms: [
          { atSec: 3.9, durationSec: 0.9, scale: 1.3 },
          { atSec: 7.7, durationSec: 0.7, scale: 1.18 },
          { atSec: 16.4, durationSec: 1.4, scale: 1.25 },
        ],
        memes: [
          {
            atSec: 4,
            durationSec: 1.2,
            text: "no way",
            emoji: "😳",
            sfx: "boom",
            shake: true,
          },
          {
            atSec: 14.2,
            durationSec: 1.2,
            text: "it's giving clean girl",
            emoji: "💅",
            sfx: "pop",
            shake: false,
          },
        ],
        callouts: [
          { atSec: 1.3, durationSec: 2, kind: "product", text: "VIRAL FIND" },
          {
            atSec: 8.8,
            durationSec: 1.6,
            kind: "benefit",
            text: "3 light modes",
          },
          {
            atSec: 12.8,
            durationSec: 1.4,
            kind: "benefit",
            text: "Rechargeable",
          },
          { atSec: 16.2, durationSec: 2.4, kind: "price", text: "" },
        ],
        cta: {
          durationSec: 4,
          headline: "Link in bio",
          subtext: "Tap the orange cart",
          urgency: "60% OFF ENDS TONIGHT",
          countdownSec: 600,
        },
        music: { src: "", volume: 0.15 },
      }}
    />
  );
};
