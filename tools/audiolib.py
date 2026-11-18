# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Shared audio: synthesized music beds + SFX library + voice-led mix. Original sounds only (numpy).
usage in a story's audio.py:
    import sys; sys.path.insert(0, KIT + '/tools'); from audiolib import *
    TM = init('stories/x')     # reads timing.json + voice.wav
    bed(0, 10, 'quirky'); place(sfx, boom(), F(586))
    mixdown()                  # -> stories/x/mix_raw.wav
"""
import numpy as np, subprocess, wave, json, os

SR = 48000
rng = np.random.default_rng(7)
N = 0; MAXN = SR * 200; music = np.zeros(MAXN, np.float32); sfx = np.zeros(MAXN, np.float32); SD = '.'; TM = {}
def init(story_dir):
    global N, music, sfx, SD, TM
    SD = story_dir; TM = json.load(open(f'{SD}/timing.json'))
    N = int(TM['frames'] / 30 * SR); music[:] = 0; sfx[:] = 0
    return TM
F = lambda f: f / 30
LS = lambda i: TM['lines'][i]['s']           # line start (s)
LE = lambda i: TM['lines'][i]['e']           # line end (s)
def WS(li, word):                           # start (s) of first word in line li starting with `word`
    import re
    for w in TM['words']:
        if w['line'] == li and re.sub(r'[^a-z0-9]', '', w['w'].lower()).startswith(word.lower()): return w['s']
    raise KeyError(word)

def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def lp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)
def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 - 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)
def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if i < 0: sig = sig[-i:]; j = min(N, len(sig)); i = 0
    if i < N and j > i: buf[i:j] += sig[: j - i] * gain
midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- instruments ----------------
def pluck(f, dur=0.35, bright=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((bright ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6))
    return (s * env(n, 0.003, dur * 0.35)).astype(np.float32)
def pizz(f, dur=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(4 * np.pi * f * t) + 0.15 * np.sin(6 * np.pi * f * t)
    return (s * env(n, 0.002, 0.07)).astype(np.float32)
def marimba(f, dur=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + 0.3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 25)
    return (s * np.minimum(1, t / 0.002)).astype(np.float32)
def brass(fs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in fs:
        ph = 2 * np.pi * f * t + 0.003 * np.sin(2 * np.pi * 5 * t)
        s += sum(np.sin((k + 1) * ph) / (k + 1) ** 1.3 for k in range(8))
    a = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.15).clip(0)
    return lp_fast((s * a).astype(np.float32), 1800) / len(fs)
def pad(fs, dur, cut=900):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in fs:
        for d in (-0.004, 0.004): s += np.sign(np.sin(2 * np.pi * f * (1 + d) * t)) * 0.5
    a = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6).clip(0)
    return lp_fast((s * a).astype(np.float32), cut) / len(fs) * 0.5
def drum(kind):
    if kind == 'kick':
        n = int(0.35 * SR); t = np.arange(n) / SR; f = 50 + 90 * np.exp(-t * 30)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)).astype(np.float32)
    if kind == 'hat':
        n = int(0.06 * SR); t = np.arange(n) / SR
        return hp_fast((rng.standard_normal(n) * np.exp(-t * 70)).astype(np.float32), 6000) * 0.5
    n = int(0.18 * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n) * np.exp(-t * 28) * 0.6 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 20) * 0.5
    return hp_fast(s.astype(np.float32), 300)

# ---------------- music beds (original) ----------------
PROGS = {
    'quirky': [(48, [60, 64, 67]), (45, [57, 60, 64]), (50, [62, 65, 69]), (43, [55, 59, 62])],   # C Am Dm G
    'march': [(43, [55, 59, 62]), (48, [60, 64, 67]), (50, [62, 66, 69]), (43, [55, 59, 62])],    # G C D G
    'dark': [(45, [57, 60, 64]), (41, [53, 57, 60]), (43, [55, 59, 62]), (40, [52, 56, 59])],     # Am F G E
    'sad': [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])],      # Am F C G
}
def bed(t0, t1, style='quirky', gain=1.0, bpm=None):
    """bars of a style between t0 and t1 (s). styles: quirky, march, dark, sad, tension"""
    if style == 'tension':
        n = int((t1 - t0) * SR); td = np.arange(n) / SR
        dr = (np.sin(2 * np.pi * 55 * td) + 0.5 * np.sin(2 * np.pi * 82.4 * td) + 0.3 * np.sin(2 * np.pi * 110.3 * td)) * np.minimum(1, td / 0.8) * np.minimum(1, (t1 - t0 - td) / 0.4).clip(0)
        place(music, lp_fast(dr.astype(np.float32), 500), t0, 0.12 * gain)
        bt = 60 / (bpm or 120); k = 0
        while t0 + k * bt < t1 - 0.1: place(music, drum('kick'), t0 + k * bt, 0.35 * gain * (0.6 + 0.4 * k / max(1, (t1 - t0) / bt))); k += 1
        return
    bpm = bpm or {'quirky': 124, 'march': 112, 'dark': 92, 'sad': 80}[style]; prog = PROGS[style]
    bt = 60 / bpm; bar = 0; tt = t0
    while tt < t1 - 0.05:
        root, ch = prog[bar % len(prog)]
        for b in range(4):
            tb = tt + b * bt
            if tb >= t1: break
            if style == 'quirky':
                place(music, pizz(midi(root - 12 + (7 if b % 2 else 0))), tb, 0.45 * gain)
                place(music, marimba(midi(ch[(b * 2 + bar) % 3] + 12)), tb + bt / 2, 0.16 * gain)
                if b % 2 == 0: place(music, marimba(midi(ch[(b + 1) % 3] + 12)), tb, 0.12 * gain)
                place(music, drum('hat'), tb + bt / 2, 0.35 * gain); place(music, drum('kick' if b % 2 == 0 else 'snare'), tb, (0.42 if b % 2 == 0 else 0.18) * gain)
            elif style == 'march':
                place(music, drum('snare'), tb, 0.22 * gain); place(music, drum('snare'), tb + bt * 0.75, 0.1 * gain)
                if b % 2 == 0: place(music, drum('kick'), tb, 0.45 * gain)
                place(music, pluck(midi(root - 12), 0.35, 0.4), tb, 0.35 * gain)
                if b == 0: place(music, brass([midi(m) for m in ch], bt * 3.8), tb, 0.07 * gain)
                place(music, pizz(midi(ch[b % 3] + 12)), tb + bt / 2, 0.14 * gain)
            else:  # dark / sad
                if b == 0: place(music, pad([midi(m) for m in ch], bt * 4), tb, 0.5 * gain)
                place(music, pluck(midi(root - 12), 0.6, 0.3), tb, (0.35 if b % 2 == 0 else 0.15) * gain)
                place(music, marimba(midi(ch[(b + bar) % 3] + (12 if style == 'sad' else 0))), tb + bt / 2, 0.12 * gain)
                if style == 'dark': place(music, drum('kick'), tb, (0.4 if b in (0, 2) else 0.0) * gain)
        bar += 1; tt += bt * 4
    i1 = min(N, int(t1 * SR)); i0 = max(0, int((t1 - 0.12) * SR))
    music[i0:i1] *= np.linspace(1, 0, i1 - i0) ** 2; music[i1:min(N, i1 + int(2 * SR))] *= 0  # silence ring-over
def button(t, style='quirky', gain=1.0):
    root, ch = PROGS.get(style, PROGS['quirky'])[0]
    place(music, brass([midi(m) for m in ch + [ch[0] + 12]], 1.6), t, 0.12 * gain); place(music, drum('kick'), t, 0.5 * gain)

# ---------------- sfx ----------------
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def sub(d=0.5, f0=52, drop=1.7):
    """Deep low-end body for impacts (YouTube feedback 2026-11-18: more bass on thuds and hums).
    A pitch-dropping sine, lightly saturated so its harmonics still read as bass on phone speakers."""
    n = int(d * SR); t = np.arange(n) / SR
    f = f0 * (1 + (drop - 1) * np.exp(-t * 25)); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (4.5 / d))
    return (np.tanh(s * 2.2) / np.tanh(2.2) * np.minimum(1, t / 0.003)).astype(np.float32)
def thunk(f0=90, d=0.3, bass=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + lp_fast(noise(d), 1200) * np.exp(-t * 30) * 0.5
    out = np.zeros(int(max(d, 0.45) * SR), np.float32); out[:n] += s.astype(np.float32)
    if bass: out += sub(len(out) / SR, 50) * bass
    return out
def stomp(weight=1.0):
    """Heavy footfall (elephant, giant, big boots): deep sub thump + ground knock + a little grit."""
    d = 0.55; n = int(d * SR); t = np.arange(n) / SR
    s = sub(d, 44, 1.9) * 1.0 + np.sin(2 * np.pi * 95 * t) * np.exp(-t * 22) * 0.5 + lp_fast(noise(d), 700) * np.exp(-t * 28) * 0.5
    return (s * weight).astype(np.float32)
def rumble(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 160) * 3 * np.minimum(1, t / 0.15) * np.exp(-t / (d * 0.45))
    return s.astype(np.float32)
def crash(d=1.2):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k in range(14):
        tk = rng.uniform(0, d * 0.6); i = int(tk * SR); g = thunk(rng.uniform(60, 160), 0.35) * rng.uniform(0.3, 0.9)
        s[i:i + len(g)] += g[: n - i]
    s += lp_fast(noise(d), 2500) * np.exp(-t * 3) * 0.25
    return s
def cuckoo():
    out = []
    for f, d in [(740, 0.16), (587, 0.24)]:
        n = int(d * SR); t = np.arange(n) / SR
        out.append(np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.01) * np.exp(-t * 6)); out.append(np.zeros(int(0.06 * SR)))
    return np.concatenate(out).astype(np.float32)
def scrape(d=0.8):
    n = int(d * SR); t = np.arange(n) / SR
    s = noise(d) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) * np.sin(np.pi * t / d)
    s = hp_fast(lp_fast(s, 5000), 1500)
    ring = np.sin(2 * np.pi * 1870 * t) * np.exp(-t * 3) * 0.2
    return (s * 0.6 + ring).astype(np.float32)
def ting():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 4), (3136, 6), (4186, 8)]) * 0.3).astype(np.float32)
def sting():
    n = int(2.0 * SR); t = np.arange(n) / SR
    low = np.sin(2 * np.pi * 41 * t) * np.exp(-t * 1.5) * 1.2
    hit = lp_fast(noise(2.0), 900) * np.exp(-t * 6) * 0.8
    stab = brass([midi(45), midi(48), midi(51)], 1.4); s = low + hit; s[: len(stab)] += stab * 2.2 * np.exp(-np.arange(len(stab)) / SR * 2)
    return s.astype(np.float32)
def creak(d=0.6, f0=140):
    n = int(d * SR); t = np.arange(n) / SR
    rate = f0 * (1 + 0.35 * np.sin(2 * np.pi * 1.3 * t / d))
    ph = np.cumsum(rate) / SR; pulses = (np.mod(ph, 1) < 0.08).astype(np.float32)
    s = lp_fast(pulses * (0.6 + 0.4 * rng.random(n).astype(np.float32)), 2200) * np.sin(np.pi * t / d)
    return hp_fast(s, 200) * 2.5
def snap():
    d = 0.5; n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(noise(d), 800) * np.exp(-t * 18) * 1.4 + np.pad(thunk(120, 0.4), (0, n - int(0.4 * SR))) * 0.6).astype(np.float32)
def splash(d=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 4000) * (np.exp(-t * 4) * np.minimum(1, t / 0.01)) + lp_fast(noise(d), 400) * np.exp(-t * 7) * 1.5
    return s.astype(np.float32)
def whoosh(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 1500) * np.sin(np.pi * t / d) ** 2 * 0.6).astype(np.float32)
def snore(d=1.1):
    n = int(d * SR); t = np.arange(n) / SR
    buzz = (np.mod(np.cumsum(60 + 25 * np.sin(np.pi * t / d)) / SR, 1) < 0.3).astype(np.float32)
    return (lp_fast(buzz * 0.5 + noise(d) * 0.15, 700) * np.sin(np.pi * t / d) ** 2).astype(np.float32)
def leaves(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(lp_fast(noise(d), 6000), 2500) * (0.3 + 0.3 * np.sin(2 * np.pi * 0.7 * t) ** 2) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)).astype(np.float32)
def water(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 900) * 0.5 + hp_fast(lp_fast(noise(d), 3000), 1200) * 0.15 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t))).astype(np.float32)


def roar(d, bright=1200):
    n = int(d * SR); t = np.arange(n) / SR
    return ((lp_fast(noise(d), bright) * 0.8 + hp_fast(lp_fast(noise(d), 4000), 1500) * 0.25) * np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6)).astype(np.float32)
def hum(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * 58 * k * t + k) / k for k in range(1, 8)) * (0.8 + 0.2 * np.sin(2 * np.pi * 3.1 * t))
    s = s + np.tanh(2 * np.sin(2 * np.pi * 36 * t)) * 0.9 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t))   # deep under-hum for tension
    return lp_fast((s * 0.4 + noise(d) * 0.08).astype(np.float32), 1500) * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.05)
def bloop(f0=220):
    n = int(0.28 * SR); t = np.arange(n) / SR; f = f0 * (1 + 2.2 * t / 0.28)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * np.minimum(1, t / 0.005)).astype(np.float32)
def horn(d=0.7):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * 174 * t)) * 0.5 + np.sin(2 * np.pi * 348 * t) * 0.3
    return lp_fast((s * np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.1)).astype(np.float32), 1600)
def rattle(d):
    n = int(d * SR); t = np.arange(n) / SR; x = np.zeros(n, np.float32)
    for k in range(int(d * 9)): i = int((k / 9 + rng.uniform(0, 0.03)) * SR); g = thunk(rng.uniform(300, 700), 0.08) * rng.uniform(0.2, 0.6); x[i:i + len(g)] += g[: n - i]
    return x + creak(d, 70) * 0.25
def drip():
    n = int(0.3 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * (900 + 1500 * t) * t) * np.exp(-t * 25)).astype(np.float32)

def boom(d=2.5):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(rng.standard_normal(n).astype(np.float32), 400) * np.exp(-t * 2.2) * 3 + np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t * 8)) / SR) * np.exp(-t * 3)
    s += hp_fast(rng.standard_normal(n).astype(np.float32), 2000) * np.exp(-t * 14) * 0.6
    return (s * np.minimum(1, t / 0.004)).astype(np.float32) * 0.6
def gunshot():
    n = int(0.25 * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n) * np.exp(-t * 40) + np.sin(2 * np.pi * 110 * t) * np.exp(-t * 30)
    return lp_fast(s.astype(np.float32), 3500) * 0.8
def mgun(d=1.2, rate=9):
    out = np.zeros(int((d + 0.3) * SR), np.float32)
    for k in range(int(d * rate)): s = gunshot(); i = int(k / rate * SR); out[i:i + len(s)] += s * (0.8 + 0.2 * rng.random())
    return out
def splat():
    n = int(0.3 * SR); t = np.arange(n) / SR
    return lp_fast((rng.standard_normal(n) * np.exp(-t * 18)).astype(np.float32), 900) * 1.2 + (np.sin(2 * np.pi * (180 - 300 * t) * t) * np.exp(-t * 20)).astype(np.float32) * 0.5
def gull():
    n = int(0.45 * SR); t = np.arange(n) / SR; f = 1500 + 500 * np.sin(np.pi * t / 0.45) - 300 * t
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * t))
    return (s * np.sin(np.pi * t / 0.45) ** 2).astype(np.float32) * 0.4
def crowd(d=2.0, mood='cheer'):
    # DISABLED: crowd voices are voices; only the narrator speaks (VIRAL.md §5). Returns silence.
    return np.zeros(int(d * SR), np.float32)
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k in range(14):
        f0 = rng.uniform(180, 420) * (1.4 if mood == 'scream' else 1); vib = rng.uniform(4, 7)
        f = f0 * (1 + 0.06 * np.sin(2 * np.pi * vib * t)) * (1 + (0.4 if mood == 'gasp' else 0.15) * np.exp(-t * 3))
        v = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.1
        s += (v * np.minimum(1, t / rng.uniform(0.03, 0.2)) * np.exp(-t / (0.4 if mood == 'gasp' else d * 0.6))).astype(np.float32)
    s = lp_fast(s, 2400) + hp_fast(rng.standard_normal(n).astype(np.float32), 1500) * 0.08 * np.exp(-t / d)
    return s.astype(np.float32) * 0.5
def squawk():   # emu: low drumming boom + grunt
    n = int(0.5 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 70 * t + 3 * np.sin(2 * np.pi * 9 * t)) * np.exp(-t * 6) + 0.3 * np.sign(np.sin(2 * np.pi * 140 * t)) * np.exp(-t * 12)
    return lp_fast(s.astype(np.float32), 700) * 0.7
def footsteps(d, rate=9, f0=900):
    out = np.zeros(int((d + 0.2) * SR), np.float32)
    for k in range(int(d * rate)):
        n = int(0.05 * SR); t = np.arange(n) / SR; s = lp_fast((rng.standard_normal(n) * np.exp(-t * 60)).astype(np.float32), f0)
        i = int((k + 0.2 * rng.random()) / rate * SR); out[i:i + n] += s
    return out
def engine(d, f0=38):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * f0 * t)) * 0.3 + np.sin(2 * np.pi * f0 * 2 * t) * 0.3 + rng.standard_normal(n) * 0.05
    return lp_fast(s.astype(np.float32), 400) * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3).clip(0)
def pop():      # rivet: sharp metallic ping + crack
    n = int(0.35 * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n) * np.exp(-t * 90) + np.sin(2 * np.pi * 2300 * t) * np.exp(-t * 18) * 0.4 + np.sin(2 * np.pi * 3700 * t) * np.exp(-t * 25) * 0.2
    return s.astype(np.float32) * 0.6
def gloop(d=1.5):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for k in range(int(d * 6)):
        t0 = rng.uniform(0, d - 0.2); f = rng.uniform(80, 220); m = (t > t0) & (t < t0 + 0.2); tt = t[m] - t0
        s[m] += np.sin(2 * np.pi * (f + 400 * tt) * tt) * np.exp(-tt * 18)
    return lp_fast(s.astype(np.float32), 800) * 0.6
def bell(f=880):
    n = int(1.4 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.2 + k)) / k for k in (1, 2.4, 3.9))).astype(np.float32) * 0.3


# ---------------- comedy sfx (YouTube feedback 2026-11-15: punchier bespoke SFX on the jokes) ----------------
def bonk(f0=420):           # cartoon head-bonk / comedic thud: woody knock + falling pitch
    d = 0.35; n = int(d * SR); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f0 * t * (1 - 0.35 * t / d)) * np.exp(-t * 22)
    return ((tone + thunk(70, d) * 0.9 + hp_fast(noise(d), 2500) * np.exp(-t * 80) * 0.4) * 0.5).astype(np.float32)
def chew(d=1.2, rate=5.0):   # crunchy chewing: rhythmic filtered noise bursts
    n = int(d * SR); t = np.arange(n) / SR
    gate = np.clip(np.sin(2 * np.pi * rate * t), 0, 1) ** 3
    return ((lp_fast(noise(d), 2500) * 0.8 + hp_fast(noise(d), 3000) * 0.5 * (rng.random(n) > 0.97)) * gate * 0.5).astype(np.float32)
def boing(f0=180, d=0.6):    # spring: pitch wobble
    n = int(d * SR); t = np.arange(n) / SR
    f = f0 * (1 + 0.5 * np.sin(2 * np.pi * 12 * t) * np.exp(-t * 4))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 0.8).astype(np.float32)
def slide(up=True, d=0.7):   # slide whistle up/down
    n = int(d * SR); t = np.arange(n) / SR
    f = np.linspace(500, 1600, n) if up else np.linspace(1600, 400, n)
    return (np.sin(2 * np.pi * np.cumsum(f * (1 + 0.01 * np.sin(2 * np.pi * 6 * t))) / SR) * np.sin(np.pi * t / d) * 0.5).astype(np.float32)
def scratch():               # record scratch: stop-the-story moment
    d = 0.45; n = int(d * SR); t = np.arange(n) / SR
    f = 300 + 900 * np.abs(np.sin(2 * np.pi * 3.5 * t))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + bp(noise(d), 1200) * 0.8) .astype(np.float32) * np.exp(-t * 3).astype(np.float32)
def bp(x, f): return hp_fast(lp_fast(x, f * 1.5), f * 0.6)
def ribbit():                # frog/toad croak
    d = 0.4; n = int(d * SR); t = np.arange(n) / SR
    pulses = (np.sin(2 * np.pi * 28 * t) > 0.2).astype(np.float32)
    return (np.sin(2 * np.pi * 140 * t) * pulses * np.sin(np.pi * t / d) * 0.9).astype(np.float32)
def tick():                  # counter tick for numbers ticking up
    d = 0.05; t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120)).astype(np.float32)
def countup(t0, t1, gain=0.6):  # rapid ticks while a big number counts up on screen
    k = t0
    while k < t1: place(sfx, tick(), k, gain); k += 0.05 + 0.1 * (k - t0) / max(0.01, t1 - t0)
def screech(d=0.9):          # tyres swerving
    n = int(d * SR); t = np.arange(n) / SR
    f = 2200 + 400 * np.sin(2 * np.pi * 7 * t)
    return ((np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35 + bp(noise(d), 2600) * 0.6) * np.minimum(1, t / 0.03) * np.exp(-t * 2.2)).astype(np.float32)
def flip():                  # sign / card / page flipping over
    d = 0.22; n = int(d * SR); t = np.arange(n) / SR
    return (bp(noise(d), 1800) * np.exp(-((t - 0.06) / 0.04) ** 2) * 1.2 + thunk(300, d) * np.exp(-((t - 0.14) / 0.02) ** 2) * 0.5).astype(np.float32)
def stamp():                 # rubber stamp / gavel: sharp thud + paper slap
    d = 0.3; n = int(d * SR); t = np.arange(n) / SR
    return ((thunk(110, d) * 0.9 + hp_fast(noise(d), 1500) * np.exp(-t * 60) * 0.6) * 0.45).astype(np.float32)
def swish(d=0.28):           # fast whip-pan transition between shots
    n = int(d * SR); t = np.arange(n) / SR
    env_ = np.sin(np.pi * t / d) ** 3
    lo, hi = bp(noise(d), 1000), bp(noise(d), 3200)
    return ((lo * (1 - t / d) + hi * (t / d)) * env_ * 0.9).astype(np.float32)
def gulp():
    d = 0.3; n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * (300 - 500 * t) * t) * np.exp(-t * 10) + lp_fast(noise(d), 600) * np.exp(-t * 20) * 0.5).astype(np.float32)


# ---------------- character voices & animal sounds (YouTube feedback: give characters soundbites) ----------------
_kok = None
def vox(text, t, voice='am_michael', speed=1.15, gain=0.9, pitch=1.0):
    """DISABLED (Maiwand 2026-11-18): only the narrator speaks in our videos. This does nothing.
    A character says a short line ("Huh?!", "Mine!", "Nooo!") at time t, in a different voice from the narrator.
    voices: am_michael, am_adam, am_fenrir (men), af_bella, af_nicole, af_sky (women), bf_emma, bm_george (British).
    pitch > 1 = higher/cartoonier (also faster). Keep lines to 1-4 words so they don't fight the narration."""
    print('vox() is disabled: only the narrator speaks (VIRAL.md §5)'); return
    global _kok
    import os
    if _kok is None:
        from kokoro_onnx import Kokoro
        M = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'models')
        _kok = Kokoro(f'{M}/kokoro-v1.0.onnx', f'{M}/voices-v1.0.bin')
    a, sr = _kok.create(text, voice=voice, speed=speed, lang='en-us')
    a = np.asarray(a, dtype=np.float32)
    n_out = int(len(a) * SR / sr / pitch); a = np.interp(np.linspace(0, len(a) - 1, n_out), np.arange(len(a)), a).astype(np.float32)
    a = a / (np.abs(a).max() + 1e-6) * 0.8
    place(sfx, a, t, gain / max(0.01, 0.55))   # sfx bus is scaled by sfx_gain in mixdown
