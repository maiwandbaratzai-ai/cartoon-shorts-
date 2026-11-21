# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def wind(t0, d, g=0.3): place(sfx, lp_fast(noise(d), 800) * env(int(d * SR), 0.4, 0.5), t0, g)
def buzz(t0, d, g=0.3, f0=55): place(sfx, engine(d, f0), t0, g)
def cough(t, g=0.5): place(sfx, lp_fast(noise(0.12) * env(int(0.12 * SR), 0.002, 0.1), 400) * 2, t, g); place(sfx, sub(0.2, 50), t, g * 0.6)
bed(0, LS(3) - 0.1, 'quirky', 0.95, 128)
bed(LS(3) - 0.1, LS(6) - 0.1, 'tension', 0.95, 124)
bed(LS(6) - 0.1, LS(8) - 0.15, 'tension', 1.2, 144)
bed(LS(8), LS(10) - 0.18, 'quirky', 0.85, 120)
bed(LS(10), D, 'march', 1.15, 132)
# L0 in the air (flash-forward)
buzz(0, LS(1) - 0.1, 0.4); wind(0, LS(1), 0.3); place(sfx, oink(), 0.6, 0.5); place(sfx, swish(), WS(0, 'plane') - 0.15, 0.4); place(sfx, oink(), WS(0, 'wing'), 0.4)
# L1-2 the basket + sign
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, creak(0.5, 200), WS(1, 'basket'), 0.3); place(sfx, swish(), WS(1, 'sign') - 0.15, 0.4); place(sfx, flip(), WS(1, 'sign'), 0.35)
place(sfx, swish(), LS(2) - 0.15, 0.4); place(sfx, oink(), WS(2, 'pig'), 0.5); place(sfx, ting(), WS(2, 'fly'), 0.4)
# L3 engine coughs, the mud
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, whoosh(0.3), WS(3, 'engine') - 0.1, 0.35); cough(WS(3, 'coughs')); cough(WS(3, 'coughs') + 0.3); cough(WS(3, 'coughs') + 0.55, 0.4)
buzz(WS(3, 'coughs') + 0.7, LS(10) - WS(3, 'coughs') - 0.7, 0.22, 48); place(sfx, swish(), WS(3, 'mud') - 0.2, 0.4); place(sfx, splat(), WS(3, 'mud'), 0.5); place(sfx, sub(0.4, 46), WS(3, 'mud'), 0.4)
# L4-5 mockery + the bet
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, bonk(), WS(4, 'laughs'), 0.3); place(sfx, swish(), WS(4, 'barely') - 0.15, 0.4); place(sfx, slide(False, 0.6), WS(4, 'ground'), 0.3)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, boing(200), WS(5, 'hat'), 0.4); place(sfx, stamp(), WS(5, 'ground'), 0.35)
# L6-7 wind, squealing, wobble
place(sfx, swish(), LS(6) - 0.15, 0.5); wind(WS(6, 'wind'), LS(8) - WS(6, 'wind'), 0.5); place(sfx, swish(), WS(6, 'piglet') - 0.15, 0.4)
for k in range(3): place(sfx, oink(), WS(6, 'squealing') + k * 0.3, 0.45)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, creak(0.6), WS(7, 'wobbles'), 0.45); place(sfx, thunk(80, 0.3), WS(7, 'wobbles') + 0.2, 0.45); place(sfx, creak(0.5, 180), WS(7, 'basket'), 0.4)
place(sfx, swish(), WS(7, 'crowd') - 0.15, 0.4); place(sfx, hum(1.0), WS(7, 'crowd'), 0.3)
# L8-9 why? [beat] the saying
place(sfx, scratch(), LS(8) - 0.35, 0.35); place(sfx, swish(), LS(8) - 0.15, 0.45); place(sfx, swish(), WS(8, 'saying') - 0.15, 0.4)
place(sfx, swish(), LS(9) - 0.15, 0.45); place(sfx, sting(), WS(9, 'pigs'), 0.4); place(sfx, thunk(60, 0.4), WS(9, 'fly'), 0.6); place(sfx, sub(0.7, 38), WS(9, 'fly'), 0.6); place(sfx, swish(), WS(9, 'never') - 0.15, 0.4); place(sfx, oink(), WS(9, 'never') + 0.2, 0.4)
# L10 takeoff, circle, landing (payoff)
place(sfx, swish(), LS(10) - 0.15, 0.5); buzz(LS(10), LS(11) - LS(10), 0.55, 62); place(sfx, rumble(1.2), WS(10, 'takes'), 0.35); place(sfx, slide(True, 0.8), WS(10, 'takes'), 0.35)
place(sfx, swish(), WS(10, 'circles') - 0.15, 0.45); place(sfx, whoosh(1.0), WS(10, 'circles'), 0.4); place(sfx, swish(), WS(10, 'lands') - 0.15, 0.45)
place(sfx, thunk(60, 0.45), (TM['frames'] and (LS(10) + (98 + 4) / 30 - 0.13)), 0.7); place(sfx, sub(0.8, 38), LS(10) + (98 + 4) / 30 - 0.13, 0.7); place(sfx, stomp(1.0), LS(10) + (98 + 4) / 30, 0.5)
# L11 the piglet trots out, crowd cheers
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, boing(260), LS(11) + 0.4, 0.35); place(sfx, oink(), LS(11) + 0.8, 0.5); place(sfx, horn(0.6), WS(11, 'cheers'), 0.3); place(sfx, swish(), WS(11, 'joke') - 0.15, 0.4); place(sfx, bonk(360), WS(11, 'dies'), 0.4)
# L12 in the air again (loop)
place(sfx, swish(), LS(12) - 0.15, 0.5); buzz(LS(12), D - LS(12), 0.45); wind(LS(12), D - LS(12), 0.3); place(sfx, oink(), WS(12, 'fly'), 0.5); place(sfx, ting(), WS(12, 'ask'), 0.3)
mixdown()
