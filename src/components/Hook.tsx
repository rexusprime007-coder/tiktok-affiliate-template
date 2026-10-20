import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, OUTLINE } from "./fonts";

// "this is *insane*" -> [{text:"this",hot:false},...,{text:"insane",hot:true}]
const parseWords = (text: string) =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ text: w.replace(/\*/g, ""), hot: /\*/.test(w) }));

// Big kinetic hook text: words slam in one after another, highlighted words
// get the accent colour and a slight tilt.
export const HookText: React.FC<{
  readonly text: string;
  readonly accent: string;
}> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = parseWords(text);
  const perWord = 3;

  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", top: 330 }}
    >
      <div
        style={{
          width: 900,
          marginRight: 40,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 26,
          rowGap: 4,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 118,
          lineHeight: 1.05,
          textTransform: "uppercase",
          textAlign: "center",
          ...OUTLINE,
        }}
      >
        {words.map((w, i) => {
          const s = spring({
            frame: frame - i * perWord,
            fps,
            config: { damping: 11, stiffness: 220, mass: 0.6 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: w.hot ? accent : "white",
                opacity: frame >= i * perWord ? 1 : 0,
                scale: String(interpolate(s, [0, 1], [2.2, 1])),
                rotate: w.hot
                  ? `${interpolate(s, [0, 1], [0, -4])}deg`
                  : "0deg",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// White flash on the very first frames so the video "hits" immediately.
export const ImpactFlash: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        opacity: interpolate(frame, [0, 5], [0.85, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        }),
      }}
    />
  );
};
