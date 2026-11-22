# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def wind(t0, d, g=0.3, cut=900): place(sfx, lp_fast(noise(d), cut) * env(int(d * SR), 0.4, 0.5), t0, g)
def rainsnd(t0, d, g=0.2): place(sfx, hp_fast(noise(d), 1500) * env(int(d * SR), 0.5, 0.5), t0, g)
bed(0, LS(4) - 0.2, 'quirky', 0.95, 124)
bed(LS(4) - 0.2, LS(5) - 0.1, 'tension', 0.9, 112)
bed(LS(5) - 0.1, LS(6) - 0.1, 'tension', 1.1, 126)
bed(LS(6) - 0.1, LS(7) - 0.2, 'tension', 1.35, 144)
bed(LS(8) - 0.1, LS(10) - 0.18, 'quirky', 0.8, 116)
bed(LS(10), D, 'march', 1.1, 128)
wind(0, LS(4), 0.12)
# L0 the ball comes down
place(sfx, creak(1.2, 120), 0.2, 0.35); place(sfx, hum(2.5), 0.3, 0.25); place(sfx, monkey(), FR(30), 0.4); place(sfx, swish(), FR(55) - 0.1, 0.45)
place(sfx, thunk(60, 0.5), FR(88), 0.7); place(sfx, sub(1.0, 34), FR(88), 0.8); place(sfx, stomp(1.2), FR(88), 0.5); place(sfx, ting(), WS(0, '600'), 0.35)
# L1 wind
place(sfx, swish(), FR(112) - 0.1, 0.45); wind(LS(1), 3.5, 0.45, 1500); place(sfx, swish(), FR(170) - 0.1, 0.4); place(sfx, pop(), WS(1, '150'), 0.35)
# L2 laugh
place(sfx, swish(), FR(227) - 0.1, 0.45); place(sfx, stamp(), WS(2, 'ornament'), 0.45); place(sfx, bell(1320), WS(2, 'christmas'), 0.25); place(sfx, swish(), FR(280) - 0.1, 0.4); place(sfx, monkey(), FR(295), 0.45)
# L3 pool + rent
place(sfx, swish(), FR(331) - 0.1, 0.45); place(sfx, splash(0.8), WS(3, 'pool'), 0.35); place(sfx, swish(), FR(380) - 0.1, 0.4); countup(WS(3, 'tenants'), WS(3, 'triple')); place(sfx, ting(), WS(3, 'triple'), 0.4)
# storms
rainsnd(LS(4) - 0.3, FR(1229) - LS(4), 0.16); wind(LS(4), FR(1229) - LS(4), 0.22, 1200)
place(sfx, swish(), FR(429) - 0.1, 0.45); place(sfx, sub(0.6, 45), WS(4, 'storms'), 0.4); place(sfx, creak(0.6, 160), WS(4, 'swayed'), 0.3); place(sfx, swish(), FR(490) - 0.1, 0.4); place(sfx, gulp(), WS(4, 'nobody'), 0.3)
place(sfx, swish(), FR(551) - 0.1, 0.45); place(sfx, splash(1.0), WS(5, 'sloshed'), 0.45); place(sfx, swish(), FR(600) - 0.1, 0.4); place(sfx, scrape(0.7), WS(5, 'coffee'), 0.4); place(sfx, swish(), FR(640) - 0.1, 0.4); place(sfx, boing(240), WS(5, 'grinned'), 0.3)
place(sfx, swish(), FR(680) - 0.1, 0.45); place(sfx, creak(1.0, 90), WS(6, 'swung'), 0.6); place(sfx, sub(0.8, 38), WS(6, 'swung'), 0.6); place(sfx, boom(1.0), WS(6, 'swung') + 0.2, 0.3)
place(sfx, swish(), FR(730) - 0.1, 0.45); place(sfx, splash(1.4), WS(6, 'waved'), 0.6); place(sfx, thunk(70, 0.4), WS(6, 'waved'), 0.4)
place(sfx, scratch(), LS(7) - 0.3, 0.3); place(sfx, slide(False, 0.8), WS(7, 'seasick'), 0.4); place(sfx, footsteps(1.5), WS(7, 'walked'), 0.35)
# L8 swing cutaway
place(sfx, whoosh(0.6), FR(847) - 0.15, 0.45); place(sfx, creak(0.5, 300), FR(850), 0.25); place(sfx, creak(0.5, 300), FR(870), 0.25); place(sfx, monkey(), FR(865), 0.4)
place(sfx, swish(), FR(890) - 0.1, 0.4); place(sfx, bonk(), WS(8, 'stops'), 0.5); place(sfx, sub(0.4, 50), WS(8, 'stops'), 0.4); place(sfx, monkey(), WS(8, 'dead') + 0.2, 0.4)
# L9 x-ray arrows
place(sfx, whoosh(0.6), FR(930) - 0.15, 0.45); place(sfx, bloop(200), WS(9, 'does'), 0.3); place(sfx, slide(True, 0.5), WS(9, 'sways'), 0.35); place(sfx, swish(), FR(990) - 0.1, 0.4); place(sfx, slide(False, 0.5), WS(9, 'other'), 0.35)
# L10 payoff (0.18 s hush before)
place(sfx, swish(), FR(1046) - 0.1, 0.4); place(sfx, sting(), WS(10, 'pulls'), 0.45); place(sfx, sub(0.8, 36), WS(10, 'pulls'), 0.5); place(sfx, gulp(), WS(10, 'barely'), 0.35); place(sfx, swish(), FR(1100) - 0.1, 0.4); place(sfx, ting(), WS(10, 'spilled'), 0.4)
# L11 beg
place(sfx, swish(), FR(1164) - 0.1, 0.45); place(sfx, slide(False, 0.5), WS(11, 'begged'), 0.3)
# L12 tinsel + monkey
place(sfx, swish(), FR(1229) - 0.1, 0.45); place(sfx, boing(200), WS(12, 'shrugged'), 0.3); place(sfx, swish(), FR(1285) - 0.1, 0.4); place(sfx, monkey(), WS(12, 'monkey'), 0.5)
for k in range(4): place(sfx, bell(1320 + k * 220), WS(12, 'tinsel') + k * 0.12, 0.25)
place(sfx, monkey(), FR(1320), 0.45)
mixdown()
