// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Detailed set dressing (reference study 2026-11-21 #2, "Why This Town Removed Every Traffic Light"):
// top channels look rich because EVERY frame is full of small, well-made objects: buildings with framed windows,
// sills, shutters, awnings, gables and chimneys; streets with curbs, markings, bike lanes, poles, signs, lights,
// bollards, bins, benches, bikes, trees, parked cars and background people; readable signs with words on them.
// Each builder returns a THREE.Group. Static things are BAKED (merged per material) so dense scenes still render fast.
import * as THREE from './lib/three.module.js';
import { canvasTex } from './props.js';

const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const pick = (a, n) => a[Math.floor(hash(n) * a.length) % a.length];
const FONT = '"Poppins", "DejaVu Sans", sans-serif';

export function initSet(K) {
  const SET = {};
  const M = {}; // shared materials (one per colour/kind) so baking can merge across props
  const mat = (key, make) => M[key] || (M[key] = make());
  const brick = (c) => mat('brick' + c, () => K.mat('brick', c, { detail: 1.8 }));
  const plaster = (c) => mat('pl' + c, () => K.mat('plaster', c));
  const paint = (c, o = {}) => mat('pt' + c + JSON.stringify(o), () => K.paint(c, o));
  const flat = (c, r = 0.7) => mat('fl' + c + r, () => new THREE.MeshStandardMaterial({ color: c, roughness: r }));
  const glow = (c, k = 2.2) => mat('gl' + c + k, () => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) }));
  const winGlass = () => mat('wglass', () => K.paint('#2c3e52', { rough: 0.08, metal: 0.4, coat: 1, env: 1.6 }));
  const box = (w, h, d, m, x, y, z, p) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const cyl = (r1, r2, h, m, x, y, z, p, seg = 16) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const sph = (r, m, x, y, z, p, ws = 16, hs = 12) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const texMat = (key, w, h, draw) => mat('tx' + key, () => new THREE.MeshStandardMaterial({ map: canvasTex(w, h, draw), roughness: 0.6 }));

  /** Merge every mesh under `g` into one mesh per material (huge speed-up for static scenery). Returns g. */
  SET.bake = (g) => {
    g.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(g.matrixWorld).invert(), groups = new Map(), drop = [];
    g.traverse((o) => { if (!o.isMesh || o.isInstancedMesh || o.userData.noBake || o.material.transparent) return;
      const geo = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()); geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
      if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
      for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k);
      (groups.get(o.material) || groups.set(o.material, []).get(o.material)).push(geo); drop.push(o); });
    for (const o of drop) o.parent.remove(o);
    for (const [m, list] of groups) { let n = 0; for (const q of list) n += q.attributes.position.count;
      const out = new THREE.BufferGeometry(); for (const a of ['position', 'normal', 'uv']) { const sz = a === 'uv' ? 2 : 3, arr = new Float32Array(n * sz); let o = 0;
        for (const q of list) { arr.set(q.attributes[a].array, o); o += q.attributes[a].array.length; } out.setAttribute(a, new THREE.BufferAttribute(arr, sz)); }
      const mesh = new THREE.Mesh(out, m); mesh.castShadow = mesh.receiveShadow = true; g.add(mesh); }
    return g;
  };

  // ---------- textures ----------
  const herringbone = (c1, c2) => canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#5a3a2e'; g.fillRect(0, 0, w, h); let n = 0;
    for (let y = -64; y < h + 64; y += 32) for (let x = -64; x < w + 64; x += 32) { n++; const sh = (hash(n) - 0.5) * 0.18; g.fillStyle = hash(n + 3) > 0.5 ? c1 : c2; g.globalAlpha = 0.85 + sh;
      g.save(); g.translate(x, y); g.rotate(((x + y) / 32) % 2 ? Math.PI / 4 : -Math.PI / 4); g.fillRect(-14, -6, 28, 12); g.restore(); } g.globalAlpha = 1; }, [8, 8]);
  const asphalt = () => canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#4a4a50'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${hash(i) > 0.5 ? 255 : 0},${hash(i) > 0.5 ? 255 : 0},${hash(i) > 0.5 ? 255 : 0},${0.05 + hash(i + 1) * 0.08})`; g.fillRect(hash(i + 2) * w, hash(i + 3) * h, 2, 2); } }, [6, 6]);
  const tiles = (c) => canvasTex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 22) for (let x = ((y / 22) % 2) * 16; x < w + 32; x += 32) { g.fillStyle = `rgba(0,0,0,${0.12 + hash(x * 7 + y) * 0.15})`; g.beginPath(); g.arc(x, y + 22, 16, Math.PI, 0); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.stroke(); } }, [4, 4]);
  const stripes = (a, b, n = 8) => canvasTex(256, 128, (g, w, h) => { for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(i * w / n, 0, w / n, h); } });

  /** Text board texture (shop signs, protest signs, billboards). Bold, outlined, readable at phone size. */
  SET.textMat = (text, o = {}) => texMat('t' + text + JSON.stringify(o), o.w || 512, o.h || 256, (g, w, h) => {
    g.fillStyle = o.bg || '#f4ead2'; g.fillRect(0, 0, w, h); if (o.border !== false) { g.strokeStyle = o.borderColor || 'rgba(0,0,0,.25)'; g.lineWidth = 14; g.strokeRect(0, 0, w, h); }
    const lines = String(text).split('|'); let fs = Math.min(h / lines.length * 0.72, 200); g.font = `900 ${fs}px ${FONT}`;
    while (Math.max(...lines.map((l) => g.measureText(l).width)) > w * 0.88 && fs > 20) { fs -= 4; g.font = `900 ${fs}px ${FONT}`; }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach((l, i) => { const y = h / 2 + (i - (lines.length - 1) / 2) * fs * 1.05; if (o.outline) { g.lineWidth = fs * 0.12; g.strokeStyle = o.outline; g.strokeText(l, w / 2, y); } g.fillStyle = o.fg || '#c0392b'; g.fillText(l, w / 2, y); });
  });

  // ---------- buildings ----------
  /** SET.building({ w, d, floors, color, kind: 'brick'|'plaster', gable: 'step'|'bell'|'pitched'|'flat', roof, trim, shop: 'BAKERY', awning: ['#c0392b','#fff'], shutters, flowers, seed })
   *  Front faces +z, origin at the bottom centre of the front wall. Every window is a real recessed frame with mullions and a sill. Baked. */
  SET.building = (o = {}, parent = K.scene) => {
    const g = new THREE.Group(); parent.add(g); const s = o.seed ?? 1, W = o.w ?? 6, D = o.d ?? 8, FH = o.floorH ?? 3, F = o.floors ?? 3, H = F * FH;
    const wallM = o.kind === 'plaster' ? plaster(o.color || '#e8d8b8') : brick(o.color || pick(['#c0684a', '#b8603e', '#c87a58', '#a85a44', '#d0906a'], s));
    const trimM = paint(o.trim || '#f4efe4', { rough: 0.5, coat: 0.3 }), darkM = paint(o.frameDark || '#2a3440', { rough: 0.4 });
    box(W, H, D, wallM, 0, H / 2, -D / 2, g);
    box(W + 0.12, 0.35, 0.18, trimM, 0, 0.18, 0.05, g);                              // plinth
    for (let f = 1; f < F; f++) box(W + 0.06, 0.12, 0.14, trimM, 0, f * FH, 0.05, g); // floor bands
    box(W + 0.3, 0.3, 0.35, trimM, 0, H + 0.12, 0.08, g);                             // cornice
    const cols = Math.max(2, Math.round(W / 1.6)), cw = W / cols;
    for (let f = o.shop ? 1 : 0; f < F; f++) for (let c = 0; c < cols; c++) {
      const x = -W / 2 + cw * (c + 0.5), y = f * FH + FH * 0.52, ww = cw * 0.52, wh = FH * 0.55;
      box(ww, wh, 0.06, winGlass(), x, y, -0.06, g);                                  // glass (recessed)
      for (const sx of [-1, 1]) box(0.07, wh + 0.1, 0.12, trimM, x + sx * ww / 2, y, 0, g);
      box(ww + 0.1, 0.07, 0.12, trimM, x, y + wh / 2, 0, g); box(0.05, wh, 0.08, trimM, x, y, 0, g); box(ww, 0.05, 0.08, trimM, x, y + wh * 0.12, 0, g);
      box(ww + 0.26, 0.07, 0.22, trimM, x, y - wh / 2 - 0.04, 0.06, g);                // sill
      box(ww + 0.2, 0.1, 0.14, trimM, x, y + wh / 2 + 0.12, 0.03, g);                 // lintel
      if (o.shutters && hash(s * 31 + f * 7 + c) > 0.3) for (const sx of [-1, 1]) { const sh = box(ww * 0.48, wh, 0.05, paint(o.shutters, { rough: 0.5 }), x + sx * (ww * 0.75 + 0.04), y, 0.04, g);
        for (let k = 0; k < 5; k++) box(ww * 0.42, 0.025, 0.02, darkM, x + sx * (ww * 0.75 + 0.04), y - wh * 0.38 + k * wh * 0.19, 0.075, g); }
      if (o.flowers && f > 0 && hash(s * 13 + f * 3 + c) > 0.5) { box(ww, 0.18, 0.2, paint('#6a4028', { rough: 0.6 }), x, y - wh / 2 + 0.06, 0.2, g);
        for (let k = 0; k < 5; k++) sph(0.07, flat(pick(['#e0482a', '#f2c12e', '#f08aa8', '#ffffff'], s + f + c + k)), x - ww / 2 + 0.1 + k * (ww - 0.2) / 4, y - wh / 2 + 0.2, 0.22, g, 8, 6); }
    }
    if (o.shop) {                                                                     // shop floor: big windows, door, sign, awning
      box(W * 0.9, FH * 0.62, 0.05, winGlass(), 0, FH * 0.45, -0.05, g);
      for (let k = 0; k <= 4; k++) box(0.08, FH * 0.66, 0.12, darkM, -W * 0.45 + k * W * 0.225, FH * 0.45, 0, g);
      box(W * 0.92, 0.08, 0.12, darkM, 0, FH * 0.78, 0, g);
      const sign = box(W * 0.8, 0.55, 0.1, SET.textMat(o.shop, { bg: o.signBg || '#c0392b', fg: o.signFg || '#ffffff', w: 1024, h: 200, border: false }), 0, FH * 0.92, 0.12, g);
      const aw = o.awning || [pick(['#c0392b', '#2a7a4a', '#2a62c8', '#e0a020'], s), '#f4efe4'];
      const am = mat('aw' + aw, () => new THREE.MeshStandardMaterial({ map: stripes(aw[0], aw[1]), roughness: 0.8, side: THREE.DoubleSide }));
      const a = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, 1.1), am); a.position.set(0, FH * 0.78, 0.5); a.rotation.x = -1.05; a.castShadow = true; g.add(a);
      box(W * 0.9, 0.16, 0.03, am, 0, FH * 0.78 - 0.5, 0.98, g);
    } else {                                                                          // front door with steps
      const dx = (hash(s + 5) - 0.5) * W * 0.4;
      box(1.0, 2.1, 0.08, paint(pick(['#2a5a3a', '#7a2a2a', '#1f2f4a', '#5a3a24'], s + 9), { rough: 0.4 }), dx, 1.2, -0.04, g);
      for (const sx of [-1, 1]) box(0.1, 2.3, 0.14, trimM, dx + sx * 0.55, 1.25, 0, g); box(1.3, 0.14, 0.16, trimM, dx, 2.4, 0.02, g);
      sph(0.04, K.gold(), dx + 0.35, 1.15, 0.03, g, 8, 6); box(1.4, 0.15, 0.5, trimM, dx, 0.08, 0.25, g);
    }
    const gable = o.gable ?? pick(['step', 'bell', 'pitched', 'flat'], s + 2), rc = o.roof || pick(['#6a3a2e', '#3a4a5a', '#7a4a3a'], s + 4);
    const roofM = mat('roof' + rc, () => new THREE.MeshStandardMaterial({ map: tiles(rc), roughness: 0.75 }));
    if (gable === 'step') { for (let k = 0; k < 4; k++) { const ww = W * (1 - k * 0.22); box(ww, 0.9, 0.4, wallM, 0, H + 0.45 + k * 0.9, -0.2, g); box(ww + 0.12, 0.12, 0.5, trimM, 0, H + 0.9 + k * 0.9, -0.15, g); } }
    else if (gable === 'bell') { const sh = new THREE.Shape(); sh.moveTo(-W / 2, 0); sh.quadraticCurveTo(-W / 2, W * 0.4, -W * 0.18, W * 0.5); sh.lineTo(-W * 0.18, W * 0.75); sh.quadraticCurveTo(0, W * 0.85, W * 0.18, W * 0.75); sh.lineTo(W * 0.18, W * 0.5); sh.quadraticCurveTo(W / 2, W * 0.4, W / 2, 0);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.4, bevelEnabled: false }), wallM); m.position.set(0, H, -0.4); m.castShadow = true; g.add(m); box(0.7, 0.9, 0.1, winGlass(), 0, H + W * 0.38, 0.02, g); }
    if (gable !== 'flat') { const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.01, W * 0.62, D, 4, 1), roofM); ridge.rotation.set(Math.PI / 2, Math.PI / 4, 0); ridge.scale.set(1, 1, 0.55); ridge.position.set(0, H + W * 0.3, -D / 2 - 0.2); ridge.castShadow = true; g.add(ridge); }
    box(0.6, 1.4, 0.6, brick('#7a3a2e'), W * 0.25, H + W * 0.35 + 0.5, -D * 0.6, g); box(0.75, 0.12, 0.75, trimM, W * 0.25, H + W * 0.35 + 1.25, -D * 0.6, g);
    return SET.bake(g);
  };

  // ---------- street ----------
  /** SET.street({ len, width, sidewalk, x0 }): asphalt road along x with curbs, dashed centre line, a red bike lane each side,
   *  zebra crossings at `crossings` x positions, and herringbone brick sidewalks. Baked. */
  SET.street = (o = {}, parent = K.scene) => {
    const g = new THREE.Group(); parent.add(g); const L = o.len ?? 60, Wd = o.width ?? 7, SW = o.sidewalk ?? 4, x0 = o.x0 ?? 0;
    const road = new THREE.Mesh(new THREE.PlaneGeometry(L, Wd), mat('asph', () => new THREE.MeshStandardMaterial({ map: asphalt(), roughness: 0.85 }))); road.rotation.x = -Math.PI / 2; road.position.set(x0, 0.01, 0); road.receiveShadow = true; g.add(road);
    const walkM = mat('herr', () => new THREE.MeshStandardMaterial({ map: herringbone('#b85a3e', '#a04a34'), roughness: 0.8 }));
    for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(L, 0.15, SW), walkM); w.position.set(x0, 0.075, s * (Wd / 2 + SW / 2)); w.receiveShadow = true; g.add(w);
      box(L, 0.17, 0.22, flat('#c8c4bc', 0.6), x0, 0.085, s * (Wd / 2 + 0.11), g);                                         // curb
      box(L, 0.012, 1.3, flat('#b0463a', 0.8), x0, 0.016, s * (Wd / 2 - 0.85), g);                                         // red bike lane
      box(L, 0.014, 0.08, flat('#f4f4f0', 0.5), x0, 0.018, s * (Wd / 2 - 1.55), g); }
    for (let x = x0 - L / 2 + 1; x < x0 + L / 2; x += 3) box(1.6, 0.014, 0.12, flat('#f4f4f0', 0.5), x, 0.018, 0, g);       // dashes
    for (const cx of o.crossings || []) for (let z = -Wd / 2 + 0.4; z < Wd / 2 - 0.3; z += 0.75) box(2.6, 0.016, 0.45, flat('#f6f6f2', 0.45), cx, 0.02, z + 0.2, g);
    return SET.bake(g);
  };

  // ---------- street furniture ----------
  const pole = (h, g, m = paint('#3a4048', { rough: 0.45 })) => { cyl(0.06, 0.07, h, m, 0, h / 2, 0, g, 12); cyl(0.12, 0.14, 0.12, m, 0, 0.06, 0, g, 12); };
  /** SET.trafficLight(): pole + housing with visors; returns { g, set(state: 'red'|'amber'|'green'|'off') } (lamps light up). */
  SET.trafficLight = (parent = K.scene) => {
    const g = new THREE.Group(); parent.add(g); pole(3.2, g); const hm = paint('#1d2228', { rough: 0.35 });
    K.rbox(0.38, 1.05, 0.3, 0.06, hm, 0, 3.35, 0.05, g); K.rbox(0.5, 1.2, 0.04, 0.02, paint('#f4f4f0', { rough: 0.5 }), 0, 3.35, -0.12, g);
    const lamps = {}, cols = { red: '#ff3a2a', amber: '#ffb020', green: '#2ee07a' }; let i = 0;
    for (const k of ['red', 'amber', 'green']) { const y = 3.68 - i++ * 0.32; const off = flat(new THREE.Color(cols[k]).multiplyScalar(0.18).getStyle(), 0.3), on = glow(cols[k], 3);
      const l = sph(0.11, off, 0, y, 0.2, g, 14, 10); l.scale.z = 0.5; l.userData = { off, on }; lamps[k] = l;
      const v = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.16, 16, 1, true, -Math.PI / 2, Math.PI), hm); v.rotation.x = Math.PI / 2; v.position.set(0, y + 0.02, 0.28); v.material.side = THREE.DoubleSide; g.add(v); }
    return { g, set(st) { for (const k in lamps) { const l = lamps[k]; l.material = k === st ? l.userData.on : l.userData.off; l.userData.ndSkip = k === st; } } };
  };
  /** SET.sign(kind): 'yield' | 'warn' | 'stop' | 'arrow' | 'noentry' | 'bike' | 'parking' on a pole. Baked. */
  SET.sign = (kind = 'warn', parent = K.scene, h = 2.6) => {
    const g = new THREE.Group(); parent.add(g); pole(h, g);
    const face = texMat('sign' + kind, 256, 256, (c, w) => { c.clearRect(0, 0, w, w); c.lineJoin = 'round';
      const tri = (down) => { c.beginPath(); if (down) { c.moveTo(20, 30); c.lineTo(236, 30); c.lineTo(128, 236); } else { c.moveTo(128, 20); c.lineTo(236, 220); c.lineTo(20, 220); } c.closePath(); };
      if (kind === 'yield' || kind === 'warn') { c.fillStyle = '#fff'; tri(kind === 'yield'); c.fill(); c.lineWidth = 26; c.strokeStyle = '#d0201a'; c.stroke(); if (kind === 'warn') { c.fillStyle = '#111'; c.fillRect(118, 90, 20, 70); c.fillRect(118, 172, 20, 20); } }
      else { const bg = { stop: '#d0201a', arrow: '#1f5fc8', noentry: '#d0201a', bike: '#1f5fc8', parking: '#1f5fc8' }[kind]; c.fillStyle = bg; c.beginPath(); if (kind === 'stop') { for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; c.lineTo(128 + 120 * Math.cos(a), 128 + 120 * Math.sin(a)); } } else if (kind === 'parking') c.rect(14, 14, 228, 228); else c.arc(128, 128, 118, 0, 7); c.fill();
        c.fillStyle = '#fff'; c.strokeStyle = '#fff'; c.lineWidth = 20; c.lineCap = 'round';
        if (kind === 'stop') { c.font = `900 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('STOP', 128, 132); }
        if (kind === 'noentry') c.fillRect(48, 108, 160, 40);
        if (kind === 'arrow') { c.beginPath(); c.moveTo(60, 128); c.lineTo(190, 128); c.moveTo(150, 88); c.lineTo(194, 128); c.lineTo(150, 168); c.stroke(); }
        if (kind === 'parking') { c.font = `900 170px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('P', 128, 140); }
        if (kind === 'bike') { c.lineWidth = 10; for (const x of [80, 176]) { c.beginPath(); c.arc(x, 150, 34, 0, 7); c.stroke(); } c.beginPath(); c.moveTo(80, 150); c.lineTo(118, 100); c.lineTo(176, 150); c.moveTo(118, 100); c.lineTo(160, 100); c.stroke(); } } });
    face.transparent = true; face.alphaTest = 0.5; face.side = THREE.DoubleSide;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), face); p.position.set(0, h + 0.2, 0.08); p.castShadow = true; p.userData.noBake = true; g.add(p);
    box(0.7, 0.7, 0.03, flat('#b8bcc4', 0.5), 0, h + 0.2, 0.05, g).scale.set(kind === 'yield' || kind === 'warn' ? 0.001 : 0.9, 0.9, 1);
    return SET.bake(g);
  };
  /** SET.streetLamp(): curved-arm street lamp with a glowing bulb. */
  SET.streetLamp = (parent = K.scene, on = false) => { const g = new THREE.Group(); parent.add(g); pole(4.2, g, paint('#2a3a34', { rough: 0.4 }));
    const arm = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 8, 20, Math.PI / 2), paint('#2a3a34', { rough: 0.4 })); arm.position.set(0.45, 4.2, 0); g.add(arm);
    K.rbox(0.5, 0.18, 0.32, 0.06, paint('#2a3a34', { rough: 0.4 }), 0.9, 4.55, 0, g); const b = box(0.38, 0.05, 0.24, on ? glow('#ffe8a8', 2.5) : flat('#fff4d0', 0.2), 0.9, 4.44, 0, g); b.userData.noBake = true; return g; };
  SET.bollard = (parent = K.scene) => { const g = new THREE.Group(); parent.add(g); cyl(0.09, 0.1, 0.85, paint('#2a2e34', { rough: 0.4 }), 0, 0.42, 0, g, 14); cyl(0.095, 0.095, 0.08, flat('#f4f4f0', 0.5), 0, 0.7, 0, g, 14); sph(0.09, paint('#2a2e34', { rough: 0.4 }), 0, 0.86, 0, g, 12, 8); return g; };
  SET.bench = (parent = K.scene) => { const g = new THREE.Group(); parent.add(g); const wd = mat('benchwood', () => K.mat('wood', '#a8703a')), ir = paint('#2a3a34', { rough: 0.4 });
    for (let k = 0; k < 3; k++) box(1.8, 0.05, 0.12, wd, 0, 0.45, -0.15 + k * 0.15, g); for (let k = 0; k < 2; k++) box(1.8, 0.12, 0.04, wd, 0, 0.65 + k * 0.17, -0.26, g);
    for (const x of [-0.75, 0.75]) { box(0.06, 0.45, 0.5, ir, x, 0.22, -0.05, g); box(0.06, 0.5, 0.06, ir, x, 0.7, -0.27, g); } return SET.bake(g); };
  SET.bin = (parent = K.scene) => { const g = new THREE.Group(); parent.add(g); cyl(0.26, 0.22, 0.85, paint('#2a6a3a', { rough: 0.45 }), 0, 0.43, 0, g, 20); cyl(0.28, 0.28, 0.06, paint('#1d3a24', { rough: 0.4 }), 0, 0.86, 0, g, 20); return SET.bake(g); };
  /** SET.planter(): wooden planter box with a small shrub and flowers. */
  SET.planter = (parent = K.scene, s = 1) => { const g = new THREE.Group(); parent.add(g); K.rbox(1.2, 0.5, 0.6, 0.04, mat('plw', () => K.mat('wood', '#8a5a34')), 0, 0.25, 0, g);
    for (let k = 0; k < 6; k++) sph(0.22, flat(pick(['#3f8a3a', '#4f9a3a', '#2f7a3a'], s + k)), -0.4 + k * 0.16, 0.6 + hash(k + s) * 0.1, (hash(k * 3 + s) - 0.5) * 0.2, g, 10, 8);
    for (let k = 0; k < 7; k++) sph(0.06, flat(pick(['#e0482a', '#f2c12e', '#f08aa8', '#ffffff', '#9a5ad8'], s * 3 + k)), -0.45 + k * 0.15, 0.75 + hash(k + 9) * 0.1, 0.12, g, 8, 6); return SET.bake(g); };
  /** SET.tree({ h, colors, seed }): an organic tree — trunk, 3 branches, ~14 lumpy foliage clusters. Baked. */
  SET.tree = (o = {}, parent = K.scene) => { const g = new THREE.Group(); parent.add(g); const s = o.seed ?? 1, H = o.h ?? 4, bark = mat('bark', () => K.mat('wood', '#6a4a32'));
    cyl(0.12, 0.2, H * 0.6, bark, 0, H * 0.3, 0, g, 10);
    for (let k = 0; k < 3; k++) { const a = k * 2.1 + s, b = cyl(0.05, 0.09, H * 0.35, bark, Math.cos(a) * 0.25, H * 0.62, Math.sin(a) * 0.25, g, 8); b.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6); }
    const cols = o.colors || ['#4f9a3a', '#3f8a32', '#5aaa42', '#6ab84a'];
    for (let k = 0; k < 14; k++) { const a = hash(s * 9 + k) * 6.28, r = 0.3 + hash(s + k * 5) * 0.9, y = H * 0.65 + hash(s * 2 + k) * H * 0.45;
      const geo = new THREE.SphereGeometry(0.5 + hash(k + s * 7) * 0.35, 14, 10), P = geo.attributes.position;
      for (let i = 0; i < P.count; i++) { const d = 1 + 0.12 * Math.sin(P.getX(i) * 7 + k) * Math.sin(P.getY(i) * 6 + s) + 0.06 * Math.sin(P.getZ(i) * 11 + k * 2); P.setXYZ(i, P.getX(i) * d, P.getY(i) * d, P.getZ(i) * d); } geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, flat(cols[k % cols.length], 0.85)); m.position.set(Math.cos(a) * r, y, Math.sin(a) * r); m.castShadow = true; g.add(m); }
    return SET.bake(g); };
  /** SET.bike({ color }): a bicycle with spoked wheels, frame, saddle, handlebars and a basket (not baked; wheels in .wheels). */
  SET.bike = (o = {}, parent = K.scene) => { const g = new THREE.Group(); parent.add(g); const fm = paint(o.color || '#2a7ac8', { rough: 0.3 }), blk = paint('#1d1d22', { rough: 0.5 }), ch = K.chrome();
    const wheels = []; for (const x of [-0.52, 0.52]) { const w = new THREE.Group(); w.position.set(x, 0.34, 0); g.add(w); const t = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 32), blk); w.add(t);
      for (let k = 0; k < 12; k++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.62, 4), ch); sp.rotation.z = k * Math.PI / 12; w.add(sp); } wheels.push(w); }
    const tube = (a, b, r = 0.022) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 8), fm); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); g.add(m); };
    tube([-0.52, 0.34, 0], [-0.05, 0.34, 0]); tube([-0.05, 0.34, 0], [-0.15, 0.78, 0]); tube([-0.52, 0.34, 0], [-0.15, 0.74, 0]); tube([-0.05, 0.34, 0], [0.42, 0.74, 0]); tube([-0.15, 0.74, 0], [0.42, 0.74, 0]); tube([0.52, 0.34, 0], [0.44, 0.9, 0]);
    K.rbox(0.22, 0.05, 0.1, 0.02, blk, -0.17, 0.82, 0, g); const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), ch); hb.rotation.x = Math.PI / 2; hb.position.set(0.44, 0.92, 0); g.add(hb);
    if (o.basket !== false) { const bm = mat('wicker', () => K.mat('wood', '#c89a5a')); box(0.28, 0.2, 0.32, bm, 0.6, 0.86, 0, g); }
    return { g, wheels }; };
  /** SET.car({ color, kind: 'hatch'|'van'|'taxi' }): rounded glossy car along +x (~3.8 m), glass, chrome, lights, plates. returns { g, wheels } */
  SET.car = (o = {}, parent = K.scene) => { const g = new THREE.Group(); parent.add(g); const c = o.color || pick(['#d8322a', '#2a9ab8', '#f2c230', '#3a7a4a', '#e8e8ec', '#4a5ac8'], o.seed ?? 1);
    const body = K.paint(c), glass = K.paint('#1f2a36', { rough: 0.05, metal: 0.4, env: 1.8 }), blk = paint('#1d1d22', { rough: 0.6 }), ch = K.chrome(), van = o.kind === 'van';
    const L = van ? 4.4 : 3.8, H0 = 0.55, HB = 0.5, HC = van ? 1.1 : 0.62, CL = van ? L * 0.8 : L * 0.55;
    K.rbox(L, HB, 1.7, 0.18, body, 0, H0 + HB / 2, 0, g);                                      // lower body
    K.rbox(CL, HC, 1.56, 0.2, body, van ? -L * 0.08 : -L * 0.06, H0 + HB + HC / 2 - 0.05, 0, g); // cabin
    K.rbox(CL - 0.18, HC - 0.2, 1.6, 0.12, glass, van ? -L * 0.08 : -L * 0.06, H0 + HB + HC / 2 - 0.02, 0, g);
    K.rbox(0.1, HC - 0.24, 1.4, 0.04, glass, (van ? -L * 0.08 : -L * 0.06) + CL / 2 - 0.02, H0 + HB + HC / 2 - 0.04, 0, g);   // windscreen
    for (const x of [L / 2 - 0.02, -L / 2 + 0.02]) K.rbox(0.12, 0.2, 1.74, 0.05, ch, x, H0 + 0.08, 0, g);                       // bumpers
    for (const z of [-0.6, 0.6]) { const hl = sph(0.12, glow('#fff6d0', 1.6), L / 2 - 0.02, H0 + HB * 0.62, z, g, 12, 10); hl.scale.x = 0.4; const tl = box(0.05, 0.12, 0.28, glow('#ff3a2a', 1.4), -L / 2 + 0.01, H0 + HB * 0.65, z, g); }
    for (const x of [L / 2 + 0.01, -L / 2 - 0.01]) box(0.02, 0.13, 0.45, SET.textMat(o.plate || 'NL-' + Math.floor(hash(o.seed ?? 2) * 90 + 10), { bg: '#f2c230', fg: '#1a1a1a', w: 256, h: 64, border: false }), x, H0 + 0.25, 0, g);
    for (const z of [-0.88, 0.88]) K.rbox(0.18, 0.1, 0.08, 0.03, body, CL / 2 - L * 0.06 - 0.1, H0 + HB + 0.1, z, g);                // mirrors
    if (o.kind === 'taxi') K.rbox(0.5, 0.18, 0.3, 0.05, SET.textMat('TAXI', { bg: '#1a1a1a', fg: '#f2c230', w: 256, h: 96 }), -L * 0.06, H0 + HB + HC + 0.05, 0, g);
    const wheels = []; for (const x of [L * 0.33, -L * 0.33]) for (const z of [-0.78, 0.78]) { const w = new THREE.Group(); w.position.set(x, 0.36, z); g.add(w);
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.11, 10, 24), blk); w.add(t); const r = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 18), ch); r.rotation.x = Math.PI / 2; w.add(r); wheels.push(w); }
    return { g, wheels }; };
  /** SET.protestSign(text, color): a hand-held board on a stick (give it to a character's hand position or stand it up). */
  SET.protestSign = (text = 'MORE|LIGHTS!', o = {}, parent = K.scene) => { const g = new THREE.Group(); parent.add(g);
    box(0.05, 1.3, 0.05, mat('stick', () => K.mat('wood', '#a8703a')), 0, 0.65, 0, g); box(0.95, 0.62, 0.03, SET.textMat(text, { bg: o.bg || '#e8d4a8', fg: o.fg || '#c0392b', w: 512, h: 336, outline: o.outline }), 0, 1.45, 0.03, g); return g; };
  /** SET.board(text, w, h): a big info board / billboard on two posts (text lines split by '|'). */
  SET.board = (text, w = 2.4, h = 1.6, o = {}, parent = K.scene) => { const g = new THREE.Group(); parent.add(g); const pm = paint('#3a4048', { rough: 0.4 });
    for (const x of [-w * 0.38, w * 0.38]) cyl(0.05, 0.05, 1.2 + h, pm, x, (1.2 + h) / 2, -0.05, g, 10);
    K.rbox(w + 0.12, h + 0.12, 0.08, 0.03, paint(o.frame || '#1f5fc8', { rough: 0.4 }), 0, 1.2 + h / 2, 0, g); box(w, h, 0.02, SET.textMat(text, { bg: o.bg || '#fdf6e4', fg: o.fg || '#1f3a6a', w: 1024, h: Math.round(1024 * h / w) }), 0, 1.2 + h / 2, 0.05, g); return g; };

  /** SET.extras(n, area, o): background people (random detailed outfits) — returns list of rigs; call SET.extrasFrame(f, list) each frame to walk/idle them. */
  const OUT = (i) => ({ jacket: pick(['#7a4a9a', '#3a7a4a', '#c0632a', '#2a6a9a', '#d8a830', '#a83a3a', '#4a4a5a'], i), pants: pick(['#2c3e5a', '#3a2a1e', '#2a2a30', '#5a4a3a'], i + 1),
    hat: pick(['beanie', 'cap', null, null, 'cowboy'], i + 2), hatColor: pick(['#c0392b', '#2a62c8', '#f2c230'], i + 3), cap: pick(['#f2c230', '#2a62c8', '#c0392b'], i + 4),
    hairStyle: pick(['short', 'bun', 'curly', 'ponytail', 'spiky'], i + 5), hair: pick(['#3a2a1e', '#8a5a34', '#c8c0b8', '#1a1a1a'], i + 6), scarf: hash(i + 7) > 0.5 ? pick(['#f08a24', '#c0392b', '#2a7a4a'], i + 8) : undefined,
    glasses: hash(i + 9) > 0.7, vest: hash(i + 10) > 0.6 ? pick(['#8a5a34', '#f2e2c0'], i + 11) : undefined, belt: '#3a2418', collar: pick(['#f4efe4', '#ffffff'], i + 12) });
  SET.extras = (n, o = {}) => { const list = []; for (let i = 0; i < n; i++) { const r = K.stick(OUT((o.seed ?? 0) + i * 17), { key: 'x' + ((o.seed ?? 0) + i) });
      list.push({ r, i, x0: (o.x0 ?? -10) + hash(i * 3 + 1) * (o.len ?? 20), z: (o.z ?? 5) + (hash(i * 5 + 2) - 0.5) * (o.spread ?? 1.6), dir: hash(i * 7) > 0.5 ? 1 : -1, spd: 0.6 + hash(i * 11) * 0.5, still: hash(i * 13) < (o.stillShare ?? 0.35), len: o.len ?? 20, xs: o.x0 ?? -10 }); }
    return list; };
  SET.extrasFrame = (f, list, T) => { for (const e of list) { const t = f / 30;
      if (e.still) { const A = T.act(f, [[0, pick(['idle', 'phone', 'cross', 'think', 'read'], e.i), { expr: pick(['neutral', 'smile', 'confused'], e.i) }]], { seed: e.i }); e.r.set(A, { x: e.x0, z: e.z, yaw: e.dir > 0 ? Math.PI / 2 : -Math.PI / 2 }); continue; }
      const x = e.xs + (((e.x0 - e.xs + e.dir * e.spd * t) % e.len) + e.len) % e.len;
      const A = T.act(f, [[0, 'walk', { expr: pick(['neutral', 'smile'], e.i) }]], { seed: e.i, phase: (t * 1.6 * e.spd) % 1 }); e.r.set(A, { x, z: e.z, yaw: e.dir > 0 ? Math.PI / 2 : -Math.PI / 2 }); } };
  return SET;
}
