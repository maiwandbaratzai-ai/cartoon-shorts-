# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
bed(0, LS(2), 'march', 1.0, 136)
bed(LS(2), LS(4), 'quirky', 0.9, 118)
bed(LS(4), LS(5), 'march', 0.95, 140)
bed(LS(5), LS(6), 'quirky', 0.8, 100)
bed(LS(6), LS(8) - 0.18, 'tension', 1.3, 156)
bed(LS(8), LS(9), 'dark', 0.6, 96)
bed(LS(9), LS(12), 'quirky', 0.85, 112)
bed(LS(12), D, 'march', 1.0, 134)
for fr in [40, 92, 140, 245, 291, 345, 440, 470, 505, 555, 605, 650, 701, 760, 817, 860, 950, 1001, 1055, 1160, 1200, 1262]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [186, 390, 889, 1098]: place(sfx, whoosh(0.6), FR(fr), 0.5)

# L0 boing over the scoreboard, twice
gag(boing(170, 0.7), 0.05, 0.55); gag(slide(True, 0.9), WS(0, 'higher'), 0.4); gag(boing(150, 0.7), FR(66), 0.55); place(sfx, sub(0.4, 46), FR(66), 0.4); gag(ting(), WS(0, 'twice'), 0.35)
# L1 final, nachos
gag(horn(0.7), WS(1, 'championship'), 0.35); gag(slide(False, 0.8), WS(1, 'landed') - 0.3, 0.4); gag(splat(), WS(1, 'nachos'), 0.55); place(sfx, crash(0.6), WS(1, 'nachos') + 0.05, 0.3); place(sfx, roar(), WS(1, 'nachos') + 0.3, 0.25)
# L2 complaint
gag(bell(880), WS(2, 'complaint'), 0.35); gag(rattle(0.6), WS(2, 'cold'), 0.35)
# L3 nice and toasty, oven
gag(ting(), WS(3, 'nice'), 0.4); gag(scrape(0.5), WS(3, 'baked'), 0.4); gag(whoosh(0.5), WS(3, 'oven'), 0.4); place(sfx, hum(1.4), WS(3, 'oven'), 0.2)
# L4 face-off, boing, ref's helmet
gag(tick(), WS(4, 'face'), 0.4); gag(thunk(150, 0.2), WS(4, 'hit'), 0.45); gag(boing(200, 0.8), WS(4, 'boing'), 0.6); gag(bonk(420), WS(4, 'helmet'), 0.6); place(sfx, ting(), WS(4, 'helmet') + 0.15, 0.35); place(sfx, stomp(0.8), WS(4, 'helmet') + 0.5, 0.45)
# L5 Waffles the bear: too chilly to nap
gag(roar(), WS(5, 'waffles'), 0.35); gag(rattle(0.6), WS(5, 'chilly'), 0.35); gag(snore(1.0), WS(5, 'nap'), 0.35)
# L6 heaters to max
gag(ting(), WS(6, 'nice'), 0.35); gag(clink(2), WS(6, 'cranked'), 0.45); gag(slide(True, 0.8), WS(6, 'heater'), 0.4); place(sfx, hum(1.4), WS(6, 'max'), 0.3); gag(whoosh(0.5), WS(6, 'max'), 0.4)
# L7 pinball: 41 bounces, one goal, wrong net
for k in range(14): place(sfx, boing(160 + (k % 5) * 40, 0.25), WS(7, 'slapshot') + k * 0.24, 0.3)
countup(WS(7, 'forty'), WS(7, 'bounces') + 0.4, 0.25); gag(horn(0.9), WS(7, 'goal'), 0.5); gag(bonk(300), WS(7, 'wrong'), 0.5); gag(roar(), WS(7, 'net') + 0.2, 0.35)
# L8 question + riser
place(sfx, scratch(), LS(8) - 0.12, 0.3); gag(thunk(120, 0.2), WS(8, 'down'), 0.35); gag(boing(240, 0.4), WS(8, 'flies'), 0.35); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 explainer: rubber, springy, bouncy ball
place(sfx, drop(), WS(9, 'puck'), 0.5); for_k = [place(sfx, boing(180 + k * 30, 0.4), WS(9, 'springy') + k * 0.4, 0.35) for k in range(3)]; gag(boing(300, 0.5), WS(9, 'bouncy'), 0.45)
# L10 freeze: stiff, slides flat
gag(ting(), WS(10, 'freeze'), 0.45); place(sfx, rattle(0.4), WS(10, 'freeze') + 0.1, 0.3); gag(thunk(90, 0.3), WS(10, 'stiff'), 0.5); place(sfx, sub(0.4, 46), WS(10, 'stiff'), 0.4); gag(scrape(1.0), WS(10, 'slides'), 0.4)
# L11 freezer
gag(creak(0.6, 150), WS(11, 'freezer') - 0.3, 0.4); gag(whoosh(0.5), WS(11, 'freezer'), 0.35); for_k = [place(sfx, clink(1), WS(11, 'game') + k * 0.2, 0.3) for k in range(4)]
# L12 froze the pucks, Waffles in the freezer
gag(scrape(0.6), WS(12, 'froze'), 0.35); gag(horn(0.6), WS(12, 'pucks') + 0.2, 0.35); gag(roar(), WS(12, 'waffles'), 0.4); gag(thunk(120, 0.3), WS(12, 'freezer'), 0.45); place(sfx, snore(1.6), WS(12, 'nice'), 0.4)
button(LS(12) + 3.2, 'march', 0.9)
mixdown()
