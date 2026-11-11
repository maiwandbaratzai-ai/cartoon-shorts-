# cartoon-shorts

Created by **Maiwand** ([maiwandbaratzai-ai](https://github.com/maiwandbaratzai-ai)).

Vertical (1080×1920) cartoon explainer shorts about true, surprising stories: flat 2D characters in a 3D toon world,
natural AI narration, word-by-word captions, original music and sound effects. Everything renders headless
(three.js in Chrome via Playwright, Kokoro TTS, numpy audio, ffmpeg).

- `PLAYBOOK.md` — the step-by-step process (used by the daily scheduled task)
- `TOPICS.md` — every topic already made (never repeat one)
- `setup.sh` — one-time setup on a fresh machine (deps + voice model)
- `web/` engine (`core.js`), props, characters, and one scene file per story in `web/s/`
- `tools/` voice/timing/captions, stills, render, audio library, finish
- `stories/<slug>/` script, audio cues, timing (generated files are git-ignored)
