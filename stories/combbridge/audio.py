# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def wind(t0, d, g=0.2, cut=700): place(sfx, lp_fast(noise(d), cut) * env(int(d * SR), 0.5, 0.5), t0, g)
def hooves(t0, d, g=0.3):
    k = 0
    while k * 0.22 < d: place(sfx, thunk(300 + (k % 2) * 60, 0.06, 0.2), t0 + k * 0.22, g); k += 1
def clack(t, g=0.4): place(sfx, thunk(700, 0.05, 0.1), t, g); place(sfx, ting(), t, g * 0.2)
bed(0, LS(5) - 0.2, 'quirky', 0.95, 122)
bed(LS(5) - 0.2, LS(6) - 0.1, 'tension', 0.9, 110)
bed(LS(6) - 0.1, LS(7) - 0.1, 'tension', 1.1, 124)
bed(LS(7) - 0.1, LS(9) - 0.2, 'tension', 1.35, 142)
bed(LS(9) - 0.1, LS(13) - 0.18, 'quirky', 0.8, 116)
bed(LS(13), D, 'march', 1.1, 128)
wind(0, D, 0.12)
# L0 hammering teeth
for k in range(5): place(sfx, thunk(380, 0.07, 0.2), 0.2 + k * 0.33, 0.4); place(sfx, ting(), 0.2 + k * 0.33, 0.12)
place(sfx, swish(), FR(46) - 0.1, 0.45); place(sfx, ting(), WS(0, 'teeth'), 0.35); place(sfx, neigh(), FR(70), 0.35)
# L1 canyon, $5,000
place(sfx, swish(), FR(89) - 0.1, 0.45); place(sfx, whoosh(1.0), FR(95), 0.3); place(sfx, swish(), FR(150) - 0.1, 0.4); countup(WS(1, 'pays'), WS(1, '5') + 0.4); place(sfx, ting(), WS(1, '5') + 0.4, 0.4)
place(sfx, swish(), FR(200) - 0.1, 0.4); place(sfx, bell(880), WS(1, 'mail'), 0.3)
# L2 laugh
place(sfx, swish(), FR(236) - 0.1, 0.45); place(sfx, stamp(), WS(2, 'comb'), 0.45); place(sfx, boing(), WS(2, 'comb') + 0.3, 0.3); place(sfx, swish(), FR(285) - 0.1, 0.4); place(sfx, neigh(), FR(300), 0.35)
# L3 smooth bridge
place(sfx, swish(), FR(326) - 0.1, 0.45); place(sfx, whoosh(1.2), WS(3, 'smooth'), 0.35); place(sfx, swish(), FR(372) - 0.1, 0.4); place(sfx, ting(), WS(3, 'gap'), 0.3)
# L4 wagons + clack clack clack
place(sfx, swish(), FR(417) - 0.1, 0.45); hooves(LS(4), 2.4, 0.3); place(sfx, swish(), FR(470) - 0.1, 0.4)
for k in range(3): clack(WS(4, 'clack') + k * 0.42, 0.5)
# L5 June
place(sfx, swish(), FR(536) - 0.1, 0.45); place(sfx, bell(660), WS(5, 'june'), 0.3); countup(WS(5, 'june'), WS(5, 'thirty') + 0.3); place(sfx, swish(), FR(590) - 0.1, 0.4); place(sfx, creak(0.9, 120), WS(5, 'creaked'), 0.6); place(sfx, sub(0.5, 46), WS(5, 'creaked'), 0.4)
# L6 July bump
place(sfx, swish(), FR(656) - 0.1, 0.45); place(sfx, bell(740), WS(6, 'july'), 0.3); place(sfx, creak(1.0, 100), WS(6, 'bump'), 0.5); place(sfx, slide(True, 0.6), WS(6, 'bump'), 0.35)
place(sfx, swish(), FR(720) - 0.1, 0.4); hooves(FR(720), 1.6, 0.3); place(sfx, boing(160), FR(752), 0.4); place(sfx, swish(), FR(770) - 0.1, 0.4); place(sfx, ting(), WS(6, 'grinned'), 0.3)
# L7 August hump, stuck (hype)
place(sfx, swish(), FR(812) - 0.1, 0.45); place(sfx, bell(830), WS(7, 'august'), 0.3); place(sfx, creak(1.4, 80), WS(7, 'hump') - 0.2, 0.7); place(sfx, sub(1.0, 36), WS(7, 'hump'), 0.7); place(sfx, boom(1.2), WS(7, 'hump') + 0.1, 0.35)
place(sfx, swish(), FR(870) - 0.1, 0.45); place(sfx, scrape(1.2), WS(7, 'stuck'), 0.45)
# L8 push/pull
place(sfx, swish(), FR(935) - 0.1, 0.45); place(sfx, stomp(1.0), WS(8, 'pushed'), 0.5); place(sfx, neigh(), WS(8, 'pulled'), 0.45); place(sfx, swish(), FR(980) - 0.1, 0.4); place(sfx, bonk(), WS(8, 'inch'), 0.4)
# L9 why? re-hook
place(sfx, scratch(), LS(9) - 0.3, 0.35); place(sfx, hum(1.6), LS(9), 0.25)
# L10 jar
place(sfx, whoosh(0.6), FR(1082) - 0.15, 0.45); place(sfx, creak(0.6, 300), WS(10, 'jar'), 0.35); place(sfx, swish(), FR(1140) - 0.1, 0.4); place(sfx, water(1.2), WS(10, 'hot'), 0.4); place(sfx, pop(), WS(10, 'pops'), 0.6); place(sfx, boing(300), WS(10, 'pops') + 0.1, 0.35)
# L11 heat grows metal
place(sfx, whoosh(0.6), FR(1200) - 0.15, 0.45); place(sfx, sting(), WS(11, 'heat'), 0.35); place(sfx, slide(True, 0.6), WS(11, 'grows'), 0.35); place(sfx, ting(), WS(11, 'five'), 0.4); place(sfx, swish(), FR(1265) - 0.1, 0.4)
# L12 shoved the cliffs
place(sfx, swish(), FR(1335) - 0.1, 0.45); place(sfx, thunk(60, 0.5), WS(12, 'shoved'), 0.7); place(sfx, sub(0.8, 34), WS(12, 'shoved'), 0.7); place(sfx, rumble(1.0), WS(12, 'shoved'), 0.4); place(sfx, swish(), FR(1385) - 0.1, 0.4); place(sfx, creak(0.8, 90), WS(12, 'bent'), 0.5)
# L13 [beat] teeth slide (payoff)
place(sfx, swish(), FR(1435) - 0.1, 0.45); place(sfx, slide(False, 0.5), WS(13, 'apart'), 0.4); place(sfx, swish(), FR(1490) - 0.1, 0.4); place(sfx, slide(True, 0.5), WS(13, 'together'), 0.4); place(sfx, ting(), WS(13, 'together') + 0.4, 0.4)
# L14-15 flat, mail rolls, money
place(sfx, swish(), FR(1533) - 0.1, 0.45); place(sfx, whoosh(1.2), WS(14, 'flat'), 0.3); place(sfx, swish(), FR(1615) - 0.1, 0.45); hooves(LS(15), 1.8, 0.35)
for k in range(3): clack(WS(15, 'rolled') + 0.6 + k * 0.2, 0.3)
place(sfx, swish(), FR(1660) - 0.1, 0.4); countup(WS(15, 'got'), WS(15, '5') + 0.3); place(sfx, ting(), WS(15, '5') + 0.3, 0.45)
# L16 beg
place(sfx, swish(), FR(1705) - 0.1, 0.45); place(sfx, slide(False, 0.5), WS(16, 'begged'), 0.3)
# L17 horse combs tail
place(sfx, swish(), FR(1771) - 0.1, 0.45); place(sfx, ting(), WS(17, 'agreed'), 0.3); place(sfx, swish(), FR(1840) - 0.1, 0.4); place(sfx, neigh(), WS(17, 'horse'), 0.5)
for k in range(8): clack(WS(17, 'combing') + k * 0.16, 0.25)
place(sfx, neigh(), FR(1890), 0.45)
mixdown()
