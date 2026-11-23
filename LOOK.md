# LOOK.md: how our videos should look (the "rich" 3D look)

Reference Maiwand picked (2026-11-15): **@RicksClips3000** ("How Mine Salting Worked"; 183K subscribers,
3–7M views per Short). Same idea as ours (flat 2D bean characters in a 3D world), but the world looks like a
real 3D animation. What makes it look expensive, in order of impact:

1. **Textured, lit sets.** Rock, wood, dirt and metal look like real materials, with bumps, grain, dirt in the cracks
   and soft shadows. Nothing is a plain grey box.
2. **Warm, motivated light.** Lanterns, windows and the sun cast pools of light, and the corners are dark. Glows,
   dust in the air and light beams give the air depth.
3. **Busy sets.** Every interior is full of props (barrels, crates, lamps, tools, bottles, a calendar on the wall).
4. **Close shots that change every 1.5–3 s.** Characters are big in frame. When the narrator names an object
   (a newspaper, a $100 bill, a gold pan, a firecracker), we see a close-up **insert** of it.
5. Shallow depth of field on close-ups, so the background goes soft and the subject pops.

We copy the craft, never their characters, sets or stories.

## The engine does 1, 2 and 5 for you (web/core.js + web/look.js)

The look is on by default (`look: 'rich'`). Old stories still render. A story can opt out with `look: 'toon'`.

- **Materials:** every `K.toon()/K.col()/K.texM()` is now a lit, textured material. Pick the surface type:
  `K.mat(kind, color, opts)` with kind ∈ `grime` (default, general use) · `wood` · `rock` · `dirt` · `metal` · `fabric` · `brick` · `plaster`.
  The opts are `detail` (tile size in m), `amt` (colour variation), `bump` (m), `grime` (crevice darkening 0–1), and `plain: true` for no texture.
  The same `kind` works inside `K.toon({ map, kind: 'wood' })`.
  **Use a kind on every big surface**: floors = dirt/wood/plaster, walls = rock/brick/plaster/wood, props = wood/metal.
