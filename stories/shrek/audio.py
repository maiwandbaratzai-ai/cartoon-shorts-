# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
F = lambda fr: fr / 30
bed(0, LS(4) - 0.05, 'quirky', 1.0, 124)           # the cloud in the hills
bed(LS(4), LS(7) - 0.4, 'march', 1.0, 128)          # live on TV, clippers on
bed(LS(7), D, 'quirky', 1.05, 132)                  # the reveal, back to the cave
# hook: the cloud waddles out of the cave
place(sfx, baa(), 0.25, 0.6); place(sfx, footsteps(2.2, 4, 300), 0.3, 0.3); place(sfx, boing(150), WS(0, 'six'), 0.35)
place(sfx, swish(), WS(0, 'dodging') - 0.3, 0.3); place(sfx, scratch(), WS(0, 'haircuts'), 0.3)
# the farmer + Labrador find him
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, footsteps(1.0, 8, 700), LS(1), 0.3); place(sfx, bark(), WS(1, 'found') - 0.1, 0.6); place(sfx, gasp(), WS(1, 'found') + 0.1, 0.5)
place(sfx, swish(), WS(1, 'giant') - 0.25, 0.4); place(sfx, slide(True, 0.6), WS(1, 'giant'), 0.35); place(sfx, baa(), WS(1, 'legs'), 0.5)
# 27 kilos = a Labrador
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, stamp(), WS(2, '27'), 0.6); place(sfx, thunk(70, 0.3), WS(2, 'kilos'), 0.4)
place(sfx, swish(), WS(2, 'labrador') - 0.3, 0.4); place(sfx, bark(), WS(2, 'labrador') + 0.2, 0.55); place(sfx, ting(), WS(2, 'labrador') + 0.1, 0.3)
# blind bumble into the boulder
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, footsteps(1.2, 5, 320), LS(3), 0.3); place(sfx, bonk(300), WS(3, 'walking') + 0.15, 0.7); place(sfx, boing(200), WS(3, 'walking') + 0.25, 0.4); place(sfx, baa(), WS(3, 'walking') + 0.6, 0.4)
# could anyone shear that?
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, bloop(220), WS(4, 'shear'), 0.35); vox("Uh... how?", LS(5) - 0.45, 'am_fenrir', 1.25, 0.75, 1.05)
# live TV
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, crowd(2.4, 'cheer'), WS(5, 'live'), 0.3); place(sfx, ting(), WS(5, 'tv'), 0.4); place(sfx, swish(), WS(5, 'country') - 0.25, 0.4); vox("Go on!", WS(5, 'watching') + 0.55, 'af_nicole', 1.2, 0.6, 1.1)
# clippers
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, stamp(), WS(6, 'champion'), 0.35); place(sfx, snap(), WS(6, 'switched'), 0.5)
place(sfx, engine(F(616) - WS(6, 'clippers') + 0.2, 95), WS(6, 'clippers'), 0.35); place(sfx, baa(), WS(6, 'clippers') + 0.5, 0.45)
# twenty minutes later: skinny sheep
place(sfx, scratch(), LS(7) - 0.5, 0.35); place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, engine(1.1, 95), LS(7), 0.25)
for k in range(5): place(sfx, flip(), LS(7) + 0.1 + k * 0.22, 0.25)
place(sfx, slide(False, 0.6), WS(7, 'skinny'), 0.45); place(sfx, gasp(), WS(7, 'skinny') + 0.1, 0.4); place(sfx, baa(), WS(7, 'stepped'), 0.6); place(sfx, crowd(1.4, 'cheer'), WS(7, 'stepped') + 0.3, 0.2)
# the pile + twenty suits
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, boing(120, 0.8), WS(8, 'bigger'), 0.45); place(sfx, swish(), WS(8, 'suits') - 0.4, 0.4); place(sfx, stamp(), WS(8, 'suits'), 0.55); place(sfx, bell(1320), WS(8, 'suits') + 0.1, 0.3)
# back to the cave (loop)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, footsteps(1.6, 11, 500), LS(9), 0.4); place(sfx, baa(), WS(9, 'hid'), 0.55); place(sfx, slide(False, 0.5), D - 1.0, 0.3)
mixdown()
