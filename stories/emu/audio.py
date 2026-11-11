# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'march', 1.0, 118)
bed(LS(1), LS(3) - 0.05, 'march', 0.9, 118)
bed(LS(3), WS(3, 'scattered') - 0.02, 'tension', 1.0, 160)
bed(LS(4), LE(5) + 0.2, 'quirky', 1.0, 136)
bed(LS(6), TM['dur'] - 0.9, 'march', 1.0, 118); button(TM['dur'] - 0.85, 'march')
place(sfx, leaves(LS(3)), 0, 0.12)                      # wind in the wheat
for t in (1.2, 3.3, LS(1) + 0.8, LS(1) + 2.6, LS(1) + 3.9): place(sfx, squawk(), t, 0.6)
place(sfx, footsteps(2.0, 4, 500), LS(2) + 0.3, 0.5)
t0 = WS(3, 'scattered'); place(sfx, mgun(1.0, 10), t0 - 0.05, 0.9); place(sfx, crowd(0.8, 'gasp') * 0, t0, 0)
place(sfx, footsteps(1.6, 16, 700), t0 + 0.1, 0.6); [place(sfx, squawk(), t0 + 0.15 + k * 0.25, 0.5) for k in range(4)]
place(sfx, engine(LE(4) - LS(4) + 0.3), LS(4) - 0.1, 0.7)
for k in range(5): place(sfx, mgun(0.4, 10), LS(4) + 0.6 + k * 0.7, 0.55)
place(sfx, footsteps(LE(4) - LS(4), 14, 700), LS(4), 0.45)
place(sfx, ting(), WS(5, 'twenty'), 0.6); [place(sfx, ting(), WS(5, 'twenty') + 0.12 * k, 0.15) for k in range(1, 8)]
place(sfx, engine(2.2, 34), WS(6, 'pulled'), 0.4)
place(sfx, squawk(), WS(6, 'won') - 0.1, 0.9)
mixdown()
