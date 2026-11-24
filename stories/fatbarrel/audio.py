# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def waves(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 450) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 1.1)).astype(np.float32), t0, g)
def shanty(t0, t1, g=0.5):   # a jaunty sea-shanty hum (instruments only — no voices)
    notes = [62, 66, 69, 66, 64, 62, 64, 66, 62, 59, 62, 66]; bt = 0.32; k = 0
    while t0 + k * bt < t1: place(music, marimba(midi(notes[k % len(notes)] + 12)), t0 + k * bt, 0.18 * g); place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.3 * g); k += 1
def rollsnd(t0, d, g=0.3): place(sfx, lp_fast(noise(d), 300) * (0.7 + 0.3 * np.sin(np.arange(int(d * SR)) / SR * 30)).astype(np.float32) * env(int(d * SR), 0.1, 0.2), t0, g)
waves(0, D, 0.1); place(sfx, gull(), 1.0, 0.25); place(sfx, gull(), 18.0, 0.2)
shanty(0, LS(1) - 0.1, 1.0)
bed(LS(1), LS(3), 'march', 0.95, 118)
bed(LS(3), LS(5), 'quirky', 1.0, 128)
bed(LS(5), LS(7) - 0.2, 'tension', 1.3, 150)
bed(LS(7), LS(8) - 0.18, 'dark', 0.6, 96)
bed(LS(8), LS(10), 'quirky', 0.85, 114)
bed(LS(10), LS(11), 'march', 1.0, 124)
shanty(LS(11), D, 1.2); bed(LS(11), D, 'quirky', 0.6, 128)
for fr in [55, 114, 170, 243, 310, 382, 440, 515, 560, 597, 640, 680, 709, 783, 900, 981, 1040, 1150, 1195, 1270]: place(sfx, swish(), FR(fr) - 0.1, 0.35)
for fr in [810, 1089]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 four sailors carry a cube
place(sfx, footsteps(3.4, 3, 400), 0.1, 0.3); gag(stomp(0.8), WS(0, 'four'), 0.35); gag(bell(1320), WS(0, 'song'), 0.3)
# L1 progress + stack
gag(stamp(), WS(1, 'progress'), 0.4)
for k in range(3): place(sfx, thunk(150, 0.2), WS(1, 'stack') + k * 0.15, 0.35)
place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 300 a day, shove + out of songs
countup(WS(2, '300') - 0.4, WS(2, '300') + 0.4, 0.35); place(sfx, scrape(2.4), LS(2) + 0.3, 0.35); gag(slide(False, 0.8), WS(2, 'songs'), 0.4)
# L3 Coconut
gag(monkey(), WS(3, 'coconut'), 0.55); place(sfx, ting(), WS(3, 'bananas'), 0.35); gag(bonk(), WS(3, 'bottom'), 0.4); place(sfx, monkey(), WS(3, 'bottom') + 0.5, 0.3)
# L4 tubes
gag(stamp(), WS(4, 'progress'), 0.4); place(sfx, ting(), WS(4, 'tubes'), 0.35)
# L5 rolls straight into the sea
rollsnd(WS(5, 'rolls'), 3.0, 0.45); place(sfx, boing(300, 0.3), WS(5, 'straight'), 0.25); place(sfx, slide(False, 0.6), WS(5, 'sea') - 0.3, 0.35); gag(splash(1.2), WS(5, 'sea'), 0.6); place(sfx, sub(0.5, 50), WS(5, 'sea'), 0.4)
# L6 forty bob away, surfing monkey
for k in range(6): place(sfx, bloop(220 + k * 30), LS(6) + k * 0.25, 0.3)
gag(monkey(), WS(6, 'surfing'), 0.5); place(sfx, water(2.0), LS(6), 0.25)
# L7 question
place(sfx, scratch(), LS(7) - 0.15, 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 belly + spin like a top
place(sfx, drop(), WS(8, 'fat'), 0.5); rollsnd(LS(8), 2.0, 0.35); gag(ting(), WS(8, 'belly'), 0.4)
n = int(1.4 * SR); t = np.arange(n) / SR; place(sfx, (np.sin(2 * np.pi * 900 * t + 3 * np.sin(2 * np.pi * 14 * t)) * np.exp(-t * 1.2) * 0.3).astype(np.float32), WS(8, 'spin'), 0.4)
# L9 arch + hoops
place(sfx, ting(), WS(9, 'arch'), 0.35); gag(clink(3), WS(9, 'iron'), 0.45); place(sfx, creak(0.6, 160), WS(9, 'squeeze'), 0.4); gag(stamp(), WS(9, 'burst'), 0.4)
# L10 fat barrels back
rollsnd(LS(10), 2.5, 0.4); place(sfx, stamp(), WS(10, 'per'), 0.35)
# L11 band + drums
for k in range(10): place(sfx, drum('kick' if k % 2 == 0 else 'snare'), WS(11, 'drums') + k * 0.22, 0.45)
gag(monkey(), WS(11, 'drums') - 0.3, 0.45); button(WS(11, 'banana') + 0.4, 'march', 0.9)
mixdown()
