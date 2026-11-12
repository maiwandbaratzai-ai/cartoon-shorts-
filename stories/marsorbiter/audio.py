# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 1.0, 150)                    # re-entry flash-forward
bed(LS(1), LS(5) - 0.05, 'quirky', 0.85, 116)                # cruise + the two teams
bed(LS(5), LS(8) - 0.05, 'dark', 1.0, 96)                    # the drift
bed(LS(8), LS(9) - 0.05, 'sad', 0.9, 80)                     # no signal
bed(LS(9), TM['dur'], 'tension', 1.0, 150)                   # the bill, back into the re-entry for the loop
place(sfx, roar(LS(1), 900), 0, 0.8); place(sfx, rumble(LS(1)), 0, 0.5)
place(sfx, hum(LS(3) - LS(1)), LS(1), 0.2); place(sfx, whoosh(0.8), LS(1) + 0.1, 0.4)
for d in (-0.2, 0.33, 0.87): place(sfx, whoosh(0.35), WS(2, 'thruster') + d, 0.6)
place(sfx, ting(), WS(3, 'pounds'), 0.5); place(sfx, ting(), WS(4, 'newtons'), 0.5)
for k in range(6): place(sfx, bloop(500 + 60 * (k % 3)), LS(3) + 0.3 + k * 0.25, 0.15)   # computer beeps
place(sfx, crowd(0.5, 'gasp') * 0.0, LS(5), 0.0)
place(sfx, whoosh(0.4), WS(5, 'so'), 0.6); place(sfx, whoosh(1.0), WS(5, 'four'), 1.0); place(sfx, thunk(70, 0.4), WS(5, 'four'), 0.7)
place(sfx, sting(), WS(7, 'fifty'), 0.5)
place(sfx, roar(LE(8) - LS(8), 900), WS(8, 'hit') - 0.1, 0.9); place(sfx, boom(1.5), WS(8, 'hit'), 0.7)
place(sfx, noise(1.4) * 0.25, WS(8, 'never'), 0.5)                                   # static
place(sfx, ting(), WS(9, 'multiplication'), 0.5)
place(sfx, roar(TM['dur'] - WS(9, 'cost') + 0.1, 900), WS(9, 'cost') - 0.1, 0.8); place(sfx, crash(0.8), WS(9, '125'), 0.4)
mixdown()
