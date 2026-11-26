# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def calliope(t0, t1, g=1.0):   # a wheezy circus waltz (3/4), instruments only
    notes = [72, 76, 79, 76, 74, 77, 81, 77, 72, 79, 84, 79]; bt = 0.22; k = 0
    while t0 + k * bt < t1:
        place(music, marimba(midi(notes[k % len(notes)]), 0.35), t0 + k * bt, 0.18 * g)
        if k % 3 == 0: place(music, pizz(midi(notes[k % len(notes)] - 24)), t0 + k * bt, 0.32 * g)
        else: place(music, pluck(midi(notes[k % len(notes)] - 12), 0.2, 0.4), t0 + k * bt, 0.12 * g)
        k += 1
def wobble(t0, d, g=0.3):   # a sliding wah-wah for wobbles
    n = int(d * SR); t = np.arange(n) / SR; fr = 300 + 120 * np.sin(2 * np.pi * 3 * t); s = np.sin(2 * np.pi * np.cumsum(fr) / SR).astype(np.float32) * env(n, 0.05, 0.2); place(sfx, s, t0, g)
calliope(0, LS(1) - 0.05, 1.1); bed(0, LS(1), 'quirky', 0.55, 132)
bed(LS(1), LS(2), 'march', 0.9, 120)
calliope(LS(2), LS(4), 0.8); bed(LS(2), LS(4), 'quirky', 0.8, 126)
bed(LS(4), LS(5), 'march', 1.0, 130)
bed(LS(5), LS(6) - 0.05, 'tension', 1.45, 160)
bed(LS(6), LS(7) - 0.18, 'quirky', 0.8, 110)
bed(LS(7), LS(8), 'dark', 0.6, 96)
bed(LS(8), LS(11), 'quirky', 0.85, 112)
calliope(LS(11), LS(13), 0.9); bed(LS(11), LS(13), 'march', 0.8, 124)
calliope(LS(13), D, 1.2); bed(LS(13), D, 'quirky', 0.55, 124)
for fr in [50, 98, 160, 212, 280, 336, 392, 432, 495, 562, 612, 655, 705, 764, 866, 935, 983, 1030, 1062, 1186, 1245, 1318, 1360]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [816, 1122]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, crowd(D) if False else rumble(D), 0, 0.03)
# L0 toothpick wobble like a noodle
wobble(0.2, 2.6, 0.3); gag(boing(200, 0.6), WS(0, 'wobbling'), 0.45); gag(slide(False, 0.5), WS(0, 'noodle'), 0.35); place(sfx, trumpet(), 0.6, 0.35)
# L1 Barty, catchphrase, why
gag(bell(1500), WS(1, 'barty'), 0.35); gag(stamp(), WS(1, 'customer') + 0.5, 0.4); place(sfx, horn(0.4), WS(1, 'always'), 0.25); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 complaint one: hat knocked off, sawed in half
place(sfx, ting(), WS(2, 'complaint'), 0.4); gag(bonk(500), WS(2, 'knocked'), 0.45); place(sfx, scrape(0.9), WS(2, 'sawed'), 0.45); gag(snap(), WS(2, 'half'), 0.5); place(sfx, thunk(120, 0.25), WS(2, 'half') + 0.15, 0.4)
# L3 Peanut gasps, garden hose
gag(trumpet(), WS(3, 'peanut'), 0.55); place(sfx, boing(260, 0.4), WS(3, 'gasped'), 0.35)
for k in range(4): place(sfx, stomp(0.6), WS(3, 'practicing') + k * 0.35, 0.3)
gag(squeak(), WS(3, 'hose'), 0.4)
# L4 complaint two: popcorn, toothpick
place(sfx, ting(), WS(4, 'complaint'), 0.4); gag(chew(0.6, 6), WS(4, 'popcorn'), 0.4); place(sfx, pop(), WS(4, 'popcorn') + 0.2, 0.3); gag(ting(), WS(4, 'toothpick'), 0.45); gag(stamp(), WS(4, 'customer') + 0.5, 0.4)
# L5 sway left, right, rotisserie spin
wobble(WS(5, 'swayed'), 1.0, 0.35); gag(slide(True, 0.3), WS(5, 'left'), 0.35); gag(slide(False, 0.3), WS(5, 'right'), 0.35); gag(whoosh(0.9), WS(5, 'spun'), 0.5); place(sfx, rattle(1.0), WS(5, 'spun'), 0.3); gag(bonk(380), WS(5, 'chicken'), 0.4); place(sfx, trumpet(), WS(5, 'chicken') + 0.3, 0.35)
# L6 complaint three: seasick
place(sfx, ting(), WS(6, 'complaint'), 0.4); wobble(WS(6, 'made'), 0.9, 0.35); gag(gulp(), WS(6, 'seasick'), 0.4)
# L7 question + riser
place(sfx, scratch(), LS(7) - 0.12, 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 office chair + ladder
place(sfx, drop(), WS(8, 'long'), 0.5); place(sfx, creak(0.8, 160), WS(8, 'spinning'), 0.4); gag(clink(2), WS(8, 'ladder'), 0.45); place(sfx, whoosh(0.8), FR(960), 0.4); gag(boing(300, 0.5), FR(965), 0.35)
# L9 tips slowly, fix it
gag(slide(False, 1.2), WS(9, 'tips'), 0.35); gag(ting(), WS(9, 'fix'), 0.45)
# L10 toothpick: dropped pencil onto the mat
gag(slide(False, 0.3), WS(10, 'over'), 0.4); gag(thunk(110, 0.3), WS(10, 'pencil'), 0.5); place(sfx, sub(0.4, 50), WS(10, 'pencil'), 0.4); place(sfx, boing(180, 0.5), WS(10, 'pencil') + 0.15, 0.35)
# L11 pole back, strolls eating popcorn
for k in range(6): place(sfx, footsteps(0.3, 9, 900), WS(11, 'barty') + k * 0.25, 0.2)
gag(stamp(), WS(11, 'back'), 0.45); place(sfx, ting(), WS(11, 'strolled'), 0.3); gag(chew(1.0, 5), WS(11, 'eating'), 0.45)
# L12 Peanut's pole, still on the hose
gag(trumpet(), WS(12, 'peanut'), 0.5); place(sfx, clink(1), WS(12, 'pole'), 0.35); gag(squeak(), WS(12, 'hose'), 0.4); place(sfx, stomp(0.6), WS(12, 'hose') + 0.3, 0.3)
# L13 new sign
gag(flip(), WS(13, 'sign'), 0.45); place(sfx, bell(1500), WS(13, 'customer'), 0.3); gag(bonk(420), WS(13, 'except'), 0.4); button(WS(13, 'poles') + 0.4, 'march', 0.9)
mixdown()
