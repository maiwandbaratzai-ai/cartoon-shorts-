# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(4) - 0.05, 'quirky', 1.0, 132)                   # the dance that won't stop
bed(LS(4), LS(6) - 0.05, 'tension', 0.85, 110)             # the doctors' diagnosis
bed(LS(6), LS(8) - 0.05, 'march', 1.0, 140)                # stage + band
bed(LS(8), WS(8, 'banned') - 0.05, 'tension', 0.8, 100)    # the opposite
bed(WS(8, 'banned') + 0.45, TM['dur'], 'quirky', 1.0, 132) # music back for the loop
place(sfx, crowd(3.0, 'cheer') * 0.5, 0, 0.35); place(sfx, footsteps(4.0, 8, 800), 0, 0.3)
place(sfx, ting(), WS(0, '1518'), 0.4); place(sfx, sting(), WS(0, 'stop'), 0.5)
for k in range(6): place(sfx, bell(660 if k % 2 else 880), WS(1, 'frau') + k * 13 / 30, 0.3)
place(sfx, footsteps(LE(1) - LS(1), 7, 900), LS(1), 0.4)
place(sfx, pop(), WS(2, 'neighbors'), 0.4); place(sfx, pop(), WS(2, 'joined'), 0.4); place(sfx, crowd(2.0, 'cheer') * 0.6, WS(2, 'thirty'), 0.4)
place(sfx, whoosh(0.8), LS(3) - 0.2, 0.5); place(sfx, crowd(2.5, 'cheer'), WS(3, 'four'), 0.5); place(sfx, footsteps(2.0, 12, 700), LS(3), 0.5)
place(sfx, thunk(90, 0.3), WS(4, 'doctors'), 0.5); place(sfx, sting(), WS(4, 'hot'), 0.6)
place(sfx, ting(), WS(5, 'cure'), 0.4); place(sfx, pop(), WS(5, 'more'), 0.5)
place(sfx, thunk(110, 0.3), WS(6, 'halls'), 0.5); place(sfx, crash(0.6), WS(6, 'stage'), 0.4); place(sfx, ting(), WS(6, 'musicians'), 0.4)
place(sfx, crowd(2.0, 'cheer'), WS(7, 'pulled'), 0.5); place(sfx, footsteps(2.0, 12, 700), WS(7, 'more'), 0.5)
place(sfx, thunk(70, 0.5), WS(8, 'banned'), 0.8); place(sfx, scrape(0.4), WS(8, 'banned') + 0.05, 0.4)
place(sfx, crowd(2.0, 'cheer') * 0.5, LE(8) + 0.3, 0.35)
mixdown()
