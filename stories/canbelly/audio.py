# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def fizz(t0, d, g=0.25): place(sfx, hp_fast(noise(d), 3500) * env(int(d * SR), 0.05, 0.4), t0, g)
def clatter(t0, d, g=0.3): place(sfx, hp_fast(lp_fast(noise(d), 5000), 800) * (0.5 + 0.5 * np.sign(np.sin(np.arange(int(d * SR)) / SR * 2 * np.pi * 7))).astype(np.float32) * env(int(d * SR), 0.01, 0.2), t0, g)
def bounce(t0, t1, g=0.5):   # a bouncy factory polka (instruments only)
    notes = [65, 69, 72, 69, 70, 67, 64, 67, 65, 72, 77, 72]; bt = 0.25; k = 0
    while t0 + k * bt < t1: place(music, marimba(midi(notes[k % len(notes)] + 12)), t0 + k * bt, 0.18 * g); place(music, pizz(midi(notes[k % len(notes)] - (12 if k % 2 == 0 else 5))), t0 + k * bt, 0.3 * g); k += 1
place(sfx, rattle(D), 0, 0.05)
bounce(0, LS(1) - 0.05, 1.0)
bed(LS(1), LS(3), 'march', 0.95, 118)
bed(LS(3), LS(4), 'quirky', 1.0, 128)
bed(LS(4), LS(6), 'march', 1.0, 126)
bed(LS(6), LS(7) - 0.2, 'tension', 1.45, 158)
bed(LS(7), LS(8) - 0.18, 'dark', 0.55, 96)
bed(LS(8), LS(10), 'quirky', 0.85, 112)
bed(LS(10), LS(11), 'march', 1.0, 122)
bounce(LS(11), D, 1.2); bed(LS(11), D, 'quirky', 0.55, 124)
for fr in [55, 116, 190, 270, 320, 365, 420, 470, 519, 565, 611, 665, 705, 753, 805, 845, 874, 955, 1015, 1070, 1180, 1235]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [888, 1118]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 cans waddle off like penguins
for k in range(6): place(sfx, clink(1), 0.3 + k * 0.33, 0.3)
gag(boing(220, 0.4), WS(0, 'waddled'), 0.4); gag(squawk(), WS(0, 'penguins'), 0.35); place(sfx, bonk(500), WS(0, 'penguins') + 0.4, 0.3)
# L1 flat is fancy + why
gag(stamp(), WS(1, 'fancy'), 0.45); place(sfx, ting(), WS(1, 'fizzwell'), 0.3); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 bellies
fizz(WS(2, 'lunch'), 1.2, 0.3); place(sfx, slide(True, 0.6), WS(2, 'puffed'), 0.35); gag(boing(160, 0.6), WS(2, 'belly'), 0.45)
# L3 Pogo + fetch
gag(bark(), WS(3, 'pogo'), 0.55); place(sfx, bark(), WS(3, 'thrilled'), 0.4); place(sfx, rumble(1.2), WS(3, 'rolling'), 0.3); gag(bark(), WS(3, 'fetch'), 0.45)
countup(WS(3, 'six') - 0.1, WS(3, 'six') + 0.7, 0.35); place(sfx, footsteps(1.4, 12, 900), WS(3, 'six'), 0.25)
# L4 twice as thick
place(sfx, creak(0.4, 220), WS(4, 'made'), 0.4); gag(clink(3), WS(4, 'twice'), 0.45); gag(stamp(), WS(4, 'fancy') if False else LS(4) + 2.4, 0.4)
# L5 brick-heavy, truck sits like a camel
for k in range(3): place(sfx, stomp(1.0), WS(5, 'weighed') + k * 0.35, 0.35)
gag(thunk(90, 0.3), WS(5, 'brick'), 0.45); place(sfx, creak(0.8, 90), WS(5, 'sat'), 0.4); gag(boom(0.8), WS(5, 'sat') + 0.15, 0.4); place(sfx, sub(0.5, 46), WS(5, 'sat') + 0.15, 0.5); place(sfx, horn(0.3), WS(5, 'camel'), 0.25)
# L6 hot day, 200 pops, soda rain
place(sfx, hum(2.0), WS(6, 'hot'), 0.3); countup(WS(6, 'two') - 0.1, WS(6, 'two') + 0.5, 0.3)
for k in range(18): place(sfx, pop(), WS(6, 'popped') + k * 0.07 + 0.02 * (k % 3), 0.28)
gag(boom(1.0), WS(6, 'popped'), 0.5); place(sfx, sub(0.6, 48), WS(6, 'popped'), 0.5); fizz(WS(6, 'popped'), 2.0, 0.4); gag(water(1.6), WS(6, 'rained'), 0.4)
# L7 question
place(sfx, scratch(), LS(7) - 0.15, 0.3); place(sfx, drip(), LS(7) + 0.3, 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 fizz pushes, flat bends
place(sfx, drop(), WS(8, 'fizz'), 0.5); fizz(WS(8, 'pushes'), 1.4, 0.3); gag(creak(0.5, 300), WS(8, 'bends'), 0.45); place(sfx, boing(260, 0.4), WS(8, 'bends') + 0.2, 0.3)
# L9 dome = arch
gag(ting(), WS(9, 'dome'), 0.4); gag(bell(1320), WS(9, 'arch'), 0.35); place(sfx, clink(2), WS(9, 'hold'), 0.3)
# L10 dent back, Pogo's ball
gag(stamp(), WS(10, 'back'), 0.45); gag(bark(), WS(10, 'pogo'), 0.5); place(sfx, rumble(1.0), WS(10, 'ball') - 0.4, 0.25)
# L11 about her hat
place(sfx, ting(), WS(11, 'says'), 0.3); gag(boing(300, 0.4), WS(11, 'hat'), 0.4); button(WS(11, 'hat') + 0.45, 'march', 0.9)
mixdown()
