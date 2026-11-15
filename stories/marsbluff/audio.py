# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(2) - 0.05, 'march', 0.9, 112)                    # the blast, the crater
bed(LS(2), LS(6) - 0.05, 'tension', 1.0, 126)              # bomb bay, the pin, the fall
bed(LS(6), LS(8) - 0.05, 'quirky', 0.9, 110)               # no core, the family, the chickens
bed(LS(8), TM['dur'], 'march', 1.0, 118)                   # the cheque, loop to the blast
place(sfx, boom(2.5), 0.0, 0.9); place(sfx, crash(1.0), 0.4, 0.4)
place(sfx, ting(), WS(0, '1958'), 0.4); place(sfx, sting(), WS(0, 'atomic'), 0.6); place(sfx, thunk(70, 0.3), WS(0, 'backyard'), 0.5)
place(sfx, snap(), WS(1, 'splinters'), 0.6); place(sfx, crash(0.8), WS(1, 'splinters') + 0.1, 0.4); place(sfx, rumble(1.0), WS(1, 'crater'), 0.5)
place(sfx, engine(2.5, 50), LS(2) - 0.1, 0.4)
for k in range(5): place(sfx, bell(1400), WS(2, 'warning') + k * 0.27, 0.15)
place(sfx, footsteps(1.0), WS(2, 'navigator'), 0.4)
place(sfx, creak(0.5), WS(3, 'pin'), 0.5); place(sfx, thunk(60, 0.5), WS(3, 'unhooked'), 0.9); place(sfx, sting(), WS(3, 'unhooked') + 0.1, 0.5)
place(sfx, crash(1.4), WS(4, 'smashed'), 0.8); place(sfx, whoosh(1.2), WS(4, 'doors'), 0.6)
place(sfx, whoosh(2.5), LS(5), 0.7); place(sfx, ting(), WS(5, 'mars'), 0.3)
place(sfx, boom(3.0), LS(6) - 0.1, 1.0); place(sfx, rumble(2.0), LS(6) + 0.2, 0.5); place(sfx, pop(), WS(6, 'core'), 0.5)
place(sfx, ting(), WS(7, 'six'), 0.3); place(sfx, ting(), WS(7, 'died'), 0.3); place(sfx, squawk(), WS(7, 'chickens'), 0.5); place(sfx, pop(), WS(7, 'lucky'), 0.6); place(sfx, whoosh(0.6), WS(7, 'lucky'), 0.4)
place(sfx, bell(1320), WS(8, '54'), 0.4); place(sfx, ting(), WS(8, '54') + 0.15, 0.3); place(sfx, boom(2.0), TM['dur'] - 0.47, 0.7)
mixdown()
