# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
F = lambda fr: fr / 30
bed(0, LS(2) - 0.05, 'quirky', 1.0, 124)            # the cat in a hat
bed(LS(2), LS(5) - 0.05, 'sad', 0.9, 96)             # the dying line
bed(LS(5), LS(9) - 0.05, 'quirky', 1.0, 124)          # the stray becomes station master
bed(LS(9), LS(13) - 0.05, 'march', 1.0, 128)          # tourists, busloads, millions
bed(LS(13), LS(16) - 0.4, 'quirky', 1.0, 130)         # promotion, office
bed(LS(16), D, 'march', 1.05, 132)                    # the cat station + cat train, loop
# hook
place(sfx, meow(), 0.15, 0.6); place(sfx, crowd(2.2, 'cheer'), 0.1, 0.18)
for t in (0.3, 0.9, 1.5, 2.1): place(sfx, ting(), t, 0.12); place(sfx, pop(), t, 0.15)
place(sfx, stamp(), WS(0, 'cat'), 0.4); place(sfx, boing(240), WS(0, 'hat'), 0.4)
# cap + salary
place(sfx, swish(), F(75), 0.4); place(sfx, ting(), WS(1, 'cap'), 0.35); place(sfx, swish(), WS(1, 'salary') - 0.25, 0.4); place(sfx, crunch := chew(0.9, 6.0), WS(1, 'food'), 0.4); place(sfx, meow(), WS(1, 'food') + 0.5, 0.35)
# empty station, cricket
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, leaves(1.2), WS(2, 'empty'), 0.3); place(sfx, swish(), WS(2, 'crickets') - 0.25, 0.4)
for k in range(8): place(sfx, tick(), WS(2, 'crickets') + 0.1 + k * 0.12, 0.35)
place(sfx, stamp(), WS(2, 'tickets'), 0.35)
# broke, workers leave, line closing
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, slide(False, 0.7), WS(3, 'broke'), 0.4); place(sfx, footsteps(1.6, 4, 600), WS(3, 'sent'), 0.3)
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, stamp(), WS(4, 'shut'), 0.5); place(sfx, sting(), WS(4, 'down'), 0.25)
# the stray moves in
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, bell(1320), WS(5, 'shopkeeper'), 0.25); place(sfx, footsteps(1.2, 6, 1100), WS(5, 'stray'), 0.2); place(sfx, meow(), WS(5, 'tama'), 0.5)
place(sfx, boing(300), WS(5, 'booth') - 0.2, 0.4)
# made official
place(sfx, swish(), LS(6) - 0.15, 0.5); place(sfx, stamp(), WS(6, 'official'), 0.55); place(sfx, swish(), WS(6, 'master') - 0.3, 0.35); place(sfx, ting(), WS(6, 'master'), 0.4); vox("Welcome aboard!", LE(6) + 0.0 if False else F(636), 'bm_george', 1.25, 0.65, 1.0)
# trains + greeting
place(sfx, swish(), LS(7) - 0.15, 0.5); place(sfx, engine(2.6, 50), LS(7), 0.35); place(sfx, horn(0.6), WS(7, 'greeted'), 0.3); place(sfx, screech(0.7), WS(7, 'still') - 0.5, 0.15)
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, crowd(0.8, 'cheer'), WS(8, 'kids'), 0.2); place(sfx, bloop(220), WS(8, 'bowed'), 0.35); place(sfx, snore(0.8), WS(8, 'yawned'), 0.35); place(sfx, meow(), WS(8, 'yawned') + 0.45, 0.3)
# things got weird: tourists
place(sfx, scratch(), LS(9) - 0.1, 0.4); place(sfx, swish(), LS(9) - 0.15, 0.4)
place(sfx, swish(), LS(10) - 0.15, 0.5); place(sfx, footsteps(3.4, 12, 700), LS(10), 0.3); place(sfx, stamp(), WS(10, 'ten'), 0.4); place(sfx, stamp(), WS(10, 'hundred'), 0.45); place(sfx, swish(), WS(10, 'busloads') - 0.25, 0.4)
place(sfx, horn(0.5), WS(10, 'busloads'), 0.35); place(sfx, crowd(2.0, 'cheer'), WS(10, 'busloads'), 0.3)
for t in np.arange(WS(10, 'hundred'), LS(11), 0.33): place(sfx, ting(), t, 0.1); place(sfx, pop(), t, 0.12)
# packed train
place(sfx, swish(), LS(11) - 0.15, 0.5); place(sfx, engine(2.4, 55), LS(11), 0.35); place(sfx, crowd(1.6, 'cheer'), WS(11, 'packed'), 0.25); place(sfx, meow(), WS(11, 'cat'), 0.45)
# millions
place(sfx, swish(), LS(12) - 0.15, 0.5); countup(WS(12, 'one'), WS(12, 'millions'), 0.5); place(sfx, bell(1760), WS(12, 'millions'), 0.4); place(sfx, bell(2200), WS(12, 'millions') + 0.12, 0.3)
# promotion + gold hat
place(sfx, swish(), LS(13) - 0.15, 0.5); place(sfx, stamp(), WS(13, 'promoted'), 0.5); place(sfx, swish(), WS(13, 'gold') - 0.3, 0.35); place(sfx, ting(), WS(13, 'gold'), 0.45); place(sfx, crowd(1.2, 'cheer'), WS(13, 'hat'), 0.2)
# office
place(sfx, swish(), LS(14) - 0.15, 0.5); place(sfx, flip(), WS(14, 'office'), 0.35); place(sfx, boing(400), WS(14, 'tiny'), 0.4); place(sfx, meow(), WS(14, 'desk') + 0.3, 0.35)
# more famous?
place(sfx, swish(), LS(15) - 0.15, 0.5); place(sfx, bloop(240), WS(15, 'famous'), 0.35); vox("Ooh!", LS(16) - 0.55, 'af_sky', 1.2, 0.6, 1.15)
# rebuild: cat station
place(sfx, swish(), LS(16) - 0.15, 0.5)
for k in range(5): place(sfx, thunk(220, 0.12), WS(16, 'rebuilt') + k * 0.18, 0.35)
place(sfx, pop(), WS(16, 'face'), 0.5); place(sfx, boing(180), WS(16, 'face') + 0.1, 0.4); place(sfx, crowd(1.4, 'cheer'), WS(16, 'face') + 0.2, 0.25)
place(sfx, swish(), LS(17) - 0.15, 0.5); place(sfx, pop(), WS(17, 'ears'), 0.45); place(sfx, swish(), WS(17, 'whiskers') - 0.25, 0.35); place(sfx, boing(320), WS(17, 'whiskers'), 0.35)
# cat train + queue
place(sfx, swish(), LS(18) - 0.15, 0.5); place(sfx, engine(2.4, 50), LS(18), 0.35); place(sfx, horn(0.6), WS(18, 'painted'), 0.3); place(sfx, meow(), WS(18, 'seat'), 0.45)
place(sfx, swish(), LS(19) - 0.15, 0.5); place(sfx, footsteps(1.8, 5, 650), LS(19), 0.25); place(sfx, tick(), WS(19, 'hours'), 0.4); place(sfx, tick(), WS(19, 'hours') + 0.3, 0.4)
# the blink + loop + follow
place(sfx, swish(), LS(20) - 0.15, 0.5); place(sfx, bloop(320), WS(20, 'blinked') + 0.1, 0.4)
place(sfx, swish(), LS(21) - 0.15, 0.5); place(sfx, crowd(2.0, 'cheer'), LS(21), 0.2); place(sfx, ting(), WS(21, 'saved'), 0.3)
place(sfx, meow(), D - 1.6, 0.55); vox("Bye, Tama!", D - 1.05, 'af_bella', 1.2, 0.6, 1.15)
mixdown()
