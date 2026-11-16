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
  const root = new THREE.Group(); (opts.parent || K.scene).add(root);
  const stout = o.build === 'stout', kid = o.build === 'kid', sc = kid ? 0.72 : 1;
  root.userData.base = sc;
  const jacket = K.toon({ color: o.jacket || '#4f7fb8', kind: 'fabric', amt: 0.25, bump: 0.002 });
  const limbMat = K.toon({ color: T.mix(o.jacket || '#4f7fb8', T.INK, 0.5), plain: true, roughness: 0.6 });
  const legMat = K.toon({ color: T.mix(o.pants || '#333', T.INK, 0.55), plain: true, roughness: 0.6 });
  const shoeMat = K.toon({ color: o.boots || '#2a2018', plain: true, roughness: 0.45 });
  const handMat = K.toon({ color: T.INK, plain: true, roughness: 0.5 });
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
  const neck = new THREE.Group(); neck.position.y = BH - 0.1; body.add(neck);
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
  const glow = opts.glow ?? 0.22;
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true;
    if (m.material && m.material.emissive && m.material !== skinMat && !m.material.userData.lit) { m.material.emissive.copy(m.material.color).multiplyScalar(glow); m.material.userData.lit = true; } } });
  skinMat.emissive.set('#ffffff'); skinMat.emissiveIntensity = glow * 1.1;

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
      if (mode === 'march' || mode === 'stroll') hy += 0.012 * Math.cos(2 * ph);
      if (mode === 'sit') hy = (pos.seat ?? 0.45) + 0.04;
      if (mode === 'crouch') fwd = 0.25;
      body.position.y = hy; body.rotation.set(fwd, 0, -THREE.MathUtils.degToRad(P.tilt || 0));
      if (mode === 'fall') { body.rotation.x = -1.2; body.position.y = 0.3; }
      // head: eyes lead (face texture), head turns/tilts after
      neck.rotation.set(-0.06 + (mode === 'run' ? -0.15 : 0), (P.look || 0) * 0.5, -THREE.MathUtils.degToRad(P.headTilt || 0) * 0.8);
      { const ft = faceTexture(o, P.expr || 'neutral', (P.look || 0) * 0.5, P.blink, opts.key || 'c'); if (skinMat.map !== ft) { skinMat.map = ft; skinMat.emissiveMap = ft; skinMat.needsUpdate = true; } }
      body.updateMatrixWorld(true);
      const toW = (v) => body.localToWorld(v.clone());
      // arms (targets from the pose library: [x out, y down, hand, front])
      const shoulderL = V(0.0, BH - 0.2, 0), spec = P.arms || { L: [0.16, 0.92, 'open'], R: [0.16, 0.92, 'open'] };
      for (const [k, side] of [['L', -1], ['R', 1]]) {
        const sp = spec[k] || [0.16, 0.92, 'open'], a = arm[k];
        const S = V(side * (R * 0.82), BH - 0.2, 0);
        const near = sp[1] < -0.2 && sp[0] < 0.1;               // hand at the face
        const zf = sp[3] === true ? 0.5 : near ? 0.62 : sp[3] === 'top' ? 0.6 : 0.16 + Math.max(0, -sp[1]) * 0.1;
        const Tg = V(side * (R * 0.82 + sp[0] * HH * 0.9), BH - 0.2 - sp[1] * HH * 0.9, zf * HH);
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
        l.shoe.rotation.set(mode === 'run' || mode === 'march' ? -0.3 * Math.sin(ph + off) : 0, 0, 0);
      }
      return api;
    },
  };
  return api;
}
