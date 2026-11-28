# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
bed(0, LS(3), 'march', 1.0, 132)
bed(LS(3), LS(5), 'quirky', 0.9, 120)
bed(LS(5), LS(7) - 0.18, 'tension', 1.3, 156)
bed(LS(7), LS(8), 'dark', 0.6, 96)
bed(LS(8), LS(10), 'quirky', 0.85, 112)
bed(LS(10), LS(12), 'tension', 1.1, 150)
bed(LS(12), D, 'march', 1.0, 134)
for fr in [48, 100, 153, 218, 280, 350, 400, 455, 500, 548, 600, 661, 712, 759, 890, 952, 1000, 1088, 1123, 1175, 1231, 1272]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [822, 1040]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, engine(FR(822), 34), 0, 0.3); place(sfx, engine(D - FR(1046), 34), FR(1046), 0.3); place(sfx, leaves(D), 0, 0.02)
# L0 glowing brakes, waves off the ramp
place(sfx, screech(1.2), 0.1, 0.25); gag(ting(), WS(0, 'toasters'), 0.4); gag(pop(), WS(0, 'toasters') + 0.3, 0.3); gag(whoosh(0.5), WS(0, 'waved'), 0.4); gag(horn(0.5), WS(0, 'ramp'), 0.4)
# L1 forty tons, pig drooling
gag(thunk(70, 0.4), WS(1, 'forty'), 0.5); place(sfx, sub(0.5, 42), WS(1, 'forty'), 0.45); gag(oink(), WS(1, 'pickles'), 0.45); gag(gloop(0.4), WS(1, 'drooling'), 0.35)
# L2 no sandbox for Hank
gag(stamp(), WS(2, 'sandbox'), 0.45); gag(horn(0.4), WS(2, 'told'), 0.3); gag(whoosh(0.5), WS(2, 'flew'), 0.4)
# L3 warm, toasty, glowing, smoking
gag(tick(), WS(3, 'warm'), 0.4); gag(ting(), WS(3, 'toasty'), 0.4); gag(hum(0.6), WS(3, 'glowing'), 0.4); gag(whoosh(0.4), WS(3, 'smoking'), 0.35)
# L4 coffee on the brakes, steam
gag(water(0.8), WS(4, 'poured'), 0.4); gag(splat(), WS(4, 'coffee') + 0.4, 0.35); gag(whoosh(1.0), WS(4, 'steaming'), 0.45); place(sfx, hum(0.8), WS(4, 'steaming'), 0.2)
# L5 whoopee cushion pedal, no brakes
gag(slide(False, 0.8), WS(5, 'sank'), 0.45); gag(boing(90, 0.8), WS(5, 'whoopee'), 0.5); gag(boom(1.0), WS(5, 'brakes'), 0.45); place(sfx, sub(0.6, 40), WS(5, 'brakes'), 0.5)
# L6 one ramp left
gag(bell(660), WS(6, 'ramp'), 0.35); gag(stamp(), WS(6, 'sandbox'), 0.45)
# L7 question + riser
place(sfx, scratch(), LS(7) - 0.12, 0.3); gag(thunk(150, 0.2), WS(7, 'bottom'), 0.35); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 rubbing makes heat
place(sfx, drop(), WS(8, 'brakes'), 0.5); gag(scrape(1.2), WS(8, 'rubbing'), 0.45); gag(hum(1.2), WS(8, 'heat'), 0.35); countup(WS(8, 'eleven'), WS(8, 'eleven') + 0.8, 0.25)
# L9 slippery like wet soap
gag(slide(True, 0.5), WS(9, 'slippery'), 0.4); gag(bloop(300), WS(9, 'grabbing'), 0.35); gag(boing(320, 0.5), WS(9, 'soap'), 0.5); place(sfx, whoosh(0.4), WS(9, 'soap') + 0.2, 0.35)
# L10 Junie yanks the wheel into the sandbox
gag(screech(1.0), WS(10, 'yanked'), 0.5); gag(whoosh(0.5), WS(10, 'straight'), 0.35); place(sfx, rumble(3.0), WS(10, 'sandbox'), 0.45); place(sfx, crash(1.0), WS(10, 'sandbox') + 0.2, 0.35)
# L11 gravel swallows the wheels, ball pit
gag(stomp(1.0), WS(11, 'swallows'), 0.5); place(sfx, sub(0.6, 40), WS(11, 'swallows'), 0.5); gag(rattle(0.8), WS(11, 'soaks'), 0.35)
for k in range(6): place(sfx, bonk(260 + k * 40), WS(11, 'ball') + k * 0.12, 0.25)
# L12 first sandbox, forty tons of melon
gag(ting(), WS(12, 'sandbox'), 0.4); gag(oink(), WS(12, 'pickles'), 0.5); gag(chew(1.2, 6), WS(12, 'forty'), 0.45); place(sfx, oink(), WS(12, 'melon') + 0.5, 0.35)
button(LS(12) + 2.9, 'march', 0.9)
mixdown()
