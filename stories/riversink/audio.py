# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def sneaky(t0, t1, g=1.0):   # tiptoe heist pizzicato
    notes = [55, 58, 62, 61, 60, 58, 57, 60, 55, 62, 67, 62]; bt = 0.25; k = 0
    while t0 + k * bt < t1: place(music, pizz(midi(notes[k % len(notes)])), t0 + k * bt, 0.32 * g); k += 1
def glug(t0, d, g=0.3):
    k = 0
    while k * 0.45 < d: place(sfx, bloop(140 + (k % 3) * 40), t0 + k * 0.45, g); k += 1
bed(0, LS(1), 'tension', 1.1, 132)
sneaky(LS(1), LS(6)); bed(LS(1), LS(6), 'quirky', 0.5, 120)
bed(LS(6), LS(10) - 0.18, 'tension', 1.35, 150)
bed(LS(10), LS(11), 'dark', 0.6, 96)
bed(LS(11), LS(14), 'quirky', 0.85, 112)
sneaky(LS(14), D, 1.1); bed(LS(14), D, 'march', 0.8, 124)
for fr in [50, 160, 223, 280, 333, 385, 439, 490, 547, 610, 672, 740, 790, 832, 870, 908, 970, 1030, 1090, 1148, 1290, 1349, 1420, 1529, 1700, 1771]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [1208, 1628]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, water(D), 0, 0.08)
# L0 sinking in a river
glug(0, 3.0, 0.3); gag(gulp(), WS(0, 'sank'), 0.5); place(sfx, sub(0.5, 42), WS(0, 'sank'), 0.4); gag(bloop(110), WS(0, 'river'), 0.45)
# L1 two tons of gold under frozen fish
gag(clink(3), WS(1, 'gold'), 0.5); gag(ting(), WS(1, 'frozen'), 0.35); place(sfx, gull(), WS(1, 'fish'), 0.3)
# L2 loaded to the brim
for k in range(4): place(sfx, thunk(150, 0.15), WS(2, 'loaded') + k * 0.18, 0.3)
gag(creak(0.6), WS(2, 'brim'), 0.4); gag(clink(2), WS(2, 'money'), 0.45)
# L3 Sir Whiskers, dry paws
gag(meow(), WS(3, 'cat'), 0.5); gag(ting(), WS(3, 'paws'), 0.35)
# L4 waves lick the deck
gag(splash(0.6), WS(4, 'licked'), 0.4); gag(boing(240, 0.3), WS(4, 'floated'), 0.3)
# L5 the plan, pickle factory
gag(flip(), WS(5, 'plan'), 0.4); gag(horn(0.5), WS(5, 'mudd'), 0.3); gag(pop(), WS(5, 'pickle'), 0.4)
# L6 leaves the salty sea, sinks slowly
gag(scratch(), WS(6, 'moment'), 0.35); glug(WS(6, 'sinking'), 4.0, 0.3); gag(slide(False, 1.2), WS(6, 'slowly'), 0.4); gag(meow(), WS(6, 'mind'), 0.35)
# L7 deck, fish, hat
gag(splash(0.5), WS(7, 'deck'), 0.45); gag(splash(0.5), WS(7, 'fish'), 0.45); gag(gulp(), WS(7, 'hat'), 0.5); place(sfx, sub(0.4, 46), WS(7, 'hat'), 0.4)
# L8 throws the fish, fish swim home
for k in range(4): place(sfx, splash(0.4), WS(8, 'overboard') + k * 0.22, 0.3)
gag(clink(2), WS(8, 'money'), 0.4); gag(bloop(330), WS(8, 'thawed'), 0.4); gag(boing(300, 0.4), WS(8, 'swam'), 0.4)
# L9 police with lemonade
gag(gulp(), WS(9, 'lemonade'), 0.45); place(sfx, ting(), WS(9, 'lemonade') + 0.5, 0.25); glug(LS(9), 3.0, 0.2)
# L10 question + riser
place(sfx, scratch(), LS(10) - 0.12, 0.3); place(sfx, riser(1.2), LS(11) - 1.25, 0.4)
# L11 salt, heavier, pushes up
place(sfx, drop(), WS(11, 'sea'), 0.5); gag(rattle(0.8), WS(11, 'salt'), 0.4); gag(thunk(120, 0.3), WS(11, 'heavier'), 0.4); gag(slide(True, 0.5), WS(11, 'pushes'), 0.4)
# L12 lighter, deeper, finishes the job
gag(slide(False, 0.6), WS(12, 'deeper'), 0.4); gag(gulp(), WS(12, 'finishes'), 0.45); gag(bonk(300), WS(12, 'job'), 0.4)
# L13 load line marks
gag(ting(), WS(13, 'line'), 0.4); gag(bell(880), WS(13, 'sea'), 0.3); gag(bell(1320), WS(13, 'higher'), 0.35)
# L14 gold to the bank, very small cell
gag(clink(3), WS(14, 'bank'), 0.45); gag(stamp(), WS(14, 'money'), 0.35); gag(clink(1), WS(14, 'cell'), 0.5); place(sfx, sub(0.4, 48), WS(14, 'cell'), 0.4)
# L15 Sir Whiskers rides home dry
place(sfx, footsteps(2.5), LS(15), 0.3); gag(meow(), WS(15, 'dry'), 0.5); place(sfx, meow(), WS(15, 'hat.') if False else LS(15) + 2.4, 0.35); button(LS(15) + 2.9, 'march', 0.9)
mixdown()
