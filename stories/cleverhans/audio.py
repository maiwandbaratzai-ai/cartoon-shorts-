# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
STOPS = WS(11, 'stops')
bed(0, LS(3) - 0.1, 'quirky', 0.85, 116)                 # the clever horse show
bed(LS(3) - 0.1, LS(8) - 0.1, 'tension', 0.95, 120)       # experts testing, rising
bed(LS(8) - 0.1, STOPS - 0.25, 'tension', 1.15, 136)      # blinders -> endless tapping -> the reveal
bed(STOPS, D, 'march', 1.0, 120)
def taps(t0, n, rate):
    for k in range(n): place(sfx, stomp(0.55), t0 + k * rate / 30 + 0.12, 0.5); place(sfx, thunk(160, 0.12), t0 + k * rate / 30 + 0.12, 0.35)
taps(0, 6, 8); taps(WS(1, 'taps'), 5, 9); taps(WS(5, 'right') - 4 / 30, 3, 7); taps(LS(6), 9, 8); taps(LS(9) - 4 / 30, 9, 7)
n11 = int((STOPS - LS(11)) * 30 / 9); taps(LS(11), n11, 9); taps(LS(13) - 4 / 30, 12, 8)
place(sfx, neigh(), 1.6, 0.5); place(sfx, swish(), WS(0, 'math') - 0.15, 0.4)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, scrape(0.4), LS(1) + 0.2, 0.3); place(sfx, swish(), WS(1, 'taps') - 0.15, 0.4); place(sfx, ting(), WS(1, 'perfect'), 0.45)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, stamp(), WS(2, 'swears'), 0.35)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, crowd(1.5, 'cheer'), LS(3), 0.0); place(sfx, tweet(), LS(3) + 0.5, 0.25); place(sfx, swish(), WS(3, 'scientists') - 0.15, 0.4); place(sfx, bonk(), WS(3, 'trick'), 0.35)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, stamp(), WS(4, 'thirteen'), 0.4); place(sfx, swish(), WS(4, 'general') - 0.15, 0.4); place(sfx, horn(0.4), WS(4, 'general'), 0.2); place(sfx, swish(), WS(4, 'circus') - 0.15, 0.4); place(sfx, boing(300), WS(4, 'trainer'), 0.35)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, scrape(0.4), LS(5) + 0.1, 0.3); place(sfx, swish(), WS(5, 'hans') - 0.15, 0.4); place(sfx, ting(), WS(5, 'right'), 0.4)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, footsteps(1.2, 4, 700), WS(6, 'gone') - 0.2, 0.3); place(sfx, swish(), WS(6, 'keeps') - 0.15, 0.4); place(sfx, ting(), WS(6, 'right'), 0.35)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, flip(), LS(7) + 0.1, 0.45); place(sfx, swish(), WS(7, 'so') - 0.15, 0.4); place(sfx, bloop(240), WS(7, 'it'), 0.3); place(sfx, neigh(), WS(7, 'so') + 0.3, 0.3)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, footsteps(1.4, 4, 750), LS(8), 0.3); place(sfx, swish(), WS(8, 'blinders') - 0.2, 0.4); place(sfx, thunk(200, 0.15), WS(8, 'blinders'), 0.4); place(sfx, hum(1.5), WS(8, 'asks'), 0.25)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, swish(), WS(9, 'never') - 0.15, 0.4); place(sfx, scratch(), WS(9, 'stops') + 0.1, 0.35)
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, sub(0.6, 46), WS(10, 'count'), 0.5); place(sfx, swish(), WS(10, 'watches') - 0.15, 0.4); place(sfx, ting(), WS(10, 'faces'), 0.45)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, hum(WS(11, 'relax') - LS(11) + 0.3), LS(11), 0.35); place(sfx, swish(), WS(11, 'relax') - 0.15, 0.4); place(sfx, slide(False, 0.6), WS(11, 'relax'), 0.35)
place(sfx, swish(), STOPS - 0.4, 0.4); place(sfx, thunk(55, 0.5), STOPS, 0.8); place(sfx, sub(0.8, 38), STOPS, 0.8); place(sfx, bell(1320), STOPS + 0.05, 0.35)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, swish(), LS(12) + 36 / 30 - 0.15, 0.4); place(sfx, neigh(), WS(12, 'people'), 0.45)
place(sfx, swish(), LS(13) - 0.15, 0.5)
mixdown()
