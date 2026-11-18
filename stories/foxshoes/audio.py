# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(3) - 0.05, 'quirky', 1.0, 120)            # the mystery in the village
bed(LS(3), LS(7) - 0.4, 'tension', 0.95, 110)        # the night watch, the chase
bed(LS(7), D, 'quirky', 1.05, 126)                   # the shoe mountain
# hook: the sleeping fox on its shoe mountain
place(sfx, snore(1.1), 0.1, 0.45); place(sfx, snore(1.1), 1.6, 0.35); place(sfx, swish(), WS(0, 'village') - 0.25, 0.4); place(sfx, bell(880), WS(0, 'village'), 0.25)
place(sfx, stamp(), WS(0, '117'), 0.55); countup(WS(0, '117'), WS(0, 'shoes'))
# morning: one shoe gone
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, tweet(), LS(1) + 0.1, 0.35); place(sfx, footsteps(1.2, 4, 800), LS(1), 0.3); place(sfx, gasp(), WS(1, 'missing'), 0.5); place(sfx, ting(), WS(1, 'shoe'), 0.3)
place(sfx, scratch(), WS(1, 'never') - 0.1, 0.3); place(sfx, bonk(500), WS(1, 'pair'), 0.35)
# baker vs mailman
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, stamp(), WS(2, 'blamed'), 0.4); vox("You did it!", WS(2, 'mailman') + 0.45, 'am_fenrir', 1.25, 0.7, 1.05)
place(sfx, swish(), WS(2, 'and'), 0.4); place(sfx, boing(240), WS(2, 'baker') + 1.6, 0.35)
# the night watch
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, snap(), WS(3, 'flashlight'), 0.45); place(sfx, hum(1.2), WS(3, 'night'), 0.1); place(sfx, cuckoo(), LS(4) - 0.05, 0.3)
place(sfx, swish(), LS(4) - 0.15, 0.4); place(sfx, snore(1.0), WS(4, '3') + 0.3, 0.3)
for k in range(5): place(sfx, tick(), WS(4, 'tiptoed') + k * 0.2, 0.4)
place(sfx, creak(0.5, 160), WS(4, 'porch'), 0.4)
# grab + run
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, pop(), WS(5, 'grabbed'), 0.55); place(sfx, gasp(), WS(5, 'slipper'), 0.45); place(sfx, footsteps(1.0, 12, 900), WS(5, 'ran'), 0.4); place(sfx, whoosh(0.4), WS(5, 'ran'), 0.4)
vox("Hey!", LS(6) - 0.32, 'am_adam', 1.2, 0.75, 1.05)
# chase into the woods
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(1.8, 10, 600), LS(6), 0.4); place(sfx, leaves(1.2), WS(6, 'woods'), 0.45); place(sfx, bloop(240), WS(6, 'find'), 0.35)
# reveal
place(sfx, scratch(), LS(7) - 0.6, 0.35); place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, sting(), WS(7, 'fox'), 0.35); place(sfx, snore(1.1), WS(7, 'asleep'), 0.45); place(sfx, slide(True, 0.8), WS(7, 'mountain'), 0.35)
# all left shoes
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, flip(), WS(8, 'every'), 0.35); place(sfx, stamp(), WS(8, 'left'), 0.55); place(sfx, boing(180), WS(8, 'shoe'), 0.35)
# loop
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, snore(1.1), LS(9) + 0.3, 0.4); place(sfx, stamp(), WS(9, '117'), 0.45); place(sfx, squeak(), D - 1.1, 0.4)
mixdown()
