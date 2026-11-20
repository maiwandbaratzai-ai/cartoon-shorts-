# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def paws(t0, t1, rate=6, g=0.25):
    t = t0
    while t < t1: place(sfx, lp_fast(noise(0.04) * env(int(0.04 * SR), 0.002, 0.03), 900), t, g); t += 1 / rate
def sniffs(t0, n, g=0.35):
    for k in range(n): place(sfx, hp_fast(noise(0.09) * env(int(0.09 * SR), 0.01, 0.06), 1500), t0 + k * 0.16, g)
bed(0, LS(3) - 0.1, 'quirky', 0.9, 120)
bed(LS(3) - 0.1, LS(6) - 0.1, 'tension', 1.0, 128)
bed(LS(6) - 0.1, LS(9) - 0.2, 'tension', 1.1, 140)
bed(LS(9) - 0.1, LS(11) - 0.2, 'quirky', 1.0, 128)
bed(LS(11), D, 'march', 1.05, 120)
paws(0, LS(2)); place(sfx, footsteps(LS(2), 2.5, 600), 0, 0.3); sniffs(0.3, 5); place(sfx, bark(), 1.3, 0.5); place(sfx, swish(), WS(0, 'pickles') - 0.2, 0.4)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, swish(), WS(1, 'drags') - 0.15, 0.4); place(sfx, boing(200), WS(1, 'drags'), 0.3); place(sfx, swish(), WS(1, 'sniffing') - 0.2, 0.4); sniffs(WS(1, 'sniffing'), 6, 0.45); place(sfx, leaves(1.0), WS(1, 'hedge'), 0.35)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, hum(1.4), LS(2), 0.3); place(sfx, swish(), WS(2, 'newspaper') - 0.15, 0.4); place(sfx, flip(), WS(2, 'newspaper') + 0.1, 0.35)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, hp_fast(noise(0.5) * env(int(0.5 * SR), 0.01, 0.3), 1200), WS(3, 'rips'), 0.5)
place(sfx, swish(), WS(3, 'gold') - 0.15, 0.4); place(sfx, ting(), WS(3, 'gold'), 0.55); place(sfx, bell(1760), WS(3, 'gold') + 0.05, 0.3); place(sfx, sub(0.6, 46), WS(3, 'gold'), 0.5)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, thunk(60, 0.4), WS(4, 'trophy'), 0.6); place(sfx, sub(0.7, 40), WS(4, 'trophy'), 0.6); place(sfx, swish(), WS(4, 'stolen') - 0.15, 0.4); place(sfx, flip(), WS(4, 'stolen'), 0.4)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, stamp(), WS(5, 'four'), 0.4); place(sfx, swish(), WS(5, 'four') + 20 / 30 - 0.15, 0.4); place(sfx, slide(False, 0.7), WS(5, 'nothing'), 0.35)
place(sfx, swish(), LS(6) - 0.2, 0.5); place(sfx, footsteps(1.6, 7, 800), LS(6), 0.4); paws(LS(6), LS(6) + 1.6, 10, 0.25); place(sfx, swish(), WS(6, 'police') - 0.15, 0.45); place(sfx, bell(990), WS(6, 'police'), 0.3)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, scratch(), WS(7, 'cheer'), 0.3); place(sfx, swish(), WS(7, 'question') - 0.15, 0.4); place(sfx, thunk(70, 0.4), WS(7, 'question'), 0.6); place(sfx, sub(0.5, 44), WS(7, 'question'), 0.5); place(sfx, cuckoo(), WS(7, 'hours'), 0.3)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, bark(), WS(8, 'dog') + 0.2, 0.45)
place(sfx, swish(), LS(9) - 0.15, 0.5)
for k in range(6): place(sfx, hp_fast(noise(0.08) * env(int(0.08 * SR), 0.001, 0.06), 2500), LS(9) + k * 14 / 30, 0.35)
place(sfx, swish(), WS(9, 'pickles') - 0.15, 0.4); place(sfx, bark(), WS(9, 'famous'), 0.45)
place(sfx, swish(), WS(10, 'medal') - 0.15, 0.4); place(sfx, ting(), WS(10, 'medal'), 0.45); place(sfx, swish(), WS(10, 'movie') - 0.15, 0.4); place(sfx, rattle(1.0), WS(10, 'movie'), 0.3)
place(sfx, swish(), WS(10, 'food') - 0.2, 0.4); place(sfx, chew(1.0), WS(10, 'food') + 0.2, 0.35); place(sfx, bark(), WS(10, 'food') + 0.6, 0.4)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, boom(1.6), WS(11, 'wins'), 0.45); place(sfx, sub(0.9, 36), WS(11, 'wins'), 0.8); place(sfx, horn(0.8), WS(11, 'wins') + 0.1, 0.4)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, swish(), WS(12, 'lick') - 0.15, 0.4); place(sfx, chew(1.6, 6), WS(12, 'lick'), 0.4); place(sfx, swish(), WS(12, 'pickles') - 0.15, 0.4); place(sfx, bark(), WS(12, 'pickles'), 0.55); place(sfx, thunk(60, 0.4), WS(12, 'pickles'), 0.5)
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, chew(1.2, 6), LS(13) + 0.2, 0.3); place(sfx, bark(), WS(13, 'first'), 0.45)
mixdown()
