# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(2) - 0.05, 'tension', 1.0, 132)                 # the attack
bed(LS(2), LS(5) - 0.05, 'quirky', 1.0, 128)               # fishing, paddle, rabbit retreats
bed(LS(5), LS(7) - 0.05, 'march', 0.9, 112)                # nobody believed him, the photo
bed(LS(7), D, 'quirky', 1.05, 132)                         # the papers go wild, never caught
place(sfx, water(3.0), 0.0, 0.35); place(sfx, sting(), 0.05, 0.35); place(sfx, scratch(), WS(0, 'attacked') - 0.05, 0.35); place(sfx, boing(150), WS(0, 'rabbit'), 0.3)
place(sfx, swish(), WS(0, 'president') - 0.3, 0.45); place(sfx, bonk(500), WS(0, 'president'), 0.4); place(sfx, horn(0.5), WS(0, 'states'), 0.2)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, splash(0.6), WS(1, 'swam'), 0.4); place(sfx, water(1.2), WS(1, 'swam'), 0.35)
place(sfx, scrape(0.6), WS(1, 'hissing'), 0.45); place(sfx, sting(), WS(1, 'teeth'), 0.4); place(sfx, bonk(700), WS(1, 'bared'), 0.3)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, leaves(1.4), LS(2), 0.2); place(sfx, whoosh(0.4), WS(2, 'fishing'), 0.4); place(sfx, bloop(300), WS(2, 'fishing') + 0.4, 0.4); place(sfx, ting(), WS(2, 'georgia'), 0.3)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, thunk(160, 0.2), WS(3, 'grabbed'), 0.5); place(sfx, ting(), WS(3, 'paddle'), 0.25)
for k in range(5): place(sfx, splash(0.4), WS(3, 'splashed') + k * 0.24, 0.45)
place(sfx, boing(220), WS(3, 'crazy'), 0.35)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, slide(True, 0.4), WS(4, 'spun'), 0.4); place(sfx, water(1.5), WS(4, 'paddled'), 0.35); place(sfx, scrape(0.4), WS(4, 'hissing'), 0.35)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, crowd(1.5, 'cheer'), WS(5, 'nobody'), 0.2); place(sfx, scratch(), WS(5, 'killer') - 0.1, 0.4); place(sfx, slide(False, 0.6), WS(5, 'come'), 0.35)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(0.8, 5, 500), LS(6), 0.4); place(sfx, pop(), WS(6, 'snapped'), 0.4); place(sfx, ting(), WS(6, 'snapped') + 0.05, 0.3); place(sfx, sting(), WS(6, 'fight'), 0.35)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, sting(), WS(7, 'leaked'), 0.3); place(sfx, flip(), WS(7, 'newspapers'), 0.5); place(sfx, crowd(1.4, 'cheer'), WS(7, 'wild'), 0.3); place(sfx, horn(0.4), WS(7, 'america'), 0.25)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, flip(), LS(8), 0.5); place(sfx, stamp(), WS(8, 'bunny'), 0.5); place(sfx, boing(180), WS(8, 'bugs'), 0.4); place(sfx, stamp(), WS(8, 'attacks'), 0.5)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, sting(), WS(9, 'never'), 0.4); place(sfx, bonk(420), WS(9, 'caught'), 0.4); place(sfx, splash(0.6), D - 0.8, 0.4); place(sfx, water(0.8), D - 0.8, 0.3)
mixdown()
