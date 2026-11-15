# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 0.9, 120)                  # the burning tank, flash-forward
bed(LS(1), LS(5) - 0.05, 'quirky', 1.0, 116)               # the bats, the dentist, the stamp
bed(LS(5), LS(8) - 0.05, 'tension', 0.9, 128)              # escape, nap, ticking
bed(LS(8), TM['dur'], 'march', 0.9, 120)                   # fire, punchline, loop
place(sfx, roar(2.2, 900), 0.0, 0.5); place(sfx, whoosh(0.8), 0.1, 0.5)
place(sfx, ting(), WS(0, '1943'), 0.4); place(sfx, sting(), WS(0, 'firebombs'), 0.5); place(sfx, whoosh(0.5), WS(0, 'bats'), 0.4)
place(sfx, pop(), WS(1, 'thousand'), 0.4); place(sfx, whoosh(0.4), WS(1, 'thousand') + 0.2, 0.3); place(sfx, thunk(70, 0.3), WS(1, 'napalm'), 0.6)
place(sfx, ting(), WS(2, 'dentist'), 0.4); place(sfx, pop(), WS(2, 'attics'), 0.4)
place(sfx, thunk(60, 0.4), WS(3, 'yes'), 0.9); place(sfx, ting(), WS(3, 'yes') + 0.1, 0.3)
place(sfx, whoosh(0.6), LS(4) - 0.15, 0.5); place(sfx, engine(2.0), LS(4) + 0.2, 0.25); place(sfx, ting(), WS(4, 'new'), 0.3)
place(sfx, creak(0.6), WS(5, "escaped") - 0.3, 0.6)
for k in range(6): place(sfx, whoosh(0.3), WS(5, 'escaped') + k * 0.15, 0.35)
place(sfx, whoosh(0.5), WS(6, 'fuel') - 0.2, 0.4); place(sfx, snore(1.1), WS(6, 'nap'), 0.6)
for k in range(5): place(sfx, ting(), LS(7) + k * 0.2, 0.25)
place(sfx, boom(2.5), WS(8, 'whoosh'), 0.9); place(sfx, roar(3.0, 900), WS(8, 'whoosh') + 0.2, 0.5); place(sfx, crash(1.2), WS(8, 'burned'), 0.5)
place(sfx, sting(), WS(9, 'america'), 0.6); place(sfx, roar(2.0, 900), LE(9) - 0.5, 0.4)
mixdown()
