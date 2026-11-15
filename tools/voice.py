# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Narration for a story: Kokoro neural TTS -> voice.wav, timing.json, subs.ass and web/s/<story>_timing.js.

usage: python3 tools/voice.py stories/<story> [target_seconds] [voice]
  stories/<story>/script.txt  one narration line per line (what the captions show)
  stories/<story>/say.txt     optional, same lines with phonetic spellings (what the voice says)
The animation is timed to the voice: shots key off the line/word frames in <story>_timing.js.
"""
import sys, os, re, json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.environ.get('KOKORO_DIR', os.path.join(KIT, 'models'))
sd = sys.argv[1].rstrip('/'); name = os.path.basename(sd)
target = float(sys.argv[2]) if len(sys.argv) > 2 else None
VOICE = sys.argv[3] if len(sys.argv) > 3 else 'am_puck'   # Maiwand's pick (2026-11-12): playful male
FPS, SR = 30, 24000
lines = [l.strip() for l in open(f'{sd}/script.txt') if l.strip()]
say = [l.strip() for l in open(f'{sd}/say.txt') if l.strip()] if os.path.exists(f'{sd}/say.txt') else lines
assert len(say) == len(lines)
# SCRIPTS.md lint (full report) + VIRAL.md §3 checks (warnings only)
import subprocess as _sp; _sp.run([sys.executable, os.path.join(KIT, 'tools', 'script_check.py'), sd, str(int(target or 30))])
_nw = sum(len(l.split()) for l in lines)
if len(lines[0].split()) > 12: print(f'WARN hook line has {len(lines[0].split())} words (VIRAL.md: <= 12)')
if lines[0].lower().startswith(('did you know', 'in this video', 'let me', 'have you ever')): print('WARN hook starts with throat-clearing')
if target and target <= 35 and not 70 <= _nw <= 95: print(f'WARN {_nw} words for a {target}s short (aim 75-90)')
if target and target >= 50 and not 150 <= _nw <= 185: print(f'WARN {_nw} words for a {target}s video (aim 155-175 for 64 s)')
k = Kokoro(f'{MODEL}/kokoro-v1.0.onnx', f'{MODEL}/voices-v1.0.bin')

def synth(speed):
    out = []
    for l in say:
        a, sr = k.create(l, voice=VOICE, speed=speed, lang='en-us')
        idx = np.where(np.abs(a) > 0.01)[0]; out.append(a[max(0, idx[0] - 120):idx[-1] + 600].astype(np.float32))
    return out
LEAD, TAIL = 0.12, 1.3
gap = lambda l: 0.42 if l.endswith('?') else 0.3 if l.endswith(('.', '!')) else 0.18
def total(clips): return LEAD + sum(len(c) / SR for c in clips) + sum(gap(l) for l in lines[:-1]) + TAIL
speed = float(os.environ.get('VOICE_SPEED', 1.2)); clips = synth(speed)
if target and not os.environ.get('VOICE_SPEED'):  # VOICE_SPEED=1.25 pins the speed (the auto-fit can oscillate)
    for _ in range(3):
        # never speed up past the natural pace to squeeze a long script in (longer than the target is fine);
        # only slow down a little (to 1.05) when the script runs short, then pad the ending below
        T = total(clips); s2 = float(np.clip(speed * (T - LEAD - TAIL) / (target - LEAD - TAIL), 1.1, 1.2))
        if abs(s2 - speed) < 0.015: break
        speed = s2; clips = synth(speed)
print(f'speed {speed:.2f}  length {total(clips):.2f}s')

t = LEAD; buf = []; L = []
for i, (c, l) in enumerate(zip(clips, lines)):
    L.append(dict(text=l, s=round(t, 3), e=round(t + len(c) / SR, 3)))
    buf.append((t, c)); t += len(c) / SR + (gap(l) if i < len(lines) - 1 else 0)
dur = t + TAIL
if target and dur < target:   # videos may run longer than the target but never shorter (30 s Shorts, 64 s TikTok)
    if target - dur > 1.2:     # analytics 2026-11-14: a 4 s silent tail made viewers leave before the loop
        sys.exit(f'ERROR: narration ends {target - dur:.1f}s short of {target}s. Add a line to the script (do not pad).')
    print(f'padding ending by {target - dur:.2f}s to reach {target}s'); dur = float(target)
frames = int(np.ceil(dur * FPS))
raw = np.zeros(int(dur * SR) + SR, np.float32)
for t0, c in buf: i = int(t0 * SR); raw[i:i + len(c)] += c
sf.write(f'{sd}/voice_raw.wav', raw[:int(dur * SR)], SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{sd}/voice_raw.wav', '-af',
    'aresample=48000,highpass=f=80,equalizer=f=200:t=q:w=1:g=1,equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=-22dB:ratio=4:attack=3:release=60,volume=1.6',
    f'{sd}/voice.wav'], check=True)

# ---- word timings: spread each line's words over its voiced time, weighted by length; pauses come from silence
words = []
for li, ((t0, c), l) in enumerate(zip(buf, lines)):
    hop = int(0.01 * SR); rms = np.array([np.sqrt(np.mean(c[j:j + hop] ** 2)) for j in range(0, len(c) - hop, hop)])
    v = rms > rms.max() * 0.06; run = 0; vv = v.copy()
    for j in range(len(v)):
        if not v[j]: run += 1
        else:
            if 0 < run < 6: vv[j - run:j] = True
            run = 0
    vt = np.where(vv)[0] * 0.01; toks = l.split()
    wgt = np.array([len(re.sub(r'[^\w]', '', w)) + (3 * len(re.findall(r'\d', w)) if re.search(r'\d', w) else 0) + 1.5 for w in toks], float)
    cum = np.concatenate([[0], np.cumsum(wgt)]) / wgt.sum() * (len(vt) - 1)
    for j, w in enumerate(toks):
        s = vt[int(cum[j])]; e = vt[min(int(cum[j + 1]), len(vt) - 1)] + 0.01
        words.append(dict(w=w, s=round(t0 + s, 3), e=round(t0 + e, 3), line=li))
json.dump(dict(fps=FPS, frames=frames, dur=round(dur, 3), target=target, lines=L, words=words, speed=speed, voice=VOICE), open(f'{sd}/timing.json', 'w'), indent=1)
os.makedirs(f'{KIT}/web/s', exist_ok=True)
with open(f'{KIT}/web/s/{name}_timing.js', 'w') as f:
    f.write('// generated by tools/voice.py — line and word start frames\n')
    f.write(f'export const TOTAL = {frames};\n')
    f.write('export const LINES = ' + json.dumps([[round(x["s"] * FPS), round(x["e"] * FPS)] for x in L]) + ';\n')
    f.write('export const WORDS = ' + json.dumps([[w["w"], round(w["s"] * FPS), w["line"]] for w in words]) + ';\n')
    f.write('/** frame where word number n (0-based, counting through the whole script) starts */\nexport const W = (n) => WORDS[n][1];\n')
    f.write('/** frame of the first word in line li whose text starts with str */\nexport const wf = (li, str) => { const w = WORDS.find((x) => x[2] === li && x[0].toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(str.toLowerCase())); if (!w) throw new Error("no word " + str); return w[1]; };\n')

# ---- captions: 1-3 words, current word yellow, pop-in
chunks, cur = [], []
for w in words:
    if cur and (w['line'] != cur[-1]['line'] or len(cur) == 3): chunks.append(cur); cur = []
    cur.append(w)
    if re.search(r'[.,?!:;]$', w['w']): chunks.append(cur); cur = []
if cur: chunks.append(cur)
def ts(x): return f'{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}'
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Poppins,112,&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,-1,0,0,0,100,100,3,0,1,9,5,2,50,50,560,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for ci, ch in enumerate(chunks):
    end = ch[-1]['e'] + 0.25
    if ci + 1 < len(chunks): end = min(max(end, ch[-1]['e']), chunks[ci + 1][0]['s'])
    for j, w in enumerate(ch):
        a = w['s']; b = ch[j + 1]['s'] if j + 1 < len(ch) else end
        if b <= a: continue
        txt = ' '.join(('{\\c&H00E6FF&}' + x['w'].upper() + '{\\c&HFFFFFF&}') if m == j else x['w'].upper() for m, x in enumerate(ch))
        pop = '{\\fscx80\\fscy80\\t(0,90,\\fscx100\\fscy100)}' if j == 0 else ''
        ev.append(f'Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{pop}{txt}')
open(f'{sd}/subs.ass', 'w').write(head + '\n'.join(ev) + '\n')
subprocess.run([sys.executable, os.path.join(KIT, 'tools', 'fitsubs.py'), f'{sd}/subs.ass'])
print(f'{frames} frames, {len(lines)} lines, {len(words)} words')
for i, x in enumerate(L): print(f'  L{i} {round(x["s"]*FPS):4d}-{round(x["e"]*FPS):4d}  {x["text"]}')
