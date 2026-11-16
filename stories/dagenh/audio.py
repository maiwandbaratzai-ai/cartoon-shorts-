# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(2) - 0.05, 'tension', 0.9, 120)                 # 5 a.m., every car stops and creeps right
bed(LS(2), LS(5) - 0.05, 'quirky', 0.95, 112)              # wrong-side cars, 83% said no, did it anyway
bed(LS(5), LS(7) - 0.05, 'march', 0.95, 122)               # 360,000 signs, buses, the pop song
bed(LS(7), TM['dur'], 'quirky', 1.0, 118)                  # crashes went down, scared = careful, loop
place(sfx, horn(1.0), 0.0, 0.5); place(sfx, engine(2.5, 40), 0.0, 0.3)
place(sfx, bell(880), WS(0, '5'), 0.4); place(sfx, whoosh(0.7), WS(0, 'switched'), 0.5); place(sfx, slide(True, 0.5), WS(0, 'sides'), 0.3)
place(sfx, whoosh(0.4), LS(1) - 0.15, 0.4); place(sfx, ting(), WS(1, '1967'), 0.3); place(sfx, scrape(0.5), WS(1, 'stopped'), 0.5); place(sfx, thunk(70, 0.3), WS(1, 'stopped') + 0.3, 0.5)
place(sfx, engine(1.6, 50), WS(1, 'crept'), 0.4)
for k in range(4): place(sfx, tick(), WS(1, 'waited') + k * 0.25, 0.4)
place(sfx, whoosh(0.4), LS(2) - 0.15, 0.4); place(sfx, ting(), WS(2, 'left'), 0.3); place(sfx, bonk(400), WS(2, 'right'), 0.4)
place(sfx, whoosh(0.4), LS(3) - 0.15, 0.4); place(sfx, ting(), WS(3, '1955'), 0.3); place(sfx, crowd(1.4, 'gasp'), WS(3, 'against'), 0.25); place(sfx, sting(), WS(3, '83'), 0.4)
place(sfx, whoosh(0.4), LS(4) - 0.15, 0.4); place(sfx, thunk(100, 0.25), WS(4, 'anyway'), 0.9); place(sfx, bonk(300), WS(4, 'anyway') + 0.25, 0.4)
place(sfx, scratch(), LS(5) - 0.1, 0.45); countup(WS(5, '360000') - 0.2, WS(5, '360000') + 0.8)
for k in range(3): place(sfx, boing(260 + k * 40, 0.4), WS(5, 'flip') + k * 0.13, 0.35)
place(sfx, whoosh(0.4), LS(6) - 0.15, 0.4); place(sfx, horn(0.5), WS(6, 'buses'), 0.4); place(sfx, creak(0.5, 300), WS(6, 'doors'), 0.4); place(sfx, scratch(), WS(6, 'pop') - 0.2, 0.25)
for k in range(6): place(sfx, marimba([523, 659, 784, 659, 587, 523][k], 0.3), WS(6, 'keep') + k * 0.2, 0.35)
place(sfx, whoosh(0.4), LS(7) - 0.15, 0.4); place(sfx, crash(0.8), WS(7, 'crashes'), 0.25); place(sfx, slide(False, 0.6), WS(7, 'down'), 0.4); place(sfx, crowd(1.4, 'cheer'), WS(7, 'down') + 0.2, 0.25)
place(sfx, whoosh(0.4), LS(8) - 0.15, 0.4); place(sfx, gulp(), WS(8, 'scared'), 0.4); place(sfx, ting(), WS(8, 'careful'), 0.4); place(sfx, horn(0.7), TM['dur'] - 0.8, 0.4)
mixdown()
