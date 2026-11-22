// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Every Big Ship Has a Ball on Its Nose" — invented fable (SCRIPTS.md §00): Captain Pim's bulbous bow vs Captain Brag's sleek bow.
// Harbor -> open sea race in three legs (buoys + HUD) -> Brag's bow wave grows, fuel runs out -> x-ray: the bulb's dip cancels the hump.
import { TOTAL, LINES, wf } from './ballnose_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
let RAFT, THREE, PIM, BRAG, CAT, WADER, EXTRAS = [], SHIPP, SHIPB, WATER, WBASE, NEEDLE, HOLO, TRH, TRD, TRF, ROPE, CNOSE, CNOSE2, CRANE, HOOKC, GULLS = [];
let F = {};
const ZP = 0, ZB = -7.5, BEACH = -160;
// ships move along +x; positions are pure functions of the frame
const xP = (f) => f < 330 ? 0 : f < 1130 ? 0.085 * (f - 330) : 68 + 2.2 * sm(1130, 1185, f);
const XB = []; { let x = -2; for (let g = 0; g < 1500; g++) { XB.push(x); const sm0 = (a, b, q) => { const t = Math.min(1, Math.max(0, (q - a) / (b - a))); return t * t * (3 - 2 * t); }; x += 0.16 * sm0(330, 372, g) * (1 - sm0(700, 772, g)); } }
const xB = (f) => { const i = Math.max(0, Math.min(1498, Math.floor(f))), r = f - i; return XB[i] * (1 - r) + XB[i + 1] * r; };
const heave = (f, s) => [0.06 * Math.sin(f * 0.07 + s), 0.012 * Math.sin(f * 0.05 + s * 2)];
// Brag's bow-wave height (grows through the legs), Pim's stays flat
let BW = () => 0;

