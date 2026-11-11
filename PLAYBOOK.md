# Daily cartoon shorts — playbook

Three vertical (1080×1920) cartoon explainer shorts a day: **two × 30 s, one × 60 s**, each a true, surprising,
visual story (disasters, blunders, weird history, nature oddities). Flat 2D "card" characters in a 3D toon world,
natural AI narration (Kokoro `am_michael`), word-by-word captions, original synthesized music + SFX.

## Pipeline (per story, from the kit root)
1. **Pick the topic.** Check `stories/` (and `TOPICS.md`) so nothing repeats. Prefer one clear, visual event with
   a twist ending. Verify the facts with 2–3 web searches; keep numbers conservative where sources disagree.
2. **Script** `stories/<slug>/script.txt`: one narration line per line. Line 1 is the hook (the whole story in one
   sentence). Last line is the twist/button. ~85 words for 30 s, ~165 words for 60 s.
   `say.txt` (optional, same lines): phonetic versions (years as words: "nineteen nineteen", odd names).
3. **Voice + timing:** `python3 tools/voice.py stories/<slug> <30|60>` → voice.wav, timing.json, subs.ass,
   `web/s/<slug>_timing.js` (LINES = [start,end] frames per line, `wf(line, 'word')` = frame of a word).
4. **Scene:** `web/s/<slug>.js` — copy the closest existing story (whale = beach/explosion, emu = field/animals/
   vehicles, molasses = city street/flood/building damage). One shot per narration line; cuts 4 frames before each
   line; key actions on the word that names them (`wf`). Reuse `props.js` (ocean, terrain, crates, cars, trucks,
   gulls, emus, kaboom, words, facades, mergeCopies) and `toon.js` characters (`bodyFront/bodySide`, outfits,
   expressions: neutral stern grin laugh whistle nervous shock relief dazed pained smile lick).
5. **Look at stills before rendering:** `tools/stills.sh <slug> "f1,f2,..."` (one frame per shot + key moments) and
   read `stories/<slug>/stills/sheet.jpg`. Fix: camera inside objects/buildings, foreground blockers, subject off
   frame, characters too small, text clipped. Usually 2–4 passes.
6. **Sound:** `stories/<slug>/audio.py` (copy one): music beds via `bed(t0, t1, style)` (quirky, march, dark, sad,
   tension), SFX library (boom, mgun, crash, splat, crowd, gull, squawk, engine, pop, gloop, roar, water, …) placed
   on line/word times `LS(i)`, `WS(i,'word')`. `python3 stories/<slug>/audio.py` → mix_raw.wav (voice-led, ducked).
7. **Render:** `tools/render_all.sh <slug> 2` (resumable; ~2.5 s/frame/process → a 30 s short ≈ 25–30 min).
   Render the three stories one after another, not in parallel.
8. **Finish:** `tools/finish.sh <slug> "Title"` → `stories/<slug>/out/<Title>.mp4` (−14 LUFS, burned captions, QA).
   Check the QA sheet; a short black flash or a <1 s freeze at a hold is OK.
9. **Deliver** the three mp4s with titles + a one-line YouTube description and 3–5 hashtags each, then add the
   topics to `TOPICS.md` and commit (no frames/wav/mp4 — see .gitignore).

## Rules of thumb
- Vertical frame is narrow: the subject must sit inside ~±12° horizontally. Prefer depth (looking along streets,
  over shoulders) to wide side views.
- Card scale: a person card is 2.25 m tall (`s` scales it). FX cards (bursts, puffs, words) draw around the card's
  upper middle, so put them ~0.5×2.25×s m below where the effect should be centred.
- Grazing far surfaces (sea, plains) are fine — the ink pass ignores same-normal depth steps.
- Keep tragedy respectful: no bodies or gore; show aftermath, rescuers, and the scale of the event instead.
- Music is original (synth beds). Never copy a real song.
