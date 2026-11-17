# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(2) - 0.05, 'march', 1.0, 116)                   # soldier bear, beer, trucks
bed(LS(2), LS(5) - 0.05, 'quirky', 0.95, 112)              # cub, milk, sleeping
bed(LS(5), LS(8) - 0.05, 'quirky', 1.05, 132)              # grows, fruit, wrestling, showers
bed(LS(8), LS(10) - 0.05, 'tension', 0.95, 124)            # the spy
bed(LS(10), LS(12) - 0.05, 'march', 0.95, 120)             # no pets -> enlisted
bed(LS(12), LS(16) - 0.05, 'dark', 0.9, 100)               # Monte Cassino, the crates
bed(LS(16), LS(18) - 0.05, 'march', 1.05, 124)             # the badge
bed(LS(18), D, 'quirky', 1.0, 116)                         # zoo, follow
# hook: battlefield + promotion
place(sfx, boom(1.5), 0.1, 0.3); place(sfx, footsteps(2.0, 4, 420), 0.0, 0.5); place(sfx, crowd(1.2, 'cheer'), WS(0, 'army'), 0.2)
place(sfx, swish(), WS(0, 'promoted') - 0.3, 0.45); place(sfx, stamp(), WS(0, 'promoted'), 0.5); place(sfx, bell(990), WS(0, 'promoted') + 0.1, 0.3)
# beer, truck
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, pop(), WS(1, 'beer') - 0.2, 0.4); place(sfx, gulp(), WS(1, 'bottle'), 0.6); place(sfx, gulp(), WS(1, 'bottle') + 0.35, 0.5)
place(sfx, swish(), WS(1, 'rode') - 0.3, 0.45); place(sfx, engine(2.0, 36), WS(1, 'rode'), 0.4); place(sfx, horn(0.5), WS(1, 'trucks'), 0.3)
# Iran, chocolate, cub
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, footsteps(1.6, 4, 500), LS(2), 0.35); place(sfx, ting(), WS(2, 'iran'), 0.3); place(sfx, scrape(0.3), WS(2, 'chocolate'), 0.3); place(sfx, chew(0.8, 6), WS(2, 'chocolate') + 0.4, 0.4); place(sfx, boing(260), WS(2, 'cub'), 0.4)
# milk
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, gulp(), WS(3, 'milk'), 0.5); place(sfx, gulp(), WS(3, 'milk') + 0.4, 0.4); place(sfx, sting(), WS(3, 'vodka'), 0.3)
# night
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, snore(1.2), WS(4, 'curled'), 0.4); place(sfx, snore(1.2), WS(4, 'soldiers') + 0.2, 0.35); place(sfx, crackle := rattle(1.6), LS(4), 0.12); place(sfx, boing(150), WS(4, 'dog'), 0.3)
# grows
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, slide(True, 1.0), WS(5, 'grew'), 0.45); place(sfx, thunk(70, 0.4), WS(5, 'taller'), 0.5)
# fruit + wrestle
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, chew(1.0, 6), WS(6, 'fruit'), 0.5); place(sfx, swish(), WS(6, 'wrestled') - 0.3, 0.45); place(sfx, bonk(300), WS(6, 'wrestled') + 0.2, 0.5); place(sfx, thunk(90, 0.3), WS(6, 'dared'), 0.6); place(sfx, crowd(1.0, 'cheer'), WS(6, 'dared'), 0.2)
# shower
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, creak(0.3, 300), WS(7, 'turn'), 0.4); place(sfx, water(2.0), WS(7, 'turn') + 0.1, 0.5); place(sfx, boing(220), WS(7, 'himself'), 0.35)
# spy
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, footsteps(1.0, 3, 380), LS(8), 0.4); place(sfx, scratch(), WS(8, 'spy') - 0.1, 0.45); place(sfx, sting(), WS(8, 'spy'), 0.35)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, roar(1.2, 700), WS(9, 'roared'), 0.6); place(sfx, rumble(1.0), WS(9, 'roared'), 0.4); place(sfx, slide(True, 0.5), WS(9, 'screamed'), 0.4)
place(sfx, footsteps(1.0, 10, 600), WS(9, 'screamed'), 0.4); place(sfx, swish(), WS(9, 'screamed') - 0.25, 0.4); place(sfx, bonk(350), WS(9, 'grabbed'), 0.5)
# ship + enlist
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, horn(1.0), WS(10, 'ship'), 0.35); place(sfx, gull(), WS(10, 'italy'), 0.25); place(sfx, stamp(), WS(10, 'no'), 0.6)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, scrape(0.6), WS(11, 'enlisted'), 0.3); place(sfx, stamp(), WS(11, 'private'), 0.6); place(sfx, bell(880), WS(11, 'rank'), 0.3); place(sfx, ting(), WS(11, 'number'), 0.3)
# Monte Cassino
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, boom(2.0), LS(12) + 0.2, 0.4); place(sfx, boom(1.5), LS(12) + 1.0, 0.3)
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, footsteps(3.0, 3, 420), LS(13), 0.45); place(sfx, boom(1.5), WS(13, 'crates'), 0.25); place(sfx, thunk(80, 0.3), WS(13, 'shells'), 0.5)
place(sfx, swish(), LS(14) - 0.15, 0.5); place(sfx, thunk(90, 0.3), WS(14, 'grabbed'), 0.6); place(sfx, ting(), WS(14, 'grabbed') + 0.2, 0.3)
place(sfx, swish(), WS(14, 'another') - 0.3, 0.45); place(sfx, thunk(100, 0.3), WS(14, 'another'), 0.6); place(sfx, swish(), F(1346) - 0.3, 0.45); place(sfx, thunk(110, 0.3), F(1346), 0.6); place(sfx, crowd(1.0, 'cheer'), F(1346), 0.25)
place(sfx, swish(), LS(15) - 0.15, 0.5); place(sfx, footsteps(1.6, 3, 380), LS(15), 0.45); place(sfx, sting(), WS(15, 'dropped'), 0.35); place(sfx, boom(1.2), WS(15, 'single'), 0.2)
# badge
place(sfx, swish(), LS(16) - 0.15, 0.5); place(sfx, stamp(), WS(16, 'badge'), 0.6); place(sfx, bell(990), WS(16, 'shell'), 0.3)
place(sfx, swish(), LS(17) - 0.15, 0.5); place(sfx, engine(0.6, 40), WS(17, 'trucks'), 0.35); place(sfx, swish(), WS(17, 'flags') - 0.3, 0.45); place(sfx, flip(), WS(17, 'flags'), 0.5); place(sfx, swish(), WS(17, 'jackets') - 0.3, 0.45); place(sfx, pop(), WS(17, 'jackets'), 0.4)
# zoo
place(sfx, swish(), LS(18) - 0.15, 0.5); place(sfx, gull(), WS(18, 'scottish'), 0.25); place(sfx, ting(), WS(18, 'zoo'), 0.3)
place(sfx, swish(), LS(19) - 0.15, 0.5); place(sfx, crowd(1.2, 'cheer'), WS(19, 'chatted'), 0.2); place(sfx, whoosh(0.5), WS(19, 'tossed'), 0.4); place(sfx, chew(0.9, 6), WS(19, 'treats') + 0.3, 0.5); place(sfx, gulp(), WS(19, 'treats') + 1.1, 0.4)
place(sfx, swish(), LS(20) - 0.15, 0.5); place(sfx, stamp(), WS(20, 'corporal'), 0.5); place(sfx, bell(1320), WS(20, 'corporal') + 0.15, 0.3)
place(sfx, swish(), LS(21) - 0.15, 0.5); place(sfx, pop(), WS(21, 'follow'), 0.45); place(sfx, boing(200), D - 0.8, 0.3)
mixdown()
