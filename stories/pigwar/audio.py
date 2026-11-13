# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'quirky', 1.0, 118)                    # the pig, the island, the potato patch
bed(LS(3), LS(5) - 0.05, 'tension', 0.9, 132)               # the shot, the bill
bed(LS(5), LS(7) - 0.05, 'march', 1.0, 116)                 # armies and warships
bed(LS(7), LS(9) - 0.05, 'tension', 0.8, 100)               # the admiral says no
bed(LS(9), TM['dur'], 'quirky', 0.9, 110)                   # twelve years, the pig in heaven
place(sfx, water(TM['dur']) * 0.5, 0, 0.25)
place(sfx, gloop(0.6), 0.2, 0.4); place(sfx, ting(), WS(0, '1859'), 0.4); place(sfx, boom(1.2), WS(0, 'war'), 0.5); place(sfx, pop(), WS(0, 'pig'), 0.5)
place(sfx, whoosh(0.8), LS(1) - 0.15, 0.5); place(sfx, gull(), LS(1) + 0.4, 0.4); place(sfx, sting(), WS(1, 'claimed'), 0.5)
place(sfx, footsteps(1.0, 6, 1100), WS(2, 'pig'), 0.4); place(sfx, gloop(0.8), WS(2, 'potato'), 0.5); place(sfx, gloop(0.6), WS(2, 'potato') + 0.6, 0.4)
place(sfx, gunshot(), WS(3, 'shot'), 0.9)
place(sfx, ting(), WS(4, 'ten'), 0.5); place(sfx, sting(), WS(4, 'hundred'), 0.6)
place(sfx, footsteps(LE(5) - LS(5), 4, 500), LS(5), 0.5); place(sfx, horn(0.6), WS(5, 'warships'), 0.5); place(sfx, water(1.5), WS(5, 'warships'), 0.4)
place(sfx, rumble(1.5), WS(6, 'worse'), 0.6); place(sfx, boom(1.0), WS(6, '461'), 0.4); place(sfx, crowd(1.5, 'cheer') * 0.5, WS(6, '2000'), 0.4)
place(sfx, thunk(90, 0.4), WS(7, 'refused'), 0.7)
place(sfx, gull(), LS(8) + 0.5, 0.3); place(sfx, pop(), WS(8, 'squabble'), 0.4)
place(sfx, bell(660), WS(9, '12'), 0.4); place(sfx, bell(990), WS(9, 'casualty'), 0.4); place(sfx, ting(), WS(9, 'pig'), 0.5)
mixdown()
