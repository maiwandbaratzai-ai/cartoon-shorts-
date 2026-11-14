# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 1.0, 120)                  # the flattened forest
bed(LS(1), LS(4) - 0.05, 'dark', 0.9, 110)                 # the trader, the blast
bed(LS(4), LS(7) - 0.05, 'quirky', 0.8, 96)                # 19 years, the expedition
bed(LS(7), TM['dur'], 'tension', 1.0, 124)                 # no crater, the airburst, loop
place(sfx, boom(2.5), 0.0, 0.7); place(sfx, rumble(3.0), 0.2, 0.6)
place(sfx, ting(), WS(0, '1908'), 0.4); place(sfx, crash(1.2), WS(0, 'flattened'), 0.5); place(sfx, sting(), WS(0, '80'), 0.5)
place(sfx, leaves(2.0), LS(1), 0.3); place(sfx, whoosh(1.0), WS(1, 'trader') - 0.3, 0.5); place(sfx, roar(1.2, 900), WS(1, 'fire') - 0.3, 0.4)
place(sfx, boom(2.0), WS(2, 'blast'), 0.9); place(sfx, crash(1.0), WS(2, 'threw'), 0.6); place(sfx, thunk(70, 0.4), WS(2, 'porch'), 0.6)
place(sfx, boom(2.5), WS(3, 'explosion') - 0.1, 0.8); place(sfx, rumble(2.5), WS(3, 'hundreds'), 0.6)
place(sfx, leaves(2.0), LS(4), 0.3); place(sfx, bell(660), WS(4, 'nineteen'), 0.4)
place(sfx, footsteps(LE(5) - LS(5), 4, 700), LS(5), 0.5); place(sfx, sting(), WS(5, 'find'), 0.4)
place(sfx, whoosh(1.0), LS(6) - 0.2, 0.5); place(sfx, ting(), WS(6, 'ring'), 0.4); place(sfx, whoosh(0.6), WS(6, 'away'), 0.4)
place(sfx, creak(0.8), WS(7, 'trees'), 0.4); place(sfx, thunk(80, 0.4), WS(7, 'no'), 0.6); place(sfx, sting(), WS(7, 'crater'), 0.5)
place(sfx, roar(1.6, 1500), LS(8), 0.5); place(sfx, boom(2.5), WS(8, 'exploded'), 0.9); place(sfx, rumble(2.0), WS(8, 'miles'), 0.6)
place(sfx, boom(2.0), TM['dur'] - 0.6, 0.5)
mixdown()
