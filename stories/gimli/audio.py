# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 0.9, 124)                  # flash-forward: silent jet over the racers
bed(LS(1), LS(4) - 0.05, 'dark', 0.9, 100)                 # engines die, screens go black, the glide
bed(LS(4), LS(9) - 0.05, 'quirky', 1.0, 114)               # pounds vs kilograms, the glider pilot, Gimli
bed(LS(9), LS(14) - 0.05, 'tension', 1.0, 132)             # the drag strip, the approach, sideways
bed(LS(14), LS(17) - 0.05, 'march', 0.9, 120)              # touchdown, sparks, stop
bed(LS(17), TM['dur'], 'quirky', 1.0, 120)                 # 25 more years, follow, loop
place(sfx, whoosh(2.0), 0.0, 0.5); place(sfx, crowd(2.0, 'gasp'), 0.6, 0.3)
place(sfx, ting(), WS(0, '1983'), 0.4); place(sfx, sting(), WS(0, 'fuel'), 0.5); place(sfx, whoosh(0.8), WS(0, '41'), 0.4)
place(sfx, engine(1.2, 60), LS(1) - 0.2, 0.5); place(sfx, thunk(60, 0.5), WS(1, 'silent'), 0.7); place(sfx, thunk(90, 0.3), WS(1, 'black'), 0.6)
place(sfx, pop(), WS(2, 'popped'), 0.6); place(sfx, hum(2.5), WS(2, 'popped') + 0.1, 0.25)
place(sfx, whoosh(2.5), LS(3), 0.35); place(sfx, ting(), WS(3, 'sixty'), 0.3); place(sfx, whoosh(0.6), WS(3, 'paper'), 0.5)
place(sfx, sting(), WS(4, 'how'), 0.4)
place(sfx, bell(990), WS(5, 'metric'), 0.3); place(sfx, ting(), WS(5, 'pounds'), 0.4); place(sfx, thunk(70, 0.3), WS(5, 'kilograms'), 0.5)
for k in range(4): place(sfx, ting(), WS(6, 'half') + k * 0.1, 0.15)
place(sfx, pop(), WS(7, 'gliders'), 0.5); place(sfx, whoosh(0.6), WS(7, 'gliders'), 0.3)
place(sfx, ting(), WS(8, 'gimli'), 0.5); place(sfx, sting(), WS(9, 'worse'), 0.5)
place(sfx, engine(3.0, 45), WS(10, 'drag'), 0.5); place(sfx, roar(1.5, 1600), WS(10, 'race'), 0.5); place(sfx, crowd(2.0, 'cheer'), WS(10, 'campers'), 0.3)
place(sfx, whoosh(2.0), WS(11, 'silent'), 0.5); place(sfx, crowd(1.5, 'gasp'), WS(11, 'straight'), 0.4)
place(sfx, whoosh(1.5), WS(12, 'high'), 0.4); place(sfx, whoosh(1.2), WS(13, 'sideways'), 0.6); place(sfx, creak(0.8, 120), WS(13, 'sideways') + 0.2, 0.4)
place(sfx, thunk(70, 0.4), WS(14, 'gear'), 0.6); place(sfx, crash(1.5), WS(14, 'collapsed'), 0.8); place(sfx, scrape(2.5), WS(14, 'sparks'), 0.7)
place(sfx, scrape(1.2), LS(15), 0.5); place(sfx, thunk(60, 0.5), WS(15, 'stop'), 0.7); place(sfx, crowd(2.0, 'gasp'), WS(15, 'stunned'), 0.3)
place(sfx, whoosh(0.8), LS(16), 0.4); place(sfx, crowd(1.5, 'cheer'), WS(16, 'hurt'), 0.3)
place(sfx, engine(2.0, 70), LS(17), 0.3); place(sfx, ting(), WS(17, '25'), 0.3); place(sfx, sting(), WS(17, 'gimli'), 0.5)
place(sfx, pop(), WS(18, 'follow'), 0.4); place(sfx, whoosh(1.5), TM['dur'] - 1.4, 0.4)
mixdown()
