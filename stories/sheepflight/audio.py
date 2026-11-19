# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
UP, RIP, FIND = WS(5, 'shoots'), WS(5, 'rips'), WS(10, 'find')
bed(0, LS(3) - 0.1, 'quirky', 0.85, 120)                    # a royal fair
bed(LS(3) - 0.1, LS(7) - 0.1, 'tension', 1.0, 124)           # poison warning -> launch -> rip
bed(LS(7) - 0.1, FIND - 0.2, 'tension', 0.85, 132)           # why animals + the ride, rising
bed(FIND, D, 'march', 1.0, 124)                              # found them: triumphant
# hook: the basket in the sky
place(sfx, baa(), 0.5, 0.5); place(sfx, quack(), 1.4, 0.45); place(sfx, cluck(), 2.2, 0.45); place(sfx, swish(), 1.7, 0.4)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, creak(0.6, 140), LS(1) + 0.3, 0.4); place(sfx, hum(1.6), WS(1, 'nobody'), 0.3); place(sfx, baa(), WS(1, 'kill') + 0.2, 0.4)
# crowd + king
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, countup(WS(2, '130') - 0.1, WS(2, 'people'), 0.5) if False else ting(), WS(2, 'people'), 0.3)
place(sfx, horn(0.8), WS(2, 'king'), 0.3); place(sfx, bell(1320), WS(2, 'king') + 0.1, 0.25)
# poison warning
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, scratch(), WS(3, 'poison') - 0.2, 0.35); place(sfx, sub(0.6, 45), WS(3, 'poison'), 0.5)
# fire: straw, wool, old shoes
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, rumble(2.2), WS(4, 'smoke'), 0.3); place(sfx, bonk(), WS(4, 'shoes'), 0.4); place(sfx, swish(), WS(4, 'wool') - 0.2, 0.4)
# launch + rip
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, slide(True, 0.9), UP, 0.5); place(sfx, whoosh(0.8), UP, 0.5); place(sfx, sub(0.8, 42), UP, 0.6)
place(sfx, swish(), WS(5, 'crowd') - 0.15, 0.4); place(sfx, cluck(), WS(5, 'crowd') + 0.3, 0.3)
place(sfx, swish(), WS(5, 'gust') - 0.15, 0.4); place(sfx, whoosh(0.9), WS(5, 'gust'), 0.5); place(sfx, scrape(0.6), RIP, 0.6); place(sfx, thunk(60, 0.4), RIP, 0.7); place(sfx, sub(0.7, 38), RIP, 0.7)
# drift away
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, leaves(2.0), LS(6), 0.2); place(sfx, slide(False, 0.7), WS(6, 'vanishes'), 0.35)
# why animals
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, bloop(240), WS(7, 'first'), 0.35)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, baa(), WS(8, 'sheep') + 0.2, 0.45); place(sfx, swish(), WS(8, 'duck') - 0.15, 0.4); place(sfx, quack(), WS(8, 'duck') + 0.25, 0.45)
place(sfx, swish(), WS(8, 'rooster') - 0.15, 0.4); place(sfx, cluck(), WS(8, 'rooster') + 0.25, 0.45); place(sfx, boing(240), WS(8, 'between'), 0.35)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, ting(), WS(9, 'safe'), 0.35)
# gallop
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, neigh(), LS(10) + 0.1, 0.45)
for t in np.arange(LS(10), FIND, 0.17): place(sfx, stomp(0.5), t, 0.35)
place(sfx, hum(FIND - LS(10)), LS(10), 0.25)
place(sfx, thunk(60, 0.5), FIND, 0.6); place(sfx, sub(0.8, 40), FIND, 0.6); place(sfx, swish(), FIND - 0.15, 0.4)
# payoff
place(sfx, chew(1.4), LS(11), 0.45); place(sfx, swish(), WS(11, 'duck') - 0.15, 0.4); place(sfx, quack(), WS(11, 'fine'), 0.5)
place(sfx, swish(), WS(11, 'rooster') - 0.15, 0.4); place(sfx, cluck(), WS(11, 'grumpy'), 0.5); place(sfx, bonk(), WS(11, 'sat'), 0.5); place(sfx, sub(0.4, 50), WS(11, 'sat'), 0.4)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, crowd(1.4, 'cheer'), LS(12) + 0.3, 0.0); place(sfx, ting(), WS(12, 'flew'), 0.35)
place(sfx, swish(), WS(12, 'but') - 0.15, 0.5); place(sfx, baa(), WS(12, 'first') + 0.35, 0.55)
mixdown()
