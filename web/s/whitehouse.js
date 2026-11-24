// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Houses in Sunny Towns Are White" — invented story, engine: The Rivals (tonight's only one; all new lines).
// Show-off Marco paints his seaside house black ("Black is back!"); Mango the cat packs a tiny suitcase and moves in with
// Nina's white "sugar cube". 400 selfies vs zero. Heat wave, three counted days: oven-mitt doorknob, the step fries an egg,
// the house steams like a teapot. Mango naps cool on Nina's roof. Explainer: sun bounces off white, soaks into black (black
// T-shirt at the beach), 40 degrees inside. Marco whispers "Black is back" from Nina's kiddie pool -> paints it white, Mango is back.
import { TOTAL, LINES, wf } from './whitehouse_timing.js';
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
const CX = 200;                // beach explainer stage
const MX = -3.6, NX = 3.6;     // Marco's house (black) and Nina's house (white): fronts at z = -2.5
let THREE, F = {}, MARCO, NINA, MANGO, PIGEON, BLACKH, WHITEH, SUIT, EGG, POOL, BUCKET, HEATBOX, RAYW = [], RAYB = [], WALLGLOW, TOUR = [], MITTM, HANDS = [], HANDM0;

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { BLACK: wf(0, 'black'), CAT: wf(0, 'cat'), NEXT: wf(0, 'next'), WHITE1: wf(1, 'white'), WHY: wf(1, 'why'), BACK: wf(2, 'black'), SELFIES: wf(2, '400'), ZERO: wf(3, 'zero'), SUGAR: wf(3, 'sugar'),
      HEAT: wf(4, 'heat'), DAY1: wf(4, 'day'), MITTS: wf(4, 'oven'), DAY2: wf(5, 'day'), EGG: wf(5, 'egg'), NOBODY: wf(5, 'nobody'), DAY3: wf(6, 'day'), SPRINK: wf(6, 'sprinkler'), TEAPOT: wf(6, 'teapot'),
      MANGO: wf(7, 'mango'), NAPPED: wf(7, 'napped'), CUCUMBER: wf(7, 'cucumber'), WHAT: wf(8, 'what'), BOUNCES: wf(9, 'bounces'), SOAKS: wf(9, 'soaks'), SHIRT: wf(9, 'beach'), INSIDE: wf(10, 'inside'), FORTY: wf(10, '40'),
      WHISPER: wf(11, 'marco'), POOL: wf(11, 'kiddie'), SAT: wf(12, 'saturday'), PAINTED: wf(12, 'painted'), MANGO2: wf(12, 'mango') };
    // ================= Sol Bay: a sunny hillside lane =================
    const G = K.group();
    const ground = new THREE.PlaneGeometry(200, 160, 100, 80); ground.rotateX(-Math.PI / 2); const GP = ground.attributes.position;
    for (let i = 0; i < GP.count; i++) { const z = GP.getZ(i); GP.setY(i, z < -9 ? (-9 - z) * 0.45 : z > 7 ? -(z - 7) * 0.6 : 0); }
    ground.computeVertexNormals(); K.add(ground, K.mat('dirt', '#d8c4a0', { detail: 1.0, amt: 0.35 }), 0, 0, 0, G);
    K.slab(-30, 30, 0, 0.04, -2.5, 3.0, K.mat('rock', '#c8b8a0', { detail: 0.35, amt: 0.4 }), G, false);   // cobbled lane
    K.add(new THREE.PlaneGeometry(800, 400), K.paint('#2a8ac8', { rough: 0.15, coat: 1 }), 0, -6, 210, G).rotation.x = -Math.PI / 2;   // the sea, down the hill
    for (let x = -30; x < 30; x += 0.8) K.rbox(0.78, 0.6, 0.35, 0.06, K.mat('plaster', '#f4f0e8'), x, 0.3, 3.4, G);                // low white sea wall
    // the two houses + their front steps, doors, knobs, plants
    const mk = (x, col, seed, door) => { const b = S.building({ w: 6.4, d: 5, floors: 1, floorH: 3.2, seed, color: col, kind: 'plaster', gable: 'flat', shutters: door, flowers: true, trim: col === '#1c1c22' ? '#2a2a32' : '#f4f2ee' }); b.position.set(x, 0.04, -2.5);
      K.rbox(1.0, 1.9, 0.08, 0.04, K.paint(door, { rough: 0.3 }), x, 1.0, -2.45, b.parent === sc ? sc : sc); return b; };
    BLACKH = new THREE.Group(); sc.add(BLACKH); WHITEH = new THREE.Group(); sc.add(WHITEH);
    { const b = S.building({ w: 6.4, d: 5, floors: 1, floorH: 3.2, seed: 7, color: '#1c1c22', kind: 'plaster', gable: 'flat', shutters: '#c0392b', flowers: true, trim: '#34343e' }, BLACKH); b.position.set(MX, 0.04, -2.5); }
    { const b = S.building({ w: 6.4, d: 5, floors: 1, floorH: 3.2, seed: 7, color: '#f6f4ee', kind: 'plaster', gable: 'flat', shutters: '#2a6ac8', flowers: true }, WHITEH); b.position.set(MX, 0.04, -2.5); }
    const nh = S.building({ w: 6.4, d: 5, floors: 1, floorH: 3.2, seed: 9, color: '#f6f4ee', kind: 'plaster', gable: 'flat', shutters: '#2a6ac8', flowers: true }); nh.position.set(NX, 0.04, -2.5);
    for (const [x, c] of [[MX, '#c0392b'], [NX, '#2a6ac8']]) { K.rbox(1.0, 1.95, 0.1, 0.04, K.paint(c, { rough: 0.3 }), x, 1.0, -2.42, G); K.sphere(0.06, K.gold(), x + 0.35, 1.0, -2.34, G); K.slab(x - 0.8, x + 0.8, 0, 0.18, -2.45, -1.75, K.mat('rock', '#b8a890'), G); }
    for (const x of [NX - 2.6, NX + 2.6, MX - 2.6, MX + 2.6]) { K.cyl(0.3, 0.24, 0.55, K.paint('#c86a3a', { rough: 0.6 }), x, 0, -1.9, G, 16); K.sphere(0.4, K.mat('grime', '#4a9a3a'), x, 0.85, -1.9, G); }
    const mb = S.board("MARCO'S|BLACK IS BACK", 1.6, 0.8, { frame: '#1c1c22', bg: '#1c1c22', fg: '#f2c230' }); mb.position.set(MX - 2.9, 0, -1.2); mb.scale.setScalar(0.8);
    // more white houses climbing the hill behind, blue domes, a bell tower, palms
    for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) { if (r === 0 && Math.abs(-20 + k * 5) < 8) continue; const b = S.building({ w: 4 + (k % 3), d: 4, floors: 1 + ((k + r) % 2), seed: 20 + r * 10 + k, color: (k + r) % 4 === 0 ? '#e8f0f8' : '#f6f4ee', kind: 'plaster', gable: 'flat', shutters: ['#2a6ac8', '#1f8a9a', '#3a5ac8'][k % 3], flowers: k % 2 === 0 }); b.position.set(-20 + k * 5 + r * 1.3, (r * 4.5) * 0.45 + 0.04, -9 - r * 4.5); }
    for (const [x, y, z] of [[-9, 6.6, -18], [8, 9.5, -24], [14, 4.2, -13]]) { K.cyl(1.1, 1.1, 0.4, K.paint('#f6f4ee'), x, y - 0.4, z, G, 24); K.add(new THREE.SphereGeometry(1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), K.paint('#2a6ac8', { rough: 0.2 }), x, y, z, G); }
    K.slab(16, 18, 0, 9, -11, -9, K.mat('plaster', '#f6f4ee'), G); K.sphere(0.25, K.gold(), 17, 9.6, -10, G);
    for (let k = 0; k < 6; k++) { const tx = -24 + k * 9.5; if (Math.abs(tx) < 12) continue; const t = S.tree({ h: 4 + hash(k) * 2, seed: k + 3, colors: ['#5a9a3a', '#6aaa4a', '#4a8a2a'] }); t.position.set(tx, 0, 1.8 + hash(k) * 1); }
    // a lemonade stand + parasol at Nina's, bunting across the lane
    K.rbox(1.2, 0.9, 0.6, 0.05, K.mat('wood', '#c8a070'), NX + 2.3, 0.45, -0.8, G); for (let k = 0; k < 3; k++) K.cyl(0.06, 0.06, 0.16, K.glass({ color: '#f8f0a0', opacity: 0.7 }), NX + 1.95 + k * 0.3, 0.9, -0.8, G, 12);
    const ls = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.3), S.textMat('LEMONADE', { bg: '#f2c230', fg: '#1a1a1a', w: 512, h: 128, border: false })); ls.position.set(NX + 2.3, 0.6, -0.49); G.add(ls);
    for (let k = 0; k < 24; k++) { const fl = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3, 3), K.paint(['#e8302a', '#2a6ac8', '#f2c230', '#f4f2ee'][k % 4], { rough: 0.5 })); fl.rotation.x = Math.PI; fl.position.set(-8 + k * 0.7, 3.9 - 0.4 * Math.sin((k / 23) * Math.PI), 0.6); G.add(fl); }
    S.bake(G); S.bake(BLACKH); S.bake(WHITEH);
    // egg on Marco's step, kiddie pool at Nina's, paint bucket, x-ray heat box
    EGG = new THREE.Group(); EGG.position.set(MX - 0.3, 0.19, -2.05); sc.add(EGG); const eg = K.sphere(0.16, K.paint('#fbfaf6', { rough: 0.3 }), 0, 0, 0, EGG); eg.scale.set(1, 0.12, 0.8); K.sphere(0.06, K.paint('#f2a820', { rough: 0.2 }), 0, 0.02, 0, EGG);
    POOL = new THREE.Group(); POOL.position.set(NX + 0.4, 0.04, 0.9); sc.add(POOL); const pr = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.18, 12, 32), K.paint('#f28ab8', { rough: 0.3 })); pr.rotation.x = Math.PI / 2; pr.position.y = 0.2; POOL.add(pr);
    const pw = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.2, 32), K.paint('#6ad0f0', { rough: 0.05, coat: 1 })); pw.position.y = 0.12; POOL.add(pw);
    const duck = K.sphere(0.12, K.paint('#f2c230', { rough: 0.3 }), 0.5, 0.3, 0.3, POOL); K.sphere(0.08, K.paint('#f2c230', { rough: 0.3 }), 0.58, 0.42, 0.3, POOL);
    BUCKET = new THREE.Group(); sc.add(BUCKET); K.cyl(0.18, 0.15, 0.32, K.chrome(), 0, 0, 0, BUCKET, 18); K.cyl(0.17, 0.17, 0.02, K.paint('#ffffff', { rough: 0.2 }), 0, 0.3, 0, BUCKET, 18);
    HEATBOX = new THREE.Group(); HEATBOX.position.set(MX, 1.6, -5.0); sc.add(HEATBOX); HEATBOX.add(K.holoBox(6.5, 3.3, 5.1, 0, 0, 0, HEATBOX, '#ff7a3a'));
    const hb = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.0, 4.8), new THREE.MeshBasicMaterial({ color: '#ff5a1a', transparent: true, opacity: 0.35, depthWrite: false })); hb.userData.ndSkip = true; HEATBOX.add(hb);
    // ================= beach explainer: sun rays bounce off white, soak into black =================
    const BG = K.group(); K.slab(CX - 30, CX + 30, -0.05, 0, -20, 20, K.mat('dirt', '#f2dca8', { detail: 0.8 }), BG, false);
    for (let k = 0; k < 6; k++) { const t = S.tree({ h: 4 + hash(k + 30), seed: k + 30, colors: ['#5a9a3a', '#6aaa4a'] }); t.position.set(CX - 12 + k * 5, 0, -9 - hash(k) * 3); }
    K.rbox(2.2, 2.4, 0.3, 0.06, K.mat('plaster', '#f8f6f0'), CX - 1.6, 1.2, 0, BG); K.rbox(2.2, 2.4, 0.3, 0.06, K.paint('#1c1c22', { rough: 0.6 }), CX + 1.6, 1.2, 0, BG);
    const parasol = K.add(new THREE.ConeGeometry(1.4, 0.5, 16), K.paint('#e8302a', { rough: 0.4 }), CX + 4.5, 2.4, 2.2, BG); K.cyl(0.04, 0.04, 2.3, K.chrome(), CX + 4.5, 0, 2.2, BG, 8);
    S.bake(BG);
    WALLGLOW = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.4), new THREE.MeshBasicMaterial({ color: '#ff4a1a', transparent: true, opacity: 0, toneMapped: false })); WALLGLOW.position.set(CX + 1.6, 1.2, 0.16); WALLGLOW.userData.ndSkip = true; sc.add(WALLGLOW);
    for (let k = 0; k < 4; k++) { const y = 0.6 + k * 0.5; RAYW.push(K.trace([[CX - 3.6, y + 3.2, 4], [CX - 1.6 + (k - 1.5) * 0.3, y, 0.2], [CX - 3.0 + (k - 1.5) * 0.6, y + 2.6, 3.8]], { color: '#fff3b0', r: 0.03 }));
      RAYB.push(K.trace([[CX + 0.2, y + 3.2, 4], [CX + 1.6 + (k - 1.5) * 0.3, y, 0.2]], { color: '#fff3b0', r: 0.03 })); }
    // ================= characters =================
    MARCO = K.stick({ jacket: '#1c1c22', pants: '#1c1c22', hairStyle: 'spiky', hair: '#1a1a1a', glasses: '#1a1a1a', moustache: '#1a1a1a', collar: '#f2c230', belt: '#c8a020', boots: '#1a1a1a', gloves: '#101012' }, { key: 'marco' });
    NINA = K.stick({ dress: '#f8f6f0', jacket: '#f8f6f0', pants: '#2a6ac8', hairStyle: 'curly', hair: '#3a2418', scarf: '#2a6ac8', hat: 'cowboy', hatColor: '#f2e2c0', collar: '#2a6ac8' }, { key: 'nina' });
    MANGO = K.animal('cat', { color: '#f2a040', seed: 5, scale: 1.35 }); PIGEON = K.animal('pigeon', { seed: 2, scale: 1.4 });
    SUIT = new THREE.Group(); sc.add(SUIT); K.rbox(0.3, 0.22, 0.12, 0.03, K.paint('#8a4a2a', { rough: 0.35 }), 0, 0, 0, SUIT); K.rbox(0.12, 0.05, 0.03, 0.01, K.gold(), 0, 0.13, 0, SUIT); K.rbox(0.31, 0.03, 0.13, 0.01, K.gold(), 0, 0.03, 0, SUIT);
    for (let k = 0; k < 6; k++) TOUR.push(K.stick({ jacket: ['#e8302a', '#2a9a6a', '#f2c230', '#8a4ac8', '#2a8ae8', '#f07a20'][k], pants: ['#2a2a40', '#f2e2c0', '#3a5a2a'][k % 3], hat: ['cap', 'cowboy', 'beanie', null, 'cap', null][k], hatColor: '#f4f2ee', hairStyle: ['short', 'bun', 'curly', 'ponytail', 'spiky', 'long'][k], glasses: k % 2 === 0, scarf: k % 3 === 1 ? '#f4f2ee' : null }, { key: 'tour' + k }));
    MARCO.root.traverse((o) => { if (o.isMesh && o.geometry.parameters && Math.abs((o.geometry.parameters.radius || 0) - 0.045) < 1e-4 && o.material.color && o.material.color.getHexString() === '101012') HANDS.push(o); });
    HANDM0 = HANDS.length ? HANDS[0].material : null; MITTM = K.paint('#e8302a', { rough: 0.6, coat: 0.2 });
    K.addClouds(6, 700, 170);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 880 && f < 1016;      // beach explainer
    const white = f >= F.PAINTED - 4;
    BLACKH.visible = !white; WHITEH.visible = white;
    // ---------- Marco ----------
    let mp = { x: MX - 1.2, z: -1.4, yaw: 0.3 };
    if (f < 100) mp = { x: MX - 1.6, z: -1.3, yaw: 0.5 };
    else if (f >= 229 && f < 351) mp = { x: MX + 0.2, z: -0.9, yaw: 0.1 };
    else if (f >= 351 && f < 450) mp = { x: MX + 1.6, z: 0.2, yaw: 1.2 };
    else if (f >= 450 && f < 649) mp = { x: MX + 0.4, z: -1.4, yaw: Math.PI - 0.1 };
    else if (f >= 649 && f < 737) mp = { x: MX + 1.5, z: 0.6, yaw: -2.6 };
    else if (f >= 1016 && f < 1139) mp = { x: MX + 1.5, z: 0.4, yaw: 0.2 };
    else if (f >= 1139 && f < 1219) mp = { x: NX + 0.4, y: -0.05, z: 0.9, yaw: -0.4, seat: 0.18 };
    else if (f >= 1219) mp = { x: MX - 0.8, z: -0.8, yaw: 0.4 };
    if (ex) mp = { x: CX - 0.2, z: 2.2, yaw: 0.3 };
    if (f >= 737 && f < 880) mp = { visible: false };
    const mk = [[0, 'hammer', { expr: 'proud', R: [0.45, -0.75, 'hammer'] }], [F.CAT - 2, 'shock', { expr: 'shock' }], [100, 'hips', { expr: 'smug' }], [229, 'cheer', { expr: 'excited', talk: true }], [F.SELFIES, 'celebrate', { expr: 'laugh' }],
      [351, 'point', { expr: 'smug' }], [F.SUGAR - 4, 'laugh', { expr: 'laugh', talk: true }], [450, 'idle', { expr: 'nervous', sweat: true }], [F.MITTS - 4, 'reach', { expr: 'pained', sweat: true }], [F.DAY2, 'shock', { expr: 'shock', sweat: true }], [F.NOBODY, 'facepalm', { expr: 'pained' }],
      [649, 'hold', { expr: 'nervous', R: [0.4, -0.3, 'hammer'] }], [F.TEAPOT - 4, 'panic', { expr: 'scared' }], [880, 'idle', { expr: 'pained', sweat: true }], [F.SHIRT, 'ears', { expr: 'pained', sweat: true }],
      [1016, 'panic', { expr: 'scared', sweat: true }], [1139, 'sit', { expr: 'sad', talk: true }], [1219, 'hammer', { expr: 'proud', R: [0.45, -0.75, 'hammer'] }], [F.MANGO2, 'cheer', { expr: 'laugh' }]];
    MARCO.set(T.act(f, mk, { seed: 3, blink: blink(3), phase: (f / 16) % 1 }), mp);
    const mitt = f >= F.MITTS - 4 && f < 556; for (const h of HANDS) { h.material = mitt ? MITTM : HANDM0; h.scale.setScalar(mitt ? 1.9 : 1); }
    // ---------- Nina ----------
    let np = { x: NX - 0.4, z: -1.2, yaw: -0.2 };
    if (f < 100) np = { x: NX - 0.4, z: -1.9, yaw: -0.4 };
    else if (f >= 1139 && f < 1219) np = { x: NX + 1.9, z: -0.2, yaw: -0.8 };
    else if (f >= 1219) np = { x: NX - 1.0, z: -0.6, yaw: -0.5 };
    if (ex) np = { x: CX - 2.6, z: 2.4, yaw: 0.3 };
    const nk = [[0, 'wave', { expr: 'smile' }], [100, 'drink', { expr: 'deadpan', R: [0.2, -0.45, 'cup'] }], [F.WHY, 'shrug', { expr: 'deadpan' }], [F.ZERO, 'shrug', { expr: 'deadpan' }], [F.SUGAR, 'drink', { expr: 'deadpan', R: [0.2, -0.45, 'cup'] }],
      [450, 'drink', { expr: 'smile', R: [0.2, -0.45, 'cup'] }], [F.EGG, 'shock', { expr: 'confused' }], [F.TEAPOT, 'facepalm', { expr: 'deadpan' }], [880, 'show', { expr: 'smile' }], [1016, 'cross', { expr: 'deadpan' }], [1139, 'hips', { expr: 'confused' }], [1219, 'clap', { expr: 'laugh' }]];
    NINA.set(T.act(f, nk, { seed: 6, blink: blink(6) }), { ...np, visible: !(f >= 737 && f < 880 && false) });
    // ---------- Mango: packs a suitcase, moves next door, naps on Nina's roof, comes back ----------
    let cp;
    if (f < 100) { const W = K.walkPath(f, 0, [[MX + 0.6, -1.4], [0, -0.9], [NX - 1.2, -1.6]], 0.9); cp = { x: W.x, z: W.z, yaw: W.yaw, mode: W.moving ? 'walk' : 'sit', expr: 'neutral' }; }
    else if (f < 737) cp = { x: NX - 1.0, z: -1.95, y: 0.18, yaw: 0.2, mode: 'sit', expr: f > F.HEAT ? 'happy' : 'neutral' };
    else if (f < 1219) cp = { x: NX + 1.2, z: -3.2, y: 3.32, yaw: 0.5, mode: 'sleep', expr: 'sleepy' };
    else { const W = K.walkPath(f, F.MANGO2 - 30, [[NX - 1.2, -1.4], [MX + 0.6, -1.0]], 1.4); cp = { x: W.x, z: W.z, yaw: W.yaw, mode: W.moving ? 'walk' : 'sit', expr: 'happy' }; }
    if (ex) cp = { visible: false };
    MANGO.set(f, cp);
    SUIT.visible = f < 100 || f >= 1219; if (SUIT.visible) { const yw = cp.yaw || 0; SUIT.position.set(cp.x + Math.sin(yw) * 0.5 + Math.cos(yw) * 0.12, 0.28, cp.z + Math.cos(yw) * 0.5 - Math.sin(yw) * 0.12); SUIT.rotation.y = yw + Math.PI / 2; }
    PIGEON.set(f, f >= 351 && f < 450 ? { x: lerp(NX - 2.2, NX + 1.0, sm(351, 440, f)), z: -0.6, yaw: Math.PI / 2, mode: 'walk' } : { visible: false });
    // tourists taking selfies at the black house (then gone in the heat)
    TOUR.forEach((t, k) => { const on = f >= 100 && f < 450; const x = MX - 2.0 + (k % 3) * 1.4 + (k > 2 ? 0.6 : 0), z = 0.8 + (k > 2 ? 1.4 : 0); t.set(T.act(f, [[0, 'phone', { expr: k % 2 ? 'grin' : 'smile', R: [0.25, -0.75, 'phone'] }], [F.SELFIES + k * 3, 'cheer', { expr: 'laugh' }], [F.SELFIES + 30 + k * 3, 'phone', { expr: 'grin', R: [0.25, -0.75, 'phone'] }]], { seed: 20 + k, blink: blink(20 + k) }), { x, z, yaw: Math.PI + 0.25 * (k % 3 - 1), visible: on }); });
    EGG.visible = f >= F.EGG - 2 && f < 880 && !white; EGG.scale.setScalar(sm(F.EGG - 2, F.EGG + 6, f) + 0.001);
    POOL.visible = f >= 1100; BUCKET.visible = f >= 1219; BUCKET.position.set(MX - 1.6, 0.04, -0.4);
    HEATBOX.visible = f >= 1016 && f < 1139; HEATBOX.scale.setScalar(1 + 0.01 * Math.sin(f * 0.4));
    // explainer rays
    RAYW.forEach((r, k) => r.show(ex ? sm(F.BOUNCES - 8 + k * 2, F.BOUNCES + 14 + k * 2, f) : 0)); RAYB.forEach((r, k) => r.show(ex ? sm(F.SOAKS - 8 + k * 2, F.SOAKS + 8 + k * 2, f) : 0));
    WALLGLOW.material.opacity = ex ? 0.55 * sm(F.SOAKS, F.SOAKS + 20, f) : 0; WALLGLOW.visible = ex;

    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const L = K.light('day', { az: 75, el: 42, shadowExt: 26 }), LH = K.light('golden', { az: 80, el: 38, exposure: 1.3, sat: 1.25 }), LS_ = K.light('golden', { az: 85, el: 30 });
    const body = (p, h = 1.95) => [[p.x, p.y || 0, p.z], [p.x, (p.y || 0) + h, p.z]];
    const heat = f >= 450 && f < 880; let light = heat ? LH : L;
    if (sh(0, 55)) {                          // 1. Mango carries a tiny suitcase from the black house to the white one; Marco paints
      cam = fitT(K, [...body(mp), [cp.x - 0.5, 0, cp.z], [cp.x + 0.5, 0.6, cp.z], [NX - 0.6, 2.0, -2.0]], { yaw: 75, pitch: 8, fov: 42, lift: 0.8 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(55, 100)) {                 // 2. tracking Mango to Nina's door; Nina waves her in
      const tc = K.track(f, (g) => { const W = K.walkPath(g, 0, [[MX + 0.6, -1.4], [0, -0.9], [NX - 1.2, -1.6]], 0.9); return [W.x, 0, W.z]; }, { off: [-0.8, 1.6, 5.5], lag: 4, lookY: 0.9 }); cam = { ...tc, fov: 44 };
    } else if (sh(100, 160)) {                // 3. wide: the black house and the plain white house side by side (crane)
      cam = fitT(K, [[MX - 3.2, 0, -2.5], [NX + 3.2, 3.4, -2.5]], { yaw: 90, pitch: lerp(4, 12, u), fov: 44, margin: 1.05, lift: 2.6 });
    } else if (sh(160, 229)) {                // 4. Nina sips lemonade, deadpan: why are sunny towns white?
      cam = fitT(K, [...body(np), [NX + 2.9, 0, -0.8], [NX - 1.0, 0.4, -1.95], [NX, 3.3, -2.5]], { yaw: 70, pitch: 8, fov: 42 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(229, 290)) {                // 5. "Black is back!" Marco + tourists with phones (wide)
      cam = fitT(K, [...body(mp), [MX - 2, 0, 2.2], [MX + 1.4, 1.9, 2.2], [MX, 3.3, -2.5]], { yaw: 70, pitch: 10, fov: 44 });
    } else if (sh(290, 351)) {                // 6. 400 selfies (behind the tourists, phones up)
      cam = fitT(K, [[MX - 2.2, 0, 0.8], [MX + 1.6, 1.9, 2.2], ...body(mp)], { yaw: 110, pitch: 14, fov: 42 }); cam.fov *= K.punch(f, F.SELFIES, 0.1, 6);
    } else if (sh(351, 395)) {                // 7. Nina's house got zero: one pigeon walks by
      cam = fitT(K, [[NX - 2.5, 0, -0.6], [NX + 2.5, 3.3, -2.5], ...body(np)], { yaw: 95, pitch: 6, fov: 42 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(395, 450)) {                // 8. Marco points and laughs: "a giant sugar cube"
      cam = fitT(K, [...body(mp), ...body(np), [NX, 3.3, -2.5]], { yaw: 60, pitch: 8, fov: 42 }); cam.fov *= K.punch(f, F.SUGAR, 0.08, 6);
    } else if (sh(450, 500)) {                // 9. the heat wave hits (sun-baked lane, shimmer, HUD day 1)
      cam = fitT(K, [[MX - 3.2, 0, -2.5], [NX + 3.2, 3.4, -2.5], ...body(mp)], { yaw: 75, pitch: 16, fov: 44, margin: 1.05, lift: 2.6 });
    } else if (sh(500, 556)) {                // 10. day one: Marco opens his own door in oven mitts (full)
      cam = fitT(K, [...body(mp), [MX - 0.6, 0, -2.4], [MX + 0.6, 2.2, -2.4]], { yaw: 60, pitch: 6, fov: 40 }); cam.fov *= K.punch(f, F.MITTS, 0.08, 6);
    } else if (sh(598, 649)) {                // 11. day two: the front step fries an egg (insert)
      cam = { pos: [MX - 0.9, 1.7, -0.5], look: [MX - 0.3, 0.2, -2.05], fov: 40 * K.push(u, 0.12) }; dof = { focus: 1.6, cinf: 16 };
    } else if (sh(556, 598)) {                // 12. day two (wide): Marco and Nina, the step starts to sizzle
      cam = fitT(K, [...body(mp), ...body(np), [MX - 0.3, 0.2, -2.05]], { yaw: 80, pitch: 10, fov: 42 });
    } else if (sh(649, 737)) {                // 13. day three: sprinkler on the wall, the house steams like a teapot (wide)
      cam = fitT(K, [[MX - 3.2, 0, -2.5], [MX + 3.2, 5.5, -2.5], ...body(mp)], { yaw: lerp(70, 80, u), pitch: 8, fov: 44 }); cam.fov *= K.punch(f, F.TEAPOT, 0.08, 6);
    } else if (sh(737, 790)) {                // 14. Mango naps on Nina's roof, cool as a cucumber (crane up)
      cam = fitT(K, [[NX - 2.5, 0, -2.5], [NX + 2.5, 4.2, -2.5], [NX + 1.2, 3.3, -3.2]], { yaw: 95, pitch: lerp(6, 20, u), fov: 40 });
    } else if (sh(790, 844)) {                // 15. close: Mango sleeps; the black house steams behind
      cam = { pos: [NX + 2.6, 4.3, -1.0], look: [NX + 0.4, 3.4, -3.4], fov: 42 * K.push(u, 0.08) }; dof = { focus: 3.2, cinf: 9 };
    } else if (sh(844, 889)) {                // 16. so what did the sugar cube know? (low, both houses)
      cam = fitT(K, [[MX - 3.2, 0, -2.5], [NX + 3.2, 3.4, -2.5]], { yaw: 100, pitch: 2, fov: 46, margin: 1.02, lift: 2.6 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(889, 950)) {                // 17. beach explainer: rays bounce off white, soak into black
      cam = fitT(K, [[CX - 3, 0, 0], [CX + 3, 4, 0], ...body(mp), ...body(np)], { yaw: 85, pitch: 8, fov: 44 }); light = LS_;
    } else if (sh(950, 1016)) {               // 18. like a black T-shirt at the beach: Marco sweats, Nina's fine
      cam = fitT(K, [...body(mp), ...body(np), [CX + 4.5, 2.4, 2.2]], { yaw: 70, pitch: 6, fov: 42 }); cam.fov *= K.push(u, 0.06); light = LS_;
    } else if (sh(1016, 1080)) {              // 19. x-ray: the heat goes straight inside Marco's house
      cam = fitT(K, [[MX - 3.3, 0, -7.6], [MX + 3.3, 3.4, -2.4], ...body(mp)], { yaw: 60, pitch: 18, fov: 44 }); light = LH;
    } else if (sh(1080, 1139)) {              // 20. 40 degrees: Marco panics in the lane, the kiddie pool appears at Nina's
      cam = fitT(K, [...body(mp), [NX + 0.4, 0, 0.9], [MX, 3.3, -2.5]], { yaw: 75, pitch: 10, fov: 42 }); cam.fov *= K.punch(f, F.FORTY, 0.08, 6); light = LH;
    } else if (sh(1139, 1219)) {              // 21. "Black is back," whispered from Nina's kiddie pool (wide, Nina confused)
      cam = fitT(K, [[NX - 0.6, 0, 0.9], [NX + 1.4, 1.4, 0.9], ...body(np), [NX - 1.4, 0.2, 0.9]], { yaw: 80, pitch: 12, fov: 42 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(1219, 1280)) {              // 22. Saturday: the house is white; Marco with his paint bucket
      cam = fitT(K, [[MX - 3.2, 0, -2.5], [MX + 3.2, 3.3, -2.5], ...body(mp), [MX - 1.6, 0, -0.4]], { yaw: 80, pitch: 8, fov: 44 });
    } else {                                  // 23. Mango is back: the cat walks home with her suitcase (both houses, loops to frame 0)
      cam = fitT(K, [...body(mp), [cp.x - 0.6, 0, cp.z], [cp.x + 0.6, 0.7, cp.z], [MX - 1.5, 3.3, -2.5], [MX + 1.5, 0, -2.5]], { yaw: lerp(78, 86, u), pitch: 8, fov: 42 });
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f >= 649 && f < 880) { K.steam(f, [MX - 1.5, 3.4, -3.0], { rate: 8, size: 1.4, rise: 2.4, seed: 1 }); K.steam(f, [MX + 1.5, 3.4, -4.0], { rate: 8, size: 1.4, rise: 2.4, seed: 2 }); K.steam(f, [MX, 1.8, -2.3], { rate: 6, size: 1.0, rise: 1.6, seed: 3 }); }
    if (f >= 649 && f < 737) K.sparks(f, 649, 737, [MX + 1.5, 0.3, -1.6], { dir: [-0.6, 1.0, -0.6], spread: 0.4, rate: 14, speed: 3, life: 14, color: '#bfe8ff', seed: 4 });
    if (f >= F.EGG && f < 649) K.steam(f, [MX - 0.3, 0.25, -2.05], { rate: 5, size: 0.25, rise: 0.6, alpha: 0.6 });
    if (ex) K.steam(f, [mp.x, 2.0, mp.z], { rate: 4, size: 0.4, rise: 1.0, alpha: 0.5, seed: 8 });
    K.mist(f, 872, 16); K.mist(f, 1008, 16);
    if (f >= F.HEAT && f < 737) K.hud(f, F.HEAT, { stages: 3, labels: ['DAY 1', 'DAY 2', 'DAY 3'], u: f < F.DAY2 ? 0.17 : f < F.DAY3 ? 0.5 : 0.85, f1: 735 });
    K.badge(f, F.WHY, 'WHY WHITE?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 227 });
    K.badge(f, F.SELFIES, '400 SELFIES', { sx: 0.5, sy: 0.22 }, { icon: 'up', f1: 349 });
    K.badge(f, F.ZERO, '0 SELFIES', { sx: 0.5, sy: 0.22 }, { icon: 'x', f1: 395 });
    K.badge(f, F.BOUNCES, 'WHITE BOUNCES SUN', { sx: 0.5, sy: 0.17 }, { icon: 'check', f1: 1014 });
    K.badge(f, F.SOAKS, 'BLACK SOAKS IT UP', { sx: 0.5, sy: 0.23 }, { icon: 'warn', f1: 1014 });
    K.badge(f, F.FORTY, '40°C INSIDE', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 1137 });
    K.badge(f, F.MANGO2, 'MANGO IS BACK', { sx: 0.5, sy: 0.22 }, { style: 'stamp', size: 1.2 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
