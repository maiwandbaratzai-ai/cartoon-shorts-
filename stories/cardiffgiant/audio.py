# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def digs(t0, t1, rate=2.5, g=0.35):
    t = t0
    while t < t1: place(sfx, thunk(120, 0.12, 0.5), t, g); place(sfx, hp_fast(noise(0.15) * env(int(0.15 * SR), 0.003, 0.12), 700), t + 0.03, g * 0.6); t += 1 / rate
bed(0, LS(1) - 0.1, 'tension', 0.9, 112)
bed(LS(1) - 0.1, LS(3) - 0.1, 'dark', 0.85, 96)
bed(LS(3) - 0.1, LS(7) - 0.1, 'quirky', 0.9, 124)
bed(LS(7) - 0.1, LS(10) - 0.2, 'tension', 1.1, 136)
bed(LS(10), LS(11) - 0.1, 'march', 1.0, 120)
bed(LS(11) - 0.1, LS(12) - 0.1, 'dark', 0.85, 100)
bed(LS(12) - 0.1, D, 'quirky', 0.95, 124)
# hoist flash-forward: rope creaks, heavy stone
place(sfx, creak(1.2, 120), 0.1, 0.5); place(sfx, hum(2.4), 0.2, 0.3); place(sfx, sub(0.8, 40), 0.4, 0.5); place(sfx, creak(0.9, 100), 1.6, 0.4); place(sfx, swish(), WS(0, 'cardiff') - 0.15, 0.4)
place(sfx, swish(), LS(1) - 0.15, 0.5); digs(LS(1) + 0.2, WS(1, 'foot') - 0.1)
place(sfx, swish(), WS(1, 'shovels') - 0.15, 0.4); place(sfx, ting(), WS(1, 'foot'), 0.6); place(sfx, thunk(70, 0.4), WS(1, 'foot'), 0.6); place(sfx, sub(0.5, 46), WS(1, 'foot'), 0.5)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, thunk(80, 0.3), WS(2, 'leg'), 0.5); place(sfx, scratch(), WS(2, 'leg') + 0.3, 0.2)
place(sfx, swish(), WS(2, 'ten') - 0.15, 0.45); place(sfx, boom(1.4), WS(2, 'ten'), 0.45); place(sfx, sub(0.9, 36), WS(2, 'ten'), 0.8); place(sfx, swish(), WS(2, 'curled') - 0.15, 0.4); place(sfx, snore(1.1), WS(2, 'asleep'), 0.35)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, footsteps(2.5, 6, 700), LS(3), 0.35); place(sfx, swish(), WS(3, 'line') - 0.15, 0.4); place(sfx, tweet(), WS(3, 'line') + 0.4, 0.25)
place(sfx, swish(), LS(4) - 0.15, 0.5)
for k in range(4): place(sfx, thunk(150, 0.1, 0.6), WS(4, 'tent') + k * 0.22, 0.45)
place(sfx, swish(), WS(4, 'fifty') - 0.15, 0.4); place(sfx, countup(WS(4, 'fifty'), WS(4, 'fifty') + 0.7), 0, 0.0) if False else None
for k in range(5): place(sfx, ting(), WS(4, 'fifty') + k * 0.12, 0.25)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, rumble(1.6), LS(5), 0.4); place(sfx, neigh(), WS(5, 'wagons'), 0.45); place(sfx, swish(), WS(5, 'wagons') - 0.15, 0.4); place(sfx, horn(0.5), WS(5, 'jam'), 0.3); place(sfx, rattle(0.8), WS(5, 'roads'), 0.3)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, flip(), WS(6, 'carved'), 0.35); place(sfx, swish(), WS(6, 'nobody') - 0.15, 0.4); place(sfx, bonk(), WS(6, 'listens'), 0.35)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, scratch(), WS(7, 'weirder'), 0.3); place(sfx, footsteps(1.2, 4, 650), WS(7, 'barnum'), 0.35); place(sfx, swish(), WS(7, 'fifty') - 0.15, 0.4); place(sfx, ting(), WS(7, 'fifty'), 0.4); place(sfx, sub(0.5, 50), WS(7, 'fifty'), 0.4)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, stamp(), WS(8, 'no'), 0.5); place(sfx, sub(0.4, 48), WS(8, 'no'), 0.4); place(sfx, swish(), WS(8, 'plaster') - 0.15, 0.45)
for k in range(4): place(sfx, thunk(130, 0.12, 0.6), WS(8, 'plaster') + 0.15 + k * 0.33, 0.4)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, horn(0.8), LS(9) + 0.1, 0.3); place(sfx, swish(), WS(9, 'swears') - 0.15, 0.4); place(sfx, stamp(), WS(9, 'real'), 0.4)
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, thunk(55, 0.5), WS(10, 'barnum'), 0.7); place(sfx, sub(0.8, 38), WS(10, 'barnum'), 0.7); place(sfx, countup(WS(10, 'pay'), WS(10, 'copy')), 0, 0.0) if False else None
for k in range(8): place(sfx, ting(), WS(10, 'pay') + k * 0.09, 0.2)
place(sfx, swish(), WS(10, 'original') - 0.15, 0.4); place(sfx, slide(False, 0.7), WS(10, 'original'), 0.35)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, sub(0.6, 44), WS(11, 'fake'), 0.6); place(sfx, thunk(60, 0.4), WS(11, 'fake'), 0.5)
for k in range(5): place(sfx, thunk(260, 0.08, 0.3), WS(11, 'george') + k * 0.25, 0.35)
place(sfx, swish(), WS(11, 'george') - 0.15, 0.4); place(sfx, swish(), WS(11, 'buried') - 0.15, 0.4); digs(WS(11, 'buried'), LS(12) - 0.2, 2.5, 0.35)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, ting(), WS(12, 'rich'), 0.4); place(sfx, swish(), WS(12, 'barnum') - 0.15, 0.4); place(sfx, ting(), WS(12, 'richer'), 0.45); place(sfx, bell(1320), WS(12, 'richer') + 0.1, 0.3)
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, hum(1.4), LS(13), 0.3); place(sfx, creak(1.0, 120), WS(13, 'real'), 0.35)
mixdown()
