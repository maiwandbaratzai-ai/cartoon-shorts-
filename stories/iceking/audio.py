# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
LOSE, PUD, SIP = WS(7, 'loses'), WS(7, 'puddles'), LS(14)
bed(0, LS(3) - 0.1, 'quirky', 0.85, 118)                    # sailing south
bed(LS(3) - 0.1, LS(8) - 0.2, 'tension', 1.0, 124)           # laughed at -> melting -> broke
bed(LS(8) - 0.1, LS(11) - 0.1, 'sad', 0.8, 84)               # tries again, still melting
bed(LS(11) - 0.1, SIP - 0.25, 'tension', 0.95, 132)          # the two tricks (rising), near-silence before the sip
bed(SIP, D, 'march', 1.0, 124)                               # the Ice King
def waves(t0, d): place(sfx, water(d), t0, 0.18)
waves(0, 3.0); place(sfx, creak(0.7, 150), 0.6, 0.35); place(sfx, gull(), 1.4, 0.3); place(sfx, swish(), WS(0, 'lake') - 0.15, 0.4)
place(sfx, swish(), LS(1) - 0.15, 0.5); waves(LS(1), 3.5); place(sfx, swish(), WS(1, 'packed') - 0.15, 0.4); place(sfx, thunk(70, 0.4), WS(1, 'tons'), 0.6); place(sfx, sub(0.6, 45), WS(1, 'tons'), 0.5)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, drip(), WS(2, 'melts'), 0.5); place(sfx, hum(1.6), WS(2, 'loses'), 0.3)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, crowd(1.4, 'cheer'), WS(3, 'laughed'), 0.0); place(sfx, bonk(), WS(3, 'laughed') + 0.2, 0.35); place(sfx, swish(), WS(3, 'newspapers') - 0.15, 0.4); place(sfx, flip(), WS(3, 'newspapers'), 0.45); place(sfx, slide(False, 0.6), WS(3, 'slippery'), 0.4)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, thunk(60, 0.5), WS(4, 'lands'), 0.7); place(sfx, sub(0.6, 42), WS(4, 'lands'), 0.6); place(sfx, swish(), WS(4, 'dripping') - 0.15, 0.4)
for k in range(6): place(sfx, drip(), WS(4, 'dripping') + k * 0.25, 0.4)
place(sfx, swish(), LS(5) - 0.15, 0.4); place(sfx, bark(), WS(5, 'nobody'), 0.4); place(sfx, scratch(), WS(5, 'seen') - 0.1, 0.3)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, bonk(500), WS(6, 'poke'), 0.4); place(sfx, swish(), WS(6, 'sniff') - 0.15, 0.4); place(sfx, bloop(320), WS(6, 'sniff'), 0.35)
place(sfx, swish(), WS(6, 'licks') - 0.15, 0.4); place(sfx, boing(300), WS(6, 'licks') + 0.1, 0.45); place(sfx, slide(False, 0.8), WS(6, 'melt'), 0.35)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, thunk(55, 0.5), LOSE, 0.8); place(sfx, sub(0.8, 38), LOSE, 0.8); place(sfx, swish(), PUD - 0.2, 0.4); place(sfx, splash(0.8), PUD, 0.5); place(sfx, bonk(), PUD + 0.2, 0.4)
place(sfx, swish(), LS(8) - 0.15, 0.5); waves(LS(8), 2.2); place(sfx, horn(0.6), WS(8, 'again'), 0.25); place(sfx, swish(), WS(8, 'again') + 0.05, 0.35)
place(sfx, swish(), LS(9) - 0.15, 0.5)
for k in range(4): place(sfx, drip(), WS(9, 'melting') + k * 0.2, 0.35)
place(sfx, crowd(1.2, 'cheer'), WS(9, 'laughing'), 0.0); place(sfx, bonk(), WS(9, 'louder'), 0.35)
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, slide(False, 0.5), WS(10, 'pay'), 0.35); place(sfx, gulp(), WS(10, 'lunch'), 0.35)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, bloop(240), WS(11, 'want'), 0.35)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, stamp(), WS(12, 'tricks'), 0.4); place(sfx, swish(), WS(12, 'sawdust') - 0.2, 0.4); place(sfx, leaves(1.4), WS(12, 'sawdust'), 0.35); place(sfx, ting(), WS(12, 'blanket'), 0.35)
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, swish(), WS(13, 'free') - 0.15, 0.4)
for k in range(4): place(sfx, ting(), WS(13, 'free') + k * 0.18, 0.35)
place(sfx, gulp(), SIP + 0.1, 0.6); place(sfx, sub(0.5, 50), SIP + 0.1, 0.4); place(sfx, swish(), WS(14, 'nobody') - 0.15, 0.4); place(sfx, ting(), WS(14, 'warm'), 0.35)
place(sfx, swish(), LS(15) - 0.15, 0.5); waves(LS(15), 3.0); place(sfx, horn(0.6), WS(15, 'cuba'), 0.3); place(sfx, gull(), WS(15, 'brazil'), 0.3); place(sfx, swish(), WS(15, 'india') - 0.15, 0.4); place(sfx, bell(1320), WS(15, 'india'), 0.35)
place(sfx, swish(), LS(16) - 0.15, 0.5); place(sfx, pop(), WS(16, 'cream'), 0.4)
for k in range(5): place(sfx, ting(), WS(16, 'clinking') + k * 0.15, 0.35)
place(sfx, swish(), WS(16, 'clinking') - 0.2, 0.4)
place(sfx, swish(), LS(17) - 0.15, 0.5); place(sfx, crowd(1.6, 'cheer'), LS(17), 0.0); place(sfx, bell(1760), WS(17, 'king'), 0.4); place(sfx, thunk(60, 0.4), WS(17, 'king'), 0.5); place(sfx, sub(0.6, 42), WS(17, 'king'), 0.5)
place(sfx, swish(), LS(18) - 0.15, 0.5); waves(LS(18), 4.0); place(sfx, gull(), LS(18) + 0.4, 0.25)
place(sfx, swish(), LS(19) - 0.15, 0.5); place(sfx, creak(0.6, 150), LS(19) + 0.5, 0.3)
mixdown()
