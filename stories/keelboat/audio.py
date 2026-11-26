# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def shanty(t0, t1, g=1.0):   # a bouncy sea-shanty-ish jig in 6/8 (instruments only)
    notes = [62, 66, 69, 66, 64, 67, 71, 67, 62, 69, 74, 69]; bt = 0.2; k = 0
    while t0 + k * bt < t1:
        place(music, pluck(midi(notes[k % len(notes)] + 12), 0.3, 0.6), t0 + k * bt, 0.18 * g)
        if k % 3 == 0: place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, 0.34 * g)
        k += 1
def waves(t0, d, g=0.12): place(sfx, lp_fast(noise(d), 900) * (0.6 + 0.4 * np.sin(np.arange(int(d * SR)) / SR * 2 * np.pi * 0.25)).astype(np.float32), t0, g)
waves(0, D, 0.06)
shanty(0, LS(1) - 0.05, 1.1); bed(0, LS(1), 'quirky', 0.55, 124)
bed(LS(1), LS(3), 'march', 0.95, 118)
shanty(LS(3), LS(5), 0.8); bed(LS(3), LS(5), 'quirky', 0.7, 120)
bed(LS(5), LS(7), 'march', 1.0, 136)
bed(LS(7), LS(9), 'tension', 1.2, 150)
bed(LS(9), LS(11) - 0.18, 'tension', 1.5, 168)
bed(LS(11), LS(12), 'dark', 0.6, 96)
bed(LS(12), LS(15), 'quirky', 0.85, 112)
shanty(LS(15), D, 1.2); bed(LS(15), D, 'march', 0.6, 126)
for fr in [60, 124, 182, 224, 268, 338, 400, 465, 520, 650, 722, 798, 870, 945, 1003, 1062, 1112, 1150, 1210, 1320, 1386, 1460, 1548, 1612, 1736, 1790]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [585, 1260, 1672]: place(sfx, whoosh(0.6), FR(fr), 0.5)
# L0 backwards over the finish on an upside-down boat
gag(gull(), 0.4, 0.4); place(sfx, splash(0.8), 0.2, 0.3); gag(boing(200, 0.5), WS(0, 'backwards'), 0.4); gag(bonk(380), WS(0, 'upside'), 0.4)
# L1 sawed off the keel, catchphrase, why
gag(scrape(1.0), WS(1, 'sawed'), 0.45); gag(thunk(100, 0.3), WS(1, 'keel') + 0.3, 0.45); place(sfx, sub(0.4, 50), WS(1, 'keel') + 0.3, 0.4); gag(stamp(), WS(1, 'boat'), 0.4); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 moose head
gag(thunk(160, 0.25), WS(2, 'hung'), 0.4); gag(horn(0.6), WS(2, 'moose'), 0.35)
# L3 shark costume
place(sfx, ting(), WS(3, 'pointed'), 0.3); gag(boing(160, 0.5), WS(3, 'shark'), 0.4); place(sfx, sting(), WS(3, 'shark') + 0.3, 0.25)
# L4 June doesn't answer; Truffle's suntan
place(sfx, tick(), WS(4, 'answer'), 0.4); gag(oink(), WS(4, 'pig'), 0.5); place(sfx, snore(1.0), WS(4, 'busy'), 0.3); gag(oink(), WS(4, 'suntan'), 0.4)
# L5 leg one: toast out of a toaster
gag(whoosh(0.9), WS(5, 'shot'), 0.45); gag(boing(500, 0.3), WS(5, 'toaster'), 0.45); place(sfx, ting(), WS(5, 'toaster') + 0.15, 0.3)
# L6 waving his hat
gag(stamp(), WS(6, 'boat'), 0.4); place(sfx, flip(), WS(6, 'waving'), 0.35); gag(gull(), WS(6, 'hat'), 0.3)
# L7 leg two: side wind, June straight on rails
gag(whoosh(1.4), WS(7, 'side'), 0.45); place(sfx, waves and leaves(1.5), WS(7, 'wind'), 0.3); gag(bell(1320), WS(7, 'rails'), 0.35)
# L8 slid sideways like a hockey puck through the fish market
gag(slide(False, 0.8), WS(8, 'slid'), 0.45); gag(thunk(300, 0.15), WS(8, 'puck'), 0.45); gag(crash(1.0), WS(8, 'through'), 0.5); place(sfx, sub(0.5, 48), WS(8, 'through'), 0.5)
for k in range(5): place(sfx, splat(), WS(8, 'fish') + k * 0.12, 0.25)
gag(gull(), WS(8, 'market') + 0.2, 0.35)
# L9 leg three: gust, flipped like a pancake
gag(whoosh(1.0), WS(9, 'gust'), 0.5); gag(flip(), WS(9, 'flipped'), 0.45); gag(splash(1.0), WS(9, 'flipped') + 0.3, 0.5); place(sfx, sub(0.5, 46), WS(9, 'flipped') + 0.3, 0.5); gag(boing(240, 0.5), WS(9, 'pancake'), 0.35)
# L10 pushed back to the start = the finish
place(sfx, whoosh(1.4), WS(10, 'pushed'), 0.35); gag(bell(880), WS(10, 'start'), 0.3); gag(bonk(420), WS(10, 'finish'), 0.4)
# L11 question + riser
place(sfx, scratch(), LS(11) - 0.12, 0.3); place(sfx, riser(1.2), LS(12) - 1.25, 0.4)
# L12 keel = big fin
place(sfx, drop(), WS(12, 'keel'), 0.5); gag(ting(), WS(12, 'fin'), 0.4)
# L13 wind shoves, water shoves back, forward
gag(whoosh(0.7), WS(13, 'shoves'), 0.4); gag(water(0.8), WS(13, 'water'), 0.4); gag(thunk(140, 0.2), WS(13, 'back'), 0.35); gag(slide(True, 0.6), WS(13, 'forward'), 0.4)
# L14 heavy bottom pulls it upright, roly-poly toy
gag(stomp(1.0), WS(14, 'heavy'), 0.45); gag(creak(0.6, 160), WS(14, 'upright'), 0.35); gag(bonk(500), WS(14, 'knocked'), 0.4); place(sfx, boing(300, 0.6), WS(14, 'knocked') + 0.2, 0.35)
# L15 June wins, Truffle's tan
gag(bell(1320), WS(15, 'won'), 0.4); place(sfx, ting(), WS(15, 'mile'), 0.3); gag(oink(), WS(15, 'tan'), 0.5); gag(ting(), WS(15, 'sunglasses'), 0.35)
# L16 new motto
gag(flip(), WS(16, 'motto'), 0.4); gag(splash(0.6), WS(16, 'less') + 0.4, 0.35); button(LS(16) + 2.4, 'march', 0.9)
mixdown()
