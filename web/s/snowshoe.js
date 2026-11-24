// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Snowshoes Look Like Tennis Rackets" — invented story, engine: The Bet (SCRIPTS.md §000).
// Barry bets Tess a carrot cake he'll beat her across Fluff Meadow to the cocoa hut. He sinks to his hat, tunnels, pogos
// and ends up stuck like a carrot in a snowman. Tess strolls across on giant rackets. Pressure explainer (finger in pudding,
// spread-out arrows). Clover the rabbit — born with snowshoe feet — reaches the hut first and eats the cake. "Easy peasy."
import { TOTAL, LINES, wf } from './snowshoe_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const fitT = (K, pts, o = {}) => { const W = 1080, H = 1920, fov = o.fov ?? 42, m = o.margin ?? 1.2, rx = (d) => d * Math.PI / 180;
  const vf = Math.tan(rx(fov) / 2), hf = vf * W / H, a = rx(o.yaw ?? 90), pt = rx(o.pitch ?? 8);
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (const p of pts) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
  const c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2 + (o.lift || 0), (mn[2] + mx[2]) / 2];
  const fw = [-Math.cos(a) * Math.cos(pt), -Math.sin(pt), -Math.sin(a) * Math.cos(pt)];
  const rt = [-fw[2], 0, fw[0]]; const rl = Math.hypot(rt[0], rt[2]); rt[0] /= rl; rt[2] /= rl;
  const up = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
  let d = 2; for (const p of pts) { const v = [p[0] - c[0], p[1] - c[1], p[2] - c[2]]; const x = v[0] * rt[0] + v[2] * rt[2], y = v[0] * up[0] + v[1] * up[1] + v[2] * up[2], z = v[0] * fw[0] + v[1] * fw[1] + v[2] * fw[2];
    d = Math.max(d, Math.abs(x) * m / hf - z, Math.abs(y) * m / vf - z); }
  d = Math.min(d, o.maxDist ?? 30);
  return { pos: [c[0] - fw[0] * d, c[1] - fw[1] * d, c[2] - fw[2] * d], look: c, fov }; };
const EX = 60;                    // explainer stage on the far meadow
let THREE, F = {}, BARRY, TESS, CLOVER, RK = [], POGO, RIM, MOUNDS = [], CAKE, BIGARROWS = [], SMALLARROWS = [], SNOWBOX, PUD, FINGER, FOOTGLOW = [], SNOWMAN, EXTRAS = [];

function racket(K) { const g = new THREE.Group(); K.scene.add(g); const fr = K.paint('#c0392b', { rough: 0.3 }), gold = K.gold(), str = K.paint('#f4efe4', { rough: 0.5 });
  const t = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 10, 40), fr); t.scale.set(0.7, 1.35, 1); g.add(t);
  const tr = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 40), gold); tr.scale.set(0.74, 1.39, 1); tr.position.z = 0.02; g.add(tr);
  for (let k = -5; k <= 5; k++) { const x = k * 0.04; const h = 2 * 0.46 * Math.sqrt(Math.max(0, 1 - (x / 0.24) ** 2)); if (h > 0.02) K.rbox(0.008, h, 0.008, 0.002, str, x, 0, 0, g); }
  for (let k = -10; k <= 10; k++) { const y = k * 0.044; const w = 2 * 0.24 * Math.sqrt(Math.max(0, 1 - (y / 0.46) ** 2)); if (w > 0.02) K.rbox(w, 0.008, 0.008, 0.002, str, 0, y, 0, g); }
  K.rbox(0.2, 0.12, 0.06, 0.02, K.paint('#2a2a30', { rough: 0.5 }), 0, 0.05, 0.03, g); K.rbox(0.05, 0.25, 0.05, 0.02, gold, 0, -0.6, 0, g);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }
