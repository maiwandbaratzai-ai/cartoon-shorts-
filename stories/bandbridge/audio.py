# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def boots(t0, t1, g=0.3, sp=0.5, ragged=False):
    k = 0
    while t0 + k * sp < t1: place(sfx, stomp(0.8), t0 + k * sp + (0.07 * ((k * 7) % 3) if ragged else 0), g); k += 1
def snare(t0, t1, g=0.25):
    k = 0
    while t0 + k * 0.25 < t1: place(music, drum('snare' if k % 2 else 'kick'), t0 + k * 0.25, g * (1 if k % 4 == 0 else 0.6)); k += 1
bed(0, LS(2), 'march', 1.1, 120)
bed(LS(2), LS(5), 'march', 0.9, 120); snare(LS(3), LS(5), 0.25)
bed(LS(5), LS(8) - 0.18, 'tension', 1.35, 150); snare(LS(5), LS(8) - 0.2, 0.3)
bed(LS(8), LS(9), 'dark', 0.6, 96)
bed(LS(9), LS(12), 'quirky', 0.85, 112)
bed(LS(12), D, 'quirky', 1.0, 100)
for fr in [60, 119, 262, 331, 380, 428, 490, 600, 640, 687, 750, 810, 860, 910, 1036, 1090, 1145, 1200, 1320]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [189, 954, 1247]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, water(D), 0, 0.05)
# L0 trampoline bridge
boots(0, LS(1), 0.35); place(sfx, creak(1.2), 0.2, 0.35); gag(boing(140, 0.6), WS(0, 'bounce'), 0.5); place(sfx, sub(0.5, 42), WS(0, 'bounce'), 0.45); gag(boing(200, 0.5), WS(0, 'trampoline'), 0.45)
# L1 the tuba goes higher
gag(slide(True, 0.6), WS(1, 'up'), 0.45); gag(horn(0.5), WS(1, 'higher'), 0.4); gag(slide(True, 0.4), WS(1, 'higher') + 0.1, 0.35)
# L2 the robot
gag(bloop(440), WS(2, 'leader'), 0.35); gag(ting(), 241 / 30, 0.45); place(sfx, bloop(660), WS(2, 'robot'), 0.3); gag(tick(), WS(2, 'perfect'), 0.4)
# L3 left right left, every boot at once
for w in ['left!', 'right!']: pass
boots(LS(3), LS(4), 0.4, 0.5); gag(thunk(90, 0.3), WS(3, 'same'), 0.5); place(sfx, sub(0.4, 44), WS(3, 'same'), 0.4)
# L4 Major demoted to cymbals
gag(quack(), WS(4, 'major'), 0.5); gag(slide(False, 0.6), WS(4, 'demoted'), 0.4); gag(clink(2), WS(4, 'cymbals'), 0.5)
# L5 hum, wobble, jelly
boots(LS(5), LS(6), 0.4, 0.5); gag(hum(1.0), WS(5, 'hummed'), 0.35); gag(creak(0.6), WS(5, 'wobbled'), 0.45); gag(boing(120, 0.8), WS(5, 'jelly'), 0.5); place(sfx, sub(0.5, 40), WS(5, 'jelly'), 0.5)
# L6 even more perfectly
boots(LS(6), LS(7), 0.45, 0.5); gag(stamp(), WS(6, 'perfectly'), 0.4); place(sfx, creak(1.4), WS(6, 'perfectly'), 0.35)
# L7 drummers into the river, flutes into a tree
gag(boing(160, 0.5), WS(7, 'flung'), 0.45); gag(splash(1.0), WS(7, 'river'), 0.5); place(sfx, splash(0.8), WS(7, 'river') + 0.25, 0.35); gag(leaves(0.8), WS(7, 'tree'), 0.4); gag(bonk(380), WS(7, 'tree') + 0.2, 0.45)
# L8 question + riser
place(sfx, scratch(), LS(8) - 0.12, 0.3); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 own bounce, swing
place(sfx, drop(), WS(9, 'every'), 0.5); gag(creak(0.5), WS(9, 'swing'), 0.4); gag(quack(), WS(9, 'swing') + 0.3, 0.35)
# L10 push at the right moment, higher
for w in ['push', 'right', 'again', 'higher']: gag(whoosh(0.4), WS(10, w), 0.35)
gag(quack(), WS(10, 'higher') + 0.2, 0.4)
# L11 a hundred boots, every step
boots(LS(11), LS(12) - 0.2, 0.45, 0.5); gag(thunk(80, 0.4), WS(11, 'every'), 0.5); place(sfx, sub(0.5, 40), WS(11, 'every'), 0.45)
# L12 Major leads, waddle
boots(LS(12), D, 0.25, 0.5, ragged=True); gag(quack(), WS(12, 'major'), 0.5); gag(clink(1), WS(12, 'nobody'), 0.35); gag(quack(), WS(12, 'waddle'), 0.5); button(LS(12) + 3.3, 'march', 0.9)
mixdown()
