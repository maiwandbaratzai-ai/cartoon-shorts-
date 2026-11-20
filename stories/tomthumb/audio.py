# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
import numpy as np
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
START = WS(4, 'bolts') - 0.2; ROAR = WS(5, 'roars'); SNAP = WS(7, 'snaps'); WINS = WS(9, 'wins')
def chuffs(t0, t1, rate, g=0.5):          # the little engine: low chuff + sub on every beat
    t = t0
    while t < t1: place(sfx, thunk(70, 0.18, 0.8), t, g); place(sfx, hp_fast(noise(0.12) * env(int(0.12 * SR), 0.003, 0.1), 900), t, g * 0.5); t += 1 / rate
def gallop(t0, t1, g=0.5):                # four-beat hooves with weight
    t = t0
    while t < t1:
        for k, dt in enumerate((0, 0.07, 0.14, 0.21)): place(sfx, stomp(0.6), t + dt, g * (1 if k == 0 else 0.6))
        t += 0.42
# music: quirky start, tension rising through the race, near-silence (0.2 s) on the [beat], march for the win and the twist
bed(0, LS(3) - 0.1, 'quirky', 0.85, 120)
bed(LS(3) - 0.1, ROAR - 0.1, 'tension', 0.9, 124)
bed(ROAR - 0.1, LS(9) - 0.2, 'tension', 1.2, 144)
bed(LS(9), LS(10) - 0.1, 'march', 1.0, 120)
bed(LS(10) - 0.1, LS(12) - 0.1, 'tension', 0.85, 112)
bed(LS(12) - 0.1, D, 'march', 0.95, 116)
# flash-forward: wheezing engine + trotting horse
chuffs(0, LS(1) - 0.2, 1.4, 0.35); gallop(0, LS(1) - 0.2, 0.35); place(sfx, neigh(), 0.9, 0.45); place(sfx, swish(), WS(0, 'peter') - 0.15, 0.4)
place(sfx, swish(), LS(1) - 0.15, 0.5); chuffs(LS(1), START, 1.0, 0.25); place(sfx, horn(0.5), LS(1) + 0.3, 0.25)
place(sfx, swish(), WS(1, 'size') - 0.15, 0.4); place(sfx, boing(260), WS(1, 'cart'), 0.3); place(sfx, swish(), WS(1, 'railroad') - 0.15, 0.4); place(sfx, hum(1.2), WS(1, 'railroad'), 0.3)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, bonk(), WS(2, 'laugh'), 0.35); place(sfx, swish(), WS(2, 'bring') - 0.15, 0.4); place(sfx, neigh(), WS(2, 'horse'), 0.55); place(sfx, stomp(0.8), WS(2, 'horse') + 0.3, 0.5)
place(sfx, swish(), WS(2, 'dare') - 0.15, 0.4); place(sfx, stamp(), WS(2, 'race'), 0.35)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, swish(), WS(3, 'thirteen') - 0.15, 0.4); place(sfx, flip(), WS(3, 'thirteen'), 0.4)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, bell(990), START - 0.1, 0.35); gallop(START, WINS + 0.4, 0.5); place(sfx, neigh(), WS(4, 'bolts') + 0.2, 0.4)
chuffs(START, ROAR, 2.0, 0.4)
for k in range(4): place(sfx, thunk(60, 0.25, 0.9), WS(4, 'coughing') + k * 0.32, 0.45); place(sfx, hp_fast(noise(0.2) * env(int(0.2 * SR), 0.004, 0.15), 500), WS(4, 'coughing') + k * 0.32, 0.4)
place(sfx, swish(), WS(4, 'coughing') - 0.15, 0.4)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, rumble(1.2), ROAR, 0.6); place(sfx, engine(1.4, 46), ROAR, 0.5); place(sfx, sub(0.8, 44), ROAR, 0.6); place(sfx, horn(0.9), ROAR + 0.1, 0.4)
chuffs(ROAR, SNAP, 6.0, 0.4); place(sfx, swish(), WS(5, 'passes') - 0.25, 0.45); place(sfx, whoosh(0.6), WS(5, 'passes'), 0.4)
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, flip(), WS(6, 'wave'), 0.3); place(sfx, flip(), WS(6, 'hats'), 0.3); place(sfx, swish(), WS(6, 'poor') - 0.15, 0.4); place(sfx, neigh(), WS(6, 'horse'), 0.4)
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, snap(), SNAP, 0.7); place(sfx, boom(0.9), SNAP, 0.35); place(sfx, sub(0.7, 40), SNAP, 0.8); place(sfx, scratch(), SNAP + 0.15, 0.25)
place(sfx, swish(), WS(7, 'fire') - 0.15, 0.4); place(sfx, slide(False, 0.9), WS(7, 'die'), 0.4)
t = SNAP + 0.3; r = 5.0
while t < LS(9) - 0.25: place(sfx, thunk(65, 0.2, 0.7), t, 0.35); t += 1 / r; r = max(1.2, r * 0.9)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, rattle(0.6), WS(8, 'scrambles'), 0.35); place(sfx, bonk(), WS(8, 'scrambles') + 0.6, 0.3); place(sfx, swish(), WS(8, 'wheezes') - 0.15, 0.4); place(sfx, creak(0.9, 110), WS(8, 'wheezes'), 0.4)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, bell(1320), WINS, 0.45); place(sfx, thunk(55, 0.5), WINS, 0.8); place(sfx, sub(0.8, 38), WINS, 0.8); place(sfx, neigh(), WINS + 0.2, 0.55)
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, bloop(240), WS(10, 'loser'), 0.35)
place(sfx, swish(), LS(11) - 0.15, 0.5); chuffs(LS(11), LS(12) - 0.2, 6.0, 0.3); gallop(LS(11), LS(12) - 0.2, 0.35); place(sfx, swish(), WS(11, 'machine') - 0.15, 0.4); place(sfx, ting(), WS(11, 'machine'), 0.4)
place(sfx, swish(), LS(12) - 0.15, 0.5); place(sfx, horn(0.8), WS(12, 'steam'), 0.4); place(sfx, horn(0.6), WS(12, 'steam') + 0.5, 0.3); chuffs(LS(12), LS(13), 2.5, 0.25)
place(sfx, swish(), WS(12, 'horses') - 0.15, 0.4); place(sfx, footsteps(1.5, 3, 500), WS(12, 'horses'), 0.4); place(sfx, neigh(), WS(12, 'home'), 0.4)
place(sfx, swish(), LS(13) - 0.15, 0.5); chuffs(LS(13), D, 1.4, 0.3); gallop(LS(13), D, 0.3); place(sfx, slide(False, 0.6), WS(13, 'lose'), 0.3)
mixdown()
