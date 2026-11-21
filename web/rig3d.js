// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// 3D stick characters: round head with the cartoon face, bean body, stick arms/legs with real joints (IK),
// shoes, hats and held items. Driven by the same acting timeline as the 2D cards (T.act + T.POSES):
//   const joe = K.stick(JOE, { seed: 9 });                 // in build()
//   joe.set(T.act(f, keys, { seed: 9, blink: blinkAt(f, 9) }), { x, z, yaw });   // in frame()
// Units: metres. Feet on y=0, facing +z (yaw 0 = facing a camera placed at +z). "R" = +x side (screen right
// when facing the camera), matching the 2D poses.
import * as THREE from './lib/three.module.js';
import * as T from './toon.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const HH = 0.46;                       // "head-height" unit used by the pose targets
const LEG = 0.62, THIGH = 0.33, SHIN = 0.31, UPPER = 0.235, FORE = 0.215;
const LIMB_R = 0.03;

// 2-bone IK: shoulder S -> target Tg with lengths a, b and a pole direction for the elbow/knee
function ik2(S, Tg, a, b, pole) {
  const d0 = Tg.clone().sub(S), d = Math.min(Math.max(d0.length(), 0.01), a + b - 0.002), n = d0.normalize();
  const along = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(a * a - along * along, 0));
  const pp = pole.clone().sub(n.clone().multiplyScalar(pole.dot(n))).normalize();
  const E = S.clone().addScaledVector(n, along).addScaledVector(pp, h);
  const H = S.clone().addScaledVector(n, d);
  return [E, H];
}

const faceCache = new Map();
function faceTexture(o, expr, look, blink, key) {
  const k = key + '|' + expr + '|' + Math.round(look * 10) + '|' + Math.round((Number(blink) || 0) * 4);
  if (faceCache.has(k)) return faceCache.get(k);
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d'); g.fillStyle = o.skin || T.SKIN; g.fillRect(0, 0, 1024, 512);
  const p = new T.Pen(g);
  // equirect: front of the head (+z) is u = 0.25; 2.84 px per degree both ways, so the face is undistorted near the centre
  T.drawFace(p, 256, 262, 300, o, expr, look, blink);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (faceCache.size > 400) faceCache.delete(faceCache.keys().next().value);
  faceCache.set(k, t); return t;
}

// ---------- held items (built once per character, shown when in use) ----------
function buildItems(K, hand) {
  const M = (c, o = {}) => K.toon({ color: c, plain: true, roughness: 0.7, ...o });
  const g = {}, add = (name, mesh) => { mesh.visible = false; mesh.traverse((m) => { m.castShadow = true; }); hand.add(mesh); g[name] = mesh; };
  const grp = () => new THREE.Group();
  { const m = grp(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.26), K.mat('wood', '#c69a5c', { detail: 0.6 })); m.add(b); add('box', m); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), M('#c9a35a')); b.scale.set(1, 1.05, 0.95); b.position.y = -0.1; m.add(b);
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.05, 12), M('#a8823a')); n.position.y = 0.0; m.add(n); add('moneybag', m); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.006), M('#fbf6ea')); b.position.set(0, 0.1, 0.02); m.add(b); add('paper', m); add('letter', m.clone()); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.04), M('#b8463a')); b.position.set(0, 0.1, 0.03); m.add(b); add('book', m); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.01), M('#7cc47a')); b.position.set(0, 0.03, 0.02); m.add(b); add('money', m); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.012), M('#2a2d36')); b.position.y = 0.04; m.add(b); add('phone', m); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.1, 18), M('#f2f2f2')); b.position.y = 0.04; m.add(b); add('cup', m); }
  { const m = grp(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), M('#c87a3a')); b.scale.set(1, 1.3, 1); b.position.y = 0.08; m.add(b);
    const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8), M('#f5ecd8')); bone.position.y = -0.0; m.add(bone); add('food', m); }
  { const m = grp(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 8), K.mat('wood', '#8a5a34')); h.position.y = 0.12; m.add(h);
    const hd = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.06), K.mat('metal', '#6b7078')); hd.position.y = 0.32; m.add(hd); add('hammer', m); }
  { const m = grp(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.6, 8), K.mat('wood', '#8a5a34')); h.position.y = 0.2; m.add(h);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.26, 0.02), M('#fbf6ea')); b.position.y = 0.55; m.add(b); add('sign', m); }
  { const m = grp(); const h = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.3, 8), K.mat('wood', '#6a4428')); h.position.y = 0.08; m.add(h);
    const fl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), new THREE.MeshBasicMaterial({ color: '#ffb02e' })); fl.scale.set(1, 1.6, 1); fl.position.y = 0.28; m.add(fl); add('torch', m); }
  return g;
}

