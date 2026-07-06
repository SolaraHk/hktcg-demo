# HKTCG — scroll-cinema hero prototype

Scroll-driven cinematic landing page for [hktcg.com](https://www.hktcg.com/en).
Per the boss's brief: the page opens on the HKTCG logo wall and scroll slowly
pushes forward, arriving beside the boxed **T** — then doors, museum, showcase
hall, and the grand-floor reveal.

**The raw videos are NOT used on the site.** The pipeline is fully generated:
video frames → **GPT Image 2** stills (reference-conditioned, matching the
real venue) → **Kling v3** image-to-video walkthrough clips (dolly/pan/orbit
camera moves, 5s each, silent) → frames → scroll scrub. Scrolling walks you
through the store with real parallax.

## Files
```
index.html            hero + landing (collections / new store / services / visit)
styles.css            white + signage-crimson palette
main.js               scroll-film engine (canvas frame scrub + blend)
assets/film/          f-001 … f-175 (35 frames × 5 clips, 1280px, ~8 MB)
assets/scenes/        the 6 master stills (also used in landing cards)
```

## Engine
Canvas frame scrub (from the SolaraLab site): scroll maps to a fractional
frame index, base frame + alpha-blended next frame, nearest-loaded fallback.
Each clip owns 20% of the hero scroll. Native scroll, no dependencies,
IO reveals below the fold. Reduced motion collapses the hero to one viewport.

## Regenerating
1. Stills: `generate_image` `gpt_image_2` (3:2, 2k medium, 3 cr) with a venue
   frame as reference — prompts describe logo wall / doors / museum / hall /
   grand floor / vending.
2. Motion: `generate_video` `kling3_0` (std, sound off, 5s, 7.5 cr) with the
   still's job_id as `start_image` and a camera-move prompt
   (dolly-in / walk-through / orbit / lateral pan / aisle dolly).
3. Frames: `ffmpeg -i clip.mp4 -vf "fps=7" -frames:v 35 -q:v 6 c%d-%03d.jpg`,
   rename sequentially into `assets/film/`, update `__FRAME_COUNT` in
   index.html if counts change.

## Facts used in copy (from the Grand Opening video, 2026-07-04)
26,000 sq ft (兩萬六千呎) · 零售 鑑定 收藏 對戰 展覽 · HK$80M museum
collection · tagline PLAY. COLLECT. CONNECT. · Mackenyu appeared at opening.

## Preview
Any static server, e.g. `python3 -m http.server 4710`.

## Ship options
A. Standalone page (GitHub Pages) linking into the Shopify store — zero risk.
B. Shopify Dawn custom section (site is Dawn 15.4.1).
C. Alternate Shopify homepage template.