- **Lamps:** `K.lamp(x, y, z, { color, intensity, distance, flicker, glowS })` gives a warm point light, a glow sprite and a gentle
  flicker. Use **at most 4 per set** (each lamp slows the render). Lamp shadows are off by default (they're slow).
- **Light beams:** `K.shaft([top], [bottom], rTop, rBottom, color, alpha)` for sun through a window, a crack or a door.
- **Dust:** `K.dust([cx,cy,cz], [sx,sy,sz], n)` adds drifting specks in the light (great indoors).
- **Post** (set per shot in the light object, all optional):
  - `exposure` (default 1.35)
  - `ao` (contact shadows in corners, default 0.7)
  - `bloom` (glow around bright lights, default 0.6), `bloomThr`
  - `ink` (outline strength on the 3D world, default 0.3)
  - `cardTint` (tints characters to match the light, e.g. `'#fff0e0'` in lantern light, `'#e0e8ff'` at night)
  - `sat`, `vig`, `gain`, `lift` as before
- Example to copy: **web/s/lookdev.js** (mine tunnel, lantern close-up, prop insert, outside). It shows the rock tunnel,
  timber frames, rails, barrels, lanterns, mine cart, a table with a gold pan, a sign, a hill and pine trees.

Indoor light recipe: `hemi 0.2–0.3`, `sunI 0`, 2–4 lamps (intensity 3–4, distance 8–10), a dark fog colour
(fogNear 8, fogFar 30–35), `exposure ~1.15`, `bloom ~0.5`, `vig ~0.34`, `cardTint '#fff0e0'`.
Outdoor recipe: low or mid sun (`el` 25–40) from in front of the camera's side, so faces and signs are lit,
`hemi ~0.9`, `sunI ~3`, `exposure ~1.1`.

## Pro look toolkit (reference study 2026-11-21) — use in EVERY video; see web/s/demo2.js for all of it working
Our weakest point vs. top channels was not the characters, it was everything around them. Do all of these:
- **A glossy hero prop** (the machine/object the story is about) built with care: `K.paint(color)` clear-coat paint,
  `K.gold()` trim, `K.chrome()`, `K.glass()`, and `K.rbox(w, h, d, radius, mat, x, y, z, parent)` bevelled boxes
  instead of plain boxes (bevels catch highlights). Add small details: pinstripes, rivets, lamps, bells, grilles,
  rings around pipes, lugs on tyres. Reflections are automatic (environment built from the light settings).
- **Motion blur is automatic** (camera and moving/spinning objects, hard cuts never blur). `cam.mb: 0` turns it off
  for a shot, `cam.mb: 1` doubles it for whip-pans.
- **Particles:** `K.sparks(f, f0, f1, at, { dir, rate, speed })` for grinding metal/impacts; `K.steam(f, at, { rate,
  size, rise, drift, dark })` for chimneys, kettles, breath, smoke (`dark: 0.6`); `K.rain(f, cam.look, {...})`;
  `K.leaves(f, cam.look, {...})` falling leaves; `K.leafLitter(x0, x1, z0, z1, n)` leaves on the ground (build once).
  `at` can be a function of the frame so emitters follow moving objects.
- **Explainer graphics** (drawn crisp on top, never blurred): `K.badge(f, f0, 'TEXT', at, { icon, f1, style })`
  pill labels that pop in and follow a 3D point (icons: check, x, coin, up, down, warn, weight, drop, bolt, clock;
  `style: 'stamp'` = big yellow sticker); `K.hud(f, f0, { stages, labels, u, rival })` progress map at the top for
  counted stages; `K.holoBox(w, h, d, x, y, z, parent)` x-ray box with glowing edges; `K.holo()` x-ray material
  for any mesh; `K.trace(points, { parent, color })` glowing line that draws itself (`.show(0..1)`).
  Use 3–6 badges per video, each on a number or key word the narrator says.
- **Transitions:** `K.mist(f, f0, dur)` white fog wipe for time/season/place changes; whip-pans with motion blur.
- **Faces:** new big expressions `smug`, `evil`, `deadpan`, `beg`, `gloat` (plus sweat drops on `nervous`/`scared`).
- **Camera:** frame characters by their HEAD position (helper `head()` in demo2.js), never by the vehicle origin;
  low track-level angles, telephoto head-on of racers, macro on the key part, tracking alongside. Big props hide
  drivers from the side: shoot from the front quarter or higher.

## Movie light + stylised characters (2026-11-21, Maiwand: "make it good")
- **Light: always start from a preset:** `light: K.light('golden', { az, el })` (also 'day', 'morning', 'overcast',
  'night', 'interior'). Presets give warm low sun, a cool sky fill that lifts the shadows, soft blurred shadows,
  glowing bloom, and a film grade (cool shadows, warm highlights, gentle contrast curve, vignette). Only override
  what the scene needs (usually `az`/`el` so the sun hits the faces and the front of the set, or `shadowExt`).
  Point the sun at what the camera sees: if a whole street or a face is in shadow, turn `az`, raise `el`.
- **Characters are stylised by default:** bold dark outline around every part, bigger head (×1.14), dark stick
  limbs, flat cartoon clothing colours (no fabric noise), soft rim. `K.stick(o, { head: 1.2 })` for an even bigger
  head, `{ outlineW: 0.002 }` for a thicker line, `{ style: 'classic' }` for the old look.

## Detail density: fill every frame (reference study 2026-11-21 #2, "Why This Town Removed Every Traffic Light")
Top channels look rich because EVERY frame is packed with small, well-made objects, not because of one fancy model.
Build sets from the detailed builders in `K.set` (web/set3d.js; see web/s/town.js for a whole street):
- `K.set.building({ w, d, floors, color, kind, gable: 'step'|'bell'|'pitched'|'flat', shop: 'BAKERY', awning, shutters, flowers, seed })`
  real framed windows with mullions, sills and lintels, shutters, flower boxes, doors with steps and knobs, shop
  windows with a readable sign and striped awning, cornices, gables, tiled roofs, chimneys.
- `K.set.street({ len, width, sidewalk, crossings: [x...] })` asphalt, curbs, red bike lanes, dashes, zebra crossings, brick herringbone sidewalks.
- `K.set.car({ kind: 'hatch'|'van'|'taxi', color })` glossy cars with glass, chrome bumpers, lights, plates, mirrors (`.wheels` to spin).
- `K.set.trafficLight()` (`.set('red'|'amber'|'green')` lights up), `K.set.sign('yield'|'warn'|'stop'|'arrow'|'noentry'|'bike'|'parking')`,
  `K.set.streetLamp()`, `K.set.bollard()`, `K.set.bench()`, `K.set.bin()`, `K.set.planter()`, `K.set.tree({ h, colors })`, `K.set.bike()`.
- Words on things: `K.set.protestSign('MORE|LIGHTS!')`, `K.set.board('CRASHES|BEFORE: 8  NOW: 2')`, `K.set.textMat(text)` for any shop sign,
  crate label, poster or banner. Readable words on props are a cheap, strong detail — use 2+ per video.
- Background people: `K.set.extras(n, { x0, len, z })` + `K.set.extrasFrame(f, list, K.T)` every frame (walkers + idlers, varied outfits).
- `K.set.bake(group)` merges a static group into a few meshes: ALWAYS bake custom static scenery so dense sets stay fast.
**Minimum per shot:** 3 depth layers (foreground object, subject, busy background) and at least 8 distinct set
objects visible in wide shots; no empty ground (markings, texture, leaves, props) and no blank walls (windows,
signs, pipes, posters). Characters: 3+ outfit details each, plus a carried prop where it fits (basket, bag, sign).
For other settings (farm, port, factory, kitchen, station...) write the same kind of builders: many small parts,
real bevels and trims, then bake.

## Shot rules (you do these in each story)

- **Every shot moves the camera** (Maiwand 2026-11-18): slow push-in `fov: 40 * K.push(u)` (100% → 112%), a pan following
  the action, or a tracking move. Add `K.shake(f, f0)` to the camera position only on impacts, creaks and collapses.
  Stay wide; cut to a short close-up only for a character's reaction the narrator is talking about.
- **Tracking camera** (YouTube feedback 2026-11-18): every shot where someone walks, runs or chases uses
  `K.track(f, (g) => posOf(g), { off: [x, y, z] })` so the camera eases along behind the subject and frames slightly
  ahead of it. `posOf(g)` must return the subject's [x, y, z] at frame g (the same function used to place it).
- **Layers / depth in every shot:** a foreground layer close to the camera (crowd heads, ropes, a sign, a post) that
  the depth of field blurs, the sharp subject in the middle, a detailed background, and effects (dust, clouds,
  smoke, rain, birds). Because our world is real 3D, the layers move at different speeds automatically when the camera moves.
- **Same light direction** in every shot of a scene (keep `az`/`el` the same), the same colours, and small details: signs,
  ropes, cracks, tools, flags, birds, moving water.
- Everything has a shadow (3D characters and animals cast real ones; keep `sunI` > 0 or a lamp with `shadow: true`).
- **Dust:** `K.puff(f, wf(..), x, z)` on footsteps of heavy things, landings, impacts and falls.
- Same character design in every shot (create each character once in build() and reuse it).
- **Never reuse a shot.** 12–20 different shots per video (more for 64 s); something visibly moving in every 3-second window.
- Short inserts on the key object when it is named (the gold, the fuse, the bridge cable), then back to the wide.
- Rich worlds around the characters: weather, crowds, smoke, light, background people doing things.

- **Cut or move every 1.5–3 s.** A 45 s video has 15+ shots; a 64 s video has 20+. The middle explanation (lines 3–6)
  needs it most: new angle per line (low angle, over-the-shoulder, top-down, insert), never one long held shot.
- **SEE EVERYTHING (Maiwand 2026-11-23: "pull the camera further, it's so zoomed in I can't see everything").**
  Default shot = wide or full: every character in the scene head-to-feet, the key prop, and the set around them,
  with air around the edges. Use `cam = K.fit([...points], { yaw, pitch, fov })` — it computes the distance so all
  the points fit (put each character's feet AND head in the list, plus the prop).
  - **Wide/full shots: at least 70% of screen time.** Walking, chasing, building, crashing, crowds: always wide/full.
  - **Close-ups ONLY when the narrator is talking about that character and they react** (a face, a shrug, sweat),
    max ~2 s each, then cut back out. Max 20% of screen time.
  - **Inserts** (a prop the narrator names) max ~1.2 s, then back to the wide. Max 10% of screen time.
  - Never crop a walking or acting character: we always see their whole body when they move.
  - **Punch on the joke, not on everything** (YouTube feedback 2026-11-23): on each punchline, impact or crack, a fast
    `K.punch(f, wf(...), 0.2, 6)` zoom (6 frames in, then back to the wide) plus `K.shake` on impacts. The shot
    itself stays wide; the punch is a 0.2 s jolt.
  - Label every step of a progression with a badge (e.g. "4 LEGS" → "6 LEGS" → "10 LEGS").
  - Frame 0 is already the action: no establishing beat before it (cut in half a second earlier if in doubt).
  - The frame is tall and narrow: stage groups in depth (one behind the other, diagonal lines) rather than in a long
    side-by-side row, and keep `maxDist` small enough that the camera stays inside the set (K.fit widens the lens
    instead). Check the stills: the camera must never be inside a wall, tree or building.
- **Insert shot for every object the narration names** (newspaper headline, money, tool, food, sign, letter).
  Camera 0.5–1.5 m away, `dof { focus: <distance>, cinf: 14–22 }`.
- **Three layers in every frame:** something in the foreground (a post, a barrel edge, a lamp), the character(s),
  and a detailed, softly blurred background. Never a character against an empty wall or a flat plain.
- **Dress every set:** 8+ props for an interior, with things on tables, shelves and walls (signs, calendars,
  bottles, tools). Put a readable sign or label in the world when it helps the story (a mine name, a shop name, a newspaper).
- **Fast transitions:** move between scenes with a whip-pan: in the last 4–6 frames of a shot, swing the camera
  sideways fast (motion blur is fine), then cut, with `swish()` on the sound. No slow drifts between locations.
- **Opening graphic:** run `python3 tools/hookcard.py stories/<slug> "BIG CLAIM|IN 2-5 WORDS" "<number/place>"` and
  finish.sh shows it over the first 1.6 s. It states the absurd claim, not a date, and sits in the top 40% of the frame.
- **Reaction shots:** cut to the other character's face on the punchline.
- **Depth of field:** close-ups `cinf 10–16`, inserts `16–22`, wides `4–8`.


## Acting: the characters DO what the narrator says (most important rule, Maiwand 2026-11-16)

Characters never just stand there. On every line, the character on screen performs the verb the narrator is saying,
on that word: "he ran" → he runs; "she counted the money" → she holds up the moneybag; "they voted no" → they cross
their arms; "he couldn't believe it" → shock jump, then facepalm. Act like a cartoon: big, clear, exaggerated.

Use `T.act(f, keys, base)` from web/toon.js (see web/s/acting.js for a full example):
```js
const joeKeys = [[0, 'dig'], [wf(1,'hit') - 4, 'shock'], [wf(1,'gold'), 'celebrate'], [wf(2,'sprinted') - 6, 'run'],
                 [wf(4,'kept'), 'shock'], [wf(4,'kept') + 14, 'facepalm'], [wf(4,'kept') + 40, 'angry']];
const A = T.act(f, joeKeys, { light: -2.1, seed: 9, blink: blinkAt(f, 9) });
actors.push({ key: 'joe' + JSON.stringify(A.opts), draw: (p) => T.bodyFront(p, JOE, A.opts),
              x, y: y + A.dy, z, sx: A.sx, sy: A.sy });   // dy = hop height, sx/sy = squash & stretch
```
- Key each pose 2–6 frames BEFORE the word (anticipation), and change the pose at least every 1–2 s.
- Poses (T.POSES): idle, hips, point, pointL, pointUp, pointDown, wave, cheer, celebrate, panic, scared, shock, shrug,
  facepalm, think, idea, cross, stop, reach, grab, carry, read, hold, show, phone, eat, drink, throwBack → throw,
  salute, ears, clap, angry, sneak, run, walk, stroll, jump, crouch, sit, fall, write, type, dig, hammer, push, lookAround.
- Held items: put the item name as the hand: `[[f,'hold',{R:[0.3,0.4,'moneybag']}]]`. Items: paper, money, moneybag,
  phone, cup, food, box, sign, letter, hammer, book, torch. `carry`/`read` hold one item in both hands (`item: 'box'`).
- Override any arm: `{ R: [x out, y down, hand, front?] }` in head-heights from the shoulder; `expr`, `look` as before.
- Moving actions: also move the actor's x/z (run toward or across the camera), and use whip-pans to follow.
- Every character in shot reacts: the listener nods, laughs, gasps or facepalms. Nobody is a statue.
- Keep characters fully in frame (head and hands) in close-ups; never crop through the face.


## 3D characters: the DEFAULT for every video (approved by Maiwand 2026-11-16)

All characters are real 3D stick men built with `K.stick`. Don't use the flat 2D cards for characters any more.

`K.stick(outfit, { key, glow })` builds a real 3D stick man (round head with the cartoon face, bean body, stick arms
and legs with elbows and knees, shoes, cap/hair/top hat, held items). In `build()` create each character once; in
`frame()` drive it with the same acting keys:
```js
JOE3 = K.stick(JOE, { key: 'joe' });                                   // build()
JOE3.set(T.act(f, joeKeys, { seed: 9, blink: blinkAt(f, 9) }), { x, z, yaw });   // frame(); yaw 0 faces +z
JOE3.root.visible = false;                                              // hide when not in the shot
```
It casts real shadows, gets outlines and contact shadows, can turn (`yaw`), walk and run anywhere (move x/z and use
the `walk`/`run` poses), sit (`{ seat: 0.45 }`), crouch, jump and fall. Use `ink: 0.5–0.6` in the light object so
characters get a clear cartoon outline. Example: web/s/acting3d.js.


## Outfits (every character gets details — 2026-11-17)
`K.stick(outfit)` options, mix freely:
- `jacket`, `pants`, `boots`, `gloves` colours; `build: 'stout' | 'kid'`
- hats `hat`: cap, tophat, hardhat, helmet, police, pilot, chef, beanie, cowboy, crown (`hatColor` to recolour)
- hair `hairStyle`: short, spiky, long, bun, ponytail, curly (+ `hair` colour); `moustache` colour; `glasses: true | colour`
- clothes: `collar` (colour or false), `tie`, `bowtie`, `belt`, `pockets: true`, `vest`, `apron`, `dress`, `scarf`, `badge`
Give every character at least 3 details that tell you who they are (a cop: police hat + badge + tie; a farmer:
cowboy hat + vest + scarf + belt; a chef: chef hat + bowtie + apron). Two characters in one video never share an outfit.

## Animals: real 3D animals, never a stick man with ears (2026-11-17)
`const dog = K.animal('dog', { color, scale, seed })` then `dog.set(f, { x, z, yaw, mode, look, expr, wag, flap })`.
Types: dog, cat, pig, cow, horse, sheep, bear, fox, rabbit, monkey (baboon/ape), elephant, chicken, duck, pigeon.
Modes: stand, walk, run, sit, beg, jump, eat, sleep, wag. Expr: neutral, happy, shock, angry, sad, sleepy.
Move them with `K.walkPath` like people. Pair every animal moment with its sound (VIRAL.md §5: bark, meow, moo...).

## Walking without going through things (2026-11-17)
- Register everything solid: `K.solid(mesh)` for crates, tables, walls, cars, trees, people standing still.
- Move characters with `const W = K.walkPath(f, startFrame, [[x,z], [x,z], ...], speed)`, then use `W.x, W.z, W.yaw`
  and the `walk` (speed ~1.1–1.4) or `run` (~3) pose while `W.moving`. They turn smoothly to face where they go.
- The render log prints **PATH COLLISION** if a path goes through a solid: fix the path (add a corner point) before rendering.
- Feet stay on the ground: walk speed and the walk cycle are matched; don't slide a standing character.

## Faces match the narration (2026-11-17)
Every line, set each character's `expr` to the feeling of what's being said, on the word: neutral, smile, grin, laugh,
proud, excited, shock, scared, nervous, confused, sad, pained, angry, stern, yell, sleepy, relief, dazed, whistle, lick, talk.
**Sweat** (YouTube feedback 2026-11-18): `expr: 'nervous'` or `'scared'` shows sweat drops sliding down the temples
automatically; add `sweat: true` to any other key (a showman with a confident smile but sweating). Use it on whoever
has the most at stake.
**Reaction close-ups:** 2–4 per video, each ~1.5–2 s, only on lines about that character — a crowd member's face (gasp face, hands on cheeks, pointing), or the
main character sweating, cut in right after the big moment and right before it.
Only the narrator is heard. If the narration quotes a character, you may add `talk: true` so their mouth moves, but no character voice is ever added.
Listeners react with a different face from the speaker.

## Lighting: bright, glowing, clean ("HD")
The rich look now defaults to brighter exposure (1.45), more bloom (0.75) and richer colour; 3D characters get a soft
rim light so they glow off the background (`K.stick(o, { rim: 0.55, rimColor })`). Daylight scenes: `sunI 3–3.5`,
`hemi ~1`. Night/indoor: warm lamps + `ink 0.55`. Never leave a character's face in shadow in a close-up; add a lamp
or move the sun. Keep sets clean: fewer, nicer props beat random clutter.

## Camera punch-ins on dramatic beats
`fov: 40 * K.punch(f, wf(line, 'word'), 0.3, 6)` gives a quick zoom-in on the shock word. Use 1–3 per video.

## Check before rendering (stills)

Look at `tools/stills.sh` sheets and ask:
- Does it look like a 3D animation, or like grey boxes? If boxes: add a kind, props and a lamp.
- Is anything blown out (pure white or orange)? If so, lower `exposure` or the lamp `intensity`.
- Is anything too dark to read? Raise `hemi` or add a lamp near the subject.

Render speed: about 3 s per frame outdoors and 4–5 s indoors with lamps (2 processes). A 45 s video takes about 55–75 minutes.
