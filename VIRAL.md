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

The closest successful format to ours is Zack D. Films (3D animated curiosity Shorts, 100% Shorts, ~27M subs).
Its most-viewed video is "Ohio's 1986 Balloon Disaster": **place + year + absurd disaster**. That's our lane.

Score every candidate 0–2 on each; only make topics scoring **7+ / 10**:
1. **Absurd contrast**: a harmless thing turns deadly or ridiculous (balloons, molasses, a whale, birds vs an army).
2. **Visual payoff**: one image that's spectacular in our engine (a wave, an explosion, a crowd fleeing, things flying).
3. **Specific & true**: a real place, year, number. Verifiable in 2–3 sources.
4. **One-sentence story**: it can be told as setup → escalation → twist with nothing else needed.
5. **Twist ending**: the last line flips or tops the premise ("…and most of the whale was still on the beach").

Prefer: engineering blunders, failed plans, freak accidents with few or no deaths, bizarre history, animal stories,
"they tried X and Y happened". Use tragedies sparingly and respectfully (no bodies, no gore), at most one in three.
Never repeat a topic in TOPICS.md. Vary the setting every day (beach, city, field, sky, sea, factory, mountain).

## 3. Script rules (voice.py prints warnings if these are broken)

- **Line 1 = the hook, ≤ 12 words, spoken in ≤ 3 s.** State the most shocking claim with a concrete noun and
  number. No "Did you know", no "In this video", no throat-clearing. Good: "In 1970, Oregon blew up a whale with
  half a ton of dynamite." Bad: "Let me tell you an incredible story about something that happened in Oregon."
- **Open a loop in line 1–2** that only the ending closes: the viewer must want to know *how bad it got* or *why*.
- **Escalate every line.** Each line adds a new fact, image, or stake. Cut any line that only explains.
- **Short sentences, active verbs, concrete numbers.** ~165–180 words per minute (the voice runs ~1.1–1.2×).
- **Length:** most viral Shorts in public data sit around 16–45 s. 30-second scripts: 75–90 words. The daily
  long video is **64 s for TikTok** (see §9): 155–175 words, a story with enough events to fill it. Never pad the script.
- **Last line = the twist or button, and it should loop:** write it so that it flows back into line 1 when the
  video restarts (e.g. end "…and that's why Oregon never did it again." → loop restarts on "In 1970, Oregon…"), or
  end on a line that recontextualises the opening.
- Never quote song lyrics or copy another creator's script. Rewrite facts in our own words.

## 4. Picture rules (the engine makes these cheap, so always do them)

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
  twist, never more than ~0.4 s.
- Music: original synthesized beds only (audiolib). Keep it running through the last frame for the loop.

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

Every day: **four 30-second Shorts + one 64-second video.**
- **YouTube channel A:** two of the 30-second Shorts. **YouTube channel B:** the other two. Give the two channels
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

## Lessons (append dated notes from real analytics here)
- 2026-11-11: first four videos made; no analytics yet.

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
