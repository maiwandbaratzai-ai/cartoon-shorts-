// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Every Bridge Has Metal Teeth" — invented fable (SCRIPTS.md §00), 64 s TikTok: Bea's comb-jointed bridge vs Duke's smooth bridge.
// Red Canyon: mail wagons -> June/July/August heat -> Duke's seamless deck grows a hump and traps the mail -> jar-lid cutaway -> the teeth slide.
import { TOTAL, LINES, wf } from './combbridge_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let THREE, BEA, DUKE, MAILMAN, HORSE, WHORSE, WAGON, TEETH_L, TEETH_R, DSEG = [], THERMO, KITCH, JAR, LID, HOLOD, HOLOJ, ARROWS = [], MONEY, EXTRAS = [];
let F = {};
const ZB = -9, ZD = 3.5, HALF = 12, KX = 200;
let HUMP = () => 0, TEMP = () => 22, GAP = () => 0.3;
const dukeY = (x, f) => (Math.abs(x) < HALF ? HUMP(f) * Math.cos(Math.PI * x / (2 * HALF)) ** 2 : 0);

function wagon(K) {
  const g = new THREE.Group(); K.scene.add(g); const wood = K.mat('wood', '#8a5a34', { detail: 0.5 }), red = K.paint('#c0392b', { rough: 0.35 }), gold = K.gold();
  K.rbox(2.6, 0.7, 1.4, 0.06, wood, 0, 0.95, 0, g);
  const cov = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.4, 24, 1, true, -Math.PI / 2, Math.PI), K.mat('fabric', '#f2ead8')); cov.rotation.z = Math.PI / 2; cov.rotation.y = 0; cov.position.set(-0.1, 1.3, 0); cov.material.side = THREE.DoubleSide; cov.castShadow = true; g.add(cov);
  for (let k = 0; k < 4; k++) { const hp = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.03, 6, 24, Math.PI), K.paint('#5a3a24')); hp.position.set(-1.1 + k * 0.66, 1.3, 0); hp.rotation.y = Math.PI / 2; g.add(hp); }
  for (const s of [1, -1]) { const lb = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.36), K.set.textMat('MAIL', { bg: '#1f3a6a', fg: '#f2c230', w: 256, h: 80 })); lb.position.set(0, 0.95, s * 0.72); if (s < 0) lb.rotation.y = Math.PI; g.add(lb); }
  K.rbox(0.5, 0.12, 1.2, 0.03, wood, 1.35, 1.35, 0, g); K.rbox(0.08, 0.5, 1.2, 0.02, wood, 1.15, 1.6, 0, g);
  K.rbox(2.4, 0.06, 0.06, 0.02, gold, 0, 1.3, 0.72, g); K.rbox(2.4, 0.06, 0.06, 0.02, gold, 0, 1.3, -0.72, g);
  for (const s of [-1, 1]) K.rbox(1.6, 0.06, 0.06, 0.02, wood, 2.2, 0.75, s * 0.4, g);
  const wheels = []; for (const x of [-0.85, 0.85]) for (const z of [-0.78, 0.78]) { const w = new THREE.Group(); w.position.set(x, 0.5, z); g.add(w);
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 8, 28), red); w.add(t); for (let k = 0; k < 8; k++) { const sp = K.rbox(0.04, 0.84, 0.04, 0.01, wood, 0, 0, 0, w); sp.rotation.z = k * Math.PI / 8; }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.16, 12), gold); hub.rotation.x = Math.PI / 2; w.add(hub); wheels.push(w); }
  const bag = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), K.mat('fabric', '#c8a870')); bag.scale.set(1, 0.8, 0.8); bag.position.set(-0.9, 1.45, 0.3); g.add(bag);
  return { g, wheels };
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { BUILT: wf(0, 'built'), GAPS: wf(0, 'gaps'), TEETH: wf(0, 'teeth'), PAYS: wf(1, 'pays'), K5: wf(1, '5'), MAIL: wf(1, 'mail'), SUMMER1: wf(1, 'summer'), LAUGH: wf(2, 'laughed'), COMB: wf(2, 'comb'),
      SMOOTH: wf(3, 'smooth'), NOTGAP: wf(3, 'gap'), WAGON: wf(4, 'wagon'), CLACK: wf(4, 'clack'), STEPS: wf(5, 'steps'), JUNE: wf(5, 'june'), THIRTY: wf(5, 'thirty'), CREAK: wf(5, 'creaked'),
      JULY: wf(6, 'july'), FORTY: wf(6, 'forty'), BUMP: wf(6, 'bump'), GRIN: wf(6, 'grinned'), AUG: wf(7, 'august'), FIFTY: wf(7, 'fifty'), HUMP: wf(7, 'hump'), STUCK: wf(7, 'stuck'),
      PUSHED: wf(8, 'pushed'), PULLED: wf(8, 'pulled'), INCH: wf(8, 'inch'), WHY: wf(9, 'why'), JAR: wf(10, 'jar'), HOT: wf(10, 'hot'), POPS: wf(10, 'pops'), HEAT: wf(11, 'heat'),
      HUNDRED: wf(11, 'hundred'), FIVE: wf(11, 'five'), NOWHERE: wf(12, 'nowhere'), SHOVED: wf(12, 'shoved'), BENT: wf(12, 'bent'), APART: wf(13, 'apart'), TOGETHER: wf(13, 'together'),
      FLAT: wf(14, 'flat'), ROLLED: wf(15, 'rolled'), GOT: wf(15, 'got'), BEG: wf(16, 'begged'), AGREED: wf(17, 'agreed'), HORSE: wf(17, 'horse'), COMBING: wf(17, 'combing') };
    HUMP = (f) => f < F.JUNE ? 0 : f < F.JULY ? 0.06 * sm(F.JUNE, F.CREAK + 10, f) : f < F.AUG ? 0.06 + 0.5 * sm(F.BUMP - 6, F.BUMP + 14, f) : 0.56 + 1.25 * sm(F.HUMP - 10, F.HUMP + 8, f);
    TEMP = (f) => f < F.JUNE - 4 ? 22 : f < F.JULY - 4 ? 22 + 8 * sm(F.JUNE - 4, F.THIRTY + 6, f) : f < F.AUG - 4 ? 30 + 10 * sm(F.JULY - 4, F.FORTY + 6, f) : 40 + 10 * sm(F.AUG - 4, F.FIFTY + 6, f);
    GAP = (f) => f >= 1435 && f < 1533 ? lerp(0.42, 0.06, sm(F.TOGETHER - 14, F.TOGETHER + 10, f)) * (f < F.APART - 6 ? sm(1435, 1450, f) * 0 + 1 : 1) : (f >= 1533 ? 0.06 : 0.2);
    // ---------- canyon: two red cliffs, the river far below, mesas ----------
    const rock = K.mat('rock', '#c0603a', { detail: 3.5 }), rock2 = K.mat('rock', '#a84a2e', { detail: 2.5 }), sand = K.mat('dirt', '#d89a5a', { detail: 1.4 });
    const CG = K.group();
    for (const s of [-1, 1]) { K.slab(s > 0 ? HALF : -120, s > 0 ? 120 : -HALF, -45, -0.4, -80, 80, rock, CG); K.slab(s > 0 ? HALF : -120, s > 0 ? 120 : -HALF, -0.4, -0.02, -80, 80, sand, CG);
      for (let k = 0; k < 14; k++) { const b = K.rbox(1.5 + hash(k) * 2, 3 + hash(k + 3) * 8, 3 + hash(k + 5) * 6, 0.5, k % 2 ? rock : rock2, s * (HALF + 0.3 - hash(k + 7) * 0.4), -4 - k * 2.8, -40 + k * 6.3, CG); } }
    K.slab(-HALF, HALF, -46, -44.8, -80, 80, K.paint('#2a8ab8', { rough: 0.2 }), CG, false);
    for (let k = 0; k < 9; k++) { const m = K.rbox(20 + hash(k) * 20, 18 + hash(k + 1) * 25, 20, 2, k % 2 ? rock : rock2, -90 + k * 24, -6 + 9, -110 - hash(k + 2) * 60, CG); }
    // abutments (stone) at both cliff edges for each bridge
    const stone = K.mat('rock', '#b8a890', { detail: 0.7 });
    for (const z of [ZB, ZD]) for (const s of [-1, 1]) K.rbox(2.0, 1.6, 4.0, 0.1, stone, s * (HALF + 0.6), -0.8, z, CG);
    // roads to the bridges, a little post office, fences, cacti, a sign board
    for (const z of [ZB, ZD]) for (const s of [-1, 1]) K.slab(s > 0 ? HALF + 1.6 : -60, s > 0 ? 60 : -HALF - 1.6, -0.02, 0.03, z - 1.6, z + 1.6, K.mat('dirt', '#b8845a', { detail: 1.0 }), CG, false);
    const cact = K.mat('grime', '#3a8a4a', { amt: 0.4 });
    for (let k = 0; k < 16; k++) { const x = (k % 2 ? 1 : -1) * (16 + hash(k) * 30), z = -24 + hash(k + 4) * 40; if (Math.abs(z - ZB) < 3 || Math.abs(z - ZD) < 3) continue; const h = 1.4 + hash(k + 8) * 1.6;
      K.cyl(0.22, 0.25, h, cact, x, 0, z, CG, 10); const t1 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), cact); t1.position.set(x, h, z); CG.add(t1);
      K.cyl(0.13, 0.13, 0.6, cact, x + 0.4, h * 0.45, z, CG, 8); K.rbox(0.42, 0.18, 0.18, 0.06, cact, x + 0.22, h * 0.45, z, CG); }
    for (let k = 0; k < 12; k++) for (const z of [ZB - 2.2, ZD + 2.2]) { const x = -15 - k * 2.2; K.cyl(0.06, 0.06, 1.0, K.mat('wood', '#8a6040'), x, 0, z, CG, 6); K.rbox(2.2, 0.08, 0.05, 0.02, K.mat('wood', '#8a6040'), x - 1.1, 0.75, z, CG); }
    S.bake(CG);
    const po = S.building({ w: 6, d: 5, floors: 1, seed: 7, color: '#e0b080', kind: 'plaster', gable: 'flat', shop: 'POST OFFICE', awning: ['#2a62c8', '#ffffff'], shutters: '#2a5a3a' }); po.position.set(-21, 0, -11); po.rotation.y = 0.3;
    const sb = S.board('MAIL CONTRACT|$5,000 FOR THE SUMMER', 3.0, 1.4, { frame: '#8a5a34' }); sb.position.set(-15.2, 0, 0.0); sb.rotation.y = 0.5;
    const db = S.board("DUKE'S SMOOTH BRIDGE|NO GAPS!", 2.6, 1.0, { frame: '#c0392b' }); db.position.set(-14.5, 0, ZD + 2.6); db.rotation.y = 0.2;
    const bb = S.board("BEA'S BRIDGE", 1.8, 0.7, { frame: '#2a8a7a' }); bb.position.set(-14.5, 0, ZB - 2.6); bb.rotation.y = 0.3;
    const mb = new THREE.Group(); mb.position.set(-16.5, 0, 2.2); sc.add(mb); K.cyl(0.05, 0.05, 1.1, K.mat('wood', '#6a4a2a'), 0, 0, 0, mb, 6); K.rbox(0.5, 0.3, 0.3, 0.1, K.paint('#2a62c8'), 0, 1.2, 0, mb);
    // ---------- Bea's bridge (hero prop): teal steel arch, gold rivets, lamps, the comb joint in the middle ----------
    const BG = K.group(); const teal = K.paint('#2a8a8a', { rough: 0.3 }), gold = K.gold(), chrome = K.chrome(), deckM = K.mat('wood', '#8a6a4a', { detail: 0.5 }), dark = K.paint('#2a2a30', { rough: 0.4 });
    for (const [x0, x1] of [[-HALF - 1.4, -0.32], [0.32, HALF + 1.4]]) { K.rbox(x1 - x0, 0.22, 3.2, 0.05, deckM, (x0 + x1) / 2, -0.11, ZB, BG); for (const s of [-1, 1]) K.rbox(x1 - x0, 0.5, 0.2, 0.06, teal, (x0 + x1) / 2, -0.4, ZB + s * 1.55, BG); }
    for (let k = 0; k <= 24; k++) { const t = -1 + k / 12, x = t * HALF, y = -1.0 - 5.5 * (1 - t * t); for (const s of [-1, 1]) { const seg = K.rbox(1.08, 0.4, 0.3, 0.08, teal, x, y, ZB + s * 1.3, BG); seg.rotation.z = Math.atan(-5.5 * -2 * t / HALF); }
      if (k % 2 === 0 && k > 0 && k < 24) for (const s of [-1, 1]) { K.rbox(0.14, -y - 0.6, 0.14, 0.03, teal, x, (y - 0.6) / 2, ZB + s * 1.3, BG); const rv = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), gold); rv.position.set(x, -0.42, ZB + s * 1.67); BG.add(rv); } }
    for (let k = 0; k <= 16; k++) for (const s of [-1, 1]) { const x = -HALF - 1 + k * (2 * HALF + 2) / 16; if (Math.abs(x) < 0.5) continue; K.rbox(0.07, 1.0, 0.07, 0.02, teal, x, 0.5, ZB + s * 1.55, BG); }
    for (const s of [-1, 1]) for (const [x0, x1] of [[-HALF - 1, -0.4], [0.4, HALF + 1]]) K.rbox(x1 - x0, 0.07, 0.1, 0.03, gold, (x0 + x1) / 2, 1.02, ZB + s * 1.55, BG);
    for (const x of [-HALF - 1, -6, 6, HALF + 1]) for (const s of [-1, 1]) { K.cyl(0.05, 0.06, 2.2, dark, x, 0, ZB + s * 1.7, BG, 8); const lp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd890').multiplyScalar(1.8) })); lp.position.set(x, 2.3, ZB + s * 1.7); BG.add(lp); }
    S.bake(BG);
    // the comb joint: two plates of interlocking chrome teeth (slide with the season)
    const mkTeeth = (dir) => { const g = new THREE.Group(); sc.add(g); K.rbox(0.36, 0.1, 3.1, 0.03, K.paint('#4a4c52', { rough: 0.35, metal: 0.5 }), -dir * 0.3, -0.05, 0, g);
      for (let k = 0; k < 11; k++) { const z = -1.4 + k * 0.28 + (dir > 0 ? 0 : 0.14); if (z > 1.45) continue; K.rbox(0.62, 0.07, 0.12, 0.03, chrome, dir * 0.12, -0.02, z, g); } return g; };
    TEETH_L = mkTeeth(1); TEETH_R = mkTeeth(-1);
    // ---------- Duke's bridge: smooth red girders in 12 segments (it bends up in the heat) ----------
    const redp = K.paint('#c0392b', { rough: 0.3 }), white = K.paint('#f4f2ee', { rough: 0.35 });
    const N = 14, SL = (2 * HALF + 2.8) / N;
    for (let k = 0; k < N; k++) { const g = new THREE.Group(); sc.add(g); const x = -HALF - 1.4 + SL * (k + 0.5);
      K.rbox(SL + 0.02, 0.22, 3.2, 0.03, K.mat('grime', '#5a5a60', { amt: 0.3 }), 0, -0.11, 0, g);
      for (const s of [-1, 1]) { K.rbox(SL + 0.02, 0.9, 0.22, 0.03, redp, 0, -0.55, s * 1.55, g); K.rbox(SL + 0.02, 0.08, 0.1, 0.02, white, 0, 1.0, s * 1.55, g); K.rbox(0.07, 1.0, 0.07, 0.02, white, 0, 0.5, s * 1.55, g); }
      K.rbox(0.14, 0.012, 0.9, 0.005, K.paint('#f2c230'), 0, 0.006, 0, g);
      g.userData.x = x; DSEG.push(g); }
    for (const x of [-7, 0, 7]) { const p = K.rbox(0.5, 40, 0.5, 0.1, redp, x, -20.5, ZD, sc); }
    // ---------- the thermometer between the bridges ----------
    THERMO = new THREE.Group(); THERMO.position.set(-13.6, 0, -2.6); THERMO.rotation.y = 0.45; sc.add(THERMO);
    K.cyl(0.06, 0.06, 1.0, K.mat('wood', '#6a4a2a'), 0, 0, 0, THERMO, 8); K.rbox(0.9, 2.6, 0.1, 0.08, white, 0, 2.2, 0, THERMO);
    const sc_ = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 2.0), S.textMat('50°|40°|30°|20°|10°', { bg: '#f4f2ee', fg: '#1a1a1a', w: 128, h: 760, border: false })); sc_.position.set(0.22, 2.3, 0.06); THERMO.add(sc_);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 2.0, 16), K.glass({ opacity: 0.12 })); tube.position.set(-0.12, 2.3, 0.06); THERMO.add(tube);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), K.paint('#e8202a', { rough: 0.2 })); bulb.position.set(-0.12, 1.2, 0.1); THERMO.add(bulb);
    THERMO.liq = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1, 12), K.paint('#e8202a', { rough: 0.2 })); THERMO.add(THERMO.liq);
    // ---------- wagon, horses ----------
    WAGON = wagon(K); WHORSE = K.animal('horse', { color: '#6a4a2a', mane: '#2a1a12', seed: 3 }); HORSE = K.animal('horse', { color: '#c8a070', mane: '#f4efe4', seed: 8 });
    // ---------- kitchen cutaway (x = KX): sink, faucet, jar of jam ----------
    const KG = K.group(); K.slab(KX - 6, KX + 6, -0.1, 0, -5, 5, K.mat('wood', '#c8a070', { detail: 0.5 }), KG, false); K.slab(KX - 6, KX + 6, 0, 3.2, -2.6, -2.4, K.mat('plaster', '#f2e2c8'), KG);
    for (let k = 0; k < 10; k++) for (let j = 0; j < 4; j++) K.rbox(0.28, 0.28, 0.02, 0.01, K.paint((k + j) % 2 ? '#f4f2ee' : '#2a8a8a', { rough: 0.3 }), KX - 1.4 + k * 0.3, 1.15 + j * 0.3, -2.38, KG);
    K.rbox(3.2, 0.9, 0.8, 0.04, K.mat('wood', '#7a4a2a'), KX, 0.45, -1.9, KG); K.rbox(3.3, 0.06, 0.85, 0.02, K.paint('#e8e4dc', { rough: 0.25 }), KX, 0.93, -1.9, KG);
    K.rbox(0.9, 0.08, 0.5, 0.02, chrome, KX + 0.3, 0.92, -1.9, KG); const fau = K.cyl(0.03, 0.03, 0.4, chrome, KX + 0.3, 0.95, -2.2, KG, 10); K.rbox(0.05, 0.05, 0.25, 0.02, chrome, KX + 0.3, 1.35, -2.08, KG);
    for (let k = 0; k < 3; k++) { const pot = K.cyl(0.14, 0.12, 0.2, K.paint(['#c0392b', '#f2c230', '#2a62c8'][k]), KX - 1.2 + k * 0.35, 0.96, -2.1, KG, 14); }
    const kw = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), S.textMat('HOME|SWEET HOME', { bg: '#f4ead2', fg: '#c0392b', w: 256, h: 144 })); kw.position.set(KX - 1.0, 2.4, -2.38); KG.add(kw);
    S.bake(KG);
    JAR = new THREE.Group(); sc.add(JAR); const jg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.2, 20), K.glass({ opacity: 0.5 })); JAR.add(jg); const jam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 20), K.paint('#c0102a', { rough: 0.2 })); JAR.add(jam);
    LID = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 20), K.gold()); sc.add(LID);
    // ---------- x-ray graphics ----------
    HOLOD = K.holoBox(2 * HALF + 2.8, 0.9, 3.4, 0, -0.35, ZD, sc, '#ff6a4a'); HOLOD.visible = false;
    HOLOJ = K.holoBox(1.4, 0.4, 3.3, 0, -0.05, ZB, sc, '#36e2ff'); HOLOJ.visible = false;
    for (const s of [-1, 1]) { const g = new THREE.Group(); sc.add(g); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff5a4a').multiplyScalar(1.8) });
      const shf = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 12), m); shf.rotation.z = Math.PI / 2; g.add(shf); const hd = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.7, 14), m); hd.rotation.z = -s * Math.PI / 2; hd.position.x = s * 1.5; g.add(hd);
      g.position.set(s * (HALF - 1.6), 0.9, ZD + 1.9); g.traverse((o) => { o.userData.ndSkip = true; }); g.visible = false; ARROWS.push(g); }
    MONEY = new THREE.Group(); sc.add(MONEY); const mbg = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), K.mat('fabric', '#c8a870')); mbg.scale.set(1, 1.15, 1); MONEY.add(mbg);
    const ml = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.16), S.textMat('$', { bg: '#c8a870', fg: '#2a6a3a', border: false, w: 96, h: 64 })); ml.position.set(0, 0, 0.29); MONEY.add(ml);
    // ---------- characters ----------
    BEA = K.stick({ jacket: '#2a8a7a', pants: '#5a3a24', boots: '#3a2418', hat: 'cowboy', hatColor: '#8a5a34', hairStyle: 'ponytail', hair: '#c8c0b8', scarf: '#c0392b', vest: '#e8c890', gloves: '#5a3a24', belt: '#2a1a12' }, { key: 'bea' });
    DUKE = K.stick({ jacket: '#c0392b', pants: '#2a2a30', boots: '#1a1a1a', hat: 'tophat', hatColor: '#1a1a1a', moustache: '#2a1a12', bowtie: '#f2c230', vest: '#f2c230', belt: '#1a1a1a', build: 'stout' }, { key: 'duke' });
    MAILMAN = K.stick({ jacket: '#1f3a6a', pants: '#1f3a6a', hat: 'cap', cap: '#1f3a6a', badge: true, scarf: '#f2c230', moustache: '#8a5a34', belt: '#1a1a1a' }, { key: 'mail' });
    EXTRAS = S.extras(4, { x0: -40, len: 18, z: -9, spread: 2, seed: 61, stillShare: 0.5 });
    K.addClouds(8, 600, 140);
  },
  frame(f, K) {
    const T = K.T, L = LINES, t = f / 30;
    const kitch = f >= 1082 && f < 1200;
    // ---------- Duke's deck bends with the heat ----------
    for (const g of DSEG) { const x = g.userData.x, y = dukeY(x, f), y2 = dukeY(x + 0.05, f); g.position.set(x, y, ZD); g.rotation.z = Math.atan2(y2 - y, 0.05); }
    // ---------- the teeth ----------
    const gp = GAP(f); TEETH_L.position.set(-gp / 2, 0, ZB); TEETH_R.position.set(gp / 2, 0, ZB);
    // ---------- thermometer ----------
    THERMO.visible = f < 1705 && !kitch; const tc = TEMP(f), lh = 0.08 + (tc - 5) / 50 * 1.9; THERMO.liq.scale.y = lh; THERMO.liq.position.set(-0.12, 1.25 + lh / 2, 0.1);
    // ---------- the mail wagon: crosses Duke's bridge (line 4), bumps (line 6), stuck on the hump (7-12), crosses Bea's (15) ----------
    let wx, wz, wy, wspin, wstate = 'drive';
    if (f < F.WAGON - 30) { wx = -40; wz = ZD; }
    else if (f < 650) { wx = lerp(-26, 30, clamp((f - F.WAGON + 30) / 150, 0, 1)); wz = ZD; }
    else if (f < 812) { wx = lerp(-26, 30, clamp((f - 700) / 110, 0, 1)); wz = ZD; }
    else if (f < 1600) { wx = lerp(-20, 0.2, sm(812, 880, f)); wz = ZD; wstate = f > 880 ? 'stuck' : 'drive'; }
    else { wx = lerp(-24, 26, clamp((f - 1600) / 120, 0, 1)); wz = ZB; }
    wy = wz === ZD ? dukeY(wx, f) : 0; const wa = wz === ZD ? Math.atan2(dukeY(wx + 0.1, f) - wy, 0.1) : 0;
    WAGON.g.position.set(wx, wy + (wz === ZB && Math.abs(wx) < 0.8 ? 0.05 * Math.abs(Math.sin(f * 1.3)) : 0), wz); WAGON.g.rotation.set(0, 0, wa);
    wspin = wstate === 'stuck' ? f * 0.5 : wx / 0.5; for (const w of WAGON.wheels) w.rotation.z = -wspin;
    WAGON.g.visible = !kitch;
    { const hx = wx + 3.0 * Math.cos(wa), hy = wz === ZD ? dukeY(hx, f) : 0; WHORSE.set(f, { x: hx, y: hy, z: wz, yaw: Math.PI / 2, mode: wstate === 'stuck' ? 'run' : (f > F.WAGON - 30 && wx < 29.9 ? 'walk' : 'stand'), speed: wstate === 'stuck' ? 1.2 : 1, expr: wstate === 'stuck' ? 'angry' : 'happy', visible: !kitch });
      if (wstate === 'stuck') WHORSE.root.rotation.z = Math.atan2(dukeY(hx + 0.1, f) - hy, 0.1); }
    MAILMAN.set(T.act(f, [[0, 'sit', { expr: 'smile' }], [F.STUCK - 4, 'sit', { expr: 'shock', sweat: true }], [F.INCH, 'facepalm', { expr: 'sad' }], [1600, 'sit', { expr: 'grin' }], [F.ROLLED, 'wave', { expr: 'grin' }]], { seed: 9, blink: blinkAt(f, 9) }),
      { x: wx + 1.3 * Math.cos(wa) - 0.0, y: wy + 1.3 * Math.sin(wa) + 0.85, z: wz, yaw: Math.PI / 2, seat: 0.45, visible: !kitch && f > F.WAGON - 30 });
    // ---------- Bea ----------
    { const bk = [[0, 'hammer', { expr: 'deadpan' }], [F.TEETH, 'hammer', { expr: 'deadpan', look: 0.3 }], [50, 'hips', { expr: 'deadpan' }], [F.LAUGH, 'idle', { expr: 'deadpan', look: 0.5 }], [F.COMB + 12, 'cross', { expr: 'deadpan' }],
        [F.CLACK, 'shrug', { expr: 'deadpan' }], [F.STEPS, 'hips', { expr: 'deadpan' }], [F.APART, 'point', { expr: 'smug' }], [F.FLAT, 'hips', { expr: 'smile' }], [F.GOT - 4, 'show', { expr: 'grin', R: [0.42, -0.6, 'moneybag'] }],
        [F.BEG, 'idle', { expr: 'deadpan', look: 0.4 }], [F.AGREED - 3, 'shrug', { expr: 'smile' }], [F.HORSE, 'pointL', { expr: 'smile', look: -0.4 }]];
      let p = [-14.4, 0, -4.8, 0.9];
      if (f < 50) p = [0.9, 0, ZB + 0.9, 0.9];
      if (f >= 1435 && f < 1533) p = [1.6, 0, ZB + 1.0, -1.2];
      if (f >= 1615 && f < 1705) p = [-13.6, 0, -4.0, 1.2];
      if (f >= 1705 && f < 1840) p = [-15.2, 0, -3.0, 2.1];
      BEA.set(T.act(f, bk, { seed: 2, blink: blinkAt(f, 2) }), { x: p[0], y: p[1], z: p[2], yaw: p[3], visible: !kitch }); }
    // ---------- Duke ----------
    { const dk = [[0, 'hips', { expr: 'smug' }], [F.LAUGH - 3, 'point', { expr: 'laugh', talk: true }], [F.COMB + 12, 'clap', { expr: 'laugh' }], [F.SMOOTH, 'show', { expr: 'gloat' }], [F.WAGON, 'cheer', { expr: 'grin' }],
        [F.CREAK, 'idle', { expr: 'nervous' }], [F.GRIN - 3, 'cheer', { expr: 'grin', sweat: true, talk: true }], [F.STUCK, 'shock', { expr: 'scared', sweat: true }], [F.PUSHED - 3, 'push', { expr: 'pained', sweat: true }],
        [F.INCH, 'facepalm', { expr: 'sad', sweat: true }], [1082, 'grab', { expr: 'pained', sweat: true, R: [0.25, 0.25, 'open'] }], [F.POPS, 'shock', { expr: 'shock' }], [1200, 'idle', { expr: 'sad' }],
        [F.BEG - 3, 'beg', { expr: 'beg', talk: true, sweat: true }], [F.AGREED + 8, 'cheer', { expr: 'grin' }], [F.COMBING, 'facepalm', { expr: 'deadpan' }]];
      let p = [-14.2, 0, 6.6, 0.6];
      if (f >= 935 && f < 1023) p = [WAGON.g.position.x - 2.0, WAGON.g.position.y - 0.15, ZD + 0.4, Math.PI / 2];
      if (kitch) p = [KX - 0.3, 0, -1.25, Math.PI - 0.6];
      if (f >= 1705) p = [-12.6, 0, -4.6, -1.02];
      DUKE.set(T.act(f, dk, { seed: 6, blink: blinkAt(f, 6) }), { x: p[0], y: p[1], z: p[2], yaw: p[3] }); }
    // Bea's own horse: stands by her; at the end backs up to the teeth and combs its tail
    { if (f >= 1840) { HORSE.set(f, { x: 1.6, y: 0, z: ZB + 0.1, yaw: Math.PI / 2 + 0.15, mode: 'wag', expr: 'happy', look: -0.5 }); HORSE.root.position.y = 0.03 * Math.sin(f * 0.5); }
      else HORSE.set(f, { x: -15.6, y: 0, z: -3.2, yaw: 0.8, mode: f > F.COMB && f < F.COMB + 30 ? 'stand' : 'eat', expr: f > F.LAUGH && f < F.COMB + 30 ? 'angry' : 'neutral', visible: !kitch }); }
    // jar: Duke twists, hot water, POP
    JAR.visible = LID.visible = kitch; JAR.position.set(KX + 0.3, 1.25, -1.75); const lp = clamp((f - F.POPS) / 12, 0, 1);
    LID.position.set(KX + 0.3 + lp * 0.4, 1.38 + 0.9 * Math.sin(Math.PI * lp * 0.9), -1.75 + lp * 0.3); LID.rotation.set(lp * 6, 0, lp * 4 + (f < F.POPS ? 0.1 * Math.sin(f * 0.8) : 0));
    // x-ray + arrows + money
    const xd = (f >= 1200 && f < 1265) || (f >= 1335 && f < 1435); HOLOD.visible = xd; HOLOD.scale.y = 1; HOLOD.position.y = -0.35 + HUMP(f) * 0.5;
    ARROWS.forEach((a, k) => { a.visible = xd && f > F.FIVE - 10; a.position.y = 0.9 + 0.1 * Math.sin(f * 0.4); a.position.x = (k ? 1 : -1) * (HALF - 1.6 - 0.25 * Math.abs(Math.sin(f * 0.25))); });
    HOLOJ.visible = f >= 1435 && f < 1533;
    MONEY.visible = false; { const bh = new THREE.Vector3(); BEA.root.updateMatrixWorld(true); BEA.head.getWorldPosition(bh); MONEY.position.set(bh.x + 0.5, bh.y - 0.2 + 0.05 * Math.sin(f * 0.2), bh.z + 0.3); }
    K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) e.r.root.visible = !kitch;

    // ---------- shots ----------
    let cam, dof, u; const sh = (a0, b0) => (u = clamp((f - a0) / (b0 - a0), 0, 1), f >= a0 && f < b0);
    const head = (rig) => { rig.root.updateMatrixWorld(true); const v = new THREE.Vector3(); rig.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
    const orbit = (tg, yaw, pitch, dist, fov) => { const a0 = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return { pos: [tg[0] + Math.sin(a0) * Math.cos(p) * dist, tg[1] + Math.sin(p) * dist, tg[2] + Math.cos(a0) * Math.cos(p) * dist], look: tg, fov }; };
    const shakeIt = (c, f0, amp, dur) => { const [sx, sy] = K.shake(f, f0, amp, dur); c.pos[0] += sx; c.pos[1] += sy; return c; };
    const WP = () => [WAGON.g.position.x, WAGON.g.position.y, WAGON.g.position.z];
    if (sh(0, 46)) {               // 1. macro: Bea hammers the steel teeth into the gap
      cam = { pos: [lerp(2.8, 2.5, u), 1.7, ZB + 3.6], look: [0.5, 0.55, ZB + 0.5], fov: 44 * K.push(u, 0.1) }; dof = { focus: 3.9, cinf: 11 };
    } else if (sh(46, 89)) {       // 2. reveal: her bridge full of gaps over the canyon
      cam = { pos: [lerp(-4, -6, u), lerp(2.0, 3.0, u), ZB + 13], look: [0, -1.5, ZB], fov: 46 }; dof = { focus: 13, cinf: 4 };
    } else if (sh(89, 150)) {      // 3. aerial: Red Canyon, two bridges, the river far below
      cam = { pos: [lerp(-26, -20, u), 22, 30], look: [0, -6, 0], fov: 46 }; dof = { focus: 40, cinf: 2 };
    } else if (sh(150, 200)) {     // 4. the contract board ($5,000), post office behind
      cam = { pos: [lerp(-11.4, -12.0, u), 2.1, 3.4], look: [-15.2, 1.9, 0], fov: 46 }; dof = { focus: 4.2, cinf: 9 };
    } else if (sh(200, 236)) {     // 5. the mail bags on the wagon waiting at the post office
      cam = { pos: [lerp(-36.5, -37.2, u), 1.8, ZD + 3.4], look: [-40, 1.2, ZD], fov: 42 }; dof = { focus: 4.6, cinf: 10 };
    } else if (sh(236, 285)) {     // 6. Duke laughs: a giant comb?
      cam = orbit(head(DUKE), lerp(20, 30, u), 4, 2.3, 40 * K.punch(f, F.COMB, 0.14, 7)); dof = { focus: 2.3, cinf: 14 };
    } else if (sh(285, 326)) {     // 7. reaction: Bea deadpan, her horse snorts
      cam = orbit(head(BEA), lerp(40, 50, u), 2, 2.6, 40 * K.push(u, 0.08)); dof = { focus: 2.6, cinf: 13 };
    } else if (sh(326, 372)) {     // 8. low along Duke's smooth deck (dolly)
      cam = { pos: [lerp(-14, -9, u), 0.6, ZD + 0.6], look: [10, 0.2, ZD], fov: 44 }; dof = { focus: 8, cinf: 6 };
    } else if (sh(372, 417)) {     // 9. Duke proud by his sign
      cam = orbit(head(DUKE), lerp(60, 50, u), 6, 3.2, 42); dof = { focus: 3.2, cinf: 11 };
    } else if (sh(417, 470)) {     // 10. the mail wagon rolls over Duke's bridge (track)
      const tc = K.track(f, WP, { off: [-2.5, 2.8, 6.5], lag: 3, lead: 0.2, lookY: 1.0 }); cam = { ...tc, fov: 44 }; dof = { focus: 7, cinf: 7 };
    } else if (sh(470, 536)) {     // 11. Bea's teeth: clack, clack, clack (macro)
      cam = { pos: [lerp(1.2, 0.9, u), 0.55, ZB + 1.9], look: [0, 0.0, ZB + 0.5], fov: 40 }; dof = { focus: 2, cinf: 16 };
    } else if (sh(536, 590)) {     // 12. June: the thermometer climbs to 30
      const th = new THREE.Vector3(0, 2.3, 0.1).applyMatrix4(THERMO.matrixWorld); cam = { pos: [th.x + 0.9, th.y + 0.2, th.z + 2.4], look: [th.x, th.y, th.z], fov: 40 * K.push(u, 0.1) }; dof = { focus: 2.5, cinf: 14 };
    } else if (sh(590, 656)) {     // 13. Duke's deck end creaks against the cliff (macro, shake)
      cam = shakeIt({ pos: [-HALF + 2.0, 0.9, ZD + 2.6], look: [-HALF - 0.6, -0.2, ZD], fov: 40 }, F.CREAK, 0.03, 14); dof = { focus: 3.2, cinf: 12 };
    } else if (sh(656, 720)) {     // 14. July: a bump rises in the middle (side view)
      cam = { pos: [lerp(1, 0, u), 1.2, ZD + 16], look: [0, 0.4, ZD], fov: 40 }; dof = { focus: 16, cinf: 4 };
    } else if (sh(720, 770)) {     // 15. the wagon bumps over it (track)
      const tc = K.track(f, WP, { off: [2.0, 2.6, 5.5], lag: 3, lead: 0.2, lookY: 1.0 }); cam = { ...tc, fov: 44 }; dof = { focus: 6, cinf: 8 };
    } else if (sh(770, 812)) {     // 16. Duke grins: free speed bump! (sweating)
      cam = orbit(head(DUKE), lerp(30, 20, u), 4, 2.2, 40); dof = { focus: 2.2, cinf: 14 };
    } else if (sh(812, 870)) {     // 17. August: the bump becomes a hump (wide, punch)
      cam = { pos: [lerp(-2, 2, u), 0.0, ZD + 20], look: [0, 0.9, ZD], fov: 40 * K.punch(f, F.HUMP, 0.12, 7) }; dof = { focus: 20, cinf: 3 };
    } else if (sh(870, 935)) {     // 18. the wagon stuck on top, wheels spinning (low)
      cam = shakeIt({ pos: [lerp(3.8, 3.4, u), 1.2 + HUMP(f) * 0.6, ZD + 4.6], look: [0.4, HUMP(f) + 0.9, ZD], fov: 44 }, F.STUCK, 0.03, 12); dof = { focus: 5.5, cinf: 9 };
    } else if (sh(935, 980)) {     // 19. Duke pushes, the horse pulls (side)
      cam = { pos: [WP()[0] + 0.5, WP()[1] + 1.4, ZD + 6.0], look: [WP()[0] - 0.2, WP()[1] + 0.9, ZD], fov: 46 }; dof = { focus: 6, cinf: 8 };
    } else if (sh(980, 1023)) {    // 20. close: Duke sweating, the mail does not move
      cam = orbit(head(DUKE), lerp(70, 60, u), 6, 2.0, 40); dof = { focus: 2.0, cinf: 15 };
    } else if (sh(1023, 1082)) {   // 21. re-hook: slow push on the humped bridge
      cam = { pos: [lerp(14, 12, u), 3.2, ZD + 11], look: [0, 0.6, ZD], fov: 42 * K.push(u, 0.12) }; dof = { focus: 16, cinf: 3 };
    } else if (sh(1082, 1140)) {   // 22. kitchen: the stuck jar lid
      cam = { pos: [KX + 1.4, 1.6, -0.8], look: [KX + 0.1, 1.35, -1.6], fov: 44 }; dof = { focus: 1.6, cinf: 14 };
    } else if (sh(1140, 1200)) {   // 23. hot water... POP (punch)
      cam = { pos: [KX + 1.2, 1.5, -0.6], look: [KX + 0.35, 1.45, -1.75], fov: 40 * K.punch(f, F.POPS, 0.14, 6) }; dof = { focus: 1.4, cinf: 16 };
    } else if (sh(1200, 1265)) {   // 24. x-ray of Duke's bridge: heat makes metal grow (+5 cm)
      cam = { pos: [lerp(-1, 1, u), 4.0, ZD + 18], look: [0, 0.3, ZD], fov: 44 }; dof = { focus: 18, cinf: 3 };
    } else if (sh(1265, 1335)) {   // 25. the thermometer at 50, the air shimmering
      const th = new THREE.Vector3(0, 2.6, 0.1).applyMatrix4(THERMO.matrixWorld); cam = { pos: [th.x - 0.9, th.y - 1.6, th.z + 1.8], look: [th.x, th.y + 0.3, th.z], fov: 46 * K.push(u, 0.1) }; dof = { focus: 2.4, cinf: 13 };
    } else if (sh(1335, 1385)) {   // 26. the deck shoves the cliff (abutment macro, shake, dust)
      cam = shakeIt({ pos: [HALF + 4.5, 2.6, ZD + 5.5], look: [HALF, -0.2, ZD], fov: 42 }, F.SHOVED, 0.04, 14); dof = { focus: 4, cinf: 10 };
    } else if (sh(1385, 1435)) {   // 27. it bent up (side, low)
      cam = { pos: [lerp(-3, -1, u), -1.5, ZD + 15], look: [0, 1.0, ZD], fov: 42 }; dof = { focus: 15, cinf: 4 };
    } else if (sh(1435, 1490)) {   // 28. x-ray: Bea's teeth apart in winter
      cam = { pos: [0.7, 3.2, ZB + 1.9], look: [0, 0, ZB], fov: 42 }; dof = { focus: 3.6, cinf: 12 };
    } else if (sh(1490, 1533)) {   // 29. ...and together in summer (closer)
      cam = { pos: [-0.8, 2.6, ZB + 1.3], look: [0, 0, ZB], fov: 40 * K.push(u, 0.1) }; dof = { focus: 2.8, cinf: 14 };
    } else if (sh(1533, 1615)) {   // 30. Bea's bridge flat as a table (low dolly along the deck)
      cam = { pos: [lerp(14, 10, u), 0.55, ZB - 0.6], look: [-10, 0.2, ZB], fov: 44 }; dof = { focus: 10, cinf: 5 };
    } else if (sh(1615, 1660)) {   // 31. the mail rolls across Bea's bridge (track)
      const tc = K.track(f, WP, { off: [-2.0, 2.8, 6.0], lag: 3, lead: 0.2, lookY: 1.0 }); cam = { ...tc, fov: 44 }; dof = { focus: 6.5, cinf: 8 };
    } else if (sh(1660, 1705)) {   // 32. Bea gets the $5,000
      cam = orbit(head(BEA), lerp(70, 60, u), 4, 2.4, 40); dof = { focus: 2.4, cinf: 14 };
    } else if (sh(1705, 1771)) {   // 33. Duke begs for teeth
      cam = orbit(head(DUKE), lerp(-25, -15, u), 2, 2.1, 40 * K.push(u, 0.1)); dof = { focus: 2.1, cinf: 15 };
    } else if (sh(1771, 1840)) {   // 34. Bea agrees (two-shot)
      cam = orbit(head(BEA), lerp(100, 110, u), 6, 3.4, 42); dof = { focus: 3.4, cinf: 10 };
    } else {                       // 35. the horse combs its tail on the teeth (close, hold)
      cam = { pos: [lerp(2.6, 2.2, u), 2.6, ZB + 3.8], look: [0.8, 0.9, ZB], fov: 44 * K.push(u, 0.1) }; dof = { focus: 4.0, cinf: 10 };
    }
    // ---------- particles + graphics ----------
    K.leaves(f, cam.look, { area: 12, count: 14, fall: 0.3, wind: [1.2, 0.2], colors: ['#c8a070', '#a8804a', '#d8b888'] });   // blowing dust
    if (f >= 1840) K.leaves(f, [0.6, 0.6, ZB], { area: 1.2, count: 10, fall: 0.25, wind: [0.4, 0.1], colors: ['#f4efe4', '#e8dcc4'] });   // loose tail hairs
    if (WAGON.g.position.z === ZD && f > 880 && f < 1082) K.puff(f, 880 + Math.floor((f - 880) / 20) * 20, WAGON.g.position.x - 0.85, ZD + 0.8, 5, 0.4, '#d8b080');
    K.puff(f, F.SHOVED, HALF + 0.2, ZD, 12, 1.0, '#c8805a'); K.puff(f, F.CREAK, -HALF - 0.2, ZD, 8, 0.6, '#c8805a');
    if (f > F.HUMP - 10 && f < 1082) K.sparks(f, F.STUCK, 1082, () => [WAGON.g.position.x - 0.85, WAGON.g.position.y + 0.1, ZD + 0.8], { dir: [-1, 0.6, 0.3], rate: 6, speed: 3, life: 8, seed: 5 });
    if (kitch) K.steam(f, [KX + 0.3, 1.3, -1.75], { rate: 6, size: 0.35, rise: 0.8, drift: [0.1, 0.1], seed: 3, alpha: f > F.HOT ? 0.8 : 0 });
    K.badge(f, F.TEETH, 'STEEL TEETH', [0, 0.8, ZB + 0.6], { icon: 'warn', f1: 88 });
    K.badge(f, F.K5, '$5,000', { sx: 0.5, sy: 0.32 }, { icon: 'coin', f1: 232, size: 1.3 });
    K.badge(f, F.COMB, 'GIANT COMB?', { sx: 0.5, sy: 0.3 }, { style: 'stamp', f1: 324, size: 1.4 });
    K.hud(f, F.STEPS, { stages: 3, labels: ['JUNE 30°', 'JULY 40°', 'AUG 50°'], u: clamp((f - F.JUNE) / (F.INCH - F.JUNE), 0, 1), f1: 1080 });
    if (f >= 812 && f < 870) K.badge(f, F.HUMP, 'HUMP!', [0, HUMP(f) + 2.2, ZD], { icon: 'up', f1: 868 });
    if (f >= 1200 && f < 1265) K.badge(f, F.FIVE, '+5 CM', [0, HUMP(f) + 2.4, ZD], { icon: 'up', f1: 1263, size: 1.3 });
    if (f >= 1435 && f < 1533) K.badge(f, F.TOGETHER, 'TEETH SLIDE', [0, 0.7, ZB], { icon: 'check', f1: 1531 });
    const kl = kitch ? K.light('interior', { az: 80, el: 45, exposure: 1.3 }) : f < 1705 ? K.light('day', { az: 75, el: 42, shadowExt: 30, exposure: 1.32, fogFar: 380 }) : K.light('golden', { az: 75, el: 24, shadowExt: 30, fogFar: 380 });
    return { light: kl, cam, dof, actors: [], fx: [] };
  },
};
