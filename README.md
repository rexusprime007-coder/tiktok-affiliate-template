# TikTok Affiliate Video Template (Remotion)

Turn raw talking-to-camera footage into a TikTok affiliate video:

**HOOK → transition → your footage (tightened) → CTA end card**

with word-by-word captions, punch-in zooms, jump-cut zooms, Gen-Z meme
stickers + SFX, product/price/benefit callouts, a progress bar, and an
urgency CTA with countdown. 1080×1920, 30 fps.

Every video is just **one JSON file** in `videos/`. The code never changes.

## Make a new video

1. Put your clip in `public/footage/`, e.g. `public/footage/mirror.mp4`.
2. Copy `videos/example.json` to `videos/mirror.json` and set `footage`,
   `product`, `hook`, `cta`.
3. Generate captions (and a timestamped transcript to plan the edit):
   ```bash
   npm run transcribe -- public/footage/mirror.mp4 videos/mirror.json
   ```
4. Using the transcript, fill in `segments`, `zooms`, `memes`, `callouts`.
5. Preview / render:
   ```bash
   npx remotion studio --props=videos/mirror.json      # live preview
   npx remotion render TikTokAffiliate out/mirror.mp4 --props=videos/mirror.json
   ```

Easiest of all: open a Claude Code session on this repo, attach the footage,
and paste the prompt from [Using with Claude](#using-with-claude).

## The props file

All times are **seconds in your raw footage** (what any video player shows).

| Field | What it does |
|---|---|
| `footage` | Clip path relative to `public/` (or a URL) |
| `product` | `name`, `price`, `oldPrice` (crossed out; `""` to hide) |
| `brand` | `accent` (price tag, highlights, progress bar), `captionHighlight` (active caption word) |
| `hook` | `text` (wrap words in `*stars*` to highlight), `startSec`/`endSec` of the best moment to show first, `sfx`, `muted` |
| `transition` | `flash`, `whip`, `glitch` or `zoom` — used hook→main and main→CTA |
| `segments` | Parts of the footage to **keep**, in order. Gaps are cut (dead air, ums, retakes). Alternate segments get a 1.1× punch-in so jump cuts feel intentional |
| `captions` | Word-level captions (from `npm run transcribe`) |
| `zooms` | `{atSec, durationSec, scale}` punch-ins on key lines. 1.15 subtle, 1.3 dramatic |
| `memes` | `{atSec, durationSec, text, emoji, sfx, shake}` reaction stickers, e.g. `"no way"` + 😳 + `boom` |
| `callouts` | `{atSec, durationSec, kind, text}` with `kind` = `product` (name banner), `price` (price tag), `benefit` (✓ pill), `badge` (red urgency badge) |
| `cta` | `durationSec`, `headline`, `subtext`, `urgency`, `countdownSec` (0 hides the timer). Footage keeps playing blurred behind it |
| `music` | `src` in `public/` (`""` for none), `volume` (0.1–0.2 under speech) |

### Sound effects

`sfx` fields take a built-in name — `boom`, `whoosh`, `pop`, `ding`, `cash`,
`tick`, `riser` — a file in `public/` (e.g. `sfx/vine-boom.mp3`), or a URL.
Built-ins are synthesized by `npm run sfx` and are royalty-free.

Meme sounds (vine boom, bruh, etc.) are available as URLs such as
`https://remotion.media/vine-boom.wav` — see the
[Remotion SFX list](https://www.remotion.dev/docs/sfx). Check you have the
rights to any meme audio you post.

## Tips for converting videos

- Hook ≤ 3 s. Pick the most surprising line or reaction in your footage.
- Something should change on screen every 2–3 s: a cut, zoom, meme or callout.
- Keep the total 20–45 s.
- Captions and stickers stay inside TikTok's safe zone (clear of the
  buttons on the right and the caption area at the bottom).

## Using with Claude

```
Make a new video with this template.
Footage: [attached / public/footage/x.mp4]
Product: [name], price [$X], was [$Y]
Hook idea: [e.g. "I can't believe this is only $19"] (or pick the best moment)
CTA: [e.g. "Link in bio", urgency "60% off ends tonight"]
Vibe: [Gen Z, funny / clean / hype]
Transcribe it, cut dead air, add zooms, memes and callouts, show me a few
stills, then render the MP4.
```

## Project layout

```
public/footage/   your raw clips (demo.mp4 is a placeholder)
public/sfx/       built-in sound effects
public/fonts/     Montserrat (SIL Open Font License)
videos/*.json     one props file per video
src/              the template (schema, timeline, components)
scripts/          transcribe.mjs, make-sfx.sh
```
