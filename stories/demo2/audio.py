# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['dur'] if 'dur' in TM else TM['frames'] / 30
RAIN = WS(2, 'rain')
bed(0, RAIN - 0.35, 'quirky', 0.9, 112)                                   # playful farm morning
bed(RAIN - 0.15, WS(3, 'grip') - 0.2, 'tension', 1.15, 118)             # the race in the rain
bed(WS(3, 'grip') - 0.05, D, 'march', 1.0, 124)                          # Gus wins
for k in range(4): place(sfx, pop(), 0.15 + k * 0.38, 0.45); place(sfx, sub(0.25, 70), 0.15 + k * 0.38, 0.25)   # hammer clanks
place(sfx, engine(2.6, 34), 1.45, 0.35)                                   # Gus's engine putters
place(sfx, engine(2.0, 40), WS(1, 'rusty') - 0.6, 0.4); place(sfx, swish(), WS(1, 'rusty') - 0.1, 0.5)
place(sfx, boing(), WS(1, 'ferris'), 0.35)                                # the joke lands
place(sfx, whoosh(1.0), 5.0, 0.55)                                        # mist wipe
place(sfx, rumble(D - RAIN) * 0.25 + water(D - RAIN) * 0.35, RAIN, 0.5)  # rain hiss
place(sfx, hum(2.0), RAIN, 0.3)
place(sfx, screech(1.6), WS(2, 'spun') - 0.05, 0.6); place(sfx, scrape(1.4), WS(2, 'spitting'), 0.55)   # wheels spinning, sparks
place(sfx, sub(0.8, 45), WS(2, 'spitting'), 0.7); place(sfx, swish(), 7.25, 0.45)
place(sfx, ting(), WS(3, 'grip'), 0.6); place(sfx, pop(), WS(3, 'grip') + 0.05, 0.4)
place(sfx, engine(2.5, 30), WS(4, 'rolled') - 0.2, 0.45); place(sfx, whoosh(0.6), WS(4, 'past'), 0.5)
place(sfx, sting(), WS(4, 'won'), 0.5); place(sfx, bell(990), WS(4, 'won') + 0.1, 0.35)
mixdown()
