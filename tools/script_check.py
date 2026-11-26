# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Lint a narration script against SCRIPTS.md before voicing it.

usage: python3 tools/script_check.py stories/<slug> [45|64]  (YouTube Shorts are 45 s since 2026-11-18)
Prints FAIL (must fix) and WARN (fix unless there's a reason) lines, then a summary. Exit code 1 on any FAIL.
"""
import sys, re

sd = sys.argv[1].rstrip('/'); target = int(sys.argv[2]) if len(sys.argv) > 2 else 45
import re as _re
lines = [_re.sub(r'\[(hype|slow|beat)\]\s*', '', l.strip()) for l in open(f'{sd}/script.txt') if l.strip()]
words = lambda s: re.findall(r"[A-Za-z0-9$'%,.-]+", s)
fails, warns = [], []
F = lambda m: fails.append(m); Wn = lambda m: warns.append(m)

# hook
h = lines[0]; hw = len(words(h))
if hw > 12: F(f'hook has {hw} words (max 12): "{h}"')
if re.match(r'(?i)(did you know|in this video|let me|have you ever|today we|this is the story)', h): F('hook opens with throat-clearing')
if not re.search(r'\d|[A-Z][a-z]+ [A-Z]|\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million)\b', h): Wn('hook has no number or proper name: make it concrete')

# line 2 must be a visible second surprise, not background (analytics 2026-11-14: biggest drop is at line 2)
if len(lines) > 1 and re.match(r'(?i)(it (all )?(started|began)|on |in the |back (in|then)|there (was|were)|at the time|during |for (years|centuries|decades)|a (storm|man|woman|team|company) |the [a-z]+ (was|were|had) )', lines[1]):
    F(f'line 2 is background, not a visible surprise (SCRIPTS.md §2b): "{lines[1]}"')

# length
total = sum(len(words(l)) for l in lines)
lo, hi = (75, 92) if target <= 35 else (118, 136) if target <= 50 else (155, 178)
if total < lo: (F if total < lo - 8 else Wn)(f'{total} words for {target}s: too short, the video must not come in under {target}s (aim {lo}-{hi})')
elif total > hi + (25 if target <= 35 else 40): Wn(f'{total} words: longer than {target}s is allowed, but cut anything that drags')

# sentences + filler + weak openers
FILLER = r'\b(very|really|just|actually|basically|literally|a lot of|kind of|sort of|some kind of)\b'
for i, l in enumerate(lines):
    for snt in re.split(r'(?<=[.!?])\s+', l):
        n = len(words(snt))
        if n > 16: Wn(f'L{i}: long sentence ({n} words): "{snt}"')
    f = re.findall(FILLER, re.sub(r'"[^"]*"|“[^”]*”', '', l), re.I)   # quotes are exempt
    if f: Wn(f'L{i}: filler {sorted(set(x.lower() for x in f))}: "{l}"')
    if i > 1 and re.match(r'(?i)(it was|there was|there were|this was)\b', l): Wn(f'L{i}: weak opener: "{l}"')
    if re.match(r'(?i)and then\b', l): Wn(f'L{i}: "and then" — use but/so/then/until to make it a turn')
    if re.search(r'(?i)\b(follow for more|subscribe|like and)\b', l): F(f'L{i}: sign-off / call to action')

# turns: at least a third of the lines should pivot
turns = sum(1 for l in lines[1:] if re.search(r'(?i)\b(but|so|then|until|instead|except|yet|still|meanwhile|turns out)\b', l))
if turns < max(2, (len(lines) - 1) // 3): Wn(f'only {turns} turning lines (but/so/then/until…); aim for {max(2, (len(lines) - 1) // 3)}+')

# re-hook in the middle (for 64 s, or 30 s with 8+ lines)
mid = lines[len(lines) // 3: len(lines) * 4 // 5]
if not any(re.search(r'\?|(?i:wasn.t even|got worse|nobody saw|the real problem|here.s the part|that.s not all|it gets)', l) for l in mid):
    (Wn if target <= 35 else F)('no re-hook in the middle (question or "it got worse"-type line)')

# kicker + loop
last = lines[-1]
if len(words(last)) > 12: Wn(f'last line is long ({len(words(last))} words): make the kicker short and punchy')
first_keys = {w.lower().strip('.,?!') for w in words(lines[0]) if len(w) > 3}
last_keys = {w.lower().strip('.,?!') for w in words(last) if len(w) > 3}
plant_keys = {w.lower().strip('.,?!:"') for l in lines[1:4] for w in words(l) if len(w) > 3}   # SCRIPTS.md §00: a punchline that calls back the rival's joke also closes the loop
if not (first_keys & last_keys) and not (plant_keys & last_keys) and not re.search(r'(?i)(that.s how|that.s why|and that|so how|which is why)', last) and not last.endswith(('?', ',', '…')):
    Wn('last line doesn\'t echo or lead into line 1 (loop): consider "And that\'s how…" / a question / the hook image')

# ---- originality + comedy (Maiwand 2026-11-22: funny, engaging, NEW stories, never copied) ----
import os, glob
raw = open(f'{sd}/script.txt').read()
BANNED = [  # lines/joke shapes lifted from reference videos or worn out by our own repeats: never again
  (r"(?i)\bis (that|this) an? [\w' -]+,? or an? [\w' -]+\?", 'the "Is that a X, or a Y?" joke is copied from the reference video'),
  (r'(?i)^you see,', '"You see," opener is the reference video\'s line'),
  (r'(?i)\bthen came (two|three|four|five)\b', '"Then came three ..." is a worn template'),
  (r'(?i)\blitter box\b|\bsand is for the cat\b|\bthrow me some sand\b|socks on a kitchen floor|kitchen floor in socks', 'reference video line'),
  (r'(?i)\b(he|she|they) begged\b|\bbegged:', '"begged" ending is our worn template'),
  (r'(?i)\b(her|his) rival \w+ laughed\b', '"Her rival X laughed" is our worn template'),
]
for rx, why in BANNED:
    if re.search(rx, raw, re.M): F(f'copied/worn line: {why}')
# structure repeats: compare this script's line openers with the last 12 stories
mine = [' '.join(words(l)[:2]).lower() for l in lines]
others = sorted(glob.glob(os.path.join(os.path.dirname(sd), '*', 'script.txt')), key=os.path.getmtime)[-13:]
for o in others:
    if os.path.abspath(o) == os.path.abspath(f'{sd}/script.txt'): continue
    ol = [' '.join(words(re.sub(r'\[(hype|slow|beat)\]\s*', '', x))[:2]).lower() for x in open(o) if x.strip()]
    same = sum(1 for x in mine if x and x in ol)
    if same >= max(4, len(mine) // 3): F(f'same skeleton as {o.split("/")[-2]} ({same} lines start the same way): use a different story engine (SCRIPTS.md §000)')
# jokes: stories/<slug>/jokes.txt lists every laugh, one per line: "L<n> <type>: <the joke>"
jp = f'{sd}/jokes.txt'
if not os.path.exists(jp): F('no jokes.txt: list every laugh as "L<n> <type>: <joke>" (SCRIPTS.md §000)')
else:
    jl = [x for x in open(jp) if re.match(r'\s*L\d+', x)]; need = 8 if target <= 50 else 11
    if len(jl) < need: F(f'only {len(jl)} jokes in jokes.txt (need {need}+ for {target}s: a laugh every ~5 s)')
    jt = {re.sub(r'\s*L\d+\s*', '', x).split(':')[0].strip().lower() for x in jl}
    if len(jt) < 4: Wn(f'only {len(jt)} joke types: mix more (SCRIPTS.md §000 list)')
    covered = {int(re.match(r'\s*L(\d+)', x).group(1)) for x in jl}
    gap = max((b - a for a, b in zip(sorted(covered), sorted(covered)[1:])), default=0)
    if gap > 3: Wn(f'{gap} lines in a row with no joke: fill the dead stretch')
    if 0 not in covered: F('no joke in line 1 (jokes.txt has no L0): the hook must be a funny, visible consequence, e.g. "his goat slid off it twice" (VIRAL.md 2026-11-23)')
if re.search(r'(?i)\b(inside|hidden|hid|secret|invisible|underground)\b', lines[0]): Wn('hook shows something hidden/inside: viewers swipe when they cannot SEE the strange thing (towerball 41% stayed)')
# topics + hooks lab (SCRIPTS.md §0000, Maiwand 2026-11-26)
if len(lines) > 1 and re.search(r'(?i)\bso why (do|does|are|is|did)\b', lines[1]): F('line 2 is the worn "So why do X?" template: raise the stakes or deepen the mystery instead (SCRIPTS.md §0000)')
for nm, need in (('topics.txt', 10), ('hooks.txt', 10)):
    pth = f'{sd}/{nm}'
    if not os.path.exists(pth): F(f'no {nm}: write {need} candidates scored 0-3 x3, mark the pick with * (SCRIPTS.md §0000)'); continue
    rows = [x.strip() for x in open(pth) if x.strip() and not x.startswith('#')]
    if len(rows) < need: F(f'{nm} has {len(rows)} candidates (need {need})')
    star = [x for x in rows if x.startswith('*')]
    if not star: F(f'{nm}: mark the chosen one with *'); continue
    sc = re.findall(r'(\d)\s*/\s*9|\b([0-9])\s*$', star[0]); tot = re.search(r'(\d+)\s*/\s*9', star[0])
    if tot and int(tot.group(1)) < 7: F(f'{nm}: the pick scores {tot.group(1)}/9 (need 7+)')
    if nm == 'hooks.txt':
        norm = lambda z: re.sub(r'[^a-z0-9 ]', '', z.lower()).split()
        if norm(lines[0])[:6] != norm(re.sub(r'^\*\s*|\s*[\(\[]?\d+\s*/\s*9.*$', '', star[0]))[:6]: F('line 1 is not the starred hook from hooks.txt')
if not os.path.exists(f'{sd}/original.txt'): F('no original.txt: say in 1-2 lines what is NEW here (premise, characters, gag) and that it is not taken from any video')
for m in fails: print('FAIL', m)
for m in warns: print('WARN', m)
print(f'{len(lines)} lines, {total} words, {turns} turns — {"FAIL" if fails else "ok"} ({len(warns)} warnings)')
sys.exit(1 if fails else 0)
