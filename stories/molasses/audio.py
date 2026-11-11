# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 1.0, 140)                 # hook: the wave
bed(LS(1), LS(5) - 0.05, 'quirky', 0.85, 112)             # lunchtime, the tank, the rum, the paint job
bed(LS(5), WS(6, 'split') - 0.02, 'tension', 1.1, 170)    # rivets
bed(WS(6, 'split'), LS(8) - 0.05, 'dark', 1.0, 100)       # the flood
bed(LS(8), LS(12) - 0.05, 'sad', 0.9, 76)                 # aftermath
bed(LS(12), TM['dur'] - 0.9, 'quirky', 0.8, 112); button(TM['dur'] - 0.85, 'quirky', 0.8)
place(sfx, roar(LS(1) - 0.1, 500), 0, 0.9); place(sfx, gloop(LS(1)), 0, 0.6); place(sfx, crowd(2.5, 'scream'), 0.6, 0.5)
place(sfx, crowd(LS(2) - LS(1), 'cheer') * 0.4, LS(1), 0.5); place(sfx, rattle(3.0), LS(1) + 0.4, 0.35)   # street chatter + the El train
place(sfx, bell(660), LS(1) + 0.2, 0.25)
place(sfx, rattle(2.5), LS(2), 0.25)
for k in range(6): place(sfx, thunk(120, 0.25), LS(3) + 0.4 + k * 0.45, 0.35)                        # barrels
for k in range(5): place(sfx, scrape(0.4), WS(4, 'painted') + k * 0.35, 0.25)                        # brush strokes
for k in range(3): place(sfx, creak(0.7, 90 + 20 * k), LS(4) + 0.5 + k * 1.3, 0.35)                 # the tank groans
t0 = WS(5, 'popped')
for k in range(9): place(sfx, pop(), t0 + k * 0.1 + 0.03 * rng.random(), 0.9)                      # rivets like gunshots
place(sfx, crowd(1.0, 'gasp'), t0 + 0.4, 0.5)
ts = WS(6, 'split'); place(sfx, crash(1.5), ts, 1.0); place(sfx, boom(2.0), ts, 0.9); place(sfx, roar(LS(8) - ts, 450), ts, 1.0); place(sfx, gloop(LS(8) - ts), ts, 0.7)
place(sfx, crowd(1.8, 'scream'), ts + 0.4, 0.55)
place(sfx, crash(1.4), WS(7, 'knocked'), 0.9); place(sfx, thunk(55, 0.5), WS(7, 'knocked'), 0.8)
place(sfx, creak(1.2, 70), WS(7, 'bent'), 1.0); place(sfx, crash(1.0), WS(7, 'bent') + 0.2, 0.6)
place(sfx, leaves(LS(10) - LS(8)), LS(8), 0.12)                                                   # cold wind
place(sfx, gloop(LS(11) - LS(9)), LS(9), 0.45)
place(sfx, water(LS(12) - LS(11)), LS(11), 0.35); place(sfx, gull(), LS(11) + 0.6, 0.35)
for t in (LS(12) + 0.4, LS(12) + 1.6): place(sfx, gull(), t, 0.3)
mixdown()
