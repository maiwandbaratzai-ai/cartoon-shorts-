# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Bold opening graphic for the first ~1.5 s of a video (YouTube feedback 2026-11-16: "bolder opening graphic").

usage: python3 tools/hookcard.py stories/<slug> "LINE ONE|LINE TWO" [badge]
  2-5 big words that state the absurd claim (NOT a date), '|' splits lines, last line yellow.
  badge: optional small red tag (a number, place or "TRUE STORY").
-> stories/<slug>/hook.png (transparent 1080x1920). finish.sh overlays it automatically on 0-1.6 s
   with a pop-in and fade-out. Keep it in the top ~40% so it doesn't cover the captions.
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sd, text = sys.argv[1].rstrip('/'), sys.argv[2]
badge = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else None
FONT = next((p for p in ['/usr/share/fonts/truetype/google-fonts/Poppins-Black.ttf', '/usr/share/fonts/truetype/google-fonts/Poppins-ExtraBold.ttf',
             '/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'] if os.path.exists(p)), None)
W, H = 1080, 1920
img = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
lines = [l.strip().upper() for l in text.split('|') if l.strip()]
def fit(line, maxw=W - 120, start=170):
    s = start
    while s > 60:
        f = ImageFont.truetype(FONT, s)
        if d.textlength(line, font=f) <= maxw: return f
        s -= 6
    return ImageFont.truetype(FONT, s)
y = 230
if badge:
    bf = ImageFont.truetype(FONT, 60); bw = d.textlength(badge, font=bf)
    d.rounded_rectangle((W / 2 - bw / 2 - 28, y - 10, W / 2 + bw / 2 + 28, y + 80), 18, fill=(214, 40, 40, 255), outline=(12, 10, 16, 255), width=6)
    d.text((W / 2, y + 35), badge, font=bf, fill='white', anchor='mm'); y += 120
for i, line in enumerate(lines):
    f = fit(line); col = (255, 214, 40, 255) if i == len(lines) - 1 and len(lines) > 1 else (255, 255, 255, 255)
    asc, desc = f.getmetrics()
    sh = Image.new('L', (W, H), 0); ImageDraw.Draw(sh).text((W / 2 + 9, y + 12), line, font=f, anchor='ma', fill=170)
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); shadow.putalpha(sh.filter(ImageFilter.GaussianBlur(8)))
    img = Image.alpha_composite(img, shadow); d = ImageDraw.Draw(img)
    d.text((W / 2, y), line, font=f, anchor='ma', fill=col, stroke_width=max(10, f.size // 9), stroke_fill=(12, 10, 16, 255))
    y += int((asc + desc) * 0.92)
img.save(f'{sd}/hook.png'); print(f'{sd}/hook.png')
