# Still, Us. — Heartbeat, Music & Cupcake Memory Edition

This edition adds an original, gentle ambient instrumental loop to the existing Still, Us. story website.

## Run it

Keep the folder structure intact and open `index.html` in a browser. For best behavior across browsers, you may also run a simple local server from this folder (for example, `python -m http.server 8000`) and open `http://localhost:8000`.

## Background music

- Track: `assets/audio/still-us-ambient-loop.mp3`
- Style: soft piano arpeggios, warm sustained pads, and sparse glassy notes; no vocals or percussion.
- Playback: loops continuously across all chapters and screens.
- Browser behavior: audio starts when the visitor clicks **LET'S GO BACK** (or the music toggle). This respects browser autoplay restrictions. The circular music-note button in the top bar fades music in/out.
- Default volume is intentionally subtle. Change `TARGET_VOLUME` in `background-music.js` to adjust it (range: `0.0`–`1.0`).
- No external audio service or network call is used for the soundtrack.

## Existing project details

The original HTML, CSS spacing, logo assets, chapter content, image-fitting rules, story illustrations, the new cupcake-man memory, and the Chapter 09 roses reveal flow are preserved. The new music controller is isolated in `background-music.js` and the only layout addition is the accessible music toggle in the top bar.

## Opening heartbeat moment

On first load, a full-screen opening moment runs for about 10 seconds before softly revealing the existing intro page. The H-and-S monogram uses a gentle double-beat pulse, the short messages rotate during the wait, and the progress line fills before the fade-out. The previous mini loading bar on the intro has been removed to avoid repeating the loading experience. No external dependency is used for this effect.

## The cupcake-man memory

Chapter 03, **The Little Cupcake Man**, captures the café moment when she drew a tiny cupcake-man on tissue paper—a small keepsake that is still safely treasured. Its illustration is stored locally at `assets/story/03-the-cupcake-man.webp`; no external image service is required when the site is published.
