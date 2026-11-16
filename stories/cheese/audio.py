# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'march', 1.0, 120)                   # the cheese party
bed(LS(3), LS(6) - 0.05, 'quirky', 0.9, 112)               # the gift, the birthday, gone in two hours
bed(LS(6), LS(9) - 0.05, 'tension', 0.85, 100)            # the smell, slippery carpet, repaint
bed(LS(9), TM['dur'], 'march', 1.0, 124)                   # banned, cheese party, loop
place(sfx, crowd(2.5, 'cheer'), 0.0, 0.35); place(sfx, chew(2.5, 6), 0.2, 0.35)
place(sfx, ting(), WS(0, 'andrew'), 0.3); place(sfx, boing(150, 0.7), WS(0, '1400'), 0.5); place(sfx, thunk(60, 0.4), WS(0, 'cheese'), 0.5)
place(sfx, whoosh(0.5), LS(1) - 0.15, 0.4); countup(WS(1, '10000') - 0.2, WS(1, '10000') + 0.5); place(sfx, crowd(2.0, 'cheer'), WS(1, 'mobbed'), 0.4); place(sfx, chew(1.5, 7), WS(1, 'tore'), 0.5)
place(sfx, whoosh(0.4), LS(2) - 0.15, 0.4); place(sfx, slide(True, 0.5), WS(2, 'four'), 0.35); place(sfx, slide(False, 0.5), WS(2, 'two'), 0.35)
place(sfx, whoosh(0.5), LS(3) - 0.15, 0.4); place(sfx, ting(), WS(3, 'new'), 0.3); place(sfx, bell(990), WS(3, 'gift'), 0.4)
place(sfx, whoosh(0.4), LS(4) - 0.15, 0.4); place(sfx, horn(0.8), WS(4, 'washington'), 0.3); place(sfx, ting(), WS(4, '1837'), 0.3); place(sfx, creak(0.8, 160), WS(4, 'served') - 0.2, 0.4); place(sfx, crowd(2.0, 'cheer'), WS(4, 'public'), 0.4)
place(sfx, whoosh(0.4), LS(5) - 0.15, 0.4); place(sfx, chew(1.2, 8), LS(5), 0.4)
for k in range(6): place(sfx, tick(), WS(5, 'two') + k * 0.12, 0.4)
place(sfx, gulp(), WS(5, 'gone'), 0.6); place(sfx, pop(), WS(5, 'gone') + 0.2, 0.3)
place(sfx, scratch(), LS(6) - 0.1, 0.45); place(sfx, sting(), WS(6, 'stayed'), 0.4); place(sfx, gloop(0.8), WS(6, 'stayed') + 0.2, 0.3)
place(sfx, whoosh(0.4), LS(7) - 0.15, 0.4); place(sfx, footsteps(0.8, 4, 600), LS(7), 0.25); place(sfx, slide(False, 0.6), WS(7, 'slippery') - 0.1, 0.5); place(sfx, bonk(320), WS(7, 'cheese'), 0.6)
place(sfx, whoosh(0.4), LS(8) - 0.15, 0.4); place(sfx, creak(0.7, 260), WS(8, 'air'), 0.4); place(sfx, leaves(0.8), WS(8, 'air') + 0.3, 0.2); place(sfx, scrape(0.7), WS(8, 'repaint'), 0.35)
place(sfx, whoosh(0.4), LS(9) - 0.15, 0.4); place(sfx, thunk(90, 0.3), WS(9, 'banned'), 0.8); place(sfx, bonk(420), WS(9, 'food'), 0.3)
place(sfx, whoosh(0.4), LS(10) - 0.15, 0.4); place(sfx, boing(220), WS(10, 'cheese'), 0.4); place(sfx, crowd(1.5, 'cheer'), WS(10, 'party'), 0.3)
mixdown()
