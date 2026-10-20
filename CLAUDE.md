# TikTok affiliate template: notes for Claude

A Remotion template. Each video is a props file in `videos/<name>.json`, validated
by `src/schema.ts`. Don't change `src/` to make a single video; edit the JSON.
Change `src/` only when the user wants the template itself changed.

## Making a video

1. Put the footage in `public/footage/`. Copy `videos/example.json` to
   `videos/<name>.json` and fill in `footage`, `product`, `brand` and `cta`.
2. Run `npm run transcribe -- public/footage/<clip> videos/<name>.json`. This
   writes `captions` and prints a timestamped transcript. Whisper.cpp needs
   access to huggingface.co. If it can't reach it, ask the user for an SRT, or
   write the captions by hand.
3. Plan the edit from the transcript. All times are in seconds of the raw
   footage.
   - `hook`: the most surprising 2–3 s, plus punchy text with `*highlighted*` words.
   - `segments`: the parts to keep. Cut silences over about 0.4 s, filler words
     and retakes.
   - `zooms`: on punchlines and key claims.
   - `memes`: reaction moments, about one every 5–8 s.
   - `callouts`: `product` early, `benefit` when a feature is mentioned,
     `price` when the price is said.
   - Everything should fall inside a kept segment, or it won't show.
4. Check a few frames with `npx remotion still TikTokAffiliate out/f.png
   --props=videos/<name>.json --frame=N --scale=0.4`. Then render with
   `npx remotion render TikTokAffiliate out/<name>.mp4 --props=videos/<name>.json`.

## Cloud container notes

- If the Chrome download from remotion.media is blocked, add
  `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
  (or whatever version is under `/opt/pw-browsers/`).
- Fonts and SFX are bundled locally on purpose. Remote URLs may be blocked.
