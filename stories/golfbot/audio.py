# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def birds(t0, d):
    for k in range(int(d / 2.5)): place(sfx, tweet(), t0 + k * 2.5 + 0.7 * (k % 2), 0.12)
def whir(t0, d, g=0.18): place(sfx, hum(d), t0, g); place(sfx, hp_fast(noise(d), 2500) * env(int(d * SR), 0.05, 0.1), t0, g * 0.25)
bed(0, LS(3) - 0.1, 'quirky', 0.95, 120)
bed(LS(3) - 0.1, LS(5), 'march', 0.9, 124)
bed(LS(5), LS(7), 'quirky', 1.1, 136)
bed(LS(7), LS(8) - 0.1, 'tension', 1.3, 146)
bed(LS(9) - 0.2, LS(10) - 0.15, 'tension', 0.8, 110)
bed(LS(10), LS(11) - 0.18, 'quirky', 0.9, 118)
bed(LS(11), D, 'march', 1.1, 128)
birds(0, D)
for fr in [48, 95, 145, 195, 244, 300, 372, 420, 466, 510, 561, 600, 644, 705, 771, 825, 878, 985, 1034, 1167, 1215, 1259, 1320]: place(sfx, swish(), FR(fr) - 0.1, 0.38)
for fr in [923, 1092]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0-2 sanding robot
whir(0.1, 4.6, 0.16); place(sfx, bloop(260), WS(0, 'robot'), 0.3); place(sfx, ting(), WS(0, 'smooth'), 0.4)
place(sfx, bell(990), WS(1, 'noon'), 0.3); place(sfx, sting(), WS(1, 'toaster'), 0.35); place(sfx, ting(), WS(1, 'toaster') + 0.3, 0.3)
place(sfx, bloop(180), WS(2, 'dents'), 0.4); whir(WS(2, 'buffed'), 2.4, 0.18); place(sfx, ting(), WS(2, 'clouds'), 0.35)
# L3-4 the drive
place(sfx, stamp(), WS(3, 'hurricane'), 0.3); place(sfx, swish(0.35), FR(F := 0) if False else WS(3, 'drive') + 0.3, 0.4)
place(sfx, thunk(120, 0.15), WS(3, 'drive') + 0.55, 0.5); place(sfx, slide(True, 0.6), WS(4, 'flew'), 0.3); place(sfx, slide(False, 0.6), WS(4, 'half'), 0.35)
place(sfx, splash(0.6), WS(4, 'plopped'), 0.5); place(sfx, quack(), WS(4, 'duck'), 0.55); place(sfx, gulp(), WS(4, 'kept'), 0.35)
# L5 same, snack cart
place(sfx, thunk(120, 0.15), FR(570), 0.4); place(sfx, splash(0.5), FR(596), 0.4); place(sfx, quack(), FR(598), 0.35)
place(sfx, thunk(120, 0.15), FR(606), 0.4); place(sfx, bonk(), FR(626), 0.6); place(sfx, crash(0.6), FR(627), 0.3); place(sfx, sub(0.4, 50), FR(626), 0.4)
for k in range(4): place(sfx, pop(), FR(630) + k * 0.12, 0.2)
# L6 shinier + the shoe
whir(FR(644), 2.0, 0.24); place(sfx, ting(), WS(6, 'shinier'), 0.4); place(sfx, thunk(120, 0.12), WS(6, 'cleared') - 0.25, 0.4); place(sfx, boing(300, 0.4), WS(6, 'shoe'), 0.4)
# L7 92 balls, duck on eggs
countup(WS(7, 'ninety') - 0.4, WS(7, 'ninety') + 0.5); place(sfx, quack(), WS(7, 'eggs'), 0.5); place(sfx, quack(), WS(7, 'eggs') + 0.6, 0.35)
# L8 re-hook
place(sfx, scratch(), LS(8) - 0.2, 0.3); place(sfx, bloop(200), WS(8, 'quit'), 0.3)
# L9-10 wind tunnel
wind = lambda t0, d, g: place(sfx, lp_fast(noise(d), 1200) * env(int(d * SR), 0.3, 0.4), t0, g)
wind(FR(931), FR(1100) - FR(931), 0.25); place(sfx, hum(5.0), FR(931), 0.15); place(sfx, creak(0.8, 90), WS(9, 'whirlpool'), 0.3)
place(sfx, pop(), WS(9, 'parachute'), 0.45); place(sfx, whoosh(0.6), WS(9, 'parachute'), 0.4)
place(sfx, slide(True, 0.5), WS(10, 'hug'), 0.3); place(sfx, sting(), WS(10, 'shrinks'), 0.35)
place(sfx, thunk(120, 0.15), FR(1112), 0.5); place(sfx, slide(True, 1.0), FR(1114), 0.35); place(sfx, ting(), WS(10, 'twice'), 0.4)
# L11-12 dimples everywhere, toaster, toast
for k in range(6): place(sfx, pop(), WS(11, 'adds') + k * 0.15, 0.25)
place(sfx, boing(220), WS(11, 'everything'), 0.3); place(sfx, ting(), WS(12, 'toaster'), 0.4)
place(sfx, boing(300, 0.5), WS(12, 'toast') - 0.2, 0.55); place(sfx, slide(True, 1.0), WS(12, 'flies'), 0.35); place(sfx, quack(), FR(1380), 0.35)
mixdown()
