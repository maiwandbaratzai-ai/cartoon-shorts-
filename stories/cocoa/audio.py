# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'quirky', 1.0, 120)                     # chocolate snow, the town, the factory
bed(LS(3), LS(6) - 0.05, 'tension', 1.0, 160)                # the fan breaks, the wind
bed(LS(6), TM['dur'], 'quirky', 0.95, 124)                   # brown town, harmless, free car wash (runs to the cut)
place(sfx, leaves(LS(2)), 0, 0.3)
for t in (0.4, 1.3, 2.2): place(sfx, ting(), t, 0.15)                       # sparkly flakes
place(sfx, crowd(1.2, 'cheer') * 0.6, 0.6, 0.4)
place(sfx, scrape(0.5), WS(1, 'flakes'), 0.4); place(sfx, sting(), WS(1, 'cars'), 0.4)
place(sfx, hum(LS(3) - LS(2)), LS(2), 0.3); place(sfx, rattle(1.5), LS(2) + 0.3, 0.2)
place(sfx, hum(WS(3, 'broken') - LS(3)), LS(3), 0.5); place(sfx, rattle(1.0), WS(3, 'broken') - 0.6, 0.6)
place(sfx, crash(0.8), WS(3, 'broken'), 0.9); place(sfx, thunk(70, 0.4), WS(3, 'broken'), 0.9)
place(sfx, whoosh(1.6), WS(4, 'wind') - 0.2, 1.0); place(sfx, leaves(LE(5) - LS(4)), LS(4), 0.7)
place(sfx, whoosh(1.2), LS(5), 0.6)
place(sfx, bloop(180), WS(6, 'mug') - 0.05, 0.8); place(sfx, gloop(1.0), WS(6, 'mug') + 0.1, 0.5); place(sfx, crowd(1.0, 'cheer'), WS(6, 'mug') + 0.2, 0.4)
place(sfx, ting(), WS(7, 'harmless'), 0.5)
place(sfx, splash(1.0), WS(8, 'cleaning'), 0.6); place(sfx, water(1.5), WS(8, 'cleaning') + 0.2, 0.4)
for k in range(4): place(sfx, scrape(0.3), LS(8) + 0.2 + k * 0.4, 0.3)
mixdown()
