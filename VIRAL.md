# VIRAL.md — how YouTube Shorts gets distributed, and the rules every video in this kit follows

Author: Maiwand. Researched 2026-11-11. **Every daily run must read this before writing a script and must pass the
checklist at the bottom before rendering.** Update this file when analytics teach us something new.

## 1. How the Shorts feed decides (what's confirmed vs. folklore)

**Confirmed by YouTube (official statements, the Studio metrics that exist):**
- A new Short is shown to a small "seed" audience. If they watch, it is shown to more people; if they swipe away,
  traffic tapers off. YouTube's Shorts lead: "the audience is the algorithm."
- There is no thumbnail/click choice in the feed. The decision YouTube reads is **viewed vs. swiped away**
  (Studio: "How many chose to view").
- Retention = **average percentage viewed (APV)**, calculated from *engaged* views. Replays count, so APV can go
  over 100% when people rewatch.
- Since 31 Mar 2025 the public Shorts view count counts every start and replay. **Engaged views** (people who
  stayed) are what pay out and what tell us whether a video worked.

**Folklore (useful as direction, not as hard numbers):** "you need 70% viewed", "60% APV threshold",
"a scene change every 2–3 s gives 82% retention". YouTube has never published thresholds. Treat any exact number
as a rough target.

**So the whole game is two numbers:** stop the swipe in the first ~2 seconds, then keep people to the end, ideally
looping into a rewatch. Everything below serves those two.

## 2. Topic: pick stories that stop a thumb

**2026-11-21 (Maiwand): fiction only.** Topics are now invented fables (SCRIPTS.md §00): pick a real, harmless
everyday "why" (why trains carry sand, why tractors have giant back wheels) and invent the characters and story
that explain it. Score the *invented story* on the 5 points below. Real events are no longer retold.

The closest successful format to ours is Zack D. Films (3D animated curiosity Shorts, 100% Shorts, ~27M subs).
Its most-viewed video is "Ohio's 1986 Balloon Disaster": **place + year + absurd disaster**. That's our lane.

Score every candidate 0–2 on each; only make topics scoring **7+ / 10** (see Lessons: physical, harmless,
everyday-object absurdity beats abstract/technical topics on our channel):
1. **Absurd contrast**: a harmless thing turns deadly or ridiculous (balloons, molasses, a whale, birds vs an army).
2. **Visual payoff**: one image that's spectacular in our engine (a wave, an explosion, a crowd fleeing, things flying).
3. **Specific**: a concrete place, year, number or name (true, or invented for a "story" video; SCRIPTS.md §6b).
4. **One-sentence story**: it can be told as setup → escalation → twist with nothing else needed.
5. **Twist ending**: the last line flips or tops the premise ("…and most of the whale was still on the beach").

Prefer: engineering blunders, failed plans, freak accidents with few or no deaths, bizarre history, animal stories,
"they tried X and Y happened". Use tragedies sparingly and respectfully (no bodies, no gore), at most one in three.
Never repeat a topic in TOPICS.md. Vary the setting every day (beach, city, field, sky, sea, factory, mountain).

## 3. Script rules (full craft guide: SCRIPTS.md; `tools/script_check.py` enforces them)

- **Line 1 = the hook, ≤ 12 words, spoken in ≤ 3 s.** State the most shocking claim with a concrete noun and
  number. No "Did you know", no "In this video", no throat-clearing. Good: "In 1970, Oregon blew up a whale with
  half a ton of dynamite." Bad: "Let me tell you an incredible story about something that happened in Oregon."