def _tone(f0, d, vib=0, vibf=6, harm=(1, .5, .25), env=None):
    n = int(d * SR); t = np.arange(n) / SR; f = f0 * (1 + vib * np.sin(2 * np.pi * vibf * t)) if np.isscalar(f0) else f0
    ph = 2 * np.pi * np.cumsum(f) / SR; y = sum(h * np.sin((i + 1) * ph) for i, h in enumerate(harm))
    e = env if env is not None else np.sin(np.pi * t / d) ** 0.6
    return (y * e / sum(harm)).astype(np.float32)
def bark():
    d = 0.22; n = int(d * SR); t = np.arange(n) / SR; f = 420 * np.exp(-t * 4)
    return (_tone(f, d, harm=(1, .8, .6, .4)) * 0.8 + bp(noise(d), 900) * np.exp(-t * 20) * 0.5).astype(np.float32)
def meow():
    d = 0.6; n = int(d * SR); t = np.arange(n) / SR; f = 520 + 380 * np.sin(np.pi * t / d) - 150 * t
    return _tone(f, d, harm=(1, .6, .4, .2)) * 0.8
def moo():
    d = 1.1; n = int(d * SR); t = np.arange(n) / SR; f = 115 + 30 * np.sin(np.pi * t / d)
    return _tone(f, d, harm=(1, .9, .7, .5, .3), env=np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3)) * 0.9
