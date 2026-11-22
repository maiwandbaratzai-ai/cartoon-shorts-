# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def sea(t0, d, g=0.25): place(sfx, lp_fast(noise(d), 600) * env(int(d * SR), 0.5, 0.6), t0, g)
def weld(t0, d, g=0.35): place(sfx, hp_fast(noise(d), 2500) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 60).astype(np.float32)) * env(int(d * SR), 0.01, 0.1), t0, g)
bed(0, LS(4) - 0.2, 'quirky', 0.95, 124)
bed(LS(4) - 0.2, LS(5) - 0.1, 'march', 0.9, 120)
bed(LS(5) - 0.1, LS(6) - 0.1, 'tension', 1.1, 126)
bed(LS(6) - 0.1, LS(7) - 0.2, 'tension', 1.35, 142)
bed(LS(8) - 0.1, LS(10) - 0.18, 'quirky', 0.8, 116)
bed(LS(10), D, 'march', 1.1, 128)
sea(0, D, 0.16)
# L0 welding
weld(0.0, FR(98)); place(sfx, thunk(200, 0.1, 0.3), WS(0, 'welded'), 0.4); place(sfx, ting(), WS(0, 'ball'), 0.4); place(sfx, swish(), FR(48) - 0.1, 0.45); place(sfx, horn(0.9), FR(70), 0.25); place(sfx, meow(), FR(85), 0.35)
# L1 crane + board
place(sfx, swish(), FR(101) - 0.1, 0.45); place(sfx, creak(1.0, 160), FR(105), 0.35); place(sfx, thunk(90, 0.3), FR(158), 0.5); place(sfx, sub(0.3, 55), FR(158), 0.4); place(sfx, pop(), WS(1, 'crates'), 0.35)
place(sfx, swish(), FR(160) - 0.1, 0.45); 
countup(WS(1, 'paid'), WS(1, 'double')); place(sfx, ting(), WS(1, 'double'), 0.45)
# L2 laugh
place(sfx, swish(), FR(229) - 0.1, 0.45); place(sfx, stamp(), WS(2, 'clown'), 0.45); place(sfx, horn(0.25), WS(2, 'nose'), 0.4); place(sfx, swish(), FR(280) - 0.1, 0.4); place(sfx, meow(), FR(300), 0.35)
# L3 out of harbor
place(sfx, swish(), FR(326) - 0.1, 0.45); place(sfx, horn(1.0), WS(3, 'harbor'), 0.35); place(sfx, engine(D - LS(3), 36), LS(3), 0.18); place(sfx, whoosh(0.8), WS(3, 'shot'), 0.5)
# L4 legs
place(sfx, whoosh(0.5), FR(389) - 0.15, 0.4); place(sfx, ting(), WS(4, 'legs'), 0.35); place(sfx, bell(660), WS(4, 'one'), 0.3); place(sfx, swish(), FR(436) - 0.1, 0.4); place(sfx, pop(), WS(4, 'mile'), 0.3)
# L5 leg two, wave
place(sfx, swish(), FR(481) - 0.1, 0.45); place(sfx, bell(740), WS(5, 'two'), 0.3); place(sfx, splash(1.5), WS(5, 'huge'), 0.5); place(sfx, swish(), FR(530) - 0.1, 0.4); place(sfx, water(2.0), FR(530), 0.35); place(sfx, sub(0.5, 50), WS(5, 'huge'), 0.4)
# L6 leg three (hype): throttle, needle, wave grows
place(sfx, swish(), FR(584) - 0.1, 0.45); place(sfx, bell(830), WS(6, 'three'), 0.3); place(sfx, thunk(160, 0.15, 0.3), WS(6, 'pushed'), 0.45); place(sfx, rumble(1.2), WS(6, 'pushed'), 0.4)
place(sfx, swish(), FR(625) - 0.1, 0.45); place(sfx, slide(False, 0.7), WS(6, 'needle'), 0.45); place(sfx, swish(), FR(660) - 0.1, 0.4); place(sfx, splash(1.4), WS(6, 'grew'), 0.55); place(sfx, sub(0.6, 42), WS(6, 'grew'), 0.5)
# L7 engines cough, drift
place(sfx, scratch(), LS(7) - 0.3, 0.3)
for k in range(3): place(sfx, thunk(70, 0.18, 0.6), WS(7, 'coughed') + k * 0.25, 0.55); place(sfx, sub(0.2, 45), WS(7, 'coughed') + k * 0.25, 0.4)
place(sfx, swish(), FR(740) - 0.1, 0.4); place(sfx, slide(False, 1.0), WS(7, 'drifted'), 0.35)
# L8 beach cutaway
place(sfx, whoosh(0.6), FR(779) - 0.15, 0.45); place(sfx, water(3.0), FR(781), 0.4); place(sfx, swish(), FR(830) - 0.1, 0.4); place(sfx, splash(0.6), WS(8, 'pushing'), 0.35)
# L9 x-ray
place(sfx, whoosh(0.6), FR(887) - 0.15, 0.45); place(sfx, bloop(220), WS(9, 'own'), 0.35); place(sfx, swish(), FR(940) - 0.1, 0.4); place(sfx, slide(False, 0.5), WS(9, 'dip'), 0.4); place(sfx, slide(True, 0.5), WS(9, 'hump'), 0.4)
# L10 payoff: hump meets dip -> flat
place(sfx, swish(), FR(998) - 0.1, 0.4); place(sfx, sting(), WS(10, 'meets'), 0.45); place(sfx, boom(1.3), WS(10, 'flat'), 0.45); place(sfx, sub(0.8, 36), WS(10, 'flat'), 0.6); place(sfx, ting(), WS(10, 'fifteen'), 0.4)
place(sfx, swish(), FR(1050) - 0.1, 0.4); place(sfx, horn(0.8), FR(1080), 0.3)
# L11 tow
place(sfx, swish(), FR(1126) - 0.1, 0.45); place(sfx, slide(False, 0.5), WS(11, 'tow'), 0.3); place(sfx, swish(), FR(1170) - 0.1, 0.4); place(sfx, meow(), FR(1190), 0.35)
# L12 rope + clown nose
place(sfx, swish(), FR(1212) - 0.1, 0.45); place(sfx, whoosh(0.7), WS(12, 'rope'), 0.45); place(sfx, splash(0.4), WS(12, 'rope') + 0.55, 0.3); place(sfx, swish(), FR(1262) - 0.1, 0.4)
place(sfx, horn(0.2), WS(12, 'nose'), 0.5); place(sfx, horn(0.2), WS(12, 'nose') + 0.25, 0.45); place(sfx, swish(), FR(1305) - 0.1, 0.4); place(sfx, meow(), FR(1312), 0.55); place(sfx, boing(), FR(1325), 0.3)
mixdown()
