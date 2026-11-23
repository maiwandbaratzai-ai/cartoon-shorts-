# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def wind(t0, d, g=0.3, cut=900): place(sfx, lp_fast(noise(d), cut) * env(int(d * SR), 0.4, 0.5), t0, g)
# music: jaunty -> takeoff march -> tension rising through the cracks -> hush -> quirky explainer -> march finale
bed(0, LS(4) - 0.1, 'quirky', 0.95, 122)
bed(LS(4) - 0.1, LS(5), 'march', 1.0, 128)
bed(LS(5), LS(6), 'tension', 0.9, 118)
bed(LS(6), LS(8) - 0.1, 'tension', 1.25, 138)
bed(LS(8) - 0.1, WS(8, 'popped') - 0.2, 'tension', 1.4, 150)
bed(WS(8, 'popped'), LS(9) - 0.1, 'quirky', 1.1, 140)
bed(LS(9) + 0.1, LS(11) - 0.18, 'quirky', 0.8, 112)
bed(LS(11), D, 'march', 1.1, 128)
for fr in [58, 118, 160, 196, 245, 293, 335, 376, 420, 455, 502, 540, 570, 612, 654, 705, 757, 810, 850, 930, 982, 1035, 1140, 1240]: place(sfx, swish(), FR(fr) - 0.1, 0.4)
for fr in [874, 1083, 1178]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 curtains
place(sfx, ting(), WS(0, 'glitz'), 0.3); place(sfx, pop(), WS(0, 'forty'), 0.3)
for k in range(8): place(sfx, swish(0.12), WS(0, 'curtains') + k * 0.06, 0.22)
place(sfx, boing(260), WS(0, 'curtains') + 0.5, 0.3)
# L1 face on the tail
place(sfx, flip(), WS(1, 'test'), 0.35); place(sfx, bell(1320), WS(1, 'face'), 0.3); place(sfx, sting(), WS(1, 'tail'), 0.3)
# L2 donut ignored
place(sfx, bloop(330), WS(2, 'donut'), 0.4); place(sfx, slide(False, 0.5), WS(2, 'ignored'), 0.35); place(sfx, bonk(), WS(2, 'donut', ) + 2.3, 0.2)
# L3 awards
countup(WS(3, 'eleven') - 0.2, WS(3, 'eleven') + 0.6); place(sfx, ting(), WS(3, 'best'), 0.4); place(sfx, boing(300), WS(3, 'hair'), 0.35)
# L4 takeoff, Doug, chickens
place(sfx, engine(3.0, 46), LS(4) - 0.1, 0.45); place(sfx, sub(1.0, 40), LS(4) + 0.5, 0.5)
place(sfx, stamp(), WS(4, 'doug'), 0.3)
for k in range(5): place(sfx, squeak(), WS(4, 'three') + k * 0.22, 0.3)
place(sfx, snap(), WS(4, 'belts'), 0.35)
# flight
wind(LS(5), FR(882) - LS(5), 0.18, 700); wind(FR(1140), D - FR(1140) - 2.0, 0.1, 600)
place(sfx, creak(0.5, 260), WS(5, 'crack'), 0.45); place(sfx, snap(), WS(5, 'corner'), 0.4)
# L6 cracks everywhere
for k in range(9): place(sfx, snap(), WS(6, 'every') + 0.1 + k * 0.13, 0.35)
place(sfx, creak(1.2, 110), WS(6, 'cracked'), 0.5); place(sfx, sub(0.8, 38), WS(6, 'cracked'), 0.5); place(sfx, boing(150), WS(6, 'toddler'), 0.3)
# L7 duct tape
for k in range(6): place(sfx, scrape(0.25), WS(7, 'fix') + 0.2 + k * 0.3, 0.3)
place(sfx, flip(), WS(7, 'signature'), 0.35)
# L8 toast pop + chickens leave
place(sfx, scratch(), LS(8) - 0.25, 0.25); place(sfx, boing(220, 0.5), WS(8, 'popped'), 0.6); place(sfx, thunk(80, 0.35), WS(8, 'popped'), 0.5); place(sfx, sub(0.6, 42), WS(8, 'popped'), 0.6)
place(sfx, ting(), WS(8, 'toast'), 0.4); place(sfx, whoosh(0.8), WS(8, 'popped') + 0.2, 0.5)
for k in range(12): place(sfx, squeak(), WS(8, 'twelve') + k * 0.12, 0.25)
place(sfx, slide(False, 0.8), WS(8, 'left'), 0.35); place(sfx, gulp(), FR(858), 0.35)
# L9-L11 x-ray
place(sfx, hum(2.8), LS(9), 0.25); place(sfx, bloop(200), WS(9, 'pushes'), 0.35); place(sfx, slide(True, 0.5), WS(9, 'window'), 0.3)
place(sfx, sting(), WS(10, 'traps'), 0.4); place(sfx, sub(0.5, 50), WS(10, 'point'), 0.4)
for k in range(5): place(sfx, squeak(), WS(10, 'crowd') + k * 0.1, 0.3)
place(sfx, bonk(), WS(10, 'doorway'), 0.4)
place(sfx, bell(1047), WS(11, 'round'), 0.35); place(sfx, slide(True, 0.7), WS(11, 'push') if False else WS(11, 'cracks'), 0.25); place(sfx, ting(), WS(11, 'nowhere'), 0.4)
# L12 donut tail + window seat
place(sfx, stamp(), WS(12, 'pia'), 0.45); place(sfx, bell(1320), WS(12, 'tail'), 0.3)
place(sfx, squeak(), WS(12, 'seat') + 0.2, 0.35); place(sfx, squeak(), WS(12, 'seat') + 0.6, 0.3); place(sfx, engine(2.2, 40), FR(1240), 0.15)
mixdown()