def oink():
    d = 0.18; n = int(d * SR); t = np.arange(n) / SR
    y = _tone(260 * (1 + 0.3 * np.sin(2 * np.pi * 35 * t)), d, harm=(1, .8, .6)) + bp(noise(d), 600) * 0.6
    return (y * np.sin(np.pi * t / d)).astype(np.float32) * 0.8
def baa():
    d = 0.7; n = int(d * SR); t = np.arange(n) / SR
    return _tone(330 * (1 + 0.06 * np.sign(np.sin(2 * np.pi * 9 * t))), d, harm=(1, .7, .5, .3)) * 0.7
def quack():
    d = 0.2; n = int(d * SR); t = np.arange(n) / SR
    return (bp(_tone(500 * np.exp(-t * 2), d, harm=(1, 1, 1, .8, .6)), 1400) * 2.2).astype(np.float32)
def cluck():
    out = np.zeros(int(0.5 * SR), np.float32)
    for k in range(3): c = _tone(700 + 120 * k, 0.07, harm=(1, .7, .4)); i = int(k * 0.13 * SR); out[i:i + len(c)] += c
    return out
def roar():
    d = 1.0; n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 500) * 1.4 + _tone(90 + 30 * np.sin(np.pi * t / d), d, harm=(1, .8, .6)) * 0.6).astype(np.float32) * np.sin(np.pi * t / d).astype(np.float32)
