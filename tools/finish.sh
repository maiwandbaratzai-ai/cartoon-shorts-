#!/usr/bin/env bash
# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
# finish.sh <story> "Title"  -> stories/<story>/out/<Title>.mp4 (+ QA sheet). Needs frames/ + mix_raw.wav + subs.ass
set -e; KIT=$(cd "$(dirname "$0")/.." && pwd); S=$1; D=$KIT/stories/$S; T="${2:-$S}"; mkdir -p $D/out; F="$D/out/${T// /-}.mp4"
ffmpeg -v error -y -i $D/mix_raw.wav -af "loudnorm=I=-14:TP=-1.5:LRA=7" -ar 48000 -ac 2 $D/mix.wav
ffmpeg -v error -y -framerate 30 -i $D/frames/f%04d.jpg -i $D/mix.wav -vf "ass=$D/subs.ass" -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$F"
D_OUT=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F"); echo "duration $D_OUT s"
TGT=$(python3 -c "import json;print(json.load(open('$D/timing.json')).get('target') or 0)")
python3 -c "import sys; d,t=float('$D_OUT'),float('$TGT'); sys.exit(0 if t<60 or d>=t-0.05 else 1)" || echo "WARN: video is shorter than its ${TGT}s target (TikTok Creator Rewards needs > 60 s)"
echo "--- QA (empty = no black/frozen spans)"; ffmpeg -i "$F" -vf "freezedetect=n=0.0005:d=0.6,blackdetect=d=0.1" -an -f null - 2>&1 | grep -oE "freeze_start: [0-9.]+|black_start:[0-9.]+" || true
ffmpeg -i "$F" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
ffmpeg -v error -y -i "$F" -vf "fps=1,scale=180:-1,tile=10x6" -frames:v 1 $D/out/qa_sheet.jpg; echo "$F"
