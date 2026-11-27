// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why 100 Marching Musicians Can Bounce a Bridge" — invented story, engine: Fish Out of Water (SCRIPTS.md §000).
// Robot drum major Metro-Nine ("Left! Right! Left!") marches the band in perfect time across a steel bridge. Major the duck, leader for
// nine years, is demoted to cymbals. Step one, the bridge hums; step ten, it wobbles; step forty, it bounces like jelly. The robot's fix:
// march even more perfectly; the bridge flings the drummers into the river and the flutes into a tree. Explainer: every bridge has its own
// bounce, like a swing; push a swing at the right moment again and again and it goes higher; a hundred boots in perfect time push the
// bridge at that moment, every step. Major leads again: nobody can march in step behind a waddle.
import { TOTAL, LINES, wf } from './bandbridge_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const DY = 6, HALF = 20, NSEG = 40, EX = [120, 0, 0], TREE = [23.5, 6.5];
let THREE, F = {}, SEGS = [], HANG = [], CAB = [], MUS = [], INS = [], ROBOT, ANT, BATON, DUCK, CYM = [], SWING, HB, BOOTS = [], DOWN = [], SPL = [];

function bridgeY(x, f, A, ph = 0) { if (x < -HALF || x > HALF) return DY; return DY + A * Math.sin(Math.PI * (x + HALF) / (2 * HALF)) * Math.sin((f + 7.5) * 2 * Math.PI / 30 + ph); }
function tuba(K, p) { const g = new THREE.Group(); p.add(g); const GO = K.gold(); const t = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 10, 24), GO); g.add(t); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.08, 0.5, 20, 1, true), GO); b.material.side = THREE.DoubleSide; b.position.set(0.1, 0.5, 0); g.add(b); return g; }
function drum(K, p) { const g = new THREE.Group(); p.add(g); K.cyl(0.3, 0.3, 0.32, K.paint('#f4f2ee'), 0, -0.16, 0, g, 20); for (const y of [-0.16, 0.16]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 6, 20), K.paint('#c8202a')); r.rotation.x = Math.PI / 2; r.position.y = y; g.add(r); } for (let k = 0; k < 6; k++) { const z = K.rbox(0.02, 0.32, 0.02, 0.005, K.gold(), Math.cos(k) * 0.3, 0, Math.sin(k) * 0.3, g); void z; } return g; }
function flute(K, p) { const g = new THREE.Group(); p.add(g); const c = K.cyl(0.025, 0.025, 0.7, K.chrome(), 0, -0.35, 0, g, 8); c.rotation.z = Math.PI / 2; c.position.set(0, 0, 0); return g; }
function trumpet(K, p) { const g = new THREE.Group(); p.add(g); const GO = K.gold(); const c = K.cyl(0.03, 0.03, 0.45, GO, 0, -0.22, 0, g, 8); c.rotation.z = Math.PI / 2; c.position.set(0, 0, 0); const b = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 14, 1, true), GO); b.rotation.z = -Math.PI / 2; b.position.x = 0.3; g.add(b); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { BOUNCE: wf(0, 'bounce'), TRAMP: wf(0, 'trampoline'), TUBA: wf(1, 'tuba'), UP: wf(1, 'up'), HIGHER: wf(1, 'higher'), LEADER: wf(2, 'leader'), METRO: 241, ROBOT: wf(2, 'robot'), PERFECT: wf(2, 'perfect'),
      LEFT: wf(3, 'left'), BOOT: wf(3, 'boot'), SAME: wf(3, 'same'), MAJOR: wf(4, 'major'), NINE: wf(4, 'nine'), DEMOTED: wf(4, 'demoted'), CYMB: wf(4, 'cymbals'),
      ONE: wf(5, 'one'), HUMMED: wf(5, 'hummed'), TEN: wf(5, 'ten'), WOBBLED: wf(5, 'wobbled'), FORTY: wf(5, 'forty'), JELLY: wf(5, 'jelly'), FIXED: wf(6, 'fixed'), MORE: wf(6, 'more'), LEFT2: wf(6, 'left'),
      FLUNG: wf(7, 'flung'), DRUMMERS: wf(7, 'drummers'), RIVER: wf(7, 'river'), FLUTES: wf(7, 'flutes'), TREE: wf(7, 'tree'), WHY: wf(8, 'why'), OWN: wf(9, 'own'), SWING: wf(9, 'swing'),
      PUSH: wf(10, 'push'), RIGHT: wf(10, 'right'), AGAIN: wf(10, 'again'), HIGHER2: wf(10, 'higher'), HUNDRED: wf(11, 'hundred'), BOOTS: wf(11, 'boots'), MOMENT: wf(11, 'moment'), EVERY: wf(11, 'every'),
      NOW: wf(12, 'now'), LEADS: wf(12, 'leads'), NOBODY: wf(12, 'nobody'), WADDLE: wf(12, 'waddle') };
    // ================= gorge, river, banks, town =================
    const G = K.group();
    const water = K.slab(-80, 80, -0.3, 0, -90, 90, K.paint('#2a7ab8', { rough: 0.1, coat: 1, env: 1.5 }), G, false); void water;
    for (const s of [-1, 1]) { K.slab(s > 0 ? HALF : -90, s > 0 ? 90 : -HALF, 0, DY, -90, 90, K.mat('rock', '#a8885a', { detail: 1.2, amt: 0.4 }), G, false); K.slab(s > 0 ? HALF : -90, s > 0 ? 90 : -HALF, DY, DY + 0.1, -90, 90, K.mat('grime', '#6aa84f', { detail: 1.6 }), G, false); }
    for (let k = 0; k < 30; k++) { const s = k % 2 ? 1 : -1; K.sphere(0.6 + hash(k) * 0.9, K.mat('rock', '#8a7a64'), s * (HALF + 0.4), 0.4 + hash(k + 1) * 5, -30 + hash(k + 2) * 60, G, 0.6, 1, 1.2); }
    for (let k = 0; k < 12; k++) K.sphere(0.5 + hash(k) * 0.5, K.mat('rock', '#7a6a5a'), -15 + hash(k + 4) * 30, 0, -20 + hash(k + 7) * 40, G, 1, 0.5, 1);
    // bridge towers + main cables + anchors
    const RED = K.paint('#c8402a', { rough: 0.35 }), GRY = K.paint('#5a5e66', { metal: 0.5, rough: 0.4 });
    for (const tx of [-13, 13]) { for (const s of [-1, 1]) K.rbox(0.8, 16, 0.8, 0.08, RED, tx, DY - 2 + 8, s * 3.0, G); K.rbox(0.7, 0.7, 6.6, 0.06, RED, tx, DY + 12, 0, G); K.rbox(0.6, 0.6, 6.6, 0.06, RED, tx, DY + 7, 0, G); K.rbox(1.6, 2.2, 7.6, 0.1, K.mat('rock', '#9a9a94'), tx, DY - 3, 0, G); }
    const cy = (x) => { const ax = Math.abs(x); if (ax <= 13) return DY + 3 + 11 * (x / 13) ** 2; return DY + 14 - 14 * (ax - 13) / 11; };
    for (const s of [-1, 1]) { const pts = []; for (let x = -24; x <= 24; x += 1) pts.push(new THREE.Vector3(x, cy(x), s * 3.0)); const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 96, 0.12, 8, false), GRY); tube.castShadow = true; G.add(tube); }
    for (const sx of [-1, 1]) for (const s of [-1, 1]) K.rbox(1.6, 1.0, 1.0, 0.1, K.mat('rock', '#9a9a94'), sx * 24, DY + 0.5, s * 3.0, G);
    const sg = S.board('OLD STEEL BRIDGE|BUILT 1946', 2.6, 1.3); sg.position.set(-HALF - 3.2, DY, 4.2); sg.rotation.y = 0.5;
    const pb = S.board('PARADE TODAY!', 2.4, 1.0); pb.position.set(HALF + 3, DY, -4.2); pb.rotation.y = -0.4;
    // west bank town + east bank park
    for (let k = 0; k < 6; k++) { const b = S.building({ w: 6, d: 7, floors: 2 + (k % 2), seed: 40 + k, shop: [null, 'BAKERY', null, 'MUSIC', null, 'CAFE'][k], flowers: true, shutters: k % 2 ? '#2a5a3a' : null }); b.position.set(-30 - (k % 3) * 7, DY, k < 3 ? -9 : 10); b.rotation.y = k < 3 ? 0 : Math.PI; }
    for (let k = 0; k < 18; k++) { const s = k % 2 ? 1 : -1; const t = S.tree({ h: 4.5 + hash(k) * 3, seed: k }); t.position.set(s * (HALF + 4 + hash(k + 1) * 30), DY, -25 + hash(k + 3) * 50); }
    { const TG = new THREE.Group(); TG.position.set(TREE[0], DY, TREE[1]); sc.add(TG); K.cyl(0.35, 0.5, 5.2, K.mat('wood', '#6a4a2a'), 0, 0, 0, TG, 12); for (let k = 0; k < 6; k++) K.sphere(1.6 + hash(k) * 0.6, K.mat('grime', ['#3f8a3a', '#4f9a3a', '#5aa84a'][k % 3], { detail: 0.5 }), Math.cos(k * 1.1) * 1.3, 5.2 + (k % 3) * 0.9, Math.sin(k * 1.1) * 1.3, TG); }
    for (let k = 0; k < 8; k++) { const fl = new THREE.Group(); fl.position.set(-HALF - 2 - k * 2.2, DY, (k % 2 ? 1 : -1) * 4.6); G.add(fl); K.cyl(0.04, 0.04, 3.4, K.chrome(), 0, 0, 0, fl, 6); const p = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), K.paint(['#e8302a', '#f2c230', '#2a7ab8', '#3ab86a'][k % 4], { coat: 0 })); p.material.side = THREE.DoubleSide; p.position.set(0.45, 3.0, 0); fl.add(p); }
    for (let k = 0; k < 7; k++) K.sphere(26 + hash(k) * 8, K.mat('grime', ['#5f9a44', '#6aa84f', '#4f8a3a'][k % 3], { detail: 4 }), -90 + k * 32, -14, -80 - hash(k + 2) * 10, G, 1, 0.6, 1);
    S.bake(G);
    // ================= the hero prop: the bouncing deck =================
    const PL = K.mat('wood', '#a8784a', { detail: 0.3 }), STE = K.paint('#c8402a', { rough: 0.35 }), WH = K.paint('#f4f2ee');
    for (let i = 0; i < NSEG; i++) { const g = new THREE.Group(); sc.add(g); const x = -HALF + i + 0.5; g.userData.x = x;
      K.rbox(1.02, 0.18, 5.4, 0.02, PL, 0, -0.09, 0, g); K.rbox(1.02, 0.35, 0.25, 0.03, STE, 0, -0.35, 2.6, g); K.rbox(1.02, 0.35, 0.25, 0.03, STE, 0, -0.35, -2.6, g); K.rbox(0.15, 0.3, 5.4, 0.02, GRY, 0, -0.35, 0, g);
      for (const s of [-1, 1]) { K.cyl(0.04, 0.04, 1.0, WH, 0, 0, s * 2.6, g, 6); K.rbox(1.02, 0.07, 0.07, 0.02, STE, 0, 1.0, s * 2.6, g); K.rbox(1.02, 0.04, 0.04, 0.01, WH, 0, 0.55, s * 2.6, g); }
      if (i % 5 === 2) for (const s of [-1, 1]) { const l = K.sphere(0.1, new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2b0').multiplyScalar(1.6), toneMapped: false }), 0, 1.15, s * 2.6, g); void l; }
      g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); SEGS.push(g);
      if (i % 2 === 0) for (const s of [-1, 1]) { const h = K.cyl(0.03, 0.03, 1, GRY, 0, 0, 0, sc, 5); h.userData = { x, s, top: cy(x) }; HANG.push(h); } }
    // ================= the band =================
    const UNI = [{ jacket: '#c8202a', pants: '#1f2a4a', hat: 'tophat', hatColor: '#1a1a2a', belt: '#f4f2ee', collar: '#f2c230', gloves: '#f4f2ee' }];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const k = r * 4 + c; const o = { ...UNI[0], build: k % 5 === 3 ? 'stout' : undefined, moustache: k % 4 === 1 ? '#3a2418' : undefined, glasses: k % 6 === 2 ? true : undefined, jacket: r === 3 ? '#2a4aa8' : '#c8202a' };
      MUS.push(K.stick(o, { key: 'm' + k })); const kind = r === 0 ? (c < 2 ? 'tuba' : 'trumpet') : r === 1 ? 'drum' : r === 2 ? 'flute' : 'trumpet';
      INS.push({ kind, g: kind === 'tuba' ? tuba(K, sc) : kind === 'drum' ? drum(K, sc) : kind === 'flute' ? flute(K, sc) : trumpet(K, sc) }); }
    ROBOT = K.stick({ jacket: '#b8c0c8', pants: '#8a929a', hat: 'helmet', hatColor: '#d8dee6', glasses: '#36e2ff', belt: '#36e2ff', gloves: '#5a626a', collar: '#36e2ff', boots: '#5a626a' }, { key: 'robot' });
    ANT = new THREE.Group(); sc.add(ANT); K.cyl(0.02, 0.02, 0.4, K.chrome(), 0, 0, 0, ANT, 6); const ab = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3a2a').multiplyScalar(2), toneMapped: false })); ab.position.y = 0.42; ab.userData.ndSkip = true; ANT.add(ab);
    BATON = new THREE.Group(); sc.add(BATON); K.cyl(0.025, 0.025, 1.0, K.chrome(), 0, 0, 0, BATON, 8); K.sphere(0.08, K.gold(), 0, 1.0, 0, BATON);
    DUCK = K.animal('duck', { seed: 9, scale: 1.3 });
    for (const s of [-1, 1]) { const c = K.cyl(0.18, 0.18, 0.02, K.gold(), 0, 0, 0, sc, 22); c.rotation.x = Math.PI / 2; CYM.push(c); }
    // ================= explainer: a swing, then a holo bridge stamped by boots =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4.5, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    for (const s of [-1, 1]) for (const d of [-1, 1]) { const l = K.cyl(0.07, 0.07, 4.4, K.paint('#e8302a'), EX[0] - 4 + d * 1.1, 0, EX[2] + s * 1.2, EG, 8); l.rotation.x = -s * 0.25; l.position.z = EX[2] + s * 0.65; }
    K.rbox(0.15, 0.15, 2.8, 0.04, K.paint('#f2c230'), EX[0] - 4, 4.2, EX[2], EG);
    SWING = new THREE.Group(); SWING.position.set(EX[0] - 4, 4.2, EX[2]); sc.add(SWING); for (const s of [-1, 1]) K.cyl(0.02, 0.02, 3.2, K.chrome(), 0, -3.2, s * 0.4, SWING, 6); K.rbox(0.5, 0.08, 1.0, 0.03, K.paint('#3ab86a'), 0, -3.2, 0, SWING);
    HB = new THREE.Group(); HB.position.set(EX[0] + 3, 2.2, EX[2]); sc.add(HB); HB.userData.segs = [];
    for (let i = 0; i < 12; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 1.6), K.holo('#36e2ff')); HB.add(m); HB.userData.segs.push(m); }
    for (const s of [-1, 1]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3, 0.4), K.holo('#36e2ff')); t.position.set(s * 2.0, -0.5, 0); HB.add(t); }
    for (let i = 0; i < 8; i++) { const b = new THREE.Group(); HB.add(b); K.rbox(0.18, 0.28, 0.12, 0.04, K.paint('#1a1a1e'), 0, 0.14, 0, b); K.rbox(0.28, 0.08, 0.14, 0.03, K.paint('#1a1a1e'), 0.05, 0.04, 0, b); BOOTS.push(b); }
    for (let i = 0; i < 8; i++) { const a = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a3a').multiplyScalar(1.8), toneMapped: false })); a.rotation.x = Math.PI; a.userData.ndSkip = true; HB.add(a); DOWN.push(a); }
    K.addClouds(12, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 962 && f < 1255;
    // ---------- bounce amplitude ----------
    let A = 0;
    if (f < 197) A = 1.4;
    else if (f >= 331 && f < 550) A = 0.02;
    else if (f >= 550 && f < 687) A = f < F.TEN - 4 ? 0.05 : f < F.FORTY - 4 ? lerp(0.05, 0.35, sm(F.TEN - 4, F.TEN + 10, f)) : lerp(0.35, 1.1, sm(F.FORTY - 4, F.FORTY + 12, f));
    else if (f >= 687 && f < 910) A = lerp(1.1, 1.7, sm(687, 760, f));
    else if (f >= 910 && f < 962) A = lerp(1.7, 0.6, sm(910, 958, f));
    else if (f >= 1255) A = 0.0;
    const hum = f >= F.HUMMED - 4 && f < F.TEN ? 0.03 * Math.sin(f * 2.4) : 0;
    SEGS.forEach((g) => { g.visible = !ex; const y = bridgeY(g.userData.x, f, A) + hum * Math.sin(Math.PI * (g.userData.x + HALF) / 40); g.position.set(g.userData.x, y, 0); const dx = 0.5, y2 = bridgeY(g.userData.x + dx, f, A); g.rotation.z = Math.atan2(y2 - bridgeY(g.userData.x - dx, f, A), 2 * dx); });
    HANG.forEach((h) => { const y = bridgeY(h.userData.x, f, A); h.visible = !ex; h.position.set(h.userData.x, (y + 1.0 + h.userData.top) / 2, h.userData.s * 2.85); h.scale.set(1, Math.max(0.05, h.userData.top - y - 1.0), 1); });
    // ---------- band head position (x of the front row) ----------
    let hx = 4, march = true;
    if (f < 197) hx = lerp(2, 5, f / 197);
    else if (f < 331) { hx = -24.5; march = false; }
    else if (f < 550) hx = lerp(-20.5, -10, sm(331, 550, f) * 0.9 + (f - 331) / 219 * 0.1);
    else if (f < 687) hx = lerp(-10, -1, (f - 550) / 137);
    else if (f < 962) hx = lerp(-1, 5, (f - 687) / 275);
    else hx = lerp(-7, 3, (f - 1255) / 148);
    const end = f >= 1255;
    const stepPh = (k) => end ? hash(k) * 6.28 : 0;
    MUS.forEach((m, k) => { const r = Math.floor(k / 4), c = k % 4; let x = hx - r * 1.3, z = -1.8 + c * 1.2, y = bridgeY(x, f, A); let yaw = Math.PI / 2, act = [[0, march ? 'walk' : 'idle', { expr: 'neutral' }]], roll = 0;
      if (f < 197) { const air = Math.max(0, Math.sin((f + 7.5) * 2 * Math.PI / 30)) * A * 0.9; y += air * (r % 2 ? 1 : 0.6); act = [[0, 'scared', { expr: k % 3 ? 'scared' : 'shock' }]]; if (k === 1 && f >= F.UP - 6) { y = bridgeY(x, f, A) + 3.2 * Math.sin(Math.PI * sm(F.UP - 6, 191, f)); act = [[0, 'panic', { expr: 'scared', sweat: true }]]; } }
      else if (f < 331) { act = [[0, 'idle', { expr: f >= F.ROBOT ? 'confused' : 'smile' }]]; yaw = 1.2; }
      else if (f < 550) { act = [[0, 'walk', { expr: 'neutral' }]]; }
      else if (f < 687) { act = [[0, 'walk', { expr: f >= F.FORTY ? 'scared' : f >= F.TEN ? 'nervous' : 'neutral' }]]; y += f >= F.FORTY ? Math.max(0, Math.sin((f + 7.5) * 2 * Math.PI / 30)) * A * 0.5 : 0; }
      else if (f < 962) { act = [[0, f < 810 ? 'walk' : 'panic', { expr: 'scared', sweat: true }]]; y += Math.max(0, Math.sin((f + 7.5) * 2 * Math.PI / 30)) * A * 0.6 * (0.6 + hash(k) * 0.6);
        const flung = (r === 1 && (c === 0 || c === 3)) ? 'river' : (r === 2 && (c === 0 || c === 3)) ? 'tree' : null;
        if (flung === 'river' && f >= F.DRUMMERS - 6) { const u = clamp((f - F.DRUMMERS + 6) / 34, 0, 1); x = x + u * 2; z = z + (c ? 1 : -1) * u * 7; y = y + 6 * u * (1 - u) * 2 - u * u * (y - 0.1); if (u >= 1) y = 0.05 - 0.6; roll = u * 6; act = [[0, 'fall', { expr: 'scared' }]]; }
        if (flung === 'tree' && f >= F.FLUTES - 6) { const u = clamp((f - F.FLUTES + 6) / 30, 0, 1); const tx = TREE[0] + (c ? 0.6 : -0.6), tz = TREE[1] + (c ? 0.3 : -0.3); x = lerp(x, tx, u); z = lerp(z, tz, u); y = lerp(y, DY + 8.3, u) + 5 * u * (1 - u); roll = u < 1 ? u * 5 : 0; act = [[0, u < 1 ? 'fall' : 'scared', { expr: 'shock' }]]; } }
      else if (end) { act = [[0, 'walk', { expr: 'laugh' }]]; yaw = Math.PI / 2 + 0.25 * Math.sin(f * 0.21 + k * 1.7); y += 0.04 * Math.sin(f * 0.4 + k * 2.3); }
      const A2 = T.act(f + stepPh(k) * 5, act, { seed: 30 + k, blink: blink(30 + k) });
      m.set(A2, { x, y, z, yaw, visible: !ex }); m.root.rotation.z = roll;
      const I = INS[k].g; I.visible = !ex; const hx2 = x + 0.38 * Math.sin(yaw), hz = z + 0.38 * Math.cos(yaw);
      if (INS[k].kind === 'tuba') { const ty = k === 1 && f >= F.UP - 6 && f < 197 ? y + 1.2 + 5.0 * Math.sin(Math.PI * sm(F.UP - 2, 191, f)) : y + 1.35; I.position.set(hx2, ty, hz); I.rotation.set(0, yaw, k === 1 && f < 197 ? f * 0.2 : 0); }
      else if (INS[k].kind === 'drum') I.position.set(hx2, y + 0.95, hz);
      else if (INS[k].kind === 'flute') { I.position.set(x + 0.3 * Math.sin(yaw), y + 1.75, z + 0.3 * Math.cos(yaw)); I.rotation.set(0, yaw, 0); }
      else { I.position.set(hx2, y + 1.6, hz); I.rotation.set(0, yaw - Math.PI / 2, 0); } });
    // ---------- Metro-Nine ----------
    let rp = { x: hx + 1.8, z: 0, yaw: Math.PI / 2 };
    if (f >= 197 && f < 331) rp = { x: -22.2, z: 0, yaw: -1.3 };
    if (end) rp = { x: hx - 5.6, z: 0, yaw: Math.PI / 2 };
    const ry = bridgeY(rp.x, f, A) + (f < 197 ? Math.max(0, Math.sin((f + 7.5) * 2 * Math.PI / 30)) * A * 0.7 : 0);
    const rk = [[0, 'scared', { expr: 'shock' }], [197, 'hips', { expr: 'proud' }], [F.ROBOT, 'pointUp', { expr: 'proud' }], [F.PERFECT, 'salute', { expr: 'deadpan' }], [331, 'walk', { expr: 'deadpan', talk: true }],
      [550, 'walk', { expr: 'deadpan', talk: true }], [F.JELLY, 'walk', { expr: 'confused' }], [687, 'walk', { expr: 'stern', talk: true }], [810, 'shock', { expr: 'shock' }], [910, 'think', { expr: 'confused' }], [F.WHY, 'shrug', { expr: 'confused' }],
      [1255, 'walk', { expr: 'sad', R: [0.6, 0.2, 'open'], L: [0.6, 0.2, 'open'] }], [F.WADDLE, 'shrug', { expr: 'pained' }]];
    ROBOT.set(T.act(f, rk, { seed: 3, blink: blink(3) }), { ...rp, y: ry, visible: !ex });
    ANT.visible = BATON.visible = !ex; ANT.position.set(rp.x, ry + 2.35, rp.z); BATON.position.set(rp.x + 0.35 * Math.sin(rp.yaw) + 0.35 * Math.cos(rp.yaw), ry + 1.5, rp.z + 0.35 * Math.cos(rp.yaw)); BATON.rotation.set(0, 0, end ? 1.2 : -0.3 + 0.3 * Math.sin(f * 0.4));
    // ---------- Major the duck ----------
    let dp = { x: hx - 5.6, z: 0, yaw: Math.PI / 2, mode: 'walk', expr: 'sad' };
    if (f >= 197 && f < 331) dp = { x: -26, z: 2.4, yaw: 1.0, mode: 'stand', expr: f >= F.METRO ? 'angry' : 'neutral' };
    if (f >= 428 && f < 550) dp = { x: hx - 5.6, z: 0, yaw: Math.PI / 2, mode: 'walk', expr: 'sad' };
    if (f < 197) dp = { x: hx - 5.6, z: 0, yaw: Math.PI / 2 + 0.4 * Math.sin(f * 0.3), mode: 'jump', expr: 'shock', flap: true };
    if (end) dp = { x: hx + 1.8, z: 0, yaw: Math.PI / 2 + 0.3 * Math.sin(f * 0.25), mode: 'walk', expr: 'happy', speed: 1.4 };
    const dyy = bridgeY(dp.x, f, A) + (f < 197 ? Math.max(0, Math.sin((f + 7.5) * 2 * Math.PI / 30)) * A * 0.8 : 0) + (end ? 0.06 * Math.abs(Math.sin(f * 0.25)) : 0);
    if (ex) { const sa = SWING.rotation.z; dp = { x: EX[0] - 4 + Math.sin(sa) * 3.2, z: EX[2], yaw: Math.PI / 2, mode: 'sit', expr: 'happy', flap: Math.abs(sa) > 0.5 }; }
    DUCK.set(f, { ...dp, y: ex ? 4.2 - Math.cos(SWING.rotation.z) * 3.2 + 0.05 : dyy, visible: !(f >= 1145 && f < 1255) });
    const cymOn = !ex && !end && f >= 197; const ccl = Math.abs(Math.sin(f * 0.2)) * 0.18; CYM.forEach((c, k) => { c.visible = cymOn; c.position.set(dp.x + 0.2, dyy + 0.55, dp.z + (k ? 1 : -1) * (0.32 + ccl)); c.rotation.set(Math.PI / 2, 0, 0); });
    // ---------- explainer ----------
    let amp = 0; if (ex) { const pushes = [F.PUSH, F.RIGHT, F.AGAIN, F.AGAIN + 16, F.HIGHER2]; amp = 0.15 + pushes.filter((p) => f >= p).length * 0.14; }
    SWING.visible = ex && f < 1145; SWING.rotation.z = amp * Math.sin((f - 962) * 2 * Math.PI / 34);
    HB.visible = ex && f >= 1139; const bA = f >= 1145 ? 0.08 + 0.6 * sm(F.HUNDRED, F.EVERY + 20, f) : 0; const ph = (f - 1145) * 2 * Math.PI / 30;
    HB.userData.segs.forEach((m, i) => { const x = -2.2 + i * 0.4; m.position.set(x, -bA * Math.sin(Math.PI * (i + 0.5) / 12) * Math.max(0, Math.sin(ph)), 0); });
    BOOTS.forEach((b, i) => { const x = -1.8 + i * 0.5; b.position.set(x, 0.12 + 0.45 * Math.max(0, Math.cos(ph)) - bA * Math.sin(Math.PI * (x + 2.4) / 4.8) * Math.max(0, Math.sin(ph)), (i % 2 ? 0.3 : -0.3)); });
    DOWN.forEach((d, i) => { const x = -1.8 + i * 0.5; d.visible = HB.visible && Math.sin(ph) > 0.3; d.position.set(x, 0.85, 0); });
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const bandBox = (y0 = DY) => [[hx - 5.6 - 0.5, y0 - 0.5, -2.3], [hx + 2.2, y0 + 3.2, 2.3]];
    if (sh(0, 60)) {                          // 1. hook: the whole bridge bouncing like a trampoline, band airborne (wide from the riverbank)
      cam = K.fit([...bandBox(DY), [hx + 1, DY + 6, 0], [hx + 6, DY - 1, 0]], { yaw: 35, pitch: 5, fov: 46, margin: 0.75, maxDist: 12 }); cam.fov *= K.punch(f, F.TRAMP, 0.1, 6);
    } else if (sh(60, 119)) {                 // 2. ... like a trampoline (wide on the band bouncing)
      cam = K.fit([...bandBox(DY), [hx, DY + 5, 0]], { yaw: 40, pitch: 6, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(119, 197)) {                // 3. the tuba player went up first; his tuba higher (wide on the front row)
      cam = K.fit([[hx - 1, DY, -2], [hx + 0.5, DY + 7.5, 1], [hx - 2.6, DY, 1]], { yaw: 55, pitch: 2, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.HIGHER, 0.12, 6);
    } else if (sh(197, 262)) {                // 4. the new leader: Metro-Nine (full shot on the west bank, band lined up)
      cam = K.fit([[-22.2, DY, 0], [-22.2, DY + 2.6, 0], ...bandBox(DY), [-26, DY, 2.4]], { yaw: 40, pitch: 6, fov: 42, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.METRO, 0.08, 6);
    } else if (sh(262, 331)) {                // 5. a robot drum major built for perfect time (reaction close)
      cam = { pos: [rp.x - 2.4, DY + 1.9, rp.z + 1.6], look: [rp.x, DY + 1.7, rp.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 2.8, cinf: 12 }; cam.fov *= K.punch(f, F.PERFECT, 0.08, 6);
    } else if (sh(331, 380)) {                // 6. "Left! Right! Left!" onto the bridge (tracking wide, front quarter)
      const tc = K.track(f, (g) => [lerp(-20.5, -10, sm(331, 550, g) * 0.9 + (g - 331) / 219 * 0.1) - 2.5, DY, 0], { off: [7, 2.4, 6.5], lag: 5, lookY: 1.4 }); cam = { ...tc, fov: 48 };
    } else if (sh(380, 428)) {                // 7. every boot at the exact same moment (low along the deck at boot height)
      cam = { pos: [hx + 3.2, DY + 0.45, 2.0], look: [hx - 2.5, DY + 0.6, -0.3], fov: 50 }; dof = { focus: 4.5, cinf: 6 }; cam.fov *= K.punch(f, F.SAME, 0.08, 6);
    } else if (sh(428, 490)) {                // 8. Major the duck, demoted to cymbals (full shot at the back of the band)
      cam = K.fit([[dp.x - 1, DY, -1], [dp.x + 1, DY + 1.4, 1], [dp.x + 1.3, DY + 2.4, 0]], { yaw: 55, pitch: 6, fov: 40, margin: 1.0, maxDist: 6 }); cam.fov *= K.punch(f, F.NINE, 0.08, 6);
    } else if (sh(490, 550)) {                // 9. ... cymbals (duck reaction close)
      cam = { pos: [dp.x + 1.6, DY + 0.9, dp.z + 2.0], look: [dp.x, DY + 0.6, dp.z], fov: 44 * K.push(u, 0.06) }; dof = { focus: 2.4, cinf: 12 }; cam.fov *= K.punch(f, F.CYMB, 0.1, 6);
    } else if (sh(550, 600)) {                // 10. step one, the bridge hummed (wide from below the deck)
      cam = K.fit([[-HALF, DY - 1, 0], [HALF * 0.3, DY + 3, 0], ...bandBox(DY)], { yaw: 110, pitch: -8, fov: 46, margin: 0.8, maxDist: 20 }); cam.fov *= K.punch(f, F.HUMMED, 0.06, 6);
    } else if (sh(600, 640)) {                // 11. step ten, it wobbled (wide on the band)
      cam = K.fit([...bandBox(DY), [hx + 4, DY, 0]], { yaw: 60, pitch: 8, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.WOBBLED, 0.08, 6);
    } else if (sh(640, 687)) {                // 12. step forty, it bounced like jelly (wide full bridge)
      cam = K.fit([[-HALF, DY - 2, 0], [HALF, DY + 4, 0]], { yaw: 80, pitch: 4, fov: 46, margin: 0.8, maxDist: 26 }); cam.fov *= K.punch(f, F.JELLY, 0.12, 6); const s = K.shake(f, F.JELLY, 0.1, 16); cam.pos[1] += s[1];
    } else if (sh(687, 750)) {                // 13. the robot marches even more perfectly (front quarter, robot leading)
      cam = K.fit([[rp.x, ry, 0], [rp.x, ry + 2.6, 0], ...bandBox(DY)], { yaw: 25, pitch: 6, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.MORE, 0.08, 6);
    } else if (sh(750, 810)) {                // 14. "Left! Right! Left!" (robot reaction close)
      cam = { pos: [rp.x + 2.4, ry + 1.9, rp.z + 1.4], look: [rp.x, ry + 1.7, rp.z], fov: 44 }; dof = { focus: 2.9, cinf: 12 }; cam.fov *= K.punch(f, F.LEFT2, 0.08, 6);
    } else if (sh(810, 860)) {                // 15. drummers into the river (wide, splash below)
      cam = K.fit([...bandBox(DY), [hx - 1, 0, 8], [hx - 1, 0, -8]], { yaw: 75, pitch: 10, fov: 48, margin: 0.8, maxDist: 20 }); cam.fov *= K.punch(f, F.RIVER, 0.1, 6);
    } else if (sh(860, 910)) {                // 16. flutes into a tree (wide on the east bank tree)
      cam = K.fit([[TREE[0] - 3, DY + 1, TREE[1]], [TREE[0] + 3, DY + 10.5, TREE[1]], [TREE[0] - 6, DY + 6, 0]], { yaw: 100, pitch: 6, fov: 46, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.TREE, 0.12, 6);
    } else if (sh(910, 962)) {                // 17. So why would marching shake a steel bridge? (robot reaction, bridge settling)
      cam = { pos: [rp.x + 2.6, ry + 1.8, rp.z + 1.6], look: [rp.x, ry + 1.6, rp.z], fov: 44 }; dof = { focus: 3.1, cinf: 12 };
    } else if (sh(962, 1036)) {               // 18. every bridge has its own bounce, like a swing (wide: the swing set, Major on the swing)
      cam = K.fit([[EX[0] - 6.5, 0.6, EX[2] - 1.2], [EX[0] - 1.5, 4.6, EX[2] + 1.2]], { yaw: 90, pitch: 6, fov: 44, margin: 0.85, maxDist: 8 }); cam.fov *= K.punch(f, F.SWING, 0.1, 6);
    } else if (sh(1036, 1090)) {              // 19. push it at the right moment (side wide, push arrows)
      cam = K.fit([[EX[0] - 6.5, 0.6, EX[2] - 1.2], [EX[0] - 1.5, 4.6, EX[2] + 1.2]], { yaw: 60, pitch: 4, fov: 44, margin: 0.85, maxDist: 8 }); cam.fov *= K.punch(f, F.RIGHT, 0.08, 6);
    } else if (sh(1090, 1145)) {              // 20. again and again, and it goes higher (front wide)
      cam = K.fit([[EX[0] - 6.5, 0.6, EX[2] - 1.2], [EX[0] - 1.5, 4.6, EX[2] + 1.2]], { yaw: 115, pitch: 8, fov: 44, margin: 0.85, maxDist: 8 }); cam.fov *= K.punch(f, F.HIGHER2, 0.12, 6);
    } else if (sh(1145, 1200)) {              // 21. a hundred boots in perfect time (x-ray bridge, boots stamping)
      cam = K.fit([[EX[0] + 0.5, 0.5, EX[2] - 1], [EX[0] + 5.5, 3.6, EX[2] + 1]], { yaw: 80, pitch: 8, fov: 42, margin: 0.85, maxDist: 10 }); cam.fov *= K.punch(f, F.BOOTS, 0.08, 6);
    } else if (sh(1200, 1255)) {              // 22. ... push the bridge at that moment, every step (closer, deck bending)
      cam = K.fit([[EX[0] + 0.5, 0.5, EX[2] - 1], [EX[0] + 5.5, 3.6, EX[2] + 1]], { yaw: 50, pitch: 4, fov: 42, margin: 0.8, maxDist: 9 }); cam.fov *= K.punch(f, F.EVERY, 0.1, 6);
    } else if (sh(1255, 1320)) {              // 23. now Major leads again (front quarter wide: duck waddling in front)
      cam = K.fit([[dp.x, DY, 0], [dp.x, DY + 1.2, 0], ...bandBox(DY), [rp.x, DY + 2.4, 0]], { yaw: 30, pitch: 6, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.LEADS, 0.08, 6);
    } else {                                  // 24. nobody can march in step behind a waddle (wide pull-back on the whole bridge, calm)
      cam = K.fit([[dp.x, DY, 0], [dp.x, DY + 1.2, 0], ...bandBox(DY), [rp.x, DY + 2.4, 0], [hx + 8, DY, 0]], { yaw: lerp(50, 62, u), pitch: 8, fov: 46, margin: 0.8, maxDist: 16 }); cam.fov *= K.punch(f, F.WADDLE, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f >= F.DRUMMERS + 26 && f < F.DRUMMERS + 60) for (const s of [-1, 1]) K.sparks(f, F.DRUMMERS + 26, F.DRUMMERS + 40, [hx - 1.3 + 2, 0.2, (s < 0 ? -1.8 : 1.8) + s * 7], { dir: [0, 1, 0], spread: 0.8, rate: 40, speed: 5, life: 18, color: '#bfe8ff', seed: s > 0 ? 3 : 5 });
    if (f >= F.FLUTES + 22 && f < F.FLUTES + 40) K.leaves(f, [TREE[0], DY + 5, TREE[1]], { area: 4, count: 30, fall: 1.0, colors: ['#4f9a3a', '#6ab84a'] });
    else K.leaves(f, cam.look, { area: 12, count: 8, fall: 0.4, colors: ['#e8302a', '#f2c230', '#2a7ab8'] });
    if (A > 0.3 && !ex && f % 6 === 0) K.puff(f, f, 0, 0, 3, 0.6, '#d8c8a8');
    K.mist(f, 189, 16); K.mist(f, 954, 16); K.mist(f, 1247, 16);
    K.badge(f, F.BOUNCE, '100 MUSICIANS', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 116 });
    K.badge(f, F.HIGHER, 'TUBA: HIGHER', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 194 });
    K.badge(f, F.METRO, 'METRO-NINE', { sx: 0.5, sy: 0.2 }, { icon: 'bolt', f1: 328 });
    K.badge(f, F.SAME, 'PERFECT STEP', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 425 });
    K.badge(f, F.DEMOTED, 'DEMOTED: CYMBALS', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 547 });
    if (f >= 550 && f < 687) K.hud(f, 552, { stages: 3, labels: ['STEP 1', 'STEP 10', 'STEP 40'], u: f < F.TEN ? 0.12 : f < F.FORTY ? 0.5 : 0.95, f1: 685 });
    for (const [t, w, nx] of [[F.HUMMED, 'HUM', F.TEN], [F.WOBBLED, 'WOBBLE', F.FORTY], [F.JELLY, 'JELLY!', 685]]) K.badge(f, t, w, { sx: 0.5, sy: 0.3 }, { icon: 'warn', f1: nx - 2 });
    K.badge(f, F.RIVER, 'DRUMS: RIVER', { sx: 0.5, sy: 0.2 }, { icon: 'drop', f1: F.FLUTES - 2 });
    K.badge(f, F.TREE, 'FLUTES: TREE', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 906 });
    K.badge(f, F.OWN, 'EVERY BRIDGE: OWN BOUNCE', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1033 });
    K.badge(f, F.RIGHT, 'PUSH AT THE RIGHT MOMENT', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 1142 });
    K.badge(f, F.BOOTS, 'ALL BOOTS = ONE PUSH', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 1252 });
    K.badge(f, F.WADDLE, 'WADDLE = SAFE', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1401 });
    const L = K.light('day', { az: 115, el: 38, shadowExt: 30, exposure: 1.25 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
