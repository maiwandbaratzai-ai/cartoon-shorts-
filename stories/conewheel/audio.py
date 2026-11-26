# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def sneaky(t0, t1, g=1.0):   # tiptoe heist pizzicato (instruments only)
    notes = [57, 60, 64, 63, 62, 60, 59, 62, 57, 64, 69, 64]; bt = 0.25; k = 0
    while t0 + k * bt < t1: place(music, pizz(midi(notes[k % len(notes)])), t0 + k * bt, 0.34 * g); place(music, marimba(midi(notes[k % len(notes)] + 12), 0.3), t0 + k * bt + 0.125, 0.1 * g if k % 2 else 0); k += 1
def chuff(t0, d, g=0.3, sp=0.18):
    k = 0
    while k * sp < d: place(sfx, hp_fast(noise(0.1), 1000) * env(int(0.1 * SR), 0.005, 0.08), t0 + k * sp, g * (1 if k % 2 == 0 else 0.6)); k += 1
def clack(t0, d, g=0.25):
    k = 0
    while k * 0.42 < d: place(sfx, thunk(220, 0.08, 0.2), t0 + k * 0.42, g); place(sfx, thunk(200, 0.08, 0.2), t0 + k * 0.42 + 0.12, g * 0.8); k += 1
bed(0, LS(1), 'tension', 1.2, 150)
sneaky(LS(1), LS(4), 1.0); bed(LS(1), LS(4), 'quirky', 0.5, 120)
bed(LS(4), LS(5) - 0.05, 'tension', 1.45, 160)
bed(LS(5), LS(7) - 0.18, 'march', 1.0, 132)
bed(LS(7), LS(8), 'dark', 0.6, 96)
bed(LS(8), LS(11), 'quirky', 0.85, 112)
bed(LS(11), LS(12), 'march', 0.9, 124)
sneaky(LS(12), D, 1.1); bed(LS(12), D, 'quirky', 0.6, 124)
for fr in [48, 98, 160, 200, 248, 300, 348, 398, 458, 520, 562, 621, 690, 752, 790, 877, 935, 996, 1060, 1139, 1197, 1300]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [821, 1244]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, leaves(D), 0, 0.025)
# L0 pie car through his own barn
clack(0, 1.2, 0.3); gag(crash(1.2), WS(0, 'through') - 0.3, 0.5); place(sfx, boom(0.8), WS(0, 'through') - 0.3, 0.4); place(sfx, sub(0.5, 46), WS(0, 'through') - 0.3, 0.5); gag(splat(), WS(0, 'barn'), 0.45); place(sfx, splat(), WS(0, 'barn') + 0.25, 0.35)
# L1 swapped wheels, easy as pie, why
gag(clink(3), WS(1, 'swapped'), 0.45); place(sfx, scrape(0.5), WS(1, 'cone'), 0.35); gag(thunk(150, 0.25), WS(1, 'flat'), 0.4); gag(stamp(), WS(1, 'as'), 0.4); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 the plan, Hairpin Bend
place(sfx, flip(), WS(2, 'plan'), 0.4); gag(tick(), WS(2, 'stuck'), 0.4); place(sfx, ting(), WS(2, 'hairpin'), 0.3)
# L3 Fennel's one cherry pie
gag(squeak(), WS(3, 'fennel'), 0.4); gag(chew(0.5, 6), WS(3, 'cherry'), 0.4); gag(bell(1500), WS(3, 'week'), 0.3)
# L4 the bend: screech, sparks, cat up a curtain
chuff(LS(4), 2.0, 0.3); place(sfx, horn(0.6), WS(4, 'express'), 0.35); gag(screech(1.4), WS(4, 'screeched'), 0.5); gag(scrape(1.2), WS(4, 'sparks'), 0.45); gag(slide(True, 0.5), WS(4, 'climbed'), 0.4); gag(meow(), WS(4, 'cat'), 0.45)
# L5 straight across Moo Meadow, three cows
place(sfx, rumble(2.0), WS(5, 'rolled'), 0.3); gag(moo(), WS(5, 'moo'), 0.45)
for k in range(3): place(sfx, moo(), WS(5, 'three') + k * 0.3, 0.3)
gag(boing(220, 0.4), WS(5, 'confused'), 0.35)
# L6 cheers, then sees the barn
gag(stamp(), WS(6, 'as'), 0.4); place(sfx, scratch(), WS(6, 'then') - 0.1, 0.35); gag(slide(False, 0.6), WS(6, 'going'), 0.45)
# L7 question + riser
place(sfx, scratch(), LS(7) - 0.12, 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 fatter inside, axle slides out
place(sfx, drop(), WS(8, 'each'), 0.5); gag(ting(), WS(8, 'fatter'), 0.4); gag(slide(True, 0.4), WS(8, 'slides'), 0.4)
# L9 outer fat, inner thin, steers itself
gag(bell(880), WS(9, 'fat'), 0.35); gag(bell(1320), WS(9, 'thin'), 0.35); gag(ting(), WS(9, 'steers'), 0.45)
# L10 paper cup
gag(rattle(0.8), WS(10, 'cup'), 0.35); gag(boing(300, 0.4), WS(10, 'circle'), 0.35)
# L11 flat wheels only know straight
gag(whoosh(0.6), WS(11, 'straight') - 0.2, 0.4); gag(bonk(380), WS(11, 'straight') + 0.3, 0.4)
# L12 Fennel's pie, Lou's 49, easy as pie
gag(chew(0.8, 6), WS(12, 'pie'), 0.45); countup(WS(12, 'forty') - 0.1, WS(12, 'forty') + 0.5, 0.3); gag(splat(), WS(12, 'forty') + 0.4, 0.45); gag(splat(), WS(12, 'easy'), 0.35); button(WS(12, 'pie') + 0.4 if False else LS(12) + 3.2, 'march', 0.9)
mixdown()
