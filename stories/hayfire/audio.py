# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def crackle(t0, d, g=0.25):
    k = 0
    while k * 0.11 < d: place(sfx, hp_fast(noise(0.04), 2500) * env(int(0.04 * SR), 0.002, 0.03), t0 + k * 0.11 + 0.05 * ((k * 7) % 3), g * (0.5 + 0.5 * ((k * 5) % 3) / 2)); k += 1
bed(0, LS(2), 'tension', 1.1, 132)
bed(LS(2), LS(5), 'quirky', 1.0, 116)
bed(LS(5), LS(6), 'march', 0.9, 120)
bed(LS(6), LS(8) - 0.18, 'tension', 1.35, 150)
bed(LS(8), LS(9), 'dark', 0.6, 96)
bed(LS(9), LS(12), 'quirky', 0.85, 112)
bed(LS(12), D, 'march', 1.0, 128)
for fr in [56, 170, 229, 285, 339, 385, 437, 490, 541, 600, 653, 705, 766, 815, 872, 952, 1005, 1055, 1107, 1240]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [108, 892, 1177]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, leaves(D), 0, 0.02)
# L0 burning haystack, Edna's bucket, the sheep chewing
crackle(0, 3.6, 0.3); place(sfx, rumble(3.4), 0, 0.12); place(sfx, footsteps(1.8), 0.1, 0.3); gag(baa(), WS(0, 'sheep'), 0.5); place(sfx, chew(0.8, 6), WS(0, 'sheep') + 0.5, 0.3)
# L1 three fires, chewing
for k, w in enumerate(['three', 'weeks', 'pickles']): gag(ting() if k < 2 else bell(1200), WS(1, w), 0.35)
gag(chew(1.0, 8), WS(1, 'chewing'), 0.45)
# L2 the inspector
place(sfx, footsteps(1.6), LS(2), 0.3); gag(snore(0.5), WS(2, 'sniffed'), 0.35); gag(baa(), WS(2, 'sniffed') + 0.5, 0.35); gag(stamp(), WS(2, 'case'), 0.5); place(sfx, sub(0.4, 48), WS(2, 'case'), 0.4)
# L3 the coop, hens
gag(clink(2), WS(3, 'locked'), 0.45); gag(cluck(), WS(3, 'hens'), 0.45); place(sfx, cluck(), WS(3, 'hens') + 0.3, 0.35); place(sfx, cluck(), WS(3, 'consulted'), 0.4)
# L4 Pip raises her hand
gag(ting(), WS(4, 'raised'), 0.4); gag(drip(), WS(4, 'wet'), 0.45)
# L5 wet bait pile
gag(boing(220, 0.4), WS(5, 'burn'), 0.3)
for k in range(5): place(sfx, thunk(140, 0.15), WS(5, 'stacked') + k * 0.16, 0.3)
gag(drip(), WS(5, 'wet'), 0.35); gag(pop(), WS(5, 'bait'), 0.4)
# L6 steam like a kettle, toasting
gag(horn(0.8), WS(6, 'kettle'), 0.25); place(sfx, hum(1.5), WS(6, 'kettle'), 0.2); gag(pop(), WS(6, 'toasting'), 0.45); gag(ting(), WS(6, 'sandwich'), 0.35)
# L7 bursts into flames
gag(boom(1.5), WS(7, 'burst'), 0.55); place(sfx, sub(0.6, 40), WS(7, 'burst'), 0.55); crackle(WS(7, 'burst'), 3.0, 0.35); place(sfx, rumble(2.6), WS(7, 'flames'), 0.15); gag(baa(), WS(7, 'locked'), 0.4); place(sfx, cluck(), WS(7, 'coop'), 0.35)
# L8 question, riser
place(sfx, scratch(), LS(8) - 0.12, 0.3); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 buffet of bacteria
place(sfx, drop(), WS(9, 'nobody'), 0.5); gag(chew(0.8, 10), WS(9, 'buffet'), 0.4); countup(WS(9, 'billions') - 0.1, WS(9, 'bacteria') + 0.4, 0.25)
# L10 eat, heat, blanket
gag(gulp(), WS(10, 'eat'), 0.4); gag(hum(1.0), WS(10, 'heat'), 0.35); gag(whoosh(0.4), WS(10, 'blanket') - 0.2, 0.35); gag(thunk(120, 0.3), WS(10, 'blanket') + 0.1, 0.4)
# L11 hotter, lights itself
place(sfx, slide(True, 1.2), WS(11, 'hotter'), 0.35); gag(boom(0.8), WS(11, 'lights'), 0.45); place(sfx, sub(0.4, 46), WS(11, 'lights'), 0.4)
# L12 arrested, ate the evidence, case closed
gag(clink(3), WS(12, 'arrested'), 0.45); gag(chew(1.0, 8), WS(12, 'ate'), 0.45); gag(baa(), WS(12, 'evidence') + 0.3, 0.4); gag(stamp(), WS(12, 'closed'), 0.55); button(LS(12) + 3.6, 'march', 0.9)
mixdown()
