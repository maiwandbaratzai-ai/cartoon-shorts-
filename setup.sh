#!/usr/bin/env bash
# One-time setup on a fresh machine: python deps, playwright, Kokoro voice model.
set -e; cd "$(dirname "$0")"
pip install --break-system-packages -q kokoro-onnx soundfile numpy pillow 2>&1 | grep -v -i warn || true
[ -d node_modules/playwright ] || npm i --silent playwright@1 >/dev/null 2>&1 || npm i playwright
mkdir -p models
for f in kokoro-v1.0.onnx voices-v1.0.bin; do [ -s models/$f ] || curl -sL -o models/$f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
ls -la models; command -v google-chrome || echo "WARN: set CHROME=/path/to/chrome"; fc-list | grep -qi poppins || echo "WARN: Poppins font missing (captions fall back)"
