// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Shared helpers for the 3D-stick stories: shot lists with whip-pans, word cards, cartoon animal parts for K.stick
// rigs (ears, snouts, tails), small reusable props. Import into a story: import * as X from './kit3d.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, q } from '../motion.js';

let K = null;
export const init = (k) => { K = k; };

// ---------- shots ----------
// shots: [{ id, f, keys: [{f,pos,look,fov,ease?}], whip: true|false (whip-pan INTO this shot), dof: {focus,cinf} | (f,cam)=>dof }]
export const shotList = (shots, TOTAL) => shots.map((s, i) => ({ ...s, a: s.f, b: i + 1 < shots.length ? shots[i + 1].f - 1 : TOTAL - 1, next: shots[i + 1] }));
export const shotAt = (S, f) => S.find((s) => f >= s.a && f <= s.b) || S[S.length - 1];
const rotY = (pos, look, ang) => { const dx = look[0] - pos[0], dz = look[2] - pos[2], c = Math.cos(ang), s = Math.sin(ang); return [pos[0] + dx * c - dz * s, look[1], pos[2] + dx * s + dz * c]; };
export const camAt = (S, f, kicks = []) => {
  const s = shotAt(S, f); const keys = s.keys.map((k, i) => ({ ...k, f: k.f ?? (i === 0 ? s.a : s.b) }));
  const c = camFromKeys(keys, f, { creep: 0.001, kicks });
  // whip-pan: swing out over the last 5 frames, swing in over the first 4 frames of the next shot
  const WO = 5, WI = 4;
  if (s.next && s.next.whip !== false && f > s.b - WO) { const u = (f - (s.b - WO)) / WO; c.look = rotY(c.pos, c.look, -0.75 * u * u); c.roll = (c.roll || 0) - 6 * u; c.whip = u; }
  if (s.whip !== false && s !== S[0] && f < s.a + WI) { const u = 1 - (f - s.a) / WI; c.look = rotY(c.pos, c.look, 0.55 * u * u); c.roll = (c.roll || 0) + 5 * u; c.whip = u; }
  c.shadowAt = c.shadowAt || [c.look[0], 0, c.look[2]];
  return { c, s };
};
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const focusOn = (cam, p, cinf) => ({ focus: dist(cam.pos, p), cinf });

// ---------- 2D overlays in front of the camera (word cards, inserts drawn as cards) ----------
export const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
export const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
export const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 1.4) => {
  if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 });
};

// ---------- textures + signs ----------
export const txtTex = (w, h, bg, fg, lines, font = 'bold 64px Georgia, serif') => PR.canvasTex(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => g.fillText(t, w / 2, h * (i + 1) / (lines.length + 1))); });
export const sign = (w, h, tex, x, y, z, ry = 0, parent = K.scene, kind = 'wood') => {
  const m = K.add(new K.THREE.PlaneGeometry(w, h), K.toon({ map: tex, kind, amt: 0.15, plain: true }), x, y, z, parent, { cast: false }); m.rotation.y = ry; return m; };

