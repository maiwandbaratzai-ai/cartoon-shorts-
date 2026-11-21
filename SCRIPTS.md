# SCRIPTS.md — writing scripts people watch to the end

Author: Maiwand. Every daily run reads this before writing a script, follows the process in §7, and runs
`python3 tools/script_check.py stories/<slug>` until it passes. A script is the biggest lever on retention: the
picture can only be as gripping as the words it illustrates.


## 00. FICTION ONLY + the "fable that explains a why" (Maiwand 2026-11-21: no more true stories)

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
