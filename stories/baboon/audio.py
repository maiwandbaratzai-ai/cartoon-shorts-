# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(4) - 0.05, 'quirky', 1.0, 124)                 # baboon at work, trolley, copying
bed(LS(4), LS(5) - 0.05, 'march', 1.0, 132)               # the train whistles, lever four
bed(LS(5), LS(7) - 0.4, 'tension', 0.9, 110)              # passenger screams, inspector
bed(LS(7), D, 'quirky', 1.05, 128)                        # the test, hired, no mistakes
# hook: levers clunk, signal drops
for t in (F(14), F(40), F(64)): place(sfx, thunk(110, 0.25), t, 0.6); place(sfx, creak(0.3, 200), t - 0.05, 0.3)
place(sfx, pop(), WS(0, 'nine'), 0.4); place(sfx, creak(0.5, 160), F(80), 0.4); place(sfx, thunk(70, 0.3), F(90), 0.5); place(sfx, horn(0.5), WS(0, 'signals'), 0.25)
# trolley
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, rattle(2.6), LS(1), 0.25); place(sfx, footsteps(2.0, 7, 700), LS(1), 0.35)
place(sfx, footsteps(1.0, 11, 700), WS(1, 'little'), 0.35); place(sfx, bonk(380), WS(2, 'wooden'), 0.5); place(sfx, bonk(330), WS(2, 'wooden') + 0.25, 0.4)
place(sfx, boing(200), WS(2, 'jack'), 0.4); place(sfx, footsteps(1.6, 12, 650), WS(2, 'jack'), 0.35); place(sfx, rattle(1.6), WS(2, 'jack'), 0.25)
# cabin, copying
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, thunk(110, 0.25), F(LS(3) * 30 + 14) if False else LS(3) + 0.45, 0.5)
place(sfx, thunk(120, 0.25), WS(3, 'copying'), 0.6); place(sfx, creak(0.4, 220), WS(3, 'copying'), 0.3); place(sfx, ting(), WS(3, 'levers'), 0.3); place(sfx, boing(240), WS(3, 'levers') + 0.3, 0.35)
# train whistle x4 and lever four
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, engine(2.5, 40), LS(4), 0.3)
for k in range(4): place(sfx, horn(0.22), WS(4, 'whistled') + k * 0.28, 0.35)
place(sfx, thunk(90, 0.35), WS(4, 'yanked'), 0.8); place(sfx, creak(0.4, 180), WS(4, 'yanked') - 0.05, 0.4); place(sfx, swish(), WS(4, 'lever') + 0.0, 0.5)
place(sfx, rumble(1.4), WS(4, 'lever') + 0.1, 0.4); place(sfx, whoosh(0.8), WS(4, 'four'), 0.4)
# passenger screams
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, flip(), WS(5, 'passenger'), 0.4); place(sfx, scratch(), WS(5, 'screamed') - 0.15, 0.5); place(sfx, sting(), WS(5, 'monkey'), 0.4)
# inspector
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(1.2, 4, 500), LS(6), 0.5); place(sfx, stamp(), WS(6, 'fire'), 0.6); place(sfx, swish(), WS(6, 'fire') + 0.27, 0.4); place(sfx, slide(False, 0.6), WS(6, 'fire') + 0.4, 0.35)
# the test
place(sfx, thunk(110, 0.25), LS(7) + 0.3, 0.6); place(sfx, ting(), WS(7, 'aced'), 0.4); place(sfx, crowd(1.2, 'cheer'), WS(7, 'instead'), 0.25); place(sfx, boing(170), WS(7, 'instead'), 0.35)
# hired + pay + beer
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, stamp(), WS(8, 'hired'), 0.5); place(sfx, countup(WS(8, 'twenty') - 0.2, WS(8, 'twenty') + 0.5) or np.zeros(1), 0, 0)
place(sfx, bell(1320), WS(8, 'day'), 0.3); place(sfx, gulp(), WS(8, 'beer'), 0.5); place(sfx, pop(), WS(8, 'beer') - 0.2, 0.3)
# finale
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, thunk(110, 0.25), WS(9, 'mistake') + 0.15, 0.5); place(sfx, thunk(110, 0.25), WS(9, 'mistake') + 0.35, 0.5); place(sfx, ting(), WS(9, 'mistake'), 0.4)
place(sfx, horn(0.6), D - 1.6, 0.3); place(sfx, crowd(1.0, 'cheer'), WS(9, 'not'), 0.15)
mixdown()
