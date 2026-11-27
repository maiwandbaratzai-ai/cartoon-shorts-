# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def wind(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 600) * env(int(d * SR), 0.3, 0.5), t0, g)
bed(0, LS(2), 'march', 1.0, 132)
bed(LS(2), LS(5), 'quirky', 0.9, 118)
bed(LS(5), LS(9) - 0.18, 'tension', 1.3, 150)
bed(LS(9), LS(10), 'dark', 0.6, 96)
bed(LS(10), LS(13), 'quirky', 0.85, 112)
bed(LS(13), D, 'march', 1.0, 132)
for fr in [54, 160, 262, 306, 350, 471, 520, 570, 620, 670, 730, 781, 846, 940, 1003, 1052, 1104, 1262]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [202, 380, 868, 1188]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, engine(D, 70) if False else hum(D), 0, 0.03)
# L0 wrecking-ball cake
wind(0, 3.4, 0.25); gag(whoosh(0.8), 0.3, 0.45); gag(whoosh(0.8), 1.6, 0.4); gag(boom(0.8), WS(0, 'wrecking'), 0.4); place(sfx, sub(0.5, 44), WS(0, 'wrecking'), 0.45)
# L1 four tiers, $900, bride
gag(ting(), WS(1, 'four'), 0.35); gag(clink(3), WS(1, 'nine'), 0.45); gag(scratch(), WS(1, 'bride'), 0.3)
# L2 hole in the top
gag(boing(300, 0.3), WS(2, 'hole'), 0.4); place(sfx, whoosh(0.5), WS(2, 'top'), 0.25)
# L3 a hole is a leak, pizza box
gag(stamp(), WS(3, 'leak'), 0.45); gag(thunk(200, 0.2), WS(3, 'patched'), 0.4); gag(flip(), WS(3, 'pizza'), 0.4)
# L4 Pudding licks her lips
gag(oink(), WS(4, 'pudding'), 0.5); gag(gulp(), WS(4, 'licked'), 0.45)
# L5 chute opens, left, right, upside down
gag(pop(), WS(5, 'opened'), 0.5); wind(LS(5), 3.0, 0.3); gag(slide(False, 0.4), WS(5, 'left'), 0.4); gag(slide(True, 0.4), WS(5, 'right'), 0.4); gag(boing(160, 0.6), WS(5, 'upside'), 0.45)
# L6 twice as big
place(sfx, engine(1.6), LS(6), 0.25); gag(pop(), WS(6, 'big'), 0.5); gag(stamp(), WS(6, 'leak'), 0.4)
# L7 swings twice as far, pops castle, takes hat
wind(LS(7), 3.4, 0.35); gag(whoosh(0.7), WS(7, 'far') - 0.3, 0.45); gag(boom(0.8), WS(7, 'popped'), 0.5); place(sfx, sub(0.4, 46), WS(7, 'popped'), 0.45); place(sfx, slide(False, 1.0), WS(7, 'castle'), 0.35); gag(swish(), WS(7, 'hat'), 0.5)
# L8 the chase
place(sfx, footsteps(2.0), LS(8), 0.35); gag(oink(), WS(8, 'pudding'), 0.45); place(sfx, oink(), WS(8, 'groom'), 0.35)
# L9 question, riser
place(sfx, scratch(), LS(9) - 0.12, 0.3); place(sfx, riser(1.2), LS(10) - 1.25, 0.4)
# L10 trapped air spills out one side
place(sfx, drop(), WS(10, 'air'), 0.5); gag(whoosh(0.5), WS(10, 'spills'), 0.45)
# L11 shoves, other side, tick tock
gag(thunk(160, 0.2), WS(11, 'shoves'), 0.4); gag(whoosh(0.5), WS(11, 'spills'), 0.4); gag(tick(), WS(11, 'tick'), 0.55); gag(tick(), WS(11, 'tock'), 0.55)
# L12 hole in the top, falls straight
gag(ting(), WS(12, 'hole'), 0.4); gag(slide(False, 0.8), WS(12, 'straight'), 0.4)
# L13 lands on Pudding, best day
gag(splat(), WS(13, 'landed'), 0.55); place(sfx, sub(0.4, 48), WS(13, 'landed'), 0.4); gag(oink(), WS(13, 'pudding'), 0.5); gag(chew(1.0, 8), WS(13, 'first'), 0.4); gag(oink(), WS(13, 'life'), 0.4); button(LS(13) + 3.0, 'march', 0.9)
mixdown()
