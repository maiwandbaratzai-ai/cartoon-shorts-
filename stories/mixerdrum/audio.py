# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def churn(t0, t1, g=0.12):   # the drum turning: a low rhythmic grind
    k = 0
    while t0 + k * 0.6 < t1: place(sfx, rumble(0.6), t0 + k * 0.6, g); k += 1
bed(0, LS(1), 'march', 1.0, 138)
bed(LS(1), LS(4), 'quirky', 0.9, 120)
bed(LS(4), LS(5), 'quirky', 0.7, 96)
bed(LS(5), LS(7) - 0.18, 'tension', 1.3, 150)
bed(LS(7), LS(8), 'dark', 0.6, 96)
bed(LS(8), LS(10), 'quirky', 0.85, 112)
bed(LS(10), D, 'march', 1.0, 132)
for fr in [52, 160, 215, 258, 305, 358, 411, 466, 520, 578, 633, 682, 736, 850, 930, 975, 1058, 1096, 1148, 1206, 1262]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [100, 776, 1010]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, leaves(D), 0, 0.02)
# L0 the gumball rolls, builders run, Bruno jogs on top
place(sfx, rumble(3.4), 0, 0.35); place(sfx, sub(1.5, 40), 0, 0.4); place(sfx, footsteps(3.0), 0.1, 0.3); gag(bark(), 0.8, 0.45); gag(thunk(80, 0.4), WS(0, 'piece'), 0.5); place(sfx, sub(0.5, 44), WS(0, 'piece'), 0.5)
# L1 the bet
churn(LS(1), LS(3) + 0.8); gag(bark(), WS(1, 'dolores') - 0.3, 0.3); gag(stamp(), WS(1, 'donuts'), 0.4); gag(chew(0.5, 6), WS(1, 'donuts') + 0.4, 0.3)
# L2 catchphrase, flipped off
gag(clink(2), WS(2, 'flipped'), 0.5); gag(slide(False, 0.7), WS(2, 'off'), 0.4)
# L3 Bruno slides off
gag(slide(False, 0.5), WS(3, 'slid'), 0.45); gag(bonk(300), WS(3, 'off') + 0.2, 0.45); place(sfx, bark(), WS(3, 'off') + 0.7, 0.35); place(sfx, engine(2.2), LS(3) + 1.6, 0.25)
# L4 ducklings, two hours
for k in range(5): gag(quack(), WS(4, 'eleven') + k * 0.28, 0.32)
gag(tick(), WS(4, 'slowly'), 0.4); countup(WS(4, 'two') - 0.1, WS(4, 'hours') + 0.4, 0.25); place(sfx, snore(1.0), WS(4, 'hours') + 0.4, 0.25)
# L5 soup -> bowling ball
gag(gloop(0.5), WS(5, 'soup'), 0.45); gag(gloop(0.4), WS(5, 'oatmeal'), 0.4); gag(splat(), WS(5, 'peanut'), 0.4); gag(thunk(70, 0.4), WS(5, 'bowling'), 0.55); place(sfx, sub(0.5, 42), WS(5, 'bowling'), 0.5)
# L6 hits the switch, truck spins
gag(clink(1), WS(6, 'hit'), 0.5); gag(creak(0.6), WS(6, 'stayed'), 0.4); gag(screech(1.4), WS(6, 'spun'), 0.5); place(sfx, rumble(1.6), WS(6, 'spun'), 0.4)
for k in range(3): place(sfx, quack(), WS(6, 'spun') + 0.4 + k * 0.4, 0.3)
# L7 question + knock + riser
place(sfx, scratch(), LS(7) - 0.12, 0.3); gag(thunk(160, 0.2), WS(7, 'stone'), 0.45); place(sfx, thunk(160, 0.2), WS(7, 'stone') + 0.25, 0.35); place(sfx, riser(1.2), LS(8) - 1.25, 0.4)
# L8 grab hands, grow into rock, underwater
place(sfx, drop(), WS(8, 'concrete'), 0.5); gag(bloop(260), WS(8, 'grab'), 0.4); gag(bloop(330), WS(8, 'hands'), 0.35); gag(ting(), WS(8, 'rock'), 0.45); gag(splash(0.6), WS(8, 'underwater'), 0.35)
# L9 smoothie
churn(LS(9), LS(10) - 0.2, 0.18); gag(gulp(), WS(9, 'smoothie'), 0.45); gag(boing(240, 0.4), WS(9, 'lock'), 0.35)
# L10 nine-ton gumball drops out
gag(creak(0.7), WS(10, 'stop'), 0.4); place(sfx, crash(1.0), WS(10, 'stop') + 0.4, 0.45); gag(boom(1.2), WS(10, 'gumball') - 0.2, 0.5); place(sfx, sub(0.6, 40), WS(10, 'gumball') - 0.2, 0.55); place(sfx, rumble(2.4), WS(10, 'gumball'), 0.35)
# L11 whisper, crane
gag(pop(), WS(11, 'whispered'), 0.3); gag(engine(1.2), WS(11, 'crane'), 0.4); place(sfx, creak(1.0), WS(11, 'crane') + 0.4, 0.35)
# L12 donuts, jogging ball
gag(chew(0.7, 6), WS(12, 'donuts'), 0.45); gag(bark(), WS(12, 'bruno'), 0.4); place(sfx, bark(), WS(12, 'jogging') + 0.5, 0.3); place(sfx, footsteps(1.5), WS(12, 'jogging'), 0.3); button(LS(12) + 2.9, 'march', 0.9)
mixdown()
