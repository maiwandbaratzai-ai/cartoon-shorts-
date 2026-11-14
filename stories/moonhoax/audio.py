# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(4) - 0.05, 'quirky', 1.0, 116)                   # the moon creatures
bed(LS(4), LS(5) - 0.05, 'march', 1.0, 128)                # papers fly off the stands
bed(LS(5), LS(7) - 0.05, 'tension', 0.8, 100)              # Herschel has no idea
bed(LS(7), LS(8) - 0.05, 'dark', 0.9, 110)                 # the telescope burns
bed(LS(8), TM['dur'], 'quirky', 1.0, 116)                  # never retracted, loop
for k in range(3): place(sfx, whoosh(0.5), 0.2 + k * 0.9, 0.4)
place(sfx, ting(), WS(0, '1835'), 0.4); place(sfx, whoosh(0.7), WS(0, 'new') - 0.2, 0.5); place(sfx, pop(), WS(0, 'newspaper'), 0.4); place(sfx, sting(), WS(0, 'bat'), 0.6)
place(sfx, creak(0.8, 120), WS(1, 'astronomer'), 0.4); place(sfx, sting(), WS(1, 'telescope'), 0.5)
place(sfx, bell(990), WS(2, 'blue'), 0.4); place(sfx, footsteps(1.2, 6, 1200), WS(2, 'unicorns'), 0.4); place(sfx, pop(), WS(2, 'beavers'), 0.4); place(sfx, footsteps(1.2, 5, 600), WS(2, 'walking'), 0.4)
place(sfx, whoosh(0.8), WS(3, 'winged'), 0.6); place(sfx, whoosh(0.8), WS(3, 'winged') + 0.5, 0.5); place(sfx, squawk(), WS(3, 'orangutans'), 0.5)
place(sfx, crowd(2.0, 'cheer'), WS(4, 'bought'), 0.5); place(sfx, ting(), WS(4, 'sales'), 0.4); place(sfx, boom(1.0), WS(4, 'exploded'), 0.4)
place(sfx, cuckoo(), WS(5, 'idea'), 0.5)
place(sfx, sting(), WS(6, 'story'), 0.4)
place(sfx, hum(1.5), WS(7, 'lens'), 0.4); place(sfx, roar(2.0, 900), WS(7, 'sunlight'), 0.5); place(sfx, crash(1.2), WS(7, 'burned'), 0.6); place(sfx, roar(1.5, 600), WS(7, 'observatory'), 0.5)
place(sfx, thunk(90, 0.3), WS(8, 'never'), 0.5); place(sfx, sting(), WS(8, 'bat'), 0.5); place(sfx, whoosh(0.6), LE(8) + 0.1, 0.4)
mixdown()
