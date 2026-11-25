# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def wind(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 700) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 0.7)).astype(np.float32), t0, g)
def flutter(t0, d, g=0.25): n = int(d * SR); place(sfx, (lp_fast(noise(d), 1400) * (0.5 + 0.5 * np.sign(np.sin(np.arange(n) / SR * 2 * np.pi * 14)))).astype(np.float32) * env(n, 0.05, 0.2), t0, g)
def whirl(t0, d, g=0.3): n = int(d * SR); tt = np.arange(n) / SR; place(sfx, (lp_fast(noise(d), 900) * (0.5 + 0.5 * np.sin(2 * np.pi * (3 + 6 * tt / d) * tt))).astype(np.float32) * env(n, 0.1, 0.2), t0, g)
def breeze(t0, t1, g=0.5):   # a skipping whistle-and-pluck tune (instruments only)
    notes = [72, 74, 76, 79, 76, 74, 72, 67, 69, 72, 74, 72]; bt = 0.28; k = 0
    while t0 + k * bt < t1: place(music, pluck(midi(notes[k % len(notes)] + 12), 0.3, 0.6), t0 + k * bt, 0.2 * g); place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.3 * g); k += 1
wind(0, D, 0.1)
breeze(0, LS(1) - 0.05, 1.0)
bed(LS(1), LS(3), 'march', 0.95, 118)
bed(LS(3), LS(4), 'quirky', 1.0, 126)
bed(LS(4), LS(5), 'tension', 1.1, 140)
bed(LS(5), LS(7), 'tension', 1.4, 158)
bed(LS(7), LS(8) - 0.18, 'quirky', 0.7, 100)
bed(LS(8), LS(9) - 0.18, 'dark', 0.5, 96)
bed(LS(9), LS(11), 'quirky', 0.85, 112)
breeze(LS(11), D, 1.2); bed(LS(11), D, 'march', 0.6, 124)
for fr in [48, 97, 165, 245, 295, 334, 400, 462, 520, 590, 630, 678, 730, 785, 848, 896, 998, 1062, 1126, 1252]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [790, 922, 1176]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 kite loops + tied to goat
whirl(0.0, 2.6, 0.35); gag(baa(), WS(0, 'goat'), 0.55); place(sfx, boing(160, 0.5), WS(0, 'tied'), 0.35)
# L1 the bet + catchphrase
gag(stamp(), WS(1, 'bet'), 0.4); gag(bark(), WS(1, 'for') + 0.25, 0.45); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 lunch
gag(chew(0.6, 6), WS(2, 'cheese'), 0.35); gag(ting(), WS(2, 'pickles'), 0.4)
# L3 ribbons + Pretzel
flutter(WS(3, 'nine'), 1.6, 0.3); gag(baa(), WS(3, 'pretzel'), 0.5); gag(chew(0.8, 6), WS(3, 'eat'), 0.35)
# L4 spin + dive into the pond
place(sfx, slide(True, 0.6), WS(4, 'up'), 0.35); whirl(WS(4, 'spun'), 1.6, 0.45); gag(boing(120, 0.6), WS(4, 'washing'), 0.4)
place(sfx, slide(False, 0.6), WS(4, 'dove'), 0.4); gag(splash(1.2), WS(4, 'pond'), 0.6); place(sfx, sub(0.5, 50), WS(4, 'pond'), 0.4)
for k in range(3): place(sfx, quack(), WS(4, 'pond') + 0.3 + k * 0.25, 0.4)
# L5 bigger sail
for k in range(3): place(sfx, thunk(300, 0.12, 0.2), WS(5, 'gave') + k * 0.2, 0.35)
gag(ting(), WS(5, 'bigger'), 0.35); gag(bark(), WS(5, 'for') + 0.25, 0.45)
# L6 lifted off his boots + wrapped
whirl(LS(6), 2.0, 0.55); gag(slide(True, 0.8), WS(6, 'lifted'), 0.45); gag(bonk(), WS(6, 'boots') + 0.1, 0.4)
for k in range(6): place(sfx, flip(), WS(6, 'wrapped') + k * 0.08, 0.3)
gag(thunk(80, 0.4), WS(6, 'pretzel'), 0.5); place(sfx, sub(0.5, 48), WS(6, 'pretzel'), 0.45); place(sfx, baa(), WS(6, 'pretzel') + 0.4, 0.4)
# L7 calm as a cloud
countup(WS(7, 'forty') - 0.2, WS(7, 'forty') + 0.6, 0.3); place(sfx, cuckoo(), WS(7, 'minutes'), 0.35); gag(snore(1.0), WS(7, 'cloud'), 0.3)
# L8 question
place(sfx, scratch(), LS(8) - 0.15, 0.3); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 explanation
place(sfx, drop(), WS(9, 'wind'), 0.5); wind(WS(9, 'wind'), 2.0, 0.3); gag(ting(), WS(9, 'nose'), 0.35)
# L10 arrow + spins
place(sfx, whoosh(0.5), WS(10, 'arrow') - 0.3, 0.45); gag(thunk(400, 0.1, 0.1), WS(10, 'arrow') + 0.2, 0.35); whirl(WS(10, 'gust'), 1.2, 0.4); gag(boing(140, 0.5), WS(10, 'spins'), 0.35)
# L11 pickles + tail eaten
gag(stamp(), WS(11, 'won'), 0.4); place(sfx, ting(), WS(11, 'pickles'), 0.3); gag(chew(1.0, 7), WS(11, 'ate'), 0.45); place(sfx, baa(), WS(11, 'tail') + 0.2, 0.4)
# L12 tied to the goat too
whirl(LS(12) - 0.4, 1.4, 0.4); for_ = None
for k in range(5): place(sfx, flip(), WS(12, 'tied') + k * 0.09, 0.3)
gag(baa(), WS(12, 'goat'), 0.5); button(WS(12, 'too') + 0.4, 'march', 0.9)
mixdown()
