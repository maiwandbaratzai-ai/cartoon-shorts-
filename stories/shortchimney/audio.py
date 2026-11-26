# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
def spacey(t0, t1, g=1.0):   # a bouncy theremin-ish alien tune over pizzicato (instruments only)
    notes = [69, 72, 76, 74, 72, 69, 67, 71, 74, 72, 71, 67]; bt = 0.24; k = 0
    while t0 + k * bt < t1:
        n = int(0.3 * SR); t = np.arange(n) / SR; fq = midi(notes[k % len(notes)] + 12) * (1 + 0.01 * np.sin(2 * np.pi * 6 * t))
        place(music, (np.sin(2 * np.pi * np.cumsum(fq) / SR) * env(n, 0.02, 0.15)).astype(np.float32), t0 + k * bt, 0.09 * g)
        place(music, pizz(midi(notes[k % len(notes)] - 12)), t0 + k * bt, (0.3 if k % 2 == 0 else 0.14) * g); k += 1
def cough(t0, g=0.3):
    for k in range(2): place(sfx, bp(noise(0.12), 900) * env(int(0.12 * SR), 0.005, 0.08), t0 + k * 0.18, g)
def train_chuff(t0, d, g=0.3):
    k = 0
    while k * 0.22 < d: place(sfx, hp_fast(noise(0.12), 1200) * env(int(0.12 * SR), 0.005, 0.1), t0 + k * 0.22, g * (1 if k % 2 == 0 else 0.6)); k += 1
spacey(0, LS(1) - 0.05, 1.1); bed(0, LS(1), 'quirky', 0.55, 126)
bed(LS(1), LS(2), 'march', 0.9, 118)
bed(LS(2), LS(4), 'quirky', 0.95, 124)
bed(LS(4), LS(6), 'march', 1.0, 132)
spacey(LS(6), LS(7), 0.8)
bed(LS(7), LS(8) - 0.18, 'tension', 1.45, 160)
bed(LS(8), LS(9), 'dark', 0.6, 96)
bed(LS(9), LS(12), 'quirky', 0.85, 112)
spacey(LS(12), D, 1.2); bed(LS(12), D, 'march', 0.6, 124)
for fr in [48, 98, 150, 200, 253, 305, 363, 420, 495, 545, 625, 670, 712, 755, 797, 850, 940, 1000, 1050, 1104, 1150, 1243, 1289]: place(sfx, swish(), FR(fr) - 0.1, 0.33)
for fr in [887, 1190]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, leaves(D), 0, 0.03)
# L0 black cat out of the smoking cottage
cough(0.3, 0.3); gag(meow(), WS(0, 'cat'), 0.5); place(sfx, hum(1.6), 0, 0.15); gag(boing(160, 0.5), WS(0, 'black'), 0.4)
# L1 alien, teacup-tall, short and sweet, why
place(sfx, bloop(500), WS(1, 'alien'), 0.4); gag(clink(1), WS(1, 'teacup'), 0.45); place(sfx, ting(), WS(1, 'teacup') + 0.2, 0.3); gag(stamp(), WS(1, 'and') + 0.2, 0.4); place(sfx, scratch(), WS(1, 'why') - 0.2, 0.25)
# L2 fire, smoke ignores the chimney
place(sfx, roar(1.0, 600) if False else rumble(1.0), WS(2, 'lit'), 0.3); gag(slide(False, 0.6), WS(2, 'ignored'), 0.4); cough(WS(2, 'filled'), 0.35); place(sfx, cough and hum(1.0), WS(2, 'kitchen'), 0.15)
# L3 Duchess's dream gone
gag(meow(), WS(3, 'duchess'), 0.5); place(sfx, bell(1500), WS(3, 'whitest'), 0.3); gag(whoosh(0.5), WS(3, 'gone'), 0.45); gag(bonk(380), WS(3, 'seconds'), 0.4); countup(WS(3, 'four') - 0.1, WS(3, 'four') + 0.4, 0.25)
# L4 windows open, steam train in a hat
for k in range(6): place(sfx, flip(), WS(4, 'opened') + k * 0.08, 0.3)
train_chuff(WS(4, 'smoke'), 2.4, 0.3); gag(horn(0.5), WS(4, 'train'), 0.4); gag(boing(320, 0.3), WS(4, 'hat'), 0.35)
# L5 Mrs. Fig waves, buys a ticket
place(sfx, ting(), WS(5, 'waved'), 0.3); gag(clink(2), WS(5, 'buy'), 0.4); gag(stamp(), WS(5, 'ticket'), 0.45)
# L6 even shorter
for k in range(3): place(sfx, thunk(160, 0.2), WS(6, 'made') + k * 0.25, 0.35)
gag(slide(False, 0.5), WS(6, 'shorter'), 0.4); gag(stamp(), WS(6, 'and') + 0.2, 0.4)
# L7 wind stuffs the smoke out the mail slot
gag(whoosh(1.4), WS(7, 'wind'), 0.5); place(sfx, leaves(1.5), WS(7, 'rolled'), 0.35); gag(slide(False, 0.6), WS(7, 'stuffed'), 0.4); gag(flip(), WS(7, 'mail'), 0.45); gag(boom(0.6), WS(7, 'slot'), 0.4); place(sfx, sub(0.4, 48), WS(7, 'slot'), 0.4); cough(WS(7, 'slot') + 0.4, 0.3)
# L8 question + riser
place(sfx, scratch(), LS(8) - 0.12, 0.3); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 hot smoke rises
place(sfx, drop(), WS(9, 'hot'), 0.5); gag(slide(True, 0.8), WS(9, 'rise'), 0.4)
# L10 tall tube, pulls like a straw
gag(slide(True, 1.0), WS(10, 'tall'), 0.4); place(sfx, creak(0.6, 200), WS(10, 'tube'), 0.3); gag(gulp(), WS(10, 'straw'), 0.45)
# L11 above the roof, above the wind
gag(ting(), WS(11, 'above'), 0.4); place(sfx, whoosh(0.8), WS(11, 'wind'), 0.4); gag(bell(1320), WS(11, 'in'), 0.3)
# L12 built tall, cat licks itself white
gag(stamp(), WS(12, 'tall'), 0.4); gag(meow(), WS(12, 'duchess'), 0.5); place(sfx, chew(1.0, 6), WS(12, 'licking'), 0.3); gag(ting(), WS(12, 'white'), 0.4)
# L13 saucer parks on top
place(sfx, bloop(300), WS(13, 'flying'), 0.4); gag(hum(1.2), WS(13, 'saucer'), 0.35); gag(thunk(120, 0.25), WS(13, 'top'), 0.45); button(WS(13, 'top') + 0.4, 'march', 0.9)
mixdown()
