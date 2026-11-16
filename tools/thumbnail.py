# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
"""Vertical thumbnail / cover image (1080x1920) from a rendered frame + big title text.

usage: python3 tools/thumbnail.py stories/<slug> <frame> "LINE ONE|LINE TWO" [badge] [zoom]
  frame  frame number to use (from stories/<slug>/frames; pick the most spectacular payoff moment)
  text   2-5 words, '|' splits lines; the last line is drawn in yellow
  badge  optional small tag in a red box, e.g. "1970" ("TRUE STORY" only for true videos)
  zoom   optional crop zoom (default 1.08) to fill the frame with the subject
-> stories/<slug>/out/thumbnail.jpg
Rules (VIRAL.md §6): text in the top ~35% (clear of the YouTube/TikTok UI at the bottom and right),
no more than 5 words, must match the video's payoff (no clickbait).
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sd, frame, text = sys.argv[1].rstrip('/'), int(sys.argv[2]), sys.argv[3]
badge = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] else None
zoom = float(sys.argv[5]) if len(sys.argv) > 5 else 1.08
FONT = next((p for p in ['/usr/share/fonts/truetype/google-fonts/Poppins-Black.ttf', '/usr/share/fonts/truetype/google-fonts/Poppins-ExtraBold.ttf',
             '/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'] if os.path.exists(p)), None)
W, H = 1080, 1920
img = Image.open(f'{sd}/frames/f{frame:04d}.jpg').convert('RGB')
cw, ch = int(W / zoom), int(H / zoom); x0, y0 = (W - cw) // 2, int((H - ch) * 0.55)
img = img.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)
# punchier colours + a dark gradient behind the text for legibility
from PIL import ImageEnhance
img = ImageEnhance.Color(img).enhance(1.18); img = ImageEnhance.Contrast(img).enhance(1.06)
grad = Image.new('L', (1, H)); [grad.putpixel((0, y), int(170 * max(0, 1 - y / (H * 0.42)) ** 1.4)) for y in range(H)]
img = Image.composite(Image.new('RGB', (W, H), (8, 6, 14)), img, grad.resize((W, H)))
d = ImageDraw.Draw(img)

lines = [l.strip().upper() for l in text.split('|') if l.strip()]
def fit(line, maxw=W - 110, start=190):
    s = start
    while s > 60:
        f = ImageFont.truetype(FONT, s); w = d.textlength(line, font=f)
        if w <= maxw: return f
        s -= 6
    return ImageFont.truetype(FONT, s)
y = 150
if badge:
    bf = ImageFont.truetype(FONT, 64); bw = d.textlength(badge, font=bf)
    d.rounded_rectangle((W / 2 - bw / 2 - 30, y - 10, W / 2 + bw / 2 + 30, y + 86), 18, fill=(214, 40, 40), outline=(12, 10, 16), width=6)
    d.text((W / 2, y + 38), badge, font=bf, fill='white', anchor='mm'); y += 130
for i, line in enumerate(lines):
    f = fit(line); col = (255, 214, 40) if i == len(lines) - 1 and len(lines) > 1 else (255, 255, 255)
    asc, desc = f.getmetrics(); hgt = asc + desc
    # drop shadow, thick outline, fill
    sh = Image.new('L', (W, H), 0); ImageDraw.Draw(sh).text((W / 2 + 10, y + 14), line, font=f, anchor='ma', fill=200)
    img.paste((0, 0, 0), mask=sh.filter(ImageFilter.GaussianBlur(8)))
    d = ImageDraw.Draw(img)
    d.text((W / 2, y), line, font=f, anchor='ma', fill=col, stroke_width=max(10, f.size // 9), stroke_fill=(12, 10, 16))
    y += int(hgt * 0.92)
os.makedirs(f'{sd}/out', exist_ok=True)
img.save(f'{sd}/out/thumbnail.jpg', quality=93)
print(f'{sd}/out/thumbnail.jpg')
