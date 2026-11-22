#!/usr/bin/env bash
# queue.sh slug1 slug2 ... : renders stories one after another on twos (STEP=2, 1 process: SwiftShader already uses every core)
KIT=$(cd "$(dirname "$0")/.." && pwd)
for S in "$@"; do while pgrep -f "render_all.sh" > /dev/null; do sleep 20; done; STEP=2 bash $KIT/tools/render_all.sh $S 1 > $KIT/stories/$S/render_all.log 2>&1; done
