# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'march', 1.0, 118)                     # flash-forward: cats from the sky
bed(LS(1), LS(3) - 0.05, 'quirky', 0.9, 112)                # mosquitoes, the spraying
bed(LS(3), LS(5) - 0.05, 'tension', 0.9, 128)               # wasps die, roofs fall
bed(LS(5), LS(7) - 0.05, 'dark', 0.9, 96)                   # lizards, cats, rats
bed(LS(7), TM['dur'], 'march', 1.0, 118)                    # Operation Cat Drop
place(sfx, leaves(TM['dur']) * 0.3, 0, 0.3)
place(sfx, engine(4.0, 45), 0, 0.4); place(sfx, whoosh(1.0), 0.3, 0.5); place(sfx, ting(), WS(0, '1960'), 0.4); place(sfx, cuckoo(), WS(0, 'cats'), 0.5)
place(sfx, hum(LE(1) - LS(1)), LS(1), 0.5); place(sfx, sting(), WS(1, 'malaria'), 0.5)
place(sfx, whoosh(1.5) * 0.7, WS(2, 'sprayed'), 0.6); place(sfx, whoosh(1.2) * 0.6, WS(2, 'sprayed') + 1.0, 0.5); place(sfx, ting(), WS(2, 'ddt'), 0.5)
place(sfx, pop(), WS(3, 'died'), 0.4); place(sfx, hum(0.8), WS(3, 'wasps'), 0.4); place(sfx, thunk(200, 0.2), WS(3, 'wasps') + 0.5, 0.5); place(sfx, gloop(0.6), WS(3, 'caterpillars'), 0.4)
place(sfx, gloop(0.6), WS(4, 'munched'), 0.5); place(sfx, creak(1.0, 90), WS(4, 'roofs'), 0.6); place(sfx, crash(1.2), WS(4, 'caved'), 0.9)
place(sfx, rumble(1.0), WS(5, 'worse'), 0.5); place(sfx, splat(), WS(5, 'ate'), 0.4); place(sfx, splat(), WS(5, 'cats') + 0.2, 0.4)
place(sfx, sting(), WS(6, 'died'), 0.4); place(sfx, footsteps(LE(6) - WS(6, 'rats') + 0.5, 14, 2400), WS(6, 'rats'), 0.5)
place(sfx, engine(LE(7) - LS(7), 45), LS(7), 0.6); place(sfx, whoosh(1.2), WS(7, 'dropped'), 0.6); place(sfx, pop(), WS(7, 'parachute'), 0.5)
place(sfx, crowd(2.0, 'cheer'), WS(8, 'operation'), 0.6); place(sfx, cuckoo(), WS(8, 'drop'), 0.4); place(sfx, whoosh(1.0), TM['dur'] - 0.8, 0.4)
mixdown()
