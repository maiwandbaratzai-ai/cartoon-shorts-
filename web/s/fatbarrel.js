// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Barrels Are Fat in the Middle" — invented story, engine: The Upgrade (SCRIPTS.md §000).
// Harbor boss Gustav ("Progress!") makes square barrels: four sailors and a song to move one; 300 a day, the sailors run out of
// songs; Coconut the ship's monkey wants the banana barrel (at the bottom). Upgrade #2: perfect tubes roll straight down the pier
// into the sea; forty barrels bob away, Coconut surfing on the banana one. Explainer: the belly touches the ground at one spot
// (roll + spin like a top); the curve is an arch, hoops squeeze the staves. Fat barrels back: one sailor each; the other three
// start a band, Coconut drums the banana barrel.
import { TOTAL, LINES, wf } from './fatbarrel_timing.js';
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
const EX = -22;                  // explainer spot on the quay
const WY = -1.3;                 // water level
let THREE, F = {}, GUS, SAIL = [], MONKEY, SQ, SQSTACK, TUBES, TUBE1, FAT = [], BOB = [], BANANA, HOLO, CONTACT, SPIN, ARCH = [], HOOPS = [], BANDBOX, NOTES = [];

function fatBarrel(K, parent, label) { const g = new THREE.Group(); parent.add(g); const pts = []; for (let k = 0; k <= 16; k++) { const y = k / 16; pts.push(new THREE.Vector2(0.36 + 0.1 * Math.sin(Math.PI * y), y * 1.1)); }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), K.mat('wood', '#a8703a', { detail: 0.3 })); g.add(body);
  for (let s = 0; s < 14; s++) { const a = s / 14 * Math.PI * 2; const ln = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.06, 0.012), K.paint('#5a3a22', { rough: 0.7 })); ln.position.set(Math.cos(a) * 0.455, 0.55, Math.sin(a) * 0.455); g.add(ln); }
  for (const y of [0.1, 0.3, 0.8, 1.0]) { const r = 0.36 + 0.1 * Math.sin(Math.PI * y / 1.1) + 0.012; const h = new THREE.Mesh(new THREE.TorusGeometry(r, 0.022, 8, 32), K.paint('#3a3a40', { rough: 0.3, metal: 0.8 })); h.rotation.x = Math.PI / 2; h.position.y = y; g.add(h); }
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 28), K.mat('wood', '#c8905a')); lid.position.y = 1.09; g.add(lid);
  if (label) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.22), K.set.textMat(label, { bg: '#f2c230', fg: '#1a1a1a', w: 384, h: 160 })); l.position.set(0, 0.55, 0.47); g.add(l); }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }
function sqBarrel(K, parent, label) { const g = new THREE.Group(); parent.add(g); K.rbox(0.8, 1.0, 0.8, 0.05, K.mat('wood', '#a8703a', { detail: 0.3 }), 0, 0.5, 0, g);
  for (const y of [0.12, 0.88]) K.rbox(0.83, 0.06, 0.83, 0.02, K.paint('#3a3a40', { rough: 0.3, metal: 0.8 }), 0, y, 0, g);
  if (label) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.22), K.set.textMat(label, { bg: '#f2c230', fg: '#1a1a1a', w: 384, h: 160 })); l.position.set(0, 0.5, 0.416); g.add(l); }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }
