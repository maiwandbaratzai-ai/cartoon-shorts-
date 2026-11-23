// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Train Tracks Sit on Rocks" — invented story, engine: Remove It and See (SCRIPTS.md §000).
// Tidy Mayor Primrose bans the ugly gray rocks under Tidyton's tracks, plants a lawn (tulips + one gnome); rain -> pudding,
// sleepers sink, rails go spaghetti, the 8:15 bounces in at 11:40, the grass needs a ladder, a cow mows for free and outruns
// the stuck train -> x-ray: 300 elephants of push, rocks lock like puzzle pieces, rain runs through -> rocks back, painted pink.
import { TOTAL, LINES, wf } from './trackrocks_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let PUZBIG;
let THREE, MAYOR, MASTER, DRIVER, COW, ELE = [], TRAIN, ROCKS, PINK, LAWN, LAWNM, MUD, TULIPS, GNOME, TALL = [], SLEEPERS = [], RAILS = [], CLOCKH, CLOCKM, LADDER, MOWER, BARROW, BANSIGN, HOLO, PUZ = [], DROPS = [], SPONGE, ARROWS = [], TRUCK, EXTRAS = [];
let F = {};
const ELX = 200;                                  // elephant / x-ray cutaway location
const SX0 = -30, SX1 = 30;                        // the track section we build

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

function rockBed(K, parent, color, n, x0, x1, seed) { const g = new THREE.Group(); parent.add(g); const m = K.mat('rock', color, { detail: 0.25, amt: 0.5 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.3, 3.0), m); top.position.set((x0 + x1) / 2, 0.15, 0); top.receiveShadow = true; g.add(top);
  for (const s of [-1, 1]) { const sl = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.3, 0.9), m); sl.position.set((x0 + x1) / 2, 0.08, s * 1.8); sl.rotation.x = s * 0.35; g.add(sl); }
  const geo = new THREE.DodecahedronGeometry(0.09, 0); for (let i = 0; i < n; i++) { const r = new THREE.Mesh(geo, m); r.position.set(x0 + hash(seed + i) * (x1 - x0), 0.3 + hash(seed + i + 1) * 0.03, (hash(seed + i + 2) - 0.5) * 3.2); r.rotation.set(hash(i) * 3, hash(i + 3) * 3, 0); r.scale.setScalar(0.6 + hash(i + 7) * 0.8); r.castShadow = true; g.add(r); }
  return g; }

