# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
SW, CR = WS(6, 'swallows'), WS(12, 'crashed')
bed(0, LS(2) - 0.1, 'quirky', 0.85, 122)                       # breakfast on the quay
bed(LS(2) - 0.1, LS(7) - 0.25, 'tension', 1.1, 140)            # the chase, rising
bed(LS(7), LS(11) - 0.2, 'quirky', 0.8, 128)                   # tulip mania
bed(LS(11), CR - 0.25, 'tension', 0.9, 120)                    # priciest breakfast...
bed(CR, D, 'march', 1.0, 124)                                  # crash -> kicker
place(sfx, chew(1.4), 0.2, 0.5); place(sfx, gull(), 1.0, 0.25); place(sfx, swish(), WS(0, 'breakfast') - 0.2, 0.4); place(sfx, ting(), WS(0, 'house'), 0.3)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, chew(1.0), WS(1, 'bites'), 0.5); place(sfx, swish(), WS(1, 'merchant') - 0.15, 0.4); place(sfx, scratch(), WS(1, 'screaming') - 0.1, 0.4)
place(sfx, sub(0.5, 50), WS(1, 'screaming'), 0.5)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, chew(1.2), WS(2, 'chewing'), 0.4); place(sfx, slide(True, 0.4), WS(2, 'runs'), 0.35)
for t in np.arange(WS(2, 'runs'), LS(7) - 0.3, 0.16): place(sfx, stomp(0.35), t, 0.3)
place(sfx, swish(), LS(3) - 0.15, 0.4); place(sfx, swish(), WS(3, 'fish') - 0.25, 0.4); place(sfx, splat(), WS(3, 'fish'), 0.4); place(sfx, crash(0.6), WS(3, 'carts'), 0.3); place(sfx, gull(), WS(3, 'ships'), 0.3)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, bonk(), WS(4, 'half'), 0.35); place(sfx, swish(), WS(4, 'who') - 0.15, 0.4)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, horn(0.5), WS(5, 'street'), 0.25); place(sfx, swish(), WS(5, 'baker') - 0.15, 0.4); place(sfx, swish(), WS(5, 'dog') - 0.15, 0.4); place(sfx, bark(), WS(5, 'dog') + 0.2, 0.55)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, thunk(60, 0.4), WS(6, 'corner'), 0.6); place(sfx, sub(0.6, 42), WS(6, 'corner'), 0.5); place(sfx, swish(), SW - 0.15, 0.4)
place(sfx, gulp(), SW + 0.1, 0.7); place(sfx, sub(0.5, 50), SW + 0.1, 0.4)
place(sfx, swish(), LS(7) - 0.15, 0.4); place(sfx, bloop(240), WS(7, 'onion'), 0.35); place(sfx, bark(), WS(7, 'special'), 0.3)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, ting(), WS(8, 'bulb'), 0.4); place(sfx, swish(), WS(8, 'holland') - 0.2, 0.4); place(sfx, crowd(1.4, 'cheer'), WS(8, 'crazy'), 0.0)
for t in np.arange(WS(8, 'crazy'), WS(8, 'crazy') + 1.0, 0.25): place(sfx, bell(1760), t, 0.15)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, thunk(90, 0.25), WS(9, 'bulb'), 0.5); place(sfx, slide(False, 0.5), WS(9, 'bulb') + 0.1, 0.3); place(sfx, swish(), WS(9, 'horse') - 0.15, 0.4); place(sfx, neigh(), WS(9, 'horse'), 0.35)
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, stamp(), WS(10, 'traded'), 0.45); place(sfx, moo(), WS(10, 'farms'), 0.35); place(sfx, swish(), WS(10, 'flowers') - 0.15, 0.4); place(sfx, boing(260), WS(10, 'seen'), 0.35)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, gulp(), WS(11, 'eaten'), 0.4); place(sfx, swish(), WS(11, 'priciest') - 0.15, 0.4); place(sfx, bonk(), WS(11, 'breakfast'), 0.45)
place(sfx, hum(CR - LS(12)), LS(12), 0.3); place(sfx, swish(), LS(12) - 0.15, 0.5)
place(sfx, crash(1.0), CR, 0.6); place(sfx, thunk(50, 0.6), CR, 0.9); place(sfx, sub(1.0, 36), CR, 0.9); place(sfx, slide(False, 0.9), CR + 0.1, 0.4); place(sfx, swish(), CR + 0.45, 0.4)
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, gull(), LS(13) + 0.3, 0.25); place(sfx, swish(), WS(13, 'worth') - 0.15, 0.5); place(sfx, chew(1.0), WS(13, 'onion'), 0.45)
mixdown()
