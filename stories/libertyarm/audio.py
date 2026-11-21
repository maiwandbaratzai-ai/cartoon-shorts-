# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def clank(t, g=0.4): place(sfx, ting(), t, g * 0.6); place(sfx, thunk(120, 0.2), t, g)
def coins(t0, n, g=0.35):
    for k in range(n): place(sfx, bell(2400 + 300 * (k % 4)), t0 + k * 0.09, g * 0.5)
bed(0, LS(3) - 0.1, 'quirky', 0.95, 126)
bed(LS(3) - 0.1, LS(5) - 0.1, 'tension', 0.9, 120)
bed(LS(5) - 0.1, LS(7) + 0.6, 'tension', 1.1, 132)
bed(LS(7) + 0.9, LS(9) - 0.1, 'quirky', 0.95, 128)
bed(LS(9) - 0.1, LS(11) - 0.1, 'tension', 1.15, 140)
bed(LS(11) - 0.1, LS(12) - 0.18, 'march', 1.05, 128)
bed(LS(12), D, 'march', 1.15, 128)
# L0 the arm, the ladder climb, the ticket sale
place(sfx, hum(2.5), 0, 0.3); place(sfx, sub(1.0, 40), 0.1, 0.5)
for k in range(7): place(sfx, thunk(200, 0.12, 0.2), 0.2 + k * 0.42, 0.25)
place(sfx, swish(), WS(0, 'park') - 0.15, 0.45); coins(WS(0, 'park'), 3)
# L1 climbing up to the torch
place(sfx, swish(), LS(1) - 0.15, 0.5)
for k in range(8): place(sfx, thunk(220, 0.1, 0.2), LS(1) + 0.1 + k * 0.3, 0.25)
place(sfx, swish(), WS(1, 'torch') - 0.15, 0.45); place(sfx, whoosh(0.8), WS(1, 'torch'), 0.3); place(sfx, gull(), WS(1, 'torch') + 0.3, 0.2)
# L2 nobody paid
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, ting(), WS(2, 'paid'), 0.3); place(sfx, slide(False, 0.7), WS(2, 'never'), 0.3); place(sfx, swish(), WS(2, 'ocean') - 0.2, 0.45); place(sfx, water(1.4), WS(2, 'ocean'), 0.3)
# L3 Paris: head, no body
place(sfx, swish(), LS(3) - 0.15, 0.5)
for k in range(5): clank(LS(3) + 0.2 + k * 0.38, 0.35)
place(sfx, swish(), WS(3, 'body') - 0.15, 0.45); place(sfx, creak(0.6), WS(3, 'body'), 0.35); place(sfx, bonk(), WS(3, 'exist'), 0.4); place(sfx, sub(0.4, 46), WS(3, 'exist'), 0.4)
# L4 mockery
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, flip(), WS(4, 'newspaper'), 0.4); place(sfx, swish(), WS(4, 'joked') - 0.15, 0.4); place(sfx, boing(220), WS(4, 'statue'), 0.35); place(sfx, bonk(500), WS(4, 'beats'), 0.3)
# L5 six years (wind + clock)
place(sfx, swish(), LS(5) - 0.15, 0.5); 
place(sfx, lp_fast(noise(2.6), 500) * env(int(2.6 * SR), 0.6, 0.8), LS(5), 0.35); countup(WS(5, 'six'), WS(5, 'six') + 1.2, 0.4); place(sfx, swish(), WS(5, 'alone') - 0.2, 0.4); place(sfx, hum(1.5), WS(5, 'alone'), 0.3)
# L6 picnic, pigeons
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, chew(1.0), LS(6) + 0.1, 0.3); place(sfx, swish(), WS(6, 'pigeons') - 0.15, 0.4)
for k in range(3): place(sfx, tweet(), WS(6, 'pigeons') + k * 0.25, 0.35)
place(sfx, leaves(0.8), WS(6, 'nested'), 0.3)
# L7 why? [beat] advertisement (twist)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, scratch(), WS(7, 'it') - 0.3, 0.4); place(sfx, swish(), WS(7, 'advertisement') - 0.15, 0.45)
place(sfx, thunk(60, 0.45), WS(7, 'advertisement'), 0.7); place(sfx, sub(0.8, 38), WS(7, 'advertisement'), 0.7); place(sfx, sting(), WS(7, 'advertisement') + 0.05, 0.35)
# L8 every ticket
place(sfx, swish(), LS(8) - 0.15, 0.4); coins(WS(8, 'ticket'), 4); place(sfx, stamp(), WS(8, 'piece'), 0.45)
# L9 the pedestal
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, water(3.0), LS(9), 0.25); place(sfx, gull(), LS(9) + 0.5, 0.3); place(sfx, swish(), WS(9, 'pedestal') - 0.25, 0.4); place(sfx, stomp(0.9), WS(9, 'pedestal'), 0.5); place(sfx, slide(False, 0.6), WS(9, 'pay'), 0.3)
# L10 nobody; the newsboy
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, bonk(380), WS(10, 'nobody') + 0.2, 0.35); place(sfx, swish(), WS(10, 'until') - 0.15, 0.45); place(sfx, bell(990), WS(10, 'newspaper'), 0.3)
place(sfx, swish(), WS(10, 'begged') - 0.1, 0.35); place(sfx, flip(), WS(10, 'begged'), 0.4); place(sfx, ting(), WS(10, 'dollar'), 0.45)
# L11 pennies pour in
place(sfx, swish(), LS(11) - 0.15, 0.5); coins(WS(11, 'pennies'), 10, 0.45); countup(WS(11, 'hundred') - 0.2, LS(12) - 0.2, 0.4); place(sfx, swish(), WS(11, 'hundred') - 0.15, 0.4); place(sfx, boom(1.0), WS(11, 'chipped'), 0.35)
# L12 the statue arrives (payoff) + fireworks
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, boom(2.0), LS(12) + 0.05, 0.6); place(sfx, sub(1.0, 36), LS(12), 0.8); place(sfx, horn(1.0), LS(12) + 0.4, 0.35)
for k in range(5): place(sfx, boom(0.9), LS(12) + (8 + 16 * k + 4) / 30 + 0.3, 0.3); place(sfx, pop(), LS(12) + (8 + 16 * k) / 30 + 0.3, 0.3)
place(sfx, swish(), WS(12, 'rest') - 0.15, 0.45); place(sfx, sting(), WS(12, 'liberty'), 0.35)
mixdown()
