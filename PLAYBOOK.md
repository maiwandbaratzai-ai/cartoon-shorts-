# Daily cartoon shorts — playbook

Five vertical (1080×1920) cartoon explainer shorts a day: **four × 45 s (two per YouTube channel), one × 64 s for TikTok**, each an invented fable that explains a real everyday "why" (fiction only since 2026-11-21: SCRIPTS.md §00),
visual story (disasters, blunders, weird history, nature oddities). Flat 2D "card" characters in a textured, lit 3D world (LOOK.md),
natural AI narration (Kokoro `am_puck`, the playful male voice Maiwand chose), word-by-word captions, original synthesized music + SFX.

**Read VIRAL.md (especially its Lessons section), SCRIPTS.md, LOOK.md and COMMUNITY.md first, every run, and glance at analytics/*.csv.** SCRIPTS.md is how to write a script people watch to the end; VIRAL.md holds the YouTube Shorts rules (hook, pacing, loop, packaging, monetisation
safety) and the pre-render checklist. Its rules override anything below when they conflict.

## Pipeline (per story, from the kit root)
1. **Pick the topic** with the VIRAL.md §2 scorecard (7+/10). Check `TOPICS.md` so nothing repeats. Prefer one clear,
   visual event with a twist ending, and a different setting from the last few days. Every video is fiction (SCRIPTS.md §00): pick a real, harmless everyday "why", check the real reason with 1–2 web searches, then invent the characters and story that explain it.
2. **Script** — follow the SCRIPTS.md process (5 hooks, beat sheet, `tools/script_check.py` must pass, rubric ≥ 24/30, storytelling rule §6b: entertainment first; fiction is fine but never labelled as true). `stories/<slug>/script.txt`: one narration line per line. Line 1 is the hook (≤ 12 words, the most
   shocking concrete claim). Last line is the twist and should loop back into line 1. 118–136 words for 45 s,
   140–165 for 60 s (VIRAL.md §3).
   `say.txt` (optional, same lines): phonetic versions (years as words: "nineteen nineteen", odd names).
3. **Voice + timing:** `python3 tools/voice.py stories/<slug> <30|64>` → voice.wav, timing.json, subs.ass,
   `web/s/<slug>_timing.js` (LINES = [start,end] frames per line, `wf(line, 'word')` = frame of a word).
   The auto speed fit can oscillate; if the length or hook comes out wrong, pin it: `VOICE_SPEED=1.3 python3 tools/voice.py ...`
   (~1.2 for 45 s, ~1.1 for 64 s). Long caption chunks are shrunk to fit by `tools/fitsubs.py` (run automatically).
   Vertical frames are narrow (±12° horizontally): put the subject on the camera's look line, or it will be off-frame.
4. **Scene:** `web/s/<slug>.js` — follow LOOK.md (textured materials via `K.mat(kind, color)`, lamps, busy sets,
   close-ups, prop inserts, a cut every 1.5–3 s). Copy patterns from `web/s/lookdev.js` (interior/lantern/inserts) and the closest
   existing story (whale = beach/explosion, emu = field/animals/vehicles, molasses = city street/flood/building damage),
   but upgrade old sets to the rich look: no plain grey boxes.
   **Acting (LOOK.md):** write an acting track with `T.act` for every character, so they physically do each verb the
   narrator says, on the word (web/s/acting.js is the example). Frame 0 = the payoff image (flash-forward). Cuts 4
   frames before each line, plus a second camera key / punch-in inside any line longer than ~3 s; key actions
   on the word that names them (`wf`); last shot echoes the first (VIRAL.md §4). Reuse `props.js` (ocean, terrain, crates, cars, trucks,
   gulls, emus, kaboom, words, facades, mergeCopies) and `toon.js` characters (`bodyFront/bodySide`, outfits,
   expressions: neutral stern grin laugh whistle nervous shock relief dazed pained smile lick).
5. **Look at stills before rendering:** `tools/stills.sh <slug> "f1,f2,..."` (one frame per shot + key moments) and
   read `stories/<slug>/stills/sheet.jpg`. Fix: camera inside objects/buildings, foreground blockers, subject off
   frame, characters too small, text clipped, plain untextured surfaces, blown-out or too-dark areas (LOOK.md). Usually 2–4 passes.
6. **Sound:** `stories/<slug>/audio.py` (copy one): music beds via `bed(t0, t1, style)` (quirky, march, dark, sad,
   tension), SFX library (boom, mgun, crash, splat, gull, squawk, engine, pop, gloop, roar, water, …) placed
   on line/word times `LS(i)`, `WS(i,'word')`. `python3 stories/<slug>/audio.py` → mix_raw.wav (voice-led, ducked).
   **Only the narrator speaks:** no character voices, soundbites, gasps or crowd voices (vox/gasp/crowd are silenced).
7. **Render:** `tools/render_all.sh <slug> 2` (resumable; ~3.5–4 s/frame/process outdoors, 5–7 s with a detailed hero prop → a 45 s short ≈ 65–100 min; motion blur adds ~15%).
   Render the three stories one after another, not in parallel.
7b. **Opening graphic:** `python3 tools/hookcard.py stories/<slug> "BIG CLAIM|2-5 WORDS" "<badge>"` (LOOK.md); finish.sh overlays it on 0–1.6 s.
8. **Finish:** `tools/finish.sh <slug> "Title"` → `stories/<slug>/out/<Title>.mp4` (−14 LUFS, burned captions, QA).
   Check the QA sheet; a short black flash or a <1 s freeze at a hold is OK.
9. **Thumbnail:** pick the most spectacular rendered frame (no captions on raw frames) and run
   `python3 tools/thumbnail.py stories/<slug> <frame> "LINE ONE|LINE TWO" "<year or place>"` →
   `out/thumbnail.jpg` (1080×1920). 2–5 words, top third, must not cover the subject's face; check it by eye.
10. **Package:** write `stories/<slug>/upload.txt` (title ≤ 50 chars, 1–2 sentence description, 3–5 hashtags; VIRAL.md §6).
11. **Deliver** each mp4 together with its thumbnail.jpg and upload.txt contents, then add the
   topics to `TOPICS.md` and commit (no frames/wav/mp4 — see .gitignore).

## Rules of thumb
- Vertical frame is narrow: the subject must sit inside ~±12° horizontally. Prefer depth (looking along streets,
  over shoulders) to wide side views.
- Card scale: a person card is 2.25 m tall (`s` scales it). FX cards (bursts, puffs, words) draw around the card's
  upper middle, so put them ~0.5×2.25×s m below where the effect should be centred.
- Grazing far surfaces (sea, plains) are fine — the ink pass ignores same-normal depth steps.
- Max 4 lamps per set (render speed). Prefer one strong key lamp near the subject plus 1–2 in the background.
- Keep tragedy respectful: no bodies or gore; show aftermath, rescuers, and the scale of the event instead.
- Music is original (synth beds). Never copy a real song.

---
Author: Maiwand
