# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'dark', 1.0, 100)                       # flash-forward: the ship going over
bed(LS(1), LS(2) - 0.05, 'march', 1.0, 112)                  # the proud warship
bed(LS(2), LS(4) - 0.05, 'tension', 1.0, 150)                # top-heavy, the stability test
bed(LS(4), LS(5) - 0.05, 'march', 1.0, 112)                  # crowds cheer
bed(LS(5), LS(7) - 0.05, 'dark', 1.0, 92)                    # the gust, the sinking
bed(LS(7), TM['dur'], 'sad', 0.9, 84)                        # raised, the museum (runs to the cut)
place(sfx, water(TM['dur']), 0, 0.3)
place(sfx, creak(1.2, 80), 0.3, 0.7); place(sfx, splash(1.5), 0.5, 0.8); place(sfx, splash(1.2), WS(0, 'sank'), 0.8); place(sfx, crowd(1.5, 'scream'), 1.0, 0.35)
place(sfx, boom(1.2), WS(1, 'sixty'), 0.5); place(sfx, boom(1.0), WS(1, 'sixty') + 0.35, 0.4)
place(sfx, ting(), WS(1, 'statues'), 0.4)
for k in range(3): place(sfx, creak(0.6, 100 + 15 * k), LS(2) + k * 0.5, 0.5)
place(sfx, footsteps(LE(3) - WS(3, 'ran'), 11, 700), WS(3, 'ran'), 0.6)
place(sfx, creak(1.0, 70), WS(3, 'capsized') - 0.2, 0.9); place(sfx, crowd(0.8, 'gasp'), WS(3, 'capsized'), 0.5)
place(sfx, crowd(2.5, 'cheer'), LS(4) + 0.3, 0.7); place(sfx, gull(), LS(4) + 0.5, 0.4)
place(sfx, whoosh(1.4), WS(5, 'gust') - 0.2, 1.0); place(sfx, leaves(1.5), WS(5, 'gust'), 0.5); place(sfx, creak(1.0, 60), WS(5, 'tipped'), 0.8)
place(sfx, splash(1.5), WS(5, 'water'), 1.0); place(sfx, gloop(1.5), WS(5, 'water') + 0.2, 0.6)
place(sfx, splash(2.0), WS(6, 'sank'), 0.8); place(sfx, crowd(1.5, 'gasp'), LS(6) + 0.2, 0.4); place(sfx, gloop(1.8), WS(6, 'sank') + 0.4, 0.5)
place(sfx, splash(2.0), WS(7, 'raised') - 0.3, 0.8); place(sfx, ting(), WS(7, 'three'), 0.4)
place(sfx, crowd(2.0, 'cheer') * 0.5, LS(8), 0.4)
mixdown()
