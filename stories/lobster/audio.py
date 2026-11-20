# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def clicks(t0, t1, rate=6, g=0.18):        # lobster legs tip-tapping on gravel
    t = t0
    while t < t1: place(sfx, hp_fast(noise(0.03) * env(int(0.03 * SR), 0.001, 0.02), 2500), t, g); t += 1 / rate
def snip(t, g=0.45): place(sfx, hp_fast(noise(0.05) * env(int(0.05 * SR), 0.001, 0.04), 1800), t, g); place(sfx, thunk(300, 0.06, 0.2), t, g * 0.6)
bed(0, LS(4) - 0.1, 'quirky', 0.9, 118)
bed(LS(4) - 0.1, LS(6) - 0.1, 'tension', 1.0, 132)
bed(LS(6) - 0.1, LS(9) - 0.2, 'tension', 1.1, 140)
bed(LS(10), LS(12) - 0.1, 'sad', 0.8, 84)
bed(LS(12) - 0.1, D, 'quirky', 1.0, 124)
clicks(0, LS(4)); place(sfx, footsteps(LS(4) - 0.2, 2, 500), 0, 0.3); place(sfx, water(D), 0, 0.06)
place(sfx, swish(), WS(0, 'paris') - 0.2, 0.4); snip(WS(0, 'paris'))
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, swish(), WS(1, 'leash') - 0.15, 0.4); place(sfx, ting(), WS(1, 'ribbon'), 0.35)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, slide(True, 0.5), WS(2, 'gasp'), 0.3); place(sfx, boing(260), WS(2, 'giggle'), 0.3)
place(sfx, swish(), WS(2, 'poodle') - 0.15, 0.45); place(sfx, bark(), WS(2, 'barks'), 0.6); place(sfx, bark(), WS(2, 'barks') + 0.35, 0.5)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, flip(), WS(3, 'tips'), 0.35); place(sfx, swish(), WS(3, 'proud') - 0.15, 0.4); place(sfx, tweet(), WS(3, 'king'), 0.3)
place(sfx, swish(), LS(4) - 0.15, 0.5); snip(WS(4, 'snaps')); snip(WS(4, 'snaps') + 0.18); place(sfx, sub(0.4, 50), WS(4, 'snaps'), 0.4)
for k in range(4): place(sfx, tweet(), WS(4, 'pigeon') + k * 0.12, 0.35)
place(sfx, whoosh(0.7), WS(4, 'pigeon') + 0.1, 0.4); place(sfx, swish(), WS(4, 'whole') - 0.15, 0.4); place(sfx, sting(), WS(4, 'screams'), 0.35)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, boing(160), WS(5, 'jumps'), 0.4); place(sfx, splash(1.2), WS(5, 'fountain'), 0.7); place(sfx, thunk(60, 0.4), WS(5, 'fountain'), 0.6); place(sfx, sub(0.6, 42), WS(5, 'fountain'), 0.6)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(1.6, 4, 800), LS(6) - 0.3, 0.35); place(sfx, stomp(0.7), LS(6) + 0.9, 0.4); place(sfx, swish(), WS(6, 'asks') - 0.15, 0.4); place(sfx, swish(), WS(6, 'lobster') - 0.15, 0.4)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, scratch(), WS(7, 'worse'), 0.3); place(sfx, thunk(90, 0.3), WS(7, 'sits'), 0.5); place(sfx, sub(0.4, 48), WS(7, 'sits'), 0.4); place(sfx, swish(), WS(7, 'refuses') - 0.15, 0.4); place(sfx, bonk(), WS(7, 'move'), 0.3)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, footsteps(1.5, 7, 700), LS(8), 0.3); place(sfx, flip(), WS(8, 'reporters') + 0.2, 0.3); place(sfx, flip(), WS(8, 'reporters') + 0.5, 0.25); place(sfx, swish(), WS(8, 'some') - 0.15, 0.4); place(sfx, ting(), WS(8, 'bet'), 0.3)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, hum(1.2), LS(9), 0.3)
place(sfx, swish(), LS(10) - 0.15, 0.45); place(sfx, swish(), WS(10, 'serious') - 0.25, 0.35); snip(WS(10, 'serious') + 0.2, 0.3)
place(sfx, swish(), LS(11) - 0.15, 0.45); place(sfx, water(1.4), WS(11, 'sea'), 0.3); place(sfx, swish(), WS(11, 'barks') - 0.15, 0.4)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, bark(), WS(12, 'poodle') + 0.05, 0.75); place(sfx, bark(), WS(12, 'poodle') + 0.4, 0.6); place(sfx, thunk(60, 0.4), WS(12, 'poodle'), 0.6); place(sfx, sub(0.6, 40), WS(12, 'poodle'), 0.6)
place(sfx, swish(), WS(12, 'stares') - 0.2, 0.45); place(sfx, slide(False, 0.6), WS(12, 'stares'), 0.35)
place(sfx, swish(), LS(13) - 0.15, 0.5); clicks(LS(13), D); place(sfx, footsteps(D - LS(13), 2, 500), LS(13), 0.3)
mixdown()
