# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def waves(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 450) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 1.1)).astype(np.float32), t0, g)
def coo(t, g=0.4):
    n = int(0.5 * SR); t_ = np.arange(n) / SR; c = np.sin(2 * np.pi * (420 + 60 * np.sin(2 * np.pi * 9 * t_)) * t_) * np.sin(np.pi * t_ / 0.5) ** 2 * 0.5; place(sfx, lp_fast(c.astype(np.float32), 1200), t, g)
waves(0, D, 0.1); place(sfx, gull(), 3.0, 0.2); place(sfx, gull(), 30.0, 0.2)
bed(0, LS(3), 'quirky', 0.95, 120)
bed(LS(3), LS(5), 'march', 0.95, 116)
bed(LS(5), LS(8), 'quirky', 1.05, 130)
bed(LS(8), LS(10) - 0.2, 'tension', 1.25, 148)
bed(LS(10), LS(11) - 0.18, 'dark', 0.6, 96)
bed(LS(11), LS(13), 'quirky', 0.85, 112)
bed(LS(13), D, 'march', 1.1, 126)
for fr in [70, 138, 200, 345, 395, 505, 563, 625, 685, 745, 795, 850, 903, 979, 1035, 1092, 1160, 1228, 1409, 1455, 1500, 1580, 1653, 1715, 1778, 1850]: place(sfx, swish(), FR(fr) - 0.1, 0.35)
for fr in [289, 435, 1271, 1337]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 paint roller + lost pigeon
for k in range(3): place(sfx, scrape(0.35), 0.2 + k * 0.5, 0.2)
coo(WS(0, 'pigeon'), 0.5); gag(boing(200, 0.5), WS(0, 'lost'), 0.4)
# L1 motto
gag(sting(), WS(1, 'less'), 0.35); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 the five patterns
for i, w in enumerate(['stripes', 'spiral', 'checkers', 'polka']): place(sfx, pop(), WS(2, w), 0.3)
gag(boing(160, 0.6), WS(2, 'mustache'), 0.45)
# L3 tacky -> white
gag(bonk(380), WS(3, 'tacky'), 0.3); gag(sting(), WS(3, 'less'), 0.3)
for k in range(5): place(sfx, scrape(0.2), WS(3, 'tuesday') - 0.6 + k * 0.15, 0.25)
# L4 Pip cut off
place(sfx, ting(), WS(4, 'raised'), 0.3); gag(scratch(), WS(4, 'less'), 0.35)
# L5 cheese boat
place(sfx, horn(0.8), LS(5), 0.35); place(sfx, engine(3.0, 50), LS(5), 0.2); gag(stomp(0.9), WS(5, 'tons'), 0.4)
# L6 lamps off, wrong
place(sfx, flip(), WS(6, 'lamps'), 0.3); place(sfx, tick(), WS(6, 'picked'), 0.3); gag(bonk(), WS(6, 'wrong'), 0.45); place(sfx, sub(0.4, 50), WS(6, 'wrong'), 0.35)
# L7 cheese for a keeper who hates cheese
for k in range(6): place(sfx, thunk(160, 0.15), WS(7, 'unloaded') + k * 0.18, 0.35)
gag(slide(False, 0.6), WS(7, 'hates'), 0.4)
# L8 everybody lost
place(sfx, horn(0.5), WS(8, 'mail'), 0.3); place(sfx, bell(1320), WS(8, 'ice'), 0.3); place(sfx, bell(1100), WS(8, 'ice') + 0.2, 0.25); gag(horn(1.0), WS(8, 'reginald'), 0.35)
# L9 Gary eleven times
for k in range(4): place(sfx, flip(), LS(9) + k * 1.0, 0.25); coo(LS(9) + 0.5 + k * 1.0, 0.3)
countup(WS(9, 'eleven') - 0.6, WS(9, 'eleven'), 0.35); gag(coo, WS(9, 'nest'), 0.0) if False else coo(WS(9, 'nest'), 0.45)
# L10 question -> riser
place(sfx, scratch(), LS(10) - 0.15, 0.3); place(sfx, riser(1.2), LS(11) - 1.25, 0.4)
# L11 night blink / day paint
place(sfx, drop(), WS(11, 'night'), 0.5)
for k in range(8): place(sfx, ting(), WS(11, 'blinks') + k * 0.2, 0.2)
gag(pop(), WS(11, 'paint'), 0.4)
# L12 name tags
for w in ['one', 'two', 'three', 'four']: place(sfx, bell(880 + 110 * ['one', 'two', 'three', 'four'].index(w)), WS(12, w), 0.3)
gag(stamp(), WS(12, 'name'), 0.4)
# L13 repaint + tug
for k in range(5): place(sfx, scrape(0.2), WS(13, 'repainted') + k * 0.15, 0.25)
place(sfx, horn(0.6), WS(13, 'tugboat'), 0.35); gag(boing(140, 0.5), WS(13, 'towed'), 0.4)
# L14 Gary home
for k in range(6): place(sfx, flip(), WS(14, 'flew') + k * 0.12, 0.25)
coo(WS(14, 'mustache'), 0.55); button(WS(14, 'mustache') + 0.4, 'march', 0.9)
mixdown()
