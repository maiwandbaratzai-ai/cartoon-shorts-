# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 1.0, 140)                   # flash-forward: the crash
bed(LS(1), LS(5) - 0.05, 'sad', 0.9, 84)                    # the lonely tree, roots, caravans, camels
bed(LS(5), LS(8) - 0.05, 'quirky', 1.0, 124)                # here comes the truck
bed(LS(8), LS(9) - 0.05, 'sad', 0.9, 84)                    # museum
bed(LS(9), TM['dur'], 'quirky', 0.9, 124)                   # the metal tree, loop to the crash
place(sfx, leaves(TM['dur']) * 0.25, 0, 0.3)                # desert wind
place(sfx, crash(1.2), 0.0, 0.8); place(sfx, creak(1.0, 70), 0.2, 0.7); place(sfx, ting(), WS(0, '1973'), 0.4)
place(sfx, whoosh(1.0), WS(0, 'only') - 0.1, 0.6); place(sfx, ting(), WS(0, '250'), 0.4)
place(sfx, leaves(2.0), LS(1), 0.5)
place(sfx, gloop(1.2), WS(2, 'roots'), 0.4); place(sfx, whoosh(0.8), WS(2, '100'), 0.5); place(sfx, splash(1.0), WS(2, 'water'), 0.5)
place(sfx, footsteps(LE(3) - LS(3), 3, 300), LS(3), 0.5); place(sfx, scrape(0.6), WS(3, 'maps') - 0.15, 0.5); place(sfx, pop(), WS(3, 'city'), 0.4)
place(sfx, squawk(), WS(4, 'camels'), 0.4); place(sfx, squawk(), WS(4, 'camels') + 0.9, 0.3); place(sfx, ting(), WS(4, 'none'), 0.4)
place(sfx, engine(LE(6) - LS(5) + 0.3), LS(5), 0.6); place(sfx, horn(0.6), WS(5, 'truck'), 0.5)
place(sfx, whoosh(0.8), LS(6) - 0.1, 0.5); place(sfx, sting(), WS(6, 'desert'), 0.5)
place(sfx, engine(LE(7) - LS(7)), LS(7), 0.5); place(sfx, cuckoo(), WS(7, 'drunk'), 0.4)
place(sfx, crash(1.4), WS(7, 'snapped'), 1.0); place(sfx, snap(), WS(7, 'snapped') + 0.05, 0.9); place(sfx, creak(1.2, 60), WS(7, 'snapped') + 0.2, 0.6)
place(sfx, bell(660), WS(8, 'museum'), 0.4)
place(sfx, ting(), WS(9, 'metal'), 0.6); place(sfx, engine(TM['dur'] - LS(9)), LS(9), 0.4); place(sfx, horn(0.5), WS(9, 'try'), 0.5)
place(sfx, crash(1.0), TM['dur'] - 0.15, 0.6)
mixdown()
