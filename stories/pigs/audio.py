# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(4) - 0.05, 'quirky', 1.0, 132)                  # escape, river, gardens, chase
bed(LS(4), LS(5) - 0.05, 'march', 1.0, 120)                # the papers name them
bed(LS(5), LS(8) - 0.3, 'tension', 0.9, 120)               # dart, caught, back to the butcher?
bed(LS(8), D, 'quirky', 1.05, 128)                         # bought, farm, never bacon
# hook: running trotters + camera flashes
place(sfx, footsteps(3.6, 11, 600), 0.0, 0.45)
for t in np.arange(0.2, 3.6, 0.47): place(sfx, ting(), t, 0.12); place(sfx, pop(), t, 0.15)
place(sfx, crowd(1.5, 'cheer'), 0.2, 0.12); place(sfx, swish(), WS(0, 'malmesbury') - 0.25, 0.5); place(sfx, stamp(), WS(0, 'wanted'), 0.6); place(sfx, sting(), WS(0, 'wanted') + 0.1, 0.3)
# fence + river
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, creak(0.5, 180), WS(1, 'squeezed'), 0.5); place(sfx, slide(False, 0.5), WS(1, 'squeezed') + 0.1, 0.35); place(sfx, bonk(300), WS(1, 'fence'), 0.4)
place(sfx, swish(), WS(1, 'swam') - 0.27, 0.5); place(sfx, splash(1.0), WS(1, 'swam'), 0.5); place(sfx, water(1.4), WS(1, 'swam') + 0.2, 0.4); place(sfx, boing(260), WS(1, 'freezing'), 0.35)
# gardens
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, leaves(1.0), WS(2, 'vanished'), 0.5); place(sfx, footsteps(0.8, 6, 500), LS(2), 0.25); place(sfx, slide(False, 0.5), WS(2, 'back'), 0.35)
# reporters + chase
place(sfx, swish(), LS(3) - 0.15, 0.5)
for k in range(5): place(sfx, ting(), WS(3, 'reporters') + 0.2 + k * 0.33, 0.18); place(sfx, pop(), WS(3, 'reporters') + 0.2 + k * 0.33, 0.2)
place(sfx, footsteps(1.6, 10, 600), WS(3, 'chased'), 0.5); place(sfx, leaves(1.2), WS(3, 'hedges'), 0.5); place(sfx, crowd(1.2, 'cheer'), WS(3, 'chased'), 0.15)
# papers
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, flip(), WS(4, 'papers'), 0.6); place(sfx, stamp(), WS(4, 'butch'), 0.5); place(sfx, stamp(), WS(4, 'sundance'), 0.5); place(sfx, horn(0.4), WS(4, 'pig'), 0.25)
# dart
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, scratch(), WS(5, 'weirder') - 0.1, 0.4); place(sfx, gunshot(), WS(5, 'shot'), 0.35); place(sfx, whoosh(0.3), WS(5, 'shot') + 0.05, 0.4)
place(sfx, bonk(520), WS(5, 'sundance'), 0.6); place(sfx, boing(150), WS(5, 'sundance') + 0.1, 0.45); place(sfx, sting(), WS(5, 'dart'), 0.3)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(1.4, 9, 650), LS(6), 0.45); place(sfx, slide(True, 0.5), WS(6, 'slowed'), 0.35)
# caught + butcher
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, thunk(90, 0.3), WS(7, 'caught'), 0.6); place(sfx, bell(660), WS(7, 'week'), 0.25); place(sfx, sting(), WS(7, 'butcher'), 0.4); place(sfx, scrape(0.5), WS(7, 'butcher') + 0.3, 0.3)
# bought + farm
place(sfx, scratch(), LS(8) - 0.12, 0.45); place(sfx, stamp(), WS(8, 'bought'), 0.5); place(sfx, bell(1320), WS(8, 'bought') + 0.15, 0.3); place(sfx, swish(), WS(8, 'retired') - 0.27, 0.5)
place(sfx, footsteps(0.8, 9, 600), WS(8, 'retired'), 0.4); place(sfx, gloop(0.8), WS(8, 'farm'), 0.6); place(sfx, splat(), WS(8, 'farm'), 0.4)
place(sfx, gloop(0.6), LS(9), 0.35); place(sfx, crowd(1.0, 'cheer'), WS(9, 'never'), 0.2); place(sfx, boing(200), WS(9, 'bacon'), 0.45); place(sfx, footsteps(1.0, 11, 600), D - 0.9, 0.4)
mixdown()
