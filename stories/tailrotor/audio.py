# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def chop(t0, t1, g=0.16, rate=0.11):   # rotor wop-wop
    k = 0
    while t0 + k * rate < t1: place(sfx, thunk(70, 0.08, 0.5), t0 + k * rate, g); k += 1
bed(0, LS(3), 'quirky', 0.95, 126)
bed(LS(3), LS(4), 'march', 0.9, 132)
bed(LS(4), LS(7) - 0.18, 'tension', 1.3, 156)
bed(LS(7), LS(8), 'dark', 0.6, 96)
bed(LS(8), LS(11), 'quirky', 0.85, 112)
bed(LS(11), D, 'march', 1.0, 132)
for fr in [56, 114, 162, 213, 262, 318, 365, 411, 480, 534, 592, 636, 690, 734, 840, 902, 956, 1012, 1070, 1172, 1206, 1262]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [768, 1116]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, leaves(D), 0, 0.02)
# L0 sawing, propeller drops, $40
for k in range(9): place(sfx, scrape(0.22), 0.1 + k * 0.26, 0.35)
gag(squeak(), WS(0, 'sawed'), 0.3); gag(clink(2), WS(0, 'off'), 0.55); place(sfx, thunk(120, 0.3), WS(0, 'off') + 0.35, 0.45); gag(stamp(), WS(0, 'forty'), 0.4); countup(WS(0, 'forty'), WS(0, 'bucks') + 0.3, 0.22)
gag(tweet(), 0.6, 0.35)
# L1 loading 300 pizzas
for k in range(5): place(sfx, thunk(200, 0.12, 0.3), WS(1, 'loaded') + k * 0.3, 0.3)
gag(ting(), WS(1, 'hundred'), 0.4); gag(bell(1046), WS(1, 'birthday'), 0.35)
# L2 cut the fat, propeller into scrap, pigeon buckles
gag(whoosh(0.4), WS(2, 'cut'), 0.4); gag(bonk(380), WS(2, 'said') + 0.3, 0.45); place(sfx, clink(3), WS(2, 'said') + 0.4, 0.4); gag(tweet(), WS(2, 'pigeon'), 0.45); gag(clink(1), WS(2, 'buckled'), 0.5); gag(gulp(), WS(2, 'up'), 0.35)
# L3 lift off, up, around
place(sfx, engine(3.0, 46), LS(3), 0.35); chop(LS(3) + 0.2, LS(8) - 0.3, 0.14, 0.12); gag(slide(True, 0.8), WS(3, 'up'), 0.4); gag(boing(200, 0.5), WS(3, 'around'), 0.45)
# L4 salad spinner
gag(screech(1.0), WS(4, 'around'), 0.35); gag(whoosh(0.5), WS(4, 'salad'), 0.4); gag(rattle(0.7), WS(4, 'spinner'), 0.35); gag(tweet(), WS(4, 'pepperoni'), 0.3)
# L5 pizzas like frisbees onto the limo
for k in range(10): place(sfx, swish(0.22), WS(5, 'flew') + k * 0.14, 0.22)
gag(whoosh(0.5), WS(5, 'frisbees'), 0.4)
for k in range(6): place(sfx, splat(), WS(5, 'onto') + k * 0.18, 0.28)
gag(horn(0.6), WS(5, 'limo'), 0.45)
# L6 Sal grabs the tail, spins
gag(stomp(0.8), WS(6, 'grabbed'), 0.5); gag(boing(150, 0.7), WS(6, 'pulled'), 0.45); gag(slide(True, 0.6), WS(6, 'spinning'), 0.4); place(sfx, whoosh(0.4), WS(6, 'spinning') + 0.4, 0.35)
# L7 question + riser
place(sfx, scratch(), LS(7) - 0.12, 0.3); gag(tweet(), WS(7, 'tiny'), 0.3); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 explainer: blades one way, body the other
place(sfx, drop(), WS(8, 'push'), 0.5); place(sfx, hum(3.4), LS(8), 0.18); gag(whoosh(0.5), WS(8, 'blades'), 0.4); gag(boom(0.8), WS(8, 'shove'), 0.45); place(sfx, sub(0.5, 44), WS(8, 'shove'), 0.45); gag(slide(False, 0.6), WS(8, 'other'), 0.4)
# L9 office chair
gag(creak(0.5, 160), WS(9, 'chair'), 0.4); gag(swish(0.3), WS(9, 'swing'), 0.45); gag(boing(240, 0.4), WS(9, 'right'), 0.35); gag(creak(0.6, 120), WS(9, 'turns'), 0.45); gag(ting(), WS(9, 'left'), 0.35)
# L10 tail pushes sideways, spin cancelled
gag(whoosh(0.4), WS(10, 'pushes'), 0.4); gag(pop(), WS(10, 'sideways'), 0.4); gag(stamp(), WS(10, 'cancel'), 0.5)
# L11 whisper, tape
gag(pop(), WS(11, 'whispered'), 0.3); gag(boing(120, 0.6), WS(11, 'dizzy'), 0.4); for_k = [place(sfx, rattle(0.3), WS(11, 'gluing') + k * 0.3, 0.3) for k in range(2)]
# L12 Pepper flies the pizza, tip
gag(tweet(), WS(12, 'pepper'), 0.45); place(sfx, whoosh(0.6), WS(12, 'flew'), 0.35); gag(thunk(160, 0.2), WS(12, 'himself'), 0.35); gag(clink(2), WS(12, 'forty'), 0.45); gag(ting(), WS(12, 'tip'), 0.5); place(sfx, tweet(), WS(12, 'tip') + 0.5, 0.35)
button(LS(12) + 2.9, 'march', 0.9)
mixdown()
