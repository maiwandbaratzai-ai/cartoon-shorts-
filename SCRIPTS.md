# SCRIPTS.md — writing scripts people watch to the end

Author: Maiwand. Every daily run reads this before writing a script, follows the process in §7, and runs
`python3 tools/script_check.py stories/<slug>` until it passes. A script is the biggest lever on retention: the
picture can only be as gripping as the words it illustrates.


## 000. FUNNY + ORIGINAL (Maiwand 2026-11-22) — this section beats every other one in this file
"Make the scripts funny, engaging and interesting so they keep watching. Fake and NEW, not copied from anyone."

**What went wrong on 2026-11-22:** all five scripts used the same skeleton and even the reference video's joke
shape ("Is that a skyscraper, or a Christmas ornament?" = their "locomotive or litter box?"). That is copying, and
it is predictable: viewers feel the template by video two. `tools/script_check.py` now FAILS copied/worn lines,
repeated skeletons, too few jokes, and a missing originality note.

### Originality rules
- Invent the premise, the characters, the jokes and the ending yourself. Reference videos teach pacing and craft
  only: never reuse their stories, lines, joke shapes, characters or endings.
- Never reuse our own skeleton: rotate the story engines below. At most ONE video per night may use the
  "rival mocks the hero, rival gets stuck" engine (§00), and never with its old lines.
- Before writing, search YouTube for the premise; if a Short already tells that same gag, change the premise.
- Write stories/<slug>/original.txt: 1–2 lines on what is new here (premise, characters, the big gag).

### Story engines (pick a different one for each video of the night)
1. **The Upgrade** — someone "improves" the thing (round pencils, square wheels, a fridge with no door seal) and
   the chaos escalates until the real reason is obvious.
2. **Remove It and See** — a mayor/boss bans the thing ("lids are ugly") and the town falls apart in a chain reaction.
3. **The Bet** — two friends bet on something silly; each try is bigger and dumber; the loser learns the why.
4. **Fish Out of Water** — an alien, a dog, a robot or a baby tries to run a human thing and gets it wrong.
5. **The Complaint Desk** — customers complain about the thing, the clerk "fixes" each complaint, it gets worse.
6. **The Heist** — a crew plans something; the everyday "why" is the obstacle that ruins (or saves) the plan.
7. **The Overconfident Expert** — a famous know-it-all ignores the intern; the intern's "dumb" idea is the why.
8. **The Rivals** (§00) — max once per night, all new lines.

