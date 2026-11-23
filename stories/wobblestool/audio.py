# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def clacks(t0, d, rate=0.36, g=0.3):
    for k in range(int(d / rate)): place(sfx, thunk(260 + 30 * (k % 2), 0.08, 0.15), t0 + k * rate, g)
bed(0, LS(3) - 0.1, 'quirky', 0.95, 118)
bed(LS(3) - 0.1, LS(5), 'quirky', 1.05, 128)
bed(LS(5), LS(7), 'march', 1.1, 136)
bed(LS(7), LS(8), 'tension', 1.2, 142)
bed(LS(8), LS(9) - 0.1, 'tension', 1.4, 152)
bed(LS(10) - 0.2, LS(12) - 0.18, 'quirky', 0.85, 112)
bed(LS(12), D, 'march', 1.1, 126)
for fr in [50, 100, 251, 305, 354, 400, 452, 510, 570, 690, 739, 800, 860, 905, 965, 1020, 1130, 1180, 1234, 1450, 1520, 1610, 1670, 1731, 1820]: place(sfx, swish(), FR(fr) - 0.1, 0.36)
for fr in [149, 197, 622, 682, 1068, 1122, 1292, 1362, 1442]: place(sfx, whoosh(0.5), FR(fr), 0.42)
# L0 upgrade
place(sfx, sting(), WS(0, 'upgraded'), 0.3); for_w = ['four', 'cupholder', 'heated']
for k, w in enumerate(for_w): place(sfx, pop(), WS(0, w), 0.4); place(sfx, ting(), WS(0, w) + 0.05, 0.2)
place(sfx, hum(1.2), WS(0, 'heated'), 0.15); place(sfx, moo(), FR(120), 0.35)
# L1 truck
place(sfx, engine(2.0, 45), LS(1) - 0.2, 0.3); place(sfx, tick(), WS(1, 'six'), 0.4); place(sfx, horn(0.3), WS(1, 'left'), 0.25)
for k in range(6): place(sfx, tick(), FR(205) + k * 0.5, 0.3)
# L2 Gerald
place(sfx, creak(0.5, 300), WS(2, 'crack'), 0.3); place(sfx, bell(990), WS(2, 'gerald'), 0.35)
# L3 rocking clacks
place(sfx, bonk(), WS(3, 'sat'), 0.3); clacks(WS(3, 'rocked'), LS(4) - WS(3, 'rocked'), 0.36, 0.35)
for w in ['clack']: place(sfx, thunk(240, 0.12, 0.3), WS(3, w), 0.5)
# L4 Daisy seasick, bucket
place(sfx, moo(), WS(4, 'daisy'), 0.5); place(sfx, slide(False, 0.8), WS(4, 'seasick'), 0.35); place(sfx, gulp(), WS(4, 'seasick') + 0.5, 0.3)
place(sfx, crash(0.6), WS(4, 'knocked'), 0.35); place(sfx, splash(0.8), WS(4, 'tail'), 0.4); place(sfx, swish(), WS(4, 'tail') - 0.1, 0.3)
# L5 six legs + cafe
place(sfx, pop(), WS(5, 'six'), 0.4); clacks(WS(5, 'rocked'), 2.0, 0.2, 0.3); place(sfx, scrape(0.6), WS(5, 'cafe'), 0.35); place(sfx, splash(0.4), WS(5, 'cafe') + 0.4, 0.25)
# L6 centipede
place(sfx, boing(160, 0.7), WS(6, 'centipede'), 0.4); clacks(WS(6, 'wobbled'), 2.2, 0.15, 0.3); place(sfx, footsteps(2.0, 10, 700), WS(6, 'walked'), 0.35); place(sfx, meow(), WS(6, 'walked') + 0.6, 0.4); place(sfx, moo(), WS(6, 'barn'), 0.35)
# L7 cardboard, cheese
place(sfx, flip(), WS(7, 'cardboard'), 0.4); place(sfx, flip(), WS(7, 'two'), 0.4); place(sfx, scratch(), WS(7, 'ran'), 0.25); place(sfx, gloop(0.5), WS(7, 'cheese'), 0.4); place(sfx, bonk(), WS(7, 'cheese') + 0.4, 0.3)
# L8 5:58 honk, one cup
place(sfx, horn(0.9), WS(8, 'honked'), 0.6); place(sfx, horn(0.5), WS(8, 'honked') + 1.0, 0.45); place(sfx, sub(0.5, 50), WS(8, 'honked'), 0.4)
place(sfx, ting(), WS(8, 'one'), 0.4); place(sfx, bloop(240), WS(8, 'into'), 0.4); place(sfx, slide(False, 0.6), WS(8, 'cupholder'), 0.3)
# L9 re-hook
place(sfx, scratch(), LS(9) - 0.2, 0.3)
# L10 tripod
place(sfx, ting(), WS(10, 'three'), 0.35); place(sfx, stamp(), WS(10, 'touch'), 0.35); place(sfx, water(2.5), FR(1370), 0.25); place(sfx, gull(), FR(1395), 0.3)
# L11 fourth leg, clack
place(sfx, sting(), WS(11, 'air'), 0.4); place(sfx, thunk(240, 0.12, 0.3), WS(11, 'clack'), 0.6); place(sfx, sub(0.4, 50), WS(11, 'clack'), 0.4); clacks(WS(11, 'sit'), 1.2, 0.36, 0.3)
# L12 Grandma on Gerald
place(sfx, bell(1047), WS(12, 'wobble'), 0.35); place(sfx, water(1.4), FR(1640), 0.2); place(sfx, ting(), WS(12, 'full'), 0.4); place(sfx, moo(), WS(12, 'minutes'), 0.4)
# L13 coat rack
place(sfx, boing(200), WS(13, 'coat'), 0.35); clacks(WS(13, 'wobbles'), D - WS(13, 'wobbles') - 0.3, 0.36, 0.3); place(sfx, moo(), FR(1880), 0.3)
mixdown()
