# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(2) - 0.05, 'march', 0.9, 116)                     # the column marches
bed(LS(2), LS(5) - 0.05, 'tension', 0.9, 132)               # rain, the unmarked border, a mile in
bed(LS(5), LS(7) - 0.05, 'quirky', 1.0, 120)                # wrong country, tiptoe home
bed(LS(7), LS(9) - 0.05, 'quirky', 0.9, 96)                 # no army, nobody noticed
bed(LS(9), TM['dur'], 'march', 0.9, 116)                    # the shrug, loop back to the march
place(sfx, water(TM['dur']) * 0.6, 0, 0.35)                 # rain bed all night
place(sfx, footsteps(LS(2), 4, 500), 0, 0.5)
place(sfx, ting(), WS(0, '2007'), 0.4); place(sfx, sting(), WS(0, 'accident'), 0.6)
place(sfx, whoosh(0.6), LS(1) - 0.15, 0.6); place(sfx, footsteps(LE(1) - LS(1), 4, 450), LS(1), 0.6)
place(sfx, rumble(1.5), WS(2, 'pouring'), 0.5); place(sfx, thunk(120, 0.3), WS(2, 'border'), 0.6); place(sfx, ting(), WS(2, 'fence'), 0.4)
place(sfx, whoosh(0.5), LS(3) - 0.15, 0.5); place(sfx, footsteps(LE(3) - LS(3), 4, 480), LS(3), 0.6); place(sfx, pop(), WS(3, 'mile'), 0.4)
place(sfx, rattle(0.5), WS(4, 'rifles'), 0.5); place(sfx, thunk(200, 0.15), WS(4, 'bullet'), 0.6); place(sfx, cuckoo(), WS(4, 'bullet') + 0.25, 0.35)
place(sfx, scrape(0.5), WS(5, 'map') - 0.2, 0.5); place(sfx, sting(), WS(5, 'wrong'), 0.8)
place(sfx, footsteps(LE(6) - WS(6, 'tiptoed'), 3, 1400), WS(6, 'tiptoed'), 0.5)
place(sfx, whoosh(0.7), LS(7) - 0.15, 0.6); place(sfx, bell(660), WS(7, 'liechtenstein'), 0.4); place(sfx, thunk(90, 0.4), WS(7, 'army'), 0.7)
place(sfx, snore(1.1), LS(8), 0.6); place(sfx, snore(1.1), LS(8) + 1.2, 0.6)
place(sfx, crowd(1.2, 'gasp') * 0.6, WS(9, 'spokeswoman'), 0.3); place(sfx, crowd(1.4, 'cheer') * 0.5, WS(9, 'happened') + 0.3, 0.35)
for k in range(3): place(sfx, pop(), WS(9, 'spokeswoman') + 0.3 + k * 0.45, 0.25)
place(sfx, footsteps(TM['dur'] - WS(9, 'happened'), 4, 500), WS(9, 'happened') - 0.2, 0.5)
mixdown()
