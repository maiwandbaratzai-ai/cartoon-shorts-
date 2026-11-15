# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'march', 0.9, 116)                    # the burning goat, 1966
bed(LS(3), LS(5) - 0.05, 'tension', 0.9, 120)              # guards, fences, webcams... burning again
bed(LS(5), LS(8) - 0.05, 'quirky', 1.0, 118)               # tourist, jail, Santa + gingerbread man
bed(LS(8), TM['dur'], 'march', 1.0, 120)                   # 43 goats, another goat, loop
place(sfx, roar(2.5, 900), 0.0, 0.5); for_ = [place(sfx, bell(1320 + k * 220), 0.2 + k * 0.25, 0.12) for k in range(4)]
place(sfx, ting(), WS(0, '13'), 0.3); place(sfx, pop(), WS(0, 'goat'), 0.4)
place(sfx, whoosh(0.8), WS(1, 'flaming'), 0.6); place(sfx, roar(2.0, 1100), WS(1, 'torch'), 0.5)
place(sfx, ting(), WS(2, '1966'), 0.3); place(sfx, boom(1.5), WS(2, 'new'), 0.4)
place(sfx, footsteps(0.8), WS(3, 'guards'), 0.4); place(sfx, thunk(90, 0.3), WS(3, 'fences'), 0.5); place(sfx, bloop(400), WS(3, 'webcams'), 0.4)
place(sfx, whoosh(0.7), WS(4, 'kept') - 0.2, 0.6); place(sfx, roar(2.0, 1000), WS(4, 'burning'), 0.6)
place(sfx, ting(), WS(5, '2001'), 0.3); place(sfx, snap(), WS(5, 'torched'), 0.5); place(sfx, whoosh(0.6), WS(5, 'torched') + 0.1, 0.5)
place(sfx, sting(), WS(6, 'legal'), 0.4); place(sfx, thunk(70, 0.4), WS(6, '18'), 0.8); place(sfx, rattle(0.5), WS(6, 'jail'), 0.5)
place(sfx, ting(), WS(7, '2005'), 0.3); place(sfx, bell(990), WS(7, 'santa'), 0.4); place(sfx, pop(), WS(7, 'gingerbread'), 0.5)
place(sfx, whoosh(1.0), WS(7, 'shot'), 0.7); place(sfx, boom(1.8), WS(7, 'arrow') + 0.2, 0.6); place(sfx, roar(2.0, 1000), WS(7, 'arrow') + 0.3, 0.5)
for k in range(8): place(sfx, ting(), WS(8, '43') - 0.3 + k * 0.06, 0.15)
place(sfx, sting(), WS(8, 'wrecked'), 0.5); place(sfx, thunk(90, 0.3), WS(9, 'build'), 0.4); place(sfx, pop(), WS(9, 'another'), 0.5); place(sfx, whoosh(0.4), TM['dur'] - 0.42, 0.6)
mixdown()