### Hook rule from our own numbers (2026-11-23)
Line 1 = a named character + a strange thing we can SEE + a funny consequence, in plain words (no metaphors).
- 64% stayed: "Henrik built his roof so steep, his goat slid off it twice." (joke + animal + visible)
- 53%: "Captain Pim welded a giant steel ball onto his ship's nose." (visible, but no joke)
- 41%: "Mira hung a 600-ton golden ball inside her skyscraper." (hidden inside, numbers, no joke)
- 37%: "Greta rolled a giant iron coin down Main Street, dog on top." (confusing metaphor: it's a lid, not a coin)
So: the hook line must already be a joke (jokes.txt needs an L0 entry), nothing hidden or inside, no metaphor
the viewer has to decode, numbers come later.

### Animal co-star (our numbers 2026-11-23)
Our biggest videos all star an animal with a personality: the sheep who hid from haircuts 6 years (4,435 views,
66% stayed), the goat sliding off the roof (#1 of the fiction videos), 21 elephants (82% viewed), Pickles the dog.
Every story gets an animal with a funny, specific want (a goat who wants the roof, a cow who hates being late),
on screen from the first shot and part of the ending.

### YouTube feedback on the first fiction week (2026-11-23: mostly A, A+ on structure)
- **Ask the "why" out loud by line 2** ("...so why do milking stools have three legs?") and put it on the hook card,
  so viewers know the question they are waiting for.
- **Tight middle:** a failed attempt or montage gets at most 2 repeats, and each one must be bigger than the last.
  If two beats are the same joke, cut one.
- **Catchphrase:** the main character has a short catchphrase the narrator quotes 2–3 times (setup, twist, callback
  in the last line). It makes the world memorable and gives comments something to repeat.
- **Show the animal sidekick reacting in the first 5 seconds.**

### Comedy toolkit (a laugh every ~5 seconds: 8+ jokes in 45 s, 11+ in 64 s)
- **Specific beats generic:** "Linda from Accounting" not "a worker"; "forty-one cones" not "many cones".
- **Comparison jokes:** "forty pencils rolled off, like lemmings with erasers."
- **Escalation to absurd:** normal → bad → ridiculous (the CEO moonwalks into the fountain).
- **The failed fix:** the hero's solution makes it worse ("he gave the pencils tiny seatbelts. They rolled anyway.").
- **Rule of three:** two normal items, the third is the joke.
- **Deadpan narration of chaos:** the narrator states madness calmly.
- **Character flaw/want:** every main character wants something silly and specific (to be called "Captain").
- **Visual gag on every line:** write what we SEE that is funny, not only what we hear.
- **Misdirection:** set up one meaning, pay off another.
- **Callback button:** the last line brings back an earlier joke in a new way — never the same ending shape twice.
- **Explanation as a joke too:** the real reason in one funny, true image ("a round pencil is a tiny wheel; six
  sides make it a tiny brick").
- Never explain a joke; never end on a moral; never "and that's why..." without a gag.

### Process
1. Pick the engine and the "why". 2. Write 10 premises, keep the funniest. 3. Draft. 4. **Punch-up pass:** for
every line, write 3 funnier versions and keep the best. 5. Fill stories/<slug>/jokes.txt — one line per laugh:
`L<line number> <type>: <the joke>` (types: specific, comparison, escalation, failed-fix, rule-of-three, deadpan,
character, visual, misdirection, callback, explanation). 6. **Repeat-to-a-friend test:** would a 13-year-old
repeat a line from this to a friend? If not, punch up again. 7. Run script_check (no FAILs).

### Example (written fresh for the kit — do not reuse it, write new ones like it)
Engine: The Upgrade. Why are pencils six-sided?
```
Gerald made every pencil in Pinewood Office perfectly round.
"Round is classier," he said, polishing one with his tie.
But at 9:01, the first pencil rolled off a desk.
At 9:02, forty more followed it, like lemmings with erasers.
Then it got worse: by lunch the floor was a pencil river, and Linda from Accounting was surfing it.
So Gerald gave every pencil a tiny seatbelt. They rolled anyway.
[hype] At three, the boss stepped on one and moonwalked straight into the fountain.
[beat] Then Bo the intern held up an old pencil. Six flat sides.
A round pencil is a tiny wheel. Six sides make it a tiny brick.
And bricks don't go anywhere.
Gerald got promoted. Head of Seatbelts.
```

## 00. FICTION ONLY + the "fable that explains a why" (Maiwand 2026-11-21: no more true stories)

**Since 2026-11-22 this is only ONE of the engines in §000 (max once per night) and its example lines below are
the reference video's — never reuse them. Fiction-only still applies to every video.**

**Every video is an invented story.** Made-up characters, made-up events, made-up dialogue (read by the narrator).
No real people, no real events retold, no "true story" anything. upload.txt always says "Type: story".

The format that works best (studied 2026-11-21 from a top 3D Shorts channel, "Why every train carries sand", 22K likes):
**an invented little fable whose ending explains a real everyday "why".** The story is fiction; the "why" is a real,
harmless curiosity (why trains carry sand, why tractors have giant back wheels, why ships have bulbous noses...).
Beat by beat (60 s version; squeeze for 45 s):
1. **Frame 1: the hero does something strange, already mid-action.** "He poured a ton of sand into a brand-new
   locomotive and ran pipes from it down to his own wheels." No question needed when the action itself is weird.
2. **"You see, ..." one line of world rules / stakes** with a number ("engineers here are paid by the ton").
3. **A rival mocks him with a quoted joke line** (the narrator reads it): "Is that a locomotive, or a litter box?"
   The hero NEVER answers. Plant the joke word: it comes back as the punchline.
4. **The rival wins at first** ("all summer he's first over the pass").
5. **The challenge in COUNTED stages that get harder** ("forty cars over three hills"): stage 1 easy, stage 2
   worse (it starts to drizzle), stage 3 worst (wet leaves). Show a stage counter / progress HUD (`K.hud`) and a
   big "HILL 1 / 2 / 3" badge so viewers stay to see the last stage.
6. **The rival's pride**: he grins, sure he's too strong. Then **he gets stuck**: "the train stands still."
7. **The explanation as an everyday analogy the viewer has felt** (~75%): "Ever run across a kitchen floor in
   socks? Your legs are going, but you're not." Cut to a quick cutaway scene of exactly that. One line of the real
   reason ("a steel wheel on wet steel rail: all that power and nothing to push against").
8. **The hero's odd thing saves him**, shown with an x-ray / glowing explainer graphic (`K.holo`, `K.trace`, badges).
9. **The rival begs** (quoted line: "Throw me some sand!").
10. **Punchline callback to the planted joke**: "Sorry. The sand is for the cat." (the cat was riding in the sand dome).
**Title:** "Why Every <thing> <has/does odd thing>" (search-friendly, the real curiosity).
**Pace:** ~3 words per second, a new shot every 1–2 s, every number said out loud (a ton, forty cars, three hills).
Characters: one deadpan hero, one smug rival, one animal sidekick for the final laugh.

## 0. The Ricks Clips structure (studied 2026-11-18: 10 of his videos, 3–35M views each). Use it for every script.
1. **Frame 1 + line 1 = a strange ACTION and a paradox**, no intro, no title card, no "In 1884...":
   a man loading a shotgun with gold; a bomb rolling into camp that won't go off; an elephant's foot on a swaying bridge.
   The first line creates a QUESTION ("Why would anyone shoot gold into a mine?"), not a fact.
2. **People mock him / things get worse** (escalation 1).
3. **Things get worse AGAIN** (escalation 2), e.g. the experts say it will fail, then the bridge actually sags.
4. **The explanation is held back until ~75%** of the video. Never explain the paradox early.
5. **Big visual payoff**, then the last line **flows straight back into line 1** so the video restarts and people
   rewatch. No subscribe ask, no "the end", no stamps or end cards.
**Titles:** "Why / How / This..." + the paradox the video only explains at the end:
"Why 21 Elephants Had to Cross That Bridge" beats "21 Elephants vs. One Bridge".

## 1. The shape of every video

| Time (30 s / 64 s; a 45 s Short sits between) | Job | What the viewer feels |
| --- | --- | --- |
| 0–3 s | **Hook**: the strangest claim, concrete and short | "Wait, what?" |
| 3–8 s | **Line 2 = a second surprise you can SEE** (never background/context) — this is where our viewers drop | "Wait, it gets weirder" |
| middle | **Escalation**: each line is a new turn, *but* / *so* / *then* | "It gets worse?" |
| ~60% mark | **Re-hook**: a line that resets attention | "There's more?!" |
| last 15% | **Payoff + kicker**: the twist, then one short punch line | "No way." |
| last line | **Loop**: flows back into line 1 when the video restarts | rewatch |

## 2. Hooks (line 1, ≤ 12 words, under 3 seconds)

The hook promises a payoff the viewer can't guess. It must be **specific** (a real thing, place, number) and
**strange** (two things that don't belong together). Write **five** hooks for every story and keep the best.

Formulas that work for our stories:
- **Absurd pairing:** "In 1982, a man flew to 16,000 feet in a lawn chair."
- **Tiny cause, huge result:** "One missing math step destroyed a $125 million spacecraft."
- **Ironic outcome:** "Sweden built its mightiest warship. It sank before it left the harbor."
- **The winner/hero is the wrong one:** "The 1904 Olympic marathon was won by a man on rat poison."
- **Impossible-sounding event:** "For one day, it snowed chocolate on a Swiss town."
- **Stakes in the first second:** "This man had one hour to stop a 25-foot wave of syrup."

Never: "Did you know…", "In this video…", "Let me tell you…", "Have you ever…", a year with nothing strange
after it, or a hook that needs the second line to make sense.

**Don't spend the best fact in the hook.** The hook shows *what* happened; keep *how bad* or *why* for the end.
(Hook: "a man flew a lawn chair to 16,000 feet". End: "when they asked why, he said: a man can't just sit around.")

**Stakes early (YouTube feedback 2026-11-17):** by line 2 the viewer must know what could go wrong or be won
("...and if he got it wrong, a train would crash"). Put a `[beat]` before the reveal of whether it worked (it is a short 0.2 s pause; never stack pauses before the big moment).
When the story has a known name (a person, animal or place people search for), say it in line 1: it hooks history fans and helps search.

## 2b. Line 2 (our biggest leak, from real analytics)

Our retention graphs drop hardest at 0:03–0:08, right when line 2 gives background. Line 2 must instead show a
new, visible, strange detail. Context (who/where/why) gets slipped in later, half a clause at a time.
- Bad: "A storm hit a cargo ship sailing from Hong Kong to America." / "It started with mosquitoes."
- Good: "People in Olten found brown flakes all over their cars." / "Some of them are still washing up today."
- Test: could the animator draw line 2 as a surprising picture? If it's a map, a date or an explanation, rewrite.

## 3. Escalation: every line must turn

- **Use "but / so / then / until", never "and then".** "He planned to float 30 feet up. *But* the rope snapped."
  Each line should change the situation, not just describe it. If a line could be deleted without losing the
  story, delete it.
- **One clear character with a want.** Name them once ("Larry Walters"), give them a goal in a few words
  ("he just wanted to float over his backyard"), then let the world go wrong.
- **Raise the stakes in steps.** Small problem → bigger problem → absurd problem. Put the biggest number or the
  funniest detail late.
- **Specific beats general.** "42 weather balloons" not "a lot of balloons"; "brown flakes on every car" not
  "chocolate everywhere". One vivid detail per line.
- **Turn numbers into pictures.** "15,000 feet — higher than planes circle LAX." "Four times the force, like
  braking with your whole foot instead of a tap."
- **Plant a question the viewer wants answered,** then answer it 8–15 s later. ("So why didn't anyone convert
  the numbers?" … "Because each team assumed the other one had.")

## 4. The re-hook (around 60% through)

Attention dips in the middle. Put one line there that restarts it, then deliver:
- "And that wasn't even the strangest part."
- "Then things got worse."
- "Here's the part nobody saw coming."
- "But the real problem was still on board."
- A direct question: "So where did all that water go?"
Use at most one per 45 s video, two per 64 s video. It must be followed by something genuinely surprising.

## 5. Payoff, kicker, loop

- **Payoff:** the twist or the biggest consequence, stated plainly.
- **Kicker:** a short last line (≤ 9 words) with the punch word at the very end: "The emus won." "The fix:
  one multiplication."
- **Loop:** write the last line so it runs straight into line 1 when the video restarts. Easy patterns:
  - End on a clause that line 1 completes: last "…and that's how" → first "a man flew a lawn chair to 16,000 feet."
  - End with the question line 1 answers: "So how did a warship sink in twenty minutes?" → "In 1628, Sweden's…"
  - End by restating the hook's image from a new angle ("And the man in the lawn chair? Grounded for life.")
- No sign-offs, no "follow for more", no moral lesson.

## 6. Sentence rules (spoken, not written)

- 4–14 words per sentence; vary the rhythm (a long line, then a short punch).
- Active verbs, present-feeling past tense ("the rope snaps" / "the rope snapped" — pick one per script).
- Cut filler: very, really, just, actually, basically, literally, a lot of, kind of, some kind of.
- No "There was / It was / There were" openings except in the setup line.
- One real quote per story when a source has one; it's the most human moment in the video.
- Say numbers the way people say them; put spoken forms in say.txt ("nineteen eighty-two").
- Respectful with deaths: state them once, plainly, no jokes near them, no graphic detail.

## 6b. Storytelling rule: entertainment first (changed 2026-11-16, Maiwand's call)

**Update 2026-11-21 (Maiwand): fiction only.** "True" videos are retired: every video is a "story" video (§00).
The "True" option below is kept only as history.

Stories **do not have to be true.** Fiction and exaggeration are welcome when they make the video more fun and keep
people watching. We study real stories (what happened, why people loved them) to build our best stories, true or not.

Two kinds of video, pick per video and say which in upload.txt ("Type: true" or "Type: story"):
- **True:** a real event, told the fun way below. Facts stay right, so these can be called "true story".
- **Story:** inspired by a real event or completely made up: invented characters, events, dialogue, twists, bigger
  numbers, a funnier ending. Push it as far as it makes the video better.

**Do (both kinds):**
- Talk to the viewer: "Imagine you're the guy holding the hose..."
- Put the viewer in the moment: present tense, "right now", what it looked, sounded or smelled like.
- Jokes, comic timing, playful comparisons ("a wave taller than a giraffe"), and reactions ("Bad idea.").
- Lead with the weirdest detail; cut the boring ones (dates, titles, background) unless they're the punchline.
- Dialogue, characters with clear feelings, cartoon exaggeration, sound effects and fast cuts.

**Only limits for "story" videos** (these keep the channels safe from YouTube/TikTok misinformation and defamation strikes):
- Don't label a made-up story as true: no "true story", "real", "this really happened", or a "TRUE STORY" badge in
  the title, captions, thumbnail or hook card. A real year or place as a badge is fine when the story is inspired by it.
- Make up your own characters. Don't invent crimes, scandals or embarrassing acts and pin them on real, named people.
- No fake news about current events, health or medicine, elections, or real disasters with victims.

Test: a 12-year-old would find nothing boring; nobody could be fooled into believing something harmful.

## 7. Process (do all of it, every script)

1. Research: collect 10–15 facts or story ideas (for a "story" video, also brainstorm the funniest made-up twists); star the 3 most surprising.
2. Write 5 hooks (§2); pick the most specific and strange.
3. Beat sheet: hook → setup → 4–6 turns (45 s) or 6–8 turns (64 s) → re-hook → payoff → kicker/loop.
4. Draft the script, one beat per line.
5. Run `python3 tools/script_check.py stories/<slug> 30|64` and fix every FAIL; fix WARNs unless there's a reason.
6. Read it aloud in your head at speed: any line that drags or explains gets cut or merged. Cut ~15%.
7. Score it with the rubric (§9). Under 24/30 → rewrite the weakest part and re-score.

## 8. Before / after (from 2026-11-12)

**Mars orbiter, before (line 2):** "The Mars Climate Orbiter flew nine months to reach Mars." (exposition)
**After:** "For nine months, it flew perfectly. Then the engineers did the math." (a turn and a promise)

**Chocolate snow, before (ending):** "And it offered to pay for cleaning everyone's cars." (soft)
**After:** "Lindt paid to clean every car. Nobody asked them to clean the air." … or a loop: "And that's why, for
one day," → (restart) "it snowed chocolate on a Swiss town."

**Lawn chair, good as is:** the quote ending ("A man can't just sit around.") is a strong kicker. Keep doing that.

## 9. Rubric (score 1–5 each; ship at 24+/30)

1. **Hook**: would a stranger stop scrolling in 2 s?
2. **Curiosity**: is there an open question pulling the viewer forward the whole time?
3. **Escalation**: does every line change the situation, getting bigger toward the end?
4. **Specificity**: names, numbers, vivid details, a quote?
5. **Kicker**: does the last line land a laugh, gasp, or "no way"?
6. **Loop**: does the end flow back into the start?

Pass/fail on top of the score (§6b): is it told in a fun way ("you", jokes, the weirdest details), and if it's a "story" video, is it free of "true story" labels and of made-up claims about real named people? If not, rewrite before rendering.

Write the score in upload.txt (`Script score: 26/30`) so we can compare it with the real retention later.
