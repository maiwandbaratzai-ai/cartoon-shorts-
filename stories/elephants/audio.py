# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
F = lambda fr: fr / 30
bed(0, LS(4) - 0.05, 'march', 1.0, 116)            # circus parade onto the bridge
bed(LS(4), LS(8) - 0.2, 'tension', 0.95, 116)       # humming cables, Jumbo stops
bed(LS(8), D, 'march', 1.05, 124)                   # passed! free ads, loop
# hook: the parade (flash-forward stomp), trumpet, crowd
place(sfx, trumpet(), 0.15, 0.7); place(sfx, crowd(2.0, 'cheer'), 0.2, 0.15)
for t in (0.6, 2.05, 3.5): place(sfx, thunk(55, 0.4), t, 0.55)
place(sfx, stamp(), WS(0, '21'), 0.4); place(sfx, swish(), WS(0, 'bridge') - 0.25, 0.3)
for t in np.arange(WS(0, 'bridge'), LS(1) - 0.1, 0.65): place(sfx, thunk(60, 0.3), t, 0.4)
# Jumbo close-up, six tons
place(sfx, swish(), LS(1) - 0.15, 0.5); place(sfx, trumpet(), WS(1, 'jumbo') - 0.1, 0.55); place(sfx, stamp(), WS(1, 'six'), 0.6); place(sfx, boing(120), WS(1, 'tons') + 0.1, 0.4)
# fear at the entrance
place(sfx, swish(), WS(1, 'everyone') - 0.3, 0.5); place(sfx, creak(0.7, 120), WS(1, 'feared'), 0.5); place(sfx, gasp(), WS(1, 'collapse'), 0.6); place(sfx, sting(), WS(1, 'collapse') + 0.1, 0.25)
# why elephants: wobbly plank gag
place(sfx, swish(), LS(2) - 0.15, 0.5); place(sfx, scratch(), WS(2, 'why') - 0.05, 0.35); place(sfx, boing(260, 0.8), WS(2, 'wobbly'), 0.55); place(sfx, creak(0.5, 200), WS(2, 'never'), 0.35); place(sfx, bonk(380), WS(2, 'wobbly') + 0.45, 0.35)
# lined up and marching
place(sfx, swish(), LS(3) - 0.15, 0.5); place(sfx, trumpet(), WS(3, 'lined'), 0.45); place(sfx, flip(), WS(3, 'trunk'), 0.3)
for t in np.arange(LS(3), LS(6) - 0.3, 0.6): place(sfx, thunk(62, 0.3), t, 0.38)
place(sfx, ting(), WS(3, 'showman'), 0.3)
# cables hum
place(sfx, swish(), LS(4) - 0.15, 0.5); place(sfx, hum(2.6), WS(4, 'cables') - 0.2, 0.55); place(sfx, slide(True, 0.8), WS(4, 'hum'), 0.35); place(sfx, creak(0.6, 90), WS(4, 'halfway'), 0.35)
# riverbank crowd
place(sfx, swish(), LS(5) - 0.15, 0.5); place(sfx, crowd(1.6, 'gasp'), WS(5, 'thousands'), 0.3); place(sfx, gasp(), WS(5, 'froze'), 0.5); place(sfx, sting(), WS(5, 'hold') + 0.1, 0.3)
# the stop, the foot, the stomp
place(sfx, scratch(), LS(6) - 0.75, 0.35)
place(sfx, swish(), LS(6) - 0.15, 0.4); place(sfx, thunk(70, 0.3), WS(6, 'stopped'), 0.5); place(sfx, bloop(180), WS(6, 'looked'), 0.4); place(sfx, slide(True, 0.7), WS(6, 'lifted'), 0.45)
place(sfx, thunk(45, 0.7), WS(7, 'stomped'), 1.0); place(sfx, rumble(0.9), WS(7, 'stomped'), 0.5); place(sfx, crash(0.6), WS(7, 'stomped') + 0.02, 0.15); place(sfx, ting(), WS(7, 'nothing') + 0.25, 0.4)
# passed + free ads
place(sfx, swish(), LS(8) - 0.15, 0.5); place(sfx, stamp(), WS(8, 'passed'), 0.6); place(sfx, crowd(2.2, 'cheer'), WS(8, 'passed'), 0.35); place(sfx, bell(1320), WS(8, 'passed') + 0.15, 0.3)
place(sfx, swish(), F(763) - 0.15, 0.45); place(sfx, flip(), WS(8, 'free'), 0.5); place(sfx, bell(1760), WS(8, 'ads'), 0.3)
# end: back to the hook image, loops
place(sfx, swish(), LS(9) - 0.15, 0.5); place(sfx, trumpet(), WS(9, 'elephants'), 0.65); place(sfx, thunk(55, 0.4), WS(9, 'elephants') + 0.2, 0.5)
place(sfx, crowd(1.0, 'cheer'), D - 1.0, 0.2)
mixdown()
