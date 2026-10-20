import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled in public/fonts (SIL Open Font License) so renders work offline.
loadFont({
  family: "Montserrat",
  url: staticFile("fonts/Montserrat-Variable.ttf"),
  weight: "100 900",
});

// Emoji fall back to the system colour-emoji font.
export const FONT = `Montserrat, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif`;

// Thick black outline + drop shadow: the classic TikTok text look.
export const OUTLINE: React.CSSProperties = {
  WebkitTextStroke: "14px black",
  paintOrder: "stroke fill",
  textShadow: "0 8px 0 rgba(0,0,0,0.35)",
};
