# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, LS(1) - 0.05, 'tension', 1.0, 140)                    # the winner staggering in
bed(LS(1), LS(6) - 0.05, 'march', 0.9, 116)                  # heat, dust, one well, the start
bed(LS(6), LS(9) - 0.05, 'quirky', 1.0, 128)                 # Lorz rides a car
bed(LS(9), LS(13) - 0.05, 'quirky', 0.95, 112)               # Carvajal, the dogs
bed(LS(13), LS(15) - 0.05, 'dark', 1.0, 96)                  # strychnine
bed(LS(15), TM['dur'], 'march', 1.0, 116)                    # slowest ever (runs to the cut)
place(sfx, crowd(LS(1), 'cheer') * 0.5, 0, 0.4); place(sfx, footsteps(LS(1), 4, 500), 0, 0.4)
place(sfx, sting(), WS(0, 'rat'), 0.5)
place(sfx, leaves(LE(2) - LS(1)), LS(1), 0.3); place(sfx, footsteps(LE(1) - LS(1), 8, 700), LS(1), 0.5)
place(sfx, engine(LE(2) - LS(2) + 0.3, 45), LS(2), 0.7); place(sfx, horn(0.5), WS(2, 'cars') + 0.1, 0.5); place(sfx, whoosh(1.0), WS(2, 'dust'), 0.6)
place(sfx, leaves(LE(3) - LS(3)), LS(3), 0.4)
place(sfx, water(1.5), WS(4, 'water'), 0.5); place(sfx, ting(), WS(4, 'twelve'), 0.4)
place(sfx, gunshot(), LS(5) + 0.1, 0.9); place(sfx, crowd(1.5, 'cheer'), LS(5) + 0.2, 0.5); place(sfx, footsteps(1.5, 10, 700), WS(5, 'fourteen'), 0.4)
place(sfx, sting(), WS(6, 'cramps'), 0.5); place(sfx, engine(LE(7) - WS(6, 'hopped'), 50), WS(6, 'hopped') - 0.6, 0.7); place(sfx, horn(0.4), WS(6, 'hopped'), 0.6)
place(sfx, whoosh(0.6), WS(7, 'jumped'), 0.6); place(sfx, crowd(2.0, 'cheer'), WS(7, 'first') - 0.5, 0.8)
place(sfx, crowd(0.8, 'gasp'), WS(8, 'found'), 0.6); place(sfx, thunk(90, 0.3), WS(8, 'found'), 0.6)
place(sfx, sting(), WS(9, 'lost'), 0.4); place(sfx, engine(2.5, 50), WS(9, 'hitchhiked') - 0.3, 0.6); place(sfx, horn(0.4), WS(9, 'hitchhiked') + 0.6, 0.4)
place(sfx, thunk(200, 0.15), WS(10, 'rotten'), 0.5); place(sfx, snore(1.5), WS(10, 'nap'), 0.6)
place(sfx, ting(), WS(11, 'fourth'), 0.5)
for k in range(6): place(sfx, thunk(260 - 30 * (k % 2), 0.12), WS(12, 'dogs') - 0.4 + k * 0.28, 0.6)   # barks
place(sfx, footsteps(LE(12) - LS(12), 11, 800), LS(12), 0.5); place(sfx, ting(), WS(12, 'ninth'), 0.5)
place(sfx, gloop(0.8), WS(13, 'strychnine'), 0.5); place(sfx, sting(), WS(13, 'strychnine'), 0.5)
place(sfx, hum(LE(14) - LS(14)), LS(14), 0.3); place(sfx, crowd(LE(14) - LS(14), 'cheer') * 0.4, LS(14), 0.4)
place(sfx, bell(660), WS(15, 'slowest'), 0.5); place(sfx, crowd(TM['dur'] - LS(15), 'cheer') * 0.5, LS(15), 0.5)
mixdown()
