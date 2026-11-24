# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def crunch(t0, d, g=0.25, rate=3.0):
    for k in range(int(d * rate)): place(sfx, lp_fast(noise(0.12), 1800) * env(int(0.12 * SR), 0.01, 0.1), t0 + k / rate, g)
def wind(t0, d, g=0.15): place(sfx, lp_fast(noise(d), 600) * env(int(d * SR), 0.8, 0.8), t0, g)
wind(0, D, 0.12)
bed(0, LS(3), 'quirky', 0.95, 122)
bed(LS(3), LS(6), 'quirky', 1.05, 134)
bed(LS(6), LS(8) - 0.2, 'tension', 1.2, 148)
bed(LS(8), LS(9) - 0.18, 'quirky', 0.8, 112)
bed(LS(9), LS(11), 'dark', 0.7, 100)
bed(LS(11), D, 'march', 1.1, 128)
for fr in [50, 105, 145, 187, 245, 314, 386, 440, 495, 525, 557, 610, 668, 715, 770, 880, 945, 1010, 1135, 1186, 1250, 1300]: place(sfx, swish(), FR(fr) - 0.1, 0.35)
for fr in [814, 1076]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 sinking
place(sfx, slide(False, 1.6), 0.1, 0.4); crunch(0.0, 1.0, 0.3, 5); gag(boing(110, 0.5), WS(0, 'hat'), 0.4); place(sfx, sub(0.4, 50), WS(0, 'hat'), 0.35)
# L1 bet
place(sfx, stamp(), WS(1, 'bet'), 0.4); gag(bell(1320), WS(1, 'carrot'), 0.35)
# L2 rackets
place(sfx, flip(), WS(2, 'strapped'), 0.35); place(sfx, ting(), WS(2, 'tennis'), 0.4); place(sfx, ting(), WS(2, 'tennis') + 0.15, 0.3); place(sfx, scratch(), WS(2, 'why') - 0.2, 0.25)
# L3 climbs out, easy peasy
crunch(LS(3), 1.2, 0.3, 5); gag(boing(300, 0.4), WS(3, 'easy'), 0.3)
# L4 tunnel + pop up under the rabbit
crunch(WS(4, 'ran'), 2.4, 0.35, 10); place(sfx, rumble(2.0), WS(4, 'ran'), 0.3)
gag(pop(), WS(4, 'popped'), 0.6); place(sfx, thunk(120, 0.2), WS(4, 'popped'), 0.4); place(sfx, squeak(), WS(4, 'clover'), 0.5)
# L5 Clover wants the cake
place(sfx, squeak(), WS(5, 'wanted'), 0.35); gag(bell(990), WS(5, 'carrot'), 0.3); place(sfx, chew(0.6), WS(5, 'carrot') + 0.4, 0.25)
# L6 pogo
gag(boing(200, 0.8), WS(6, 'bounce'), 0.5); place(sfx, boing(160, 0.6), WS(6, 'pogo'), 0.3); gag(thunk(90, 0.3), WS(6, 'stuck'), 0.5); place(sfx, sub(0.5, 45), WS(6, 'stuck'), 0.45); place(sfx, crunch and slide(False, 0.5), WS(6, 'stuck') - 0.3, 0.3)
# L7 sniff
for k in range(4): place(sfx, hp_fast(noise(0.08), 3000) * env(int(0.08 * SR), 0.01, 0.06), WS(7, 'sniffed') + k * 0.12, 0.3)
gag(squeak(), WS(7, 'hopefully'), 0.35)
# L8 Tess strolls
crunch(LS(8), 3.2, 0.18, 2.4); place(sfx, tweet(), LS(8) + 0.5, 0.25); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9-10 explainer
place(sfx, drop(), WS(9, 'pushed'), 0.55); place(sfx, slide(False, 0.6), WS(9, 'tiny'), 0.35); gag(gloop(0.9), WS(9, 'pudding'), 0.5)
for k in range(8): place(sfx, tick(), WS(10, 'spread') + k * 0.07, 0.3)
place(sfx, ting(), WS(10, 'little'), 0.4)
# L11 rabbit feet
place(sfx, sting(), WS(11, 'born'), 0.3); gag(pop(), WS(11, 'feet'), 0.45)
for k in range(6): place(sfx, thunk(260, 0.08, 0.1), LS(11) + 1.2 + k * 0.25, 0.25)
# L12 ate the cake
place(sfx, bell(1320), WS(12, 'reached'), 0.3); gag(chew(1.4), WS(12, 'ate'), 0.5); place(sfx, squeak(), WS(12, 'easy'), 0.35)
button(WS(12, 'easy') + 0.4, 'march', 0.9)
mixdown()
