#!/usr/bin/env bash
# Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
# render_all.sh <story> [procs]  -> stories/<story>/frames/f####.jpg (resumable)
# STEP=2 renders every other frame ("on twos") and fills the gaps with copies (about half the render time).
KIT=$(cd "$(dirname "$0")/.." && pwd); S=$1; P=${2:-2}; D=$KIT/stories/$S/frames; mkdir -p $D; ST=${STEP:-1}
T=$(python3 -c "import json;print(json.load(open('$KIT/stories/$S/timing.json'))['frames'])")
for i in $(seq 0 $((P-1))); do a=$((T*i/P)); a=$(( (a + ST - 1) / ST * ST )); b=$((T*(i+1)/P-1)); RESUME=1 STORY=$S node $KIT/render.mjs $D "$a-$b" $ST 0.95 > $KIT/stories/$S/render$i.log 2>&1 & done; wait
if [ "$ST" != "1" ]; then for f in $(seq 0 $((T-1))); do n=$(printf "%s/f%04d.jpg" $D $f); [ -f $n ] && continue; p=$(( f / ST * ST )); cp $(printf "%s/f%04d.jpg" $D $p) $n 2>/dev/null; done; fi
echo "frames: $(ls $D | wc -l) / $T"
