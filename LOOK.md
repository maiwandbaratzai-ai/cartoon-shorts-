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

## Shot rules (you do these in each story)

- **Every shot moves the camera** (Maiwand 2026-11-18): slow push-in `fov: 40 * K.push(u)` (100% → 112%), a pan following
  the action, or a tracking move. Add `K.shake(f, f0)` to the camera position only on impacts, creaks and collapses.
  Cut to close-ups (a foot, a face, a cable) and back to the wide.
- **Layers / depth in every shot:** a foreground layer close to the camera (crowd heads, ropes, a sign, a post) that
  the depth of field blurs, the sharp subject in the middle, a detailed background, and effects (dust, clouds,
  smoke, rain, birds). Because our world is real 3D, the layers move at different speeds automatically when the camera moves.
- **Same light direction** in every shot of a scene (keep `az`/`el` the same), the same colours, and small details: signs,
  ropes, cracks, tools, flags, birds, moving water.
- Everything has a shadow (3D characters and animals cast real ones; keep `sunI` > 0 or a lamp with `shadow: true`).
- **Dust:** `K.puff(f, wf(..), x, z)` on footsteps of heavy things, landings, impacts and falls.
- Same character design in every shot (create each character once in build() and reuse it).
- **Never reuse a shot.** 12–20 different shots per video (more for 64 s); something visibly moving in every 3-second window.
- Lots of close-ups on the key object (the gold, the fuse, the bridge cable).
- Rich worlds around the characters: weather, crowds, smoke, light, background people doing things.

- **Cut or move every 1.5–3 s.** A 45 s video has 15+ shots; a 64 s video has 20+. The middle explanation (lines 3–6)
  needs it most: new angle per line (low angle, over-the-shoulder, top-down, insert), never one long held shot.
- **At least half the shots are close-ups:** the character's head and body fill 60–80% of the frame height
  (camera 2–4 m away, fov 30–40). Wide shots only open a new place.
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