function ship(K, o) {
  const g = new THREE.Group(); K.scene.add(g);
  const hullT = K.paint(o.top, { rough: 0.3 }), hullB = K.paint(o.bottom, { rough: 0.35 }), gold = K.gold(), white = K.paint('#f4f2ee', { rough: 0.32 }), dark = K.paint('#24262c', { rough: 0.4 }), chrome = K.chrome();
  const L = o.len, W = o.w;
  K.rbox(L, 1.2, W, 0.28, hullB, 0, -0.75, 0, g);                 // lower hull (below waterline)
  K.rbox(L, 1.05, W, 0.28, hullT, 0, 0.32, 0, g);                  // upper hull
  K.rbox(L + 0.02, 0.1, W + 0.02, 0.04, K.paint('#1a1a1a'), 0, -0.12, 0, g);   // boot stripe
  K.rbox(L + 0.04, 0.08, W + 0.04, 0.03, gold, 0, 0.78, 0, g);     // gold sheer stripe
  K.rbox(L - 0.3, 0.06, W - 0.2, 0.02, K.mat('wood', '#b08050', { detail: 0.4 }), 0, 0.86, 0, g);   // deck
  // bow: blunt (Pim) or knife-sharp (Brag)
  const bowLen = o.sharp ? 2.6 : 1.2, sh = new THREE.Shape(); sh.moveTo(0, -W / 2); sh.lineTo(bowLen, 0); sh.lineTo(0, W / 2); sh.closePath();
  for (const [y0, h, m] of [[-1.35, 1.2, hullB], [-0.15, 1.0, hullT]]) { const geo = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 }); geo.rotateX(-Math.PI / 2);
    const m2 = new THREE.Mesh(geo, m); m2.position.set(L / 2 - 0.25, y0, 0); m2.castShadow = m2.receiveShadow = true; g.add(m2); }
  // name on the bow (both sides)
  for (const s of [1, -1]) { const n = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), K.set.textMat(o.name, { bg: o.top, fg: '#f4ead2', border: false, w: 512, h: 128 })); n.position.set(L / 2 - 1.6, 0.35, s * (W / 2 + 0.02)); n.rotation.y = s > 0 ? 0 : Math.PI; g.add(n); }
  // portholes with chrome rings
  for (let i = 0; i < 7; i++) for (const s of [1, -1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 8, 20), chrome); r.position.set(-L / 2 + 1.2 + i * 1.05, 0.38, s * (W / 2 + 0.02)); g.add(r);
    const gl = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), K.paint('#2c3e52', { rough: 0.05, metal: 0.4 })); gl.position.copy(r.position); gl.position.z += s * 0.005; if (s < 0) gl.rotation.y = Math.PI; g.add(gl); }
  // anchor + hawse ring
  for (const s of [1, -1]) { const a = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 8, 20), dark); a.position.set(L / 2 - 0.6, 0.5, s * (W / 2 + 0.03)); g.add(a); }
  // railings along the deck
  for (let i = 0; i <= 14; i++) for (const s of [1, -1]) K.rbox(0.04, 0.5, 0.04, 0.01, white, -L / 2 + 0.3 + i * (L - 0.6) / 14, 1.12, s * (W / 2 - 0.08), g);
  for (const s of [1, -1]) K.rbox(L - 0.5, 0.05, 0.06, 0.02, white, 0, 1.38, s * (W / 2 - 0.08), g);
  // superstructure at the stern + bridge with wings
  const sx = -L / 2 + 2.0;
  K.rbox(2.6, 2.0, W - 0.4, 0.12, white, sx, 1.85, 0, g);
  for (let i = 0; i < 3; i++) for (const s of [1, -1]) K.rbox(0.5, 0.4, 0.04, 0.05, K.paint('#2c3e52', { rough: 0.06, metal: 0.4 }), sx - 0.8 + i * 0.8, 2.15, s * (W / 2 - 0.19), g);
  K.rbox(3.0, 0.1, W + 1.2, 0.04, white, sx, 2.9, 0, g);           // wing deck
  K.rbox(2.0, 1.2, W - 0.6, 0.12, white, sx - 0.2, 3.5, 0, g);     // wheelhouse
  K.rbox(0.06, 0.55, W - 0.7, 0.02, K.paint('#2c3e52', { rough: 0.05, metal: 0.4 }), sx + 0.82, 3.65, 0, g);   // front windows
  K.rbox(2.2, 0.08, W - 0.4, 0.03, gold, sx - 0.2, 4.12, 0, g);
  for (const s of [1, -1]) { for (let i = 0; i <= 6; i++) K.rbox(0.035, 0.6, 0.035, 0.01, white, sx - 1.4 + i * 0.47, 3.25, s * (W / 2 + 0.55), g); K.rbox(2.9, 0.05, 0.05, 0.02, gold, sx, 3.55, s * (W / 2 + 0.55), g); }
  // funnel with stripes
  const fun = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 1.8, 28), K.paint(o.funnel, { rough: 0.3 })); fun.position.set(sx - 1.0, 4.2, 0); fun.rotation.z = o.sharp ? 0.18 : 0; fun.castShadow = true; g.add(fun);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.445, 0.455, 0.3, 28), o.sharp ? gold : white); band.position.set(sx - 1.0 + (o.sharp ? -0.08 : 0), 4.45, 0); band.rotation.z = fun.rotation.z; g.add(band);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.42, 0.12, 28), dark); top.position.set(sx - 1.0 + (o.sharp ? -0.16 : 0), 5.08, 0); top.rotation.z = fun.rotation.z; g.add(top);
  // mast with lamps + flag
  K.cyl(0.05, 0.06, 3.0, white, L / 2 - 2.6, 0.9, 0, g, 10); K.rbox(0.9, 0.05, 0.05, 0.02, white, L / 2 - 2.6, 3.2, 0, g);
  for (const [lz, c] of [[0.42, '#3aff6a'], [-0.42, '#ff3a3a']]) { const lmp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(1.8) })); lmp.position.set(L / 2 - 2.6, 3.28, lz); g.add(lmp); }
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), K.set.textMat(o.flag, { bg: o.funnel, fg: '#ffffff', w: 192, h: 128, border: false })); flag.position.set(L / 2 - 2.6 - 0.32, 3.7, 0.0); flag.material.side = THREE.DoubleSide; g.add(flag);
  // cargo crates stacked mid-deck, with labels
  const cc = ['#e8a830', '#c0392b', '#2a8a5a', '#2a62c8', '#e8e0d0'];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < (o.sharp ? 1 : 2); k++) { const cx = -0.2 + i * 1.0 - (o.sharp ? 0.4 : 0), cz = (j - 0.5) * (W * 0.42), cy = 1.25 + k * 0.72;
    K.rbox(0.92, 0.68, W * 0.4, 0.05, K.paint(cc[(i + j * 2 + k) % 5], { rough: 0.45 }), cx, cy, cz, g);
    if (j === 1) { const lb = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), K.set.textMat('VELLA', { bg: '#f4ead2', fg: '#1a1a1a', w: 256, h: 112 })); lb.position.set(cx, cy, cz + W * 0.2 + 0.01); g.add(lb); } }
  // lifebuoys + lifeboat
  for (const s of [1, -1]) { const lb = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 10, 24), K.paint('#f24a2a', { rough: 0.4 })); lb.position.set(sx + 0.9, 1.9, s * (W / 2 - 0.15)); g.add(lb);
    for (let q = 0; q < 4; q++) { const w2 = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.072, 10, 6, 0.3), white); w2.position.copy(lb.position); w2.rotation.z = q * Math.PI / 2; g.add(w2); } }
  K.rbox(1.6, 0.4, 0.5, 0.15, K.paint('#f28a2a', { rough: 0.35 }), sx - 0.4, 2.55, -(W / 2 + 0.2), g);
  return { g, sx, L, W };
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { WELD: wf(0, 'welded'), BALL: wf(0, 'ball'), CRATES: wf(1, 'crates'), VELLA: wf(1, 'vella'), DOUBLE: wf(1, 'double'), LAUGH: wf(2, 'laughed'), CLOWN: wf(2, 'clown'),
      SHOT: wf(3, 'shot'), LEGS: wf(4, 'legs'), MILE: wf(4, 'mile'), FULL: wf(5, 'full'), HUGE: wf(5, 'huge'), PUSHED: wf(6, 'pushed'), NEEDLE: wf(6, 'needle'), GREW: wf(6, 'grew'),
      COUGH: wf(7, 'coughed'), DRIFT: wf(7, 'drifted'), WAIST: wf(8, 'waist'), PUSHING: wf(8, 'pushing'), OWN: wf(9, 'own'), DIP: wf(9, 'dip'), HUMP: wf(9, 'hump'),
      MEETS: wf(10, 'meets'), FLAT: wf(10, 'flat'), FIFTEEN: wf(10, 'fifteen'), WAVED: wf(11, 'waved'), TOW: wf(11, 'tow'), ROPE: wf(12, 'rope'), CAT: wf(12, 'cat'), NOSE: wf(12, 'nose') };
    BW = (f) => f < 330 ? 0 : f < F.FULL ? 0.35 * sm(330, 420, f) : f < F.PUSHED ? 0.35 + 0.55 * sm(F.FULL, F.HUGE + 10, f) : f < 705 ? 0.9 + 0.7 * sm(F.PUSHED, F.GREW + 6, f) : 1.6 * (1 - sm(F.COUGH, F.DRIFT + 20, f));
    // ---------- water (CPU waves on a grid that follows the camera) ----------
    const WGeo = new THREE.PlaneGeometry(140, 110, 210, 165); WGeo.rotateX(-Math.PI / 2); WBASE = Float32Array.from(WGeo.attributes.position.array);
    WATER = new THREE.Mesh(WGeo, K.paint('#1a6e9c', { rough: 0.28, coat: 0.4, coatRough: 0.2, env: 0.4, metal: 0.0 })); WATER.material.transparent = true; WATER.material.opacity = 0.9; WATER.receiveShadow = true; WATER.renderOrder = 2; sc.add(WATER);
    const seabed = K.slab(-600, 600, -9, -8.9, -600, 600, K.mat('rock', '#2a6a7a'), sc, false);
    // ---------- harbor (around x = -14..14, quay along z = +6) ----------
    const H = K.group(); const stone = K.mat('rock', '#9a8f84', { detail: 0.8 }), plank = K.mat('wood', '#9a7048', { detail: 0.5 });
    K.slab(-40, 14, -2, 0.9, 6, 30, stone, H);                 // quay
    for (let x = -38; x < 14; x += 1.6) K.rbox(1.5, 0.1, 0.35, 0.02, plank, x, 0.95, 6.3, H);
    for (let x = -36; x < 14; x += 4) { K.cyl(0.18, 0.22, 0.45, K.paint('#2a2a30'), x, 0.9, 6.6, H, 16); K.cyl(0.26, 0.26, 0.08, K.paint('#2a2a30'), x, 1.35, 6.6, H, 16); }
    for (const x of [-30, -20, -10, 0, 10]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 10, 20), K.paint('#2a2a30')); t.position.set(x + 1.2, 0.5, 6.05); H.add(t); }
    // breakwater + lighthouse (x = 18..30, z = -2)
    K.slab(16, 40, -2, 0.6, 7, 9.5, stone, H);
    const LH = new THREE.Group(); LH.position.set(24, 0.6, 8.2); H.add(LH);
    for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.75 - i * 0.07, 0.8 - i * 0.07, 1.2, 24), K.paint(i % 2 ? '#f4f2ee' : '#d8302a', { rough: 0.35 })); c.position.y = 0.6 + i * 1.2; c.castShadow = true; LH.add(c); }
    const lan = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16), K.glass({ color: '#fff4c8', opacity: 0.5 })); lan.position.y = 6.4; LH.add(lan);
    const lb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2b0').multiplyScalar(2.2) })); lb.position.y = 6.4; LH.add(lb);
    const lr = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.6, 16), K.paint('#d8302a')); lr.position.y = 7.1; LH.add(lr);
    // waterfront buildings with shop signs
    const shops = ['FISH', 'CAFE', null, 'ROPES & NETS', null, 'HARBOR MASTER', 'BAKERY', null];
    let x = -40, i = 0;
    while (x < 12) { const w = 4.6 + (i * 5 % 3); const b = S.building({ w, d: 6, floors: 2 + (i % 2), seed: i + 11, color: ['#e8c46a', '#5a8ac8', '#c8573a', '#f2e2c0', '#7ab06a', '#e89a5a'][i % 6], kind: i % 3 ? 'plaster' : 'brick', gable: i % 2 ? 'step' : 'pitched', shop: shops[i % shops.length], shutters: i % 2 ? '#2a5a3a' : null, flowers: i % 2 === 0 });
      b.position.set(x + w / 2, 0.9, 17); b.rotation.y = Math.PI; x += w + 0.1; i++; }
    // crates, barrels, nets, lamps, benches on the quay
    const cc = ['#c0392b', '#2a8a5a', '#e8a830', '#2a62c8'];
    for (let k = 0; k < 14; k++) K.rbox(0.8, 0.7, 0.8, 0.05, K.mat('wood', ['#c69a5c', '#a8703a'][k % 2], { detail: 0.6 }), -24 + (k % 7) * 0.85, 1.25 + (k > 6 ? 0.7 : 0), 9.0 + (k % 2) * 0.1, H);
    for (let k = 0; k < 8; k++) { const br = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.8, 18), K.paint(cc[k % 4], { rough: 0.45 })); br.position.set(-6 + (k % 4) * 0.7, 1.3, 9.2 + (k > 3 ? 0.7 : 0)); br.castShadow = true; H.add(br); }
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.1), S.textMat('PORT DUNMORE', { bg: '#1f3a6a', fg: '#f2c230', w: 768, h: 256 })); sign.position.set(-14, 4.2, 11.9); H.add(sign);
    S.bake(H);
    const brd = S.board('RACE TO PORT VELLA|FIRST SHIP: PAID x2', 3.2, 1.6, { frame: '#c0392b' }); brd.position.set(4.5, 0.9, 8.6); brd.rotation.y = Math.PI - 0.25;
    for (const lx of [-26, -12, 2]) { const l = S.streetLamp(); l.position.set(lx, 0.9, 7.2); l.rotation.y = -Math.PI / 2; }
    for (const bx of [-18, -4]) { const b = S.bench(); b.position.set(bx, 0.9, 9.6); b.rotation.y = Math.PI; }
    // dock crane (swings a crate onto Pim's deck)
    CRANE = new THREE.Group(); CRANE.position.set(-2.5, 0.9, 7.6); sc.add(CRANE);
    const cy = K.paint('#f2c230', { rough: 0.35 });
    for (const [a, b] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) K.rbox(0.14, 6, 0.14, 0.03, cy, a, 3, b, CRANE);
    for (let k = 0; k < 6; k++) K.rbox(1.1, 0.08, 0.08, 0.02, cy, 0, 0.8 + k, 0.5, CRANE);
    K.rbox(1.6, 1.2, 1.4, 0.1, cy, 0, 6.4, 0, CRANE); const cab = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), K.paint('#2c3e52', { rough: 0.05 })); cab.position.set(0, 6.5, 0.71); CRANE.add(cab);
    CRANE.jib = new THREE.Group(); CRANE.jib.position.set(0, 7.0, 0); CRANE.add(CRANE.jib);
    K.rbox(0.3, 0.3, 9, 0.05, cy, 0, 0, -3.8, CRANE.jib);
    HOOKC = new THREE.Group(); CRANE.jib.add(HOOKC);
    K.cyl(0.015, 0.015, 3.6, K.paint('#222'), 0, -3.6, 0, HOOKC, 6);
    K.rbox(0.95, 0.7, 0.95, 0.05, K.paint('#2a8a5a', { rough: 0.4 }), 0, -4.0, 0, HOOKC);
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), S.textMat('VELLA', { bg: '#f4ead2', fg: '#1a1a1a', w: 256, h: 112 })); hl.position.set(0, -4.0, 0.48); HOOKC.add(hl);
    // ---------- open sea: three leg buoys, islands, a far lighthouse ----------
    for (const [bx, n] of [[16, 'LEG 1'], [36, 'LEG 2'], [52, 'LEG 3']]) { const b = new THREE.Group(); b.position.set(bx, 0, -13); sc.add(b);
      const bb = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.2, 24), K.paint('#e8402e', { rough: 0.3 })); bb.position.y = 0.2; b.add(bb);
      const bw = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.3, 24), K.paint('#f4f2ee', { rough: 0.3 })); bw.position.y = 0.4; b.add(bw);
      K.cyl(0.05, 0.05, 1.5, K.paint('#333'), 0, 0.8, 0, b, 8); const bl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2a0').multiplyScalar(2) })); bl.position.y = 2.4; b.add(bl);
      const nb = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.55), S.textMat(n, { bg: '#f4f2ee', fg: '#c0392b', w: 384, h: 160 })); nb.position.set(0, 1.7, 0.08); b.add(nb);
      const nb2 = nb.clone(); nb2.rotation.y = Math.PI; nb2.position.z = -0.08; b.add(nb2); b.userData.bob = bx; GULLS.push(b); }
    const isl = K.mat('grime', '#5a8a4a', { amt: 0.5 }), sand = K.mat('dirt', '#e8d2a0');
    for (const [ix, iz, r] of [[60, -60, 14], [110, -45, 10], [20, -80, 18], [150, -70, 20], [90, 50, 12]]) { const s2 = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), isl); s2.position.set(ix, -r * 0.7, iz); s2.scale.y = 0.6; sc.add(s2);
      const s3 = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.05, r * 1.15, 0.6, 24), sand); s3.position.set(ix, 0, iz); sc.add(s3); }
    // ---------- beach cutaway (x = BEACH): sand slope, umbrella, towel, sign, palm ----------
    const BG = K.group(); const sg = new THREE.PlaneGeometry(40, 30, 40, 30); sg.rotateX(-Math.PI / 2); const SP = sg.attributes.position;
    for (let k = 0; k < SP.count; k++) SP.setY(k, -1.15 + SP.getZ(k) * 0.16); sg.computeVertexNormals();
    const sandM = new THREE.Mesh(sg, K.mat('dirt', '#ecd6a4', { detail: 1.2 })); sandM.position.set(BEACH, 0, 0); sandM.receiveShadow = true; BG.add(sandM);
    const umb = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.6, 16, 1, true), K.paint('#e84a5f')); umb.material.side = THREE.DoubleSide; umb.position.set(BEACH + 2.5, 3.2, 9); BG.add(umb);
    K.cyl(0.04, 0.04, 2.9, K.chrome(), BEACH + 2.5, 0.4, 9, BG, 8);
    K.rbox(0.9, 0.03, 1.8, 0.01, K.paint('#2a9ab8'), BEACH - 1.5, 0.6, 8.5, BG);
    const castle = K.group(BG); for (const [cx, cz, h] of [[0, 0, 0.5], [0.4, 0, 0.35], [-0.4, 0, 0.35], [0, 0.35, 0.3]]) K.cyl(0.18, 0.22, h, K.mat('dirt', '#d8b880'), BEACH + 0.8 + cx, 0.25, 7.6 + cz, castle, 12);
    const bsg = S.board('BEACH|SWIM ZONE', 1.8, 0.9, { frame: '#2a62c8' }, BG); bsg.position.set(BEACH - 4, 0.4, 9.5);
    for (const [px, pz] of [[BEACH - 8, 11], [BEACH + 7, 12]]) { K.cyl(0.18, 0.26, 5, K.mat('wood', '#8a6040'), px, 0.6, pz, BG, 10); for (let k = 0; k < 6; k++) { const lf = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.6, 6), K.mat('grime', '#3a9a4a')); lf.position.set(px + Math.cos(k) * 1.0, 5.6, pz + Math.sin(k) * 1.0); lf.rotation.set(Math.sin(k) * 1.2, 0, -Math.cos(k) * 1.2); BG.add(lf); } }
    S.bake(BG);
    RAFT = K.group(); for (let k = 0; k < 6; k++) K.rbox(0.3, 0.12, 1.6, 0.03, K.mat('wood', '#a8703a'), 7.0 + k * 0.32, 0.04, 0.35, RAFT); for (const bz of [-0.5, 1.2]) { const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.9, 14), K.paint('#f28a2a')); fl.rotation.z = Math.PI / 2; fl.position.set(7.8, -0.05, bz); RAFT.add(fl); } K.set.bake(RAFT);
    // ---------- ships ----------
    SHIPP = ship(K, { top: '#1f3a6a', bottom: '#c0392b', funnel: '#c0392b', name: 'MARGOT', flag: 'P', len: 10, w: 2.6, sharp: false });
    // Pim's bulbous bow: polished steel ball + weld ring + rivets
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 28), K.chrome({ color: '#c8d0d8', rough: 0.16 })); ball.scale.set(1.7, 1, 1); ball.position.set(5.55, -0.78, 0); ball.castShadow = true; SHIPP.g.add(ball);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 10, 32), K.gold()); ring.rotation.y = Math.PI / 2; ring.position.set(5.0, -0.78, 0); SHIPP.g.add(ring);
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, rv = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), K.gold()); rv.position.set(5.3, -0.78 + Math.sin(a) * 0.55, Math.cos(a) * 0.55); SHIPP.g.add(rv); }
    SHIPB = ship(K, { top: '#14202e', bottom: '#2a7ab8', funnel: '#1a1a22', name: 'SWIFT', flag: 'B', len: 10.6, w: 2.3, sharp: true });
    S.bake(SHIPP.g); S.bake(SHIPB.g);
    // fuel gauge on Brag's bridge wing (insert shot), not baked
    const gauge = new THREE.Group(); gauge.position.set(SHIPB.sx + 0.9, 3.35, SHIPB.W / 2 + 0.6); SHIPB.g.add(gauge);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), S.textMat('E       F', { bg: '#f4ead2', fg: '#1a1a1a', w: 256, h: 256 })); face.position.z = 0.02; gauge.add(face);
    const gr = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.035, 10, 32), K.gold()); gr.position.z = 0.02; gauge.add(gr);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.06), S.textMat('FUEL', { bg: '#f4ead2', fg: '#c0392b', w: 192, h: 64, border: false })); fl.position.set(0, -0.1, 0.025); gauge.add(fl);
    NEEDLE = new THREE.Group(); NEEDLE.position.z = 0.04; gauge.add(NEEDLE); K.rbox(0.18, 0.02, 0.01, 0.004, K.paint('#d8302a'), 0.08, 0, 0, NEEDLE);
    const hubn = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), K.gold()); NEEDLE.add(hubn);
    K.cyl(0.03, 0.03, 0.6, K.paint('#333'), 0, -0.8, 0, gauge, 8);
    // x-ray on Pim's bulb + the three wave lines (hump red, dip blue, sum green) drawn beside the bow
    HOLO = new THREE.Mesh(new THREE.SphereGeometry(0.66, 32, 20), K.holo('#36e2ff')); HOLO.scale.set(1.7, 1, 1); HOLO.position.set(5.55, -0.78, 0); HOLO.userData.ndSkip = true; SHIPP.g.add(HOLO);
    const curve = (fn) => { const pts = []; for (let k = 0; k <= 30; k++) { const dx = -2.5 + k * 0.2; pts.push([5.4 + dx, 0.15 + fn(dx), 1.9]); } return pts; };
    TRH = K.trace(curve((d) => 0.9 * Math.exp(-((d - 0.6) ** 2) / 0.6)), { parent: SHIPP.g, color: '#ff5a4a', r: 0.04 });
    TRD = K.trace(curve((d) => -0.9 * Math.exp(-((d - 0.6) ** 2) / 0.6)), { parent: SHIPP.g, color: '#36e2ff', r: 0.04 });
    TRF = K.trace(curve(() => 0.02), { parent: SHIPP.g, color: '#7aff9a', r: 0.05 });
    // rope + clown nose
    ROPE = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]), 20, 0.03, 6), K.mat('fabric', '#d8b880')); sc.add(ROPE);
    CNOSE = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), K.paint('#e8202a', { rough: 0.2 })); sc.add(CNOSE);
    // characters + the ship's cat
    PIM = K.stick({ jacket: '#1f3a6a', pants: '#2a2a30', boots: '#1a1a1a', hat: 'pilot', hatColor: '#f4f4f4', moustache: '#d8d4cc', hair: '#d8d4cc', belt: '#1a1a1a', badge: true, pockets: true, scarf: '#c0392b', build: 'stout' }, { key: 'pim' });
    BRAG = K.stick({ jacket: '#f4f2ee', pants: '#1a1a2a', boots: '#1a1a1a', hat: 'pilot', hatColor: '#1a1a2a', glasses: '#1a1a1a', bowtie: '#f2c230', moustache: '#3a2418', belt: '#c8a030', collar: '#f2c230' }, { key: 'brag' });
    CAT = K.animal('cat', { color: '#3a3a40', belly: '#f4f2ee', stripes: '#2a2a30', seed: 2, scale: 1.1 });
    CNOSE2 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 14, 10), K.paint('#e8202a', { rough: 0.2 })); CAT.head.add(CNOSE2); CNOSE2.position.set(0, 0.0, 0.17);
    WADER = K.stick({ jacket: '#f2c230', pants: '#2a62c8', hat: 'cap', cap: '#e84a5f', hairStyle: 'curly', hair: '#3a2a1e', glasses: true, scarf: '#2a9ab8' }, { key: 'wader' });
    EXTRAS = S.extras(7, { x0: -24, len: 26, z: 8.2, spread: 1.2, seed: 9, stillShare: 0.5 });
    for (const e of EXTRAS) e.r.root.position.y = 0.9;
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, L = LINES;
    const cut = f >= 779 && f < 887;
    // ---------- ships ----------
    const px = xP(f), bx = xB(f), [hp, rp] = heave(f, 0), [hb, rb] = heave(f, 2);
    SHIPP.g.position.set(px, hp + 0.9 * (1 - sm(101, 330, f)), ZP); RAFT.visible = f < 101; SHIPP.g.rotation.set(0, 0, rp);
    SHIPB.g.position.set(bx, hb, ZB); SHIPB.g.rotation.set(0, 0, rb + (f > F.PUSHED && f < 705 ? 0.03 : 0));
    const onShip = (s, lx, ly, lz) => { const g = s.g; return [g.position.x + lx, g.position.y + ly, g.position.z + lz]; };
    NEEDLE.rotation.z = Math.PI * (0.85 - 0.85 * sm(F.NEEDLE - 6, F.GREW + 10, f) - 0.15 * sm(F.COUGH - 4, F.COUGH + 4, f)) ;
    // crane swings the crate onto Pim's deck
    CRANE.jib.rotation.y = lerp(-0.9, 0.35, sm(101, 150, f)); HOOKC.position.set(0, 0, -6.2); HOOKC.position.y = -sm(140, 160, f) * 0.4; HOOKC.visible = f < 330;
    // ---------- characters ----------
    const wing = (s) => onShip(s, s.sx + 0.2, 2.95, s.W / 2 + 0.6);
    if (f < 101) {   // Pim welds on a work raft at the bow
      PIM.set(T.act(f, [[0, 'grab', { expr: 'deadpan', R: [0.35, 0.05, 'torch'] }], [F.BALL, 'grab', { expr: 'deadpan', look: 0.4, R: [0.35, 0.05, 'torch'] }], [70, 'hips', { expr: 'proud' }]], { seed: 3, blink: blinkAt(f, 3) }),
        { x: 7.45, y: 0.12, z: 0.45, yaw: -0.7 });
    } else {
      const pk = [[0, 'hips', { expr: 'deadpan' }], [F.LAUGH + 8, 'idle', { expr: 'deadpan', look: -0.6 }], [F.CLOWN + 20, 'cross', { expr: 'deadpan' }], [L[3][0], 'idle', { expr: 'deadpan' }],
        [F.OWN, 'pointDown', { expr: 'smug' }], [F.FIFTEEN, 'hips', { expr: 'smile' }], [F.WAVED, 'idle', { expr: 'deadpan', look: -0.8 }], [F.ROPE - 8, 'throwBack', { expr: 'deadpan' }], [F.ROPE + 2, 'throw', { expr: 'deadpan' }], [F.CAT, 'hips', { expr: 'smug' }]];
      const w = wing(SHIPP); PIM.set(T.act(f, pk, { seed: 3, blink: blinkAt(f, 3) }), { x: w[0], y: w[1], z: w[2], yaw: f > F.WAVED ? -1.4 : 0.4 });
    }
    { const bk = [[0, 'hips', { expr: 'smug' }], [F.LAUGH - 3, 'point', { expr: 'gloat', talk: true }], [F.CLOWN + 16, 'clap', { expr: 'laugh' }], [L[3][0], 'wave', { expr: 'smug' }], [L[4][0] + 30, 'hips', { expr: 'gloat' }],
        [F.PUSHED - 4, 'push', { expr: 'grin' }], [F.NEEDLE + 6, 'push', { expr: 'grin', sweat: true }], [F.COUGH, 'shock', { expr: 'scared', sweat: true }], [F.DRIFT, 'facepalm', { expr: 'sad', sweat: true }],
        [F.WAVED - 3, 'wave', { expr: 'beg', sweat: true, talk: true }], [F.TOW - 2, 'beg', { expr: 'beg', talk: true }], [F.ROPE + 14, 'grab', { expr: 'confused', R: [0.3, 0.2, 'open'] }], [F.NOSE, 'grab', { expr: 'angry', R: [0.3, 0.2, 'open'] }]];
      const w = wing(SHIPB); BRAG.set(T.act(f, bk, { seed: 6, blink: blinkAt(f, 6) }), { x: w[0], y: w[1], z: w[2], yaw: 0.2, visible: !cut }); }
    PIM.root.visible = !cut;
    { const c = onShip(SHIPP, SHIPP.sx - 0.7, 3.55, SHIPP.W / 2 + 0.55); CAT.set(f, { x: c[0], y: c[1], z: c[2], yaw: f > F.WAVED ? -2.4 : 0.3, mode: f < F.CAT - 10 ? 'sit' : 'wag', expr: f > F.CAT - 4 ? 'happy' : 'neutral', look: Math.sin(f * 0.05) * 0.3, visible: !cut && f >= 101 }); }
    CNOSE2.visible = f >= F.CAT;
    // the wader (beach cutaway): walks waist-deep toward the shore, straining
    const wz = lerp(-1.5, 2.0, clamp((f - 779) / 108, 0, 1));
    WADER.set(T.act(f, [[0, 'walk', { expr: 'pained', sweat: true }], [F.PUSHING, 'push', { expr: 'pained', sweat: true }]], { seed: 8, blink: blinkAt(f, 8), phase: (f / 30 * 0.7) % 1 }), { x: BEACH, y: -0.95, z: wz, yaw: 0, visible: cut });
    K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) { e.r.root.position.y = 0.9; e.r.root.visible = f < 400; }
    // rope + clown nose
    const ropeU = sm(F.ROPE, F.ROPE + 16, f), a = onShip(SHIPP, -SHIPP.L / 2 + 0.6, 1.4, -0.9), b = onShip(SHIPB, SHIPB.sx + 0.6, 4.1, SHIPB.W / 2 + 0.7);
    ROPE.visible = f >= F.ROPE; CNOSE.visible = f >= F.ROPE;
    if (ROPE.visible) { const e = [lerp(a[0], b[0], ropeU), lerp(a[1], b[1], ropeU) + 2.2 * Math.sin(Math.PI * ropeU), lerp(a[2], b[2], ropeU)];
      const mid = [(a[0] + e[0]) / 2, Math.min(a[1], e[1]) - 0.6 * ropeU + 0.8 * (1 - ropeU), (a[2] + e[2]) / 2];
      ROPE.geometry.dispose(); ROPE.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(...a), new THREE.Vector3(...mid), new THREE.Vector3(...e)]), 24, 0.03, 6); CNOSE.position.set(e[0], e[1], e[2]); }
    // x-ray + wave lines
    const xr = f >= 887 && f < 1126; HOLO.visible = xr; TRH.show(xr ? sm(F.HUMP - 4, F.HUMP + 10, f) * (1 - sm(F.FLAT - 2, F.FLAT + 6, f)) : 0);
    TRD.show(xr ? sm(F.DIP - 4, F.DIP + 10, f) * (1 - sm(F.FLAT - 2, F.FLAT + 6, f)) : 0); TRF.show(xr ? sm(F.MEETS + 4, F.FLAT + 4, f) : 0);
    for (const b2 of GULLS) b2.position.y = 0.12 * Math.sin(f * 0.08 + b2.userData.bob);

    // ---------- shots ----------
    let cam, dof, u; const sh = (a0, b0) => (u = clamp((f - a0) / (b0 - a0), 0, 1), f >= a0 && f < b0);
    const head = (rig) => { rig.root.updateMatrixWorld(true); const v = new THREE.Vector3(); rig.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
    const orbit = (t, yaw, pitch, dist, fov) => { const a0 = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return { pos: [t[0] + Math.sin(a0) * Math.cos(p) * dist, t[1] + Math.sin(p) * dist, t[2] + Math.cos(a0) * Math.cos(p) * dist], look: t, fov }; };
    const shakeIt = (c, f0, amp, dur) => { const [sx, sy] = K.shake(f, f0, amp, dur); c.pos[0] += sx; c.pos[1] += sy; return c; };
    const bowP = onShip(SHIPP, 5.6, -0.4, 0), bowB = onShip(SHIPB, 6.6, 0.3, 0);
    if (sh(0, 48)) {             // 1. Pim welds the giant steel ball on, sparks flying
      cam = orbit([7.05, 0.75, 0.3], lerp(18, 10, u), 8, 3.9, 44 * K.push(u, 0.1)); dof = { focus: 3.6, cinf: 10 };
    } else if (sh(48, 101)) {    // 2. pull out: the whole ship with its ball nose, harbor behind
      cam = orbit([4.5, 0.6, 0], lerp(48, 64, u), lerp(4, 10, u), lerp(7.5, 11.5, u), 44); dof = { focus: 9, cinf: 4 };
    } else if (sh(101, 160)) {   // 3. the crane loads crates onto Pim's deck (1,000 crates)
      cam = { pos: [lerp(-7, -6, u), 4.0, 9.5], look: [lerp(-1.5, 0, u), 2.2, 1.0], fov: 46 }; dof = { focus: 9, cinf: 4 };
    } else if (sh(160, 229)) {   // 4. the race board: first ship to Port Vella gets paid double
      cam = { pos: [lerp(8.6, 8.0, u), 3.0, lerp(1.8, 2.4, u)], look: [4.5, 2.3, 8.6], fov: 44 }; dof = { focus: 7.5, cinf: 7 };
    } else if (sh(229, 280)) {   // 5. Brag on his bridge wing, laughing and pointing
      cam = orbit(head(BRAG), lerp(10, 20, u), 4, 2.3, 40 * K.punch(f, F.CLOWN, 0.15, 7)); dof = { focus: 2.3, cinf: 14 };
    } else if (sh(280, 326)) {   // 6. reaction: Pim deadpan, his cat on the rail
      cam = orbit(head(PIM), lerp(25, 15, u), 2, 2.4, 40 * K.push(u, 0.1)); dof = { focus: 2.4, cinf: 14 };
    } else if (sh(326, 389)) {   // 7. out of the harbor: low tracking shot alongside Brag's ship as it shoots ahead
      const tc = K.track(f, (g) => [xB(g), 0, ZB], { off: [5, 8, 9], lag: 3, lead: 0.2, lookY: 0.8 }); cam = { ...tc, fov: 44 }; dof = { focus: 13, cinf: 4 };
    } else if (sh(389, 436)) {   // 8. high aerial: both ships at sea, LEG 1 buoy
      cam = { pos: [lerp(px - 6, px - 2, u), 16, 14], look: [px + 8, 0, -4], fov: 46 }; dof = { focus: 20, cinf: 2 };
    } else if (sh(436, 481)) {   // 9. telephoto head-on: Brag leads by a mile
      cam = { pos: [bx + 16, 2.0, lerp(-3.4, -3.9, u)], look: [bx, 1.6, -3.9], fov: lerp(36, 33, u) }; dof = { focus: 14, cinf: 4 };
    } else if (sh(481, 530)) {   // 10. leg two, full speed: tracking low at Brag's bow
      const tc = K.track(f, (g) => [xB(g) + 4.5, 0, ZB], { off: [3.0, 0.8, 6.0], lag: 2, lead: 0.1, lookY: 0.6 }); cam = { ...tc, fov: 44 }; dof = { focus: 6.6, cinf: 8 };
    } else if (sh(530, 584)) {   // 11. front quarter, water level: the bow wave piles up
      cam = { pos: [bowB[0] + 5.5, 0.7, ZB + 3.4], look: [bowB[0] - 0.5, 0.9, ZB], fov: 44 * K.push(u, 0.08) }; dof = { focus: 6, cinf: 8 };
    } else if (sh(584, 625)) {   // 12. Brag shoves the throttle, grinning
      cam = orbit(head(BRAG), lerp(-15, -5, u), 6, 2.2, 40); dof = { focus: 2.2, cinf: 14 };
    } else if (sh(625, 660)) {   // 13. insert: the fuel needle drops
      const gp = onShip(SHIPB, SHIPB.sx + 0.9, 3.35, SHIPB.W / 2 + 0.62); cam = { pos: [gp[0] + 0.15, gp[1] + 0.12, gp[2] + 0.75], look: gp, fov: 40 * K.push(u, 0.12) }; dof = { focus: 0.75, cinf: 22 };
    } else if (sh(660, 701)) {   // 14. wide front: the wave grows taller (punch on "grew")
      cam = { pos: [bowB[0] + 12, 2.2, ZB + 7], look: [bowB[0] - 1, 1.2, ZB], fov: 40 * K.punch(f, F.GREW, 0.15, 7) }; dof = { focus: 13, cinf: 5 };
    } else if (sh(701, 740)) {   // 15. the funnel coughs black smoke (low, shake)
      const fp = onShip(SHIPB, SHIPB.sx - 1.0, 4.6, 0); cam = shakeIt({ pos: [fp[0] + 2.0, fp[1] - 1.8, ZB + 5.0], look: fp, fov: 44 }, F.COUGH, 0.05, 16); dof = { focus: 5, cinf: 8 };
    } else if (sh(740, 779)) {   // 16. Brag, sweating, as his ship drifts to a stop
      cam = orbit(head(BRAG), lerp(30, 22, u), 0, 2.0, 40 * K.push(u, 0.1)); dof = { focus: 2.0, cinf: 15 };
    } else if (sh(779, 830)) {   // 17. cutaway: a beachgoer wading waist-deep
      cam = { pos: [BEACH + lerp(3.2, 2.6, u), 1.0, wz + 4.2], look: [BEACH, 0.2, wz], fov: 42 }; dof = { focus: 4.6, cinf: 9 };
    } else if (sh(830, 887)) {   // 18. close: pushing the water is the hard part
      cam = orbit(head(WADER), lerp(-30, -20, u), -2, 1.7, 40); dof = { focus: 1.7, cinf: 15 };
    } else if (sh(887, 940)) {   // 19. x-ray under the waterline: Pim's glowing bulb, the hump line appears
      cam = { pos: [bowP[0] + lerp(1.0, 0.6, u), 1.6, ZP + 5.0], look: [bowP[0] - 0.4, -0.3, ZP], fov: 44 }; dof = { focus: 5.2, cinf: 6 };
    } else if (sh(940, 998)) {   // 20. the dip line appears right under the hump (front quarter)
      cam = { pos: [bowP[0] + 3.6, 2.0, ZP + 3.8], look: [bowP[0] - 0.3, -0.1, ZP + 1.0], fov: 42 * K.push(u, 0.08) }; dof = { focus: 4.6, cinf: 8 };
    } else if (sh(998, 1050)) {  // 21. hump meets dip: flat sea, -15% fuel (low tracking alongside Pim)
      const tc = K.track(f, (g) => [xP(g) + 2, 0, ZP], { off: [2.5, 2.2, 10], lag: 3, lead: 0.1, lookY: 0.9 }); cam = { ...tc, fov: 44 }; dof = { focus: 10, cinf: 5 };
    } else if (sh(1050, 1126)) { // 22. Pim glides past the drifting Brag (wide, high)
      cam = { pos: [lerp(bx - 6, bx + 2, u), 7.5, 13], look: [bx + 4, 0.5, -3.5], fov: 46 }; dof = { focus: 16, cinf: 3 };
    } else if (sh(1126, 1170)) { // 23. Brag waves and begs for a tow
      cam = orbit(head(BRAG), lerp(-20, -10, u), 4, 2.2, 40 * K.push(u, 0.1)); dof = { focus: 2.2, cinf: 14 };
    } else if (sh(1170, 1212)) { // 24. Pim looks back, deadpan; the cat on the rail
      cam = orbit(head(PIM), lerp(-74, -84, u), 6, 2.4, 40); dof = { focus: 2.6, cinf: 12 };
    } else if (sh(1212, 1262)) { // 25. the rope flies across the water
      cam = { pos: [lerp(a[0] - 3, a[0] - 4, u), 5.5, 6.5], look: [(a[0] + b[0]) / 2, 2.4, (a[2] + b[2]) / 2], fov: 46 }; dof = { focus: 10, cinf: 3 };
    } else if (sh(1262, 1305)) { // 26. Brag catches it: a red clown nose on the end
      cam = orbit(head(BRAG), lerp(10, 18, u), 0, 1.9, 40 * K.punch(f, F.NOSE, 0.12, 6)); dof = { focus: 1.9, cinf: 15 };
    } else {                     // 27. the cat, in its own clown nose (close, hold)
      const c = CAT.root.position; cam = orbit([c.x, c.y + 0.35, c.z], lerp(-140, -152, u), 6, 1.2, 40 * K.push(u, 0.12)); dof = { focus: 1.2, cinf: 18 };
    }
    // ---------- water: waves + bow waves, grid follows the camera ----------
    const t = f / 30, cx = Math.round(cam.look[0] / 0.66) * 0.66, cz = Math.round((cam.look[2] - 10) / 0.66) * 0.66;
    WATER.position.set(cx, 0, cz);
    const A = BW(f), Pp = SHIPP.g.position.x + 5.6, Bp = SHIPB.g.position.x + SHIPB.L / 2 + 2.0;
    const Pa = (f < 330 ? 0 : 0.12) * (xr && f < F.FLAT ? 1 : 1), pos = WATER.geometry.attributes.position.array;
    const wade = cut;
    for (let k = 0; k < pos.length; k += 3) { const x = WBASE[k] + cx, z = WBASE[k + 2] + cz;
      let h = 0.1 * Math.sin(0.45 * x + 1.3 * t) + 0.07 * Math.sin(0.31 * z - 0.18 * x + 0.9 * t) + 0.04 * Math.sin(1.1 * x + 0.7 * z + 2.1 * t);
      if (A > 0.01) { const dx = x - Bp, dz = z - ZB; h += A * Math.exp(-((dx + 0.5) ** 2) / 1.3 - dz * dz / 1.6);
        if (dx < 0) { const d = Math.abs(dz) - (1.2 - dx * 0.36); h += A * 0.45 * Math.exp(-d * d / 0.35) * Math.exp(dx / 18) * (0.65 + 0.35 * Math.sin(dx * 1.4 + t * 5)); } }
      if (Pa > 0) { const dx = x - Pp, dz = z - ZP; if (dx < 0) { const d = Math.abs(dz) - (1.3 - dx * 0.36); h += Pa * Math.exp(-d * d / 0.3) * Math.exp(dx / 12); } }
      if (wade) { const dz = z - (wz + 0.45), dx = x - BEACH; h += 0.22 * Math.exp(-dz * dz / 0.08 - dx * dx / 0.25); }
      pos[k + 1] = h; }
    WATER.geometry.attributes.position.needsUpdate = true; WATER.geometry.computeVertexNormals();
    WATER.material.opacity = xr ? 0.55 : 0.9;
    // ---------- particles + graphics ----------
    if (f < 101) K.sparks(f, 0, 101, [6.75, 0.35, 0.3], { dir: [1, 0.6, 0.6], spread: 0.7, rate: 16, speed: 4, life: 10, seed: 3 });
    K.steam(f, (g) => [xP(g) - SHIPP.L / 2 + 2.0 - 1.0, 5.2, ZP], { rate: 5, size: 0.9, rise: 2, drift: [-1.2, 0.2], dark: 0.3, seed: 1 });
    if (f < F.COUGH) K.steam(f, (g) => [xB(g) - SHIPB.L / 2 + 2.0 - 1.15, 5.2, ZB], { rate: 7, size: 0.9, rise: 2, drift: [-1.6, 0.2], dark: 0.4, seed: 2 });
    else if (f < F.DRIFT + 10) for (let k = 0; k < 3; k++) K.steam(f, [bx - SHIPB.L / 2 + 2.0 - 1.15, 5.3, ZB], { rate: 4, size: 1.6, rise: 2.5, drift: [-0.4, 0.2], dark: 0.8, seed: 5 + k, life: 50 });
    if (A > 0.3) K.steam(f, (g) => [xB(g) + SHIPB.L / 2 + 1.8, 0.4, ZB + 0.9], { rate: 10, size: 0.5 + A * 0.4, rise: 1.0 + A, drift: [1.5, 1.2], alpha: 0.7, seed: 8, life: 30 });
    K.badge(f, F.BALL, 'STEEL BALL', [6.3, 1.5, 0.3], { icon: 'weight', f1: 98 });
    K.badge(f, F.CRATES - 2, '1,000 CRATES', [0.2, 3.4, 1.0], { icon: 'up', f1: 158 });
    K.badge(f, F.DOUBLE, 'PAID x2', { sx: 0.5, sy: 0.3 }, { icon: 'coin', f1: 227, size: 1.3 });
    K.badge(f, F.CLOWN, 'CLOWN NOSE?', { sx: 0.5, sy: 0.3 }, { style: 'stamp', f1: 324, size: 1.4 });
    K.hud(f, F.LEGS, { stages: 3, labels: ['LEG 1', 'LEG 2', 'LEG 3'], u: clamp((px - 6) / 64, 0, 1), rival: clamp((bx - 6) / 64, 0, 1), f1: 1124 });
    if (f >= 530 && f < 584) K.badge(f, F.HUGE, 'BOW WAVE', [bowB[0] + 1.4, 2.4, ZB + 0.6], { icon: 'up', f1: 582 });
    if (f >= 625 && f < 660) K.badge(f, F.NEEDLE, 'FUEL', { sx: 0.5, sy: 0.68 }, { icon: 'down', f1: 659 });
    if (f >= 998 && f < 1126) K.badge(f, F.FIFTEEN, '-15% FUEL', [px + 2, 3.2, ZP + 1.5], { icon: 'check', f1: 1120, size: 1.15 });
    let light;
    if (cut) light = K.light('day', { az: 70, el: 40 });
    else if (f < 389) light = K.light('golden', { az: 62, el: 30, shadowExt: 22 });
    else if (f < 1126) light = K.light('day', { az: 62, el: 36, shadowExt: 26 });
    else light = K.light('golden', { az: 66, el: 22, shadowExt: 24 });
    return { light, cam, dof, actors: [], fx: [] };
  },
};
