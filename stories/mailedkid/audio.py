# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(4) - 0.05, 'quirky', 1.0, 116)                  # the post office, stamps, the scale
bed(LS(4), LS(6) - 0.05, 'march', 0.9, 112)                # off she goes on the mail train
bed(LS(6), LS(8) - 0.05, 'tension', 0.9, 124)             # weirder: a whole bank by mail
bed(LS(8), TM['dur'], 'quirky', 1.0, 120)                  # banned, delivered to Grandma, loop
place(sfx, bell(1320), 0.05, 0.3); place(sfx, boing(240), WS(0, 'mailed'), 0.5); place(sfx, pop(), WS(0, 'five'), 0.3); place(sfx, ting(), WS(0, 'grandma'), 0.4)
place(sfx, whoosh(0.4), LS(1) - 0.15, 0.4)
for k in range(9): place(sfx, pop(), WS(1, 'stamps') + k * 0.1, 0.25)
place(sfx, thunk(110, 0.25), WS(1, 'coat'), 0.8); place(sfx, bonk(500), WS(1, 'coat') + 0.05, 0.3)
place(sfx, whoosh(0.5), LS(2) - 0.15, 0.4); place(sfx, ting(), WS(2, '1914'), 0.4); place(sfx, bell(990), WS(2, 'parcel'), 0.25); place(sfx, thunk(80, 0.3), WS(2, '50'), 0.5)
place(sfx, whoosh(0.4), LS(3) - 0.15, 0.4); place(sfx, creak(0.9, 220), WS(3, 'weighed'), 0.4); place(sfx, boing(160, 0.8), WS(3, '48') + 0.2, 0.4); place(sfx, ting(), WS(3, 'half'), 0.4)
place(sfx, slide(True, 0.5), WS(3, 'package') - 0.2, 0.4); place(sfx, crowd(1.0, 'cheer'), WS(3, 'package'), 0.15)
place(sfx, whoosh(0.4), LS(4) - 0.15, 0.4); place(sfx, scratch(), WS(4, 'ticket'), 0.4); place(sfx, horn(0.9), WS(4, 'off'), 0.5); place(sfx, engine(2.2, 45), WS(4, 'off'), 0.35)
place(sfx, whoosh(0.5), LS(5) - 0.15, 0.4); place(sfx, footsteps(1.5, 3, 300), LS(5), 0.2); place(sfx, splat(), WS(5, 'sacks'), 0.3); place(sfx, gulp(), WS(5, 'letters'), 0.2)
place(sfx, scratch(), LS(6) - 0.1, 0.5); place(sfx, sting(), WS(6, 'weirdest'), 0.5)
place(sfx, whoosh(0.6), LS(7) - 0.15, 0.4); place(sfx, ting(), WS(7, 'utah'), 0.3); place(sfx, thunk(70, 0.4), WS(7, 'bank'), 0.5)
countup(WS(7, '40') - 0.3, WS(7, '40') + 0.3); place(sfx, boom(1.2), WS(7, 'tons'), 0.4)
for k in range(4): place(sfx, thunk(120 + k * 10, 0.2), WS(7, '50') + k * 0.25, 0.4)
place(sfx, whoosh(0.4), LS(8) - 0.15, 0.4); place(sfx, thunk(90, 0.25), WS(8, 'banned'), 0.9); place(sfx, bonk(380), WS(8, 'people'), 0.4)
place(sfx, whoosh(0.5), LS(9) - 0.15, 0.4); place(sfx, slide(False, 0.6), WS(9, 'late'), 0.4); place(sfx, bell(1320), WS(9, 'hand'), 0.4); place(sfx, crowd(1.4, 'cheer'), WS(9, 'grandma'), 0.25)
place(sfx, whoosh(1.0), TM['dur'] - 0.7, 0.35)
mixdown()