// ---------- the character ----------
export function stick(K, o, opts = {}) {
  const jig = [];   // secondary motion: loose parts (ponytail, tie, scarf, pom-pom) swing and settle after the body moves
  const root = new THREE.Group(); (opts.parent || K.scene).add(root);
  const stout = o.build === 'stout', kid = o.build === 'kid', sc = kid ? 0.72 : 1;
  root.userData.base = sc;
  const jacket = opts.style !== 'classic' ? K.toon({ color: o.jacket || '#4f7fb8', plain: true, roughness: 0.75 }) : K.toon({ color: o.jacket || '#4f7fb8', kind: 'fabric', amt: 0.25, bump: 0.002 });
  const STY = opts.style !== 'classic';   // 'ref' style (2026-11-21): dark stick limbs, bigger head, bold outlines, flatter cartoon shading
  const limbMat = K.toon({ color: T.mix(o.jacket || '#4f7fb8', T.INK, STY ? 0.82 : 0.5), plain: true, roughness: 0.6 });
  const legMat = K.toon({ color: T.mix(o.pants || '#333', T.INK, STY ? 0.85 : 0.55), plain: true, roughness: 0.6 });
  const shoeMat = K.toon({ color: o.boots || '#2a2018', plain: true, roughness: 0.45 });
  const handMat = K.toon({ color: o.gloves || T.INK, plain: true, roughness: 0.5 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.62 });
  const body = new THREE.Group(); root.add(body);              // pivot at the hips
  const hipY = LEG;
  body.position.y = hipY;
  // bean torso (lathe of an egg profile)
  const R = stout ? 0.25 : 0.2, BH = 0.6, prof = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24, y = t * BH, r = R * Math.pow(Math.sin(Math.PI * Math.min(0.999, t * 0.98 + 0.01)), 0.62) * (1 + 0.1 * (0.5 - t)); prof.push(new THREE.Vector2(Math.max(0.001, r), y)); }
  const torso = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), jacket); torso.position.y = -0.06; torso.scale.z = 0.86; body.add(torso);
  for (let i = 0; i < 3; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), K.toon({ color: T.shade(o.jacket || '#4f7fb8', 0.55), plain: true })); b.position.set(0, 0.16 + i * 0.11, R * 0.86 * 0.98); body.add(b); }
  // head
  const neck = new THREE.Group(); neck.position.y = BH - 0.1; body.add(neck); if (STY) neck.scale.setScalar(opts.head ?? 1.14);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.245, 48, 32), skinMat); head.position.y = 0.2; head.scale.set(1.0, 0.94, 0.9); neck.add(head);
  // hats
  const hatCol = o.hat === 'cap' ? (o.cap || '#c89a3a') : o.hat === 'hair' ? (o.hair || '#3b2a20') : '#22222a';
  if (o.hat === 'cap' || o.hat === 'hair') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.252, 40, 16, 0, Math.PI * 2, 0, o.hat === 'cap' ? 1.15 : 1.3), K.toon({ color: hatCol, kind: o.hat === 'cap' ? 'fabric' : 'grime', amt: 0.3, bump: 0.002 }));
    cap.position.y = 0.2; cap.scale.copy(head.scale); cap.rotation.x = o.hat === 'cap' ? -0.18 : 0.2; neck.add(cap);
    if (o.hat === 'cap') { const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 32, 1, false, -Math.PI / 2, Math.PI), K.toon({ color: T.shade(hatCol, 0.8), plain: true })); brim.position.set(0, 0.3, 0.14); brim.rotation.x = 0.12; brim.scale.z = 1.1; neck.add(brim); }
  } else if (o.hat === 'tophat') {
    const hm = K.toon({ color: '#1e1e24', plain: true, roughness: 0.5 });
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.34, 32), hm); crown.position.y = 0.55; neck.add(crown);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.025, 32), hm); brim.position.y = 0.39; neck.add(brim);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.162, 0.162, 0.05, 32), K.toon({ color: '#8a2a2a', plain: true })); band.position.y = 0.43; neck.add(band);
  }
  else if (o.hat === 'hardhat' || o.hat === 'helmet') {
    const hm = K.toon({ color: o.hatColor || (o.hat === 'hardhat' ? '#f2c230' : '#5a6a3a'), plain: true, roughness: 0.35 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.265, 40, 16, 0, Math.PI * 2, 0, 1.25), hm); dome.position.y = 0.21; dome.scale.set(1, 0.95, 0.95); neck.add(dome);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.022, 8, 40), hm); rim.rotation.x = Math.PI / 2; rim.position.y = 0.3; rim.scale.set(1.05, 1.15, 1); neck.add(rim);
  } else if (o.hat === 'police' || o.hat === 'pilot' || o.hat === 'chef' || o.hat === 'beanie' || o.hat === 'cowboy' || o.hat === 'crown') {
    const c = o.hatColor || { police: '#1f2a4a', pilot: '#1f2a4a', chef: '#ffffff', beanie: '#c0392b', cowboy: '#8a5a34', crown: '#f2c230' }[o.hat];
    const hm = K.toon({ color: c, plain: true, roughness: o.hat === 'crown' ? 0.25 : 0.7 });
    if (o.hat === 'chef') { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.19, 0.3, 32), hm); t.position.y = 0.5; neck.add(t); const puff = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), hm); puff.scale.set(1, 0.6, 1); puff.position.y = 0.67; neck.add(puff); }
    else if (o.hat === 'beanie') { const b = new THREE.Mesh(new THREE.SphereGeometry(0.258, 40, 16, 0, Math.PI * 2, 0, 1.3), hm); b.position.y = 0.21; b.scale.set(1, 1.05, 0.93); neck.add(b); const pom = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), K.toon({ color: '#f5f0e6', plain: true })); pom.position.y = 0.48; neck.add(pom); jig.push([pom, 'z', 0.25]); }
    else if (o.hat === 'cowboy') { const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.2, 24), hm); cr.position.y = 0.47; neck.add(cr); const br = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.02, 32), hm); br.position.y = 0.37; br.scale.z = 0.85; neck.add(br); }
    else if (o.hat === 'crown') { for (let i = 0; i < 6; i++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 8), hm); const a = i / 6 * Math.PI * 2; sp.position.set(Math.sin(a) * 0.13, 0.5, Math.cos(a) * 0.13); neck.add(sp); } const band = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.07, 24, 1, true), hm); band.position.y = 0.43; neck.add(band); }
    else { const top = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.1, 32), hm); top.position.y = 0.42; top.rotation.x = -0.1; neck.add(top); const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.015, 24, 1, false, -Math.PI / 2, Math.PI), K.toon({ color: '#111', plain: true, roughness: 0.2 })); visor.position.set(0, 0.36, 0.14); neck.add(visor); const badge = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), K.toon({ color: '#f2c230', plain: true })); badge.position.set(0, 0.42, 0.21); badge.scale.z = 0.4; neck.add(badge); }
  }
  // hairstyles (o.hair colour + o.hairStyle: 'short' | 'spiky' | 'long' | 'bun' | 'ponytail' | 'curly'), drawn under hats
  if (o.hairStyle && !['tophat', 'chef'].includes(o.hat)) {
    const hm = K.toon({ color: o.hair || '#3b2a20', kind: 'grime', amt: 0.25, bump: 0.003 });
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.255, 40, 16, 0, Math.PI * 2, 0, 1.2), hm); cap.position.y = 0.2; cap.scale.copy(head.scale); cap.rotation.x = 0.35; neck.add(cap);
    if (o.hairStyle === 'spiky') for (let i = 0; i < 9; i++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 6), hm); const a = (i / 9 - 0.5) * 2.6; sp.position.set(Math.sin(a) * 0.17, 0.42 - Math.abs(a) * 0.03, Math.cos(a) * 0.05 - 0.04); sp.rotation.z = -a * 0.45; neck.add(sp); }
    if (o.hairStyle === 'curly') for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), hm); const a = i / 14 * Math.PI * 2; b.position.set(Math.sin(a) * 0.2, 0.36 + 0.05 * Math.cos(a * 3), Math.cos(a) * 0.17 - 0.05); neck.add(b); }
    if (o.hairStyle === 'long') { const back = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.22, 6, 20), hm); back.position.set(0, 0.08, -0.12); back.scale.set(1.15, 1, 0.55); neck.add(back); }
    if (o.hairStyle === 'bun') { const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), hm); b.position.set(0, 0.43, -0.08); neck.add(b); }
    if (o.hairStyle === 'ponytail') { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.22, 4, 12), hm); b.position.set(0, 0.16, -0.27); b.rotation.x = 0.4; neck.add(b); jig.push([b, 'x', 0.35]); }
  }
  if (o.glasses) { const gm = K.toon({ color: o.glasses === true ? '#1a1a1a' : o.glasses, plain: true, roughness: 0.3 });
    for (const sx of [-1, 1]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.009, 8, 24), gm); ring.position.set(sx * 0.065, 0.225, 0.215); neck.add(ring); }
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.03, 6), gm); br.rotation.z = Math.PI / 2; br.position.set(0, 0.23, 0.225); neck.add(br); }
  // sweat drops (expr 'nervous'/'scared' or sweat: true): they bead on the temples and slide down, so worry reads from far away
  const sweatMat = new THREE.MeshStandardMaterial({ color: '#bfe6ff', emissive: '#7fc8ff', emissiveIntensity: 0.35, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.92 });
  const sweat = [[-1, 0.0], [1, 0.45], [1, 0.8]].map(([sx, d]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 10), sweatMat); m.scale.set(0.8, 1.35, 0.8); m.userData.sx = sx; m.userData.d = d; m.visible = false; neck.add(m); return m; });
  for (const j of jig) j[3] = j[0].rotation[j[1]];
  // clothing details on the torso: collar, tie/bowtie, buttons, belt, pockets, vest, apron, dress, scarf, badge
  const det = (c) => K.toon({ color: c, plain: true, roughness: 0.6 });
  const bodyZ = (y) => { const t = (y + 0.06) / BH; return R * 0.86 * Math.pow(Math.sin(Math.PI * Math.min(0.999, t * 0.98 + 0.01)), 0.62) * (1 + 0.1 * (0.5 - t)); };
  if (o.collar !== false) { const cm = det(o.collar || '#f5f2ea'); for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.09, 3), cm); c.position.set(sx * 0.05, BH - 0.17, bodyZ(BH - 0.17) * 0.88); c.rotation.set(0.3, 0, sx * 2.5); c.scale.z = 0.35; body.add(c); } }
  if (o.tie) { const tm = det(o.tie); const knot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), tm); knot.position.set(0, BH - 0.2, bodyZ(BH - 0.2) * 0.93); body.add(knot);
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 4), tm); blade.rotation.set(Math.PI, Math.PI / 4, 0); blade.scale.z = 0.3; blade.position.set(0, BH - 0.34, bodyZ(BH - 0.34) * 0.99); body.add(blade); jig.push([blade, 'z', 0.12]); }
  if (o.bowtie) { const tm = det(o.bowtie); for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.07, 4), tm); w.rotation.z = sx * Math.PI / 2; w.position.set(sx * 0.035, BH - 0.19, bodyZ(BH - 0.19) * 0.95); w.scale.z = 0.4; body.add(w); } }
  if (o.belt) { const bm = det(o.belt), yb = 0.08; const belt = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 40), bm); belt.rotation.x = Math.PI / 2; belt.position.y = yb; belt.scale.set(bodyZ(yb) / 0.86 * 1.01, bodyZ(yb) * 1.01, 0.35); body.add(belt);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.045, 0.01), det('#d8b44a')); buckle.position.set(0, yb, bodyZ(yb) * 1.02); body.add(buckle); }
  if (o.pockets) for (const sx of [-1, 1]) { const pk = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.01), det(T.shade(o.jacket || '#4f7fb8', 0.75))); pk.position.set(sx * 0.09, 0.22, bodyZ(0.22) * 0.99); pk.rotation.y = sx * 0.4; body.add(pk); }
  if (o.vest || o.apron || o.dress) {
    const panel = (col, y0, y1, wf, z0 = 0.004) => { const prof2 = []; for (let i = 0; i <= 16; i++) { const y = y0 + (y1 - y0) * i / 16; prof2.push(new THREE.Vector2(bodyZ(y) / 0.86 + z0, y + 0.06)); }
      const m = new THREE.Mesh(new THREE.LatheGeometry(prof2, 30, -wf / 2 + Math.PI / 2 - Math.PI / 2, wf), det(col)); m.position.y = -0.06; m.scale.z = 0.865; body.add(m); return m; };
    if (o.vest) { for (const sx of [-1, 1]) { const v = panel(o.vest, 0.05, BH - 0.2, 1.1); v.rotation.y = sx * 0.75; } }
    if (o.apron) panel(o.apron, -0.02, BH - 0.22, 1.5);
    if (o.dress) { const sk = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.6, 0.32, 32, 1, true), det(o.dress)); sk.position.y = -0.1; body.add(sk); }
  }
  if (o.scarf) { const sm = det(o.scarf); const sc2 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.045, 10, 30), sm); sc2.rotation.x = Math.PI / 2; sc2.position.y = BH - 0.14; body.add(sc2); const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.03), sm); tail2.position.set(0.07, BH - 0.27, bodyZ(BH - 0.27) * 0.98); tail2.rotation.z = 0.15; body.add(tail2); jig.push([tail2, 'z', 0.25]); }
  if (o.badge) { const bd = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 5), det(o.badge === true ? '#f2c230' : o.badge)); bd.rotation.x = Math.PI / 2; bd.position.set(-0.1, BH - 0.3, bodyZ(BH - 0.3) * 0.98); body.add(bd); }
  // limbs
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
  const seg = (mat, r) => { const m = new THREE.Mesh(unitCyl, mat); m.userData.r = r; root.add(m); return m; };
  const ball = (mat, r) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat); root.add(m); return m; };
  const place = (m, a, b) => { const d = b.clone().sub(a), L = d.length(); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); m.scale.set(m.userData.r, L, m.userData.r); };
  const arm = { L: { up: seg(limbMat, LIMB_R), lo: seg(limbMat, LIMB_R), el: ball(limbMat, LIMB_R), hand: ball(handMat, 0.045), finger: seg(handMat, 0.014) },
    R: { up: seg(limbMat, LIMB_R), lo: seg(limbMat, LIMB_R), el: ball(limbMat, LIMB_R), hand: ball(handMat, 0.045), finger: seg(handMat, 0.014) } };
  const leg = { L: { up: seg(legMat, LIMB_R * 1.1), lo: seg(legMat, LIMB_R * 1.1), kn: ball(legMat, LIMB_R * 1.1), shoe: ball(shoeMat, 0.06) },
    R: { up: seg(legMat, LIMB_R * 1.1), lo: seg(legMat, LIMB_R * 1.1), kn: ball(legMat, LIMB_R * 1.1), shoe: ball(shoeMat, 0.06) } };
  for (const s of ['L', 'R']) leg[s].shoe.scale.set(0.95, 0.7, 1.75);
  const itemHolder = new THREE.Group(); root.add(itemHolder);
  const items = buildItems(K, itemHolder);
  // cartoon readability: a little self-light so characters never sink into dark sets (opts.glow, default 0.22)
  const glow = opts.glow ?? (STY ? 0.3 : 0.22);
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true;
    if (m.material && m.material.emissive && m.material !== skinMat && !m.material.userData.lit) { m.material.emissive.copy(m.material.color).multiplyScalar(glow); m.material.userData.lit = true; } } });
  skinMat.emissive.set('#ffffff'); skinMat.emissiveIntensity = glow * 1.1;
  // rim light: a soft glowing edge so characters pop off the background (opts.rim colour/strength)
  const rimCol = new THREE.Color(opts.rimColor || '#fff1d6'), rimK = opts.rim ?? (STY ? 0.12 : 0.55);
  root.traverse((m) => { if (!m.isMesh || !m.material || m.material.userData.rim) return; const mt = m.material; mt.userData.rim = true;
    const prev = mt.onBeforeCompile; const pk = mt.customProgramCacheKey ? mt.customProgramCacheKey.bind(mt) : null;
    mt.onBeforeCompile = function (sh, r) { if (prev) prev.call(this, sh, r); sh.uniforms.uRimC = { value: rimCol }; sh.uniforms.uRimK = { value: rimK };
      sh.fragmentShader = sh.fragmentShader.replace('void main() {', 'uniform vec3 uRimC; uniform float uRimK;\nvoid main() {')
        .replace('#include <opaque_fragment>', '{ float fr = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 3.0); outgoingLight += uRimC * fr * uRimK; }\n#include <opaque_fragment>'); };
    mt.customProgramCacheKey = () => 'rim' + (pk ? pk() : '') + (prev ? 'p' : ''); mt.needsUpdate = true; });

  // bold cartoon outline (inverted hull, constant thickness on screen) on every solid part of the character
  if (STY && opts.outline !== false) {
    const om = new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { c: { value: new THREE.Color(opts.outlineColor || '#16110e') }, w: { value: opts.outlineW ?? 0.0016 } },
      vertexShader: 'uniform float w; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vec3 n = normalize(normalMatrix * normal); mv.xyz += n * w * max(-mv.z, .5); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 c; void main(){ gl_FragColor = vec4(c, 1.); }' });
    const list = []; root.traverse((m) => { if (m.isMesh && !m.userData.outline && m.material && !m.material.transparent && !sweat.includes(m)) list.push(m); });
    for (const m of list) { const ol = new THREE.Mesh(m.geometry, om); ol.userData.outline = true; ol.userData.ndSkip = true; ol.castShadow = false; ol.receiveShadow = false; ol.renderOrder = -1; m.add(ol); }
  }
  const w = new THREE.Vector3();
  const api = {
    root, head, body,
    /** A = T.act(...) result; pos = { x, y, z, yaw (radians; 0 faces +z), seat (sit height) } */
    set(A, pos = {}) {
      const P = A.opts, mode = P.mode || 'stand', ph = (P.phase || 0) * Math.PI * 2;
      root.visible = pos.visible !== false;
      root.position.set(pos.x || 0, (pos.y || 0) + (A.dy || 0), pos.z || 0); root.rotation.set(0, pos.yaw || 0, 0);
      const s0 = root.userData.base; root.scale.set(s0 * (A.sx || 1), s0 * (A.sy || 1), s0 * (A.sx || 1));
      // body: height, lean (tilt = sideways like 2D; run/crouch lean forward), bob
      let hy = hipY - 0.02, fwd = 0;
      if (mode === 'crouch') hy -= 0.2;
      if (mode === 'jump') hy -= 0.06;
      if (mode === 'run') { hy -= 0.04 - 0.035 * Math.abs(Math.sin(ph)); fwd = 0.2; }
      const t = P.t ?? 0;
      // walk: body dips on each contact (feet apart) and rises on the passing pose; leans into the walk; weight shifts over the planted foot
      let sway = 0;
      if (mode === 'march' || mode === 'stroll') { hy += (mode === 'march' ? 0.04 : 0.028) * (0.5 - Math.abs(Math.sin(ph))); fwd = mode === 'march' ? 0.07 : 0.045; sway = 0.022 * Math.cos(ph); }
      if (mode === 'run') sway = 0.03 * Math.cos(ph);
      if (mode === 'stand' || mode === 'crouch') hy += 0.006 * Math.sin(t * 2.3);   // breathing, so nobody is ever frozen
      if (mode === 'sit') hy = (pos.seat ?? 0.45) + 0.04;
      if (mode === 'crouch') fwd = 0.25;
      body.position.y = hy; body.position.x = sway; body.rotation.set(fwd, 0, -THREE.MathUtils.degToRad(P.tilt || 0) - sway * 1.2);
      if (mode === 'fall') { body.rotation.x = -1.2; body.position.y = 0.3; }
      // head: eyes lead (face texture), head turns/tilts after
      const wk = mode === 'march' || mode === 'stroll' || mode === 'run';
      neck.rotation.set(-0.06 + (mode === 'run' ? -0.15 : 0) - (wk ? fwd * 0.6 : 0) + (wk ? 0.045 * Math.sin(2 * ph - 0.9) : 0.012 * Math.sin(t * 2.3 - 0.8)), (P.look || 0) * 0.5 - (wk ? 0.07 * Math.sin(ph) * (mode === 'run' ? 1.6 : 1) : 0), -THREE.MathUtils.degToRad(P.headTilt || 0) * 0.8);
      { const ft = faceTexture(o, P.expr || 'neutral', (P.look || 0) * 0.5, P.blink, opts.key || 'c'); if (skinMat.map !== ft) { skinMat.map = ft; skinMat.emissiveMap = ft; skinMat.needsUpdate = true; } }
      body.updateMatrixWorld(true);
      const toW = (v) => body.localToWorld(v.clone());
      // arms (targets from the pose library: [x out, y down, hand, front])
      let spec = P.arms || { L: [0.16, 0.92, 'open'], R: [0.16, 0.92, 'open'] };
      const walking = mode === 'march' || mode === 'stroll' || mode === 'run';
      // walking/running: arms swing forward/back against the legs unless the pose holds something
      const swing = walking ? (mode === 'run' ? 0.55 : mode === 'march' ? 0.4 : 0.25) : 0;
      if (walking) { body.rotation.y = 0.08 * Math.sin(ph) * (mode === 'run' ? 1.6 : 1); body.updateMatrixWorld(true); }
      for (const [k, side] of [['L', -1], ['R', 1]]) {
        const sp = spec[k] || [0.16, 0.92, 'open'], a = arm[k];
        const S = V(side * (R * 0.82), BH - 0.2, 0);
        const near = sp[1] < -0.2 && sp[0] < 0.1;               // hand at the face
        const zf = sp[3] === true ? 0.5 : near ? 0.62 : sp[3] === 'top' ? 0.6 : 0.16 + Math.max(0, -sp[1]) * 0.1;
        const holding = sp[2] && !['open', 'fist', 'point'].includes(sp[2]);
        let Tg = V(side * (R * 0.82 + sp[0] * HH * 0.9), BH - 0.2 - sp[1] * HH * 0.9, zf * HH);
        if (swing && !holding && !P.item) { const c = Math.sin(ph - 0.35 + (side < 0 ? Math.PI : 0)); // opposite to the same-side leg, lagging a touch (follow-through)
          Tg = mode === 'run' ? V(side * (R * 0.9 + 0.04), BH - 0.38 + 0.12 * Math.max(0, c), 0.3 * c + 0.05) : V(side * (R * 0.85 + 0.03), BH - 0.2 - 0.4 + 0.04 * Math.abs(c), swing * 0.45 * c); }
        if (Tg.x * side < 0.04) Tg.z = Math.max(Tg.z, R * 0.9 + 0.06);  // never through the body
        const [E, Hn] = ik2(S, Tg, UPPER, FORE, V(side, -0.7, -0.6));
        const Sw = toW(S), Ew = toW(E), Hw = toW(Hn);
        root.worldToLocal(Sw); root.worldToLocal(Ew); root.worldToLocal(Hw);
        place(a.up, Sw, Ew); place(a.lo, Ew, Hw); a.el.position.copy(Ew); a.hand.position.copy(Hw);
        const hand = sp[2] || 'open';
        a.hand.scale.setScalar(hand === 'fist' ? 1.15 : 1);
        a.finger.visible = hand === 'point';
        if (hand === 'point') { const dir = Hw.clone().sub(Ew).normalize(); place(a.finger, Hw, Hw.clone().addScaledVector(dir, 0.07)); }
        a.hw = Hw; a.ew = Ew;
      }
      // items: a named item in a hand, or P.item between both hands
      for (const n in items) items[n].visible = false;
      const it = P.item || (items[spec.R?.[2]] ? spec.R[2] : null) || (items[spec.L?.[2]] ? spec.L[2] : null);
      if (it && items[it]) {
        const both = !!P.item, hp = both ? arm.L.hw.clone().add(arm.R.hw).multiplyScalar(0.5) : (items[spec.R?.[2]] ? arm.R.hw : arm.L.hw);
        itemHolder.position.copy(hp); itemHolder.rotation.set(0, 0, 0);
        if (!both) { const a = items[spec.R?.[2]] ? arm.R : arm.L; const d = a.hw.clone().sub(a.ew).normalize(); itemHolder.quaternion.setFromUnitVectors(UP, d.y < -0.3 ? d.clone().negate() : V(d.x * 0.3, 1, d.z * 0.3).normalize()); }
        items[it].visible = true;
      }
      // legs
      for (const [k, side, off] of [['L', -1, 0], ['R', 1, Math.PI]]) {
        const l = leg[k], hipW = toW(V(side * 0.09, 0.02, 0)); root.worldToLocal(hipW);
        let F = V(side * 0.1, 0.06, 0.03), pole = V(side * 0.05, 0, 1);
        if (mode === 'march' || mode === 'stroll' || mode === 'run') {
          const st = mode === 'run' ? 0.34 : mode === 'march' ? 0.24 : 0.16, lift = mode === 'run' ? 0.24 : 0.09, c = Math.sin(ph + off);
          F = V(side * 0.1, 0.06 + Math.max(0, Math.cos(ph + off)) * lift, st * c + (mode === 'run' ? 0.08 : 0));
        } else if (mode === 'crouch') F = V(side * 0.2, 0.06, 0.06);
        else if (mode === 'jump') { F = V(side * 0.14, 0.2, -0.02); pole = V(side * 0.4, 0, 1); }
        else if (mode === 'sit') F = V(side * 0.12, 0.06, 0.36);
        else if (mode === 'fall') F = V(side * 0.2, 0.25, 0.5);
        const [Kn, Ft] = ik2(hipW, F, THIGH, SHIN, pole);
        place(l.up, hipW, Kn); place(l.lo, Kn, Ft); l.kn.position.copy(Kn); l.shoe.position.copy(Ft).add(V(0, -0.015, 0.05));
        l.shoe.rotation.set(walking ? -0.35 * Math.cos(ph + off) : 0, 0, 0);   // heel-toe roll
      }
      // sweat: shown for nervous/scared faces (or sweat: true); each drop slides down the temple and restarts
      const sw = P.sweat ?? (P.expr === 'nervous' || P.expr === 'scared');
      for (const m of sweat) { m.visible = !!sw; if (!sw) continue; const u = (t * 0.7 + m.userData.d) % 1;
        m.position.set(m.userData.sx * (0.215 - 0.02 * u), 0.33 - 0.2 * u, 0.1 + 0.03 * u); m.scale.set(0.8, 1.2 + 0.5 * u, 0.8).multiplyScalar(Math.min(1, u * 6) * (1 - Math.max(0, u - 0.85) * 6)); }
      // loose parts swing behind the motion and settle
      const bounce = (1 - (A.sy || 1)) * 4 + (A.dy || 0) * 0.8;
      for (const [m, ax, amp, b0] of jig) m.rotation[ax] = b0 + amp * ((walking ? 0.7 * Math.sin(2 * ph - 1.4) : 0) + 0.25 * Math.sin(t * 2.6 + amp * 9) + bounce);
      return api;
    },
  };
  return api;
}
