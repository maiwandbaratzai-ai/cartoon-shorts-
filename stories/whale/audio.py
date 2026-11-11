# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
boomT = LS(5)
bed(0, LS(4) - 0.05, 'quirky')                        # setup
bed(LS(4), boomT - 0.02, 'tension', 1.0, 150)         # crowd waits
bed(LS(6), LE(7) + 0.2, 'quirky', 1.0, 132)           # raining whale
bed(LS(8), TM['dur'] - 0.9, 'sad', 0.9)               # still on the beach
button(TM['dur'] - 0.85, 'sad', 0.8)
place(sfx, water(LS(5)), 0, 0.22)                      # surf under the beach
for t in (0.6, 2.4, WS(1, 'stank') + 0.2, LS(2) + 1.2, LS(2) + 3.5): place(sfx, gull(), t, 0.5)
place(sfx, snore(0.9), WS(1, 'stank'), 0.25)         # "eww" texture
for i in range(10): place(sfx, thunk(140, 0.18), LS(3) + 0.25 + i * 0.2, 0.35)  # crates landing
place(sfx, crowd(2.2, 'cheer'), LS(4), 0.8)
place(sfx, boom(3.0), boomT, 1.6); place(sfx, rumble(2.5), boomT, 0.8)
place(sfx, crowd(1.6, 'scream'), LS(6) - 0.3, 0.7)
for i in range(16): place(sfx, splat(), LS(6) + 0.3 + i * 0.22 + 0.1 * rng.random(), 0.45 + 0.3 * rng.random())
place(sfx, whoosh(0.6), WS(7, 'crushed') - 0.5, 0.6); place(sfx, crash(1.2), WS(7, 'crushed'), 1.0); place(sfx, thunk(60, 0.4), WS(7, 'crushed'), 0.9)
place(sfx, water(TM['dur'] - LS(8)), LS(8), 0.25); place(sfx, gull(), LS(8) + 0.8, 0.4)
mixdown()
