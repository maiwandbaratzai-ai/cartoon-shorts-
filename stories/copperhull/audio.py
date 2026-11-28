# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
import sys, os; KIT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, KIT + '/tools')
from audiolib import *
TM = init(os.path.dirname(os.path.abspath(__file__)))
D = TM['frames'] / 30
FR = lambda fr: fr / 30
bed(0, LS(3), 'dark', 0.8, 108)
bed(LS(3), LS(5), 'quirky', 0.9, 118)
bed(LS(5), LS(6), 'march', 0.95, 128)
bed(LS(6), LS(8) - 0.18, 'tension', 1.3, 156)
bed(LS(8), LS(9), 'dark', 0.6, 96)
bed(LS(9), LS(11), 'quirky', 0.85, 112)
bed(LS(11), D, 'march', 1.0, 132)
for fr in [42, 86, 140, 204, 262, 327, 380, 438, 500, 620, 684, 759, 815, 866, 990, 1058, 1104, 1196, 1296]: place(sfx, swish(), FR(fr) - 0.1, 0.3)
for fr in [556, 916, 1144, 1231]: place(sfx, whoosh(0.6), FR(fr), 0.5)
place(sfx, water(D), 0, 0.08)
# L0 bucket of worms
gag(squeak(), WS(0, 'robbed'), 0.3); gag(gloop(0.6), WS(0, 'bucket'), 0.45); gag(bloop(320), WS(0, 'worms'), 0.4); place(sfx, meow(), 1.1, 0.35)
# L1 gold coins, sleepy guards
gag(clink(4), WS(1, 'coins'), 0.5); gag(snore(1.2), WS(1, 'guards'), 0.45)
# L2 catchphrase whisper, rowing
gag(pop(), WS(2, 'peasy'), 0.3)
for k in range(4): place(sfx, splash(0.3), WS(2, 'rowing') + k * 0.5, 0.2)
gag(ting(), WS(2, 'copper'), 0.35)
# L3 pried off with spoons
for k in range(8): place(sfx, clink(1), WS(3, 'pried') + k * 0.22, 0.3)
countup(WS(3, 'two'), WS(3, 'them') + 0.3, 0.25); gag(bonk(520), WS(3, 'spoons'), 0.45)
# L4 worms dumped, cat wants a coin
gag(gloop(0.8), WS(4, 'dumped'), 0.45); gag(splat(), WS(4, 'wood'), 0.35); gag(meow(), WS(4, 'sardine'), 0.5); gag(ting(), WS(4, 'coin'), 0.35)
# L5 a week later, sags, sinks like a cookie
gag(creak(1.0, 110), WS(5, 'sagged'), 0.5); gag(slide(False, 1.2), WS(5, 'sank'), 0.4); place(sfx, gloop(1.5), WS(5, 'cookie'), 0.35); place(sfx, sub(0.8, 40), WS(5, 'sank'), 0.4)
# L6 coins pour onto the rowboat
for k in range(12): place(sfx, clink(1), WS(6, 'poured') + k * 0.12, 0.28)
gag(crash(0.6), WS(6, 'rowboat'), 0.35)
# L7 rowboat crumbles like a cracker
gag(pop(), WS(7, 'said'), 0.3); gag(snap(), WS(7, 'crumbled'), 0.55); place(sfx, crash(0.9), WS(7, 'crumbled') + 0.1, 0.4); gag(splash(1.0), WS(7, 'cracker'), 0.5); place(sfx, meow(), WS(7, 'cracker') + 0.5, 0.35)
# L8 question + riser
place(sfx, scratch(), LS(8) - 0.12, 0.3); gag(boing(200, 0.4), WS(8, 'underwear'), 0.4); place(sfx, riser(1.2), LS(9) - 1.25, 0.4)
# L9 shipworms drill, sponge
place(sfx, drop(), WS(9, 'shipworms'), 0.5); gag(scrape(1.0), WS(9, 'drill'), 0.4)
for k in range(3): place(sfx, chew(0.4, 8), WS(9, 'tunnel') + k * 0.4, 0.3)
gag(gloop(0.5), WS(9, 'sponge'), 0.45)
# L10 copper is poison
gag(thunk(140, 0.3), WS(10, 'copper'), 0.45); gag(ting(), WS(10, 'poison'), 0.45)
for k in range(4): place(sfx, boing(260 + k * 40, 0.3), WS(10, 'poison') + 0.3 + k * 0.15, 0.3)
gag(stamp(), WS(10, 'wrapped'), 0.4)
# L11 gold sank, rich crab
gag(bloop(180), WS(11, 'sank'), 0.4); gag(clink(3), WS(11, 'crab'), 0.4); gag(bell(1046), WS(11, 'rich'), 0.4)
# L12 copper bathtub, cat keeps a coin
gag(splash(0.4), WS(12, 'paddled'), 0.35); gag(ting(), WS(12, 'bathtub'), 0.45); gag(meow(), WS(12, 'sardine'), 0.45); gag(clink(1), WS(12, 'coin'), 0.45)
button(LS(12) + 2.9, 'march', 0.9)
mixdown()
