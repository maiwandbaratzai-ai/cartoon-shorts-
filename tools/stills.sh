#!/usr/bin/env bash
# stills.sh <story> "<frames comma list>"  -> stories/<story>/stills/sheet.jpg (contact sheet, 5 per row)
set -e; KIT=$(cd "$(dirname "$0")/.." && pwd); S=$1; D=$KIT/stories/$S/stills; rm -rf $D; mkdir -p $D
STORY=$S node $KIT/render.mjs $D "$2" 1 0.9 2>&1 | grep -v "^PAGE" | tail -3
n=$(ls $D/*.jpg | wc -l); cols=$(( n < 5 ? n : 5 )); rows=$(( (n + 4) / 5 ))
ffmpeg -v error -y -pattern_type glob -i "$D/f*.jpg" -vf "scale=324:-1,tile=${cols}x${rows}:padding=4" -frames:v 1 $D/sheet.jpg
echo $D/sheet.jpg
