# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def hiss(t0, d, g=0.25): place(sfx, hp_fast(noise(d), 2500) * env(int(d * SR), 0.15, 0.3), t0, g)
def tinkle(t0, t1, g=0.5):   # a bouncy bakery waltz on marimba + pizz bass (instruments only)
    notes = [67, 71, 74, 71, 72, 69, 66, 69, 67, 71, 74, 79]; bt = 0.3; k = 0
    while t0 + k * bt < t1: place(music, marimba(midi(notes[k % len(notes)] + 12)), t0 + k * bt, 0.17 * g); place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.28 * g); k += 1
# music under every second, rising with the chaos
tinkle(0, LS(1) - 0.05, 1.0)
bed(LS(1), LS(2), 'march', 0.9, 116)
bed(LS(2), LS(4), 'quirky', 1.0, 126)
bed(LS(4), LS(5), 'quirky', 0.8, 120)
bed(LS(5), LS(6), 'tension', 1.15, 140)
bed(LS(6), LS(7) - 0.2, 'tension', 1.45, 160)
bed(LS(7), LS(8) - 0.18, 'dark', 0.55, 96)
bed(LS(8), LS(10), 'quirky', 0.85, 112)
bed(LS(10), LS(11), 'march', 1.0, 124)
tinkle(LS(11), D, 1.2); bed(LS(11), D, 'quirky', 0.55, 126)
for fr in [56, 108, 168, 232, 300, 358, 410, 470, 528, 592, 640, 690, 735, 795, 890, 945, 1005, 1070, 1132, 1196, 1262]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [826, 1062]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 pillows + mouse moves in
gag(boing(220, 0.5), WS(0, 'pillows'), 0.4); place(sfx, squeak(), WS(0, 'mouse') + 0.1, 0.45); gag(squeak(), WS(0, 'moved') + 0.2, 0.4); place(sfx, snore(1.0), 2.4, 0.2)
# L1 banned + lazy + why
place(sfx, whoosh(0.4), WS(1, 'banned') - 0.1, 0.4); gag(clink(2), WS(1, 'banned') + 0.6, 0.45); gag(stamp(), WS(1, 'lazy'), 0.45); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 day one: oven door, buns, fluffy
place(sfx, creak(0.6, 180), WS(2, 'day'), 0.4); gag(ting(), WS(2, 'round'), 0.4); gag(boing(260, 0.5), WS(2, 'fluffy'), 0.45)
# L3 beach balls + rolls out + mailman
place(sfx, slide(True, 0.9), WS(3, 'swelled'), 0.4); gag(boing(140, 0.7), WS(3, 'beach'), 0.45); place(sfx, rumble(1.6), WS(3, 'rolled'), 0.3)
gag(footsteps(1.6, 11, 700), WS(3, 'chased'), 0.35); place(sfx, bonk(), WS(3, 'mailman') + 0.4, 0.3)
# L4 Nibbles furious, windows
gag(squeak(), WS(4, 'nibbles'), 0.5)
for k in range(4): place(sfx, thunk(220, 0.12, 0.2), WS(4, 'furious') + k * 0.25, 0.3)
gag(ting(), WS(4, 'windows'), 0.4); place(sfx, squeak(), WS(4, 'windows') + 0.5, 0.35)
# L5 bricks on the door + rumble
for k in range(5): place(sfx, thunk(120, 0.2, 0.5), WS(5, 'stacked') + k * 0.3, 0.35)
gag(stamp(), WS(5, 'lazy'), 0.45); place(sfx, rumble(2.2), WS(5, 'oven'), 0.45); place(sfx, hum(2.0), WS(5, 'oven'), 0.3); hiss(WS(5, 'door'), 1.8, 0.25)
# L6 the door blows: popcorn over Crumbleton
place(sfx, riser(0.4), WS(6, 'blew') - 0.45, 0.3); gag(boom(1.6), WS(6, 'blew'), 0.7); place(sfx, sub(0.7, 48), WS(6, 'blew'), 0.6); place(sfx, crash(1.0), WS(6, 'blew') + 0.05, 0.45)
for k in range(16): place(sfx, pop(), WS(6, 'shot') + k * 0.13 + 0.03 * (k % 3), 0.3)
countup(WS(6, 'four') - 0.2, WS(6, 'four') + 0.6, 0.3)
for k in range(10): place(sfx, bonk(500 + 40 * (k % 4)), WS(6, 'crumbleton') + k * 0.16, 0.22)
gag(pop(), WS(6, 'popcorn'), 0.45)
# L7 question
place(sfx, scratch(), LS(7) - 0.15, 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 dough wet -> steam
place(sfx, drop(), WS(8, 'dough'), 0.5); gag(drip(), WS(8, 'wet'), 0.45); place(sfx, drip(), WS(8, 'water'), 0.35)
hiss(WS(8, 'steam'), 1.4, 0.3); place(sfx, slide(True, 0.7), WS(8, 'wants'), 0.35); gag(boing(200, 0.5), WS(8, 'out'), 0.4)
# L9 tiny chimneys
gag(bell(1320), WS(9, 'chimneys'), 0.35); hiss(WS(9, 'steam'), 1.6, 0.3); gag(chew(0.8, 6), WS(9, 'crisp'), 0.45)
# L10 holes back: roller + job
place(sfx, rattle(1.4), WS(10, 'put'), 0.3); gag(stamp(), WS(10, 'job'), 0.45)
# L11 windows back + mailman
gag(squeak(), WS(11, 'windows'), 0.5); place(sfx, bell(1760), WS(11, 'windows') + 0.3, 0.3)
place(sfx, footsteps(2.6, 11, 700), WS(11, 'mailman'), 0.35); gag(boing(150, 0.6), WS(11, 'runs'), 0.35); button(WS(11, 'bakery') + 0.45, 'march', 0.9)
mixdown()
