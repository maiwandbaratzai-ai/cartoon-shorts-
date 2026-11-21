# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def waves(t0, d, g=0.25): place(sfx, water(d), t0, g)
def fire(t0, d, g=0.4): place(sfx, lp_fast(noise(d), 1500) * env(int(d * SR), 0.3, 0.5) * (0.6 + 0.4 * np.abs(np.sin(np.arange(int(d * SR)) / SR * 9))), t0, g)
def dig(t, g=0.4): place(sfx, scrape(0.5), t, g); place(sfx, thunk(70, 0.3), t + 0.1, g)
bed(0, LS(3) - 0.1, 'tension', 0.9, 120)
bed(LS(3) - 0.1, LS(6) - 0.1, 'quirky', 1.0, 132)
bed(LS(6) - 0.1, LS(8) - 0.1, 'sad', 0.85, 92)
bed(LS(8) - 0.1, LS(10) - 0.1, 'quirky', 1.0, 128)
bed(LS(10) - 0.1, LS(11) - 0.15, 'tension', 1.2, 146)
bed(LS(11) + 0.5, LS(12) - 0.18, 'tension', 0.7, 110)
bed(LS(12), LS(14) - 0.1, 'march', 1.05, 124)
bed(LS(14) - 0.1, LS(16) - 0.1, 'tension', 1.1, 136)
bed(LS(16) - 0.1, D, 'quirky', 1.0, 128)
# L0-2 the dig
place(sfx, engine(LS(1), 34), 0, 0.3); dig(0.35); place(sfx, swish(), WS(0, 'skyscrapers') - 0.15, 0.4); place(sfx, whoosh(0.8), WS(0, 'skyscrapers'), 0.3)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, engine(LS(3) - LS(1), 34), LS(1), 0.25); dig(WS(1, 'dig')); place(sfx, swish(), WS(1, 'hit') - 0.15, 0.4)
place(sfx, thunk(60, 0.45), WS(1, 'hit'), 0.8); place(sfx, sub(0.8, 38), WS(1, 'hit'), 0.7); place(sfx, creak(0.7), WS(1, 'bow'), 0.4)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, thunk(80, 0.3), WS(2, 'another'), 0.5); place(sfx, thunk(90, 0.3), WS(2, 'and'), 0.5); place(sfx, swish(), WS(2, 'dozens') - 0.15, 0.45); place(sfx, stamp(), WS(2, 'dozens'), 0.45); place(sfx, sub(0.5, 44), WS(2, 'dozens'), 0.5)
# L3 gold
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, water(1.5), LS(3), 0.3); place(sfx, swish(), WS(3, 'gold') - 0.15, 0.4); place(sfx, ting(), WS(3, 'gold'), 0.6); place(sfx, bell(1760), WS(3, 'gold') + 0.08, 0.35)
# L4-5 ships race in, everyone runs
place(sfx, swish(), LS(4) - 0.15, 0.5); waves(LS(4), LS(6) - LS(4), 0.3); place(sfx, whoosh(1.0), LS(4) + 0.2, 0.35); place(sfx, horn(0.9), WS(4, 'bay'), 0.35); place(sfx, gull(), WS(4, 'bay') + 0.4, 0.3)
place(sfx, swish(), WS(4, 'docked') - 0.15, 0.4); place(sfx, thunk(90, 0.35), WS(4, 'docked'), 0.5); place(sfx, swish(), WS(4, 'ran') - 0.15, 0.4); place(sfx, footsteps(LS(6) - WS(4, 'ran'), 10, 700), WS(4, 'ran'), 0.45)
place(sfx, swish(), LS(5) - 0.15, 0.45); place(sfx, swish(), WS(5, 'cooks') - 0.15, 0.4); place(sfx, bonk(500), WS(5, 'cooks'), 0.3); place(sfx, swish(), WS(5, 'captains') - 0.15, 0.4); place(sfx, boing(220), WS(5, 'captains') + 0.1, 0.4)
# L6-7 the empty fleet + mockery
place(sfx, swish(), LS(6) - 0.15, 0.5); waves(LS(6), LS(8) - LS(6), 0.3); place(sfx, creak(1.0, 120), LS(6) + 0.5, 0.35); place(sfx, gull(), WS(6, 'nobody') + 0.1, 0.4); place(sfx, swish(), WS(6, 'nobody') - 0.15, 0.4)
for k in range(2): place(sfx, tweet(), WS(6, 'nobody') + 0.4 + k * 0.3, 0.3)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, bonk(), WS(7, 'laugh'), 0.3); place(sfx, swish(), WS(7, 'leave') - 0.15, 0.4); place(sfx, rattle(0.8), WS(7, 'leave'), 0.35)
# L8-9 people move in: hotel, store, jail
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, footsteps(1.8, 9, 750), LS(8) + 0.2, 0.35); place(sfx, swish(), WS(8, 'move') - 0.15, 0.4); place(sfx, creak(0.5, 180), WS(8, 'ships'), 0.3)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, bell(1320), WS(9, 'hotel'), 0.4); place(sfx, swish(), WS(9, 'store') - 0.15, 0.45); place(sfx, ting(), WS(9, 'store'), 0.35)
place(sfx, swish(), WS(9, 'jail') - 0.15, 0.45); place(sfx, thunk(70, 0.4), WS(9, 'jail'), 0.6); place(sfx, rattle(0.5), WS(9, 'jail') + 0.1, 0.4); place(sfx, sub(0.5, 44), WS(9, 'jail'), 0.5)
# L10 fire; L11 [beat] why?
place(sfx, swish(), LS(10) - 0.15, 0.5); fire(LS(10), LS(11) - LS(10) + 0.5, 0.5); place(sfx, boom(1.6), WS(10, 'fire'), 0.45); place(sfx, sub(0.9, 36), WS(10, 'fire'), 0.7)
place(sfx, swish(), WS(10, 'burn') - 0.15, 0.4); place(sfx, crash(0.9), WS(10, 'burn'), 0.35); place(sfx, swish(), WS(10, 'waterline') - 0.2, 0.4)
place(sfx, scratch(), LS(11) - 0.3, 0.35); place(sfx, swish(), LS(11) - 0.15, 0.45); place(sfx, hum(1.5), LS(11), 0.3)
# L12 landfill
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, neigh(), LS(12) + 0.3, 0.45); place(sfx, footsteps(2.0, 5, 400), LS(12), 0.35); place(sfx, rumble(2.0), WS(12, 'dumped'), 0.45); place(sfx, sub(1.0, 38), WS(12, 'dumped'), 0.6)
place(sfx, swish(), WS(12, 'bay') - 0.15, 0.45); place(sfx, rumble(1.6), WS(12, 'bay'), 0.4); place(sfx, swish(), WS(12, 'top') - 0.15, 0.45); place(sfx, thunk(60, 0.45), WS(12, 'ships'), 0.7); place(sfx, stomp(1.0), WS(12, 'ships'), 0.5)
# L13 the city rises (payoff 1)
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, slide(True, 1.6), LS(13) + 0.1, 0.4)
for k in range(5): place(sfx, stomp(0.8), LS(13) + 0.3 + k * 0.35, 0.4)
place(sfx, swish(), WS(13, 'forgets') - 0.15, 0.45); place(sfx, footsteps(1.2, 7, 900), WS(13, 'forgets'), 0.3)
# L14 the digger hits one again
place(sfx, swish(), LS(14) - 0.15, 0.5); place(sfx, engine(1.4, 34), LS(14), 0.3); place(sfx, thunk(55, 0.5), WS(14, 'hits'), 0.8); place(sfx, sub(0.9, 36), WS(14, 'hits'), 0.8)
place(sfx, swish(), WS(14, 'bottles') - 0.15, 0.45); place(sfx, bell(2400), WS(14, 'bottles'), 0.3); place(sfx, bell(2800), WS(14, 'bottles') + 0.12, 0.3); place(sfx, bonk(300), WS(14, 'boots'), 0.35)
# L15 trains through the hull (payoff 2)
place(sfx, swish(), LS(15) - 0.15, 0.5); place(sfx, rumble(2.8), LS(15), 0.5); place(sfx, engine(2.8, 50), LS(15), 0.35); place(sfx, horn(0.8), WS(15, 'trains'), 0.4)
place(sfx, swish(), WS(15, 'hull') - 0.15, 0.45); place(sfx, boom(1.2), WS(15, 'hull'), 0.4); place(sfx, sub(0.8, 38), WS(15, 'hull'), 0.6)
# L16 follow + look down (loops to the dig)
place(sfx, swish(), LS(16) - 0.15, 0.5); place(sfx, footsteps(2.0, 4, 900), LS(16) + 0.2, 0.3); place(sfx, swish(), WS(16, 'look') - 0.15, 0.45); place(sfx, slide(False, 0.8), WS(16, 'down'), 0.4); place(sfx, engine(D - WS(16, 'down'), 34), WS(16, 'down'), 0.25)
mixdown()
