# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
def putter(t0, t1, g=0.35):          # 1896 engine: chugging putt-putt
    t = t0
    while t < t1: place(sfx, lp_fast(noise(0.06) * env(int(0.06 * SR), 0.002, 0.05), 300) * 1.4, t, g); t += 0.11
def pedals(t0, t1, g=0.22):          # chain clicks while pedalling
    t = t0
    while t < t1: place(sfx, hp_fast(noise(0.02) * env(int(0.02 * SR), 0.001, 0.015), 3000), t, g); t += 0.18
def honk(t, g=0.6):                  # angry goose = low, rough quack
    place(sfx, quack(), t, g); place(sfx, quack(), t + 0.22, g * 0.8)
# music: quirky chase -> tension through the rules and the chase -> drop -> march for the Brighton run
bed(0, LS(3) - 0.1, 'quirky', 0.95, 132)
bed(LS(3) - 0.1, LS(6) - 0.1, 'tension', 0.95, 128)
bed(LS(6) - 0.1, LS(8) - 0.2, 'tension', 1.15, 144)
bed(LS(8), LS(11) - 0.18, 'quirky', 0.9, 120)
bed(LS(11), D, 'march', 1.1, 128)
# L0 chase (flash-forward)
putter(0, LS(1)); pedals(0, LS(1)); place(sfx, engine(LS(1), 40), 0, 0.25); place(sfx, bell(1320), 0.35, 0.4); place(sfx, bell(1320), 0.55, 0.35)
place(sfx, swish(), WS(0, 'walter') - 0.15, 0.4); place(sfx, hum(1.5), WS(0, 'walter'), 0.25)
# L1 the car smoking through Kent
place(sfx, swish(), LS(1) - 0.15, 0.5); putter(LS(1), LS(3) - 0.2); place(sfx, engine(LS(3) - LS(1), 36), LS(1), 0.3)
place(sfx, swish(), WS(1, 'eight') - 0.15, 0.4); place(sfx, stamp(), WS(1, 'eight'), 0.4); place(sfx, sub(0.4, 50), WS(1, 'eight'), 0.4); place(sfx, horn(0.5), WS(1, 'smoking'), 0.25)
# L2 sign + constable writing
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, flip(), WS(2, 'four'), 0.35); place(sfx, swish(), WS(2, 'caught') - 0.15, 0.4); place(sfx, scrape(0.6), WS(2, 'caught'), 0.2); place(sfx, ting(), WS(2, 'first'), 0.4)
# L3 the 2 mph crawl
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, snore(1.1), LS(3) + 0.3, 0.3); place(sfx, slide(False, 0.8), WS(3, 'two'), 0.35); place(sfx, thunk(70, 0.3), WS(3, 'two'), 0.4)
# L4 the flag man
place(sfx, swish(), LS(4) - 0.15, 0.4); place(sfx, footsteps(LS(5) - LS(4), 3, 700), LS(4), 0.3); place(sfx, swish(), WS(4, 'waving') - 0.2, 0.35)
for k in range(4): place(sfx, whoosh(0.25), WS(4, 'waving') + k * 0.33, 0.2)
# L5 no flag man -> the constable jumps on his bike
place(sfx, swish(), LS(5) - 0.15, 0.5); putter(LS(5), LS(6)); place(sfx, swish(), WS(5, 'constable') - 0.15, 0.45); place(sfx, boing(240), WS(5, 'jumps'), 0.4); place(sfx, stomp(0.8), WS(5, 'bike'), 0.5); place(sfx, bell(1320), WS(5, 'bike') + 0.2, 0.4)
# L6-L8 the chase
place(sfx, swish(), LS(6) - 0.15, 0.5); putter(LS(6), WS(8, 'stops')); pedals(LS(6), WS(8, 'bicycle') + 0.2, 0.25); place(sfx, bonk(), WS(6, 'laugh'), 0.25)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, splat(), WS(7, 'mud'), 0.55); place(sfx, splash(0.6), WS(7, 'mud'), 0.35); place(sfx, sub(0.4, 48), WS(7, 'mud'), 0.4); place(sfx, slide(True, 0.5), WS(7, 'hills'), 0.25)
place(sfx, swish(), WS(7, 'furious') - 0.2, 0.4); honk(WS(7, 'furious')); honk(WS(7, 'goose') + 0.3, 0.5)
place(sfx, scratch(), LS(8) - 0.3, 0.35); place(sfx, swish(), LS(8) - 0.15, 0.4); place(sfx, screech(0.8), WS(8, 'stops') - 0.2, 0.4); place(sfx, thunk(60, 0.45), WS(8, 'gate'), 0.7); place(sfx, sub(0.7, 40), WS(8, 'gate'), 0.7); place(sfx, crash(0.6), WS(8, 'gate'), 0.25)
place(sfx, swish(), WS(8, 'bicycle') - 0.15, 0.4); place(sfx, bell(1320), WS(8, 'wins'), 0.5); place(sfx, bell(1320), WS(8, 'wins') + 0.18, 0.45); place(sfx, ting(), WS(8, 'wins') + 0.1, 0.3)
# L9 court
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, stamp(), WS(9, 'court'), 0.55); place(sfx, sub(0.4, 45), WS(9, 'court'), 0.4); place(sfx, swish(), WS(9, 'reads') - 0.15, 0.35); place(sfx, flip(), WS(9, 'reads'), 0.4); place(sfx, bonk(), WS(9, 'horse'), 0.35)
# L10 the horse panics
place(sfx, swish(), LS(10) - 0.15, 0.5); putter(LS(10), LS(11) - 0.2, 0.25); place(sfx, swish(), WS(10, 'terrify') - 0.15, 0.4); place(sfx, neigh(), WS(10, 'terrify'), 0.6); place(sfx, stomp(1.0), WS(10, 'terrify') + 0.3, 0.5); place(sfx, stomp(1.0), WS(10, 'horse'), 0.5)
# L11 Brighton run (payoff)
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, whoosh(0.6), WS(11, 'scraps'), 0.4); place(sfx, boom(1.4), WS(11, 'race'), 0.4); place(sfx, sub(0.8, 38), WS(11, 'race'), 0.7)
place(sfx, engine(LS(12) - LS(11), 44), LS(11), 0.4); putter(LS(11), LS(12), 0.3); place(sfx, horn(0.6), WS(11, 'race') + 0.3, 0.35); place(sfx, horn(0.5), WS(11, 'brighton'), 0.3); place(sfx, swish(), WS(11, 'race') - 0.15, 0.4)
# L12 the shilling -> loop
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, ting(), WS(12, 'one'), 0.6); place(sfx, bell(2200), WS(12, 'one') + 0.35, 0.3); place(sfx, swish(), WS(12, 'one') + 0.07, 0.3)
place(sfx, swish(), WS(12, 'bicycle') - 0.25, 0.45); putter(WS(12, 'bicycle') - 0.2, D); pedals(WS(12, 'bicycle') - 0.2, D); place(sfx, bell(1320), WS(12, 'bicycle') + 0.1, 0.4)
mixdown()
