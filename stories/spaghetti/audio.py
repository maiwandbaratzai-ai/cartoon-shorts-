# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
bed(0, LS(5) - 0.05, 'quirky', 1.0, 120)                  # the harvest
bed(LS(5), LS(7) - 0.05, 'march', 1.0, 128)                # 8 million watched, phones explode
bed(LS(7), LS(9) - 0.4, 'tension', 0.8, 100)               # the BBC's answer
bed(LS(9), D, 'quirky', 1.1, 132)                          # April the first
for k in range(4): place(sfx, boing(200 + k * 30, 0.4), 0.1 + k * 0.4, 0.3); place(sfx, slide(False, 0.3), 0.3 + k * 0.4, 0.15)
place(sfx, ting(), WS(0, 'bbc'), 0.3); place(sfx, swish(), WS(0, 'trees') - 0.25, 0.5); place(sfx, crowd(1.2, 'cheer'), WS(0, 'trees'), 0.15)
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, leaves(1.2), WS(1, 'dangled'), 0.4); place(sfx, boing(170), WS(1, 'dangled'), 0.35)
place(sfx, slide(False, 0.4), WS(1, 'yanked'), 0.4); place(sfx, boing(260), WS(1, 'yanked') + 0.2, 0.35); place(sfx, gloop(0.4), WS(1, 'down'), 0.3)
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, footsteps(0.8, 5, 500), LS(2), 0.3); place(sfx, scrape(0.4), WS(2, 'laid'), 0.25); place(sfx, bell(990), WS(2, 'sun'), 0.3)
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, horn(0.4), WS(3, 'reporter'), 0.2); place(sfx, pop(), WS(3, 'bumper'), 0.4); place(sfx, crowd(0.9, 'cheer'), WS(3, 'crop'), 0.2)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, sting(), WS(4, 'dreaded'), 0.3); place(sfx, scrape(0.5), WS(4, 'weevil'), 0.2); place(sfx, pop(), WS(4, 'gone'), 0.6); place(sfx, boing(240), WS(4, 'gone') + 0.1, 0.35)
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, hum(1.8), LS(5), 0.15); countup(WS(5, 'eight') - 0.1, WS(5, 'watched')); place(sfx, ting(), WS(5, 'watched'), 0.3); place(sfx, gulp(), WS(5, 'believed'), 0.4)
place(sfx, swish(), LS(6) - 0.15, 0.5)
for k in range(8): place(sfx, bell(1200 + (k % 3) * 160), WS(6, 'phones') + k * 0.22, 0.25)
place(sfx, boom(0.8), WS(6, 'exploded'), 0.25); place(sfx, scratch(), LS(7) - 0.1, 0.4)
place(sfx, ting(), WS(7, 'answer'), 0.35); place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, thunk(160, 0.25), WS(8, 'sprig'), 0.4); place(sfx, gloop(0.5), WS(8, 'tomato'), 0.4); place(sfx, slide(True, 0.6), WS(8, 'hope'), 0.35)
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, flip(), WS(9, 'april') - 0.1, 0.6); place(sfx, stamp(), WS(9, 'april') + 0.1, 0.4); place(sfx, crowd(1.5, 'cheer'), WS(9, 'first'), 0.3); place(sfx, swish(), WS(9, 'april') + 0.35, 0.4); place(sfx, boing(180), D - 0.6, 0.3)
mixdown()