- **Open a loop in line 1–2** that only the ending closes: the viewer must want to know *how bad it got* or *why*.
- **Escalate every line.** Each line adds a new fact, image, or stake. Cut any line that only explains.
- **Short sentences, active verbs, concrete numbers.** ~165–180 words per minute (the voice runs ~1.1–1.2×).
- **Length rule (Maiwand, 2026-11-12): a video may run longer than its target (45 s / 64 s) but never shorter.**
  voice.py keeps the natural pace, slows slightly or pads the ending if short, and never speeds up to squeeze.
  Most viral Shorts in public data sit around 16–45 s. 45-second scripts: 118–136 words (30-second scripts were 75–90). The daily
  long video is **64 s for TikTok** (see §9): 155–175 words, a story with enough events to fill it. Never pad the script.
- **Last line = the twist or button, and it should loop:** write it so that it flows back into line 1 when the
  video restarts (e.g. end "…and that's why Oregon never did it again." → loop restarts on "In 1970, Oregon…"), or
  end on a line that recontextualises the opening.
- Never quote song lyrics or copy another creator's script. Rewrite facts in our own words.

## 4. Picture rules (the engine makes these cheap, so always do them)

**Look and shot rules now live in LOOK.md** (rich textured 3D sets, lamps, close-ups, prop inserts, cuts every 1.5–3 s; reference: @RicksClips3000).

- **Frame 0 shows the payoff.** Open on the most spectacular moment (flash-forward): the wave mid-street, the
  explosion, the birds scattering. No slow push-in on an empty scene, no title card, no logo, no fade-in.
- **Something visibly changes every ~2–3 s.** One camera per narration line isn't enough when a line runs 4–5 s:
  give each line ≥ 2 camera keys with a punch-in/angle change, or a new action (pop-in, fx burst, character
  reaction, word card). Camera "kicks" on impact words.
- **Act on the word.** Every noun the narrator says should appear on screen within ~0.3 s of the word (`wf(line,
  'word')`). Numbers get a big word card (`PR.word`) at the moment they're spoken.
- **Readable on a phone:** subjects big and centred in the vertical frame; characters' faces visible; keep the
  bottom ~25% and the right edge clear of important action (YouTube UI). Captions sit just below centre.
- **Captions on, every word** (many people watch muted): already burned in by finish.sh.
- **Seamless loop:** no fade-to-black at the end. The last shot should echo the first shot's composition or lead
  into it, and music should still be playing at the cut (no long silent tail).
- **Original look every day:** new set, new props, new camera moves. Reusing the engine is fine; reusing the same
  shots/sets/script template day after day is what YouTube's "inauthentic content" policy targets.

## 5. Sound rules

- The narrator is always clearly louder than the music (ducking is built in; keep `music_gain` ≤ 0.8).
- A sound effect on every visual hit (impacts, pops, whooshes on cuts). Silence only as a deliberate beat before a
  twist, never more than ~0.2 s (YouTube feedback 2026-11-18: a longer pause before the big moment loses people).
