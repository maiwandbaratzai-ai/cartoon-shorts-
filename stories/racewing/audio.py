# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def zoom(t0, d, f0=70, g=0.35, up=0.0):   # race-car engine pass with a doppler-ish pitch sweep
    n = int(d * SR); t = np.arange(n) / SR; fr = f0 * (1 + up * t / d) * (1 + 0.25 * np.exp(-((t - d * 0.4) / (d * 0.25)) ** 2))
    ph = 2 * np.pi * np.cumsum(fr) / SR; s = (np.sign(np.sin(ph)) * 0.4 + np.sin(ph * 2) * 0.4 + np.sin(ph * 3) * 0.2).astype(np.float32)
    s = lp_fast(s, 1800) * env(n, 0.05, 0.3); place(sfx, s, t0, g)
def hoedown(t0, t1, g=1.0):   # a quick racing banjo-ish pluck line (instruments only)
    notes = [67, 71, 74, 71, 72, 69, 66, 69, 67, 74, 79, 74]; bt = 0.2; k = 0
    while t0 + k * bt < t1: place(music, pluck(midi(notes[k % len(notes)] + 12), 0.3, 0.7), t0 + k * bt, 0.2 * g); place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.28 * g if k % 2 == 0 else 0); k += 1
hoedown(0, LS(1) - 0.05, 1.1); bed(0, LS(1), 'march', 0.6, 132)
bed(LS(1), LS(2), 'quirky', 0.95, 120)
bed(LS(2), LS(4), 'march', 1.0, 132)
hoedown(LS(4), LS(5), 0.9); bed(LS(4), LS(5), 'quirky', 0.7, 128)
bed(LS(5), LS(7) - 0.05, 'tension', 1.45, 160)
bed(LS(7), LS(8) - 0.18, 'march', 0.9, 120)
bed(LS(8), LS(9), 'dark', 0.6, 96)
bed(LS(9), LS(11), 'quirky', 0.85, 112)
bed(LS(11), LS(12), 'march', 1.0, 128)
hoedown(LS(12), D, 1.2); bed(LS(12), D, 'quirky', 0.55, 124)
for fr in [55, 112, 170, 232, 278, 318, 372, 438, 482, 524, 578, 632, 690, 744, 790, 878, 930, 980, 1072, 1117, 1162, 1214, 1262]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [814, 1022]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, crowd(D, 'cheer') if False else rumble(D), 0, 0.03)
# L0 flying car + chicken
zoom(0, 3.4, 80, 0.3, 0.3); gag(cluck(), WS(0, 'chicken'), 0.55); place(sfx, cluck(), 1.0, 0.35); gag(boing(300, 0.5), WS(0, 'flew'), 0.3)
# L1 flipped wing, Wings go UP, why
gag(clink(2), WS(1, 'flipped'), 0.45); place(sfx, flip(), WS(1, 'flipped') + 0.1, 0.4); gag(stamp(), WS(1, 'up'), 0.4); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 lap one: light like a shopping cart on ice
zoom(LS(2), 2.6, 75, 0.32); place(sfx, screech(0.9), WS(2, 'light'), 0.35); gag(rattle(0.8), WS(2, 'shopping'), 0.4); gag(slide(False, 0.6), WS(2, 'ice'), 0.4)
# L3 Henrietta thrilled, wanted to fly since an egg
gag(cluck(), WS(3, 'henrietta'), 0.55); place(sfx, cluck(), WS(3, 'thrilled'), 0.45); gag(boing(500, 0.3), WS(3, 'egg'), 0.4); place(sfx, tweet(), WS(3, 'fly'), 0.3)
# L4 second wing
for k in range(3): place(sfx, clink(1), WS(4, 'bolted') + k * 0.12, 0.4)
gag(thunk(140, 0.25), WS(4, 'second'), 0.45); gag(stamp(), WS(4, 'up'), 0.4)
# L5 lap two: front wheels lift, steers at clouds
zoom(LS(5), 3.6, 85, 0.35, 0.4); gag(slide(True, 0.6), WS(5, 'lifted'), 0.45); place(sfx, sub(0.4, 50), WS(5, 'lifted'), 0.4); gag(boing(220, 0.5), WS(5, 'clouds'), 0.4); place(sfx, cluck(), WS(5, 'dot'), 0.35)
# L6 takes off over forty rows + hot-dog stand
gag(whoosh(1.2), WS(6, 'took'), 0.55); place(sfx, slide(True, 0.9), WS(6, 'took'), 0.4); countup(WS(6, 'forty') - 0.1, WS(6, 'forty') + 0.6, 0.3); place(sfx, cluck(), WS(6, 'rows'), 0.45); gag(bell(1200), WS(6, 'hot'), 0.35)
# L7 hay bales like a dart
place(sfx, slide(False, 0.5), WS(7, 'landed') - 0.5, 0.4); gag(thunk(80, 0.4), WS(7, 'landed'), 0.6); place(sfx, sub(0.6, 46), WS(7, 'landed'), 0.6); place(sfx, leaves(0.8), WS(7, 'hay'), 0.5); gag(boing(160, 0.6), WS(7, 'dart'), 0.45); place(sfx, cluck(), WS(7, 'cushion'), 0.4)
# L8 question + plane wing pulls up (riser into the explanation)
place(sfx, scratch(), LS(8) - 0.12, 0.3); place(sfx, riser(1.2), LS(9) - 1.25, 0.4); gag(slide(True, 0.6), WS(8, 'pull'), 0.4); place(sfx, ting(), WS(8, 'curved'), 0.3)
# L9 flip it: pushes the car down (drop)
place(sfx, drop(), WS(9, 'flip'), 0.5); place(sfx, flip(), WS(9, 'flip'), 0.4); gag(slide(False, 0.6), WS(9, 'pushes'), 0.45); gag(thunk(100, 0.3), WS(9, 'down'), 0.45); place(sfx, sub(0.4, 50), WS(9, 'down'), 0.4)
# L10 grip, tires bite
zoom(LS(10), 2.4, 90, 0.3); gag(ting(), WS(10, 'grip'), 0.4); gag(chew(0.6, 7), WS(10, 'bite'), 0.4); place(sfx, screech(0.5), WS(10, 'corners'), 0.25)
# L11 flipped back, cat on a heater
gag(clink(2), WS(11, 'flipped'), 0.4); gag(stamp(), WS(11, 'back'), 0.4); zoom(WS(11, 'car'), 2.0, 95, 0.3); gag(meow(), WS(11, 'cat'), 0.55); place(sfx, snore(1.0), WS(11, 'heater'), 0.25)
# L12 Henrietta's spare wing, hot-dog stand
gag(clink(1), WS(12, 'spare'), 0.4); place(sfx, cluck(), WS(12, 'spare') + 0.3, 0.5); gag(whoosh(0.6), WS(12, 'reached') - 0.3, 0.4); gag(bell(1320), WS(12, 'stand'), 0.4); place(sfx, cluck(), WS(12, 'stand') + 0.3, 0.5); button(WS(12, 'stand') + 0.45, 'march', 0.9)
mixdown()