function tube(K, parent) { const g = new THREE.Group(); parent.add(g); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.1, 28), K.mat('wood', '#a8703a', { detail: 0.3 })); c.position.y = 0.55; g.add(c);
  for (const y of [0.1, 0.55, 1.0]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.022, 8, 32), K.paint('#3a3a40', { rough: 0.3, metal: 0.8 })); h.rotation.x = Math.PI / 2; h.position.y = y; g.add(h); }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { SQUARE: wf(0, 'square'), FOUR: wf(0, 'four'), SONG: wf(0, 'song'), PROG: wf(1, 'progress'), STACK: wf(1, 'stack'), WHY: wf(1, 'why'), FAT: wf(1, 'fat'), SHIPS: wf(2, '300'), NOON: wf(2, 'noon'), SONGS: wf(2, 'songs'),
      COCO: wf(3, 'coconut'), BANANAS: wf(3, 'bananas'), BOTTOM: wf(3, 'bottom'), UPG: wf(4, 'upgraded'), TUBES: wf(4, 'tubes'), PROG2: wf(4, 'progress'), ROLLS: wf(5, 'rolls'), PIER: wf(5, 'pier'), SEA: wf(5, 'sea'),
      FORTY: wf(6, 'forty'), SURF: wf(6, 'surfing'), WHAT: wf(7, 'what'), BELLY: wf(8, 'belly'), ONE: wf(8, 'one'), SPIN: wf(8, 'spin'), TOP: wf(8, 'top'), ARCH: wf(9, 'arch'), HOOPS: wf(9, 'iron'), SQUEEZE: wf(9, 'squeeze'), BURST: wf(9, 'burst'),
      BACK: wf(10, 'back'), PER: wf(10, 'per'), BAND: wf(11, 'band'), DRUMS: wf(11, 'drums') };
    // ================= Port Puddle =================
    const G = K.group();
    K.add(new THREE.PlaneGeometry(600, 400), K.paint('#1a5a8a', { rough: 0.12, coat: 1 }), 0, WY, 0, G).rotation.x = -Math.PI / 2;
    K.slab(-60, -6, WY - 1, 0, -30, 30, K.mat('rock', '#a8a098', { detail: 0.6 }), G);                                        // stone quay
    for (let x = -6; x < 10; x += 0.32) K.rbox(0.3, 0.12, 3.2, 0.02, K.mat('wood', hash(x) > 0.5 ? '#a87a4a' : '#9a6a3a', { detail: 0.4 }), x + 0.15, -0.06, 0, G);   // pier planks
    for (let x = -5.5; x < 10; x += 2.2) for (const z of [-1.55, 1.55]) K.cyl(0.16, 0.16, 2.0, K.mat('wood', '#6a4a2a'), x, WY - 0.7, z, G, 10);
    for (let x = -5.5; x < 10; x += 2.2) for (const z of [-1.6]) { K.cyl(0.12, 0.12, 0.9, K.mat('wood', '#7a5234'), x, 0, z, G, 10); }
    for (const z of [-1.6]) { const rope = K.cyl(0.03, 0.03, 15.4, K.paint('#d8c08a', { rough: 0.8 }), -5.5 + 7.7, 0.75, z, G, 6); rope.rotation.z = Math.PI / 2; rope.position.set(2.2, 0.8, z); }
    const wh = S.building({ w: 10, d: 7, floors: 2, seed: 4, color: '#8a4a3a', kind: 'brick', gable: 'pitched', shop: 'PORT PUDDLE CARGO', awning: ['#1f3a6a', '#f4efe4'], shutters: '#1f3a6a' }); wh.position.set(-14, 0, -6);
    const wh2 = S.building({ w: 7, d: 6, floors: 3, seed: 9, color: '#e8d8b8', kind: 'plaster', gable: 'step', shop: 'SAIL & ROPE', awning: ['#c0392b', '#f4efe4'], shutters: '#2a6a5a', flowers: true }); wh2.position.set(-24, 0, -7);
    for (let k = 0; k < 8; k++) { const c = K.rbox(0.9, 0.7, 0.9, 0.04, K.mat('wood', '#c8a070'), -10 + (k % 4) * 0.95, 0.35 + Math.floor(k / 4) * 0.7, -3.4, G); }
    for (const [x, z] of [[-7, 2.2], [-12, 2.4]]) { const b = S.bollard(); b.position.set(x, 0, z); }
    for (const x of [-9]) { const l = S.streetLamp(); l.position.set(x, 0, -2.6); }
    const cb = S.board('BARRELS TODAY|300', 1.8, 1.0, { frame: '#1f3a6a' }); cb.position.set(-7.5, 0, -2.2); cb.rotation.y = 0.3;
    const pb = S.board('PIER 3|NO RUNNING', 1.4, 0.7, { frame: '#c0392b' }); pb.position.set(-6.8, 0, -2.4); pb.scale.setScalar(0.8);
    // the ship (moored beside the pier) + a far lighthouse + boats
    const SH = new THREE.Group(); SH.position.set(2.5, 0, -5.2); G.add(SH);
    K.rbox(11, 2.2, 3.4, 0.5, K.paint('#1f3a6a', { rough: 0.3 }), 0, WY + 0.9, 0, SH); K.rbox(11.1, 0.35, 3.5, 0.15, K.paint('#c0392b', { rough: 0.3 }), 0, WY + 0.15, 0, SH); K.rbox(11.2, 0.12, 3.6, 0.04, K.gold(), 0, WY + 2.05, 0, SH);
    K.rbox(10.6, 0.1, 3.1, 0.03, K.mat('wood', '#c8a070'), 0, WY + 2.0, 0, SH); K.rbox(2.4, 1.4, 2.0, 0.12, K.paint('#f4efe4', { rough: 0.3 }), -3.2, WY + 2.7, 0, SH);
    for (let k = 0; k < 3; k++) K.sphere(0.16, K.glass({ color: '#bfe4ff' }), -3.8 + k * 0.6, WY + 2.85, 1.02, SH, 1, 1, 0.3);
    K.cyl(0.13, 0.15, 9, K.mat('wood', '#7a5234'), 0.8, WY + 2, 0, SH, 12); const sail = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.6, 8, 8), K.mat('fabric', '#f4efe4', { plain: true })); sail.position.set(0.8, WY + 6.5, 0.1); const sp = sail.geometry.attributes.position; for (let i = 0; i < sp.count; i++) sp.setZ(i, 0.4 * Math.cos(sp.getX(i) / 1.8 * 1.5)); sail.geometry.computeVertexNormals(); SH.add(sail);
    const nm = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.45), S.textMat('SALTY SUSAN', { bg: '#1f3a6a', fg: '#f2c230', w: 640, h: 100, border: false })); nm.position.set(3.2, WY + 1.2, 1.72); SH.add(nm);
    for (let x = -5; x <= 5; x += 0.5) K.cyl(0.03, 0.03, 0.6, K.gold(), x, WY + 2.05, 1.6, SH, 6); K.rbox(10.4, 0.05, 0.05, 0.02, K.gold(), 0, WY + 2.65, 1.6, SH);
    for (let k = 0; k < 4; k++) { const b = K.rbox(2.4, 0.6, 1.0, 0.25, K.paint(['#c0392b', '#f2c230', '#2a9a6a', '#f4efe4'][k], { rough: 0.3 }), 18 + k * 7, WY + 0.2, 8 + k * 5, G); }
    K.cyl(1.2, 1.6, 9, K.paint('#f4efe4'), 40, WY, -40, G, 20); for (let k = 0; k < 3; k++) K.cyl(1.25 - k * 0.12, 1.4 - k * 0.12, 1, K.paint('#c0392b'), 40, WY + 1 + k * 3, -40, G, 20);
    S.bake(G);
    // ================= barrels =================
    SQ = sqBarrel(K, sc); SQSTACK = new THREE.Group(); sc.add(SQSTACK);
    for (let k = 0; k < 9; k++) { const b = sqBarrel(K, SQSTACK, k === 0 ? 'BANANAS' : k % 3 === 1 ? 'PICKLES' : null); b.position.set(-4.4 + (k % 3) * 0.82, Math.floor(k / 3) * 1.0, -0.6 + (k > 5 ? 0 : 0)); }
    TUBES = new THREE.Group(); sc.add(TUBES); for (let k = 0; k < 6; k++) { const t = tube(K, TUBES); t.position.set(-4.4 + (k % 3) * 0.85, 0.02, 0.6 * (k > 2 ? -1 : 1) - 0.4); }
    TUBE1 = tube(K, sc);
    for (let k = 0; k < 4; k++) FAT.push(fatBarrel(K, sc, k === 0 ? 'BANANAS' : null));
    for (let k = 0; k < 40; k++) { const b = tube(K, sc); b.userData = { x: 10 + hash(k) * 16, z: -1 + (hash(k + 7) - 0.5) * 14, ph: hash(k + 3) * 6 }; BOB.push(b); }
    BANANA = fatBarrel(K, sc, 'BANANAS'); const bl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.24), S.textMat('BANANAS', { bg: '#f2c230', fg: '#1a1a1a', w: 384, h: 160 })); BANANA.add(bl); bl.position.set(0, 0.55, -0.47); bl.rotation.y = Math.PI;
    // explainer pieces: x-ray holo, contact glow, spin trace, arch staves, hoops
    HOLO = K.holoBox(1.4, 1.2, 1.4, EX, 0.6, 0, sc, '#36e2ff');
    CONTACT = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffdd40').multiplyScalar(2.2), toneMapped: false })); CONTACT.userData.ndSkip = true; sc.add(CONTACT);
    SPIN = K.trace(Array.from({ length: 33 }, (_, k) => [EX + 1.1 * Math.cos(k / 32 * Math.PI * 2), 0.06, 1.1 * Math.sin(k / 32 * Math.PI * 2)]), { color: '#7af8a0', r: 0.03 });
    for (let k = 0; k < 7; k++) { const pts = []; for (let j = 0; j <= 10; j++) { const y = j / 10; pts.push([EX + 3.0 + (k - 3) * 0.12, 0.05 + y * 1.6, 0.0 + 0.0]); } }
    for (let k = 0; k < 9; k++) { const a = (k / 8 - 0.5) * 1.4; const p = []; for (let j = 0; j <= 12; j++) { const y = j / 12; p.push([EX + 3.2 + Math.sin(a) * (0.5 + 0.16 * Math.sin(Math.PI * y)), 0.05 + y * 1.6, Math.cos(a) * (0.5 + 0.16 * Math.sin(Math.PI * y))]); } ARCH.push(K.trace(p, { color: '#36e2ff', r: 0.02 })); }
    for (let k = 0; k < 3; k++) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.035, 8, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff9a3a').multiplyScalar(2.0), toneMapped: false })); h.rotation.x = Math.PI / 2; h.userData.ndSkip = true; sc.add(h); HOOPS.push(h); }
    for (let k = 0; k < 6; k++) { const n = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2c230').multiplyScalar(1.6), toneMapped: false })); n.userData.ndSkip = true; const st = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.35, 0.03), n.material); st.position.set(0.1, 0.17, 0); n.add(st); st.userData.ndSkip = true; sc.add(n); NOTES.push(n); }
    // ================= characters =================
    GUS = K.stick({ jacket: '#1f3a6a', pants: '#2a2a30', hat: 'pilot', hatColor: '#1f3a6a', moustache: '#d8d4cc', badge: true, belt: '#3a2418', tie: '#c0392b', build: 'stout' }, { key: 'gus' });
    const so = [{ jacket: '#f4f2ee', pants: '#1f3a6a', hat: 'beanie', hatColor: '#c0392b', scarf: '#1f3a6a', beard: true }, { jacket: '#c0392b', pants: '#2a2a30', hat: 'cap', hatColor: '#1f3a6a', hairStyle: 'ponytail', hair: '#e8a040', belt: '#3a2418' },
      { jacket: '#2a9a6a', pants: '#f2e2c0', hat: 'beanie', hatColor: '#f2c230', moustache: '#3a2418', vest: '#1f3a6a' }, { jacket: '#f2c230', pants: '#1f3a6a', hairStyle: 'curly', hair: '#3a2418', scarf: '#c0392b', gloves: '#3a2418' }];
    for (let k = 0; k < 4; k++) SAIL.push(K.stick(so[k], { key: 'sail' + k }));
    MONKEY = K.animal('monkey', { seed: 3, scale: 1.3 });
    K.addClouds(8, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 818 && f < 1097;
    // ---------- the carried square barrel: four sailors walk it along the pier ----------
    const carryX = (g) => lerp(-3, 2.5, clamp((g - 0) / 114, 0, 1));
    SQ.visible = f < 114 || (f >= 243 && f < 382);
    let sqx = carryX(f), sqz = 0.2, sqy = 0.75;
    if (f >= 243 && f < 382) { sqx = lerp(-1.0, 1.4, clamp((f - 243) / 140, 0, 1)); sqy = f < F.NOON ? 0.75 : 0.02; }
    SQ.position.set(sqx, sqy + (f < 114 ? 0.04 * Math.abs(Math.sin(f * 0.3)) : 0), sqz);
    SQSTACK.visible = f >= 114 && f < 515 + 30; TUBES.visible = f >= F.TUBES - 4 && f < 818;
    // tube 1: rolls straight down the pier and splashes into the sea
    let tx = -2.0, ty = 0.42, tvis = f >= 597 && f < 709, troll = 0;
    if (tvis) { const d = Math.max(0, (f - F.ROLLS + 4) / 30) * 3.4; tx = -2.0 + d; troll = d / 0.4; if (tx > 9.6) { ty = 0.42 - (tx - 9.6) * 1.2; ty = Math.max(WY, ty); } }
    TUBE1.visible = tvis; TUBE1.position.set(tx, ty, 0.3); TUBE1.rotation.set(Math.PI / 2, 0, -troll); TUBE1.position.y = ty - 0.55 * 0 ; TUBE1.children.forEach(() => {});
    // the tube's mesh is built standing; laid on its side (axis along z), centre at its middle
    TUBE1.rotation.set(0, 0, 0); TUBE1.rotation.x = Math.PI / 2; TUBE1.rotateY(troll); TUBE1.position.set(tx, Math.max(WY + 0.1, ty), 0.3 + 0.55);
    // bobbing barrels at sea + Coconut surfing the banana barrel
    BOB.forEach((b, k) => { const on = f >= 709 && f < 818; b.visible = on; if (on) { const u0 = b.userData, t = (f - 709) / 30; b.position.set(u0.x + t * 1.2, WY - 0.1 + 0.08 * Math.sin(t * 3 + u0.ph), u0.z + 0.55); b.rotation.set(Math.PI / 2 + 0.15 * Math.sin(t * 2 + u0.ph), 0, u0.ph); } });
    const bx = 11 + Math.max(0, (f - 709) / 30) * 1.4, by = WY + 0.35 + 0.1 * Math.sin(f * 0.15);
    BANANA.visible = (f >= 709 && f < 818) || f >= 1195; if (f < 818) { BANANA.position.set(bx, by - 0.45, 0.8 + 0.55); BANANA.rotation.set(Math.PI / 2, 0, 0.15 * Math.sin(f * 0.1)); } else { BANANA.position.set(-0.6, 0, 1.2); BANANA.rotation.set(0, 0.3, 0); }
    // fat barrels: explainer roll + spin; the comeback (one sailor each)
    FAT.forEach((b, k) => { b.visible = false; });
    if (ex) { const b = FAT[0]; b.visible = true; const roll = f < 900; if (roll) { const x = lerp(EX - 2.5, EX, sm(827, 890, f)); b.position.set(x, 0.46, 0.55); b.rotation.set(Math.PI / 2, 0, 0); b.rotateY(-(x - EX + 2.5) / 0.46); }
      else { b.position.set(EX, 0.46, 0); b.rotation.set(0, 0, 0); b.rotation.z = Math.PI / 2 - 0.25; b.rotation.y = (f - 900) * 0.18; b.position.y = 0.46; }
      if (f >= 981) { b.visible = false; } }
    if (f >= 1097 && f < 1195) FAT.forEach((b, k) => { if (k === 0) return; b.visible = true; const x = lerp(-6 + k * 0.4, -1 + k * 1.6, sm(1100 + k * 6, 1180, f)); b.position.set(x, 0.46, -0.9 + k * 0.7 + 0.55); b.rotation.set(Math.PI / 2, 0, 0); b.rotateY(-x / 0.46); });
    if (f >= 1195) FAT.forEach((b, k) => { if (k === 0) return; b.visible = true; b.position.set(-4 + k * 1.1, 0, -1.2); b.rotation.set(0, k, 0); });
    HOLO.visible = ex && f < 981; CONTACT.visible = ex && f >= F.BELLY - 4 && f < 981; CONTACT.position.set(f < 900 ? lerp(EX - 2.5, EX, sm(827, 890, f)) : EX, 0.04, f < 900 ? 0.55 + 0.0 : 0);
    SPIN.show(ex && f >= F.SPIN - 4 && f < 981 ? sm(F.SPIN - 4, F.TOP + 10, f) : 0);
    ARCH.forEach((a, k) => a.show(ex && f >= 981 ? sm(F.ARCH - 6 + k * 2, F.ARCH + 10 + k * 2, f) : 0));
    HOOPS.forEach((h, k) => { const y = [0.25, 0.85, 1.4][k], r = 0.5 + 0.16 * Math.sin(Math.PI * (y - 0.05) / 1.6); h.visible = ex && f >= F.HOOPS - 4; const sq = sm(F.SQUEEZE - 4, F.SQUEEZE + 10, f); h.position.set(EX + 3.2, y + (1 - sq) * 0.25 * (k === 1 ? 0 : (k ? 1 : -1)), 0); h.scale.setScalar((r + 0.04 * (1 - sq)) / 0.75); });
    NOTES.forEach((n, k) => { const on = (f < 114) || f >= F.BAND; n.visible = on && !ex; const t = ((f + k * 11) % 40) / 40; const base = f < 114 ? [sqx, 2.4, sqz] : [1.6, 2.4, -0.2]; n.position.set(base[0] + (k - 2.5) * 0.35, base[1] + t * 1.2, base[2]); n.material.opacity = 1; n.scale.setScalar(t < 0.85 ? 1 : 1 - (t - 0.85) * 6); });
    // ---------- characters ----------
    const sk = (k) => { if (f < 114) return [[0, 'carry', { expr: k % 2 ? 'grin' : 'smile', talk: true, item: 'box' }]];
      if (f < 243) return [[0, 'idle', { expr: 'pained', sweat: true }], [F.STACK, 'shrug', { expr: 'deadpan' }]];
      if (f < 382) return [[0, 'push', { expr: 'nervous', sweat: true, talk: true, phase: (f / 18) % 1 }], [F.NOON, 'sit', { expr: 'sad' }], [F.SONGS, 'facepalm', { expr: 'pained' }]];
      if (f < 597) return [[0, 'cross', { expr: 'deadpan' }], [F.TUBES, 'shock', { expr: 'confused' }]];
      if (f < 709) return [[0, 'point', { expr: 'shock' }], [F.SEA, 'facepalm', { expr: 'pained' }]];
      if (f < 1097) return [[0, 'shrug', { expr: 'confused' }]];
      if (f < 1195) return [[0, 'push', { expr: 'grin', phase: (f / 18) % 1 }]];
      return [[0, k === 0 ? 'clap' : 'cheer', { expr: 'laugh', talk: true }], [F.DRUMS, k === 0 ? 'cheer' : 'clap', { expr: 'laugh' }]]; };
    SAIL.forEach((s, k) => { let p;
      if (f < 114) { const off = [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]][k]; p = { x: sqx + off[0], z: sqz + off[1], yaw: Math.PI / 2 }; }
      else if (f < 243) p = { x: -1.6 + k * 0.9, z: 1.2 + (k % 2) * 0.4, yaw: -0.4 };
      else if (f < 382) { if (k === 0) p = { x: sqx - 0.65, z: sqz, yaw: Math.PI / 2 }; else p = { x: -1.2 + k * 1.0, z: 1.25, yaw: -0.2, mode: 'sit' }; }
      else if (f < 597) p = { x: -1.5 + k * 0.9, z: 1.2, yaw: -0.2 };
      else if (f < 709) p = { x: -2.6 + k * 0.7, z: 1.35, yaw: Math.PI / 2 };
      else if (f < 1097) p = { visible: false };
      else if (f < 1195) { const b = FAT[Math.min(3, k + 1)]; p = k < 3 ? { x: b.position.x - 0.7, z: b.position.z - 0.55, yaw: Math.PI / 2 } : { x: 2.0, z: 1.3, yaw: -0.4 }; }
      else p = { x: [0.6, 1.6, 2.6, -3.2][k], z: [0.3, -0.3, 0.3, -0.4][k], yaw: -0.3 };
      if (ex && k === 0) p = { x: f < 900 ? lerp(EX - 2.5, EX, sm(827, 890, f)) - 0.75 : EX - 0.8, z: 0.55, yaw: Math.PI / 2 };
      const A = T.act(f, ex && k === 0 ? [[0, 'push', { expr: 'grin', phase: (f / 18) % 1 }], [900, 'point', { expr: 'laugh' }]] : sk(k), { seed: 30 + k, blink: blink(30 + k), phase: (f / 18) % 1 });
      if (f < 114 || (f >= 1097 && f < 1195 && k < 3) || (ex && k === 0 && f < 890)) A.opts.mode = 'walk';
      s.set(A, { ...p, seat: 0.3 }); });
    let gp = { x: -5.6, z: 1.0, yaw: 0.6 };
    if (f >= 515 && f < 597) gp = { x: -2.8, z: 1.2, yaw: 0.3 };
    if (f >= 597 && f < 818) gp = { x: -3.4, z: 0.9, yaw: Math.PI / 2 };
    if (f >= 1097) gp = { x: -2.6, z: 1.6, yaw: 0.4 };
    if (ex) gp = { visible: false };
    const gk = [[0, 'hips', { expr: 'proud' }], [F.PROG - 4, 'cheer', { expr: 'excited', talk: true }], [F.STACK, 'show', { expr: 'proud' }], [F.WHY, 'hips', { expr: 'smug' }], [243, 'point', { expr: 'stern' }], [F.SONGS, 'idle', { expr: 'confused' }],
      [515, 'show', { expr: 'excited' }], [F.PROG2 - 4, 'cheer', { expr: 'excited', talk: true }], [597, 'hips', { expr: 'proud' }], [F.PIER, 'shock', { expr: 'shock' }], [F.SEA, 'panic', { expr: 'scared' }], [709, 'facepalm', { expr: 'pained' }],
      [783, 'think', { expr: 'confused' }], [1097, 'show', { expr: 'proud' }], [F.PER, 'hips', { expr: 'grin' }], [F.BAND, 'shock', { expr: 'confused' }], [F.DRUMS, 'shrug', { expr: 'smile' }]];
    GUS.set(T.act(f, gk, { seed: 2, blink: blink(2) }), gp);
    // Coconut: on the ship rail, wants the banana barrel (bottom of the stack), surfs it out to sea, drums on it at the end
    let mp = { x: 1.0, z: -3.4, y: 0.75, yaw: 0.3, mode: 'sit', expr: 'neutral' };
    if (f >= 382 && f < 515) { mp = f < 450 ? { x: -0.8, z: -3.4, y: 0.75, yaw: -0.4, mode: 'sit', expr: 'happy' } : { x: -4.4, z: 0.2, yaw: Math.PI, mode: 'stand', expr: 'angry', lift: 0.6 }; }
    else if (f >= 515 && f < 709) mp = { x: -4.6, z: 1.0, yaw: 0.5, mode: 'sit', expr: 'sad' };
    else if (f >= 709 && f < 818) mp = { x: bx, z: 1.35, y: by + 0.48, yaw: Math.PI / 2, mode: 'stand', expr: 'happy' };
    else if (ex) mp = { visible: false };
    else if (f >= 1097 && f < 1195) mp = { x: 2.5, z: -3.4, y: 0.75, yaw: 0.3, mode: 'wag', expr: 'happy' };
    else if (f >= 1195) mp = { x: -0.6, z: 1.2, y: 1.1, yaw: 0.2, mode: f % 12 < 6 ? 'stand' : 'beg', expr: 'happy', lift: (f % 12) / 12 };
    MONKEY.set(f, mp);

    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const L = K.light('golden', { az: 70, el: 32, shadowExt: 26, exposure: 1.22 });
    const body = (x, z, y = 0) => [[x, y, z], [x, y + 2.0, z]];
    if (sh(0, 55)) {                          // 1. four sailors carry one square barrel, singing (wide on the pier)
      cam = fitT(K, [[sqx - 1, 0, sqz - 0.8], [sqx + 1, 2.4, sqz + 0.8], ...body(-5.6, 1.0)], { yaw: 75, pitch: 8, fov: 42 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(55, 114)) {                 // 2. tracking the procession
      const tc = K.track(f, (g) => [carryX(g), 0, 0.2], { off: [1.5, 1.8, 6.0], lag: 5, lookY: 1.0 }); cam = { ...tc, fov: 44 };
    } else if (sh(114, 170)) {                // 3. "Progress!" Gustav and the neat square stack (wide)
      cam = fitT(K, [[-4.8, 0, -0.6], [-2.8, 3.0, -0.6], ...body(-5.6, 1.0), ...body(-1.6, 1.2)], { yaw: 70, pitch: 8, fov: 42 });
    } else if (sh(170, 243)) {                // 4. Gustav smug; the sailors shrug — why are real barrels fat?
      cam = fitT(K, [...body(-5.6, 1.0), ...body(1.1, 1.6), [-4.8, 0, -0.6], [-2.8, 3.0, -0.6]], { yaw: 100, pitch: 10, fov: 44 });
    } else if (sh(243, 310)) {                // 5. 300 barrels a day: one sailor shoves a cube along (wide)
      cam = fitT(K, [[sqx - 1.2, 0, 0], [sqx + 0.6, 1.2, 0], [-7.5, 2.2, -2.2], ...body(-5.6, 1.0)], { yaw: 65, pitch: 8, fov: 42 }); cam.fov *= K.punch(f, F.SHIPS, 0.08, 6);
    } else if (sh(310, 382)) {                // 6. by noon: the sailors sit, out of songs
      cam = fitT(K, [...body(-0.2, 1.25), ...body(2.8, 1.25), [sqx, 0, 0.2]], { yaw: 90, pitch: 10, fov: 42 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(382, 440)) {                // 7. Coconut on the ship rail eyes the stack (reaction)
      cam = { pos: [0.4, 1.6, -0.6], look: [-0.8, 1.2, -3.4], fov: 42 * K.push(u, 0.08) }; dof = { focus: 3.0, cinf: 10 };
    } else if (sh(440, 515)) {                // 8. the banana barrel is at the bottom; Coconut tugs it (wide)
      cam = fitT(K, [[-4.8, 0, -0.6], [-2.8, 3.0, -0.6], [-4.4, 0, 0.2], ...body(-5.6, 1.0)], { yaw: 95, pitch: 6, fov: 42 }); cam.fov *= K.punch(f, F.BOTTOM, 0.08, 6);
    } else if (sh(515, 560)) {                // 9. upgrade: perfect tubes — "Progress!"
      cam = fitT(K, [...body(-2.8, 1.2), [-4.8, 0, -1.0], [-2.6, 1.2, 0.2]], { yaw: 70, pitch: 10, fov: 42 });
    } else if (sh(560, 597)) {                // 10. the tubes (low, glossy)
      cam = fitT(K, [[-4.8, 0, -1.0], [-2.6, 1.2, 0.2], ...body(-2.8, 1.2)], { yaw: 115, pitch: 4, fov: 40 }); cam.fov *= K.push(u, 0.1);
    } else if (sh(597, 640)) {                // 11. a tube rolls great, straight ahead (tracking)
      cam = fitT(K, [[tx - 2.5, 0, 0.8], [tx + 1.5, 1.0, 0.8], ...body(-3.4, 0.9)], { yaw: 80, pitch: 8, fov: 44 });
    } else if (sh(640, 680)) {                // 12. straight down the pier (behind it, looking out to sea)
      cam = { pos: [tx - 4.5, 3.2, 3.0], look: [tx + 2.5, 0.3, 0.6], fov: 44 }; dof = { focus: 5.5, cinf: 4 };
    } else if (sh(680, 709)) {                // 13. straight into the sea (wide, splash)
      cam = fitT(K, [[7, -1, 0], [12, 1.5, 0.8]], { yaw: 70, pitch: 10, fov: 44 }); cam.fov *= K.punch(f, F.SEA, 0.1, 6);
    } else if (sh(709, 783)) {                // 14. forty barrels bob away, Coconut surfing on the banana one (tracking)
      cam = fitT(K, [[bx - 3, WY, 0], [bx + 2, by + 1.5, 1.4], [bx - 1, WY, 5]], { yaw: lerp(60, 70, u), pitch: 14, fov: 44 });
    } else if (sh(783, 818)) {                // 15. so what is the fat middle for? Gustav (reaction)
      cam = { pos: [-2.6, 1.7, 2.9], look: [-3.4, 1.6, 0.9], fov: 40 * K.push(u, 0.08) }; dof = { focus: 2.2, cinf: 12 };
    } else if (sh(818, 900)) {                // 16. x-ray: one sailor rolls a fat barrel, it touches only at its belly
      cam = fitT(K, [[EX - 3.5, 0, 0.5], [EX + 0.6, 1.0, 0.5], ...body(SAIL[0].root.position.x, 0.55)], { yaw: 80, pitch: 10, fov: 42 });
    } else if (sh(900, 981)) {                // 17. spin it like a top
      cam = fitT(K, [[EX - 1.2, 0, -1.2], [EX + 1.2, 1.2, 1.2], ...body(EX - 0.8, 0.55)], { yaw: 70, pitch: 22, fov: 42 }); cam.fov *= K.punch(f, F.TOP, 0.08, 6);
    } else if (sh(981, 1040)) {               // 18. the curve is an arch (glowing staves)
      cam = fitT(K, [[EX + 2.4, 0, 0], [EX + 4.0, 1.8, 0]], { yaw: 85, pitch: 10, fov: 40, margin: 1.4 });
    } else if (sh(1040, 1097)) {              // 19. iron hoops squeeze the boards tight
      cam = fitT(K, [[EX + 2.4, 0, 0], [EX + 4.0, 1.8, 0]], { yaw: 60, pitch: 24, fov: 40, margin: 1.3 }); cam.fov *= K.punch(f, F.BURST, 0.08, 6);
    } else if (sh(1097, 1150)) {              // 20. fat barrels back: one sailor per barrel (wide)
      cam = fitT(K, [[-6, 0, -0.4], [4, 1.8, 1.6], ...body(-2.6, 1.6)], { yaw: 80, pitch: 12, fov: 44 });
    } else if (sh(1150, 1195)) {              // 21. Gustav proud (medium)
      cam = fitT(K, [...body(-2.6, 1.6), [-1, 0, 1.2], [1.5, 0.9, 0.5]], { yaw: 65, pitch: 8, fov: 42 });
    } else if (sh(1195, 1270)) {              // 22. the other three start a band (wide)
      cam = fitT(K, [...body(0.6, 0.3), ...body(2.6, 0.3), [-0.6, 0, 1.2], [-0.6, 1.6, 1.2]], { yaw: 80, pitch: 8, fov: 42 });
    } else {                                  // 23. Coconut drums the banana barrel, pull back to the pier (loops)
      cam = fitT(K, [[-0.6, 0, 1.2], [-0.6, 1.8, 1.2], ...body(2.6, 0.3), [lerp(-1, -5, u), 0, -1.2]], { yaw: lerp(95, 80, u), pitch: lerp(8, 14, u), fov: 44 });
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    K.steam(f, [-11, 8.6, -9], { rate: 3, size: 0.7, dark: 0.3, rise: 2 });
    if (f >= 660 && f < 720) for (let k = 0; k < 3; k++) K.puff(f, F.SEA + k * 3, 9.9 + k * 0.4, 0.8, 10, 0.7, '#e8f6ff');
    if (f >= 243 && f < 382) K.sparks(f, 243, 382, (g) => [lerp(-1.0, 1.4, clamp((g - 243) / 140, 0, 1)) - 0.4, 0.05, 0.2], { dir: [-1, 0.5, 0], spread: 0.5, rate: f < F.NOON ? 6 : 0, speed: 2, life: 10, color: '#c8a070', seed: 3 });
    K.mist(f, 810, 16); K.mist(f, 1089, 16);
    K.badge(f, F.FOUR, '4 SAILORS PER BARREL', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 112 });
    K.badge(f, F.WHY, 'WHY FAT IN THE MIDDLE?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 241 });
    K.badge(f, F.SHIPS, '300 A DAY', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 380 });
    K.badge(f, F.FORTY, '40 BARRELS LOST', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 781 });
    K.badge(f, F.BELLY, 'TOUCHES AT ONE SPOT', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 979 });
    K.badge(f, F.ARCH, 'ARCH + HOOPS = STRONG', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1095 });
    K.badge(f, F.PER, '1 SAILOR PER BARREL', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.15, f1: 1193 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
