# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def wind(t0, d, g=0.3): place(sfx, lp_fast(noise(d), 700) * env(int(d * SR), 0.5, 0.6), t0, g)
def crunch(t0, t1, rate=3.2, g=0.3):   # paws in snow
    t = t0
    while t < t1: place(sfx, lp_fast(noise(0.07) * env(int(0.07 * SR), 0.003, 0.05), 1800), t, g); t += 1 / rate
def scritch(t0, n, g=0.35):
    for k in range(n): place(sfx, hp_fast(noise(0.07) * env(int(0.07 * SR), 0.002, 0.05), 2500), t0 + k * 0.13, g)
bed(0, LS(2) - 0.1, 'sad', 0.9, 88)
bed(LS(2) - 0.1, LS(4) - 0.1, 'tension', 0.95, 120)
bed(LS(4) - 0.1, LS(6) - 0.1, 'quirky', 0.9, 124)
bed(LS(6) - 0.1, LS(8) - 0.15, 'tension', 1.15, 136)
bed(LS(8) + 0.9, LS(9) - 0.18, 'tension', 0.8, 112)
bed(LS(9), D, 'march', 1.1, 128)
# L0 the snowy pass
wind(0, LS(1), 0.35); crunch(0.1, LS(1) - 0.2); place(sfx, hum(2.0), 0.2, 0.25); place(sfx, sub(0.8, 40), 0.05, 0.4)
place(sfx, swish(), WS(0, 'miles') - 0.15, 0.4); place(sfx, stomp(0.6), WS(0, 'miles'), 0.4)
# L1 the door
place(sfx, swish(), LS(1) - 0.15, 0.5); scritch(WS(1, 'scratches'), 6); place(sfx, bark(), WS(1, 'collie') - 0.1, 0.45)
place(sfx, creak(0.7, 160), WS(1, 'door') + 0.2, 0.45); place(sfx, swish(), WS(1, 'door') + 0.1, 0.35); place(sfx, thunk(70, 0.35), WS(1, 'oregon'), 0.5); place(sfx, sub(0.5, 44), WS(1, 'oregon'), 0.5)
# L2 the map
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, flip(), LS(2) + 0.1, 0.35); place(sfx, slide(True, 1.2), WS(2, 'other'), 0.3); place(sfx, ting(), WS(2, 'indiana'), 0.4)
# L3 rivers, Rockies
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, water(1.6), LS(3), 0.35); place(sfx, swish(), WS(3, 'deserts') - 0.15, 0.45); wind(WS(3, 'deserts'), 2.0, 0.4); crunch(WS(3, 'deserts'), LS(4) - 0.2)
place(sfx, boom(1.2), WS(3, 'mountains'), 0.3); place(sfx, sub(0.6, 40), WS(3, 'mountains'), 0.5)
# L4 neighbours laugh, Dad stern
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, bonk(), WS(4, 'laugh'), 0.3); place(sfx, boing(200), WS(4, 'no'), 0.3); place(sfx, swish(), WS(4, 'finds') - 0.15, 0.4); place(sfx, thunk(90, 0.25), WS(4, 'indiana'), 0.35)
# L5 letters
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, stomp(0.6), LS(5) + 0.3, 0.35); place(sfx, whoosh(0.6), WS(5, 'arriving'), 0.4)
for k in range(8): place(sfx, flip(), WS(5, 'arriving') + 0.15 + k * 0.12, 0.25)
place(sfx, bark(), WS(5, 'arriving') + 0.4, 0.4); place(sfx, swish(), WS(5, 'fed') - 0.15, 0.4); place(sfx, ting(), WS(5, 'fed'), 0.35)
# L6 farmer / cook / blizzard
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, chew(1.2), LS(6) + 0.2, 0.4); place(sfx, cluck(), LS(6) + 0.5, 0.3); place(sfx, moo(), WS(6, 'iowa'), 0.25)
place(sfx, swish(), WS(6, 'cook') - 0.15, 0.45); place(sfx, bell(990), WS(6, 'cook'), 0.3); place(sfx, gulp(), WS(6, 'wyoming'), 0.4); place(sfx, bark(), WS(6, 'wyoming') + 0.3, 0.4)
place(sfx, swish(), WS(6, 'family') - 0.15, 0.45); wind(WS(6, 'family'), LS(7) - WS(6, 'family'), 0.5); place(sfx, creak(0.5), WS(6, 'hid'), 0.35); place(sfx, thunk(80, 0.3), WS(6, 'blizzard'), 0.45)
# L7 icy river + climb
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, splash(0.9), LS(7), 0.5); place(sfx, water(1.6), LS(7) + 0.2, 0.4); place(sfx, sub(0.4, 46), LS(7), 0.4)
place(sfx, swish(), WS(7, 'climbed') - 0.2, 0.45); wind(WS(7, 'climbed'), LS(8) - WS(7, 'climbed'), 0.45); crunch(WS(7, 'climbed'), LS(8) - 0.3, 3.5, 0.35); place(sfx, stomp(0.7), WS(7, 'snow'), 0.4)
# L8 how? [beat] sniff -> the route
place(sfx, swish(), LS(8) - 0.15, 0.5); scritch(LS(8) + 0.3, 4, 0.25); place(sfx, scratch(), WS(8, 'he') - 0.3, 0.35)
place(sfx, swish(), WS(8, 'retraced') - 0.15, 0.45); place(sfx, thunk(60, 0.4), WS(8, 'retraced'), 0.6); place(sfx, sub(0.7, 38), WS(8, 'retraced'), 0.6)
for k in range(6): place(sfx, ting(), WS(8, 'town') + k * 0.16, 0.2)
# L9 Oregon goes wild (payoff)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, boom(1.6), LS(9) + 0.05, 0.45); place(sfx, sub(0.9, 36), LS(9), 0.7); place(sfx, horn(0.8), WS(9, 'wild'), 0.35)
place(sfx, ting(), WS(9, 'medals'), 0.5); place(sfx, bell(1760), WS(9, 'keys'), 0.4); place(sfx, swish(), WS(9, 'house') - 0.15, 0.45); place(sfx, stamp(), WS(9, 'house'), 0.45); place(sfx, bark(), WS(9, 'house') + 0.3, 0.45)
# L10 crowds, L11 movie
place(sfx, swish(), LS(10) - 0.15, 0.5); countup(WS(10, 'forty'), WS(10, 'forty') + 1.0, 0.4); place(sfx, footsteps(1.4, 8, 800), LS(10) + 0.3, 0.3); place(sfx, bark(), WS(10, 'pet'), 0.4)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, rattle(1.4), LS(11) + 0.1, 0.35); place(sfx, ting(), WS(11, 'movie'), 0.35)
# L12 back at the door (loop)
place(sfx, swish(), LS(12) - 0.15, 0.5); scritch(LS(12) + 0.2, 8, 0.35); place(sfx, bark(), WS(12, 'door'), 0.45); wind(WS(12, 'door'), D - WS(12, 'door'), 0.3)
mixdown()
