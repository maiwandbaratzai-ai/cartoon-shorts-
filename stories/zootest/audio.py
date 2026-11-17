# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
bed(0, 10.0, 'quirky', 1.0, 118)
for t, s, g in [(0.4, bark(), .7), (0.9, meow(), .6), (1.4, oink(), .7), (1.9, moo(), .6), (2.4, neigh(), .5), (2.8, baa(), .6),
                (3.1, roar(), .4), (3.5, squeak(), .5), (3.8, monkey(), .6), (4.3, trumpet(), .5), (4.7, cluck(), .6), (5.0, quack(), .6), (5.3, tweet(), .5)]:
    place(sfx, s, t, g)
for k in range(9): place(sfx, thunk(170, 0.1), 3.4 + k * 0.38, 0.3)            # farmer's footsteps
vox("Howdy, folks!", 5.6, "am_fenrir", pitch=1.05)
vox("Pie, anyone?", 4.2, "bm_george", pitch=1.1)
vox("Stop right there!", 3.4, "am_michael", pitch=1.0)
place(sfx, swish(), 3.3, 0.6); place(sfx, swish(), 6.6, 0.6)
place(sfx, scratch(), 7.3, 0.5); place(sfx, gasp(), 7.45, 0.7); vox("Whoa!", 7.5, "af_sky", pitch=1.2)
mixdown()