function train(K) { const g = new THREE.Group(); K.scene.add(g);
  const cream = K.paint('#f4ead2', { rough: 0.22 }), green = K.paint('#1f6a4a', { rough: 0.22 }), gold = K.gold(), chrome = K.chrome(), dark = K.paint('#2a2c34', { rough: 0.4 }), glass = K.paint('#2c3e52', { rough: 0.06, metal: 0.4, coat: 1 });
  const wheels = [];
  for (const [cx, nose] of [[0, true], [-9.4, false]]) { const c = new THREE.Group(); c.position.x = cx; g.add(c);
    K.rbox(9, 1.5, 2.6, 0.25, green, 0, 1.45, 0, c); K.rbox(9, 1.2, 2.62, 0.25, cream, 0, 2.75, 0, c); K.rbox(9.1, 0.12, 2.66, 0.05, gold, 0, 2.18, 0, c);
    K.rbox(9.1, 0.3, 2.4, 0.15, K.paint('#d8d2c4', { rough: 0.3 }), 0, 3.45, 0, c);
    for (let k = 0; k < 6; k++) for (const s of [-1, 1]) { K.rbox(1.0, 0.75, 0.04, 0.06, glass, -3.6 + k * 1.3, 2.8, s * 1.31, c); K.rbox(1.12, 0.06, 0.05, 0.02, chrome, -3.6 + k * 1.3, 2.4, s * 1.33, c); }
    for (const s of [-1, 1]) { const d = K.rbox(0.9, 1.9, 0.04, 0.05, K.paint('#c0392b', { rough: 0.3 }), 3.0 * (cx === 0 ? 1 : -1), 2.1, s * 1.32, c); }
    for (const x of [-3.2, 3.2]) { K.rbox(1.6, 0.4, 2.2, 0.08, dark, x, 0.55, 0, c); for (const dx of [-0.5, 0.5]) for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(x + dx, 0.42, s * 0.72); c.add(w);
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 24), dark); wh.rotation.x = Math.PI / 2; w.add(wh); const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 12), gold); hb.rotation.x = Math.PI / 2; w.add(hb);
        for (let k = 0; k < 6; k++) { const sp = K.rbox(0.05, 0.7, 0.05, 0.01, chrome, 0, 0, s * 0.08, w); sp.rotation.z = k * Math.PI / 6; } wheels.push(w); } }
    if (nose) { const n = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 20, 0, Math.PI), green); n.rotation.y = Math.PI / 2; n.scale.set(1.0, 1.05, 0.7); n.position.set(4.5, 2.0, 0); c.add(n);
      K.rbox(0.1, 0.9, 1.9, 0.1, glass, 5.25, 2.75, 0, c); const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2.2) })); lamp.position.set(5.3, 1.65, 0); c.add(lamp);
      const lr = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 10, 24), gold); lr.rotation.y = Math.PI / 2; lr.position.set(5.32, 1.65, 0); c.add(lr);
      const ds = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.34), K.set.textMat('8:15  TIDYTON', { bg: '#1a1a1a', fg: '#ffb020', w: 512, h: 128, border: false })); ds.position.set(5.36, 3.35, 0); ds.rotation.y = Math.PI / 2; c.add(ds);
      K.rbox(0.3, 0.3, 2.4, 0.1, chrome, 5.2, 0.9, 0, c); const bell = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10, 0, Math.PI * 2, 0, 1.9), gold); bell.position.set(3.8, 3.7, 0); c.add(bell); } }
  g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return { g, wheels }; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { BANNED: wf(0, 'banned'), UGLY: wf(0, 'ugly'), ROCKS: wf(0, 'rocks'), LAWN: wf(1, 'lawn'), TULIPS: wf(1, 'tulips'), GNOME: wf(1, 'gnome'), LOVELY: wf(2, 'lovely'), RAIN: wf(2, 'rain'), PUDDING: wf(2, 'pudding'),
      SANK: wf(3, 'sank'), WOBBLY: wf(3, 'wobbly'), SPAG: wf(3, 'spaghetti'), TRAIN: wf(4, 'train'), BOUNCING: wf(4, 'bouncing'), ROCKING: wf(4, 'rocking'), AT: wf(4, 'at'), GRASS: wf(5, 'grass'), LADDER: wf(5, 'ladder'), SPOT: wf(5, 'spot'),
      FIX: wf(6, 'fix'), MOW: wf(6, 'mow'), COW: wf(6, 'cow'), FREE: wf(6, 'free'), FRIDAY: wf(7, 'friday'), STUCK: wf(7, 'stuck'), FASTER: wf(7, 'faster'), DOING: wf(8, 'doing'),
      PRESSES: wf(9, 'presses'), ELEPH: wf(9, 'elephants'), SHARP: wf(9, 'sharp'), PUZZLE: wf(9, 'puzzle'), STILL: wf(9, 'still'), RUNS: wf(10, 'runs'), GAPS: wf(10, 'gaps'), SPONGE: wf(10, 'sponge'),
      BACK: wf(11, 'back'), MONDAY: wf(11, 'monday'), PAINTED: wf(12, 'painted'), PINK: wf(12, 'pink'), APPROVED: wf(12, 'approved') };
    const wood = K.mat('wood', '#7a5234', { detail: 0.5 }), steel = K.paint('#8a8c94', { rough: 0.25, metal: 0.8 }), gold = K.gold(), chrome = K.chrome(), dark = K.paint('#2a2c34', { rough: 0.4 });
    // ================= Tidyton: fields, station, platform =================
    const G = K.group();
    const ground = new THREE.PlaneGeometry(240, 160, 120, 80); ground.rotateX(-Math.PI / 2); const GP = ground.attributes.position;
    for (let i = 0; i < GP.count; i++) { const x = GP.getX(i), z = GP.getZ(i); GP.setY(i, -0.05 + (z < -14 ? Math.min(6, (-14 - z) * 0.18) * (0.6 + 0.4 * Math.sin(x * 0.08)) : 0)); }
    ground.computeVertexNormals(); K.add(ground, K.mat('grime', '#6aa84f', { amt: 0.6 }), 0, 0, 0, G);
    for (let k = 0; k < 10; k++) K.slab(-110 + k * 22, -100 + k * 22, 0.0, 0.03, -13.5, -4.5, K.mat('dirt', k % 2 ? '#b89a5a' : '#8a6a3a', { detail: 0.8 }), G, false);     // fields
    // platform (with edge stripe), station building, clock, benches, lamps, flower boxes, signs
    K.slab(-16, 16, 0, 0.9, 2.3, 6.5, K.mat('rock', '#b8b0a4', { detail: 0.6 }), G); K.slab(-16, 16, 0.9, 0.93, 2.3, 2.7, K.paint('#f2c230', { rough: 0.6 }), G, false);
    const st = S.building({ w: 14, d: 6, floors: 2, seed: 3, color: '#e8d8b8', kind: 'brick', gable: 'step', shop: 'TIDYTON STATION', awning: ['#1f6a4a', '#f4efe4'], shutters: '#1f6a4a', flowers: true }); st.position.set(0, 0.9, 13.0); st.rotation.y = Math.PI;
    const ck = new THREE.Group(); ck.position.set(4.5, 3.2, 5.6); G.add(ck); K.cyl(0.05, 0.05, 2.3, dark, 0, -2.3, 0, ck, 8);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32), K.paint('#f4f2ee', { rough: 0.3 })); face.rotation.x = Math.PI / 2; ck.add(face); const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 10, 32), gold); rim.position.z = 0.0; ck.add(rim);
    for (const s of [-1, 1]) { const nums = new THREE.Mesh(new THREE.CircleGeometry(0.46, 32), new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(w / 2 + Math.sin(a) * 100 - 4, h / 2 - Math.cos(a) * 100 - 10, 8, 20); } }), roughness: 0.4 })); nums.position.z = s * 0.062; if (s < 0) nums.rotation.y = Math.PI; ck.add(nums); }
    CLOCKH = new THREE.Group(); CLOCKM = new THREE.Group(); for (const [gq, l] of [[CLOCKH, 0.26], [CLOCKM, 0.38]]) { gq.position.z = -0.08; ck.add(gq); const h = new THREE.Mesh(new THREE.BoxGeometry(0.04, l, 0.02), dark); h.position.y = l / 2; gq.add(h); }
    for (const [bx, bz] of [[-8, 5.4], [8, 5.4], [-3, 5.4]]) { const b = S.bench(); b.position.set(bx, 0.9, bz); b.rotation.y = Math.PI; }
    for (const lx of [-13, -6, 1, 9, 14]) { const l = S.streetLamp(); l.position.set(lx, 0.9, 2.9); }
    for (let k = 0; k < 6; k++) { const p = S.planter(); p.position.set(-14 + k * 5.6, 0.9, 6.0); }
    const nb = S.board('TIDYTON|PRETTIEST TOWN 3 YEARS RUNNING', 2.8, 1.3, { frame: '#1f6a4a' }); nb.position.set(-10.5, 0.9, 4.9); nb.rotation.y = Math.PI;
    const tt = S.board('TIMETABLE|8:15 ........ ON TIME', 1.6, 1.2, { frame: '#5a3a24' }); tt.position.set(6.6, 0.9, 5.6); tt.rotation.y = Math.PI;
    // signal post + level-crossing sign + fence + trees + cottages beyond the fields
    const sg = new THREE.Group(); sg.position.set(18, 0, -2.4); G.add(sg); K.cyl(0.08, 0.1, 5, K.paint('#f4f2ee'), 0, 0, 0, sg, 10); K.rbox(1.2, 0.25, 0.08, 0.04, K.paint('#c0392b'), 0.5, 4.6, 0, sg); K.rbox(0.25, 0.25, 0.1, 0.02, K.paint('#f4f2ee'), 0.85, 4.6, 0.02, sg);
    for (let x = -60; x < 60; x += 2.2) { K.cyl(0.05, 0.05, 1.1, wood, x, 0, -3.6, G, 6); } K.slab(-60, 60, 0.75, 0.82, -3.63, -3.57, wood, G); K.slab(-60, 60, 0.4, 0.47, -3.63, -3.57, wood, G);
    for (let k = 0; k < 24; k++) { const t = S.tree({ h: 4 + hash(k) * 3, seed: k + 7 }); t.position.set(-70 + k * 6 + hash(k) * 3, 0, -16 - hash(k + 1) * 10); }
    for (let k = 0; k < 6; k++) { const c = S.building({ w: 5, d: 4, floors: 1, seed: 30 + k, gable: 'pitched', kind: k % 2 ? 'plaster' : 'brick', color: ['#f0e0c8', '#e8d0d8', '#d8e8d0'][k % 3], flowers: true }); c.position.set(-40 + k * 14, 0, -22 - (k % 2) * 4); }
    S.bake(G);
    // ================= the track: sleepers + rails (move), rocks (gray / pink), lawn -> mud, tulips, gnome, tall grass =================
    for (let x = SX0; x <= SX1; x += 0.7) { const s = K.rbox(0.26, 0.16, 2.6, 0.03, wood, x, 0.36, 0, sc); SLEEPERS.push(s); }
    for (const z of [-0.72, 0.72]) for (let x = SX0; x < SX1; x += 1.5) { const r = new THREE.Group(); r.position.set(x + 0.75, 0.5, z); sc.add(r); K.rbox(1.52, 0.14, 0.08, 0.02, steel, 0, 0, 0, r); K.rbox(1.52, 0.04, 0.16, 0.01, steel, 0, -0.06, 0, r); r.userData.x = x + 0.75; RAILS.push(r); }
    ROCKS = rockBed(K, sc, '#8a8a8e', 700, SX0 - 0.5, SX1 + 0.5, 3); PINK = rockBed(K, sc, '#f28ab8', 700, SX0 - 0.5, SX1 + 0.5, 3); S.bake(ROCKS); S.bake(PINK);
    LAWNM = K.mat('grime', '#5ab83a', { amt: 0.5 }); LAWN = new THREE.Mesh(new THREE.BoxGeometry(SX1 - SX0 + 1, 0.3, 3.4), LAWNM); LAWN.position.set(0, 0.15, 0); LAWN.receiveShadow = true; sc.add(LAWN);
    MUD = new THREE.Mesh(new THREE.BoxGeometry(SX1 - SX0 + 1, 0.3, 3.4), K.mat('dirt', '#4a2e1a', { detail: 0.6 })); MUD.position.set(0, 0.16, 0); sc.add(MUD);
    TULIPS = K.group(); for (let k = 0; k < 120; k++) { const x = SX0 + hash(k) * (SX1 - SX0), z = (hash(k + 1) - 0.5) * 3.2; if (Math.abs(z) > 0.55 && Math.abs(z) < 0.9) continue; K.cyl(0.012, 0.012, 0.32, K.paint('#3a8a2a'), x, 0.3, z, TULIPS, 5);
      const fl = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 8), K.paint(['#e8302a', '#f2c230', '#e86a9a', '#f4f2ee'][k % 4], { rough: 0.4 })); fl.rotation.x = Math.PI; fl.position.set(x, 0.68, z); TULIPS.add(fl); }
    S.bake(TULIPS);
    GNOME = new THREE.Group(); GNOME.position.set(1.2, 0.3, 1.1); sc.add(GNOME); K.cyl(0.13, 0.16, 0.3, K.paint('#2a62c8'), 0, 0, 0, GNOME, 14); const gh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), K.paint('#f6d2b0')); gh.position.y = 0.4; GNOME.add(gh);
    const gb = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 12), K.paint('#f4f2ee')); gb.rotation.x = Math.PI; gb.position.set(0, 0.32, 0.05); GNOME.add(gb); const gc = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.32, 14), K.paint('#c0392b')); gc.position.y = 0.6; GNOME.add(gc);
    { const g2 = K.group(); for (let k = 0; k < 260; k++) { const x = SX0 + hash(k + 40) * (SX1 - SX0), z = (hash(k + 41) - 0.5) * 3.4; const b = K.cyl(0.02, 0.05, 1, K.paint(k % 3 ? '#5aa83a' : '#7ac04a', { rough: 0.8 }), x, 0.25, z, g2, 4); b.rotation.set((hash(k) - 0.5) * 0.3, 0, (hash(k + 2) - 0.5) * 0.3); } S.bake(g2); TALL.push(g2); }
    // mower, wheelbarrow + BANNED sign, ladder, dump truck
    MOWER = new THREE.Group(); sc.add(MOWER); K.rbox(0.6, 0.25, 0.45, 0.06, K.paint('#c0392b', { rough: 0.3 }), 0, 0.25, 0, MOWER); for (const x of [-0.25, 0.25]) for (const z of [-0.22, 0.22]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 14), dark); w.rotation.x = Math.PI / 2; w.position.set(x, 0.1, z); MOWER.add(w); }
    const hd = K.rbox(0.05, 0.05, 1.0, 0.02, chrome, -0.55, 0.65, 0, MOWER); hd.rotation.z = 0; const hb = K.cyl(0.02, 0.02, 1.0, chrome, -0.5, 0.25, 0, MOWER, 8); hb.rotation.z = 0.9;
    BARROW = new THREE.Group(); BARROW.position.set(-1.4, 0.3, 2.0); sc.add(BARROW); K.rbox(0.9, 0.35, 0.6, 0.08, K.paint('#2a6a9a', { rough: 0.3 }), 0, 0.45, 0, BARROW); const bw = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 14), dark); bw.rotation.x = Math.PI / 2; bw.position.set(0.5, 0.16, 0); BARROW.add(bw);
    for (let k = 0; k < 14; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 0), K.mat('rock', '#8a8a8e')); r.position.set((hash(k) - 0.5) * 0.6, 0.66 + hash(k + 1) * 0.1, (hash(k + 2) - 0.5) * 0.4); BARROW.add(r); }
    BANSIGN = S.protestSign('ROCKS|BANNED!', { bg: '#f4ead2' }); BANSIGN.position.set(-2.6, 0.3, 0.9); BANSIGN.rotation.y = 0.5;
    LADDER = new THREE.Group(); sc.add(LADDER); for (const x of [-0.25, 0.25]) K.rbox(0.06, 3.2, 0.06, 0.02, K.mat('wood', '#c8a070'), x, 1.6, 0, LADDER); for (let k = 0; k < 9; k++) K.rbox(0.5, 0.04, 0.05, 0.01, K.mat('wood', '#c8a070'), 0, 0.3 + k * 0.33, 0, LADDER);
    TRUCK = S.car({ kind: 'van', color: '#f2c230', plate: 'ROCKS-1' });
    TRAIN = train(K);
    // ================= cutaway stage (x = ELX): elephants on a track, x-ray of the rock bed, rain through the gaps, a sponge =================
    const EG = K.group(); K.slab(ELX - 30, ELX + 30, -0.1, 0, -20, 20, K.mat('grime', '#6aa84f', { amt: 0.6 }), EG, false); S.bake(EG);
    const er = rockBed(K, sc, '#8a8a8e', 260, ELX - 8, ELX + 8, 11); S.bake(er);
    for (let x = ELX - 8; x <= ELX + 8; x += 0.7) K.rbox(0.26, 0.16, 2.6, 0.03, wood, x, 0.36, 0, sc);
    for (const z of [-0.72, 0.72]) K.rbox(16, 0.14, 0.08, 0.02, steel, ELX, 0.5, z, sc);
    for (let k = 0; k < 3; k++) ELE.push(K.animal('elephant', { seed: 5 + k, scale: 1.0 }));
    HOLO = K.holoBox(16, 0.7, 3.4, ELX, 0.2, 0, sc, '#36e2ff');
    for (let k = 0; k < 10; k++) { const t = S.tree({ h: 4 + hash(k + 70) * 3, seed: k + 70 }); t.position.set(ELX - 20 + k * 4.4, 0, -8 - hash(k + 71) * 6); }
    const eb = S.board('1 TRAIN =|300 ELEPHANTS', 2.6, 1.3, { frame: '#1f6a4a' }); eb.position.set(ELX + 6.5, 0, -2.2); eb.rotation.y = -0.3;
    PUZBIG = new THREE.Group(); PUZBIG.position.set(ELX, 1.5, 3.0); sc.add(PUZBIG); const rk = K.mat('rock', '#9a9aa0', { detail: 0.15 });
    for (let k = 0; k < 16; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), rk); r.position.set(-0.75 + (k % 4) * 0.48 + (Math.floor(k / 4) % 2) * 0.22, -0.65 + Math.floor(k / 4) * 0.42, (hash(k) - 0.5) * 0.3); r.rotation.set(hash(k) * 3, hash(k + 1) * 3, hash(k + 2) * 3); r.castShadow = true; PUZBIG.add(r);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(r.geometry), new THREE.LineBasicMaterial({ color: new THREE.Color('#7af8a0').multiplyScalar(1.6), toneMapped: false })); e.position.copy(r.position); e.rotation.copy(r.rotation); e.scale.setScalar(1.01); e.userData.ndSkip = true; PUZBIG.add(e); }
    K.rbox(2.2, 0.18, 0.6, 0.03, K.mat('wood', '#7a5234'), 0.05, 1.05, 0, PUZBIG); K.rbox(2.2, 0.12, 0.08, 0.02, K.paint('#8a8c94', { rough: 0.25, metal: 0.8 }), 0.05, 1.21, 0, PUZBIG);
    const pf = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.06, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); pf.position.set(0.05, 0.1, 0); pf.userData.ndSkip = true; PUZBIG.add(pf);
    for (let k = 0; k < 9; k++) { const pts = []; const x0 = ELX - 3 + k * 0.7; for (let j = 0; j < 7; j++) pts.push([x0 + (j % 2 ? 0.15 : -0.12), 0.05 + j * 0.045, 1.75]); PUZ.push(K.trace(pts, { color: '#7af8a0', r: 0.02 })); }
    for (let k = 0; k < 7; k++) { const g = new THREE.Group(); sc.add(g); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a3a').multiplyScalar(1.8), toneMapped: false });
      const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 10), m); s1.position.y = 0.4; g.add(s1); const h1 = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 12), m); h1.rotation.x = Math.PI; h1.position.y = -0.1; g.add(h1); g.position.set(ELX - 3 + k * 1.0, 1.4, 1.75); g.traverse((o) => { o.userData.ndSkip = true; }); ARROWS.push(g); }
    SPONGE = new THREE.Group(); SPONGE.position.set(ELX + 5, 0.55, 3.2); sc.add(SPONGE); K.rbox(1.0, 0.5, 0.7, 0.12, K.paint('#f2d030', { rough: 0.9 }), 0, 0, 0, SPONGE); K.rbox(1.02, 0.14, 0.72, 0.05, K.paint('#3a9a4a', { rough: 0.8 }), 0, 0.3, 0, SPONGE);
    for (let k = 0; k < 14; k++) { const h = new THREE.Mesh(new THREE.CircleGeometry(0.04, 10), K.paint('#c8a020')); h.position.set(-0.4 + (k % 7) * 0.13, -0.12 + Math.floor(k / 7) * 0.16, 0.352); SPONGE.add(h); }
    // ================= characters =================
    MAYOR = K.stick({ jacket: '#e86a9a', pants: '#3a3a48', hairStyle: 'bun', hair: '#c8c0b8', glasses: true, scarf: '#f2c230', badge: true, belt: '#3a2418', dress: '#e86a9a', collar: '#ffffff' }, { key: 'mayor' });
    MASTER = K.stick({ jacket: '#1f3a6a', pants: '#1f3a6a', hat: 'police', hatColor: '#1f3a6a', moustache: '#8a5a34', tie: '#c0392b', badge: true, belt: '#1a1a1a' }, { key: 'master' });
    DRIVER = K.stick({ jacket: '#1f6a4a', pants: '#2a2a30', hat: 'cap', cap: '#1f6a4a', moustache: '#3a2418', scarf: '#f4f2ee', gloves: '#1a1a1a' }, { key: 'driver' });
    COW = K.animal('cow', { seed: 2, scale: 1.0 });
    EXTRAS = S.extras(5, { x0: -12, len: 22, z: 4.4, spread: 1.4, seed: 51, stillShare: 0.7 });
    for (const e of EXTRAS) e.yOff = 0.9;
    K.addClouds(10, 700, 140);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const cut = (f >= 903 && f < 1205), wet = f >= F.RAIN - 6 && f < 903;
    // ---------- the track state ----------
    const lawnOn = f >= F.LAWN - 4 && f < F.BACK, pinkOn = f >= F.PINK - 4;
    ROCKS.visible = f < F.LAWN - 4 || (f >= F.BACK && !pinkOn); PINK.visible = pinkOn;
    const mud = sm(F.RAIN, F.PUDDING + 6, f) * (lawnOn ? 1 : 0);
    LAWN.visible = lawnOn && mud < 0.98; MUD.visible = lawnOn && mud > 0.02; MUD.position.y = 0.16 + (1 - mud) * -0.2; TULIPS.visible = lawnOn && f < F.SANK + 30; GNOME.visible = lawnOn;
    GNOME.position.y = 0.3 - 0.25 * sm(F.SANK, F.SANK + 40, f); GNOME.rotation.z = 0.3 * sm(F.SANK, F.SANK + 40, f);
    const sink = lawnOn ? 0.17 * sm(F.SANK - 4, F.SANK + 10, f) : 0, wob = lawnOn ? sm(F.WOBBLY - 4, F.SPAG, f) : 0;
    const wy = (x) => sink * 0.9 - wob * 0.12 * (0.5 + 0.5 * Math.sin(x * 0.9 + 1)) - wob * 0.05 * Math.sin(x * 2.3);
    for (const s of SLEEPERS) { s.position.y = 0.36 - sink - wob * 0.12 * (0.5 + 0.5 * Math.sin(s.position.x * 0.9 + 1)); s.rotation.z = wob * 0.15 * Math.sin(s.position.x * 1.7); }
    for (const r of RAILS) { const x = r.userData.x; r.position.y = 0.5 - wy(x); r.rotation.z = -wob * 0.12 * Math.cos(x * 0.9 + 1) * 0.9; r.rotation.y = wob * 0.08 * Math.sin(x * 1.3); }
    const tall = lawnOn ? lerp(0.15, 3.2, sm(F.GRASS - 4, F.LADDER, f)) * (f < F.MOW ? 1 : lerp(1, 0.15, sm(F.COW, F.FREE + 10, f))) : 0; TALL[0].visible = tall > 0.17 && f >= F.GRASS - 4; TALL[0].scale.y = Math.max(0.01, tall);
    // ---------- the train ----------
    let tx = -60, ty = 0, tp = 0, spin = 0; TRAIN.g.visible = !cut;
    if (f >= 406 && f < 543) { tx = lerp(-35, 2, sm(406, 520, f)); ty = Math.abs(Math.sin(f * 0.35)) * 0.35; tp = 0.06 * Math.sin(f * 0.35); spin = tx; }
    else if (f >= 543 && f < 663) { tx = 2; spin = 2; }
    else if (f >= 775 && f < 903) { tx = -4; ty = -0.25; spin = f * 0.4; }
    else if (f >= 1205) { tx = lerp(-40, 30, clamp((f - 1253) / 140, 0, 1)); ty = 0; spin = tx; }
    TRAIN.g.position.set(tx, ty - (f >= 406 && f < 903 ? sink * 0.8 : 0), 0); TRAIN.g.rotation.z = tp; for (const w of TRAIN.wheels) w.rotation.z = -spin / 0.42;
    // station clock: 8:15 -> 11:40 on "At"
    const tm = f < F.AT - 4 ? 8 + 15 / 60 : lerp(8.25, 11 + 40 / 60, sm(F.AT - 4, F.AT + 10, f)); CLOCKH.rotation.z = (tm % 12) / 12 * Math.PI * 2; CLOCKM.rotation.z = (tm % 1) * Math.PI * 2; CLOCKM.position.z = -0.1;
    // mower, barrow, ladder, truck
    BARROW.visible = BANSIGN.visible = f < F.LAWN - 4;
    MOWER.visible = f >= 663 && f < 720; LADDER.visible = f >= 543 && f < 663; LADDER.position.set(2.5, 0.9, 2.45); LADDER.rotation.x = 0.2;
    TRUCK.g.visible = f >= 1205 && f < 1253; TRUCK.g.position.set(lerp(-14, -6, sm(1205, 1240, f)), 0, -2.6);
    // ---------- characters ----------
    let mp = { visible: false };
    if (f < 112) mp = { x: -1.0, z: 1.15, yaw: 0.5 };
    else if (f < 310) mp = { x: 0.3, z: 2.0, yaw: 0.3 };
    else if (f >= 663 && f < 720) { const W = K.walkPath(f, 663, [[-2.5, 0.0], [1.0, 0.0]], 1.1); mp = { x: W.x - 0.9, z: W.z, yaw: Math.PI / 2 }; MOWER.position.set(W.x, 0.3 - sink, W.z); }
    else if (f >= 848 && f < 903) mp = { x: -0.8, z: 3.3, y: 0.9, yaw: -0.3 };
    else if (f >= 1253) mp = { x: 2.0, z: 1.75, yaw: -0.3 };
    const mk = [[0, 'dig', { expr: 'stern' }], [F.UGLY - 4, 'point', { expr: 'angry' }], [112, 'show', { expr: 'proud' }], [F.TULIPS, 'cheer', { expr: 'grin' }], [F.GNOME, 'hips', { expr: 'smug' }], [F.RAIN - 2, 'shock', { expr: 'shock' }], [F.PUDDING, 'facepalm', { expr: 'pained' }],
      [663, 'push', { expr: 'stern', phase: (f / 18) % 1 }], [690, 'push', { expr: 'nervous', sweat: true }], [848, 'think', { expr: 'confused' }], [F.DOING - 2, 'shrug', { expr: 'confused', sweat: true }],
      [1253, 'hold', { expr: 'proud', R: [0.4, -0.6, 'hammer'] }], [F.PAINTED, 'hold', { expr: 'proud', R: [0.45, -0.85, 'hammer'] }], [F.APPROVED, 'cheer', { expr: 'laugh' }]];
    MAYOR.set(T.act(f, mk, { seed: 3, blink: blink(3), phase: (f / 20) % 1 }), mp);
    // station master: on the ladder with the timetable, peering at the 8:15
    let sp = { visible: false };
    if (f >= 406 && f < 543) sp = { x: 3.5, z: 3.8, y: 0.9, yaw: -2.2 };
    if (f >= 543 && f < 663) sp = { x: 2.5, z: 2.75, y: 0.9 + 1.45 * sm(F.GRASS, F.LADDER + 6, f), yaw: Math.PI + 0.1 };
    MASTER.set(T.act(f, [[0, 'read', { expr: 'neutral', item: 'paper' }], [F.BOUNCING - 4, 'shock', { expr: 'shock' }], [F.AT, 'facepalm', { expr: 'pained' }], [543, 'idle', { expr: 'nervous', sweat: true }], [F.SPOT - 6, 'ears', { expr: 'confused', sweat: true }]], { seed: 6, blink: blink(6) }), sp);
    // driver in the cab window: bouncing, then stuck
    DRIVER.set(T.act(f, [[0, 'sit', { expr: 'grin' }], [F.BOUNCING, 'sit', { expr: 'nervous', sweat: true, shake: 1 }], [775, 'sit', { expr: 'pained', sweat: true }], [F.FASTER, 'facepalm', { expr: 'sad' }], [1205, 'wave', { expr: 'grin' }]], { seed: 8, blink: blink(8) }),
      !cut && TRAIN.g.visible && (f >= 406 && f < 663 || f >= 775 && f < 903 || f >= 1205) ? { x: tx + 3.9, y: ty + 1.25 - (f >= 406 && f < 903 ? sink * 0.8 : 0), z: 0.45, yaw: Math.PI / 2, seat: 0.45 } : { visible: false });
    // the cow: moves in (mows for free), then walks past the stuck train; lies on the pink rocks
    let cp = { visible: false };
    if (f >= F.COW - 6 && f < 775) cp = { x: 2.6, z: -0.2, yaw: -Math.PI / 2 + 0.4, mode: 'eat', expr: 'happy' };
    else if (f >= 775 && f < 903) { const W = K.walkPath(f, 775, [[-12, -2.2], [12, -2.2]], 1.4); cp = { x: W.x, z: W.z, yaw: W.yaw, mode: 'walk', expr: 'happy' }; }
    else if (f >= 1253) cp = { x: -1.6, z: 1.0, yaw: 0.5, mode: f > F.APPROVED - 4 ? 'sit' : 'stand', expr: 'happy' };
    COW.set(f, { ...cp, visible: cp.visible !== false && !cut });
    // elephants on the cutaway track
    ELE.forEach((e, k) => e.set(f, { x: ELX - 2.5 + k * 2.6, z: 0, y: 0.38, yaw: Math.PI / 2, mode: k === 1 && f > F.ELEPH ? 'stand' : 'stand', lift: k === 1 ? sm(F.ELEPH, F.ELEPH + 10, f) * 0.6 : 0, expr: 'happy', visible: f >= 903 && f < F.SHARP + 4 }));
    HOLO.visible = f >= F.SHARP - 4 && f < 1205; PUZ.forEach((p) => p.show(f >= 1000 && f < 1205 ? sm(F.PUZZLE - 6, F.PUZZLE + 14, f) : 0));
    ARROWS.forEach((a, k) => { a.visible = f >= F.PRESSES - 2 && f < F.SHARP + 4; a.position.y = 3.6 - 0.25 * Math.abs(Math.sin(f * 0.25 + k)); });
    PUZBIG.visible = f >= 960 && f < 1150; PUZBIG.rotation.y = 0.15 * Math.sin(f * 0.03); PUZBIG.position.y = 1.5 - 0.04 * Math.abs(Math.sin(f * 0.2));
    SPONGE.visible = f >= F.RUNS && f < 1205; SPONGE.scale.set(1, 1 - 0.18 * sm(F.SPONGE - 4, F.SPONGE + 6, f) + 0.05 * Math.sin(f * 0.3), 1);
    K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) { e.r.root.position.y += 0.9; e.r.root.visible = !cut && (f < 406 || f >= 1253); }

    // ---------- shots ----------
    let cam, dof, u, light; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const day = K.light('morning', { az: 140, el: 28, shadowExt: 22 }), rain = K.light('overcast', { az: 150, el: 40, shadowExt: 20 }), gold_ = K.light('golden', { az: 130, el: 22 });
    const hd = (p, y = 1.6) => [p.x, (p.y || 0) + y, p.z];
    if (sh(0, 55)) {             // 1. the mayor shovels the "ugly" rocks into a wheelbarrow (BANNED sign)
      cam = { pos: [0.9, 1.45, 3.3], look: [-1.3, 1.05, 1.1], fov: 46 * K.push(u, 0.1) }; dof = { focus: 3.0, cinf: 9 }; light = day;
    } else if (sh(55, 109)) {    // 2. wide: Tidyton station, the track and the rocks (crane down)
      cam = { pos: [lerp(10, 8, u), lerp(5.5, 4, u), 11], look: [-1, 1, 0], fov: 46 }; dof = { focus: 14, cinf: 3 }; light = day;
    } else if (sh(109, 155)) {   // 3. the lawn: tulips pop up (low along the track)
      cam = { pos: [-6, 0.7, 1.9], look: [2, 0.5, 0], fov: 46 * K.push(u, 0.08) }; dof = { focus: 5, cinf: 7 }; light = day;
    } else if (sh(155, 199)) {   // 4. the gnome (insert) + the proud mayor behind
      cam = { pos: [1.7, 0.75, 2.4], look: [1.15, 0.6, 1.1], fov: 38 * K.push(u, 0.12) }; dof = { focus: 1.4, cinf: 14 }; light = day;
    } else if (sh(199, 250)) {   // 5. "lovely" -> the first rain (mayor's face)
      const h = hd(mp); cam = { pos: [h[0] + 1.2, h[1], h[2] + 2.0], look: [h[0], h[1] - 0.1, h[2]], fov: 38 }; dof = { focus: 2.3, cinf: 12 }; light = f < F.RAIN ? day : rain;
    } else if (sh(250, 307)) {   // 6. the lawn becomes chocolate pudding (low macro, push)
      cam = { pos: [-1.6, 1.5, 2.4], look: [0.6, 0.2, 0], fov: 42 * K.push(u, 0.12) }; dof = { focus: 3.0, cinf: 10 }; light = rain;
    } else if (sh(307, 355)) {   // 7. the sleepers sink (side, low)
      cam = { pos: [0.5, 0.75, 2.8], look: [0.5, 0.25, 0], fov: 42 }; dof = { focus: 2.8, cinf: 10 }; light = rain;
    } else if (sh(355, 403)) {   // 8. the rails go wobbly like cooked spaghetti (down the track)
      cam = { pos: [-9, 1.2, 0.2], look: [6, 0.4, 0], fov: 40 * K.punch(f, F.SPAG, 0.12, 6) }; dof = { focus: 8, cinf: 4 }; light = rain;
    } else if (sh(403, 470)) {   // 9. the 8:15 bounces in like a rocking horse (head-on, low, tracking)
      cam = { pos: [14, 1.6, 2.6], look: [tx + 5, 1.9, 0], fov: 44 }; dof = { focus: 9, cinf: 4 }; light = rain;
    } else if (sh(470, 543)) {   // 10. the station clock says 11:40; the station master facepalms
      cam = { pos: [2.7, 2.5, 2.0], look: [4.1, 2.45, 5.4], fov: 46 * K.punch(f, F.AT, 0.15, 6) }; dof = { focus: 3.6, cinf: 10 }; light = rain;
    } else if (sh(543, 600)) {   // 11. the grass grows over the train (low)
      cam = { pos: [-3, 1.3, 4.5], look: [1.5, 1.6, 0], fov: 46 }; dof = { focus: 5.5, cinf: 6 }; light = day;
    } else if (sh(600, 663)) {   // 12. the station master climbs a ladder to spot the train (crane up)
      const h = hd(sp); cam = { pos: [h[0] + 0.9, h[1] + lerp(-0.2, 0.3, u), h[2] - 2.1], look: [h[0], h[1] - 0.1, h[2]], fov: 42 }; dof = { focus: 2.4, cinf: 12 }; light = day;
    } else if (sh(663, 720)) {   // 13. her fix: she mows the tracks (tracking)
      const tc = K.track(f, (g) => { const W = K.walkPath(g, 663, [[-2.5, 0.0], [1.0, 0.0]], 1.1); return [W.x - 0.9, 0, W.z]; }, { off: [2.6, 1.1, 3.0], lag: 4, lead: 0.2, lookY: 1.2 }); cam = { ...tc, fov: 44 }; dof = { focus: 3.8, cinf: 9 }; light = day;
    } else if (sh(720, 775)) {   // 14. a cow moves in and mows for free (close, push)
      cam = { pos: [4.6, 1.3, 2.2], look: [2.6, 0.8, -0.2], fov: 40 * K.push(u, 0.12) }; dof = { focus: 3, cinf: 11 }; light = day;
    } else if (sh(775, 848)) {   // 15. Friday: the train stuck in the mud, the cow walks faster (tracking the cow)
      const tc = K.track(f, (g) => { const W = K.walkPath(g, 775, [[-12, -2.2], [12, -2.2]], 1.4); return [W.x, 0, W.z]; }, { off: [-2.6, 1.2, -0.85], lag: 4, lead: 0.2, lookY: 1.0 }); cam = { ...tc, fov: 48 }; dof = { focus: 5, cinf: 5 }; light = rain;
    } else if (sh(848, 903)) {   // 16. re-hook: the mayor, confused, on the platform
      const h = hd(mp); cam = { pos: [h[0] - 1.1, h[1] + 0.05, h[2] - 2.0], look: [h[0], h[1] - 0.1, h[2]], fov: 38 * K.push(u, 0.1) }; dof = { focus: 2.3, cinf: 13 }; light = rain;
    } else if (sh(903, 960)) {   // 17. cutaway: elephants stand on a track (it presses like 300 of them)
      cam = { pos: [ELX + 1, 2.4, 9], look: [ELX, 1.4, 0], fov: 46 }; dof = { focus: 9, cinf: 4 }; light = day;
    } else if (sh(960, 1030)) {  // 18. x-ray: sharp rocks lock together like puzzle pieces
      cam = { pos: [ELX + lerp(-0.5, 0.5, u), 1.8, 7.2], look: [ELX, 1.5, 3.0], fov: 42 }; dof = { focus: 4.2, cinf: 8 }; light = day;
    } else if (sh(1030, 1100)) { // 19. macro: the interlocked rocks hold the sleepers still (low)
      cam = { pos: [ELX + 1.2, 2.2, 5.6], look: [ELX, 1.6, 3.0], fov: 40 * K.push(u, 0.12) }; dof = { focus: 2.9, cinf: 12 }; light = day;
    } else if (sh(1100, 1150)) { // 20. rain runs straight through the gaps
      cam = { pos: [ELX - 1.4, 1.4, 6.6], look: [ELX, 1.3, 3.0], fov: 44 }; dof = { focus: 3.8, cinf: 9 }; light = rain;
    } else if (sh(1150, 1205)) { // 21. grass is a sponge (the sponge squishes)
      cam = { pos: [ELX + 6.2, 1.5, 6.2], look: [ELX + 5, 0.6, 3.2], fov: 42 * K.push(u, 0.1) }; dof = { focus: 3.3, cinf: 10 }; light = rain;
    } else if (sh(1205, 1253)) { // 22. Monday: the rock truck, the rocks are back (wide)
      cam = { pos: [6, 3.2, 9], look: [-3, 0.8, -1], fov: 46 }; dof = { focus: 11, cinf: 3 }; light = gold_;
    } else if (sh(1253, 1310)) { // 23. pink rocks! the mayor with her paint roller, the cow lies down
      cam = { pos: [4.6, 2.6, 5.0], look: [1.3, 0.6, 1.2], fov: 46 * K.push(u, 0.1) }; dof = { focus: 5.5, cinf: 7 }; light = gold_;
    } else {                     // 24. the cow approves (close), the 8:15 glides past on time behind
      cam = { pos: [-0.1, 1.0, 3.6], look: [-1.5, 0.8, 1.0], fov: 40 * K.push(u, 0.12) }; dof = { focus: 2.9, cinf: 11 }; light = gold_;
    }
    // ---------- effects + graphics ----------
    if (wet && f < 663) K.rain(f, cam.look, { area: 12, count: 600, speed: 12 });
    if (f >= 775 && f < 903) K.rain(f, cam.look, { area: 12, count: 400, speed: 12 });
    if (f >= 1100 && f < 1205) { K.rain(f, cam.look, { area: 8, count: 400, speed: 10 }); K.rain(f, [ELX, 1.5, 3.0], { area: 3, count: 300, speed: 9 }); }
    if (f >= 775 && f < 903) K.sparks(f, 775, 903, [-4 - 3.2 + 0.5, 0.35, 1.0], { dir: [-1, 0.8, 0.4], spread: 0.4, rate: 6, speed: 2.5, life: 10, color: '#5a3a22', seed: 7 });
    if (f >= 406 && f < 543) for (let k = 0; k < 4; k++) K.puff(f, 420 + k * 18, tx + 3, 1.6, 6, 0.4, '#8a7a6a');
    K.mist(f, 895, 16); K.mist(f, 1197, 16);
    K.badge(f, F.BANNED, 'ROCKS BANNED', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 109 });
    K.badge(f, F.AT, '8:15 → 11:40', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 543 });
    K.badge(f, F.FREE, 'FREE MOWING', [2.6, 2.2, -0.2], { icon: 'check', f1: 775 });
    K.badge(f, F.ELEPH, '= 300 ELEPHANTS', { sx: 0.5, sy: 0.18 }, { icon: 'weight', f1: 960 });
    if (f >= 960 && f < 1100) K.badge(f, F.PUZZLE, 'LOCKED TIGHT', [ELX, 0.55, 3.0], { icon: 'check', f1: 1098 });
    if (f >= 1100 && f < 1150) K.badge(f, F.GAPS, 'WATER RUNS THROUGH', [ELX, 0.5, 3.0], { icon: 'drop', f1: 1148 });
    if (f >= 1150 && f < 1205) K.badge(f, F.SPONGE, 'GRASS = SPONGE', [ELX + 5, 1.3, 3.2], { icon: 'x', f1: 1203 });
    K.badge(f, F.APPROVED, 'COW APPROVED', { sx: 0.5, sy: 0.22 }, { style: 'stamp', size: 1.3 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
