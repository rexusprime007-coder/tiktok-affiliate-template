import { zColor } from "@remotion/zod-types";
import { z } from "zod";

// All times are in SECONDS OF YOUR RAW FOOTAGE (what you see in any video
// player), so you never have to think about the edited timeline.

const caption = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  timestampMs: z.number().nullable(),
  confidence: z.number().nullable(),
});

// Built-in SFX name (public/sfx/<name>.wav), a file in public/, or a URL.
const sfx = z.string();

export const affiliateSchema = z.object({
  footage: z.string().describe("Raw clip, relative to public/ (or a URL)"),

  product: z.object({
    name: z.string(),
    price: z.string(),
    oldPrice: z.string().describe("Crossed-out price, empty to hide"),
  }),

  brand: z.object({
    accent: zColor().describe("Highlights, price tag, progress bar"),
    captionHighlight: zColor().describe("Active caption word"),
  }),

  hook: z.object({
    text: z
      .string()
      .describe(
        "Wrap words in *stars* to highlight them, e.g. 'this is *insane*'",
      ),
    startSec: z.number(),
    endSec: z.number(),
    sfx,
    muted: z.boolean().describe("Mute the footage audio during the hook"),
  }),

  transition: z.enum(["flash", "whip", "glitch", "zoom"]),

  // The parts of the footage to KEEP, in order. Gaps between them are cut
  // out (dead air, ums, retakes). Every cut gets an alternating punch-in so
  // jump cuts feel intentional.
  segments: z.array(z.object({ startSec: z.number(), endSec: z.number() })),

  captions: z.array(caption),

  zooms: z.array(
    z.object({
      atSec: z.number(),
      durationSec: z.number(),
      scale: z.number().describe("1.15 = subtle, 1.35 = dramatic"),
    }),
  ),

  memes: z.array(
    z.object({
      atSec: z.number(),
      durationSec: z.number(),
      text: z.string(),
      emoji: z.string(),
      sfx,
      shake: z.boolean(),
    }),
  ),

  callouts: z.array(
    z.object({
      atSec: z.number(),
      durationSec: z.number(),
      kind: z.enum(["product", "price", "benefit", "badge"]),
      text: z.string(),
    }),
  ),

  cta: z.object({
    durationSec: z.number(),
    headline: z.string(),
    subtext: z.string(),
    urgency: z.string().describe("e.g. 'ONLY 37 LEFT' or 'SALE ENDS TONIGHT'"),
    countdownSec: z.number().describe("Countdown start value, 0 to hide"),
  }),

  music: z.object({
    src: z.string().describe("Background track in public/, empty for none"),
    volume: z.number(),
  }),
});

export type AffiliateProps = z.infer<typeof affiliateSchema>;
export type Caption = z.infer<typeof caption>;
