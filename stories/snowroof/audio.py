# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def wind(t0, d, g=0.3, cut=900): place(sfx, lp_fast(noise(d), cut) * env(int(d * SR), 0.4, 0.5), t0, g)
# music: quirky autumn -> tension through the storms (rising) -> hush before the reveal -> march for the payoff
bed(0, LS(4) - 0.2, 'quirky', 0.95, 126)
bed(LS(4) - 0.2, LS(5) - 0.1, 'tension', 0.9, 110)
bed(LS(5) - 0.1, LS(6) - 0.1, 'tension', 1.1, 124)
bed(LS(6) - 0.1, LS(7) - 0.2, 'tension', 1.35, 140)
bed(LS(8) - 0.1, LS(10) - 0.18, 'quirky', 0.8, 118)
bed(LS(10), D, 'march', 1.1, 128)
# L0: hammering, goat slides off twice
for k in range(5): place(sfx, thunk(260, 0.08, 0.2), 0.15 + k * 0.42, 0.35)
place(sfx, slide(False, 0.9), FR(4), 0.4); place(sfx, baa(), FR(18), 0.55); place(sfx, bonk(), FR(42), 0.45); place(sfx, sub(0.3, 60), FR(42), 0.4)
place(sfx, swish(), FR(50) - 0.1, 0.45); place(sfx, slide(False, 0.9), FR(56), 0.4); place(sfx, baa(), FR(70), 0.5); place(sfx, bonk(330), FR(96), 0.45)
# L1: Frostdal + gauge
place(sfx, swish(), FR(98) - 0.1, 0.45); place(sfx, swish(), FR(150) - 0.1, 0.4); place(sfx, ting(), WS(1, 'three'), 0.4); place(sfx, pop(), WS(1, 'three') + 0.05, 0.3)
# L2: Sven laughs
place(sfx, swish(), FR(198) - 0.1, 0.45); place(sfx, water(1.2), FR(200), 0.25); place(sfx, stamp(), WS(2, 'party'), 0.45); place(sfx, boing(), WS(2, 'party') + 0.3, 0.35)
place(sfx, swish(), FR(245) - 0.1, 0.4); place(sfx, baa(), FR(262), 0.45); place(sfx, thunk(260, 0.08, 0.2), FR(275), 0.3)
# L3: hot tub
place(sfx, swish(), FR(289) - 0.1, 0.45); place(sfx, bloop(300), WS(3, 'hot'), 0.4); place(sfx, water(1.5), WS(3, 'hot'), 0.3); place(sfx, swish(), FR(340) - 0.1, 0.4); place(sfx, gulp(), WS(3, 'soaked'), 0.4)
# mist wipe into winter
place(sfx, whoosh(1.0), FR(386), 0.5); wind(FR(395), FR(1000) - FR(395), 0.18)
# L4 storm one
place(sfx, sub(0.6, 45), WS(4, 'storms'), 0.4); place(sfx, pop(), WS(4, 'half'), 0.35); place(sfx, swish(), FR(450) - 0.1, 0.45); place(sfx, boing(260), WS(4, 'waved'), 0.3)
# L5 storm two, creak
place(sfx, swish(), FR(502) - 0.1, 0.45); wind(LS(5), 3.5, 0.3); place(sfx, pop(), WS(5, 'two') + 0.1, 0.35); place(sfx, swish(), FR(545) - 0.1, 0.4)
place(sfx, creak(0.8, 120), WS(5, 'creaked'), 0.6); place(sfx, hum(1.2), WS(5, 'creaked'), 0.3); place(sfx, swish(), FR(578) - 0.1, 0.4); place(sfx, ting(), WS(5, 'grinned'), 0.3)
# L6 storm three (hype), four men
place(sfx, swish(), FR(616) - 0.1, 0.5); wind(LS(6), 3.2, 0.55, 1400); place(sfx, thunk(70, 0.4), WS(6, 'wet'), 0.55); place(sfx, sub(0.6, 40), WS(6, 'wet'), 0.5)
place(sfx, swish(), FR(662) - 0.1, 0.45); 
for k in range(4): place(sfx, stomp(0.8), WS(6, 'four') + k * 0.12, 0.4)
place(sfx, pop(), WS(6, 'four'), 0.35); place(sfx, creak(0.7, 100), WS(6, 'men') + 0.2, 0.45)
# L7 [beat] sag + door jam
place(sfx, scratch(), LS(7) - 0.3, 0.3); place(sfx, creak(1.0, 90), WS(7, 'sagged') - 0.1, 0.7); place(sfx, boom(1.2), WS(7, 'sagged') + 0.15, 0.4); place(sfx, sub(0.8, 36), WS(7, 'sagged') + 0.15, 0.6)
place(sfx, swish(), FR(752) - 0.1, 0.45)
for k in range(4): place(sfx, thunk(150, 0.1, 0.4), WS(7, 'jammed') + k * 0.22, 0.45)
# L8 cutaway slide
place(sfx, whoosh(0.6), FR(788) - 0.15, 0.5); place(sfx, baa(), FR(805), 0.45); place(sfx, swish(), FR(836) - 0.1, 0.4); place(sfx, slide(False, 0.8), WS(8, 'can'), 0.5); place(sfx, boing(), WS(8, 'can') + 0.8, 0.35)
# L9 explainer
place(sfx, whoosh(0.6), FR(883) - 0.15, 0.45); place(sfx, bloop(180), WS(9, 'neither'), 0.3); place(sfx, ting(), WS(9, 'steep') - 0.2, 0.35); place(sfx, swish(), FR(940) - 0.1, 0.4); place(sfx, slide(False, 0.7), WS(9, 'slides'), 0.4)
place(sfx, hum(1.0), WS(9, 'heavy'), 0.25)
# L10 WHUMP (payoff): ~0.2 s hush before it (the bed above ends at LS(10) - 0.18)
place(sfx, swish(), FR(999) - 0.1, 0.4); place(sfx, boom(1.6), WS(10, 'whump') + 0.1, 0.8); place(sfx, sub(1.0, 34), WS(10, 'whump') + 0.1, 0.8); place(sfx, splash(0.9), WS(10, 'whump') + 0.2, 0.35); place(sfx, rumble(1.0), WS(10, 'whump') + 0.1, 0.4)
place(sfx, swish(), FR(1037) - 0.1, 0.4); place(sfx, gulp(), WS(10, 'dry'), 0.35); place(sfx, tweet(), WS(10, 'dry') + 0.3, 0.3)
# L11 Sven climbs out, begs
place(sfx, swish(), FR(1075) - 0.1, 0.45); place(sfx, creak(0.4, 220), WS(11, 'climbed') - 0.3, 0.4); place(sfx, thunk(90, 0.3), FR(1079 + 26), 0.5); place(sfx, sub(0.4, 50), FR(1079 + 26), 0.4)
place(sfx, swish(), FR(1120) - 0.1, 0.45); place(sfx, slide(False, 0.5), WS(11, 'begged'), 0.3)
# L12 party hat + goat
place(sfx, swish(), FR(1171) - 0.1, 0.45); place(sfx, pop(), WS(12, 'hat'), 0.4); place(sfx, boing(), WS(12, 'hat') + 0.1, 0.35); place(sfx, swish(), FR(1228) - 0.1, 0.4)
place(sfx, horn(0.5), WS(12, 'goat'), 0.3); place(sfx, baa(), WS(12, 'one') + 0.2, 0.6); place(sfx, ting(), WS(12, 'one'), 0.3)
mixdown()