def neigh():
    d = 0.9; n = int(d * SR); t = np.arange(n) / SR; f = 700 - 350 * t / d
    return _tone(f, d, vib=0.08, vibf=14, harm=(1, .6, .4)) * 0.6
def monkey():   # "ooh ooh ah ah"
    out = np.zeros(int(1.0 * SR), np.float32)
    for k, (f, d) in enumerate([(380, 0.14), (420, 0.14), (650, 0.18), (700, 0.2)]): c = _tone(f, d, harm=(1, .6, .3)); i = int(k * 0.22 * SR); out[i:i + len(c)] += c
    return out
def trumpet():  # elephant
    d = 0.9; n = int(d * SR); t = np.arange(n) / SR
    return (_tone(300 + 200 * np.sin(np.pi * t / d), d, vib=0.03, vibf=20, harm=(1, .9, .8, .7, .5)) * 0.7).astype(np.float32)
def squeak():
    d = 0.15; n = int(d * SR); t = np.arange(n) / SR
    return _tone(2200 + 1200 * t / d, d, harm=(1, .3)) * 0.5
def tweet():
    out = np.zeros(int(0.5 * SR), np.float32)
    for k in range(3): c = _tone(np.linspace(3000, 4200, int(0.08 * SR)), 0.08, harm=(1, .2)); i = int(k * 0.12 * SR); out[i:i + len(c)] += c * 0.6
    return out
