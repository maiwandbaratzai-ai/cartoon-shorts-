# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'tension', 1.0, 136)                   # storm, containers overboard
bed(LS(3), LS(6) - 0.05, 'quirky', 1.0, 118)                # toys pop free, sail to Alaska
bed(LS(6), LS(9) - 0.05, 'march', 0.9, 112)                 # the oceanographer, the beachcombers
bed(LS(9), LS(13) - 0.05, 'sad', 0.9, 84)                   # the Arctic, frozen for years
bed(LS(13), TM['dur'], 'quirky', 0.9, 118)                  # reward, collectors, back to the storm
place(sfx, water(LS(3)), 0, 0.6); place(sfx, rumble(2.0), 0.0, 0.5); place(sfx, ting(), WS(0, '1992'), 0.4); place(sfx, pop(), WS(0, '28'), 0.5)
place(sfx, whoosh(1.0), WS(0, 'pacific') - 0.1, 0.5)
place(sfx, rumble(1.5), WS(1, 'storm'), 0.8); place(sfx, crash(0.8) * 0.5, WS(1, 'storm'), 0.5); place(sfx, creak(1.2, 70), WS(1, 'ship'), 0.6)
for k in range(4): place(sfx, splash(1.0), WS(2, 'overboard') + 0.2 + k * 0.25, 0.6)
place(sfx, crash(1.0), WS(2, 'overboard'), 0.6)
for w in ['ducks', 'frogs', 'beavers', 'turtles']: place(sfx, pop(), WS(2, w), 0.5)
place(sfx, gloop(1.0), WS(3, 'dissolved'), 0.5); place(sfx, bloop(330), WS(3, 'popped'), 0.6); place(sfx, bloop(440), WS(3, 'popped') + 0.12, 0.5); place(sfx, bloop(520), WS(3, 'popped') + 0.24, 0.5)
place(sfx, water(LE(4) - LS(4)) * 0.6, LS(4), 0.4); place(sfx, gull(), LS(4) + 0.6, 0.4); place(sfx, ting(), WS(4, 'captain'), 0.4); place(sfx, ting(), WS(4, 'map'), 0.4)
place(sfx, water(2.0) * 0.6, LS(5), 0.5); place(sfx, gull(), WS(5, 'alaska'), 0.5); place(sfx, sting(), WS(5, '2'), 0.4)
place(sfx, scrape(0.5), LS(6), 0.4); place(sfx, ting(), WS(6, 'currents'), 0.5)
place(sfx, bell(880), WS(7, 'report'), 0.4); place(sfx, crowd(1.0, 'cheer') * 0.5, WS(7, 'report'), 0.4)
for k in range(8): place(sfx, pop(), WS(8, 'hundreds') + k * 0.12, 0.3)
place(sfx, whoosh(1.0), WS(9, 'strangest') - 0.2, 0.6); place(sfx, sting(), WS(9, 'strangest'), 0.5)
place(sfx, leaves(2.5) * 0.5, LS(10), 0.4); place(sfx, creak(1.0, 50), WS(10, 'arctic'), 0.5)
place(sfx, creak(1.2, 60), WS(11, 'froze'), 0.6); place(sfx, ting(), WS(11, 'ice'), 0.5); place(sfx, whoosh(1.5), WS(11, 'years'), 0.4)
place(sfx, ting(), WS(12, 'white'), 0.4); place(sfx, bloop(260), WS(12, 'green'), 0.5)
place(sfx, gull(), LS(13) + 0.2, 0.4); place(sfx, bell(660), WS(13, 'reward'), 0.5)
place(sfx, ting(), WS(14, 'hundreds'), 0.5); place(sfx, ting(), WS(14, 'hundreds') + 0.15, 0.4)
place(sfx, whoosh(1.0), LS(15) - 0.2, 0.4); place(sfx, water(TM['dur'] - LE(15)), LE(15), 0.6); place(sfx, rumble(2.0), LE(15) + 0.2, 0.4)
mixdown()
