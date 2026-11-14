# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(2) - 0.05, 'quirky', 1.0, 112)                   # quiet farm, soap kettle
bed(LS(2), LS(5) - 0.05, 'tension', 0.9, 126)              # meat falls, the tasting
bed(LS(5), LS(7) - 0.05, 'dark', 0.9, 100)                 # the lab result
bed(LS(7), TM['dur'], 'quirky', 1.0, 120)                  # vultures, the punchline, loop
for k in range(10): place(sfx, splat(), 0.15 + k * 0.35, 0.35)
place(sfx, ting(), WS(0, '1876'), 0.4); place(sfx, sting(), WS(0, 'meat'), 0.6)
place(sfx, leaves(2.5), LS(1), 0.3); place(sfx, gloop(1.0), WS(1, 'soap'), 0.4); place(sfx, bell(990), WS(1, 'clear'), 0.3)
for k in range(6): place(sfx, splat(), WS(2, 'red') + k * 0.28, 0.5)
place(sfx, pop(), WS(3, 'four'), 0.4); place(sfx, whoosh(0.8), WS(3, 'football') - 0.2, 0.5)
place(sfx, gloop(0.5), WS(4, 'tasted'), 0.5); place(sfx, ting(), WS(4, 'mutton'), 0.4); place(sfx, ting(), WS(4, 'venison'), 0.4)
place(sfx, thunk(80, 0.4), WS(5, 'worse'), 0.7); place(sfx, sting(), WS(5, 'tested'), 0.5)
place(sfx, rumble(1.2), WS(6, 'lung'), 0.5); place(sfx, whoosh(0.8), WS(6, 'vultures') - 0.3, 0.5); place(sfx, squawk(), WS(6, 'vultures') + 0.2, 0.5)
place(sfx, squawk(), WS(7, 'scared'), 0.6); place(sfx, gloop(1.0), WS(7, 'vomit'), 0.7); place(sfx, whoosh(0.6), WS(7, 'lighter'), 0.6)
place(sfx, pop(), WS(8, 'tasted'), 0.4); place(sfx, gloop(0.8), WS(8, 'vulture'), 0.6); place(sfx, sting(), WS(8, 'vomit'), 0.6)
for k in range(4): place(sfx, splat(), LE(8) + 0.1 + k * 0.3, 0.4)
mixdown()
