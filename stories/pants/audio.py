# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(2) - 0.05, 'quirky', 1.0, 122)                  # pants going bang in the field
bed(LS(2), LS(6) - 0.05, 'march', 0.9, 108)                # the weedkiller, the government, the spray
bed(LS(6), LS(8) - 0.05, 'tension', 0.9, 126)             # smoking washing line, bang by the fire
bed(LS(8), TM['dur'], 'quirky', 1.0, 118)                  # the Ig Nobel paper, loop
place(sfx, boom(1.2), 0.0, 0.6); place(sfx, crowd(1.2, 'gasp'), 0.3, 0.25); place(sfx, squawk(), 0.5, 0.2)
place(sfx, ting(), WS(0, 'new'), 0.3); place(sfx, boing(200), WS(0, 'pants'), 0.4); place(sfx, pop(), WS(0, 'exploding'), 0.5)
place(sfx, whoosh(0.4), LS(1) - 0.15, 0.4); place(sfx, footsteps(0.8, 4, 500), LS(1), 0.2); place(sfx, boom(1.0), WS(1, 'bang'), 0.8); place(sfx, bonk(360), WS(1, 'wearing'), 0.4)
place(sfx, whoosh(0.4), LS(2) - 0.15, 0.4); place(sfx, sting(), WS(2, 'weedkiller'), 0.4); place(sfx, ting(), WS(2, 'sodium'), 0.3)
place(sfx, whoosh(0.4), LS(3) - 0.15, 0.4); place(sfx, ting(), WS(3, '1930s'), 0.3); place(sfx, horn(0.5), WS(3, 'government'), 0.25); place(sfx, whoosh(0.5), WS(3, 'ragwort') - 0.15, 0.4)
place(sfx, whoosh(0.4), LS(4) - 0.15, 0.4); place(sfx, water(1.6), LS(4), 0.35); place(sfx, slide(False, 0.5), WS(4, 'killed'), 0.35); place(sfx, gloop(0.6), WS(4, 'soaked'), 0.5)
place(sfx, whoosh(0.4), LS(5) - 0.15, 0.4); place(sfx, scrape(0.3), WS(5, 'match') - 0.1, 0.5); place(sfx, roar(0.8, 900), WS(5, 'match') + 0.1, 0.4)
place(sfx, scratch(), LS(6) - 0.1, 0.45); place(sfx, sting(), WS(6, 'worse'), 0.4); place(sfx, leaves(1.0), WS(6, 'washing'), 0.2); place(sfx, hum(1.2), WS(6, 'smoking'), 0.2); place(sfx, crowd(0.9, 'gasp'), WS(6, 'smoking') + 0.2, 0.2)
place(sfx, whoosh(0.4), LS(7) - 0.15, 0.4); place(sfx, roar(2.0, 700), LS(7), 0.25); place(sfx, boom(1.6), WS(7, 'bang'), 0.9); place(sfx, bonk(300), WS(7, 'bang') + 0.4, 0.4)
place(sfx, whoosh(0.5), LS(8) - 0.15, 0.4); place(sfx, ting(), WS(8, 'seventy'), 0.3); place(sfx, scrape(0.5), WS(8, 'paper'), 0.25); place(sfx, bell(1320), WS(8, 'ig'), 0.4); place(sfx, crowd(1.5, 'cheer'), WS(8, 'prize'), 0.25)
place(sfx, whoosh(0.4), LS(9) - 0.15, 0.4); place(sfx, ting(), WS(9, 'title'), 0.3); place(sfx, pop(), WS(9, 'exploding'), 0.4); place(sfx, boom(1.0), TM['dur'] - 0.45, 0.5)
mixdown()
