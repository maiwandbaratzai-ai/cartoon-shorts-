# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(3) - 0.05, 'quirky', 1.0, 118)                   # the toad army, the plan
bed(LS(3), LS(6) - 0.05, 'quirky', 0.9, 104)               # beetles out of reach, toads eat everything
bed(LS(6), LS(7) - 0.05, 'tension', 0.9, 126)              # poison
bed(LS(7), TM['dur'], 'march', 0.9, 120)                   # 200 million, Toadzilla, loop
for k in range(8): place(sfx, bloop(180 + k * 15), 0.1 + k * 0.33, 0.3)
place(sfx, ting(), WS(0, '1935'), 0.4); place(sfx, pop(), WS(0, '102'), 0.4); place(sfx, bloop(240), WS(0, 'beetles'), 0.4)
for k in range(10): place(sfx, bloop(200 + (k % 4) * 40), WS(1, '62') + k * 0.18, 0.3)
place(sfx, ting(), WS(2, 'plan'), 0.3); place(sfx, scrape(0.6), WS(2, 'beetles'), 0.3)
place(sfx, whoosh(0.7), WS(3, 'high') - 0.2, 0.5); place(sfx, ting(), WS(3, 'stalks'), 0.3)
for k in range(3): place(sfx, bloop(160), LS(4) + k * 0.73, 0.5)
place(sfx, thunk(70, 0.3), WS(4, 'climb'), 0.6)
for k in range(5): place(sfx, gloop(0.4), WS(5, 'ate') + k * 0.4, 0.4)
place(sfx, sting(), WS(6, 'poisonous'), 0.6); place(sfx, rattle(0.6), WS(6, 'snakes'), 0.4); place(sfx, thunk(60, 0.4), WS(6, 'died'), 0.6)
place(sfx, crowd(1.5, 'cheer'), WS(7, '200') - 0.1, 0.25); for_ = [place(sfx, bloop(150 + k * 20), WS(7, '200') + k * 0.12, 0.3) for k in range(8)]
place(sfx, boom(1.5), WS(7, '27'), 0.6); place(sfx, sting(), WS(8, 'toadzilla'), 0.7); place(sfx, bloop(110), WS(8, 'toadzilla') + 0.4, 0.7)
place(sfx, scrape(0.5), WS(9, 'beetles'), 0.3); place(sfx, pop(), WS(9, 'still'), 0.5)
mixdown()
