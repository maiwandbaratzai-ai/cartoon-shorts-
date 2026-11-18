# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
bed(0, WS(2, 'creaked') - 0.1, 'tension', 0.9, 100)                       # tension rising through the crossing
bed(WS(2, 'creaked'), WS(3, 'held') - 0.2, 'tension', 1.15, 112)        # louder, faster on the creak
bed(WS(3, 'held'), D, 'march', 1.0, 124)                                  # triumphant after the near-silence
for k in range(int(D / 0.37)): place(sfx, stomp(), 0.15 + k * 0.37, 0.5)   # heavy elephant footsteps with deep bass
place(sfx, hum(WS(3, 'held') - WS(2, 'creaked') + 0.2), WS(2, 'creaked') - 0.3, 0.35)   # bridge cables humming under the strain
place(sfx, trumpet(), 0.6, 0.55)
place(sfx, swish(), 1.45, 0.5)

place(sfx, creak() if 'creak' in globals() else slide(False, 0.6), WS(2, 'creaked'), 0.7)
place(sfx, thunk(55, 0.5), WS(2, 'sagged'), 0.9); place(sfx, sub(0.9, 40), WS(2, 'sagged'), 0.8); place(sfx, scratch(), WS(2, 'sagged') + 0.35, 0.35)
place(sfx, ting(), WS(3, 'held'), 0.6); place(sfx, trumpet(), LE(3) + 0.1, 0.45)
mixdown()
