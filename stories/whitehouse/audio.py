# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def sizzle(t0, d, g=0.25): place(sfx, hp_fast(noise(d), 4000) * env(int(d * SR), 0.1, 0.3) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 40)).astype(np.float32), t0, g)
def waves(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 500) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 1.3)).astype(np.float32), t0, g)
waves(0, D, 0.1)
bed(0, LS(4), 'quirky', 0.95, 120)
bed(LS(4), LS(7), 'tension', 1.2, 140)
bed(LS(7), LS(8), 'sad', 0.7, 84)
bed(LS(8), LS(9) - 0.18, 'dark', 0.6, 96)
bed(LS(9), LS(11), 'quirky', 0.85, 112)
bed(LS(11), D, 'march', 1.1, 126)
for fr in [55, 100, 160, 229, 290, 351, 395, 450, 500, 556, 598, 649, 737, 790, 844, 950, 1016, 1080, 1139, 1219, 1280]: place(sfx, swish(), FR(fr) - 0.1, 0.35)
for fr in [872, 1008]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 paint + cat moving out with a suitcase
for k in range(4): place(sfx, scrape(0.25), 0.1 + k * 0.4, 0.2)
gag(meow(), WS(0, 'cat'), 0.6); place(sfx, footsteps(2.0, 5, 1400), WS(0, 'cat'), 0.2); place(sfx, creak(0.5, 300), WS(0, 'next') + 0.3, 0.3)
# L1 white house, why
place(sfx, ting(), WS(1, 'white'), 0.35); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 black is back, selfies
gag(sting(), LS(2), 0.35)
for k in range(10): place(sfx, flip(), WS(2, '400') + k * 0.11, 0.25)
countup(WS(2, '400'), WS(2, '400') + 1.0, 0.4)
# L3 zero + pigeon, sugar cube
gag(bonk(300), WS(3, 'zero'), 0.35); place(sfx, tweet(), WS(3, 'zero') + 0.3, 0.3); gag(boing(240, 0.5), WS(3, 'sugar'), 0.4)
# L4 heat wave, oven mitts
place(sfx, hum(2.0), WS(4, 'heat'), 0.3); place(sfx, sub(0.6, 45), WS(4, 'heat'), 0.4); place(sfx, bell(660), WS(4, 'day'), 0.3); gag(sizzle and bonk(380), WS(4, 'oven'), 0.35); sizzle(WS(4, 'oven') - 0.2, 0.8, 0.3)
# L5 egg
place(sfx, bell(660), WS(5, 'day'), 0.3); gag(splat(), WS(5, 'egg') - 0.1, 0.4); sizzle(WS(5, 'egg'), 2.0, 0.35); gag(boing(150, 0.4), WS(5, 'nobody'), 0.3)
# L6 sprinkler + teapot
place(sfx, bell(660), WS(6, 'day'), 0.3); place(sfx, water(2.4), WS(6, 'sprinkler'), 0.3); sizzle(WS(6, 'sprinkler') + 0.3, 2.0, 0.45)
tp = WS(6, 'teapot'); n = int(1.2 * SR); t = np.arange(n) / SR; place(sfx, (np.sin(2 * np.pi * (1800 + 300 * t) * t) * np.minimum(1, t / 0.3) * 0.5).astype(np.float32), tp, 0.35)
# L7 Mango napping
place(sfx, snore(1.1), WS(7, 'napped'), 0.4); gag(meow(), WS(7, 'cucumber') + 0.2, 0.4)
# L8 question -> riser
place(sfx, scratch(), LS(8) - 0.15, 0.3); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 explainer
place(sfx, drop(), WS(9, 'white'), 0.55)
for k in range(4): place(sfx, ting(), WS(9, 'bounces') + k * 0.1, 0.3)
gag(gloop(0.8), WS(9, 'soaks'), 0.45); sizzle(WS(9, 'soaks') + 0.3, 1.2, 0.25)
# L10 heat inside, 40
place(sfx, hum(1.8), LS(10), 0.25); gag(stamp(), WS(10, '40'), 0.45); countup(WS(10, '40') - 0.6, WS(10, '40'), 0.35)
# L11 kiddie pool
gag(splash(0.8), WS(11, 'kiddie') - 0.2, 0.4); place(sfx, bloop(300), WS(11, 'kiddie') + 0.5, 0.3)
# L12 painted white, Mango back
for k in range(3): place(sfx, scrape(0.25), WS(12, 'painted') + k * 0.25, 0.25)
gag(meow(), WS(12, 'mango'), 0.6); button(WS(12, 'mango') + 0.3, 'march', 0.9)
mixdown()
