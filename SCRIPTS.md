# SCRIPTS.md — writing scripts people watch to the end

Author: Maiwand. Every daily run reads this before writing a script, follows the process in §7, and runs
`python3 tools/script_check.py stories/<slug>` until it passes. A script is the biggest lever on retention: the
picture can only be as gripping as the words it illustrates.

## 1. The shape of every video

| Time (30 s / 64 s) | Job | What the viewer feels |
| --- | --- | --- |
| 0–3 s | **Hook**: the strangest true claim, concrete and short | "Wait, what?" |
| 3–8 s / 3–12 s | **Setup in one breath**: who, where, what they wanted | "OK, I'm in" |
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
Use at most one per 30 s video, two per 64 s video. It must be followed by something genuinely surprising.

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

## 7. Process (do all of it, every script)

1. Research: collect 10–15 facts; star the 3 most surprising and the one best quote.
2. Write 5 hooks (§2); pick the most specific and strange.
3. Beat sheet: hook → setup → 3–4 turns (30 s) or 6–8 turns (64 s) → re-hook → payoff → kicker/loop.
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

Write the score in upload.txt (`Script score: 26/30`) so we can compare it with the real retention later.
