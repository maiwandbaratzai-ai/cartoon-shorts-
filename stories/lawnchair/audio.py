# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'quirky', 1.0, 128)                     # sky + backyard plan
bed(LS(3), LS(5) - 0.05, 'tension', 1.1, 168)                # rope snaps, he rockets up
bed(LS(5), LS(8) - 0.05, 'march', 0.9, 120)                  # pilots, pellet gun, power lines
bed(LS(8), TM['dur'], 'quirky', 0.9, 128)                    # the fine + the quote, runs to the cut for the loop
place(sfx, leaves(LS(1)), 0, 0.35)                           # wind up high
place(sfx, engine(2.0, 60), 0.6, 0.35); place(sfx, whoosh(1.0), 1.0, 0.4)   # jet behind him
for k in range(14): place(sfx, bloop(300 + 25 * k), LS(1) + 0.3 + k * 0.2, 0.3)   # balloons filling
place(sfx, ting(), WS(1, 'forty'), 0.4)
place(sfx, snap(), WS(3, 'snapped'), 1.0); place(sfx, whoosh(1.2), WS(3, 'snapped') + 0.05, 0.9)
place(sfx, whoosh(2.5), LS(4), 0.5); place(sfx, leaves(LE(4) - LS(4)), LS(4), 0.4)
place(sfx, engine(2.0, 70), WS(4, 'flight') - 0.6, 0.8); place(sfx, whoosh(1.0), WS(4, 'flight'), 0.9)
place(sfx, hum(LE(5) - LS(5) + 0.3), LS(5) - 0.1, 0.3); place(sfx, sting(), WS(5, 'pilots'), 0.5)
for k, d in enumerate([0, 8, 15, 23, 31, 40]):
    t = WS(6, 'shot') + d / 30; place(sfx, thunk(300, 0.08), t - 0.03, 0.5); place(sfx, pop(), t, 0.6); place(sfx, splat(), t + 0.02, 0.3)
place(sfx, crash(1.0), WS(7, 'landed'), 0.7); place(sfx, rattle(1.6), WS(7, 'landed'), 0.6)
for k in range(10): place(sfx, snap(), WS(7, 'landed') + 0.1 + k * 0.16, 0.35)
place(sfx, hum(0.8), WS(7, 'landed'), 0.5); place(sfx, thunk(50, 0.5), WS(7, 'blacking'), 0.8)
place(sfx, ting(), WS(8, 'fifteen'), 0.5); place(sfx, scrape(0.4), WS(8, 'fined'), 0.3)
place(sfx, leaves(TM['dur'] - LS(9)), LS(9), 0.25)
mixdown()
