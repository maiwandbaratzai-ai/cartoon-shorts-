# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 0.8, 100)
bed(LS(1), LS(3) - 0.05, 'march', 0.95, 128)
bed(LS(3), TM['dur'], 'quirky', 1.0, 112)
for k in range(6): place(sfx, bonk(520 + 40 * (k % 2)), 0.25 + k * 0.6, 0.25)          # pick strikes while he digs
place(sfx, thunk(90, 0.4), WS(1, 'hit'), 0.8); place(sfx, sting(), WS(1, 'gold'), 0.5); place(sfx, ting(), WS(1, 'gold') + 0.1, 0.4)
place(sfx, swish(), LS(2) - 0.2, 0.6)
for k in range(8): place(sfx, thunk(160, 0.12), WS(2, 'sprinted') + k * 0.16, 0.35)    # running footsteps
place(sfx, swish(), LS(3) - 0.15, 0.5); countup(WS(3, 'counted'), WS(3, 'grinning'))
place(sfx, scratch(), LS(4) - 0.15, 0.45); place(sfx, bonk(300), WS(4, 'kept') + 0.5, 0.5); place(sfx, slide(False, 0.7), WS(4, 'all') + 0.4, 0.4)

mixdown()
