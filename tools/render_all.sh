#!/usr/bin/env bash
# render_all.sh <story> [procs]  -> stories/<story>/frames/f####.jpg (resumable)
KIT=$(cd "$(dirname "$0")/.." && pwd); S=$1; P=${2:-2}; D=$KIT/stories/$S/frames; mkdir -p $D
T=$(python3 -c "import json;print(json.load(open('$KIT/stories/$S/timing.json'))['frames'])")
for i in $(seq 0 $((P-1))); do a=$((T*i/P)); b=$((T*(i+1)/P-1)); RESUME=1 STORY=$S node $KIT/render.mjs $D "$a-$b" 1 0.95 > $KIT/stories/$S/render$i.log 2>&1 & done; wait
echo "frames: $(ls $D | wc -l) / $T"
