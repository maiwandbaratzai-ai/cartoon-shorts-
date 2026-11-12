# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Lint a narration script against SCRIPTS.md before voicing it.

usage: python3 tools/script_check.py stories/<slug> [30|64]
Prints FAIL (must fix) and WARN (fix unless there's a reason) lines, then a summary. Exit code 1 on any FAIL.
"""
import sys, re

sd = sys.argv[1].rstrip('/'); target = int(sys.argv[2]) if len(sys.argv) > 2 else 30
lines = [l.strip() for l in open(f'{sd}/script.txt') if l.strip()]
words = lambda s: re.findall(r"[A-Za-z0-9$'%,.-]+", s)
fails, warns = [], []
F = lambda m: fails.append(m); Wn = lambda m: warns.append(m)

# hook
h = lines[0]; hw = len(words(h))
if hw > 12: F(f'hook has {hw} words (max 12): "{h}"')
if re.match(r'(?i)(did you know|in this video|let me|have you ever|today we|this is the story)', h): F('hook opens with throat-clearing')
if not re.search(r'\d|[A-Z][a-z]+ [A-Z]|\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million)\b', h): Wn('hook has no number or proper name: make it concrete')

# length
total = sum(len(words(l)) for l in lines)
lo, hi = (75, 92) if target <= 35 else (155, 178)
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
if not (first_keys & last_keys) and not re.search(r'(?i)(that.s how|that.s why|and that|so how|which is why)', last) and not last.endswith(('?', ',', '…')):
    Wn('last line doesn\'t echo or lead into line 1 (loop): consider "And that\'s how…" / a question / the hook image')

for m in fails: print('FAIL', m)
for m in warns: print('WARN', m)
print(f'{len(lines)} lines, {total} words, {turns} turns — {"FAIL" if fails else "ok"} ({len(warns)} warnings)')
sys.exit(1 if fails else 0)
