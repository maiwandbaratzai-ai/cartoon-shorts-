# cartoon-short-kit

Audio in, finished vertical cartoon short out.

The kit turns a voiceover into a 1080×1920, 30 fps cartoon. Flat 2D bean-head characters stand in an inked, painted 3D world, scored with a synthesized music bed and sound effects. Rendering runs in headless Chromium with three.js on software WebGL (SwiftShader), so you don't need a GPU and you don't need Remotion.

![Stills from the example short](docs/soldier-stills.jpg)
*Stills from the worked example, "The Soldier Who Never Left" (19.7 s).*

---

## Layout

```
engine/               the renderer (copied into each project's web/)
  index.html          1080×1920 canvas; loads main.js and reports errors in window.err
  main.js             world, materials, card system, ink pass, depth of field, grade; window.renderFrame(f)
  paint.js            seeded Canvas2D textures (planks, stone, moss, grass, roof, marble, banner, helmet)
  roman.js            Roman-era cast drawn with the Pen library (outfits, poses, props, FX)
  motion.js           easing, splines, keyed cameras, idle sway, blinks, walk cycles
example/soldier/
  story.js            the shot plan: shots, cameras, lights, depth of field, world state, actors, FX
  audio.py            music bed + SFX library + cue table, mixed under voice.mp3
tools/
  setup.sh            creates a new project
  timing.py           word and phrase timings from the voiceover
  render.mjs          renders frames with headless Chromium
  sheet.py            contact sheet of stills
  finish.sh           encode, loudness normalisation and QA
vendor/toon.ts        Pen / head / face library, fetched by setup.sh
```

## Requirements

- **Node ≥ 22.6.** `setup.sh` uses `module.stripTypeScriptTypes` to convert `toon.ts` to JavaScript.
- **Playwright** with Chromium: `npm i -g playwright && npx playwright install chromium`
- **Python 3** with `numpy` (for audio) and `Pillow` (for contact sheets)
- **ffmpeg / ffprobe** and **git**
- Optional: **`faster-whisper`** or **`openai-whisper`** for accurate word timings. Without either, `timing.py` needs the script text.
- Fonts: **DejaVu Serif** (banner, helmet inscription) and **Arial Black** (snore Zs).

## Workflow

### 1. Create a project

```bash
bash tools/setup.sh ~/shorts/my-short
cd ~/shorts/my-short
```

`setup.sh` creates the following:

```
my-short/
  web/        engine files, story.js (copied from the soldier example),
              lib/three.module.js (r160), toonbase.js, toon.js
  work/  stills/  out/
  audio.py  render.mjs  timing.py  sheet.py
```

`toon.js` is built from two parts, `toonbase.js` (the stripped `toon.ts`) followed by `roman.js`. If you change the cast code, rebuild it:

```bash
cat web/toonbase.js web/roman.js > web/toon.js
```

`finish.sh` is **not** copied into the project. Run it from the kit (step 7).

### 2. Time the voiceover

Put `voice.mp3` and, optionally, `script.txt` in the project root, then run:

```bash
python3 timing.py voice.mp3 script.txt --out work
```

The script writes two files:

- `work/words.json`: word-level timings.
- `work/phrases.json`: the duration, the frame count at 30 fps, the speech segments and the phrases.

It also prints a phrase table with frame numbers:

```
  0.00-  2.61  f   0-  78  A Roman soldier stood guard at a bridge for 30 years,
  2.95-  4.22  f  88- 126  refusing to leave his post.
```

If whisper is installed, the timings come from real transcription. Without it, the script finds speech by silence and aligns the script's phrases to those segments by syllable count. That works, but check `phrases.json` against the waveform and fix any phrase that landed in the wrong gap. If there's no whisper and no script, the script exits with code 2 (`NO_ASR`).

### 3. Write the shot plan (`web/story.js`)

Turn the phrase table into shots. Each shot normally covers one phrase, and cuts land just before the next phrase starts. Set `TOTAL` to the `frames30` value from `phrases.json`. For reference, here's the soldier example:

| Shot | Frames | Line | Light |
|---|---|---|---|
| `hook` | 0–87 | "A Roman soldier stood guard at a bridge for 30 years," | day |
| `refuse` | 88–149 | "refusing to leave his post." | day |
| `collapse` | 150–227 | "Even when the empire collapsed, he stayed." | golden |
| `crazy` | 228–277 | "People called him crazy." | golden |
| `workers` | 278–353 | "But when workers finally removed his helmet," | day |
| `inside` | 354–455 | "they discovered a message carved inside:" | day |
| `shock` | 456–482 | "The bridge is not safe." | day |
| `under` | 483–591 | "Beneath it, the wooden supports had been slowly rotting for centuries." | day |