function pine(K, x, z, h, parent) { const gm = K.mat('grime', '#2a5a3a', { amt: 0.4 }), sn = K.mat('grime', '#f4f6fa', { amt: 0.15 });
  K.cyl(0.12, 0.16, h * 0.25, K.mat('wood', '#5a3a24'), x, 0, z, parent, 8);
  for (let k = 0; k < 3; k++) { const r = h * (0.36 - k * 0.09), y = h * (0.2 + k * 0.22); const c = K.add(new THREE.ConeGeometry(r, h * 0.38, 10), gm, x, y + h * 0.19, z, parent); const s = K.add(new THREE.ConeGeometry(r * 0.75, h * 0.16, 10), sn, x, y + h * 0.32, z, parent); } }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { HAT: wf(0, 'hat'), BET: wf(1, 'bet'), CAKE: wf(1, 'carrot'), HUT: wf(1, 'cocoa'), STRAP: wf(2, 'strapped'), RACK: wf(2, 'tennis'), WHY: wf(2, 'why'), CLIMB: wf(3, 'climbed'), EASY: wf(3, 'easy'), FASTER: wf(3, 'faster'),
      RAN: wf(4, 'ran'), TUNNEL: wf(4, 'tunnel'), POPPED: wf(4, 'popped'), CLOVER: wf(4, 'clover'), WANT: wf(5, 'wanted'), CAKE2: wf(5, 'carrot'), EASY2: wf(6, 'easy'), POGO: wf(6, 'pogo'), BOUNCE: wf(6, 'bounce'), STUCK: wf(6, 'stuck'), SNOWMAN: wf(6, 'snowman'),
      SNIFF: wf(7, 'sniffed'), HOPE: wf(7, 'hopefully'), STROLL: wf(8, 'strolled'), SIDEWALK: wf(8, 'sidewalk'), TRICK: wf(8, 'trick'), PUSHED: wf(9, 'pushed'), TINY: wf(9, 'tiny'), FINGER: wf(9, 'finger'), PUDDING: wf(9, 'pudding'),
      SPREAD: wf(10, 'spread'), HUGE: wf(10, 'huge'), PATCH: wf(10, 'patch'), LITTLE: wf(10, 'little'), BORN: wf(11, 'born'), FEET: wf(11, 'feet'), REACHED: wf(12, 'reached'), ATE: wf(12, 'ate'), EASY3: wf(12, 'easy') };
    // ================= Fluff Meadow =================
    const G = K.group();
    const ground = new THREE.PlaneGeometry(300, 200, 120, 80); ground.rotateX(-Math.PI / 2); const GP = ground.attributes.position;
    for (let i = 0; i < GP.count; i++) { const x = GP.getX(i), z = GP.getZ(i); GP.setY(i, 0.12 * Math.sin(x * 0.3) * Math.cos(z * 0.4) * (Math.abs(z) > 3 ? 1 : 0.2) + (z < -18 ? Math.min(14, (-18 - z) * 0.35) * (0.6 + 0.4 * Math.sin(x * 0.04)) : 0)); }
    ground.computeVertexNormals(); K.add(ground, K.mat('grime', '#f2f5fa', { amt: 0.12, detail: 1.5 }), 0, 0, 0, G);
    for (let k = 0; k < 70; k++) { const x = -30 + hash(k) * 100, z = hash(k + 1) > 0.35 ? -(5 + hash(k + 2) * 12) : 24 + hash(k + 2) * 10; pine(K, x, z, 3 + hash(k + 3) * 3.5, G); }
    for (let k = 0; k < 30; k++) K.sphere(1, K.mat('grime', '#eef2f8', { amt: 0.1 }), -25 + hash(k + 50) * 90, -0.4, (hash(k + 51) > 0.5 ? 18 + hash(k + 52) * 6 : -(3.5 + hash(k + 52) * 6)), G, 1.5 + hash(k) * 2, 0.7, 1.2);
    // start line + bet board, flags, footpath posts
    for (let z = -2.5; z <= 2.5; z += 0.5) K.slab(-10.6, -10.4, 0.0, 0.03, z - 0.2, z + 0.2, K.paint(Math.round(z * 2) % 2 ? '#e8302a' : '#1f3a6a', { rough: 0.5 }), G, false);
    const bb = S.board('THE BET|1 CARROT CAKE', 2.2, 1.1, { frame: '#e8302a' }); bb.position.set(-12.5, 0, -2.6); bb.rotation.y = 0.4;
    const sb = S.board('FLUFF MEADOW|COCOA HUT 300 M', 2.2, 1.1, { frame: '#1f6a4a', bg: '#1f6a4a', fg: '#ffffff' }); sb.position.set(-12.8, 0, 2.8); sb.rotation.y = 0.9;
    for (let x = -10; x < 16; x += 3) { K.cyl(0.04, 0.04, 1.2, K.paint('#e8302a'), x, 0, -2.4, G, 6); K.rbox(0.3, 0.2, 0.02, 0.01, K.paint('#f2c230'), x + 0.15, 1.1, -2.4, G); }
    // the cocoa hut (+ cake table, mugs, sled, firewood)
    const hut = S.building({ w: 6, d: 5, floors: 1, seed: 12, color: '#8a5a3a', kind: 'brick', gable: 'pitched', shop: 'COCOA HUT', awning: ['#c0392b', '#f4efe4'], shutters: '#1f6a4a', flowers: false }); hut.position.set(16, 0, -4.5);
    K.rbox(1.8, 0.08, 1.0, 0.03, K.mat('wood', '#a8703a'), 14.6, 0.85, -1.2, G); for (const [dx, dz] of [[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]]) K.cyl(0.04, 0.04, 0.85, K.mat('wood', '#7a5234'), 14.6 + dx, 0, -1.2 + dz, G, 6);
    for (let k = 0; k < 3; k++) { K.cyl(0.07, 0.06, 0.14, K.paint(['#e8302a', '#f2c230', '#2a8ae8'][k], { rough: 0.3 }), 15.2 + k * 0.16, 0.89, -1.4, G, 14); }
    for (let k = 0; k < 8; k++) K.cyl(0.09, 0.09, 1.2, K.mat('wood', '#8a5a34'), 18.6, 0.1 + (k % 4) * 0.18, -2.0 + Math.floor(k / 4) * 0.2, G, 8).rotation.x = Math.PI / 2;
    K.rbox(1.4, 0.12, 0.6, 0.05, K.paint('#c0392b'), 12.6, 0.25, -2.8, G);
    S.bake(G);
    CAKE = new THREE.Group(); CAKE.position.set(14.4, 0.89, -1.15); sc.add(CAKE); K.cyl(0.32, 0.32, 0.03, K.chrome(), 0, 0, 0, CAKE, 24);
    K.cyl(0.26, 0.26, 0.28, K.paint('#d8904a', { rough: 0.5 }), 0, 0.03, 0, CAKE, 28); K.cyl(0.27, 0.27, 0.06, K.paint('#f8f2e4', { rough: 0.2 }), 0, 0.3, 0, CAKE, 28);
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const c = K.add(new THREE.ConeGeometry(0.03, 0.12, 8), K.paint('#f07a20', { rough: 0.3 }), Math.cos(a) * 0.18, 0.39, Math.sin(a) * 0.18, CAKE); c.rotation.z = Math.PI / 2; c.rotation.y = a; }
    SNOWMAN = new THREE.Group(); SNOWMAN.position.set(-1.6, 0, 1.2); sc.add(SNOWMAN); const sn = K.mat('grime', '#f6f8fc', { amt: 0.1 });
    K.sphere(0.55, sn, 0, 0.5, 0, SNOWMAN); K.sphere(0.4, sn, 0, 1.25, 0, SNOWMAN); K.sphere(0.28, sn, 0, 1.82, 0, SNOWMAN); const nose = K.add(new THREE.ConeGeometry(0.06, 0.32, 10), K.paint('#f07a20', { rough: 0.3 }), 0, 1.82, 0.4, SNOWMAN); nose.rotation.x = Math.PI / 2;
    for (const s of [-1, 1]) K.sphere(0.04, K.paint('#1a1a1a'), s * 0.1, 1.9, 0.25, SNOWMAN); K.cyl(0.2, 0.2, 0.3, K.paint('#1a1a1a'), 0, 2.02, 0, SNOWMAN, 16); K.cyl(0.03, 0.03, 0.8, K.mat('wood', '#5a3a24'), 0.5, 1.2, 0, SNOWMAN, 6).rotation.z = 1.0;
    SNOWMAN.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    // rackets (hero prop) + pogo stick + sink rim + tunnel mounds
    for (let k = 0; k < 2; k++) RK.push(racket(K));
    POGO = new THREE.Group(); sc.add(POGO); K.cyl(0.03, 0.03, 1.2, K.chrome(), 0, 0, 0, POGO, 10); K.rbox(0.5, 0.05, 0.12, 0.02, K.paint('#2a8ae8'), 0, 0.25, 0, POGO); K.rbox(0.5, 0.05, 0.05, 0.02, K.paint('#1a1a1a'), 0, 1.15, 0, POGO);
    const spr = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 16), K.chrome()); spr.rotation.x = Math.PI / 2; spr.position.y = 0.1; POGO.add(spr);
    RIM = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.16, 10, 24), K.mat('grime', '#e8eef6', { amt: 0.15 })); RIM.rotation.x = Math.PI / 2; sc.add(RIM);
    for (let k = 0; k < 26; k++) { const m = K.sphere(0.5, K.mat('grime', '#eef2f8', { amt: 0.12 }), 0, 0, 0, sc, 1.4, 0.6, 1.1); MOUNDS.push(m); }
    // explainer stage: x-ray snow block, big vs small arrows, pudding + finger, glowing rabbit feet
    SNOWBOX = K.holoBox(7, 1.2, 3, EX, -0.6, 0, sc, '#36e2ff');
    const arr = (len, r, col) => { const g = new THREE.Group(); sc.add(g); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(1.8), toneMapped: false }); const s1 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10), m); s1.position.y = len / 2 + r * 2; g.add(s1); const h1 = new THREE.Mesh(new THREE.ConeGeometry(r * 2.6, r * 5, 12), m); h1.rotation.x = Math.PI; h1.position.y = r * 2; g.add(h1); g.traverse((o) => { o.userData.ndSkip = true; }); return g; };
    for (const dx of [-0.18, 0.18]) { const a = arr(1.4, 0.07, '#ff4a2a'); a.position.set(EX - 1.8 + dx, 0, 0); BIGARROWS.push(a); }
    for (let k = 0; k < 8; k++) { const a = arr(0.4, 0.025, '#7af8a0'); a.position.set(EX + 1.5 + (k % 2 ? 0.25 : -0.25) + (k % 4 < 2 ? -0.05 : 0.05), 0, -0.45 + Math.floor(k / 2) * 0.3); SMALLARROWS.push(a); }
    PUD = new THREE.Group(); PUD.position.set(EX + 6, 0, 2); sc.add(PUD); const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.7, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), K.paint('#f4efe4', { rough: 0.2 })); bowl.position.y = 0.7; PUD.add(bowl);
    const pd = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.05, 28), K.paint('#8a4a2a', { rough: 0.25 })); pd.position.y = 0.62; PUD.add(pd);
    FINGER = new THREE.Group(); PUD.add(FINGER); K.cyl(0.09, 0.09, 0.9, K.paint('#f6c8a0', { rough: 0.5 }), 0, 0, 0, FINGER, 16); K.sphere(0.09, K.paint('#f6c8a0', { rough: 0.5 }), 0, 0, 0, FINGER); K.rbox(0.1, 0.03, 0.08, 0.02, K.paint('#f8e8e0'), 0, 0.05, 0.06, FINGER);
    for (let k = 0; k < 2; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7af8a0').multiplyScalar(1.8), toneMapped: false })); r.rotation.x = Math.PI / 2; r.scale.set(1, 1.8, 1); r.userData.ndSkip = true; sc.add(r); FOOTGLOW.push(r); }
    // ================= characters =================
    BARRY = K.stick({ jacket: '#f07a20', pants: '#3a5a2a', hat: 'beanie', hatColor: '#2a8a3a', moustache: '#6a3a1a', scarf: '#2a8a3a', gloves: '#2a8a3a', build: 'stout', belt: '#3a2418', boots: '#1a1a1a' }, { key: 'barry' });
    TESS = K.stick({ jacket: '#2a6ac8', pants: '#2a2a40', hairStyle: 'ponytail', hair: '#c8402a', scarf: '#f2c230', gloves: '#e8302a', vest: '#f4efe4', glasses: true, boots: '#5a3a24' }, { key: 'tess' });
    CLOVER = K.animal('rabbit', { color: '#c8b49a', belly: '#f6f0e6', seed: 4, scale: 1.25 });
    K.addClouds(8, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 822 && f < 1084;
    // ---------- Barry ----------
    let bp = { x: -9, z: 0, yaw: 0.3, y: 0 }, upside = false, pogo = null;
    if (f < 105) bp.y = -lerp(0.7, 1.55, sm(0, F.HAT, f));
    else if (f < 314) bp.y = -1.55;
    else if (f < 386) bp.y = -lerp(1.55, 0, sm(F.CLIMB - 4, F.CLIMB + 20, f));
    else if (f < 470) { bp.y = -2.4; bp.x = lerp(-9, 0, sm(F.RAN, 470, f)); }
    else if (f < 557) { bp = { x: 0, z: 0, yaw: 0.2, y: -lerp(2.0, 0, sm(F.POPPED - 2, F.POPPED + 8, f)) }; }
    else if (f < 610) { const b = sm(F.BOUNCE - 4, F.BOUNCE + 8, f); bp = { x: lerp(-0.6, -0.9, b), z: 1.6, yaw: 0.4, y: 0.3 + Math.sin(Math.PI * clamp((f - F.BOUNCE + 4) / 16, 0, 1)) * 1.6 }; pogo = true; }
    else if (f < 822 || f >= 1084) { bp = { x: -0.9, z: 1.6, yaw: 0.4, y: 1.15 }; upside = true; }
    if (ex) bp = { x: EX - 1.8, z: 0, yaw: 0.3, y: -0.5 * sm(F.PUSHED - 4, F.TINY, f) };
    const bk = [[0, 'panic', { expr: 'shock' }], [F.HAT - 6, 'idle', { expr: 'nervous', sweat: true }], [105, 'idle', { expr: 'smug' }], [F.CLIMB - 4, 'reach', { expr: 'pained' }], [F.EASY - 3, 'hips', { expr: 'smug', talk: true }], [F.FASTER, 'point', { expr: 'grin', talk: true }],
      [F.POPPED, 'shock', { expr: 'shock' }], [520, 'idle', { expr: 'dazed' }], [557, 'cheer', { expr: 'excited', talk: true }], [F.BOUNCE, 'jump', { expr: 'grin' }], [610, 'panic', { expr: 'scared' }], [822, 'idle', { expr: 'nervous', sweat: true }], [F.PUSHED, 'shock', { expr: 'shock' }], [945, 'idle', { expr: 'confused' }]];
    BARRY.set(T.act(f, bk, { seed: 3, blink: blink(3), phase: (f / 14) % 1 }), { ...bp, visible: !(f >= 386 && f < 470) && !(ex && f >= 1010 && false) });
    if (upside) { BARRY.root.rotation.set(0, 0.4, Math.PI); BARRY.root.position.y = 1.15 + 0.03 * Math.sin(f * 0.3); }
    RIM.visible = (f < 386 || (f >= 470 && f < 557) || (upside && !ex) || (ex && f >= F.PUSHED)); RIM.position.set(bp.x, 0.02, bp.z); RIM.scale.setScalar(upside ? 0.7 : 1);
    POGO.visible = !!pogo; if (pogo) { POGO.position.set(bp.x, bp.y - 0.35, bp.z); POGO.rotation.set(0, 0.4, 0); }
    // tunnel mounds (Barry digging under the snow)
    MOUNDS.forEach((m, k) => { const hx = lerp(-9, 0, sm(F.RAN, 470, f)), x = -9 + k * 0.36; m.visible = f >= F.RAN && f < 557 && x <= hx + 0.01; m.position.set(x, 0.12 + (Math.abs(x - hx) < 0.5 ? 0.3 : 0), Math.sin(k * 0.7) * 0.15); m.scale.set(1.4, Math.abs(x - hx) < 0.5 ? 1.3 : 0.8, 1.1); });
    // ---------- Tess on rackets ----------
    let tp = { x: -8.0, z: -1.2, yaw: 0.5 }, tmode = 'idle', walking = false;
    if (f >= 715 && f < 822) { const W = K.walkPath(f, 715, [[-8, -1.2], [-3, -0.6], [3, -0.4]], 1.3); tp = { x: W.x, z: W.z, yaw: W.yaw }; walking = W.moving; }
    else if (f >= 557 && f < 715) tp = { x: -4.0, z: -0.8, yaw: 0.6 };
    else if (f >= 1084) tp = { x: 3.6, z: -0.2, yaw: -0.4 };
    if (ex) tp = { x: EX + 1.5, z: 0, yaw: -0.3 };
    const tk = [[0, 'idle', { expr: 'smile' }], [F.HAT - 4, 'laugh', { expr: 'laugh' }], [105, 'cross', { expr: 'smug' }], [F.STRAP - 4, 'crouch', { expr: 'deadpan' }], [F.WHY, 'hips', { expr: 'smug' }], [F.EASY, 'facepalm', { expr: 'deadpan' }],
      [557, 'cross', { expr: 'deadpan' }], [F.STUCK, 'laugh', { expr: 'laugh' }], [715, 'stroll', { expr: 'smile', whistle: true }], [822, 'hips', { expr: 'smug' }], [F.SPREAD - 2, 'show', { expr: 'proud' }], [1084, 'laugh', { expr: 'laugh' }], [F.ATE, 'shrug', { expr: 'grin' }]];
    const TA = T.act(f, tk, { seed: 6, blink: blink(6), phase: (f / 18) % 1 }); if (walking) TA.opts.mode = 'stroll';
    TESS.set(TA, { ...tp, visible: !(f >= 386 && f < 557) });
    const ry = tp.yaw, rv = [Math.cos(ry), -Math.sin(ry)], fv = [Math.sin(ry), Math.cos(ry)];
    RK.forEach((r, k) => { const s = k ? 1 : -1, slide = walking ? 0.25 * Math.sin((f / 18) * Math.PI * 2 + k * Math.PI) : 0, on = f >= F.RACK - 4 && !(f >= 386 && f < 557);
      r.visible = on || (f >= F.STRAP - 8 && f < F.RACK - 4 && !ex); r.position.set(tp.x + rv[0] * s * 0.22 + fv[0] * (0.08 + slide), 0.05 + (on ? 0 : 0.5), tp.z + rv[1] * s * 0.22 + fv[1] * (0.08 + slide)); r.rotation.set(-Math.PI / 2, 0, -ry);
      if (!on) { r.position.set(tp.x + 0.6 * s, 0.6, tp.z + 0.3); r.rotation.set(-0.3, 0, 0.3 * s); } });
    // ---------- Clover ----------
    let cp = { x: -7.2, z: 1.0, yaw: -0.6, mode: 'sit', expr: 'happy' };
    if (f >= 386 && f < 557) { cp = { x: 0, z: 0, yaw: 0.3, y: f < F.POPPED - 2 ? 0 : lerp(0, 1.78, sm(F.POPPED - 2, F.POPPED + 8, f)) - (f > 520 ? sm(520, 540, f) * 1.78 : 0), mode: f < F.POPPED ? 'eat' : f < 520 ? 'sit' : 'jump', expr: f < F.POPPED ? 'happy' : 'shock' }; if (f > 520) cp.x = lerp(0, 0.8, sm(520, 545, f)); }
    else if (f >= 557 && f < 715) cp = { x: -0.2, z: 2.3, yaw: -1.6, mode: f >= F.SNIFF ? 'eat' : 'sit', expr: f >= F.HOPE ? 'happy' : 'neutral' };
    else if (f >= 715 && f < 822) cp = { x: 0.6, z: 2.4, yaw: -0.5, mode: 'sit', expr: 'neutral' };
    else if (f >= 1084 && f < 1186) { const W = K.walkPath(f, 1084, [[-3, 2.5], [6, 1.4], [13.6, -0.6]], 3.4); cp = { x: W.x, z: W.z, yaw: W.yaw, mode: W.moving ? 'run' : 'sit', y: W.moving ? Math.abs(Math.sin(f * 0.45)) * 0.35 : 0, expr: 'happy' }; }
    else if (f >= 1186) cp = { x: 14.3, z: -1.0, y: 0.89, yaw: 0.4, mode: f >= F.ATE ? 'eat' : 'sit', expr: 'happy' };
    if (ex) cp = { visible: false };
    CLOVER.set(f, cp);
    CAKE.visible = !(f >= F.ATE + 20); CAKE.scale.setScalar(f >= F.ATE ? 1 - 0.6 * sm(F.ATE, F.ATE + 20, f) : 1);
    FOOTGLOW.forEach((g, k) => { g.visible = f >= F.BORN && f < 1186; g.position.set(cp.x + (k ? 0.18 : -0.18) * Math.cos(cp.yaw || 0), (cp.y || 0) + 0.03, cp.z - (k ? 0.18 : -0.18) * Math.sin(cp.yaw || 0)); g.rotation.z = cp.yaw || 0; });
    // explainer pieces
    SNOWBOX.visible = ex; BIGARROWS.forEach((a, k) => { a.visible = ex && f >= F.PUSHED - 4 && f < 1084; a.position.y = 1.6 + 0.6 * (1 - sm(F.PUSHED - 4, F.PUSHED + 10, f)) - 0.25 * Math.abs(Math.sin(f * 0.3)); a.scale.setScalar(1.2); });
    SMALLARROWS.forEach((a, k) => { a.visible = ex && f >= F.SPREAD + k * 2; a.position.y = 0.55 - 0.06 * Math.abs(Math.sin(f * 0.3 + k)); });
    PUD.visible = ex && f < 1010; FINGER.position.set(0, 1.5 - 0.95 * sm(F.FINGER, F.PUDDING + 6, f), 0);

    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const L = K.light('morning', { az: 60, el: 22, shadowExt: 26, exposure: 1.3 }), L2 = K.light('golden', { az: 70, el: 20, exposure: 1.25 });
    const body = (p, y0 = 0, h = 1.95) => [[p.x, (p.y || 0) + y0, p.z], [p.x, (p.y || 0) + y0 + h, p.z]];
    const bh = [bp.x, Math.max(0, bp.y + 1.9), bp.z];
    let light = L;
    if (sh(0, 50)) {                          // 1. Barry sinking at the start line; Tess on top; Clover on a drift
      cam = fitT(K, [[bp.x, 0, bp.z], bh, ...body(tp), [cp.x, 0, cp.z], [-10.5, 0, 2.5]], { yaw: 80, pitch: 10, fov: 44 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(50, 105)) {                 // 2. only his hat shows (low, wide)
      cam = fitT(K, [[bp.x - 1, 0, 0], [bp.x + 0.5, 0.6, 0], ...body(tp), [cp.x, 0.6, cp.z]], { yaw: 105, pitch: 4, fov: 42 }); cam.fov *= K.punch(f, F.HAT, 0.1, 6);
    } else if (sh(105, 145)) {                // 3. the bet board: 1 carrot cake
      cam = fitT(K, [[-13.6, 0.5, -2.6], [-11.4, 2.6, -2.6], ...body(tp)], { yaw: 70, pitch: 6, fov: 40 });
    } else if (sh(145, 187)) {                // 4. down the meadow to the cocoa hut (the race course)
      cam = { pos: [lerp(-14, -13, u), 3.0, 3.2], look: [8, 1.0, -2], fov: 40 }; dof = { focus: 20, cinf: 2 };
    } else if (sh(187, 245)) {                // 5. Tess straps on two giant tennis rackets (full)
      cam = fitT(K, [...body(tp), [tp.x - 0.8, 0, tp.z + 0.6], [tp.x + 0.8, 0, tp.z + 0.6], [bp.x, 0.5, bp.z]], { yaw: 75, pitch: 12, fov: 40 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(245, 314)) {                // 6. hero shot of the rackets on the snow (low), Tess smug: why don't snowshoes sink?
      cam = fitT(K, [...body(tp), [tp.x - 0.5, 0, tp.z + 0.5], [tp.x + 0.5, 0, tp.z - 0.5]], { yaw: 120, pitch: 3, fov: 40 }); cam.fov *= K.push(u, 0.1); dof = { focus: 4, cinf: 6 };
    } else if (sh(314, 386)) {                // 7. Barry climbs out: "Easy peasy. I'll run faster."
      cam = fitT(K, [[bp.x, 0, bp.z], [bp.x, 2, bp.z], ...body(tp), [cp.x, 0.6, cp.z]], { yaw: 95, pitch: 8, fov: 42 });
    } else if (sh(386, 440)) {                // 8. the tunnel: a mound races across the meadow (tracking, wide)
      const hx = lerp(-9, 0, sm(F.RAN, 470, f)); cam = fitT(K, [[hx - 3, 0, 0], [hx + 1.2, 1.0, 0]], { yaw: 70, pitch: 16, fov: 42 });
    } else if (sh(440, 495)) {                // 9. pops up under Clover the rabbit (wide)
      cam = fitT(K, [[0, 0, 0], [0, 3.2, 0], [-2.5, 0, 0], [1, 0, 0]], { yaw: 80, pitch: 6, fov: 42 }); cam.fov *= K.punch(f, F.POPPED, 0.1, 6);
    } else if (sh(495, 525)) {                // 10. reaction close-up: Clover on Barry's head, wants that cake
      cam = { pos: [0.6, 2.0, 3.6], look: [0.1, 2.2, 0], fov: 42 }; dof = { focus: 3.6, cinf: 10 };
    } else if (sh(525, 557)) {                // 11. insert: the carrot cake on the hut table
      cam = { pos: [14.9, 1.45, 0.3], look: [14.4, 1.05, -1.15], fov: 40 * K.push(u, 0.12) }; dof = { focus: 1.5, cinf: 16 }; light = L2;
    } else if (sh(557, 610)) {                // 12. "Easy peasy!" pogo stick, one bounce (wide)
      cam = fitT(K, [[bp.x, 0, bp.z], [bp.x, 3.6, bp.z], ...body(tp), [-1.6, 0, 1.2], [-1.6, 2.2, 1.2]], { yaw: 70, pitch: 8, fov: 42 });
    } else if (sh(610, 668)) {                // 13. stuck like a carrot in a snowman (next to a real snowman)
      cam = fitT(K, [[-0.9, 0, 1.6], [-0.9, 2.2, 1.6], [-1.6, 0, 1.2], [-1.6, 2.3, 1.2], [cp.x, 0, cp.z]], { yaw: 95, pitch: 6, fov: 40 }); cam.fov *= K.punch(f, F.SNOWMAN, 0.1, 6);
    } else if (sh(668, 715)) {                // 14. Clover sniffs him. Hopefully. (medium)
      cam = fitT(K, [[-0.9, 0, 1.6], [-0.9, 2.2, 1.6], [cp.x, 0, cp.z], [cp.x, 0.7, cp.z]], { yaw: 40, pitch: 10, fov: 40 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(715, 770)) {                // 15. Tess strolls across the top like a sidewalk (tracking, wide)
      const tc = K.track(f, (g) => { const W = K.walkPath(g, 715, [[-8, -1.2], [-3, -0.6], [3, -0.4]], 1.3); return [W.x, 0, W.z]; }, { off: [2.0, 1.8, 6.5], lag: 5, lookY: 1.0 }); cam = { ...tc, fov: 44 };
    } else if (sh(770, 822)) {                // 16. front: Tess strolling, Barry's legs sticking up behind — what's the trick?
      cam = fitT(K, [...body(tp), [-0.9, 0, 1.6], [-0.9, 2.2, 1.6], [cp.x, 0, cp.z]], { yaw: 20, pitch: 8, fov: 42 });
    } else if (sh(822, 880)) {                // 17. x-ray: Barry's weight through two tiny shoes (big red arrows), he sinks
      cam = fitT(K, [[EX - 3.5, -1.2, 0], [EX - 0.5, 3.4, 0], ...body(bp)], { yaw: 80, pitch: 6, fov: 42 }); light = L;
    } else if (sh(880, 945)) {                // 18. like a finger poking pudding
      cam = fitT(K, [[EX + 5.3, 0, 2], [EX + 6.7, 2.2, 2]], { yaw: 85, pitch: 18, fov: 40, margin: 1.4 }); cam.fov *= K.punch(f, F.PUDDING, 0.1, 6);
    } else if (sh(945, 1010)) {               // 19. Tess on the rackets: the same push, spread out (small green arrows)
      cam = fitT(K, [[EX + 0.5, -1.2, 0], [EX + 2.5, 0, 0], ...body(tp)], { yaw: 70, pitch: 12, fov: 42 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1010, 1084)) {              // 20. side by side: sinking vs floating
      cam = fitT(K, [[EX - 2.4, -0.6, 0], [EX + 2.2, 0, 0], ...body(bp), ...body(tp)], { yaw: lerp(85, 95, u), pitch: 12, fov: 44, margin: 1.05 });
    } else if (sh(1084, 1135)) {              // 21. Clover's giant back feet = built-in snowshoes (tracking)
      const tc = K.track(f, (g) => { const W = K.walkPath(g, 1084, [[-3, 2.5], [6, 1.4], [13.6, -0.6]], 3.4); return [W.x, 0, W.z]; }, { off: [2.2, 1.8, 6.5], lag: 3, lookY: 0.4 }); cam = { ...tc, fov: 42 };
    } else if (sh(1135, 1186)) {              // 22. Clover hops past Barry's legs and Tess, toward the hut (wide)
      cam = fitT(K, [[cp.x - 1, 0, cp.z], [cp.x + 1, 1.0, cp.z], [lerp(-0.9, cp.x, 0.4), 0.2, 1.0]], { yaw: 75, pitch: 10, fov: 44 });
    } else if (sh(1186, 1250)) {              // 23. Clover reaches the cocoa hut and eats the cake (wide on the hut)
      cam = fitT(K, [[13.4, 0, -0.6], [15.6, 0, -1.4], [16, 4.0, -4.5], [cp.x, 1.5, cp.z]], { yaw: 75, pitch: 6, fov: 42 }); light = L2;
    } else if (sh(1250, 1300)) {              // 24. Tess laughing, Barry's boots in the air: easy peasy
      cam = fitT(K, [...body(tp), [-0.9, 0, 1.6], [-0.9, 2.2, 1.6]], { yaw: 60, pitch: 8, fov: 42 }); light = L2;
    } else {                                  // 25. pull back over Fluff Meadow (loops to the start)
      cam = fitT(K, [[-0.9, 0, 1.6], [-0.9, 2.2, 1.6], ...body(tp), [-1.6, 2.3, 1.2], [lerp(-1, -4, u), 0, 0]], { yaw: lerp(78, 70, u), pitch: lerp(8, 14, u), fov: 44 }); light = L2;
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    K.leaves(f, cam.look, { area: 10, count: 50, fall: 0.5, colors: ['#ffffff', '#eef4ff', '#f8fbff'] });
    K.steam(f, [17.2, 5.6, -5.5], { rate: 4, size: 0.8, rise: 2.0, dark: 0.15 });
    if (f >= F.RAN && f < 470) K.sparks(f, F.RAN, 470, (g) => [lerp(-9, 0, sm(F.RAN, 470, g)), 0.3, 0], { dir: [0, 1, 0.2], spread: 0.8, rate: 10, speed: 2.5, life: 14, color: '#ffffff', seed: 9 });
    K.puff(f, F.POPPED, 0, 0, 10, 0.6, '#ffffff'); K.puff(f, F.STUCK - 4, -0.9, 1.6, 10, 0.6, '#ffffff'); K.puff(f, 4, -9, 0, 8, 0.5, '#ffffff'); K.puff(f, F.PUSHED, EX - 1.8, 0, 8, 0.5, '#ffffff');
    K.mist(f, 814, 16); K.mist(f, 1076, 16);
    K.badge(f, F.HAT, 'SANK TO HIS HAT', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 103 });
    K.badge(f, F.CAKE, 'PRIZE: CARROT CAKE', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 185 });
    K.badge(f, F.WHY, "WHY DON'T THEY SINK?", { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 312 });
    K.badge(f, F.TINY, 'ALL WEIGHT, TINY SPOT', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 943 });
    K.badge(f, F.SPREAD, 'SAME WEIGHT, SPREAD OUT', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1082 });
    K.badge(f, F.FEET, 'BUILT-IN SNOWSHOES', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1184 });
    K.badge(f, F.EASY3, 'EASY PEASY', { sx: 0.5, sy: 0.22 }, { style: 'stamp', size: 1.2 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
