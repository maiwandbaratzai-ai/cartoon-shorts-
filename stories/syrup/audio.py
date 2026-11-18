# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(3) - 0.05, 'quirky', 1.0, 118)            # the reserve
bed(LS(3), LS(7) - 0.05, 'tension', 0.95, 118)       # the climb, the light barrel, water
bed(LS(7), LS(10) - 0.05, 'dark', 0.9, 112)          # the heist at night
bed(LS(10), D, 'quirky', 1.05, 124)                  # nobody noticed (loop)
# hook: a barrel floating off the stack
place(sfx, boing(160, 0.8), 0.1, 0.45); place(sfx, slide(True, 0.7), 0.3, 0.35); place(sfx, stamp(), WS(0, '18'), 0.55); place(sfx, bell(1760), WS(0, 'dollars'), 0.3)
countup(WS(0, '18'), WS(0, 'dollars'), 0.5)
place(sfx, swish(), WS(0, 'nobody') - 0.25, 0.4); place(sfx, snore(1.1), WS(0, 'nobody') + 0.1, 0.5)
# thousands of barrels
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, slide(True, 0.9), LS(1) + 0.2, 0.3); place(sfx, stamp(), WS(1, 'thousands'), 0.45); place(sfx, ting(), WS(1, 'ceiling'), 0.3)
# the reserve + the sleeping guard and his dog
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, horn(0.5), WS(2, 'emergency'), 0.2); place(sfx, swish(), WS(2, 'guarded') - 0.25, 0.4)
place(sfx, snore(1.1), WS(2, 'guarded') + 0.1, 0.55); place(sfx, bark(), WS(2, 'night') + 0.2, 0.25); place(sfx, snore(1.0), WS(2, 'night') + 0.4, 0.35)
# the climb
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, footsteps(0.8, 5, 700), LS(3), 0.3)
for k in range(6): place(sfx, ting(), WS(3, 'climbed') + k * 0.28, 0.12); place(sfx, thunk(220, 0.1), WS(3, 'climbed') + k * 0.28, 0.25)
place(sfx, flip(), WS(3, 'count'), 0.35)
# bump: the barrel flies off like a balloon
place(sfx, bonk(360), WS(4, 'bumped'), 0.55); place(sfx, swish(), WS(4, 'flew') - 0.15, 0.4); place(sfx, slide(True, 1.0), WS(4, 'flew'), 0.5); place(sfx, boing(300, 0.8), WS(4, 'balloon'), 0.5); place(sfx, gasp(), WS(4, 'balloon') + 0.3, 0.4)
# too light, pry it open
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, bloop(260), WS(5, 'light'), 0.4); place(sfx, swish(), WS(5, 'pried') - 0.25, 0.35); place(sfx, creak(0.5, 300), WS(5, 'pried'), 0.5); place(sfx, snap(), WS(5, 'open'), 0.4)
# water!
place(sfx, scratch(), LS(6) - 0.6, 0.35); place(sfx, splash(0.8), WS(6, 'water'), 0.6); place(sfx, sting(), WS(6, 'water') + 0.05, 0.3)
place(sfx, swish(), WS(6, 'another') - 0.25, 0.35); place(sfx, creak(0.4, 320), WS(6, 'another'), 0.4); place(sfx, splash(0.7), WS(6, 'again') - 0.2, 0.55); place(sfx, bonk(260), WS(6, 'again') + 0.2, 0.35)
# where did it go?
place(sfx, swish(), LS(7) - 0.15, 0.5); vox("Huh?!", LS(7) - 0.42, 'am_michael', 1.2, 0.75, 1.1); place(sfx, bloop(200), WS(7, 'go'), 0.35)
# the heist
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, gloop(1.4), WS(8, 'siphoned'), 0.5); place(sfx, footsteps(0.8, 4, 400), LS(8), 0.25); place(sfx, water(1.2), WS(8, 'refilling'), 0.4); place(sfx, swish(), WS(8, 'refilling') - 0.25, 0.35)
vox("Hee hee!", LS(9) - 0.3, 'am_fenrir', 1.3, 0.6, 1.2)
# the trucks
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, engine(2.4, 40), WS(9, 'truck'), 0.45); place(sfx, horn(0.4), WS(9, 'noses') - 0.3, 0.3)
# loop: the guard still asleep
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, snore(1.1), LS(10) + 0.3, 0.5); place(sfx, snore(1.1), LS(10) + 1.6, 0.4); place(sfx, boing(150), D - 0.9, 0.35)
mixdown()
