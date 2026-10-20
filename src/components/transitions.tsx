import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";

type Kind = "flash" | "whip" | "glitch" | "zoom";
type Props = { kind: Kind };

// Snappy TikTok-style cuts between the hook, the main video and the CTA.
const Presentation: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps: { kind },
}) => {
  const exiting = presentationDirection === "exiting";
  let style: React.CSSProperties = {};
  let flash = 0;

  if (kind === "flash") {
    style = exiting
      ? { scale: String(1 + p * 0.25), filter: `brightness(${1 + p * 2})` }
      : { scale: String(1.25 - p * 0.25), opacity: p > 0.5 ? 1 : 0 };
    flash = exiting ? 0 : interpolate(p, [0.4, 0.5, 1], [0, 1, 0]);
  } else if (kind === "whip") {
    const x = exiting ? -p * 100 : (1 - p) * 100;
    style = {
      translate: `${x}% 0`,
      filter: `blur(${Math.sin(p * Math.PI) * 30}px)`,
    };
  } else if (kind === "glitch") {
    const jitter = Math.sin(p * 60) * 40 * Math.sin(p * Math.PI);
    style = exiting
      ? {
          translate: `${jitter}px 0`,
          filter: `hue-rotate(${p * 180}deg) saturate(${1 + p * 3})`,
          opacity: p > 0.5 ? 0 : 1,
        }
      : {
          translate: `${-jitter}px 0`,
          filter: `hue-rotate(${(1 - p) * -180}deg) saturate(${1 + (1 - p) * 3})`,
          opacity: p > 0.5 ? 1 : 0,
        };
  } else {
    // zoom: punch through the old shot into the new one
    style = exiting
      ? {
          scale: String(1 + p * 1.5),
          opacity: 1 - p,
          filter: `blur(${p * 20}px)`,
        }
      : { scale: String(0.6 + p * 0.4), opacity: p };
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {flash > 0 ? (
        <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
      ) : null}
    </AbsoluteFill>
  );
};

export const tiktokTransition = (
  kind: Kind,
): TransitionPresentation<Props> => ({
  component: Presentation,
  props: { kind },
});
