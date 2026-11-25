# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def rainsnd(t0, d, g=0.18): place(sfx, hp_fast(lp_fast(noise(d), 6000), 900) * env(int(d * SR), 0.4, 0.4), t0, g)
def paddle(t0, n, g=0.3):
    for k in range(n): place(sfx, splash(0.3), t0 + k * 0.5, g)
def parade(t0, t1, g=0.5):   # a perky town-band tune on marimba + pizz (instruments only)
    notes = [67, 72, 76, 72, 74, 71, 67, 71, 72, 76, 79, 76]; bt = 0.27; k = 0
    while t0 + k * bt < t1: place(music, marimba(midi(notes[k % len(notes)] + 12)), t0 + k * bt, 0.17 * g); place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.3 * g); k += 1
# flash-forward hook (rain) then sunny opening day, a week of rain, explainer, sunny ending
rainsnd(0, FR(98)); rainsnd(FR(532), FR(1301) - FR(532)); rainsnd(FR(1301), FR(1546) - FR(1301), 0.1)
parade(0, LS(1) - 0.05, 0.9); bed(0, LS(1), 'quirky', 0.5, 124)
bed(LS(1), LS(3), 'march', 1.0, 120)
bed(LS(3), LS(6), 'quirky', 0.95, 126)
bed(LS(6), LS(9), 'tension', 1.1, 138)
bed(LS(9), LS(10), 'quirky', 1.0, 128)
bed(LS(10), LS(12), 'tension', 1.45, 158)
bed(LS(12), LS(13) - 0.18, 'march', 0.9, 122)
bed(LS(13), LS(14) - 0.18, 'dark', 0.55, 96)
bed(LS(14), LS(16), 'quirky', 0.85, 112)
bed(LS(16), LS(17), 'tension', 0.9, 130)
bed(LS(17), LS(18), 'march', 1.0, 122)
parade(LS(18), D, 1.2); bed(LS(18), D, 'quirky', 0.55, 124)
for fr in [48, 98, 155, 214, 265, 320, 370, 422, 473, 532, 568, 610, 645, 692, 740, 791, 850, 885, 921, 975, 1034, 1100, 1162, 1215, 1271, 1370, 1440, 1490, 1546, 1610, 1662, 1709, 1764]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [90, 526, 1294, 1540, 1805]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 lake + duck
place(sfx, water(2.5), 0.1, 0.25); gag(splash(0.8), WS(0, 'lake'), 0.4); gag(quack(), WS(0, 'duck'), 0.55); place(sfx, quack(), WS(0, 'in') + 0.3, 0.4)
# L1 pancake + why
gag(boing(240, 0.4), WS(1, 'smooth') + 0.3, 0.4); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 ribbon + clapping
gag(snap(), WS(2, 'scissors'), 0.45); countup(WS(2, 'four') - 0.1, WS(2, 'four') + 0.6, 0.3)
for k in range(14): place(sfx, snap(), WS(2, 'clapped') + k * 0.09 + 0.03 * (k % 3), 0.15)
place(sfx, bell(1320), WS(2, 'clapped'), 0.3)
# L3 Hilda's hump
place(sfx, rumble(1.2), WS(3, 'built'), 0.3); gag(slide(True, 0.5), WS(3, 'hump'), 0.35); place(sfx, slide(False, 0.5), WS(3, 'hump') + 0.5, 0.3)
# L4 Doug laughs, spine
gag(boing(180, 0.5), WS(4, 'has'), 0.4); place(sfx, bonk(), WS(4, 'has') + 0.5, 0.3)
# L5 bike
gag(bell(1760), WS(5, 'bike'), 0.45); place(sfx, bell(1760), WS(5, 'bike') + 0.18, 0.3)
# L6 rain for a week
place(sfx, scratch(), LS(6) - 0.15, 0.25); place(sfx, boom(1.5), WS(6, 'rained'), 0.35); gag(drip(), WS(6, 'week'), 0.4)
# L7 puddles, ankle-deep, bus captain
gag(drip(), WS(7, 'puddles'), 0.4); gag(splash(0.5), WS(7, 'ankle'), 0.4); place(sfx, slide(True, 0.6), WS(7, 'five'), 0.35); gag(horn(0.6), WS(7, 'captain'), 0.4)
# L8 pizza canoe + fire truck paddle
paddle(WS(8, 'pizza'), 3, 0.3); gag(ting(), WS(8, 'canoe'), 0.35); place(sfx, horn(0.4), WS(8, 'fire'), 0.3); gag(splash(0.6), WS(8, 'paddle'), 0.4)
# L9 Admiral Puddles
gag(quack(), WS(9, 'admiral'), 0.55); place(sfx, bell(990), WS(9, 'admiral') + 0.4, 0.25); gag(quack(), WS(9, 'traffic'), 0.45); place(sfx, horn(0.3), WS(9, 'traffic') + 0.3, 0.3)
# L10 sponge
gag(boing(120, 0.6), WS(10, 'sofa'), 0.4); gag(stamp(), WS(10, 'as') - 0.3, 0.35)
# L11 sponge drinks, swells like a whale, floats away
place(sfx, gloop(1.4), WS(11, 'drank'), 0.45); place(sfx, slide(True, 1.0), WS(11, 'swelled'), 0.4); gag(boom(1.0), WS(11, 'whale'), 0.45); place(sfx, sub(0.6, 46), WS(11, 'whale'), 0.5)
place(sfx, splash(1.0), WS(11, 'whale') + 0.2, 0.35); gag(slide(False, 1.0), WS(11, 'floated'), 0.35); place(sfx, water(2.0), WS(11, 'floated'), 0.25)
# L12 Humpton: bike + dry socks
place(sfx, bell(1760), WS(12, 'rode'), 0.35); place(sfx, rattle(1.4), WS(12, 'rode'), 0.2); gag(ting(), WS(12, 'dry'), 0.45)
# L13 question
place(sfx, scratch(), LS(13) - 0.15, 0.3); place(sfx, riser(1.2), LS(14) - 1.25, 0.4)
# L14 rain rolls to the gutters
place(sfx, drop(), WS(14, 'rain'), 0.5); for_ = 0
for k in range(6): place(sfx, drip(), WS(14, 'rolls') + k * 0.2, 0.3)
gag(water(1.2), WS(14, 'gutters'), 0.35)
# L15 flat road: water sits, soaks in
gag(bonk(300), WS(15, 'downhill'), 0.35); place(sfx, gloop(1.0), WS(15, 'soaks'), 0.4)
# L16 Swiss cheese, potholes, a fish
gag(boing(160, 0.5), WS(16, 'swiss'), 0.4); countup(WS(16, 'two') - 0.1, WS(16, 'two') + 0.6, 0.3); for_ = 0
for k in range(4): place(sfx, thunk(160, 0.15, 0.3), WS(16, 'potholes') + k * 0.15, 0.3)
gag(bloop(300), WS(16, 'fish'), 0.45); place(sfx, splash(0.3), WS(16, 'fish') + 0.3, 0.3)
# L17 rebuilt with a hump, duck lost his lake
place(sfx, rumble(1.0), WS(17, 'rebuilt'), 0.35); gag(stamp(), WS(17, 'hump'), 0.4); gag(slide(False, 0.7), WS(17, 'lost'), 0.35); place(sfx, quack(), WS(17, 'lake') + 0.2, 0.4)
# L18 bathtub
place(sfx, splash(0.6), WS(18, 'moved'), 0.35); gag(quack(), WS(18, 'bathtub'), 0.5); place(sfx, bloop(400), WS(18, 'bathtub') + 0.4, 0.3); button(WS(18, 'bathtub') + 0.6, 'march', 0.9)
mixdown()
