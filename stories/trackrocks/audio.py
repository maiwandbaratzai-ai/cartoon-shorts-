# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def rainsnd(t0, d, g=0.2): place(sfx, hp_fast(noise(d), 1500) * env(int(d * SR), 0.5, 0.5), t0, g)
def chug(t0, d, g=0.3, rate=4.0):
    for k in range(int(d * rate)): place(sfx, thunk(70, 0.12, 0.3), t0 + k / rate, g)
bed(0, LS(2) - 0.1, 'quirky', 0.95, 120)
bed(LS(2) - 0.1, LS(4), 'sad', 0.8, 100)
bed(LS(4), LS(6), 'quirky', 1.0, 132)
bed(LS(6), LS(8) - 0.1, 'tension', 1.3, 146)
bed(LS(8) + 0.2, LS(11) - 0.18, 'quirky', 0.85, 114)
bed(LS(11), D, 'march', 1.1, 128)
for fr in [55, 109, 155, 199, 250, 307, 355, 403, 470, 543, 600, 663, 720, 775, 848, 960, 1030, 1100, 1150, 1253, 1310]: place(sfx, swish(), FR(fr) - 0.1, 0.38)
for fr in [895, 1197]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0-1 banned, lawn
for k in range(4): place(sfx, scrape(0.3), 0.2 + k * 0.55, 0.3); place(sfx, thunk(110, 0.15), 0.45 + k * 0.55, 0.25)
place(sfx, stamp(), WS(0, 'banned'), 0.45); place(sfx, bonk(), WS(0, 'ugly'), 0.25)
for k in range(5): place(sfx, pop(), WS(1, 'tulips') + k * 0.08, 0.25)
place(sfx, boing(260), WS(1, 'gnome'), 0.35)
# L2-3 rain, pudding, sink, spaghetti
place(sfx, bell(1320), WS(2, 'lovely'), 0.25); rainsnd(WS(2, 'rain'), FR(663) - WS(2, 'rain'), 0.2); place(sfx, gloop(1.2), WS(2, 'pudding'), 0.45)
place(sfx, slide(False, 0.7), WS(3, 'sank'), 0.4); place(sfx, gloop(0.8), WS(3, 'sank') + 0.2, 0.3); place(sfx, boing(140, 0.8), WS(3, 'wobbly'), 0.4)
# L4 bouncing train, 11:40
place(sfx, horn(0.8), LS(4), 0.35); chug(LS(4) + 0.3, 3.6, 0.3)
for k in range(6): place(sfx, boing(200 + k * 10, 0.3), WS(4, 'bouncing') + k * 0.3, 0.2)
place(sfx, bell(880), WS(4, 'at'), 0.4); place(sfx, bell(880), WS(4, 'at') + 0.25, 0.3); place(sfx, bonk(), WS(4, 'at') + 0.6, 0.3)
# L5 tall grass + ladder
place(sfx, slide(True, 1.0), WS(5, 'grass'), 0.35)
for k in range(4): place(sfx, thunk(300, 0.08, 0.1), WS(5, 'ladder') + k * 0.2, 0.25)
# L6 mower + cow
place(sfx, engine(2.0, 60), WS(6, 'mow'), 0.3); place(sfx, moo(), WS(6, 'cow'), 0.55); place(sfx, chew(1.6), WS(6, 'cow') + 0.6, 0.3); place(sfx, ting(), WS(6, 'free'), 0.35)
# L7 stuck + cow faster
rainsnd(FR(775), FR(903) - FR(775), 0.18); place(sfx, engine(2.5, 40), FR(775), 0.25); place(sfx, gloop(1.0), WS(7, 'stuck'), 0.4); place(sfx, footsteps(2.0, 4, 300), FR(790), 0.3); place(sfx, moo(), WS(7, 'faster'), 0.5)
# L8 re-hook
place(sfx, scratch(), LS(8) - 0.2, 0.3)
# L9 elephants, puzzle
place(sfx, trumpet(), WS(9, 'presses'), 0.45); place(sfx, stomp(1.3), WS(9, 'elephants'), 0.6); place(sfx, sub(0.8, 36), WS(9, 'elephants'), 0.6); place(sfx, trumpet(), WS(9, 'elephants') + 0.6, 0.35)
for k in range(5): place(sfx, thunk(140, 0.1, 0.2), WS(9, 'lock') + k * 0.1, 0.3)
place(sfx, ting(), WS(9, 'puzzle'), 0.4); place(sfx, stamp(), WS(9, 'still'), 0.35)
# L10 rain through, sponge
rainsnd(FR(1100), FR(1205) - FR(1100), 0.2)
for k in range(6): place(sfx, drip(), WS(10, 'runs') + k * 0.18, 0.3)
place(sfx, gloop(0.8), WS(10, 'sponge'), 0.45)
# L11-12 rocks back, pink, cow
place(sfx, engine(1.5, 50), FR(1205), 0.3); place(sfx, rattle(1.2), WS(11, 'back'), 0.45); place(sfx, sub(0.5, 45), WS(11, 'back'), 0.4)
place(sfx, slide(True, 0.6), WS(12, 'painted'), 0.3); place(sfx, bell(1320), WS(12, 'pink'), 0.35); place(sfx, moo(), WS(12, 'approved'), 0.6); place(sfx, horn(0.6), FR(1340), 0.25)
mixdown()
