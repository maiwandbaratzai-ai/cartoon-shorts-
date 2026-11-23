# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def filing(t0, d, g=0.25):
    for k in range(int(d / 0.17)): place(sfx, scrape(0.12), t0 + k * 0.17, g)
# music: sneaky night -> market -> rising tension -> hush -> quirky explainer -> march finale
bed(0, LS(3) - 0.2, 'tension', 0.75, 104)
bed(LS(3) - 0.1, LS(5), 'quirky', 0.95, 122)
bed(LS(5), LS(6), 'quirky', 1.1, 132)
bed(LS(6), LS(7) + 0.4, 'tension', 1.35, 148)
bed(LS(8) - 0.1, LS(9) - 0.2, 'quirky', 0.85, 112)
bed(LS(9), LS(11) - 0.18, 'quirky', 0.9, 118)
bed(LS(11), D, 'march', 1.1, 128)
for fr in [50, 101, 150, 220, 350, 423, 485, 551, 615, 690, 735, 777, 905, 964, 1010, 1105, 1155, 1195, 1290]: place(sfx, swish(), FR(fr) - 0.1, 0.4)
for fr in [286, 842, 1046, 1221]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0-2 the night haircut
filing(0.1, 4.8, 0.22); place(sfx, ting(), WS(0, 'haircut'), 0.35); place(sfx, footsteps(2.0, 4, 500), WS(1, 'caught') - 0.4, 0.35)
place(sfx, meow(), WS(1, 'caught'), 0.45); place(sfx, gulp(), WS(1, 'moat'), 0.4); place(sfx, stamp(), WS(1, 'forty'), 0.3)
for k in range(10): place(sfx, ting(), WS(2, 'dust') + k * 0.12, 0.08)
place(sfx, pop(), WS(2, 'pickles'), 0.35)
# L3 market
place(sfx, bell(990), LS(3) + 0.1, 0.25); place(sfx, slide(False, 0.6), WS(3, 'shrunk'), 0.35); place(sfx, ting(), WS(3, 'two'), 0.3); place(sfx, bonk(), WS(3, 'button'), 0.4)
# L4 crown, ears, nose
for w in ['crown', 'ears', 'nose']: place(sfx, pop(), WS(4, w), 0.45); place(sfx, boing(240), WS(4, w) + 0.1, 0.25)
# L5 fix
place(sfx, horn(0.7), WS(5, 'fix'), 0.3); place(sfx, slide(True, 0.6), WS(5, 'big'), 0.35); place(sfx, stomp(0.8), WS(5, 'bought'), 0.4); place(sfx, thunk(90, 0.3), WS(5, 'files'), 0.45); place(sfx, sub(0.5, 45), WS(5, 'files'), 0.4)
# L6 plates + stars
place(sfx, thunk(70, 0.4), WS(6, 'plates'), 0.5); place(sfx, sub(0.6, 40), WS(6, 'plates'), 0.5); place(sfx, bell(1320), WS(6, 'stars'), 0.35); place(sfx, bell(1760), WS(6, 'stars') + 0.1, 0.25)
# L7 re-hook
place(sfx, scratch(), LS(7) - 0.2, 0.3); place(sfx, bloop(180), WS(7, 'see'), 0.35)
# L8 the press
place(sfx, creak(0.8, 120), WS(8, 'mina'), 0.4); place(sfx, thunk(60, 0.5), WS(8, 'pressed'), 0.6); place(sfx, sub(0.8, 36), WS(8, 'pressed'), 0.6); place(sfx, ting(), WS(8, 'lines'), 0.4)
# L9 shave -> bald
filing(WS(9, 'shave'), 0.8, 0.3); place(sfx, slide(False, 0.5), WS(9, 'vanish'), 0.35); place(sfx, sting(), WS(9, 'bald'), 0.4)
# L10 cake
place(sfx, bloop(300), WS(10, 'cake'), 0.35); place(sfx, gulp(), WS(10, 'slice'), 0.35); place(sfx, boing(200), WS(10, 'notices'), 0.3)
# L11 whistle + guards
place(sfx, scrape(0.4), WS(11, 'felt'), 0.3); place(sfx, horn(0.5), WS(11, 'whistle'), 0.45); place(sfx, footsteps(1.2, 11, 600), FR(1195), 0.4); place(sfx, stamp(), WS(11, 'whistle') + 0.3, 0.4)
# L12 sheep
place(sfx, baa(), FR(1240), 0.45); place(sfx, baa(), WS(12, 'sheep') + 0.3, 0.5); place(sfx, chew(1.2), FR(1250), 0.15)
for k in range(6): place(sfx, snap(), FR(1240) + k * 0.25, 0.15)
place(sfx, baa(), FR(1325), 0.35)
mixdown()
