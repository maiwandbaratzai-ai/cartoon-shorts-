// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Some Skyscrapers Hide a Giant Ball" — invented fable (SCRIPTS.md §00): Mira's tuned-mass-damper ball vs Rex's rooftop pool.
// Two tower tops high over Windport: three storms -> Rex's tower sways, pool slops over, tenants leave -> the ball swings the other way.
import { TOTAL, LINES, wf } from './towerball_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let THREE, MIRA, REX, MONKEY, TEN = [], OFFX = [], TM, TR, BALL, CABLES, DAMP = [], POOLW, PWB, CUP, CUP2, ROOM, SWING, TINSEL, HOLOT, ARR_T, ARR_B, CRANEB, EXTRAS = [];
let F = {};
const PIV = 150, OFF = 200, PARK = 300;   // towers pivot 150 m below the roofs; office insert at x = 200; park at x = 300
const RY = 16;                            // roof level of both towers
const PER = 96;                           // sway period (frames)
let AR = () => 0;

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { HUNG: wf(0, 'hung'), TON: wf(0, '600'), BALL: wf(0, 'ball'), WIND: wf(1, 'winds'), KM: wf(1, '150'), LAUGH: wf(2, 'laughed'), ORN: wf(2, 'ornament'), POOL: wf(3, 'pool'), TRIPLE: wf(3, 'triple'),
      STORMS: wf(4, 'storms'), ONE: wf(4, 'one'), SWAYED: wf(4, 'swayed'), NOBODY: wf(4, 'nobody'), TWO: wf(5, 'two'), SLOSH: wf(5, 'sloshed'), COFFEE: wf(5, 'coffee'), GRIN: wf(5, 'grinned'),
      THREE_: wf(6, 'three'), SWUNG: wf(6, 'swung'), WAVED: wf(6, 'waved'), SICK: wf(7, 'seasick'), WALKED: wf(7, 'walked'), PUSHED: wf(8, 'pushed'), WRONG: wf(8, 'wrong'), STOPS: wf(8, 'stops'),
      DOES: wf(9, 'does'), SWAYS: wf(9, 'sways'), OTHER: wf(9, 'other'), PULLS: wf(10, 'pulls'), BARELY: wf(10, 'barely'), SPILL: wf(10, 'spilled'), BEG: wf(11, 'begged'), BORROW: wf(11, 'borrow'),
      SHRUG: wf(12, 'shrugged'), MONKEY: wf(12, 'monkey'), TINSEL: wf(12, 'tinsel') };
    AR = (f) => f < F.ONE - 10 ? 0.06 : f < F.TWO - 6 ? 0.3 : f < F.THREE_ - 6 ? 0.3 + 0.6 * sm(F.TWO - 6, F.SLOSH, f) : f < 1160 ? 0.9 + 1.2 * sm(F.THREE_ - 6, F.SWUNG + 6, f) : 1.5;
    // ---------- the city far below + distant towers ----------
    K.slab(-700, 700, -PIV - 1, -PIV, -700, 700, K.mat('grime', '#6a7a6a', { amt: 0.5 }), sc, false);
    const CG = K.group(); const facM = ['#c8b8a0', '#a8b8c8', '#d8c8b0', '#9aa8b8', '#b8a890'].map((c) => K.mat('plaster', c, { amt: 0.3, detail: 3 }));
    const winM = K.paint('#2c4a6a', { rough: 0.1, metal: 0.3 });
    for (let i = 0; i < 260; i++) { const x = (hash(i) - 0.5) * 500, z = -40 - hash(i + 9) * 380, h = 20 + hash(i + 3) * 110 * (1 - Math.min(1, Math.abs(x) / 300)), w = 12 + hash(i + 5) * 16;
      if (Math.abs(x) < 30 && z > -60) continue; K.rbox(w, h, w, 0.5, facM[i % 5], x, -PIV + h / 2, z, CG); K.rbox(w + 0.4, h * 0.9, w * 0.6, 0.2, winM, x, -PIV + h * 0.48, z, CG); }
    for (let i = 0; i < 9; i++) { const x = -160 + i * 40 + hash(i) * 10, z = -120 - hash(i + 2) * 120, h = PIV + 5 + hash(i + 4) * 30; K.rbox(16, h, 16, 1, K.paint(['#5a7a9a', '#8a9aaa', '#4a6a7a'][i % 3], { rough: 0.15, metal: 0.3 }), x, -PIV + h / 2, z, CG);
      K.rbox(17, 1.2, 17, 0.4, K.paint('#f4f2ee'), x, -PIV + h - 2, z, CG); }
    S.bake(CG);
    // ---------- tower tops (each a group pivoting 150 m below so it sways) ----------
    const glassD = K.paint('#2c5a7a', { rough: 0.06, metal: 0.45, env: 1.5 }), glassR = K.paint('#2a7a8a', { rough: 0.06, metal: 0.45, env: 1.5 }), band = K.paint('#f4f2ee', { rough: 0.35 }), gold = K.gold(), chrome = K.chrome();
    const towerBody = (g, cx, gm, trim) => { const B = K.group(g);
      K.rbox(14, PIV + RY, 14, 0.3, gm, cx, (RY - PIV) / 2 + PIV - PIV, 0, B);
      for (let y = RY - 1; y > RY - 40; y -= 3.4) K.rbox(14.3, 0.35, 14.3, 0.1, band, cx, y, 0, B);
      for (let k = 0; k <= 7; k++) for (const s of [1, -1]) { K.rbox(0.18, 40, 0.25, 0.05, trim, cx - 7 + k * 2, RY - 20, s * 7.08, B); K.rbox(0.25, 40, 0.18, 0.05, trim, cx + s * 7.08, RY - 20, -7 + k * 2, B); }
      return B; };
    TM = new THREE.Group(); TM.position.set(0, -PIV, 0); sc.add(TM); const tm = new THREE.Group(); tm.position.y = PIV; TM.add(tm);
    TR = new THREE.Group(); TR.position.set(0, -PIV, 0); sc.add(TR); const tr = new THREE.Group(); tr.position.y = PIV; TR.add(tr);
    S.bake(towerBody(tm, -9, glassD, gold)); S.bake(towerBody(tr, 9, glassR, band));
    // Mira's roof: terrace + glass atrium with a gold frame and crown, the ball inside
    const MG = K.group(tm);
    K.rbox(14.4, 0.4, 14.4, 0.1, K.mat('rock', '#b8b0a4', { detail: 0.8 }), -9, RY + 0.2, 0, MG);
    for (const [x0, x1, z0, z1] of [[-14, -4, -5, -5], [-14, -4, 5, 5], [-14, -14, -5, 5], [-4, -4, -5, 5]]) for (let y = 0; y < 4; y++) { const len = Math.hypot(x1 - x0, z1 - z0); K.rbox(x0 === x1 ? 0.18 : len, 0.18, x0 === x1 ? len : 0.18, 0.05, gold, (x0 + x1) / 2, RY + 0.4 + y * 4.4, (z0 + z1) / 2, MG); }
    for (const x of [-14, -4]) for (const z of [-5, 5]) K.rbox(0.3, 13.6, 0.3, 0.08, gold, x, RY + 7.2, z, MG);
    for (let k = 0; k < 5; k++) { K.rbox(0.1, 13.4, 0.1, 0.03, gold, -14 + k * 2.5, RY + 7.1, 5, MG); }
    const crown = new THREE.Mesh(new THREE.ConeGeometry(7.2, 4, 4, 1, true), gold); crown.rotation.y = Math.PI / 4; crown.position.set(-9, RY + 16, 0); crown.scale.set(1, 1, 0.72); crown.material.side = THREE.DoubleSide; MG.add(crown);
    K.cyl(0.12, 0.2, 7, gold, -9, RY + 17.5, 0, MG, 12); const tipL = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff4a3a').multiplyScalar(2) })); tipL.position.set(-9, RY + 24.6, 0); MG.add(tipL);
    // terrace railing, planters, a flag, a sign
    for (let k = 0; k <= 10; k++) K.rbox(0.06, 1.1, 0.06, 0.02, chrome, -3.0 + 0.0, RY + 0.95, -6.5 + k * 1.3, MG);
    K.rbox(0.08, 0.06, 13.2, 0.02, chrome, -2.3, RY + 1.5, 0, MG);
    for (const z of [-5.8, 5.8]) { K.rbox(1.2, 0.7, 1.2, 0.1, K.paint('#5a3a2a'), -3.2, RY + 0.75, z, MG); const sh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 14, 10), K.mat('grime', '#3a8a4a')); sh.position.set(-3.2, RY + 1.6, z); MG.add(sh); }
    const msign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.0), S.textMat('MIRA TOWER', { bg: '#1a2a3a', fg: '#f2c230', w: 768, h: 192 })); msign.position.set(-9, RY - 0.8, 7.12); MG.add(msign);
    S.bake(MG);
    const glassP = K.glass({ opacity: 0.22 });
    // the ball: gold, cables to a top ring, chrome dampers to the floor
    BALL = new THREE.Group(); tm.add(BALL); BALL.position.set(-9, RY + 7.2, 0);
    const bm = new THREE.Mesh(new THREE.SphereGeometry(2.5, 64, 40), K.gold({ rough: 0.18 })); bm.castShadow = true; BALL.add(bm);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, r = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 10, 20), chrome); r.position.set(Math.cos(a) * 1.6, 1.95, Math.sin(a) * 1.6); r.rotation.x = Math.PI / 2; BALL.add(r); }
    const belt = new THREE.Mesh(new THREE.TorusGeometry(2.52, 0.1, 12, 64), K.paint('#1a1a22', { rough: 0.3 })); belt.rotation.x = Math.PI / 2; BALL.add(belt);
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, rv = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), chrome); rv.position.set(Math.cos(a) * 2.6, 0, Math.sin(a) * 2.6); BALL.add(rv); }
    const top = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.18, 12, 40), chrome); top.rotation.x = Math.PI / 2; top.position.set(-9, RY + 13.3, 0); tm.add(top);
    CABLES = []; for (let k = 0; k < 8; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8), chrome); tm.add(c); CABLES.push(c); }
    for (let k = 0; k < 4; k++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1, 14), chrome); tm.add(d); const d2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1, 14), K.paint('#c0392b')); tm.add(d2); DAMP.push([d, d2]); }
    K.lamp(-9, RY + 3, 3.5, { color: '#ffd8a0', intensity: 3, distance: 10, flicker: 0.02 });
    // tinsel (end): red/green/gold garlands wrapped around the ball
    TINSEL = new THREE.Group(); BALL.add(TINSEL);
    for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(2.56 - k * 0.15, 0.09, 8, 60), K.paint(['#e8202a', '#2ab04a', '#f2c230'][k], { rough: 0.2, metal: 0.6 })); t.rotation.set(Math.PI / 2 + (k - 1) * 0.45, k * 0.6, 0); t.position.y = (k - 1) * 0.7; TINSEL.add(t); }
    // Rex's roof: pool deck, pool, loungers, umbrellas, a bar, glass rails, a big sign
    const RG = K.group(tr);
    K.rbox(14.4, 0.4, 14.4, 0.1, K.mat('wood', '#b08050', { detail: 0.6 }), 9, RY + 0.2, 0, RG);
    K.rbox(8.4, 1.0, 7.4, 0.12, K.paint('#f4f2ee', { rough: 0.3 }), 10.5, RY + 0.5, -1.2, RG);
    K.rbox(0.5, 0.06, 2.4, 0.02, K.paint('#2a62c8'), 6.2, RY + 1.3, -1.2, RG);
    for (let k = 0; k < 4; k++) { const lx = 4.8 + (k % 2) * 1.3, lz = -5 + Math.floor(k / 2) * 3.0; K.rbox(0.7, 0.12, 1.8, 0.04, K.paint(['#e84a5f', '#f2c230'][k % 2]), lx, RY + 0.7, lz, RG); const bk = K.rbox(0.7, 0.12, 0.8, 0.04, K.paint(['#e84a5f', '#f2c230'][k % 2]), lx, RY + 1.0, lz - 1.0, RG); bk.rotation.x = -0.8; }
    for (const [ux, uz, c] of [[5.6, -3.4, '#e84a5f'], [14, 5, '#2a9ab8']]) { K.cyl(0.05, 0.05, 2.4, chrome, ux, RY + 0.4, uz, RG, 8); const um = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.5, 12), K.paint(c)); um.position.set(ux, RY + 2.9, uz); RG.add(um); }
    K.rbox(3.2, 1.2, 1.0, 0.1, K.mat('wood', '#7a4a2a'), 10, RY + 1.0, 4.6, RG); K.rbox(3.4, 0.1, 1.2, 0.03, K.paint('#f4f2ee'), 10, RY + 1.65, 4.6, RG);
    for (let k = 0; k < 5; k++) { const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.3, 10), K.paint(['#2a8a5a', '#c0392b', '#f2c230'][k % 3], { rough: 0.1 })); bt.position.set(9 + k * 0.4, RY + 1.85, 4.5); RG.add(bt); }
    const ps = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.2), S.textMat('SKY POOL', { bg: '#2a9ab8', fg: '#ffffff', w: 768, h: 192 })); ps.position.set(10, RY + 3.0, 5.2); RG.add(ps);
    K.cyl(0.06, 0.06, 2.4, chrome, 7.9, RY + 0.4, 5.2, RG, 8); K.cyl(0.06, 0.06, 2.4, chrome, 12.1, RY + 0.4, 5.2, RG, 8);
    const rsign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.0), S.textMat('REX PLAZA', { bg: '#f4f2ee', fg: '#2a7a8a', w: 768, h: 192 })); rsign.position.set(9, RY - 0.8, 7.12); RG.add(rsign);
    for (const [px, pz] of [[15.2, -6], [15.2, 2], [3.3, 6]]) { K.rbox(0.8, 0.8, 0.8, 0.1, K.paint('#f4f2ee'), px, RY + 0.8, pz, RG); for (let k = 0; k < 5; k++) { const lf = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.4, 5), K.mat('grime', '#3a9a4a')); lf.position.set(px + Math.cos(k * 1.3) * 0.3, RY + 1.8, pz + Math.sin(k * 1.3) * 0.3); lf.rotation.set(Math.sin(k) * 0.8, 0, Math.cos(k) * 0.8); RG.add(lf); } }
    S.bake(RG);
    for (const [x0, z0, x1, z1] of [[2.2, -7, 2.2, 7], [2.2, 7, 15.8, 7]]) { const len = Math.hypot(x1 - x0, z1 - z0), p = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.1), K.glass({ opacity: 0.25 })); p.position.set((x0 + x1) / 2, RY + 0.95, (z0 + z1) / 2); p.rotation.y = x0 === x1 ? Math.PI / 2 : 0; p.userData.ndSkip = true; tr.add(p); K.rbox(x0 === x1 ? 0.08 : len, 0.07, x0 === x1 ? len : 0.08, 0.02, chrome, (x0 + x1) / 2, RY + 1.5, (z0 + z1) / 2, tr); }
    // pool water (sloshes with the sway)
    const pw = new THREE.PlaneGeometry(8.0, 7.0, 40, 35); pw.rotateX(-Math.PI / 2); PWB = Float32Array.from(pw.attributes.position.array);
    POOLW = new THREE.Mesh(pw, K.toon({ color: '#1f8ec8', plain: true, roughness: 0.3 })); POOLW.position.set(10.5, RY + 1.17, -1.2); tr.add(POOLW); POOLW.userData.noBake = true;
    // tenants lounging on Rex's deck
    for (let k = 0; k < 3; k++) TEN.push(K.stick({ jacket: ['#e84a5f', '#2a9ab8', '#f2c230'][k], pants: '#2a2a30', hat: ['cap', null, 'cowboy'][k], cap: '#f4f2ee', hatColor: '#d8b880', glasses: '#1a1a1a', hairStyle: ['short', 'ponytail', 'curly'][k], hair: '#3a2a1e', scarf: k === 1 ? '#f2c230' : undefined }, { key: 'ten' + k, parent: tr }));
    // crane jib holding the ball at the start (from the top of the frame)
    CRANEB = new THREE.Group(); sc.add(CRANEB); K.rbox(0.6, 0.6, 30, 0.1, K.paint('#f2c230'), 0, 0, 0, CRANEB); for (let k = 0; k < 14; k++) K.rbox(0.08, 0.6, 0.08, 0.02, K.paint('#1a1a1a'), 0.3, 0, -14 + k * 2.1, CRANEB);
    // ---------- office insert (x = OFF): a desk, a coffee cup, a window, a door with EXIT ----------
    ROOM = new THREE.Group(); ROOM.position.set(OFF, 0, 0); sc.add(ROOM); const RMg = new THREE.Group(); ROOM.add(RMg);
    K.slab(-6, 6, -0.1, 0, -5, 5, K.mat('fabric', '#5a6a8a', { detail: 0.3 }), RMg); K.slab(-6, 6, 0, 3.2, -5, -4.8, K.mat('plaster', '#e8e0d0'), RMg);
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(7, 2.4), S.textMat(' ', { bg: '#8ab8e8', border: false, w: 64, h: 32 })); sky.position.set(-1, 1.6, -4.78); RMg.add(sky);
    for (let k = 0; k < 4; k++) K.rbox(0.1, 2.5, 0.1, 0.02, K.paint('#2a2a30'), -4.5 + k * 2.33, 1.6, -4.75, RMg);
    K.rbox(2.4, 0.08, 1.2, 0.03, K.mat('wood', '#a8703a'), 0, 0.78, -1.5, RMg); for (const [a, b] of [[-1.1, -2.0], [1.1, -2.0], [-1.1, -1.0], [1.1, -1.0]]) K.rbox(0.06, 0.76, 0.06, 0.02, K.chrome(), a, 0.38, b, RMg);
    K.rbox(0.7, 0.45, 0.05, 0.02, K.paint('#1a1a22'), -0.5, 1.12, -1.9, RMg); K.rbox(0.5, 0.03, 0.2, 0.01, K.paint('#d8d8dc'), -0.5, 0.83, -1.4, RMg);
    K.rbox(1.0, 2.1, 0.08, 0.02, K.paint('#7a4a2a'), 4.5, 1.05, -4.75, RMg); const ex = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), S.textMat('EXIT', { bg: '#2ab04a', fg: '#ffffff', w: 256, h: 96 })); ex.position.set(4.5, 2.4, -4.7); RMg.add(ex);
    const pl = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 10), K.mat('grime', '#3a8a4a')); pl.position.set(-3.8, 1.0, -3.8); RMg.add(pl); K.cyl(0.25, 0.2, 0.5, K.paint('#c0392b'), -3.8, 0, -3.8, RMg, 12);
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), S.textMat('REX PLAZA|RENT x3', { bg: '#f4ead2', fg: '#c0392b', w: 256, h: 192 })); cal.position.set(3.2, 1.9, -4.78); RMg.add(cal);
    S.bake(RMg);
    CUP = new THREE.Group(); ROOM.add(CUP); K.cyl(0.07, 0.06, 0.16, K.paint('#f4f2ee'), 0, 0, 0, CUP, 16); const cf = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), K.paint('#5a3a1a')); cf.rotation.x = -Math.PI / 2; cf.position.y = 0.15; CUP.add(cf);
    for (let k = 0; k < 3; k++) OFFX.push(K.stick({ jacket: ['#4a5ac8', '#8a5a34', '#3a7a4a'][k], pants: '#2a2a30', tie: '#c0392b', collar: '#ffffff', hairStyle: ['short', 'bun', 'spiky'][k], hair: ['#3a2a1e', '#c8a060', '#1a1a1a'][k], glasses: k === 1 }, { key: 'off' + k }));
    // ---------- park (x = PARK): a swing set, trees, bench ----------
    const PG = K.group(); K.slab(PARK - 20, PARK + 20, -0.1, 0, -20, 20, K.mat('grime', '#6aa84f', { amt: 0.6 }), PG, false);
    for (const z of [-1.2, 1.2]) { const l1 = K.rbox(0.12, 3.4, 0.12, 0.03, K.paint('#c0392b'), PARK - 1.0, 1.6, z, PG); l1.rotation.z = 0.3; const l2 = K.rbox(0.12, 3.4, 0.12, 0.03, K.paint('#c0392b'), PARK + 1.0, 1.6, z, PG); l2.rotation.z = -0.3; }
    K.rbox(0.14, 0.14, 2.8, 0.04, K.paint('#f2c230'), PARK, 3.2, 0, PG);
    for (const [tx, tz] of [[PARK - 6, -6], [PARK + 7, -7], [PARK + 3, -10]]) { const t = S.tree({ h: 4.5, seed: tx }); t.position.set(tx, 0, tz); }
    const pb = S.bench(); pb.position.set(PARK + 4.5, 0, -2); S.bake(PG);
    SWING = new THREE.Group(); SWING.position.set(PARK, 3.2, 0); sc.add(SWING);
    for (const z of [-0.35, 0.35]) K.cyl(0.02, 0.02, 2.4, K.chrome(), 0, -2.4, z, SWING, 6);
    K.rbox(0.45, 0.06, 0.85, 0.02, K.paint('#2a62c8'), 0, -2.4, 0, SWING);
    // x-ray of Mira's tower top + the two arrows (tower sway red, ball swing cyan)
    HOLOT = K.holoBox(14.2, 14, 14.2, -9, RY + 7, 0, tm, '#36e2ff'); HOLOT.visible = false;
    const arrow = (c, y) => { const g = new THREE.Group(); g.position.set(-9, y, 7.6); tm.add(g); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(1.8) });
      const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 6, 14), m); sh.rotation.z = Math.PI / 2; g.add(sh); const hd = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.6, 18), m); hd.rotation.z = -Math.PI / 2; hd.position.x = 3.6; g.add(hd); g.traverse((o) => { o.userData.ndSkip = true; }); g.visible = false; return g; };
    ARR_T = arrow('#ff5a4a', RY + 15.5); ARR_B = arrow('#36e2ff', RY + 7.2);
    // characters
    MIRA = K.stick({ jacket: '#f2c230', pants: '#2a2a30', boots: '#1a1a1a', hat: 'hardhat', hatColor: '#f4f2ee', hairStyle: 'ponytail', hair: '#1a1a1a', glasses: true, scarf: '#c0392b', belt: '#1a1a1a', pockets: true, gloves: '#2a2a30' }, { key: 'mira', parent: tm });
    REX = K.stick({ jacket: '#f4f2ee', pants: '#2a7a8a', boots: '#f4f2ee', hairStyle: 'spiky', hair: '#c8a060', glasses: '#1a1a1a', bowtie: '#e84a5f', belt: '#c8a030', moustache: '#8a5a30', scarf: '#2a9ab8' }, { key: 'rex', parent: tr });
    MONKEY = K.animal('monkey', { seed: 5 });
    K.addClouds(14, 500, 120);
  },
  frame(f, K) {
    const T = K.T, L = LINES, t = f / 30;
    const office = (f >= 600 && f < 640) || (f >= 790 && f < 847), park = f >= 847 && f < 930;
    // ---------- sway ----------
    const ph = Math.sin(2 * Math.PI * f / PER), A = AR(f), dR = A * ph, dM = A * 0.12 * ph * (f > F.ONE ? 1 : 0.5), dB = -A * 0.55 * ph;
    TR.rotation.z = -dR / (PIV + RY); TM.rotation.z = -dM / (PIV + RY);
    // ball (local to Mira's tower top): swings opposite; lowered by the crane at the start
    const lower = 1 - sm(0, 88, f);
    BALL.position.set(-9 + dB, RY + 7.2 + lower * 12 + 0.15 * Math.abs(dB) * 0.2, 0); BALL.rotation.z = dB * 0.04;
    TINSEL.visible = f >= F.MONKEY - 10;
    const topP = [-9, RY + 13.3, 0];
    CABLES.forEach((c, k) => { const a = k / 8 * Math.PI * 2, p0 = new THREE.Vector3(topP[0] + Math.cos(a) * 1.9, topP[1], Math.sin(a) * 1.9), p1 = new THREE.Vector3(BALL.position.x + Math.cos(a) * 1.6, BALL.position.y + 1.95, Math.sin(a) * 1.6);
      if (lower > 0.01) { p0.set(p1.x + Math.cos(a) * 0.3, p1.y + 12, p1.z + Math.sin(a) * 0.3); }
      c.position.copy(p0).add(p1).multiplyScalar(0.5); c.scale.set(1, p0.distanceTo(p1), 1); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p0.clone().sub(p1).normalize()); });
    DAMP.forEach(([d, d2], k) => { const a = k / 4 * Math.PI * 2 + 0.4, p0 = new THREE.Vector3(-9 + Math.cos(a) * 4.0, RY + 0.4, Math.sin(a) * 4.0), p1 = new THREE.Vector3(BALL.position.x + Math.cos(a) * 1.8, BALL.position.y - 1.6, Math.sin(a) * 1.8);
      const v = p1.clone().sub(p0), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
      d.position.copy(p0).addScaledVector(v, 0.7); d.scale.set(1, v.length() * 0.6, 1); d.quaternion.copy(q); d2.position.copy(p0).addScaledVector(v, 0.25); d2.scale.set(1, v.length() * 0.5, 1); d2.quaternion.copy(q);
      d.visible = d2.visible = lower < 0.02; });
    CRANEB.visible = f < 112; CRANEB.position.set(-9 + 2, RY + 7.2 + lower * 12 + 15.2, 0); CRANEB.rotation.y = 0.6;
    // pool slosh
    { const pos = POOLW.geometry.attributes.position.array, sl = -dR * 0.35 * Math.cos(2 * Math.PI * f / PER) * 0 + (A > 0.2 ? A * 0.28 : 0.02) * Math.cos(2 * Math.PI * f / PER + 0.6);
      for (let k = 0; k < pos.length; k += 3) { const x = PWB[k], z = PWB[k + 2]; pos[k + 1] = sl * (x / 4) * (1 + 0.3 * Math.sin(z * 1.3 + t * 3)) + 0.03 * Math.sin(x * 2.1 + t * 4) * Math.sin(z * 1.7 - t * 3); }
      POOLW.geometry.attributes.position.needsUpdate = true; POOLW.geometry.computeVertexNormals(); }
    // ---------- characters ----------
    { const mk = [[0, 'pointUp', { expr: 'deadpan' }], [F.BALL, 'wave', { expr: 'deadpan' }], [F.WIND, 'idle', { expr: 'deadpan', look: 0.3 }], [F.LAUGH, 'idle', { expr: 'deadpan', look: 0.6 }], [F.ORN + 12, 'cross', { expr: 'deadpan' }],
        [F.STORMS, 'hips', { expr: 'deadpan' }], [F.DOES, 'point', { expr: 'smug' }], [F.PULLS, 'drink', { expr: 'smile', R: [0.25, 0.1, 'cup'] }], [F.BEG, 'idle', { expr: 'deadpan', look: 0.5 }], [F.SHRUG - 3, 'shrug', { expr: 'deadpan' }], [F.MONKEY, 'pointUp', { expr: 'smile', look: -0.4 }]];
      const m = T.act(f, mk, { seed: 2, blink: blinkAt(f, 2) }); MIRA.set(m, { x: f < 112 ? -3.4 : -3.2, y: RY + 0.4, z: 2.0, yaw: Math.PI / 2 - 0.2, visible: !office && !park }); }
    { const rk = [[0, 'hips', { expr: 'smug' }], [F.LAUGH - 3, 'point', { expr: 'laugh', talk: true }], [F.ORN + 12, 'clap', { expr: 'laugh' }], [F.POOL, 'show', { expr: 'gloat', R: [0.42, -0.6, 'moneybag'] }], [F.TRIPLE, 'cheer', { expr: 'grin', R: [0.42, -0.6, 'moneybag'] }],
        [F.STORMS, 'hips', { expr: 'smug' }], [F.SLOSH, 'idle', { expr: 'nervous' }], [F.GRIN - 3, 'cheer', { expr: 'grin', sweat: true, talk: true }], [F.SWUNG, 'scared', { expr: 'scared', sweat: true }], [F.WAVED, 'panic', { expr: 'scared', sweat: true }],
        [F.BEG - 3, 'beg', { expr: 'beg', talk: true, sweat: true }], [F.SHRUG + 6, 'shock', { expr: 'confused' }], [F.TINSEL, 'facepalm', { expr: 'deadpan' }]];
      REX.set(T.act(f, rk, { seed: 6, blink: blinkAt(f, 6) }), { x: 3.4, y: RY + 0.4, z: 2.6, yaw: -Math.PI / 2 + 0.3, visible: !office && !park }); }
    TEN.forEach((r, k) => { const sick = f > F.THREE_; r.set(T.act(f, [[0, k === 1 ? 'drink' : 'sit', { expr: 'smile', R: [0.25, 0.1, 'cup'] }], [F.SWUNG + k * 4, sick ? 'scared' : 'sit', { expr: sick ? 'pained' : 'smile', sweat: sick }]], { seed: 20 + k, blink: blinkAt(f, 20 + k) }),
      { x: 4.8 + (k % 2) * 1.3, y: RY + 0.42, z: [-4.7, -1.7, -4.7][k] + (k === 1 ? 4.2 : 0), yaw: Math.PI * 0.75, seat: 0.38, visible: f < F.SICK + 10 && !office && !park }); });
    // office: cup slides (storm two), tenants walk out seasick (line 7)
    ROOM.rotation.z = office ? -dR * 0.03 : 0; CUP.position.set(lerp(0.55, -0.15, sm(F.COFFEE - 4, F.COFFEE + 24, f)) + 0.3 * Math.sin(f * 0.13) * (f > F.COFFEE + 24 ? 1 : 0), 0.82, -1.3); CUP.rotation.z = 0;
    OFFX.forEach((r, k) => { const W = K.walkPath(f, 794 + k * 8, [[-3 + k * 1.2, 0.5 + k * 0.6], [3.4, -2.5], [4.5, -4.3]], 1.3);
      r.set(T.act(f, W.moving ? [[0, 'carry', { expr: 'pained', sweat: true, item: 'box' }]] : [[0, 'idle', { expr: 'pained' }]], { seed: 30 + k, blink: blinkAt(f, 30 + k), phase: (f / 30 * 1.1 + k * 0.3) % 1 }), { x: OFF + W.x, z: W.z, yaw: W.yaw, visible: f >= 790 && f < 847 }); });
    // park: Mira pushes the monkey on the swing; on "wrong" she pushes as it swings in: it stops dead
    const stop = sm(F.STOPS - 2, F.STOPS + 6, f), sa = 0.42 * Math.sin(f * 0.16) * (1 - stop);
    SWING.rotation.z = sa;
    if (park) { const seat = new THREE.Vector3(0, -2.4, 0).applyEuler(new THREE.Euler(0, 0, sa)); MONKEY.set(f, { x: PARK + seat.x, y: 3.2 + seat.y + 0.03, z: 0, yaw: Math.PI / 2, mode: 'sit', expr: stop > 0.5 ? 'shock' : 'happy' }); MONKEY.root.rotation.z = sa; }
    else if (f >= F.MONKEY - 10) { const bp = new THREE.Vector3(); BALL.getWorldPosition(bp); MONKEY.set(f, { x: bp.x, y: bp.y + 2.45, z: bp.z, yaw: 0.3, mode: 'sit', expr: 'happy', look: 0.3 * Math.sin(f * 0.1) }); }
    else { const mp = new THREE.Vector3(); MIRA.root.updateMatrixWorld(true); MIRA.root.getWorldPosition(mp); MONKEY.set(f, { x: mp.x - 0.9, y: mp.y, z: mp.z - 0.6, yaw: Math.PI / 2, mode: f > F.LAUGH && f < F.ORN + 30 ? 'jump' : 'sit', expr: f > F.LAUGH && f < F.ORN + 30 ? 'angry' : 'happy', visible: !office }); }
    if (park) { const sp = new THREE.Vector3(0, -2.4, 0).applyEuler(new THREE.Euler(0, 0, sa));
      MIRA.set(T.act(f, [[0, 'push', { expr: 'smile' }], [F.WRONG - 4, 'push', { expr: 'deadpan' }], [F.STOPS + 4, 'shrug', { expr: 'deadpan' }]], { seed: 2, blink: blinkAt(f, 2) }), { x: PARK - 1.15, z: 0.0, yaw: Math.PI / 2 }); }
    // x-ray + arrows
    const xr = f >= 930 && f < 1046; HOLOT.visible = xr;
    const vel = Math.cos(2 * Math.PI * f / PER); ARR_T.visible = xr && f > F.SWAYS - 6; ARR_B.visible = xr && f > F.OTHER - 8; ARR_T.rotation.y = vel >= 0 ? 0 : Math.PI; ARR_B.rotation.y = vel >= 0 ? Math.PI : 0;

    // ---------- shots ----------
    let cam, dof, u; const sh = (a0, b0) => (u = clamp((f - a0) / (b0 - a0), 0, 1), f >= a0 && f < b0);
    const head = (rig) => { rig.root.updateMatrixWorld(true); const v = new THREE.Vector3(); rig.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
    const orbit = (tg, yaw, pitch, dist, fov) => { const a0 = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return { pos: [tg[0] + Math.sin(a0) * Math.cos(p) * dist, tg[1] + Math.sin(p) * dist, tg[2] + Math.cos(a0) * Math.cos(p) * dist], look: tg, fov }; };
    const shakeIt = (c, f0, amp, dur) => { const [sx, sy] = K.shake(f, f0, amp, dur); c.pos[0] += sx; c.pos[1] += sy; return c; };
    const ballW = () => { const v = new THREE.Vector3(); BALL.getWorldPosition(v); return [v.x, v.y, v.z]; };
    TM.updateMatrixWorld(true); TR.updateMatrixWorld(true);
    if (sh(0, 55)) {             // 1. low, looking up: the 600-ton gold ball comes down into the glass top, Mira waving it in
      cam = { pos: [lerp(0.2, -0.4, u), RY + 3.0, 15], look: [-8, RY + 14, 0], fov: 50 }; dof = { focus: 15, cinf: 4 };
    } else if (sh(55, 112)) {    // 2. inside the atrium: the ball settles on its cables (badge 600 TONS)
      cam = { pos: [lerp(-2.4, -3.0, u), RY + 3.4, 9.5], look: [-8.5, RY + 7.0, 0], fov: 48 }; dof = { focus: 9, cinf: 6 };
    } else if (sh(112, 170)) {   // 3. aerial: Windport, the two towers in the wind
      cam = { pos: [lerp(-30, -24, u), RY + 26, 52], look: [0, RY - 6, 0], fov: 44 }; dof = { focus: 60, cinf: 2 };
    } else if (sh(170, 227)) {   // 4. Mira on her terrace, scarf + clouds racing (150 km/h)
      cam = orbit(head(MIRA), lerp(60, 70, u), 8, 3.4, 42 * K.push(u, 0.1)); dof = { focus: 3.4, cinf: 11 };
    } else if (sh(227, 280)) {   // 5. Rex on his deck laughing (ornament?)
      cam = orbit(head(REX), lerp(-75, -65, u), 4, 2.4, 40 * K.punch(f, F.ORN, 0.14, 7)); dof = { focus: 2.4, cinf: 14 };
    } else if (sh(280, 331)) {   // 6. reaction: Mira deadpan, her monkey hopping mad
      cam = orbit(head(MIRA), lerp(80, 90, u), 12, 2.6, 40 * K.push(u, 0.08)); dof = { focus: 2.6, cinf: 13 };
    } else if (sh(331, 380)) {   // 7. crane down over Rex's sky pool
      cam = { pos: [lerp(17, 15.5, u), RY + lerp(9, 6.5, u), 12], look: [9.5, RY + 0.8, 0], fov: 46 }; dof = { focus: 12, cinf: 4 };
    } else if (sh(380, 429)) {   // 8. Rex with the money: rent x3
      cam = orbit(head(REX), lerp(-55, -45, u), 6, 2.3, 40); dof = { focus: 2.3, cinf: 14 };
    } else if (sh(429, 490)) {   // 9. storm one: both towers, a little sway
      cam = { pos: [lerp(1, 0, u), RY + 6, 30], look: [0, RY + 3, 0], fov: 46 }; dof = { focus: 30, cinf: 2 };
    } else if (sh(490, 551)) {   // 10. nobody noticed: tenants lounging by the pool
      cam = { pos: [lerp(8.6, 8.2, u), RY + 2.2, 2.8], look: [5.2, RY + 0.9, -3.4], fov: 42 }; dof = { focus: 4, cinf: 10 };
    } else if (sh(551, 600)) {   // 11. storm two: the pool sloshes (low over the water)
      const p = new THREE.Vector3(14.5, RY + 1.6, 2.8).applyMatrix4(TR.children[0].matrixWorld), l = new THREE.Vector3(9.5, RY + 0.9, -1.2).applyMatrix4(TR.children[0].matrixWorld);
      cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 44, roll: -dR * 2 }; dof = { focus: 6, cinf: 8 };
    } else if (sh(600, 640)) {   // 12. insert: the coffee slides across a desk inside Rex's tower
      cam = { pos: [OFF + 0.9, 1.5, 0.9], look: [OFF + 0.2, 0.85, -1.3], fov: 44, roll: -dR * 3 }; dof = { focus: 2.4, cinf: 14 };
    } else if (sh(640, 680)) {   // 13. Rex grins "towers bend!", sweating
      cam = orbit(head(REX), lerp(-60, -70, u), 4, 2.2, 40); dof = { focus: 2.2, cinf: 14 };
    } else if (sh(680, 730)) {   // 14. storm three: Rex's tower swings two metres (wide, punch)
      cam = { pos: [lerp(30, 27, u), RY + 2, 24], look: [8, RY + 2, 0], fov: 44 * K.punch(f, F.SWUNG, 0.15, 7) }; dof = { focus: 30, cinf: 2 };
    } else if (sh(730, 790)) {   // 15. the pool waves over the edge (low at the deck edge, shake)
      const p = new THREE.Vector3(20, RY + 4.5, 10).applyMatrix4(TR.children[0].matrixWorld), l = new THREE.Vector3(10, RY + 1.0, -1.2).applyMatrix4(TR.children[0].matrixWorld);
      cam = shakeIt({ pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 46, roll: -dR * 1.5 }, F.WAVED, 0.05, 14); dof = { focus: 7, cinf: 7 };
    } else if (sh(790, 847)) {   // 16. office: seasick tenants carry their boxes out (EXIT)
      cam = { pos: [OFF - 2.5, 1.7, 3.6], look: [OFF + 2.5, 1.0, -2.5], fov: 44, roll: -dR * 1.5 }; dof = { focus: 5, cinf: 8 };
    } else if (sh(847, 890)) {   // 17. park cutaway: Mira pushes the monkey on a swing
      cam = { pos: [PARK + lerp(-0.6, -0.2, u), 1.6, 6.6], look: [PARK + 0.1, 1.1, 0], fov: 46 }; dof = { focus: 6.6, cinf: 7 };
    } else if (sh(890, 930)) {   // 18. the wrong moment: it stops dead (close, punch)
      cam = { pos: [PARK + 1.0, 1.3, 3.4], look: [PARK - 0.2, 1.0, 0], fov: 42 * K.punch(f, F.STOPS, 0.15, 6) }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(930, 990)) {   // 19. x-ray: Mira's tower sways (red arrow)
      cam = { pos: [-9 + lerp(1, 0, u), RY + 8, 30], look: [-9, RY + 8, 0], fov: 44 }; dof = { focus: 30, cinf: 2 };
    } else if (sh(990, 1046)) {  // 20. the ball swings the other way (cyan arrow), closer
      cam = { pos: [-9 + lerp(-3, -2, u), RY + 8, 19], look: [-9, RY + 8, 0], fov: 44 }; dof = { focus: 19, cinf: 3 };
    } else if (sh(1046, 1100)) { // 21. inside: the ball swinging, Mira sips a perfectly still coffee
      cam = orbit(head(MIRA), lerp(55, 65, u), 8, 2.6, 42); dof = { focus: 2.6, cinf: 12 };
    } else if (sh(1100, 1164)) { // 22. side by side in the storm: Rex's tower swings, Mira's barely moves
      cam = { pos: [lerp(-2, 2, u), RY + 4, 40], look: [0, RY + 2, 0], fov: 46 }; dof = { focus: 40, cinf: 2 };
    } else if (sh(1164, 1229)) { // 23. Rex begs, soaked
      cam = orbit(head(REX), lerp(-70, -80, u), 2, 2.1, 40 * K.push(u, 0.1)); dof = { focus: 2.1, cinf: 15 };
    } else if (sh(1229, 1285)) { // 24. Mira shrugs; tilt up to the ball
      const h = head(MIRA); cam = { pos: [-1.2, RY + 2.8, 9.0], look: [lerp(h[0], -8.5, sm(0.3, 1, u)), lerp(h[1], RY + 8, sm(0.3, 1, u)), lerp(h[2], 0, u)], fov: 44 }; dof = { focus: 3.4, cinf: 10 };
    } else {                     // 25. the monkey on top of the ball, hanging tinsel (close, hold)
      const b = ballW(); cam = orbit([b[0], b[1] + 2.9, b[2]], lerp(30, 18, u), 8, 3.0, 42 * K.push(u, 0.12)); dof = { focus: 3.0, cinf: 13 };
    }
    // ---------- weather + graphics ----------
    const storm = f >= F.STORMS - 10 && !office && !park;
    if (storm) { K.rain(f, cam.look, { area: 16, count: Math.round(250 + 450 * clamp(A / 2, 0, 1)), speed: 14 }); K.leaves(f, cam.look, { area: 12, count: 30, fall: 0.6, wind: [3, 0.4], colors: ['#f4f2ee', '#e8e0d0', '#d8d0c0'] }); }
    if (f > F.SWUNG && f < 790 && !office) for (let k = 0; k < 2; k++) K.steam(f, () => { const v = new THREE.Vector3(k ? 14.6 : 6.4, RY + 1.2, 2.2).applyMatrix4(TR.children[0].matrixWorld); return [v.x, v.y, v.z]; }, { rate: 8, size: 0.8, rise: 1.2, drift: [ph * 2, 0.5], alpha: 0.6, seed: 4 + k, life: 30 });
    K.badge(f, F.TON, '600 TONS', [-9, RY + 11, 3], { icon: 'weight', f1: 110 });
    K.badge(f, F.KM, '150 KM/H', { sx: 0.5, sy: 0.32 }, { icon: 'warn', f1: 225, size: 1.25 });
    K.badge(f, F.ORN, 'ORNAMENT?', { sx: 0.5, sy: 0.3 }, { style: 'stamp', f1: 327, size: 1.4 });
    if (f >= 380 && f < 429) K.badge(f, F.TRIPLE, 'RENT x3', { sx: 0.5, sy: 0.66 }, { icon: 'coin', f1: 428 });
    K.hud(f, F.STORMS, { stages: 3, labels: ['STORM 1', 'STORM 2', 'STORM 3'], u: clamp((f - F.ONE) / (F.SICK - F.ONE), 0, 1), f1: 845 });
    if (f >= 680 && f < 730) K.badge(f, F.SWUNG + 6, '2 M SWAY', [10, RY + 9, 7.5], { icon: 'warn', f1: 728 });
    if (f >= 1046 && f < 1164) K.badge(f, F.BARELY, 'BARELY MOVES', { sx: 0.5, sy: 0.62 }, { icon: 'check', f1: 1162 });
    let light;
    if (office) light = K.light('interior', { az: 80, el: 45, exposure: 1.3 });
    else if (park) light = K.light('day', { az: 70, el: 40 });
    else if (!storm) light = K.light('golden', { az: 75, el: 26, shadowExt: 30, fogNear: 90, fogFar: 700, exposure: 1.2, bloom: 0.6 });
    else if (f < 1229) light = K.light('overcast', { az: 75, el: 40, sunI: 1.8, hemi: 1.25, fogNear: 80, fogFar: 500, skyTop: '#5a6a84', exposure: 1.18, bloom: 0.5 });
    else light = K.light('golden', { az: 75, el: 22, shadowExt: 30, fogNear: 90, fogFar: 700, exposure: 1.2, bloom: 0.6 });
    return { light, cam, dof, actors: [], fx: [] };
  },
};
