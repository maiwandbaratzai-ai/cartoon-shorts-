# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def grind(t0, d, g=0.3): place(sfx, hp_fast(noise(d), 2500) * env(int(d * SR), 0.05, 0.3), t0, g)
# music: jaunty -> sticky heat -> chaos -> explainer -> back to black
bed(0, LS(4), 'quirky', 0.95, 126)
bed(LS(4), LS(6), 'quirky', 1.05, 110)
bed(LS(6), LS(8) - 0.2, 'tension', 1.3, 150)
bed(LS(8), LS(9) - 0.18, 'dark', 0.7, 96)
bed(LS(9), LS(11), 'quirky', 0.85, 116)
bed(LS(11), D, 'march', 1.1, 126)
for fr in [60, 116, 150, 212, 260, 303, 338, 389, 440, 518, 565, 613, 660, 705, 762, 810, 865, 975, 1046, 1100, 1229, 1295]: place(sfx, swish(), FR(fr) - 0.1, 0.35)
for fr in [897, 1147]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 pancake tires scraping in
grind(0, 2.4, 0.35); place(sfx, engine(2.4, 45), 0, 0.25); place(sfx, thunk(80, 0.3), FR(70), 0.4); place(sfx, sub(0.4, 50), FR(70), 0.4)
gag(boing(120, 0.6), WS(0, 'pancakes'), 0.5)
# L1 complaint box
place(sfx, flip(), WS(1, 'complaint'), 0.45); gag(bonk(), WS(1, 'boring'), 0.35); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.2)
# L2 say no more, oven
gag(sting(), WS(2, 'say'), 0.3); place(sfx, creak(0.5, 200), WS(2, 'baked') - 0.2, 0.3); place(sfx, bell(1320), WS(2, 'baked') + 0.2, 0.4)
for k in range(3): place(sfx, boing(300 + k * 40, 0.3), WS(2, 'pink') + k * 0.17, 0.25)
# L3 cupcakes, Biscuit
for k in range(4): place(sfx, pop(), WS(3, 'cupcakes') + k * 0.08, 0.2)
place(sfx, bark(), WS(3, 'biscuit'), 0.55); place(sfx, slide(True, 0.5), WS(3, 'wanted'), 0.3)
# L4 heat + gum
place(sfx, hum(2.5), LS(4), 0.25); place(sfx, ting(), WS(4, '104'), 0.4); gag(gloop(1.0), WS(4, 'soft'), 0.5); gag(slide(False, 0.7), WS(4, 'gum'), 0.4)
place(sfx, bark(), WS(4, 'gum') + 0.7, 0.35)
# L5 Ortiz drives off, pink stripe
place(sfx, engine(2.8, 55), LS(5), 0.3); place(sfx, slide(True, 1.4), WS(5, 'stripe') - 0.3, 0.3); gag(bell(990), WS(5, 'town'), 0.35)
# L6 complaint two, umbrellas
gag(bonk(380), WS(6, 'melting'), 0.35); gag(sting(), WS(6, 'say'), 0.3)
for k in range(4): place(sfx, pop(), WS(6, 'umbrella') - 0.1 + k * 0.1, 0.3)
# L7 popping mints, sparks on rims
for k in range(3): gag(thunk(200, 0.15, 0.3), WS(7, 'popped') + k * 0.2, 0.5); 
for k in range(3): place(sfx, pop(), WS(7, 'popped') + k * 0.2, 0.4)
place(sfx, bark(), WS(7, 'popped') + 0.7, 0.4)
grind(LS(7) + 1.4, 2.0, 0.45); place(sfx, screech(0.9), WS(7, 'rims'), 0.3); place(sfx, engine(2.0, 50), LS(7) + 1.3, 0.3)
# L8 question -> riser into the explanation
place(sfx, riser(1.2), LS(9) - 1.25, 0.45)
place(sfx, drop(), WS(9, 'soot'), 0.6)
for k in range(5): place(sfx, tick(), WS(9, 'specks') + k * 0.08, 0.3)
place(sfx, stamp(), WS(9, 'tougher'), 0.35); gag(boing(220, 0.5), WS(9, 'gummy'), 0.45); gag(clink(2), WS(9, 'armor'), 0.5)
# L10 sun + sunscreen
place(sfx, hum(1.5), LS(10), 0.2); place(sfx, gloop(0.8), WS(10, 'cooks'), 0.35); gag(pop(), WS(10, 'sunscreen'), 0.5); place(sfx, ting(), WS(10, 'sunscreen') + 0.2, 0.4)
# L11-12 back to black, last complaint, dog snoring in the spare
place(sfx, stamp(), WS(11, 'back'), 0.45); place(sfx, footsteps(1.6, 4, 500), LS(11), 0.25); place(sfx, scratch(), WS(11, 'last') - 0.1, 0.3)
place(sfx, snore(1.1), WS(12, 'sleeping'), 0.45); place(sfx, snore(1.1), WS(12, 'spare') + 0.5, 0.35); place(sfx, bark(), WS(12, 'said') + 0.9, 0.25)
button(WS(12, 'said') + 0.5, 'march', 0.9)
mixdown()
