# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'quirky', 1.0, 120)                   # the wrong-way pilot, his dream
bed(LS(3), LS(6) - 0.05, 'tension', 0.85, 108)             # denied, the sneaky flight plan
bed(LS(6), LS(8) - 0.05, 'march', 0.9, 126)                # takeoff, turns east
bed(LS(8), LS(12) - 0.05, 'dark', 0.85, 100)               # gas leak, 28 hours of cloud
bed(LS(12), LS(14) - 0.05, 'quirky', 1.0, 118)             # Dublin, the excuse
bed(LS(14), LS(17) - 0.05, 'march', 1.0, 132)              # parade, punishment
bed(LS(17), TM['dur'], 'quirky', 1.0, 120)                 # the loop
place(sfx, engine(TM['dur'], 42) * 0.35, 0, 0.25)          # drone of the Robin's engine under everything
place(sfx, whoosh(0.8), 0.2, 0.4); place(sfx, ting(), WS(0, '1938'), 0.4); place(sfx, ting(), WS(0, 'california'), 0.4); place(sfx, sting(), WS(0, 'ireland'), 0.6)
place(sfx, bell(880), WS(1, 'atlantic'), 0.3); place(sfx, pop(), WS(2, 'lindbergh'), 0.4); place(sfx, thunk(70, 0.5), WS(3, 'unsafe'), 0.8)
place(sfx, ting(), WS(4, 'three'), 0.4); place(sfx, scrape(0.5), WS(5, 'flight'), 0.4); place(sfx, sting(), WS(5, 'california'), 0.4)
place(sfx, roar(2.5, 700), WS(6, 'took'), 0.5); place(sfx, whoosh(1.0), WS(6, 'turned'), 0.6); place(sfx, sting(), WS(6, 'east'), 0.6)
place(sfx, pop(), WS(7, 'radio'), 0.4); place(sfx, gloop(0.5), WS(7, 'chocolate'), 0.4); place(sfx, gloop(0.5), WS(7, 'fig'), 0.4)
place(sfx, rumble(1.2), WS(8, 'worse'), 0.5)
for k in range(6): place(sfx, drip(), WS(8, 'gasoline') + k * 0.25, 0.5)
place(sfx, thunk(160, 0.25), WS(9, 'punched'), 0.8); place(sfx, crash(0.5), WS(9, 'punched') + 0.15, 0.4); place(sfx, scrape(0.6), WS(9, 'screwdriver'), 0.5)
place(sfx, water(LE(10) - LS(10)) * 0.6, LS(10), 0.4); place(sfx, whoosh(1.5), WS(11, 'down'), 0.5); place(sfx, sting(), WS(11, 'twenty'), 0.4)
place(sfx, crash(0.8), WS(12, 'landed'), 0.4); place(sfx, bell(660), WS(12, 'dublin'), 0.4); place(sfx, cuckoo(), WS(12, 'intended'), 0.4)
place(sfx, creak(0.6), WS(13, 'compass'), 0.4); place(sfx, sting(), WS(13, 'wrong'), 0.5)
place(sfx, thunk(90, 0.3), WS(14, 'nobody'), 0.4); place(sfx, crowd(3.0, 'cheer'), WS(14, 'america'), 0.6)
place(sfx, crowd(3.0, 'cheer'), LS(15), 0.6); place(sfx, horn(0.6), WS(15, 'ticker'), 0.5); place(sfx, bell(990), WS(15, 'bigger'), 0.4)
place(sfx, thunk(80, 0.4), WS(16, 'punishment'), 0.5); place(sfx, horn(1.2), WS(16, 'boat'), 0.6); place(sfx, water(2.0), WS(16, 'boat'), 0.4)
place(sfx, ting(), WS(17, 'swore'), 0.4); place(sfx, sting(), WS(17, 'california'), 0.5); place(sfx, whoosh(0.8), LE(17) + 0.2, 0.4)
mixdown()
