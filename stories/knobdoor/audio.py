# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def birds(t0, d, g=0.12):
    k = 0
    while k * 1.7 < d: place(sfx, tweet(), t0 + k * 1.7 + 0.3 * (k % 2), g); k += 1
def strain(t0, d, g=0.3): place(sfx, creak(d, 110), t0, g)
def gnaw(t0, d, g=0.35): place(sfx, chew(d, 9), t0, g)
def banjo(t0, t1, g=0.5):   # a plucky woodland jig (instruments only)
    notes = [62, 66, 69, 74, 69, 66, 64, 67, 71, 67, 64, 62]; bt = 0.27; k = 0
    while t0 + k * bt < t1: place(music, pluck(midi(notes[k % len(notes)] + 12), 0.3, 0.7), t0 + k * bt, 0.2 * g); place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.28 * g); k += 1
birds(0, D, 0.1)
banjo(0, LS(1) - 0.05, 1.0)
bed(LS(1), LS(3), 'march', 0.95, 116)
bed(LS(3), LS(4), 'tension', 1.0, 132)
bed(LS(4), LS(6), 'quirky', 1.0, 124)
bed(LS(6), LS(7) - 0.2, 'tension', 1.45, 156)
bed(LS(7), LS(8) - 0.18, 'dark', 0.55, 96)
bed(LS(8), LS(10), 'quirky', 0.85, 112)
bed(LS(10), LS(11), 'march', 1.0, 122)
banjo(LS(11), D, 1.2); bed(LS(11), D, 'quirky', 0.55, 124)
for fr in [50, 103, 150, 212, 270, 327, 390, 440, 476, 530, 594, 645, 698, 750, 782, 811, 915, 976, 1040, 1175, 1246]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [845, 1102]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 knob by the hinge, nobody gets in
strain(0.2, 2.4, 0.3); gag(clink(1), WS(0, 'doorknob'), 0.4); gag(bonk(), WS(0, 'nobody'), 0.4)
# L1 trust the teeth + why
gnaw(LS(1), 1.2, 0.4); gag(stamp(), WS(1, 'said') - 0.2, 0.4); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 ten minutes, one inch
strain(WS(2, 'pushed'), 2.5, 0.35); countup(WS(2, 'ten') - 0.1, WS(2, 'minutes') + 0.4, 0.3); gag(creak(0.3, 300), WS(2, 'inch'), 0.45); place(sfx, slide(False, 0.5), WS(2, 'inch') + 0.3, 0.3)
# L3 Big Lars
place(sfx, footsteps(2.0, 4, 300), LS(3), 0.4)
for k in range(4): place(sfx, stomp(0.8), LS(3) + k * 0.5, 0.3)
strain(WS(3, 'pushed'), 1.2, 0.4); gag(boing(300, 0.5), WS(3, 'popped'), 0.5); gag(creak(0.35, 260), WS(3, 'two'), 0.45)
# L4 second knob
gnaw(WS(4, 'added'), 1.4, 0.4); gag(clink(2), WS(4, 'second'), 0.45); gag(stamp(), LS(4) + 3.2, 0.35)
# L5 forty people, reading through the window
countup(WS(5, 'forty') - 0.2, WS(5, 'forty') + 0.5, 0.3); gag(flip(), WS(5, 'reading'), 0.4); place(sfx, flip(), WS(5, 'window'), 0.35)
# L6 Gertrude: door opens, so does the wall
gag(trumpet(), WS(6, 'gertrude'), 0.6)
for k in range(4): place(sfx, stomp(1.2), WS(6, 'gertrude') + 0.3 + k * 0.4, 0.4)
strain(WS(6, 'pushed'), 0.6, 0.4); gag(creak(0.5, 200), WS(6, 'opened'), 0.5)
place(sfx, riser(0.3), WS(6, 'wall') - 0.32, 0.3); gag(crash(1.2), WS(6, 'wall') + 0.25, 0.6); place(sfx, boom(1.2), WS(6, 'wall') + 0.25, 0.5); place(sfx, sub(0.7, 46), WS(6, 'wall') + 0.25, 0.6)
# L7 question
place(sfx, scratch(), LS(7) - 0.15, 0.3); place(sfx, squeak(), LS(7) + 0.4, 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 spins around the hinges, long lever
place(sfx, drop(), WS(8, 'door'), 0.5); gag(creak(0.8, 180), WS(8, 'spins'), 0.4); gag(ting(), WS(8, 'lever'), 0.4)
# L9 one finger vs an elephant
gag(ting(), WS(9, 'finger'), 0.4); place(sfx, creak(0.6, 240), WS(9, 'finger') + 0.1, 0.35); strain(WS(9, 'next'), 0.8, 0.35); gag(trumpet(), WS(9, 'elephant'), 0.55)
# L10 knobs moved; pinky
gnaw(WS(10, 'moved'), 1.0, 0.35); gag(clink(1), WS(10, 'edge'), 0.4); place(sfx, creak(0.5, 260), WS(10, 'opened'), 0.35); gag(bell(1760), WS(10, 'pinky'), 0.45)
# L11 Gertrude holds the door
gag(trumpet(), WS(11, 'gertrude'), 0.45); place(sfx, footsteps(2.0, 9, 800), WS(11, 'still'), 0.3); button(WS(11, 'door') + 0.45, 'march', 0.9)
mixdown()