def gasp():
    # DISABLED: a gasp is a voice; only the narrator speaks (VIRAL.md §5). Returns silence.
    return np.zeros(int(0.35 * SR), np.float32)
    d = 0.35; n = int(d * SR); t = np.arange(n) / SR
    return (bp(noise(d), 1800) * np.sin(np.pi * t / d) ** 2 * 0.7).astype(np.float32)

# ---------------- mix ----------------
def load_voice():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SD}/voice.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).copy(); out = np.zeros(N, np.float32); out[:min(N, len(v))] = v[:N]; return out
def mixdown(music_gain=0.8, sfx_gain=0.55):
    voice = load_voice()
    ve = np.abs(voice); k = int(0.05 * SR); ve = np.convolve(ve, np.ones(k) / k, 'same')
    # stronger, smoother ducking (YouTube feedback 2026-11-17: dip the music more under fast narration)
    vmax = max(float(ve.max()), 1e-6)
    duck = 1 - 0.82 * np.clip(ve / (vmax * 0.18), 0, 1)
    k2 = int(0.12 * SR); duck = np.convolve(duck, np.ones(k2) / k2, 'same')
    m, x = music[:N], sfx[:N]
    mix = voice * 1.25 + m * duck * music_gain + x * sfx_gain * (1 - 0.3 * np.clip(ve / (vmax * 0.25), 0, 1))
    mix = np.tanh(mix * 0.95) / np.tanh(0.95)
    fade = int(0.04 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    with wave.open(f'{SD}/mix_raw.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print('mix ok', len(pcm) / SR)
