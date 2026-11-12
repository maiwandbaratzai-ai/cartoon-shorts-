# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Shrink caption chunks that would overflow the 1080 px frame (idempotent). usage: python3 tools/fitsubs.py stories/<slug>/subs.ass"""
import sys, re
MAXC = 22   # characters that fit at the full 112 px caption size
p = sys.argv[1]; out = []
for l in open(p):
    if l.startswith('Dialogue:'):
        l = re.sub(r'\{\\fs\d+\}', '', l)
        txt = re.sub(r'\{[^}]*\}', '', l.split(',,0,0,0,,', 1)[1]).strip(); n = len(txt)
        if n > MAXC: l = l.replace(',,0,0,0,,', ',,0,0,0,,{\\fs%d}' % int(112 * MAXC / n), 1)
    out.append(l)
open(p, 'w').writelines(out)
