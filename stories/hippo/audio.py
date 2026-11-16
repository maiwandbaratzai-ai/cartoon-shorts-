# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(2) - 0.05, 'quirky', 1.0, 116)                  # hippo ranches, the plan
bed(LS(2), LS(5) - 0.05, 'march', 0.9, 104)                # hyacinth, stuck boats, no meat
bed(LS(5), LS(9) - 0.05, 'quirky', 0.95, 120)              # the bill, the strange witnesses
bed(LS(9), LS(14) - 0.05, 'march', 1.0, 124)               # million tons, pork+beef, lake cow bacon, TR
bed(LS(14), LS(16) - 0.05, 'tension', 0.85, 96)            # so where are the hippos? nowhere
bed(LS(16), TM['dur'], 'quirky', 1.0, 120)                 # Colombia, wild hippos, follow
place(sfx, water(2.0), 0.0, 0.3); place(sfx, gloop(0.8), 0.3, 0.4); place(sfx, bloop(110), 0.9, 0.5)
place(sfx, ting(), WS(0, 'louisiana'), 0.3); place(sfx, horn(0.6), WS(0, 'ranches'), 0.35); place(sfx, boing(150), WS(0, 'hippo'), 0.4)
place(sfx, whoosh(0.4), LS(1) - 0.15, 0.4); place(sfx, chew(1.2, 5), WS(1, 'weeds'), 0.5); place(sfx, gulp(), WS(1, 'americans') + 0.4, 0.4); place(sfx, chew(0.8, 7), WS(1, 'americans') + 0.8, 0.4)
place(sfx, whoosh(0.4), LS(2) - 0.15, 0.4); place(sfx, ting(), WS(2, 'hyacinth'), 0.3); place(sfx, bell(880), WS(2, '1884'), 0.3); place(sfx, crowd(1.2, 'cheer'), WS(2, 'fair'), 0.2)
place(sfx, whoosh(0.5), LS(3) - 0.15, 0.4); place(sfx, leaves(1.2), WS(3, 'spread'), 0.3); place(sfx, creak(0.6, 120), WS(3, 'stuck'), 0.5); place(sfx, bonk(260), WS(3, 'bayous'), 0.4)
place(sfx, whoosh(0.4), LS(4) - 0.15, 0.4); place(sfx, slide(False, 0.7), WS(4, 'short'), 0.4); place(sfx, bell(660), WS(4, 'meat'), 0.3)
place(sfx, whoosh(0.4), LS(5) - 0.15, 0.4); place(sfx, ting(), WS(5, '1910'), 0.3); place(sfx, scrape(0.5), WS(5, 'bill'), 0.3); place(sfx, boing(170), WS(5, 'import'), 0.4); place(sfx, pop(), WS(5, 'one'), 0.4)
place(sfx, scratch(), LS(6) - 0.1, 0.45); place(sfx, sting(), WS(6, 'stranger'), 0.4)
place(sfx, whoosh(0.4), LS(7) - 0.15, 0.4); place(sfx, thunk(70, 0.4), WS(7, 'enemies'), 0.5); place(sfx, boom(1.0), WS(7, 'war'), 0.25); place(sfx, sting(), WS(7, 'spy'), 0.4)
place(sfx, whoosh(0.4), LS(8) - 0.15, 0.4); place(sfx, bell(990), WS(8, 'teamed'), 0.3); place(sfx, crowd(1.0, 'cheer'), WS(8, 'hippos'), 0.2)
place(sfx, whoosh(0.4), LS(9) - 0.15, 0.4); countup(WS(9, 'million') - 0.3, WS(9, 'million') + 0.7); place(sfx, ting(), WS(9, 'tons'), 0.4)
place(sfx, whoosh(0.4), LS(10) - 0.15, 0.4); place(sfx, gulp(), WS(10, 'tasted'), 0.4); place(sfx, pop(), WS(10, 'pork'), 0.3); place(sfx, pop(), WS(10, 'beef'), 0.3)
place(sfx, whoosh(0.4), LS(11) - 0.15, 0.4); place(sfx, scrape(0.4), LS(11), 0.25); place(sfx, sting(), WS(11, 'lake'), 0.3); place(sfx, boing(200), WS(11, 'bacon'), 0.4)
place(sfx, whoosh(0.4), LS(12) - 0.15, 0.4); place(sfx, chew(1.4, 6), WS(12, 'hippo'), 0.5)
place(sfx, whoosh(0.4), LS(13) - 0.15, 0.4); place(sfx, horn(0.5), WS(13, 'theodore'), 0.3); place(sfx, crowd(1.2, 'cheer'), WS(13, 'backed'), 0.3)
place(sfx, scratch(), LS(14) - 0.1, 0.4); place(sfx, water(1.4), LS(14), 0.25)
place(sfx, thunk(90, 0.3), WS(15, 'nowhere'), 0.7); place(sfx, thunk(120, 0.2), WS(15, 'died'), 0.9); place(sfx, slide(False, 0.7), WS(15, 'not'), 0.4)
place(sfx, whoosh(0.6), LS(16) - 0.15, 0.4); place(sfx, sting(), WS(16, 'americas'), 0.3); place(sfx, pop(), WS(16, 'four'), 0.4); place(sfx, gloop(0.6), WS(16, 'colombia'), 0.4)
place(sfx, whoosh(0.6), LS(17) - 0.15, 0.4); countup(WS(17, 'hundred') - 0.4, WS(17, 'hundred') + 0.4); for_ = [place(sfx, bloop(100 + k * 15), WS(17, 'roam') + k * 0.2, 0.4) for k in range(5)]
place(sfx, whoosh(0.4), LS(18) - 0.15, 0.4); place(sfx, pop(), WS(18, 'follow'), 0.4); place(sfx, gloop(0.6), TM['dur'] - 1.0, 0.35)
mixdown()