- Music: original synthesized beds only (audiolib). Keep it running through the last frame for the loop.
- **Comedy SFX on every joke** (YouTube's AI review gave our audio B+ for this): `bonk()` on a dumb decision or fall,
  `chew()`/`gulp()` when anything eats, `boing()`, `slide(True/False)` for things going up or down, `scratch()` right before the
  twist ("but then…"), `ribbit()` for frogs/toads, and `countup(t0, t1)` ticks while a big number counts up. Aim for one
  bespoke sound every 2–3 s on top of the cut whooshes, and match the sound to the action on screen.
  Also: `screech()` (swerving cars), `flip()` (signs, pages, cards turning), `stamp()` (votes, approvals, gavels),
  `swish()` on every fast camera transition.
- **Deep bass on every impact (YouTube feedback 2026-11-18).** Heavy steps use `stomp()`, impacts `thunk()` (now with
  a sub layer) or `boom()`, tension drones `hum()` (now with a deep under-hum). Add `sub()` under any big hit.
- **Only the narrator speaks (Maiwand 2026-11-18).** No character voices, no soundbites, no dialogue audio, no gasps.
  Characters show what they feel with faces, poses and mouth movement only; `vox()` is disabled.
- **Animal sounds:** `bark() meow() moo() oink() baa() quack() cluck() roar() neigh() monkey() trumpet() squeak() tweet()`.
  Every animal on screen makes its sound at least once.
- Music now ducks more under the narration automatically (mixdown). Let the music build tension during the
  escalations (switch to the 'tension' bed, raise it), and drop to near silence for ~0.2 s right before the payoff (no longer: keep it tight).
- **Voice drama** (tools/voice.py tags at the start of a script line): `[hype]` = faster and louder for the chaos/action
  line, `[slow]` = slower for the punchline or kicker, `[beat]` = a short pause before the twist. Use 1–3 per video.

## 6. Packaging (write stories/<slug>/upload.txt with these)

- **Title:** ≤ 50 characters, curiosity + concrete noun, written to make someone stop: "Oregon Blew Up a Whale 🐋",
  "The Day Boston Drowned in Syrup". At most one emoji. No clickbait the video doesn't pay off.
- **Description:** 1–2 plain sentences with the searchable names (place, year, event), then a one-line source note.
- **Hashtags:** 3–5, most relevant first, in the description (only the first 3 show above the title):
  one broad (#history / #science), one niche (#weirdhistory / #disaster), one topic (#bostonmolassesflood).
- **Thumbnail / cover** (`tools/thumbnail.py`): the payoff frame + 2–5 huge words (white, last line yellow, thick
  black outline) in the top third + a small red year/place badge. Use it as the YouTube Shorts thumbnail where the
  app allows choosing one, and as the TikTok cover. The words should tease the twist, not repeat the title.
- **AI/synthetic disclosure:** our videos are clearly animated and use a generic (non-cloned) narrator voice.
  YouTube says clearly unrealistic/animated content doesn't need the "altered or synthetic" label. Never clone a
  real person's voice or make realistic footage of real people.

## 7. Monetisation safety (YouTube "inauthentic content", enforced from 15 Jul 2025)

YouTube demonetises *mass-produced, repetitive* content, e.g. templated videos with generic AI voice-overs that add
little value. AI tools themselves are allowed. What keeps this channel safe:
- Real research and a distinct storytelling voice in every script (the twist, the framing, the jokes).
- Every video is visually different (new scene file each day, never a re-skin of yesterday's).
- Maiwand reviews each video before posting; drop any that feel samey or low-effort. Three great videos beat three
  okay ones: if a day's third video isn't good enough, deliver two.

## 8. Learn from the numbers (every week)

Ask Maiwand for Studio numbers per video: **Viewed vs. swiped away**, **APV**, engaged views, subs gained.
- Low "viewed" → the first 2 s failed: stronger first frame / shorter hook line.
- High "viewed" but low APV → the middle sagged: more escalation, faster changes, cut explaining lines.
- High APV but few shares/comments → the twist wasn't remarkable enough.
Record what worked in the "Lessons" section below and adjust these rules.

## 9. Where each video goes (Maiwand's setup, 2026-11-11)

Every day: **four 45-second Shorts + one 64-second video.** (Shorts changed from 30 s to 45 s on 2026-11-18, Maiwand's call
after studying Ricks Clips, whose Shorts run 55–65 s; 45 s keeps the overnight run finishing before 11 AM.)
- **YouTube channel A:** two of the 45-second Shorts. **YouTube channel B:** the other two. Give the two channels
  different-feeling topics where possible, and never post the same video on both channels (duplicates across
  channels look like mass-produced reuploads).
- **TikTok:** the 64-second video. TikTok's Creator Rewards Program only pays for original videos **longer than one
  minute**, so the long video is rendered at **64 s (1:04)** to be safely over the line: `voice.py <story> 64`
  pads the ending if the narration runs short, and `finish.sh` warns if the final file is under the target.
  Creator Rewards also needs 10,000 followers, 100,000 views in the last 30 days and the account holder to be 18+.
- For TikTok the same rules apply (hook in 2 s, pace, loop). Write the 64-second script as a full story with 2–3
  escalation beats; it must not feel padded. The padded tail (if any) should be a held final shot with music,
  never dead air or black.
- In the delivery message label each video: **Channel A**, **Channel B**, or **TikTok**.

## Pre-render checklist (all must be yes)
- [ ] Topic scores 7+ and isn't in TOPICS.md
- [ ] Line 1 ≤ 12 words, concrete, no throat-clearing
- [ ] Frame 0 is a payoff image (check `stills.sh <slug> "0,15,45"`)
- [ ] No shot holds the same framing for more than ~3 s
- [ ] Every number/key noun appears on screen as it's spoken
- [ ] Last shot flows back into the first; no fade-out, music runs to the end
- [ ] Narrator clearly above music; SFX on every hit
- [ ] upload.txt has title (≤ 50 chars), description, 3–5 hashtags
- [ ] thumbnail.jpg made and checked (subject visible, text readable at phone size)

## Lessons (append dated notes from real analytics here; raw numbers in analytics/youtube.csv)
- 2026-11-11: first four videos made; no analytics yet.
- 2026-11-14 (YouTube channel 1, 8 Shorts, 1–3 days old):
  - Every Short got ~1.0–1.45K views in its first hours, then flattened: YouTube tested each one on a seed
    audience and didn't widen it. To break out we need more people to **stay** (best 67.5%, typical ~50–58%).
  - **The big drop is at 0:03–0:08, during line 2**, on almost every retention graph. In those videos line 2 is
    background ("A storm hit a cargo ship…", "It started with mosquitoes.", "On San Juan Island, both countries
    claimed the same land."). The best-retained Short (chocolate snow, 74% APV) had a *visual* line 2 ("People
    found brown flakes all over their cars"). → **Line 2 must be a second surprise you can see, never context.**
  - **Concrete, harmless, physical absurdity wins** (chocolate snow 74% APV, cats by parachute 67% APV and most
    views/subs, 28,800 bath toys best stay rate 67.5%). **Abstract/technical topics lose** (NASA units mix-up:
    worst on every metric, 42% stayed). Score technical stories lower; if used, hook on the physical result.
  - **Big number + everyday object hooks** ("28,800 bath toys…") got the best stay rate.
  - **No dead air at the end:** the 64 s bath-toy video had 4.2 s of padded silence and its retention fell off a
    cliff in the last seconds. Never pad more than ~1 s; lengthen the script instead (voice.py now refuses).
  - Don't slow the narrator below 1.1× to hit a length: it drags. Add a line instead.
- 2026-11-14 (YouTube channel 2): its first 3 Shorts got 0.4–1.06K views like channel 1, but every Short posted
  after ~Nov 12 got **0–1 views**, i.e. the channel stopped being shown at all. That's a channel-level issue,
  not the scripts (the same kind of video got ~1.3K on channel 1 the same day). Cause unknown; Maiwand is checking
  Restrictions / Made-for-kids / duplicate uploads. Never upload the same video to both channels.
- 2026-11-14 (channel 2 check): no strikes, Public, "not made for kids", and the video DOES show in YouTube search,
  so the channel isn't hidden; YouTube just stopped giving it a test audience (new-channel cool-down likely).
  Also seen: other cartoon-story channels posted the same Moon-hoax story the same day (one got 204 views in 27 min).
  Popular "weird history" stories get copied fast. Prefer less-covered stories, and search YouTube for the topic
  before picking it: if 2+ Shorts on it went up in the last week, choose another topic.
  Titles: no #foryou (a TikTok tag); use #shorts + one topic tag, and add a one-sentence description.
- 2026-11-14 (TikTok, Stick History Official): almost every story video gets 250–310 views (90% from For You),
  so TikTok's first test batch likes them but none break out yet. Videos with a big-text thumbnail
  (number/place badge + 3–5 word hook) get about 2–3x the views of the first ones without one: always use it.
  Weak spots: only +3 followers in 7 days and 8 comments in 28 days. TikTok rewards follows and comments, so every
  TikTok video ends with a short follow reason ("Follow for a new weird story every day") and asks one easy
  question in the caption ("Would you have eaten it?"). The account still has older AI fruit-story videos that
  pull the wrong search traffic. Creator Rewards needs 10k followers, so followers are the main goal there.


- 2026-11-15 (YouTube's built-in AI feedback on the cane-toad Short): Hook A, Narrative A, Presence/voice A,
  Visuals A-, Audio B+. To fix: (1) open on the absurd claim or conflict itself, not on a date stamp. The year badge can
  wait until line 2 or the thumbnail. (2) Use quicker cuts and changing camera angles in the MIDDLE explanation (lines 3–6),
  where shots tend to sit too long. (3) Add punchier bespoke SFX (see §5).

- 2026-11-16 (YouTube AI feedback on Dagen H, first video in the rich look): Hook A, Visuals A (up from A-),
  Audio A- (up from B+), Narrative A, Presence A. Next steps it named: (1) a bolder opening graphic → every video now
  opens with tools/hookcard.py (big 2–5 word claim on 0–1.6 s); (2) faster transitions between scenes → whip-pan
  cuts with `swish()`; (3) action-matched SFX (swerving cars, flipping signs, stamps) → new sounds; (4) more vocal drama
  on the chaos reveal → `[hype]`/`[slow]`/`[beat]` tags.

- 2026-11-16 (Maiwand's decision): stories no longer have to be true. Fiction or exaggerated versions are fine if they
  keep people watching; real stories are the raw material we learn from. Only limits are in SCRIPTS.md §6b: never
  label fiction as "true", don't pin invented scandals on real named people, and no fake news on current events or health.

- 2026-11-16 (Maiwand): the biggest weakness is characters just standing around. Now every character acts out the
  narration on the word (LOOK.md "Acting": T.act timeline, 45+ poses, held items, hops, squash & stretch).

- 2026-11-17 (YouTube AI feedback on the 3D baboon video): all A's (Hook, Visuals, Audio, Narrative, Presence). Notes:
  hint at the stakes in the first line or two ("...would the baboon keep his job?"), a micro-pause ([beat]) before the
  reveal, quick camera punch-ins on dramatic beats, music ducked more under fast narration, and character
  soundbites/animal vocalizations for personality. (Character voices were later removed: only the narrator speaks.)

- 2026-11-18 (Maiwand's study of 10 Ricks Clips Shorts, 194K subs, 472M views): his top videos hit 16–35M views while his
  newest got 195K with the same quality, so **the topic and title decide the ceiling and craft decides the floor.** His
  system: 55–65 s; frame 1 is a strange action + paradox line; mockery → escalation → escalation → explanation at ~75% →
  visual payoff → loop to line 1; characters always doing something; a new shot every 3–5 s (12–20 per video), never
  reused; captions in big bold WHITE with a thick black outline, 1–3 words, key words alone and bigger; an acted voice
  with no dead air and character voices; low music that rises in tension, SFX on key moments; titles "Why/How/This" +
  paradox. Our gaps on the elephant video: the hook lived in the title instead of frame 1, shots were reused, the
  voice felt flat, and the "Elephant Approved" stamp ended the video instead of looping it. Captions are now white
  (tools/voice.py; key words in stories/<slug>/keys.txt + any number pop big), pauses are tighter, and SCRIPTS.md §0 has
  the structure.

## Sources consulted
- OutlierKit, "How the YouTube Shorts Algorithm Works in 2026, in YouTube's Words": outlierkit.com/resources/youtube-shorts-algorithm/
- Everpop, Shorts metrics from YouTube Help: everpop.app/blog/youtube-shorts-algorithm-2026-what-actually-matters
- MonitorYT (thresholds are folklore): monitoryt.com/blog/youtube-shorts-algorithm
- TechCrunch / CineD on view counting and engaged views: techcrunch.com/2025/03/26/youtube-is-changing-how-youtube-shorts-views-are-counted
- vidIQ on looping Shorts: vidiq.com/blog/post/double-youtube-watch-time-looping-shorts
- OverseerOS length study (16,537 videos): overseeros.com/blog/best-youtube-shorts-length
- OutlierKit Zack D. Films channel analysis: outlierkit.com/channel/zackdfilms
- YouTube Help, disclosing GenAI content: support.google.com/youtube/answer/14328491
- Social Media Today / Gulf News on the inauthentic-content update: socialmediatoday.com/news/youtube-clarifies-monetization-update-inauthentic-repeated-content/752892/
- Fluxnote, faceless Shorts pacing (directional): fluxnote.io/guides/faceless-shorts-retention-tips-2026

### YouTube AI feedback on the 3D example (2026-11-18)
Grades: hook A, visual B+, audio A-, narrative A, presence A. Fixes now in the kit:
- Stiff walking → the 3D rig now has body dip and rise on each step, forward lean, weight shift over the planted foot,
  lagging head bob, arm follow-through, breathing when standing, and loose parts (ponytail, tie, scarf, pom-pom)
  that swing and settle.
- Static camera → `K.track()` follows a moving subject like a real camera operator (eases in behind, frames ahead).
  Use it on every walking, running or chase shot.
- Thin low end → `sub()`, `stomp()`, and deeper `thunk()`/`hum()`.
- Pause before the big moment → `[beat]` is now 0.2 s; near-silence before the payoff is at most 0.2 s.
- More reactions → sweat drops for nervous/scared faces (`sweat: true`), and crowd reaction close-ups (see LOOK.md).
- Name the main character in line 1 when there is a known name (e.g. "Why did P.T. Barnum march 21 elephants...").

### Reference study: "Why Every Train Carries Sand" (2026-11-21, shared by Maiwand)
A 61 s invented fable with ~22K likes. What makes it work, now in the kit:
- **Story:** strange action in frame 1 → "You see," stakes → rival's quoted joke → rival wins early → challenge in
  3 counted stages that get harder → rival stuck → everyday analogy cutaway (socks on a kitchen floor) → hero's odd
  thing saves him (x-ray graphic) → rival begs → punchline calls back the planted joke. SCRIPTS.md §00.
- **Hero prop is the star:** glossy painted machines with gold trim, bells, lamps, rivets, bevelled edges and real
  reflections (`K.paint`, `K.gold`, `K.chrome`, `K.glass`, `K.rbox`). Characters are simple, faces exaggerated.
- **Explainer graphics:** pill badges that pop in ("1 TON", "PAID", "$0", "GRIP ✗/✓", "HILL 1") with `K.badge`, a
  progress map at the top (`K.hud`), x-ray hologram cutaways (`K.holoBox`) and glowing lines that draw themselves
  along pipes (`K.trace`).
- **Motion:** heavy motion blur on whip-pans and spinning wheels (automatic now), shallow depth of field, cameras at
  track level, telephoto head-on, macro on wheels, tracking alongside at speed.
- **Atmosphere:** sparks, steam plumes, rain, falling leaves, season changes with a white mist wipe
  (`K.sparks`, `K.steam`, `K.rain`, `K.leaves`, `K.leafLitter`, `K.mist`). Warm, saturated, glowing grade.

### Reference study #2: "Why This Town Removed Every Traffic Light" (2026-11-21, shared by Maiwand)
Same channel, same fable formula (strange act → "You see," → people protest → it gets worse → reveal → callback).
The lesson here is DETAIL DENSITY: every frame is packed with small, well-made objects (framed windows, shutters,
awnings with shop names, gables, zebra crossings, bike lanes, poles, signs, lights, bollards, bikes, parked cars,
background people, protest signs with words). Now in the kit: `K.set` builders (web/set3d.js, demo web/s/town.js)
and the "Detail density" rules in LOOK.md.

