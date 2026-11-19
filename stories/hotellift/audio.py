# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
B = WS(11, 'whistle')
bed(0, LS(5) - 0.1, 'quirky', 0.85, 118)                      # playful: men cranking jacks, guest pouring tea
bed(LS(5) - 0.1, LS(7) - 0.1, 'tension', 1.1, 132)           # the crack: tension
bed(LS(7) - 0.1, B - 0.25, 'tension', 0.9, 112)              # the why: lower tension, rising again
bed(B, D, 'march', 1.0, 124)                                  # triumphant after a 0.2 s near-silence
# jacks clicking all through the cranking
import numpy as np
for t in np.arange(0.2, LS(5), 0.45): place(sfx, tick(), t, 0.25)
for t in np.arange(LS(13), D, 0.45): place(sfx, tick(), t, 0.25)
place(sfx, creak(0.5, 120), 0.4, 0.4); place(sfx, sub(0.6, 45), 0.4, 0.4)
place(sfx, swish(), 1.85, 0.5)
# tea pour + teacup
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, water(1.2), WS(1, 'pours'), 0.25); place(sfx, ting(), WS(1, 'tea') + 0.3, 0.3)
place(sfx, swish(), WS(1, 'if') - 0.15, 0.5); place(sfx, creak(0.5, 160), WS(1, 'slips'), 0.5); place(sfx, hum(1.2), WS(1, 'six'), 0.35); place(sfx, sub(0.8, 40), WS(1, 'fall'), 0.6)
# mockery
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, bonk(), WS(2, 'lift'), 0.35); place(sfx, boing(260), WS(2, 'screws'), 0.35)
# whistle + turn
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, horn(0.5), WS(3, 'whistle'), 0.25); place(sfx, bell(2400), WS(3, 'whistle'), 0.2)
place(sfx, swish(), WS(3, 'every') - 0.2, 0.4); place(sfx, thunk(70, 0.3), WS(3, 'turn'), 0.6); place(sfx, sub(0.5, 48), WS(3, 'turn'), 0.5)
# hairs
place(sfx, slide(True, 0.4), WS(4, 'rises'), 0.35); place(sfx, ting(), WS(4, 'hair'), 0.35); place(sfx, ting(), 478 / 30 + 0.3, 0.35); place(sfx, ting(), 516 / 30, 0.4)
place(sfx, swish(), WS(4, 'then') - 0.2, 0.4)
# groan + crack
place(sfx, scratch(), LS(5) - 0.15, 0.4); place(sfx, creak(0.9, 90), WS(5, 'groan'), 0.8); place(sfx, sub(0.9, 38), WS(5, 'groan'), 0.6)
place(sfx, snap(), WS(5, 'crack'), 0.7); place(sfx, thunk(55, 0.5), WS(5, 'crack'), 0.8); place(sfx, sub(0.9, 36), WS(5, 'crack'), 0.8); place(sfx, crash(0.8), WS(5, 'crack') + 0.1, 0.25)
place(sfx, tweet(), WS(5, 'crack') + 0.3, 0.3)
# sprint + tea
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(1.5, 10, 650), WS(6, 'sprint'), 0.4)
place(sfx, swish(), WS(6, 'man') - 0.15, 0.5); place(sfx, water(1.0), WS(6, 'pouring') - 0.2, 0.25)
# why
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, bloop(240), WS(7, 'all'), 0.35)
# sinking city, wagon, horse
place(sfx, slide(False, 0.8), WS(8, 'sinking'), 0.4); place(sfx, swish(), WS(8, 'mud') - 0.15, 0.45)
place(sfx, gloop(1.6), WS(8, 'mud'), 0.45); place(sfx, neigh(), WS(8, 'wagons'), 0.5); place(sfx, gloop(1.0), WS(8, 'vanished'), 0.4)
place(sfx, swish(), LS(9) - 0.15, 0.4); place(sfx, flip(), WS(9, 'sign'), 0.35); place(sfx, stamp(), WS(9, 'no'), 0.5); place(sfx, bonk(), WS(9, 'here') + 0.2, 0.3)
# sewers
place(sfx, swish(), LS(10) - 0.15, 0.5)
for k in range(5): place(sfx, thunk(200, 0.12), WS(10, 'build') + k * 0.28, 0.3)
place(sfx, water(1.4), WS(10, 'sewers'), 0.25)
# last whistle (near-silence 0.2 s before), payoff
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, hum(B - LS(11) + 0.1), LS(11) - 0.1, 0.35); place(sfx, horn(0.6), B, 0.3); place(sfx, bell(2400), B, 0.25)
place(sfx, thunk(50, 0.6), LS(12) - 0.1, 0.9); place(sfx, sub(1.0, 36), LS(12) - 0.1, 0.9); place(sfx, boom(1.5), LS(12) - 0.1, 0.3)
place(sfx, tweet(), LS(12) + 0.6, 0.3)
place(sfx, swish(), WS(12, 'tea') - 0.15, 0.5); place(sfx, ting(), WS(12, 'spilled'), 0.45)
place(sfx, gulp(), LS(13) + 0.4, 0.35); place(sfx, swish(), WS(13, 'bothered') - 0.15, 0.5)
mixdown()
