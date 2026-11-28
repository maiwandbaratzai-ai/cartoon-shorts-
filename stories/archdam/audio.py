# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
bed(0, LS(1), 'tension', 1.2, 150)
bed(LS(1), LS(6), 'quirky', 0.9, 120)
bed(LS(6), LS(8), 'march', 0.9, 126)
bed(LS(8), LS(12) - 0.18, 'tension', 1.3, 156)
bed(LS(12), LS(13), 'dark', 0.6, 96)
bed(LS(13), LS(16), 'quirky', 0.85, 112)
bed(LS(16), D, 'march', 1.0, 132)
for fr in [50, 165, 240, 288, 325, 393, 458, 530, 607, 652, 697, 762, 808, 852, 910, 972, 1036, 1099, 1162, 1300, 1360, 1420, 1493, 1546, 1660, 1714, 1770, 1825]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [92, 1230, 1594]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 the thick dam bursts
place(sfx, boom(2.0), 0.0, 0.5); place(sfx, sub(1.0, 38), 0.0, 0.55); place(sfx, water(3.0), 0.0, 0.45); gag(stamp(), WS(0, 'burst'), 0.4)
# L1 bakery, school, gnomes
gag(bell(880), WS(1, 'bakery'), 0.3); gag(bell(660), WS(1, 'school'), 0.3); countup(WS(1, 'four'), WS(1, 'gnomes') + 0.3, 0.25)
# L2-L4 straight vs banana, hat in the lake
for k in range(4): place(sfx, thunk(160, 0.15), WS(2, 'built') + k * 0.25, 0.3)
gag(stamp(), WS(2, 'strong'), 0.45); gag(boing(220, 0.5), WS(3, 'banana'), 0.4); gag(whoosh(0.5), WS(4, 'hat'), 0.4); gag(splash(0.6), WS(4, 'lake'), 0.45)
# L5 Bramble moves in with a pillow
gag(squeak(), WS(5, 'bramble'), 0.4); gag(ting(), WS(5, 'one'), 0.35); gag(pop(), WS(5, 'pillow'), 0.4); place(sfx, snore(1.0), WS(5, 'pillow') + 0.4, 0.3)
# L6-L7 rain, ducks indoors
place(sfx, water(LS(12) - LS(6)), LS(6), 0.25); countup(WS(6, 'nine'), WS(6, 'days') + 0.4, 0.25); gag(slide(True, 0.8), WS(6, 'brim'), 0.4)
for k in range(3): gag(quack(), WS(7, 'ducks') + k * 0.3, 0.35)
gag(flip(), WS(7, 'indoors'), 0.35)
# L8-L9 bulge, logs bend
gag(creak(1.2, 100), WS(8, 'bulged'), 0.5); gag(boing(90, 0.8), WS(8, 'belly'), 0.4); for_k = 0
for k in range(5): place(sfx, thunk(200, 0.15), WS(9, 'propping') + k * 0.18, 0.3)
gag(creak(0.8, 150), WS(9, 'bent'), 0.5); place(sfx, sub(0.5, 44), WS(9, 'bent'), 0.4)
# L10 midnight pop, cow on a sofa
gag(snap(), WS(10, 'popped'), 0.6); place(sfx, boom(2.0), WS(10, 'popped'), 0.55); place(sfx, sub(1.0, 38), WS(10, 'popped'), 0.6); place(sfx, water(3.5), WS(10, 'popped') + 0.2, 0.5)
gag(moo(), WS(10, 'cow'), 0.5); gag(boing(200, 0.4), WS(10, 'sofa'), 0.35)
# L11 car honks
gag(horn(0.5), WS(11, 'honked'), 0.55); place(sfx, horn(0.3), WS(11, 'honked') + 0.6, 0.4)
# L12 not a creak; why?
place(sfx, scratch(), LS(12) - 0.12, 0.3); gag(tick(), WS(12, 'creak'), 0.4); place(sfx, riser(1.2), LS(13) - 1.25, 0.4)
# L13-L15 explainer
place(sfx, drop(), WS(13, 'curve'), 0.5); gag(whoosh(0.5), WS(13, 'sideways'), 0.4); gag(thunk(90, 0.3), WS(13, 'rock'), 0.5); place(sfx, sub(0.4, 46), WS(13, 'rock'), 0.4)
gag(flip(), WS(14, 'side'), 0.4); gag(clink(2), WS(14, 'tighter'), 0.45); gag(creak(0.6, 120), WS(15, 'bends'), 0.45); gag(snap(), WS(15, 'breaks'), 0.55)
# L16-L18 pool, strong-ish, Dam Engineer
gag(splash(0.6), WS(16, 'pool'), 0.4); gag(bell(1046), WS(16, 'main'), 0.35); gag(pop(), WS(17, 'strong'), 0.35); gag(squeak(), WS(18, 'bramble'), 0.4); gag(stamp(), WS(18, 'engineer'), 0.5)
button(LS(18) + 1.6, 'march', 0.9)
mixdown()