// ---------- animal parts for K.stick rigs ----------
// kind: 'baboon' | 'pig' | 'rabbit' | 'bear'. col = fur colour; returns { tail, ears } for animation.
export function critter(rig, kind, col, col2) {
  const { THREE } = K; const head = rig.head, body = rig.body;
  const fur = K.toon({ color: col, kind: 'fabric', amt: 0.35, bump: 0.003 });
  const inner = K.toon({ color: col2 || '#e8a0a0', plain: true, roughness: 0.6 });
  const out = { ears: [], tail: null };
  const ear = (geo, x, y, z, rz, rx = 0, sc = [1, 1, 1], m = fur) => { const e = new THREE.Mesh(geo, m); e.position.set(x, y, z); e.rotation.set(rx, 0, rz); e.scale.set(...sc); e.castShadow = true; head.add(e); out.ears.push(e); return e; };
  const snout = (geo, m, y, z, sc) => { const s = new THREE.Mesh(geo, m); s.position.set(0, y, z); s.scale.set(...sc); s.castShadow = true; head.add(s); return s; };
  if (kind === 'pig') {
    for (const s of [-1, 1]) ear(new THREE.ConeGeometry(0.08, 0.16, 12), s * 0.15, 0.24, 0.02, -s * 0.5, 0.35, [1, 1, 0.45]);
    const sn = snout(new THREE.CylinderGeometry(0.075, 0.08, 0.08, 24).rotateX(Math.PI / 2), K.toon({ color: col2 || '#f08aa0', plain: true }), -0.04, 0.24, [1.1, 0.8, 1]);
    for (const s of [-1, 1]) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), K.toon({ color: '#5a2a30', plain: true })); n.position.set(s * 0.03, 0, 0.042); sn.add(n); }
    const tg = new THREE.TorusGeometry(0.05, 0.014, 6, 16, Math.PI * 1.6); const t = new THREE.Mesh(tg, fur); t.position.set(0, 0.06, -0.21); t.rotation.y = Math.PI / 2; body.add(t); out.tail = t;
  } else if (kind === 'rabbit') {
    for (const s of [-1, 1]) { const e = ear(new THREE.CapsuleGeometry(0.05, 0.3, 6, 12), s * 0.09, 0.38, -0.02, -s * 0.18, -0.1, [1, 1, 0.5]);
      const ie = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.24, 6, 10), inner); ie.position.z = 0.02; ie.scale.z = 0.4; e.add(ie); }
    snout(new THREE.SphereGeometry(0.03, 12, 8), K.toon({ color: '#e87a90', plain: true }), 0.0, 0.235, [1.2, 0.9, 0.8]);
    for (const s of [-1, 1]) { const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.045, 0.01), K.toon({ color: '#fbf6ea', plain: true })); tooth.position.set(s * 0.017, -0.11, 0.215); head.add(tooth); }
    const t = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), K.toon({ color: '#f2ece0', kind: 'fabric', amt: 0.3 })); t.position.set(0, 0.05, -0.2); body.add(t); out.tail = t;
  } else if (kind === 'bear') {
    for (const s of [-1, 1]) { const e = ear(new THREE.SphereGeometry(0.075, 14, 10), s * 0.17, 0.2, -0.02, 0, 0, [1, 1, 0.55]);
      const ie = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), inner); ie.position.z = 0.03; ie.scale.z = 0.5; e.add(ie); }
    const sn = snout(new THREE.SphereGeometry(0.09, 18, 12), K.toon({ color: col2 || '#d8b088', kind: 'fabric', amt: 0.2 }), -0.07, 0.19, [1.15, 0.8, 0.9]);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), K.toon({ color: '#1e1614', plain: true })); nose.position.set(0, 0.03, 0.085); sn.add(nose);
    const t = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), fur); t.position.set(0, 0.03, -0.24); body.add(t); out.tail = t;
  } else if (kind === 'baboon') {
    for (const s of [-1, 1]) ear(new THREE.SphereGeometry(0.06, 12, 8), s * 0.24, 0.02, -0.02, 0, 0, [0.5, 1, 1], inner);
    const sn = snout(new THREE.SphereGeometry(0.1, 18, 12), K.toon({ color: col2 || '#8a5a52', plain: true, roughness: 0.6 }), -0.1, 0.2, [0.75, 0.62, 1.5]);
    for (const s of [-1, 1]) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), K.toon({ color: '#2a1612', plain: true })); n.position.set(s * 0.028, 0.03, 0.095); sn.add(n); }
    const maneM = K.toon({ color: '#5a3e26', kind: 'fabric', amt: 0.5, bump: 0.004 });
    const mane = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.075, 12, 32), maneM); mane.position.set(0, 0.0, 0.0); mane.scale.set(1.05, 1.0, 1.3); head.add(mane);
    const crest = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10), maneM); crest.position.set(0, 0.12, -0.1); crest.scale.set(1.2, 0.8, 1.0); head.add(crest);
    const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new THREE.Vector3(0, -0.05 - 0.25 * Math.sin(t * 2.2), -0.18 - 0.5 * t)); }
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.025, 6), fur); body.add(t); out.tail = t;
  }
  return out;
}
export const wagTail = (cr, f, amt = 0.4) => { if (cr.tail) cr.tail.rotation.z = amt * Math.sin(f * 0.35); };

// ---------- little reusable props ----------
export const rnd = (seed) => { let s = seed; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
export function tree(x, z, s, bark, leaf, parent = K.scene, r = Math.random) {
  const { THREE } = K; const g = K.group(parent); g.position.set(x, 0, z);
  K.cyl(0.12 * s, 0.18 * s, 1.6 * s, bark, 0, 0, 0, g);
  for (let j = 0; j < 4; j++) { const b = K.add(new THREE.DodecahedronGeometry((0.7 + r() * 0.4) * s, 1), leaf, (r() - 0.5) * 1.1 * s, (1.9 + r() * 0.8) * s, (r() - 0.5) * 1.1 * s, g); b.scale.y = 0.8; }
  return g;
}
export function fence(x0, x1, z, h, wood, parent = K.scene) {
  for (let x = x0; x <= x1; x += 1.2) K.slab(x - 0.05, x + 0.05, 0, h, z - 0.05, z + 0.05, wood, parent);
  for (const y of [h * 0.35, h * 0.8]) K.slab(x0, x1, y - 0.05, y + 0.05, z - 0.03, z + 0.03, wood, parent);
}
export { M, clamp, ramp, lerp, q };

// ---------- props in a character's hands (rig hands are the 0.045 m spheres) ----------
const _hands = new WeakMap();
export const hands = (rig) => { if (!_hands.has(rig)) _hands.set(rig, rig.root.children.filter((m) => m.geometry?.parameters?.radius === 0.045)); return _hands.get(rig); };
/** put a mesh/group at a hand (side 0 = L, 1 = R) after rig.set(); rot = [x, y, z] extra euler in the rig's frame */
export const holdAt = (rig, obj, side = 1, rot = [0, 0, 0], off = [0, 0, 0]) => {
  const h = hands(rig)[side]; if (!h) return; rig.root.updateMatrixWorld(true);
  const v = new K.THREE.Vector3(...off); v.applyEuler(new K.THREE.Euler(0, rig.root.rotation.y, 0)); const p = h.getWorldPosition(new K.THREE.Vector3()).add(v);
  obj.position.copy(p); obj.rotation.set(rot[0], rig.root.rotation.y + rot[1], rot[2]); obj.visible = true; };
