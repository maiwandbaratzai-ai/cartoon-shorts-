// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Pro-look effects (reference study 2026-11-21, a top 3D Shorts channel):
//  - glossy hero materials with real reflections: K.paint, K.gold, K.chrome, K.glass (+ K.rbox rounded/bevelled boxes)
//  - particles: K.sparks, K.rain, K.steam, K.leaves, K.leafLitter
//  - explainer graphics: K.holo / K.holoBox (x-ray), K.trace (glowing line that draws itself)
//  - 2D overlay drawn crisp on top of the frame: K.badge (pill labels that pop in), K.hud (progress map), K.mist (white fog wipe)
// Everything is a pure function of the frame number, so frames can render in any order.
import * as THREE from './lib/three.module.js';

export function initFX(K) {
  const { scene, renderer } = K;
  const FX = {};
  // ---------------- reflections ----------------
  const pmrem = new THREE.PMREMGenerator(renderer);
  const glossMats = []; let envTex = null, envKey = '';
  const envScene = new THREE.Scene();
  const envU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, gnd: { value: new THREE.Color() } };
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.ShaderMaterial({ uniforms: envU, side: THREE.BackSide,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top, hor, gnd; varying vec3 vP; void main(){ float y = normalize(vP).y; vec3 c = y > 0. ? mix(hor, top, pow(y, .6)) : mix(hor*.8, gnd, pow(-y, .4)); gl_FragColor = vec4(c, 1.); }' })));
  const boxes = [];   // softboxes: bright panels that make crisp highlights on glossy paint
  for (const [x, y, z, w, h, k] of [[6, 7, 3, 7, 3, 3.2], [-7, 4, -4, 4, 6, 1.6], [0, 9, -6, 9, 2, 1.4], [3, 1.5, 8, 6, 1.2, 0.9]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m); boxes.push(m);
  }
  FX.envUpdate = (L) => {
    const key = [L.skyTop, L.skyHor, L.ground, L.sun].join('|'); if (key === envKey) return; envKey = key;
    envU.top.value.set(L.skyTop || '#6a9ad8'); envU.hor.value.set(L.skyHor || '#e8e0d0'); envU.gnd.value.set(L.ground || '#5a6a4a').multiplyScalar(0.6);
    const sc = new THREE.Color(L.sun || '#ffffff'); boxes.forEach((b, i) => b.material.color.copy(sc).multiplyScalar([3.2, 1.6, 1.4, 0.9][i]));
    if (envTex) envTex.dispose(); envTex = pmrem.fromScene(envScene, 0.02).texture;
    for (const m of glossMats) { m.envMap = envTex; m.needsUpdate = true; }
  };
  const gloss = (m) => { glossMats.push(m); if (envTex) m.envMap = envTex; return m; };
  /** Glossy car/toy paint with a clear coat: the look of every hero prop (trains, cars, boats, machines). */
  FX.paint = (color, o = {}) => gloss(new THREE.MeshPhysicalMaterial({ color, metalness: o.metal ?? 0.2, roughness: o.rough ?? 0.38, clearcoat: o.coat ?? 1, clearcoatRoughness: o.coatRough ?? 0.06, envMapIntensity: o.env ?? 1.1 }));
  FX.gold = (o = {}) => gloss(new THREE.MeshStandardMaterial({ color: o.color || '#f0c04a', metalness: 1, roughness: o.rough ?? 0.22, envMapIntensity: 1.4, emissive: new THREE.Color(o.color || '#f0c04a').multiplyScalar(0.08) }));
  FX.chrome = (o = {}) => gloss(new THREE.MeshStandardMaterial({ color: o.color || '#dfe4ea', metalness: 1, roughness: o.rough ?? 0.12, envMapIntensity: 1.3 }));
  FX.glass = (o = {}) => gloss(new THREE.MeshPhysicalMaterial({ color: o.color || '#bfe4ff', metalness: 0, roughness: 0.04, transparent: true, opacity: o.opacity ?? 0.35, envMapIntensity: 1.6, clearcoat: 1 }));
  /** Rounded (bevelled) box: bevels catch the light and make props look manufactured, not blocky. */
  FX.rbox = (w, h, d, r, mat, x = 0, y = 0, z = 0, parent = scene) => {
    r = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
    const s = new THREE.Shape(), a = w / 2 - r, b = h / 2 - r;
    s.moveTo(-a, -h / 2); s.lineTo(a, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -b); s.lineTo(w / 2, b); s.quadraticCurveTo(w / 2, h / 2, a, h / 2);
    s.lineTo(-a, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, b); s.lineTo(-w / 2, -b); s.quadraticCurveTo(-w / 2, -h / 2, -a, -h / 2);
    const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(1e-3, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.999, bevelSegments: 4, curveSegments: 6 });
    g.translate(0, 0, -(d - 2 * r) / 2); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  };

  // ---------------- particles ----------------
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const at = (p, f) => (typeof p === 'function' ? p(f) : p);
  // streaks: camera-facing quads stretched along their motion (sparks = additive, rain = normal)
  const mkStreaks = (additive) => {
    const MAX = 6000, pos = new Float32Array(MAX * 12), colA = new Float32Array(MAX * 16), idx = new Uint32Array(MAX * 6);
    for (let i = 0; i < MAX; i++) idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(colA, 4)); g.setIndex(new THREE.BufferAttribute(idx, 1));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, fog: !additive, side: THREE.DoubleSide }));
    m.frustumCulled = false; m.userData.ndSkip = true; m.renderOrder = 5; scene.add(m);
    return { m, g, pos, colA, list: [], MAX };
  };
  const SP = mkStreaks(true), RN = mkStreaks(false);
  const tA = new THREE.Vector3(), tB = new THREE.Vector3(), tD = new THREE.Vector3(), tS = new THREE.Vector3(), tV = new THREE.Vector3();
  const flushStreaks = (S, cam) => {
    let n = 0;
    for (const q of S.list) { if (n >= S.MAX) break;
      tA.set(...q.a); tB.set(...q.b); tD.subVectors(tA, tB); if (tD.lengthSq() < 1e-8) tD.set(0, 1e-3, 0);
      tV.subVectors(cam.position, tA).normalize(); tS.crossVectors(tD, tV).normalize().multiplyScalar(q.w / 2);
      const o = n * 12; S.pos.set([tA.x - tS.x, tA.y - tS.y, tA.z - tS.z, tA.x + tS.x, tA.y + tS.y, tA.z + tS.z, tB.x + tS.x * 0.4, tB.y + tS.y * 0.4, tB.z + tS.z * 0.4, tB.x - tS.x * 0.4, tB.y - tS.y * 0.4, tB.z - tS.z * 0.4], o);
      const c = q.c, ct = q.ct || [c[0], c[1], c[2], 0]; S.colA.set([...c, ...c, ...ct, ...ct], n * 16); n++; }
    S.g.setDrawRange(0, n * 6); S.g.attributes.position.needsUpdate = true; S.g.attributes.color.needsUpdate = true; S.m.visible = n > 0; S.list.length = 0;
  };
  /** K.sparks(f, f0, f1, at, o): a shower of hot sparks (grinding wheels, metal hits) from frame f0 to f1.
   *  at = [x,y,z] or (frame) => [x,y,z]; o = { dir: [x,y,z] main direction, spread 0.9, rate 9 per frame, speed 4, life 12, size 1, seed } */
  FX.sparks = (f, f0, f1, atp, o = {}) => {
    const dir = o.dir || [0, 1, 0], sp = o.spread ?? 0.9, rate = o.rate ?? 9, spd = o.speed ?? 4, life = o.life ?? 12, sz = o.size ?? 1, sd = o.seed ?? 1;
    for (let s = Math.max(f0, Math.floor(f - life)); s <= Math.min(f, f1); s++) for (let k = 0; k < rate; k++) {
      const id = s * 31 + k * 7 + sd * 1000, L = life * (0.5 + 0.5 * hash(id + 5)), a = f - s + hash(id + 9); if (a < 0 || a > L) continue;
      const t = a / 30, v = [dir[0] + (hash(id) - 0.5) * 2 * sp, dir[1] + (hash(id + 1) - 0.5) * 2 * sp, dir[2] + (hash(id + 2) - 0.5) * 2 * sp], vs = spd * (0.5 + hash(id + 3));
      const vl = Math.hypot(...v) || 1; for (let i = 0; i < 3; i++) v[i] = v[i] / vl * vs;
      const p0 = at(atp, s), p = [p0[0] + v[0] * t, p0[1] + v[1] * t - 4.9 * t * t, p0[2] + v[2] * t], vy = v[1] - 9.8 * t;
      const tail = 0.035 * (1 + hash(id + 4)), u = a / L, heat = 1 - u;
      S_push(SP, p, [p[0] - v[0] * tail, p[1] - vy * tail, p[2] - v[2] * tail], 0.014 * sz * (1 - 0.5 * u), [1.6, 1.0 + 0.4 * heat, 0.35 * heat, heat], [1.2, 0.35, 0.05, 0]);
    }
  };
  const S_push = (S, a, b, w, c, ct) => { if (S.list.length < S.MAX) S.list.push({ a, b, w, c, ct }); };
  /** K.rain(f, center, o): drizzle or downpour around a point (usually the camera's look point). o = { area 10, count 500, speed 11, len 0.32, slant 0.15, alpha 0.35 } */
  FX.rain = (f, c, o = {}) => {
    const A = o.area ?? 10, N = o.count ?? 500, v = o.speed ?? 11, len = o.len ?? 0.32, sl = o.slant ?? 0.15, H = 8, al = o.alpha ?? 0.35;
    for (let i = 0; i < N; i++) { const x = c[0] + (hash(i) - 0.5) * A, z = c[2] + (hash(i + 0.5) - 0.5) * A, ph = hash(i + 0.25) * H;
      const y = c[1] - 1 + H - ((f / 30 * v + ph) % H), dx = sl * (y - c[1]);
      S_push(RN, [x + dx, y, z], [x + dx + sl * len, y + len, z], 0.012, [0.82, 0.88, 0.95, al], [0.82, 0.88, 0.95, 0]); }
  };
  // soft billowy sprites for steam and smoke
  const cloudTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    for (let i = 0; i < 9; i++) { const x = 64 + Math.cos(i * 2.4) * 22 * (i % 3) / 2, y = 64 + Math.sin(i * 2.4) * 22 * (i % 3) / 2, r = 30 + (i * 7) % 16;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const stPool = []; let stUsed = 0;
  /** K.steam(f, at, o): a continuous plume from a chimney/vent/kettle. at = [x,y,z] or (frame)=>[x,y,z];
   *  o = { rate: puffs per second (8), life: frames (70), size 1, rise 2.5, drift [x,z] wind per second, color '#ffffff', dark: 0..1 (smoke), burst: frames of a big chuff boost } */
  FX.steam = (f, atp, o = {}) => {
    const rate = o.rate ?? 8, life = o.life ?? 70, sz = o.size ?? 1, rise = o.rise ?? 2.5, dr = o.drift || [0.6, 0], col = new THREE.Color(o.color || '#ffffff').lerp(new THREE.Color('#4a4a50'), o.dark ?? 0), sd = o.seed ?? 3;
    const step = 30 / rate;
    for (let s = Math.floor((f - life) / step); s <= f / step; s++) { const sf = s * step, a = f - sf; if (a < 0 || a > life) continue;
      const id = s + sd * 977, u = a / life, t = a / 30, p0 = at(atp, sf);
      if (stUsed >= stPool.length) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false })); m.userData.ndSkip = true; m.renderOrder = 4; scene.add(m); stPool.push(m); }
      const m = stPool[stUsed++]; m.visible = true;
      m.position.set(p0[0] + dr[0] * t + (hash(id) - 0.5) * 0.5 * u, p0[1] + rise * Math.pow(t, 0.75) + 0.15 * Math.sin(t * 3 + id), p0[2] + dr[1] * t + (hash(id + 1) - 0.5) * 0.5 * u);
      const k = sz * (0.35 + 2.2 * Math.pow(u, 0.6)) * (0.8 + 0.4 * hash(id + 2)); m.scale.set(k, k, k);
      m.material.rotation = hash(id + 3) * 6.28 + u * 0.8; m.material.color.copy(col).multiplyScalar(1.05 - 0.15 * u);
      m.material.opacity = Math.min(1, a / 5) * Math.pow(1 - u, 1.4) * (o.alpha ?? 0.9);
    }
  };
  // falling leaves (tumbling quads) + static leaf litter on the ground
  const leafGeo = new THREE.PlaneGeometry(0.11, 0.08); const leafMats = {}; const lfPool = []; let lfUsed = 0;
  const leafMat = (c) => leafMats[c] || (leafMats[c] = new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 0.8 }));
  const LEAF = ['#e0482a', '#f08a24', '#f2c12e', '#c8381c', '#a8521e'];
  /** K.leaves(f, center, o): leaves drifting down and tumbling. o = { area 10, count 60, colors, wind [x,z], fall 0.6 } */
  FX.leaves = (f, c, o = {}) => {
    const A = o.area ?? 10, N = o.count ?? 60, cols = o.colors || LEAF, w = o.wind || [0.5, 0.1], fall = o.fall ?? 0.6, H = 6;
    for (let i = 0; i < N; i++) { if (lfUsed >= lfPool.length) { const m = new THREE.Mesh(leafGeo, leafMat(LEAF[0])); m.castShadow = true; scene.add(m); lfPool.push(m); }
      const m = lfPool[lfUsed++]; m.visible = true; m.material = leafMat(cols[i % cols.length]);
      const t = f / 30, ph = hash(i * 3.1) * H, y = H - ((t * fall + ph) % H);
      m.position.set(c[0] + (hash(i) - 0.5) * A + w[0] * ((t * fall + ph) % H) + 0.3 * Math.sin(t * 2 + i), c[1] + y - 0.5, c[2] + (hash(i + 0.7) - 0.5) * A + w[1] * y + 0.3 * Math.cos(t * 1.7 + i));
      m.rotation.set(t * (2 + hash(i + 2) * 3) + i, t * 1.3 + i * 2, Math.sin(t * 3 + i)); }
  };
  /** K.leafLitter(x0, x1, z0, z1, n, y, colors): a static carpet of fallen leaves (call once in build). */
  FX.leafLitter = (x0, x1, z0, z1, n = 600, y = 0.01, cols = LEAF) => {
    for (const [ci, c] of cols.entries()) { const im = new THREE.InstancedMesh(leafGeo, leafMat(c), Math.ceil(n / cols.length)); const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
      for (let i = 0; i < im.count; i++) { const h = i * 7 + ci * 1000; E.set(-Math.PI / 2 + (hash(h) - 0.5) * 0.3, 0, hash(h + 1) * 6.28); Q.setFromEuler(E);
        M.compose(new THREE.Vector3(x0 + hash(h + 2) * (x1 - x0), y + hash(h + 3) * 0.01, z0 + hash(h + 4) * (z1 - z0)), Q, new THREE.Vector3(1, 1, 1).multiplyScalar(0.8 + hash(h + 5) * 0.6)); im.setMatrixAt(i, M); }
      im.receiveShadow = true; scene.add(im); }
  };

  // ---------------- explainer graphics ----------------
  /** K.holo(color): glowing see-through x-ray material (cutaways showing what is inside). */
  FX.holo = (color = '#36e2ff', o = {}) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { c: { value: new THREE.Color(color) }, k: { value: o.strength ?? 1 } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vW; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = -mv.xyz; vW = (modelMatrix*vec4(position,1.)).xyz; gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; uniform float k; varying vec3 vN; varying vec3 vV; varying vec3 vW; void main(){ float fr = pow(1.-abs(dot(normalize(vN), normalize(vV))), 2.); float scan = .75+.25*sin(vW.y*90.); gl_FragColor = vec4(c*(.18+1.4*fr)*scan*k, 1.); }' });
  /** K.holoBox(w,h,d,x,y,z,parent,color): an x-ray box with glowing edges; returns the group (scale/visible it to reveal). */
  FX.holoBox = (w, h, d, x, y, z, parent = scene, color = '#36e2ff') => {
    const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), FX.holo(color, { strength: 0.7 })); b.userData.ndSkip = true; g.add(b);
    const em = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2.2) }), r = 0.012;
    for (const [ax, L] of [['x', w], ['y', h], ['z', d]]) for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) {
      const e = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 6), em); e.userData.ndSkip = true;
      if (ax === 'x') { e.rotation.z = Math.PI / 2; e.position.set(0, s1 * h / 2, s2 * d / 2); } else if (ax === 'y') e.position.set(s1 * w / 2, 0, s2 * d / 2); else { e.rotation.x = Math.PI / 2; e.position.set(s1 * w / 2, s2 * h / 2, 0); }
      g.add(e); }
    return g;
  };
  /** K.trace(points, o): a glowing tube along points that draws itself; call .show(0..1) each frame. o = { color, r, parent } */
  FX.trace = (pts, o = {}) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg = 200, rs = 8;
    const g = new THREE.TubeGeometry(curve, seg, o.r ?? 0.03, rs, false);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(o.color || '#fff3b0').multiplyScalar(o.glow ?? 2.4) })); m.userData.ndSkip = true; m.renderOrder = 6; (o.parent || scene).add(m);
    return { mesh: m, show(u) { u = Math.max(0, Math.min(1, u)); m.visible = u > 0; g.setDrawRange(0, Math.floor(seg * u) * rs * 6); } };
  };

  // ---------------- 2D overlay (crisp, on top of everything) ----------------
  const ui = []; let mist = 0;
  FX.uiList = ui; FX.getMist = () => mist;
  const pop = (f, f0, f1) => { const a = (f - f0) / 7; if (a < 0) return 0; let s = a >= 1 ? 1 : 1 + 0.25 * Math.sin(Math.PI * a) - (1 - a) * (1 - a) * 0.9;
    if (f1 !== undefined && f > f1) s *= Math.max(0, 1 - (f - f1) / 5); return Math.max(0, s); };
  /** K.badge(f, f0, text, at, o): a pill label that pops in (overshoot) and floats. at = [x,y,z] world point (follows it) or { sx, sy } screen 0..1.
   *  o = { f1 (hide after), icon: 'check'|'x'|'coin'|'up'|'down'|'warn'|'weight'|'drop'|'bolt'|'clock', bg '#1d2a3a', fg '#ffffff', ring '#36e2ff', size 1, style: 'pill'|'stamp' } */
  FX.badge = (f, f0, text, atp, o = {}) => { const s = pop(f, f0, o.f1); if (s <= 0) return; ui.push({ kind: 'badge', text, at: atp, s, f, o }); };
  /** K.hud(f, f0, o): a progress map at the top of the screen (route with stages and a marker). o = { stages 3, u: 0..1 progress, labels, f1, rival: 0..1 } */
  FX.hud = (f, f0, o = {}) => { const s = pop(f, f0, o.f1); if (s <= 0) return; ui.push({ kind: 'hud', s, f, o }); };
  /** K.mist(f, f0, dur): a white fog wipe between scenes/seasons (peaks halfway through dur). */
  FX.mist = (f, f0, dur = 16) => { const u = (f - f0) / dur; if (u > 0 && u < 1) mist = Math.max(mist, Math.sin(Math.PI * u)); };
  FX.resetFrame = () => { ui.length = 0; mist = 0; for (const m of stPool) m.visible = false; stUsed = 0; for (const m of lfPool) m.visible = false; lfUsed = 0; SP.list.length = 0; RN.list.length = 0; };
  FX.flush = (cam) => { flushStreaks(SP, cam); flushStreaks(RN, cam); };

  const oc = document.createElement('canvas'); oc.width = K.W; oc.height = K.H; const og = oc.getContext('2d');
  const otex = new THREE.CanvasTexture(oc); otex.colorSpace = THREE.SRGBColorSpace; FX.overlayTex = otex;
  const FONT = '"Poppins", "DejaVu Sans", sans-serif';
  const icon = (g, kind, x, y, r, col) => { g.save(); g.translate(x, y); g.lineWidth = r * 0.32; g.lineCap = g.lineJoin = 'round'; g.strokeStyle = g.fillStyle = col;
    const st = (pts) => { g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(a * r, b * r) : g.moveTo(a * r, b * r))); g.stroke(); };
    if (kind === 'check') { g.strokeStyle = '#2ee07a'; st([[-0.7, 0], [-0.2, 0.55], [0.75, -0.6]]); }
    else if (kind === 'x') { g.strokeStyle = '#ff4a4a'; st([[-0.6, -0.6], [0.6, 0.6]]); st([[0.6, -0.6], [-0.6, 0.6]]); }
    else if (kind === 'coin') { g.fillStyle = '#f2c230'; g.beginPath(); g.arc(0, 0, r * 0.8, 0, 7); g.fill(); g.fillStyle = '#7a5a10'; g.font = `800 ${r * 1.1}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', 0, r * 0.06); }
    else if (kind === 'up' || kind === 'down') { const d = kind === 'up' ? 1 : -1; g.strokeStyle = kind === 'up' ? '#2ee07a' : '#ff4a4a'; st([[0, -0.7 * d], [0, 0.7 * d]]); st([[-0.55, -0.15 * d], [0, -0.7 * d], [0.55, -0.15 * d]]); }
    else if (kind === 'warn') { g.fillStyle = '#f2c230'; g.beginPath(); g.moveTo(0, -0.8 * r); g.lineTo(0.85 * r, 0.65 * r); g.lineTo(-0.85 * r, 0.65 * r); g.closePath(); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(-0.08 * r, -0.35 * r, 0.16 * r, 0.6 * r); g.fillRect(-0.08 * r, 0.38 * r, 0.16 * r, 0.14 * r); }
    else if (kind === 'weight') { g.fillStyle = col; g.beginPath(); g.moveTo(-0.45 * r, -0.35 * r); g.lineTo(0.45 * r, -0.35 * r); g.lineTo(0.75 * r, 0.7 * r); g.lineTo(-0.75 * r, 0.7 * r); g.closePath(); g.fill(); g.beginPath(); g.arc(0, -0.5 * r, 0.22 * r, 0, 7); g.lineWidth = r * 0.14; g.stroke(); }
    else if (kind === 'drop') { g.fillStyle = '#5ac8ff'; g.beginPath(); g.moveTo(0, -0.85 * r); g.quadraticCurveTo(0.75 * r, 0.1 * r, 0, 0.75 * r); g.quadraticCurveTo(-0.75 * r, 0.1 * r, 0, -0.85 * r); g.fill(); }
    else if (kind === 'bolt') { g.fillStyle = '#f2c230'; g.beginPath(); [[0.2, -0.85], [-0.45, 0.1], [0, 0.1], [-0.2, 0.85], [0.45, -0.15], [0, -0.15]].forEach(([a, b], i) => (i ? g.lineTo(a * r, b * r) : g.moveTo(a * r, b * r))); g.closePath(); g.fill(); }
    else if (kind === 'clock') { g.beginPath(); g.arc(0, 0, 0.75 * r, 0, 7); g.lineWidth = r * 0.18; g.stroke(); st([[0, -0.45], [0, 0], [0.35, 0.2]]); }
    g.restore(); };
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const proj = new THREE.Vector3();
  FX.drawOverlay = (cam) => {
    og.clearRect(0, 0, oc.width, oc.height); const W = oc.width, H = oc.height;
    for (const q of ui) {
      if (q.kind === 'badge') { const o = q.o; let x, y;
        if (Array.isArray(q.at) || typeof q.at === 'function') { proj.set(...at(q.at, q.f)).project(cam); if (proj.z > 1) continue; x = (proj.x * 0.5 + 0.5) * W; y = (-proj.y * 0.5 + 0.5) * H; }
        else { x = q.at.sx * W; y = q.at.sy * H; }
        y += Math.sin(q.f * 0.12) * 5;
        const S = 60 * (o.size ?? 1), stamp = o.style === 'stamp';
        og.save(); og.translate(x, y); og.scale(q.s, q.s); og.rotate(stamp ? -0.05 : 0);
        og.font = `800 ${S}px ${FONT}`; const tw = og.measureText(q.text).width, ic = o.icon ? S * 1.05 : 0, pw = tw + ic + S * 1.1, ph = S * 1.45;
        og.shadowColor = 'rgba(0,0,0,0.45)'; og.shadowBlur = 18; og.shadowOffsetY = 6;
        rr(og, -pw / 2, -ph / 2, pw, ph, ph / 2); og.fillStyle = stamp ? (o.bg || '#ffd23a') : (o.bg || 'rgba(18,28,42,0.92)'); og.fill();
        og.shadowColor = 'transparent'; og.lineWidth = S * 0.12; og.strokeStyle = stamp ? '#1a1a1a' : (o.ring || '#36e2ff'); og.stroke();
        if (o.icon) icon(og, o.icon, -pw / 2 + S * 0.55 + ic / 2, 0, S * 0.42, o.fg || '#ffffff');
        og.fillStyle = stamp ? '#1a1a1a' : (o.fg || '#ffffff'); og.textAlign = 'left'; og.textBaseline = 'middle'; og.fillText(q.text, -pw / 2 + S * 0.55 + ic, S * 0.04);
        og.restore(); }
      else if (q.kind === 'hud') { const o = q.o, n = o.stages ?? 3, w = W * 0.62, h = 150, x0 = (W - w) / 2, y0 = 150;
        og.save(); og.translate(W / 2, y0 + h / 2); og.scale(q.s, q.s); og.translate(-W / 2, -(y0 + h / 2));
        og.shadowColor = 'rgba(0,0,0,0.4)'; og.shadowBlur = 16; rr(og, x0, y0, w, h, 26); og.fillStyle = 'rgba(14,22,34,0.88)'; og.fill(); og.shadowColor = 'transparent';
        og.lineWidth = 5; og.strokeStyle = '#36e2ff'; og.stroke();
        // route profile: rises in n steps
        const px = (u) => x0 + 40 + u * (w - 80), py = (u) => y0 + h - 40 - (h - 75) * (Math.floor(u * n * 0.999) / n + (u * n % 1) * (1 / n)) * 0.95;
        og.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60; i ? og.lineTo(px(u), py(u)) : og.moveTo(px(u), py(u)); } og.lineWidth = 6; og.strokeStyle = '#e8eef6'; og.stroke();
        const cur = Math.floor(Math.min(0.999, o.u ?? 0) * n);
        for (let k = 0; k < n; k++) { const u = (k + 0.5) / n; og.fillStyle = k === cur ? '#ffd23a' : 'rgba(255,255,255,0.18)'; og.fillRect(px(k / n) + 4, py(u) + 8, (w - 80) / n - 8, y0 + h - 32 - py(u) - 8);
          og.fillStyle = '#ffffff'; og.font = `800 26px ${FONT}`; og.textAlign = 'center'; og.fillText(o.labels ? o.labels[k] : String(k + 1), px(u), y0 + h - 12); }
        const mk = (u, c) => { og.beginPath(); og.arc(px(u), py(u) - 12, 13, 0, 7); og.fillStyle = c; og.fill(); og.lineWidth = 4; og.strokeStyle = '#1a1a1a'; og.stroke(); };
        if (o.rival !== undefined) mk(o.rival, '#ff5a4a'); mk(o.u ?? 0, '#36e2ff');
        og.restore(); }
    }
    otex.needsUpdate = true;
  };
  return FX;
}