The story contract is described under [Engine reference](#engine-reference) below.

### 4. Preview with stills

Render every 15th frame and tile the stills into a contact sheet:

```bash
node render.mjs stills/pass1 0-591 15
python3 sheet.py stills/pass1 stills/pass1.jpg      # 7 columns by default
```

`render.mjs <outdir> <frames> [step] [jpeg quality]` accepts frame specs like `0-591`, `120,186,548` or a mix of both. It serves `./web`, or the folder in `$WEB` if you set it, and prints the average seconds per frame when it finishes.

Debug views:

```bash
HASH='#nd' node render.mjs stills/nd 0-591 30   # normal/depth buffer
HASH='#e'  node render.mjs stills/e  0-591 30   # ink edges only
```

### 5. Build the soundtrack (`audio.py`)

Edit the script before you run it:

- Set **`DUR`** to `TOTAL / 30`. The example has `592 / 30` hard-coded.
- Set **`MUSIC_END`** to the moment the bed should stop. In the example it stops on the reveal line, and a tension drone carries on to the end.
- Rewrite the **cue table** at the bottom. `F(frame)` converts a frame number to seconds, so cues can use the same numbers as `story.js`.

```python
place(sfx, thunk(85, 0.35), F(120), 1.0)       # spear stamp on "post"
place(sfx, snap(), F(548), 0.9)                # brace breaks on "rotting"
```

Then run it:

```bash
python3 audio.py        # writes mix_raw.wav
```

The **music** is a 104 BPM loop over Am–F–G–E with brass pads, plucked bass and arpeggios, kick/snare and a fanfare every other bar.

The **SFX library** has `whoosh`, `leaves`, `thunk`, `rumble`, `crash`, `cuckoo`, `snore`, `scrape`, `ting`, `sting`, `creak`, `snap`, `splash` and `water`, all synthesized with numpy.

In the **mix**, an envelope follower on the voice ducks the music, then a gentle tanh soft-clip and a 40 ms fade-out are applied.

### 6. Render all frames

```bash
node render.mjs frames 0-591
RESUME=1 node render.mjs frames 0-591    # continue after an interruption
```

Frames are written as `frames/f0000.jpg` … `f0591.jpg`.

### 7. Finish

```bash
bash /path/to/cartoon-short-kit/tools/finish.sh "My Short"
```

The script does the following:

- Loudness-normalises the mix to **−14 LUFS** (true peak −1.5 dBTP) and converts it to 48 kHz stereo.
- Encodes H.264 (CRF 17, `-preset slow`, yuv420p) with AAC at 192 kbps and `+faststart`, and writes **`out/My-Short.mp4`**.
- Runs QA:
  - It prints the duration, size and frame rate.
  - It reports any frozen spans (≥ 0.4 s) or black spans (≥ 0.05 s). An empty list means the check passed.
  - It prints the integrated loudness.
  - It saves `out/qa_sheet.jpg`, a 10×4 grid at 2 fps.

---

## Writing the story

The shorts this style comes from almost all use the same shape. Write the script before recording, and time the shot plan to the recorded voice.

**Format**

- 55–70 s, one narrator speaking fast and evenly (about 3.7 words/s) with almost no pauses.
- The voice starts on the first frame: no intro, logo, outro or call to action.
- Sentences of about 13 words, in plain spoken English with contractions.
- No captions unless you want them; the kit renders none.

**Beat formula**

1. **Hook:** the paradox stated as a fact in the first sentence, with no setup (10–16 words). *"A Roman soldier stood guard at a bridge for 30 years, refusing to leave his post."*
2. **Setting:** one or two lines of concrete detail, such as a time, a place, a number or a named everyman.
3. **Escalation:** 3–6 beats, each bigger than the last. Other people doubt or mock, the stakes climb, and there are one or two exaggeration jokes.
4. **Mystery beat:** one question the viewer now wants answered.
5. **Pivot:** "You see," into the real mechanism, often explained through an everyday analogy.
6. **Payoff:** a short ironic twist in the last one or two sentences. The video ends on the last word.

**Rules**

- Use a true story with a physical cause and effect, so it can be shown. Keep the facts and their sources next to the script; the jokes should be real facts too.
- Illustrate every sentence literally, and let props carry the jokes. Don't narrate what the viewer can already see.
- Change the light with the story: day for the setup, golden or night for the turn or the explanation.
- Story, characters and voice are always your own.

## Sound rules

The kit's `audio.py` is a deliberately small mono bed. These are the targets whichever audio code you use:

| Rule | Target |
|---|---|
| Final loudness | −14 LUFS integrated, true peak ≤ −1 dBTP, loudness range about 2–3 LU (heavily even). `finish.sh` normalises to this |
| Voice | Gain only: no EQ, compression or pitch changes |
| Music under speech | About 9–11 LU below the voice, ducked by a few dB while words are spoken. Key the duck from the word timings, not the audio |
| Quiet final words | Ride the music down 2–4 dB under the last words of a sentence, then let it bloom back in the gap |
| SFX | Spot effects about 6 dB under their natural level; ambience beds are not reduced. Far-away sources get less level, a low-pass and more reverb |
| Hard stops | Cut the music dead on the reveal line or the snap, and let silence or a drone carry the moment |
| Timing | Cue every effect from the frame numbers in `story.js` (`F(frame)`). Lock picture timing before building the sound; any later timing change means re-running `audio.py` |

## Readability traps

Things that look fine in the code and read wrong on screen. Check every new prop and shot for them:

- **Props too close to the lens.** Anything closer than about 2 m becomes a huge cut-off blob. Re-check nearby props whenever a camera moves.
- **Half-cropped foreground objects.** A bush cut by the frame edge reads as a green ball. A foreground prop must be recognisable or gone.
- **A single rope behind a character** can read as a hanging. Swings need two ropes and a plank, with the character between them.
- **Flags, emblems and colour pairs** can read as a real country or brand. Use period-correct designs.
- **Painted signs under a side sun** go grey and unreadable. Give sign faces an unlit material.
- **Rim light drawn as an offset outer copy** frames every hat. Use an inner rim on the head and torso only.
- **Rails at chest height** cut through characters. Raise the camera so rails cross legs, not torsos.
- **Flat holds** read as freezes, and `finish.sh` flags any span frozen for 0.4 s or more. Every hold needs a creeping push-in.

---

## Engine reference

`main.js` exposes three globals: `window.renderFrame(f)`, `window.TOTAL` and `window.ready`. Each frame goes through four passes:

1. **Colour.** Toon materials with a 2-step gradient, PCF soft shadows from one sun, hemisphere fill, fog and a gradient sky with a sun disc.
2. **Normal + depth.** Cards write `rgb = 0` so the world ink skips them; they carry their own linework.
3. **Ink + grade.** Outlines from depth jumps and normal creases, then saturation, lift/gain, vignette and a white flash.
4. **Depth of field.** A 48-tap bokeh gather driven by depth.

### The `story.js` contract

`story.js` exports `SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt`.

**`SHOTS`** is a list of `{ id, a, b, light }`, where `a` and `b` are inclusive frame ranges and `light` is a key into `LIGHTS`.

**`camAt(f)`** returns `{ pos, look, fov, roll?, flash?, shadowAt? }`:

- Smootherstep glides between keyframes in each shot.
- `KICKS` add a short shake for impacts.
- `flash` blends the frame toward white, for time jumps.
- `shadowAt` re-centres the sun's shadow frustum.
- `motion.camFromKeys` is a ready-made version that adds spline paths and a slow push-in during holds.

**`lightFor(shot, f)`** returns a preset with these fields:

- Hemisphere light: `sky, ground, hemi`
- Sun: `sun, sunI, az, el, shadowExt`
- Fog: `fog, fogNear, fogFar`
- Sky: `skyTop, skyHor, sunDisc?, sunSize?`
- Water: `waterDeep, waterShal, glint`
- Grade: `sat, gain?, lift?, vig?`

The example ships two presets, `day` and `golden`.

**`dofAt(f)`** returns `{ focus, cinf, near? }`. `focus` is the focus distance in metres and `cinf` is the maximum blur radius in px; below 0.5, depth of field is off.

**`worldAt(f)`** returns the world state:

| Field | Effect |
|---|---|
| `collapse` | 0 → 1.2: the temple columns topple and the roof drops |
| `banner` | `'fall'` tips the banner pole over using `bannerFall` (0–1); `'gone'` hides it |
| `old` | Moss and ivy cover the gate, and the bronze eagle is removed |
| `braceFall` | Seconds since a diagonal brace snapped; it falls into the river |
| `helmet` | `{ x, y, z, rx?, ry?, rz?, s? }` shows the 3D helmet prop, which has the inscription inside |

**`actorsAt(f, T)` and `fxAt(f, T)`** each return a list of cards. `T` is the `toon.js` module.

```js
{
  key,              // the canvas redraws only when this string changes; round pose values with q()
  draw: (pen) => {},// paints on a 600×1000 design canvas, feet at y≈975
  x, y, z,          // base position; a card is 2.25 m tall at s = 1
  s, flip, yaw, roll, tint, alpha,
  order,            // renderOrder (default 2); use higher values for props and FX in front
  shadow, blob, ground, // real shadow, soft contact shadow and its height
}
```

### Cast (`roman.js`)

`romanFront(pen, outfit, opts)` draws a front-facing figure.

- **Outfits:** `legion`, `old`, `toga`, `civA`, `civB`, `civC`, `workA`, `workB`, or a custom outfit object.
- **Options:**
  - Face and head: `expr`, `blink`, `look`, `facing`, `seed`, `nohelmet`
  - Body motion: `tilt`, `headTilt`, `bob`, `step`
  - Props: `web`
  - Arm-specific values: `wv`, `lift`, `swirl`
- **Arm poses (`L` / `R`):** `hang spear point up wave hip belly temple lift shield cross reach cheek thumb`
- **Extras:** `helmetCard`, `fxZ`, `fxLeaf`, `fxDust`, `fxDrip`, `fxWood`, `headCenter`. Other effects, such as `fxPuff`, `fxCreak`, `fxSplash` and `fxCloud`, come from the toon base.

For a different setting, write a new cast file in the same style and rebuild `toon.js` with it in place of `roman.js`.

### Determinism

Every texture, prop placement and scatter uses seeded RNGs (`paint.rng`), and nothing depends on wall-clock time. Frame `f` renders the same image on every run, so you can render frames out of order, in parallel processes or after a crash with `RESUME=1`.

## Look rules

The engine's defaults come from the upstream project's measured look study (`references/reports/` in claude-animated-shorts: characters, depth, grade, lighting, motion, outlines, textures). Those reports were written for the upstream Remotion stack, so their file and function names don't apply here, but their numbers do. The rules below are the ones that matter when writing a new story, cast or set.

Pixel values are at 1080×1920. **HH** is head height, **W** is head width, and **u** is 1 % of W.

### Characters

| Rule | Target | In this kit |
|---|---|---|
| Proportions | Adults about 3.5 HH: head 1, torso 1.1, legs 1.4. Kids 2.7–3.0 HH with almost adult-sized heads | `romanFront`: torso 1.08 HH (1.12 stout), legs 1.38 HH |
| Head shape | A bean, not an ellipse. H/W ≈ 0.94, slightly pointed crown, fuller jaw, narrower chin, about 8 % bulge toward the facing side, a few degrees of tilt | `headBlob(seed, a, facing)` |
| Limbs | Single ink strokes with no knees or elbows. Legs about 5.8u, arms about 5.2u, ink-dot hands about 5.5u, short outward foot strokes | `romanFront` legs and arms |
| Outline | Near-black plum, about 5u wide, about 3:1 thick-to-thin, thickest away from the light and toward the ground | `inkRing(pts, w0, thickAngle(light))` |
| Face | Eyes about 0.26 W apart, lidded deadpan by default, features shifted toward the facing side. No blush, no catchlights. Shock eyes are big white circles almost touching | `faceFront`, `FACE` table |
| Shading | A soft crescent on the side away from the light: heads drop to about ×0.89, torsos to about ×0.6. No hard cel edge, no grain | `shadedFill` with `SH_SKIN` / `SH_CLOTH` |
| Value | Faces stay bright on screen (luma ≥ 0.85) in every light and take the scene's light colour as a tint | card `tint` per shot |

### World

| Rule | Target | In this kit |
|---|---|---|
| Geometry ink | About 3 px lines on silhouettes, depth jumps and convex creases, near side only. Width stays nearly constant on screen and fades with distance. Never drawn around character cards. Applied before depth of field, so it blurs with the background | `edgeAt` in the ink pass; cards write `rgb = 0` to opt out |
| Painted texture lines | Plank gaps, mortar and tile joints 3–5 px, thinner and about half the contrast of the ink | `paint.js` |
| Darks | Nothing large goes black. Timber in shade stays at L* 27–35 and iron at L* ≥ 19; only ink and gap cores go darker | material colours |
| Day light | The key comes from the side or side-back. Shadows are about 0.5× the lit value and keep the surface's own hue | `LIGHTS.day` (az 140°, el 46°) |
| Golden light | Backlit: the sun sits ahead of the camera, low (az 0–40°, el 3–15°), with long shadows toward the lens and violet-blue shade | `LIGHTS.golden` (az 8°, el 9°) |
| Contact | A soft dark blob under each character's feet; no screen-space AO | card `blob` |
| Sky | Deep saturated blue at the top over a pale horizon. A golden sky moves through peach, coral and lilac, never through grey | `skyTop` / `skyHor` |
| Haze | Fog colour matches the horizon, so the skyline is pulled 20–40 % toward it | `fog`, `fogNear`, `fogFar` |
| Water | A gradient from deep near the camera to light near the horizon, with sparse horizontal crests | water shader |

### Lens and grade

| Rule | Target | In this kit |
|---|---|---|
| Depth of field | On for about a third of screen time, mostly close-ups, medium shots and inserts. Off for establishing and most wide shots. Blur radius at infinity: CU/MS 12–14 px, FS about 8, WS about 5; foreground objects 15–24 px. Focus on the eyes | `dofAt(f)` → `{ focus, cinf }` |
| Exposure | Day median luma about 0.57, near-whites reaching 0.97 | `gain` / `lift` |
| Blacks | Lifted and warm, never crushed to pure black | `lift` |
| Vignette | Corners about 0.86× the centre by day, 0.75× at golden hour | `vig` |
| Bloom | Only on light sources (sun, lamps, fire); white faces stay crisp | none by default |

### Motion

| Rule | Target | In this kit |
|---|---|---|
| Camera moves | Symmetric ease-in-out over about 23 f, peaking around 15 px/f (720p). Anything bigger than half a frame width is a cut, not a move | `camFromKeys` (smootherstep) |
| Holds | Never dead still: a slow push-in of 0.15–0.35 % per frame. No hand-held float | `camFromKeys` creep |
| Impacts | Kicks of about 7 frames whose offset flips sign every frame, timed to the hit | `KICKS` / `kicks` |
| Drawing rate | Characters animate on ones. No line boil, squash or smears | card keys rounded with `q()` |
| Blinks | Every 0.5–2.3 s, 4 frames (half, shut, shut, half), plus one across every expression swap | `blinkAt(f, seed)` |
| Reactions | Expression and action changes land 0–3 frames before the word | shot plan |
| Walks | 9–12 f per step, body bob 3–7 % of height, feet planted on the ground | `walk()`, `step` |

### Reference material

This kit ships no reference frames. If you study someone else's shorts for the look, keep the material local and private, and take only general rules and numbers from it. Story, characters, props, shots and voice should always be your own.

### QA targets for stills

After a stills pass, check these numbers with your own measurement scripts:

| Check | Target |
|---|---|
| Faces | luma ≥ 0.85 in every shot |
| Sunlit deck / ground | L* 72–80 |
| Darkest large areas (not ink) | L* ≥ 19 |
| Day sky at the top of frame | C* ≥ 45 |
| World ink | lines about 3 px near, present on roofs, rails and building corners |
| Depth of field | soft background only on the shots you chose |

## Troubleshooting

- **The page reports an error immediately.** `web/toon.js` probably contains only the cast code, which happens when the TypeScript stripping failed silently. Check `node --version` (it must be ≥ 22.6) and rerun the `node -e …` line from `setup.sh`.
- **`three.module.js` is missing.** `setup.sh` tries npm first and then a sparse git clone of three.js r160. One of npm or GitHub has to be reachable.
- **Text renders in the wrong font.** Install DejaVu Serif and Arial Black on the render machine.
- **The audio and video lengths differ.** `DUR` in `audio.py` must equal `TOTAL / 30`. `finish.sh` uses `-shortest`, so a mismatch trims whichever stream is longer.
- **Rendering is slow.** SwiftShader runs on the CPU. Preview with a step (`0-591 15`) and render the full set once the stills look right.

## Credits

Built on [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) (MIT), which provides `toon.ts` (the Pen, head and face library), the look values and the readability rules. The measured reports behind the [Look rules](#look-rules) are in that project's `references/reports/`, and its `templates/audio/` has a fuller stereo sound pipeline: a composed score, a large SFX library and a mastering mix with stems and a cue sheet.
