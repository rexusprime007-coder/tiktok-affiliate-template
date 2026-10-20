import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cta } from "./components/Cta";
import { Footage, resolveSrc } from "./components/Footage";
import { HookText, ImpactFlash } from "./components/Hook";
import { Callout, MemeSticker, ProgressBar } from "./components/Stickers";
import { tiktokTransition } from "./components/transitions";
import type { AffiliateProps } from "./schema";
import { buildTimeline, sfxSrc, TRANSITION_FRAMES } from "./timeline";

const Sfx: React.FC<{ readonly name: string; readonly volume?: number }> = ({
  name,
  volume = 1,
}) => {
  const src = sfxSrc(name);
  if (!src) return null;
  return (
    <Audio src={/^https?:/.test(src) ? src : staticFile(src)} volume={volume} />
  );
};

const CALLOUT_SFX: Record<AffiliateProps["callouts"][number]["kind"], string> =
  {
    product: "ding",
    price: "cash",
    benefit: "pop",
    badge: "pop",
  };

export const TikTokAffiliate: React.FC<AffiliateProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = buildTimeline(props);
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

  const placedMemes = props.memes
    .map((m, i) => ({ m, i, from: t.sourceToFrame(m.atSec) }))
    .filter((x): x is typeof x & { from: number } => x.from !== null);

  // Screen shake for memes flagged `shake`: a quick decaying jolt.
  let shakeX = 0;
  let shakeY = 0;
  for (const { m, from } of placedMemes) {
    const local = frame - from;
    if (!m.shake || local < 0 || local > 10) continue;
    const k = (1 - local / 10) * 22;
    shakeX += Math.sin(local * 2.7) * k;
    shakeY += Math.cos(local * 3.3) * k;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          translate: `${shakeX}px ${shakeY}px`,
          scale: shakeX || shakeY ? "1.04" : "1",
        }}
      >
        <TransitionSeries name="Video">
          {/* 1. HOOK */}
          <TransitionSeries.Sequence
            name="Hook"
            durationInFrames={t.hookFrames}
          >
            <Footage
              src={props.footage}
              startSec={props.hook.startSec}
              baseScale={1.12}
              muted={props.hook.muted}
            />
            <HookText text={props.hook.text} accent={props.brand.accent} />
            <ImpactFlash />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={tiktokTransition(props.transition)}
            timing={timing}
          />

          {/* 2. MAIN VIDEO: kept segments with jump-cut punch-ins */}
          {t.segments.map((s, i) => (
            <TransitionSeries.Sequence
              key={`seg-${i}`}
              name={`Segment ${i + 1}`}
              durationInFrames={s.frames}
            >
              <Footage
                src={props.footage}
                startSec={s.startSec}
                baseScale={i % 2 === 0 ? 1 : 1.1}
                zooms={props.zooms}
                captions={props.captions}
                captionHighlight={props.brand.captionHighlight}
              />
            </TransitionSeries.Sequence>
          ))}

          <TransitionSeries.Transition
            presentation={tiktokTransition(props.transition)}
            timing={timing}
          />

          {/* 3. CTA */}
          <TransitionSeries.Sequence name="CTA" durationInFrames={t.ctaFrames}>
            <Cta props={props} sourceStartSec={t.ctaSourceStartSec} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* Memes and callouts, placed by the moment they refer to in the footage */}
        {placedMemes.map(({ m, i, from }) => (
          <Sequence
            key={`meme-${i}`}
            name={`Meme: ${m.text || m.emoji}`}
            from={from}
            durationInFrames={Math.round(m.durationSec * fps)}
          >
            <MemeSticker
              meme={m}
              index={i}
              durationInFrames={Math.round(m.durationSec * fps)}
            />
            <Sfx name={m.sfx} />
          </Sequence>
        ))}
        {props.callouts.map((c, i) => {
          const from = t.sourceToFrame(c.atSec);
          if (from === null) return null;
          const duration = Math.round(c.durationSec * fps);
          return (
            <Sequence
              key={`callout-${i}`}
              name={`Callout: ${c.kind}`}
              from={from}
              durationInFrames={duration}
            >
              <Callout
                callout={c}
                durationInFrames={duration}
                product={props.product}
                accent={props.brand.accent}
              />
              <Sfx name={CALLOUT_SFX[c.kind]} volume={0.7} />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      <ProgressBar color={props.brand.accent} />

      {/* Sound design */}
      <Sequence name="SFX: hook" durationInFrames={2 * fps}>
        <Sfx name={props.hook.sfx} />
      </Sequence>
      <Sequence
        name="SFX: transition in"
        from={t.mainStart - 4}
        durationInFrames={fps}
      >
        <Sfx name="whoosh" />
      </Sequence>
      <Sequence
        name="SFX: CTA riser"
        from={Math.max(0, t.ctaStart - 20)}
        durationInFrames={fps}
      >
        <Sfx name="riser" volume={0.6} />
      </Sequence>
      <Sequence
        name="SFX: CTA hit"
        from={t.ctaStart + TRANSITION_FRAMES}
        durationInFrames={2 * fps}
      >
        <Sfx name="boom" volume={0.8} />
      </Sequence>
      {props.music.src ? (
        <Audio
          name="Music"
          src={resolveSrc(props.music.src)}
          volume={props.music.volume}
          loop
        />
      ) : null}
    </AbsoluteFill>
  );
};
