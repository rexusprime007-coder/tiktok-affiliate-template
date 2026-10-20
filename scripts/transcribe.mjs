// Transcribes a clip with whisper.cpp (runs locally on CPU) and writes
// word-level captions into a video's props file.
//
//   node scripts/transcribe.mjs public/footage/my-clip.mp4 videos/my-product.json
//
// Optional: WHISPER_MODEL=small (multilingual) WHISPER_LANG=es
// First run downloads whisper.cpp + the model into ./whisper (needs internet).
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [input, propsFile] = process.argv.slice(2);
if (!input || !propsFile) {
  console.error(
    "Usage: node scripts/transcribe.mjs <footage.mp4> <videos/props.json>",
  );
  process.exit(1);
}

const model = process.env.WHISPER_MODEL ?? "small.en";
const language = process.env.WHISPER_LANG ?? null;
const version = "1.5.5";
const whisperPath = path.resolve("whisper");

await installWhisperCpp({ to: whisperPath, version });
await downloadWhisperModel({ model, folder: whisperPath });

// whisper.cpp wants 16 kHz mono WAV.
mkdirSync("out", { recursive: true });
const wav = path.resolve("out", `${path.parse(input).name}.16k.wav`);
execFileSync("ffmpeg", [
  "-y",
  "-loglevel",
  "error",
  "-i",
  input,
  "-ar",
  "16000",
  "-ac",
  "1",
  wav,
]);

const output = await transcribe({
  inputPath: wav,
  whisperPath,
  whisperCppVersion: version,
  model,
  modelFolder: whisperPath,
  tokenLevelTimestamps: true,
  language,
  splitOnWord: true,
});
const { captions } = toCaptions({ whisperCppOutput: output });

const props = existsSync(propsFile)
  ? JSON.parse(readFileSync(propsFile, "utf8"))
  : {};
props.captions = captions;
writeFileSync(propsFile, JSON.stringify(props, null, 2) + "\n");

console.log(`Wrote ${captions.length} caption words to ${propsFile}\n`);
// Print a readable transcript with timestamps to help pick the hook,
// segments, zooms and meme moments.
for (const c of captions) {
  process.stdout.write(`[${(c.startMs / 1000).toFixed(1)}]${c.text} `);
}
console.log();
