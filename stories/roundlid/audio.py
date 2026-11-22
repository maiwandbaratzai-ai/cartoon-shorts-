# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def street(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 1200) * env(int(d * SR), 0.4, 0.4), t0, g)
def rollsnd(t0, d, g=0.3): n = int(d * SR); tt = np.arange(n) / SR; place(sfx, (lp_fast(noise(d), 300) * (0.7 + 0.3 * np.sin(2 * np.pi * 6 * tt))).astype(np.float32), t0, g)
def clank(t, g=0.5): place(sfx, bell(330), t, g * 0.5); place(sfx, thunk(120, 0.25, 0.6), t, g); place(sfx, sub(0.4, 48), t, g * 0.8)
bed(0, LS(4) - 0.2, 'quirky', 0.95, 126)
bed(LS(4) - 0.2, LS(5) - 0.1, 'tension', 0.9, 112)
bed(LS(5) - 0.1, LS(6) - 0.1, 'tension', 1.1, 126)
bed(LS(6) - 0.1, LS(7) - 0.2, 'tension', 1.35, 144)
bed(LS(8) - 0.1, LS(10) - 0.18, 'quirky', 0.8, 118)
bed(LS(10), D, 'march', 1.1, 128)
street(0, D)
# L0 rolling lid + dog
rollsnd(0, FR(104), 0.35); place(sfx, bark(), FR(14), 0.45); place(sfx, ting(), WS(0, 'coin'), 0.35); place(sfx, swish(), FR(52) - 0.1, 0.45); place(sfx, bark(), FR(70), 0.4)
# L1 holes
place(sfx, swish(), FR(107) - 0.1, 0.45); place(sfx, pop(), WS(1, 'holes'), 0.35); place(sfx, swish(), FR(165) - 0.1, 0.4); place(sfx, drip(), FR(190), 0.4); place(sfx, hum(1.2), FR(180), 0.2)
# L2 Bruno laughs
place(sfx, swish(), FR(229) - 0.1, 0.45); place(sfx, stamp(), WS(2, 'pizza'), 0.45); place(sfx, boing(), WS(2, 'shop'), 0.35); place(sfx, swish(), FR(282) - 0.1, 0.4); place(sfx, bark(), FR(295), 0.35)
# L3 cheaper, bought 300 (lids pop down the street)
place(sfx, swish(), FR(330) - 0.1, 0.45); place(sfx, ting(), WS(3, 'cheaper'), 0.35); place(sfx, swish(), FR(380) - 0.1, 0.45)
for k in range(12): place(sfx, stamp(), WS(3, 'bought') - 0.6 + k * 0.12, 0.18)
# L4 week one: lift, CLUNK
place(sfx, swish(), FR(431) - 0.1, 0.45); place(sfx, bell(660), WS(4, 'one'), 0.3); place(sfx, swish(), FR(480) - 0.1, 0.4); place(sfx, creak(0.5, 200), WS(4, 'lifted'), 0.35)
place(sfx, swish(), FR(520) - 0.1, 0.4); clank(WS(4, 'clunk'), 0.7); place(sfx, slide(False, 0.5), WS(4, 'fell'), 0.35)
# L5 week two
place(sfx, swish(), FR(548) - 0.1, 0.45); place(sfx, bell(740), WS(5, 'two'), 0.3)
for k in range(6): clank(WS(5, 'twelve') - 0.3 + k * 0.2, 0.25)
place(sfx, swish(), FR(597) - 0.1, 0.4); place(sfx, boing(240), WS(5, 'shrugged'), 0.3)
# L6 week three (hype): truck, flips, forty
place(sfx, swish(), FR(647) - 0.1, 0.45); place(sfx, bell(830), WS(6, 'three'), 0.3); place(sfx, engine(2.2, 44), FR(647), 0.4); place(sfx, horn(0.5), WS(6, 'trucks'), 0.3)
place(sfx, flip(), WS(6, 'flipped'), 0.5); place(sfx, swish(), FR(690) - 0.1, 0.4)
for k in range(8): clank(WS(6, 'forty') - 0.2 + k * 0.13, 0.3)
place(sfx, boom(1.0), WS(6, 'forty') + 0.4, 0.35)
# L7 [beat] holes + cones, honking
place(sfx, scratch(), LS(7) - 0.3, 0.3); place(sfx, horn(0.6), WS(7, 'holes'), 0.35); place(sfx, horn(0.4), WS(7, 'holes') + 0.7, 0.3); place(sfx, swish(), FR(770) - 0.1, 0.4); place(sfx, pop(), WS(7, 'cones'), 0.3)
# L8 cutaway: table through the door
place(sfx, whoosh(0.6), FR(813) - 0.15, 0.45); place(sfx, thunk(220, 0.15, 0.3), WS(8, 'narrow'), 0.4); place(sfx, swish(), FR(862) - 0.1, 0.4); place(sfx, creak(0.4, 260), WS(8, 'tilt'), 0.35); place(sfx, slide(True, 0.5), WS(8, 'slips'), 0.35)
# L9 x-ray diagonal
place(sfx, whoosh(0.6), FR(915) - 0.15, 0.45); place(sfx, ting(), WS(9, 'diagonal'), 0.4); place(sfx, ting(), WS(9, 'side'), 0.3); place(sfx, swish(), FR(975) - 0.1, 0.4); place(sfx, slide(False, 0.6), WS(9, 'drops') - 0.3, 0.4); clank(WS(9, 'drops') + 0.2, 0.5)
# L10 payoff: circle (hush 0.18 s before)
place(sfx, swish(), FR(1041) - 0.1, 0.4); place(sfx, sting(), WS(10, 'circle'), 0.45); place(sfx, sub(0.8, 38), WS(10, 'circle'), 0.5); place(sfx, ting(), WS(10, 'width'), 0.4)
place(sfx, swish(), FR(1100) - 0.1, 0.4); place(sfx, bell(520), WS(10, 'never'), 0.4); place(sfx, bark(), WS(10, 'never') + 0.4, 0.35)
# L11 beg
place(sfx, swish(), FR(1160) - 0.1, 0.45); place(sfx, slide(False, 0.5), WS(11, 'begged'), 0.3)
# L12 roll + pizza dog
place(sfx, swish(), FR(1222) - 0.1, 0.45); rollsnd(WS(12, 'rolled'), 2.3, 0.35); place(sfx, bark(), WS(12, 'dog'), 0.45); place(sfx, horn(0.25), WS(12, 'pizza'), 0.4); place(sfx, swish(), FR(1290) - 0.1, 0.4); place(sfx, bark(), FR(1300), 0.5); place(sfx, ting(), FR(1310), 0.3)
mixdown()
