// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "He Sawed the Tail Off His Pizza Helicopter" — invented story, engine: Remove It and See (SCRIPTS.md §000).
// Big Sal ("Cut the fat!") saws the "useless" tail propeller off his pizza helicopter to save forty bucks, then loads 300
// pizzas for the mayor's birthday. Pepper the pigeon, who hates flying, buckles up. Gina lifts off: up, then around, like a
// salad spinner full of pepperoni; forty pizzas frisbee onto the mayor's limo; Sal grabs the tail and becomes a tetherball.
// Explainer: push the big blades one way, they shove the helicopter the other way (office chair: arms right, chair left);
// the tail propeller pushes sideways all day to cancel the spin. Sal tapes it back on; Pepper flies the last pizza down for the tip.
import { TOTAL, LINES, wf } from './tailrotor_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const HP = [-14, 0, 12], HV = [1, 5.2, 3.5], LIMO = [6, 0, -2.2], LND = [-3, 0, 1.2], EX = [160, 0, 0], CH = [160, 0, 16];
const TAIL = [-4.75, 2.05, 0.34], DOOR = [0.25, 1.45, 1.0];
let THREE, F = {}, HELI, HX, SAL, GINA, MAYOR, PEP, SALPIV, PROP, SAW, PIZ = [], STACK = [], EXTRAS, CHAIR, ARC = {}, PBOX, COIN;

function pizzaMesh(K, parent) { const g = new THREE.Group(); parent.add(g);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 24), K.paint('#e8b04a', { rough: 0.6, coat: 0.2 })); g.add(c);
  const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.065, 24), K.paint('#f6d460', { rough: 0.5 })); g.add(ch);
  for (let k = 0; k < 6; k++) { const a = k * 1.047 + 0.3, r = k % 2 ? 0.24 : 0.12; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.075, 12), K.paint('#c8282a')); p.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); g.add(p); }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }
function boxMesh(K, S, parent) { const g = new THREE.Group(); parent.add(g); K.rbox(0.62, 0.1, 0.62, 0.02, K.paint('#d8b07a', { rough: 0.7 }), 0, 0.05, 0, g);
  const l = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.2), S.textMat("SAL'S", { bg: '#d8b07a', fg: '#c8282a', w: 220, h: 100, border: false })); l.rotation.x = -Math.PI / 2; l.position.y = 0.105; g.add(l); return g; }
// the hero prop: Sal's Sky Pizza helicopter (nose +x). holo = x-ray copy for the explainer
function makeHeli(K, S, holo) {
  const g = new THREE.Group(); K.scene.add(g); const H = holo ? K.holo(holo) : null;
  const RD = H || K.paint('#d8282a', { rough: 0.22 }), WH = H || K.paint('#f6f2ea', { rough: 0.3 }), BK = H || K.paint('#1c1c22', { rough: 0.45 }), CR = H || K.chrome(), GD = H || K.gold(), GL = H || K.glass({ color: '#bfe4ff', opacity: 0.32 });
  const P = {};
  const cab = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 24), RD); cab.scale.set(1.75, 1.05, 1.05); cab.position.set(0, 1.55, 0); g.add(cab);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 18), WH); belly.scale.set(1.6, 0.55, 0.98); belly.position.set(0.05, 1.05, 0); g.add(belly);
  const bub = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 20), GL); bub.scale.set(0.95, 0.78, 0.9); bub.position.set(1.05, 1.75, 0); g.add(bub);
  for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.03, 8, 40, Math.PI), GD); st.scale.set(1.65, 1.0, 1); st.position.set(0, 1.5, s * 1.0); g.add(st); }   // gold pinstripes
  // open side door (+z) with a dark cabin and a stack of pizza boxes
  if (!holo) { K.rbox(1.25, 0.95, 0.06, 0.08, K.paint('#2a1a18', { rough: 0.8 }), DOOR[0], DOOR[1] + 0.05, 0.99, g); const dr = K.rbox(1.2, 0.95, 0.06, 0.08, RD, DOOR[0] - 1.05, DOOR[1] + 0.05, 1.06, g); void dr;
    for (let k = 0; k < 6; k++) { const b = boxMesh(K, S, g); b.position.set(DOOR[0] + (k % 2 ? 0.05 : -0.04), 0.95 + k * 0.105, 0.82); b.rotation.y = k * 0.2; }
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.42), S.textMat("SAL'S SKY PIZZA", { bg: '#d8282a', fg: '#ffffff', w: 600, h: 150, border: false })); for (const s of [-1, 1]) { const n = sg.clone(); n.position.set(-1.55, 1.58, s * 0.46); n.rotation.y = s > 0 ? 0 : Math.PI; g.add(n); }
    for (const s of [-1, 1]) { const n = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), S.textMat('PIZZA', { bg: '#f6f2ea', fg: '#d8282a', w: 128, h: 128, border: false })); n.position.set(-0.75, 1.55, s * 1.07); n.rotation.y = s > 0 ? 0 : Math.PI; g.add(n); } }
  // tail boom, fin, stabiliser, beacon
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.42, 4.2, 20), RD); boom.rotation.z = Math.PI / 2; boom.position.set(-2.95, 1.75, 0); g.add(boom);
  for (const x of [-1.7, -2.7, -3.7]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.4 - (x + 1.7) * -0.06, 0.03, 8, 24), GD); r.rotation.y = Math.PI / 2; r.position.set(x, 1.75, 0); g.add(r); }
  const fin = K.rbox(0.8, 1.2, 0.08, 0.06, RD, -4.85, 2.15, 0, g); fin.rotation.z = -0.35; K.rbox(0.5, 0.06, 1.3, 0.03, WH, -4.3, 1.8, 0, g);
  K.sphere(0.08, holo ? H : new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3030').multiplyScalar(2), toneMapped: false }), -5.1, 2.72, 0, g);
  // tail propeller (the thing Sal saws off)
  const tr = new THREE.Group(); tr.position.set(...TAIL); g.add(tr); const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 12), CR); hub.rotation.x = Math.PI / 2; tr.add(hub);
  const trb = new THREE.Group(); tr.add(trb); for (const s of [-1, 1]) K.rbox(0.1, 0.62, 0.03, 0.02, holo ? H : WH, 0, s * 0.33, 0.05, trb); P.tail = tr; P.tailBlades = trb;
  // mast + main rotor
  K.cyl(0.14, 0.2, 0.55, CR, 0, 2.5, 0, g, 16); const rot = new THREE.Group(); rot.position.set(0, 3.08, 0); g.add(rot); K.cyl(0.24, 0.24, 0.16, BK, 0, -0.08, 0, rot, 16); K.sphere(0.12, GD, 0, 0.12, 0, rot);
  for (let k = 0; k < 4; k++) { const b = new THREE.Group(); b.rotation.y = k * Math.PI / 2; rot.add(b); K.rbox(4.3, 0.05, 0.32, 0.02, BK, 2.3, 0, 0, b); K.rbox(0.3, 0.06, 0.33, 0.02, holo ? H : K.paint('#f2c230'), 4.3, 0, 0, b); }
  P.rotor = rot;
  // skids + struts, exhaust, lights, step
  for (const s of [-1, 1]) { const sk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 12), CR); sk.rotation.z = Math.PI / 2; sk.position.set(0.1, 0.1, s * 0.95); g.add(sk);
    const tip = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 8, 12, Math.PI / 2), CR); tip.position.set(1.9, 0.28, s * 0.95); tip.rotation.z = -Math.PI / 2; g.add(tip);
    for (const x of [-0.7, 0.8]) { const st = K.cyl(0.04, 0.04, 0.75, CR, x, 0.1, s * 0.82, g, 8); st.rotation.x = s * 0.25; } }
  K.cyl(0.12, 0.12, 0.5, CR, -1.0, 2.3, 0.35, g, 12).rotation.z = Math.PI / 2;
  if (!holo) for (const s of [-0.5, 0.5]) { const hl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2), toneMapped: false })); hl.position.set(1.85, 1.0, s); g.add(hl); }
  if (!holo) g.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
  return { g, ...P };
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { SAWED: wf(0, 'sawed'), TAIL: wf(0, 'tail'), OFF: wf(0, 'off'), FORTY: wf(0, 'forty'), LOADED: wf(1, 'loaded'), HUNDRED: wf(1, 'hundred'), MAYOR: wf(1, 'mayor'), BDAY: wf(1, 'birthday'),
      CUT: wf(2, 'cut'), PEPPER: wf(2, 'pepper'), HATES: wf(2, 'hates'), BUCKLED: wf(2, 'buckled'), GINA: wf(3, 'gina'), LIFTED: wf(3, 'lifted'), UP: wf(3, 'up'), AROUND: wf(3, 'around'),
      AROUND2: wf(4, 'around'), SALAD: wf(4, 'salad'), PEPPERONI: wf(4, 'pepperoni'), FORTY2: wf(5, 'forty'), FLEW: wf(5, 'flew'), DOOR: wf(5, 'door'), FRISBEES: wf(5, 'frisbees'), LIMO: wf(5, 'limo'),
      GRABBED: wf(6, 'grabbed'), PULLED: wf(6, 'pulled'), SPINNING: wf(6, 'spinning'), TINY: wf(7, 'tiny'), TWIRL: wf(7, 'twirling'), BLADES: wf(8, 'blades'), ONEWAY: wf(8, 'way'), SHOVE: wf(8, 'shove'), OTHER: wf(8, 'other'),
      CHAIR: wf(9, 'chair'), SWING: wf(9, 'swing'), RIGHT: wf(9, 'right'), TURNS: wf(9, 'turns'), LEFT: wf(9, 'left'), PUSHES: wf(10, 'pushes'), SIDEWAYS: wf(10, 'sideways'), CANCEL: wf(10, 'cancel'),
      WHISP: wf(11, 'whispered'), DIZZY: wf(11, 'dizzy'), GLUING: wf(11, 'gluing'), FLEW2: wf(12, 'flew'), LAST: wf(12, 'last'), FORTY3: wf(12, 'forty'), TIP: wf(12, 'tip') };
    // ================= the town: shops across the street, Sal's helipad + the mayor's party on the park side =================
    S.street({ len: 110, width: 7, sidewalk: 4.5, crossings: [-24, 20] });
    K.slab(-90, 120, -0.2, -0.01, -60, 60, K.mat('grime', '#6aa84f', { amt: 0.6 }), sc, false);
    let x = -55, i = 0;
    while (x < 50) { const w = 5 + (i * 7 % 4); const shop = Math.abs(x + 16) < 3 ? "SAL'S SKY PIZZA" : [null, 'BAKERY', null, 'CAFE', null, 'HARDWARE', null, 'FLOWERS'][i % 8];
      const b = S.building({ w, d: 9, floors: 2 + (i % 3), seed: i + 5, shop, awning: shop === "SAL'S SKY PIZZA" ? '#d8282a' : undefined, shutters: i % 3 === 0 ? '#2a5a3a' : null, flowers: i % 2 === 0, kind: i % 5 === 3 ? 'plaster' : 'brick' }); b.position.set(x + w / 2, 0.15, -8); x += w + 0.05; i++; }
    x = -55; i = 30;
    while (x < 50) { const w = 5 + (i * 5 % 4); const b = S.building({ w, d: 9, floors: 3 + (i % 2), seed: i + 1, shop: i % 3 === 0 ? ['BOOKS', 'TOYS', 'DELI'][(i / 3 | 0) % 3] : null, flowers: true }); b.position.set(x + w / 2, 0, 34); b.rotation.y = Math.PI; x += w + 0.05; i++; }
    const PG = K.group();
    for (let k = -54; k < 50; k += 3.2) if (Math.abs(k + 14) > 6 && Math.abs(k - 10) > 9) K.rbox(2.8, 0.7, 0.8, 0.25, K.mat('grime', '#3f8a3a', { detail: 0.4 }), k, 0.35, 8.6, PG);
    for (let k = -50; k < 50; k += 2.6) if (Math.abs(k + 14) > 6 && Math.abs(k - 10) > 9) K.sphere(0.07, K.paint(['#f4f2ee', '#f2c230', '#e84a8f'][Math.abs(k * 10 | 0) % 3], { coat: 0 }), k + 1, 0.74, 8.3, PG);
    // helipad: dark disc, yellow ring, big H, lights, windsock
    K.cyl(5.2, 5.2, 0.05, K.mat('grime', '#3a3c44', { detail: 0.6 }), HP[0], 0, HP[2], PG, 48);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.12, 8, 64), K.paint('#f2c230')); ring.rotation.x = Math.PI / 2; ring.position.set(HP[0], 0.07, HP[2]); PG.add(ring);
    for (const dz of [-1.1, 1.1]) K.rbox(0.45, 0.04, 2.6, 0.02, K.paint('#f4f2ee'), HP[0] + 1.6, 0.07, HP[2] + dz * 0.0 + (dz > 0 ? 0 : 0), PG).position.x = HP[0] + dz * 0.9;
    K.rbox(1.8, 0.04, 0.45, 0.02, K.paint('#f4f2ee'), HP[0], 0.07, HP[2], PG);
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; K.sphere(0.1, K.paint('#4ab8ff'), HP[0] + Math.cos(a) * 5.0, 0.1, HP[2] + Math.sin(a) * 5.0, PG); }
    K.cyl(0.05, 0.05, 4.5, K.chrome(), HP[0] - 6.5, 0, HP[2] - 2.5, PG, 8); const sock = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.6, 16, 1, true), K.paint('#ff6a1a')); sock.rotation.z = Math.PI / 2; sock.position.set(HP[0] - 5.7, 4.3, HP[2] - 2.5); PG.add(sock);
    // landing spot by the party: a second small pad
    K.cyl(3.2, 3.2, 0.04, K.mat('grime', '#4a4c54'), LND[0], 0, LND[2], PG, 40);
    // the mayor's party: long table, cloth, boxes, cake, balloons, banner posts, bunting
    K.rbox(7, 0.1, 1.5, 0.03, K.mat('wood', '#c8a070'), 12, 0.95, -6.2, PG); K.rbox(7.1, 0.3, 1.6, 0.02, K.paint('#d84a6a', { rough: 0.8 }), 12, 0.85, -6.2, PG);
    for (const lx of [8.8, 15.2]) for (const lz of [-6.8, -5.6]) K.rbox(0.1, 0.9, 0.1, 0.02, K.mat('wood', '#8a6a4a'), lx, 0.45, lz, PG);
    for (let k = 0; k < 8; k++) { const b = boxMesh(K, S, PG); b.position.set(9.3 + k * 0.75, 1.0 + (k % 3) * 0.1, -6.3); }
    K.cyl(0.45, 0.45, 0.35, K.paint('#f4e8d8'), 14.6, 1.0, -6.1, PG, 24); K.cyl(0.3, 0.3, 0.25, K.paint('#f08ab8'), 14.6, 1.35, -6.1, PG, 24); for (let k = 0; k < 5; k++) K.cyl(0.015, 0.015, 0.16, K.paint('#4ab8ff'), 14.6 + Math.cos(k * 1.25) * 0.18, 1.6, -6.1 + Math.sin(k * 1.25) * 0.18, PG, 6);
    for (let k = 0; k < 9; k++) { const bx = 8 + (k % 5) * 2.2 + hash(k) * 0.6, bz = -7.5 + (k % 2) * 0.2, hh = 2.6 + hash(k + 4) * 1.2; K.cyl(0.008, 0.008, hh, K.paint('#f4f2ee'), bx, 0, bz, PG, 4); K.sphere(0.32, K.paint(['#e8202a', '#f2c230', '#4ab8ff', '#e84a8f', '#3ab86a'][k % 5], { rough: 0.15 }), bx, hh + 0.3, bz, PG, 1, 1.2, 1); }
    for (const bx of [8, 16]) K.cyl(0.06, 0.06, 3.2, K.paint('#f4f2ee'), bx, 0, -7.7, PG, 8);
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 1.0), S.textMat('HAPPY BIRTHDAY MAYOR MUNCH!', { bg: '#f2c230', fg: '#c8282a', w: 1200, h: 160, border: false })); ban.position.set(12, 2.8, -7.66); PG.add(ban);
    for (let k = 0; k < 14; k++) { const fl = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 3), K.paint(['#e8202a', '#4ab8ff', '#f2c230'][k % 3])); fl.rotation.x = Math.PI; fl.position.set(8.2 + k * 0.56, 3.35 - 0.12 * Math.sin(k / 13 * Math.PI), -7.64); PG.add(fl); }
    // Sal's pizza cart near the pad + scrap bin
    K.rbox(1.4, 0.08, 0.9, 0.02, K.chrome(), HP[0] + 4.2, 0.6, HP[2] + 3.4, PG); for (const [cx, cz] of [[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]]) K.cyl(0.03, 0.03, 0.6, K.chrome(), HP[0] + 4.2 + cx, 0, HP[2] + 3.4 + cz, PG, 6);
    for (let k = 0; k < 9; k++) { const b = boxMesh(K, S, PG); b.position.set(HP[0] + 4.2 + (k % 2 ? 0.04 : -0.03), 0.66 + k * 0.105, HP[2] + 3.4); b.rotation.y = k * 0.3; }
    K.rbox(1.3, 1.0, 1.0, 0.06, K.paint('#3a7a4a', { rough: 0.5 }), HP[0] - 3.5, 0.5, HP[2] + 5.6, PG); const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.3), S.textMat('SCRAP', { bg: '#3a7a4a', fg: '#ffffff', w: 300, h: 90, border: false })); scr.position.set(HP[0] - 3.5, 0.7, HP[2] + 6.11); PG.add(scr);
    K.rbox(0.8, 0.6, 0.6, 0.06, K.mat('wood', '#b88a5a'), HP[0] - 4.75, 0.3, HP[2] + 1.0, PG);   // step stool by the tail
    S.bake(PG);
    for (let k = -50; k <= 48; k += 9) if (Math.abs(k + 14) > 7 && Math.abs(k - 10) > 8) { const t = S.tree({ h: 5.5, seed: k + 31 }); t.position.set(k, 0, 25 + (k % 2) * 2); }
    for (const [tx, tz] of [[-30, 16], [22, 24], [30, 20]]) { const t = S.tree({ h: 5, seed: tx + 9 }); t.position.set(tx, 0, tz); }
    for (let k = -46; k <= 46; k += 12) { const l = S.streetLamp(); l.position.set(k, 0.15, 4.1); l.rotation.y = Math.PI; }
    for (const [kk, sx, sz] of [['parking', -6, 4.2], ['arrow', 24, -4.2], ['warn', -30, 4.2]]) { const s = S.sign(kk); s.position.set(sx, 0.15, sz); s.rotation.y = sz > 0 ? Math.PI : 0; }
    for (const [bx, bz, r] of [[-26, 5.8, Math.PI], [26, 5.8, Math.PI]]) { const b = S.bench(); b.position.set(bx, 0.15, bz); b.rotation.y = r; }
    const hb = S.board("SAL'S HELIPAD|NO PIGEONS", 1.8, 1.1); hb.position.set(HP[0] + 5.6, 0, HP[2] - 2.6); hb.rotation.y = 0.4;
    for (const [cx, cz, kind, seed] of [[-30, -2.4, 'hatch', 2], [-20, -2.4, 'van', 3], [26, -2.4, 'taxi', 4]]) { const c = S.car({ kind, seed }); c.g.position.set(cx, 0, cz); }
    { const c = S.car({ kind: 'hatch', color: '#1a1a24', seed: 9 }); c.g.position.set(LIMO[0], 0, LIMO[2]); c.g.scale.set(1.75, 1, 1); c.g.rotation.y = 0;
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.26), K.paint('#f2c230')); fl.position.set(LIMO[0] + 3.4, 1.45, LIMO[2] - 0.75); sc.add(fl); K.cyl(0.01, 0.01, 0.5, K.chrome(), LIMO[0] + 3.2, 0.9, LIMO[2] - 0.75, sc, 6); }
    // ================= hero prop =================
    HELI = makeHeli(K, S, null);
    SAW = new THREE.Group(); sc.add(SAW); K.rbox(0.7, 0.16, 0.015, 0.01, K.chrome(), -0.2, 0, 0, SAW); K.rbox(0.22, 0.2, 0.06, 0.04, K.paint('#d8282a'), 0.22, 0.03, 0, SAW);
    PROP = new THREE.Group(); sc.add(PROP); { const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 12), K.chrome()); hub.rotation.x = Math.PI / 2; PROP.add(hub); for (const s of [-1, 1]) K.rbox(0.1, 0.62, 0.03, 0.02, K.paint('#f6f2ea'), 0, s * 0.33, 0.05, PROP); }
    for (let k = 0; k < 20; k++) PIZ.push(pizzaMesh(K, sc));
    PBOX = boxMesh(K, S, sc); COIN = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 20), K.gold()); sc.add(COIN);
    // ================= explainer stage =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64); K.cyl(5, 5, 0.1, K.paint('#1f2a44', { rough: 0.4 }), CH[0], 0, CH[2], EG, 48);
    for (const [r, c] of [[4, EX], [8.6, EX], [4.4, CH]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(c[0], 0.12, c[2]); t.userData.ndSkip = true; EG.add(t); }
    HX = makeHeli(K, S, '#36e2ff'); HX.g.position.set(EX[0], 0.6, EX[2]);
    const circ = (cx, cy, cz, r, a0, a1, n = 30) => Array.from({ length: n }, (_, k) => { const a = lerp(a0, a1, k / (n - 1)); return [cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r]; });
    ARC.blade = K.trace(circ(EX[0], 4.2, EX[2], 3.2, 0, -4.4), { color: '#7af8ff', r: 0.07 }); ARC.body = K.trace(circ(EX[0], 1.0, EX[2], 2.6, 3.5, 7.9), { color: '#ff8a3a', r: 0.07 });
    ARC.side = K.trace([[TAIL[0], TAIL[1], 0.6], [TAIL[0], TAIL[1], 2.7]], { color: '#7af8a0', r: 0.08, parent: HX.g });
    ARC.arms = K.trace(circ(CH[0], 1.9, CH[2], 1.0, 1.2, -0.4, 16), { color: '#7af8ff', r: 0.05 }); ARC.chair = K.trace(circ(CH[0], 0.3, CH[2], 0.9, 1.9, 3.6, 16), { color: '#ff8a3a', r: 0.06 });
    const cone = (c) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2.4), toneMapped: false })); m.userData.ndSkip = true; sc.add(m); return m; };
    ARC.hb = cone('#7af8ff'); ARC.hbody = cone('#ff8a3a'); ARC.hside = cone('#7af8a0'); HX.g.add(ARC.hside);
    CHAIR = new THREE.Group(); sc.add(CHAIR); CHAIR.position.set(CH[0], 0, CH[2]); { const BK = K.paint('#1c1c22', { rough: 0.4 }), CR = K.chrome();
      for (let k = 0; k < 5; k++) { const a = K.rbox(0.55, 0.05, 0.08, 0.02, CR, 0, 0.12, 0, CHAIR); a.geometry.translate(0.27, 0, 0); a.rotation.y = k * 1.2566; K.sphere(0.05, BK, Math.cos(k * 1.2566) * 0.55, 0.05, -Math.sin(k * 1.2566) * 0.55, CHAIR); }
      K.cyl(0.04, 0.04, 0.32, CR, 0, 0.12, 0, CHAIR, 10); K.rbox(0.62, 0.1, 0.6, 0.05, K.paint('#2a6aa8', { rough: 0.5 }), 0, 0.47, 0, CHAIR); K.rbox(0.58, 0.7, 0.08, 0.05, K.paint('#2a6aa8', { rough: 0.5 }), 0, 0.95, -0.3, CHAIR); }
    // ================= characters =================
    SAL = K.stick({ jacket: '#c83a2a', pants: '#2a2a40', hat: 'chef', moustache: '#2a1a14', apron: '#f4f2ee', bowtie: '#2a6aa8', build: 'stout', belt: '#3a2418' }, { key: 'sal' });
    GINA = K.stick({ jacket: '#7a4a2a', pants: '#3a3a4a', hat: 'pilot', hatColor: '#5a3a24', glasses: '#1a1a1a', scarf: '#f4f2ee', gloves: '#3a2418', hairStyle: 'ponytail', hair: '#1a1210', boots: '#2a1a14' }, { key: 'gina' });
    MAYOR = K.stick({ jacket: '#6a3a9a', pants: '#2a2a40', hat: 'tophat', moustache: '#c8c8c8', collar: '#f4efe4', tie: '#f2c230', vest: '#e8d8b0', badge: true }, { key: 'mayor' });
    PEP = K.animal('pigeon', { seed: 4, scale: 1.7 });
    SALPIV = new THREE.Group(); sc.add(SALPIV);
    EXTRAS = S.extras(6, { x0: 8, len: 9, z: -4.9, spread: 0.6, seed: 7 }).concat(S.extras(5, { x0: -40, len: 30, z: -5.4, spread: 1.2, seed: 21 }));
    K.addClouds(10, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), S = K.set, sc = K.scene;
    const ex = f >= 776 && f < 1124;
    // ---------- helicopter flight ----------
    let w = 0, psi = 0; for (let g = 0; g < Math.min(f, 776); g++) { w = g < F.AROUND - 6 ? 0 : g < F.AROUND2 ? 0.07 * sm(F.AROUND - 6, F.AROUND2, g) : g < 450 ? 0.07 + 0.11 * sm(F.AROUND2, 450, g) : 0.18; psi += w; }
    let hp = [...HP], hyaw = 0, rot = f * 0.05;
    if (f >= 318 && f < 776) { rot = f * 0.6;
      const up = sm(F.LIFTED, F.UP + 10, f), drift = sm(380, 470, f), down = sm(F.GRABBED - 30, F.GRABBED - 4, f);
      hp = [lerp(HP[0], HV[0], drift), lerp(0, HV[1], up) - (HV[1] - 1.0) * down, lerp(HP[2], HV[2], drift)]; hyaw = psi;
      hp[1] += 0.08 * Math.sin(f * 0.3); }
    else if (f >= 1124) { hp = [...LND]; hyaw = 0.35; rot = 1124 * 0.6 + (f - 1124) * 0.6 * Math.max(0.05, 1 - (f - 1124) / 90); }
    HELI.g.visible = !ex; HELI.g.position.set(...hp); HELI.g.rotation.set(0, hyaw, (f >= 411 && f < 776 ? 0.06 : 0) * Math.sin(f * 0.2));
    HELI.rotor.rotation.y = rot; HELI.tail.visible = f < F.OFF + 2 || f >= F.GLUING + 6; HELI.tailBlades.rotation.z = f >= 1240 ? f * 0.9 : 0;
    const W = (lx, ly, lz) => { const c = Math.cos(hyaw), s = Math.sin(hyaw); return [hp[0] + lx * c + lz * s, hp[1] + ly, hp[2] - lx * s + lz * c]; };
    // saw (sawing the tail propeller), the falling + thrown propeller
    SAW.visible = f < F.OFF + 6; { const t = W(...TAIL); SAW.position.set(t[0] + 0.15 * Math.sin(f * 0.9), t[1] - 0.12, t[2] + 0.25); SAW.rotation.set(0, 0, -0.3); }
    PROP.visible = !ex && f >= F.OFF + 2 && f < 330; { const t0 = W(...TAIL); let p = [t0[0], t0[1], t0[2] + 0.1], r = [0, 0, 0];
      if (f < F.CUT) { const u = sm(F.OFF + 2, F.OFF + 12, f); p = [t0[0], lerp(t0[1], 0.08, u * u), t0[2] + 0.4 * u]; r = [Math.PI / 2 * u, 0, 0]; }
      else { const u = clamp((f - F.CUT - 4) / 26, 0, 1); const a = [HP[0] - 3.2, 0.2, HP[2] + 2.4], b = [HP[0] - 3.5, 1.1, HP[2] + 5.6]; p = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 2.6 * Math.sin(Math.PI * u), lerp(a[2], b[2], u)]; r = [f * 0.5, f * 0.3, 0]; if (f < F.CUT + 4) p = a; }
      PROP.position.set(...p); PROP.rotation.set(...r); }
    // ---------- flying pizzas -> stacked on the limo ----------
    PIZ.forEach((pz, k) => { const t0 = F.FLEW + k * 4.2, d = W(DOOR[0], DOOR[1] + 0.5, DOOR[2] + 0.3);
      const tgt = [LIMO[0] - 2.4 + (k % 5) * 1.2, 1.62 + Math.floor(k / 5) * 0.08, LIMO[2] + ((k * 7) % 3 - 1) * 0.25];
      if (f < t0 || ex) { pz.visible = false; return; } pz.visible = true;
      if (f >= 1124) { pz.position.set(...tgt); pz.rotation.set(0, k, 0); return; }
      const u = clamp((f - t0) / 22, 0, 1); const wob = (hash(k) - 0.5) * 6;
      pz.position.set(lerp(d[0], tgt[0], u) + wob * Math.sin(Math.PI * u), lerp(d[1], tgt[1], u) + 2.5 * Math.sin(Math.PI * u), lerp(d[2], tgt[2], u) + wob * 0.4 * Math.sin(Math.PI * u));
      pz.rotation.set(u < 1 ? 0.3 * Math.sin(f * 0.4 + k) : 0, u < 1 ? f * 0.8 : k, 0); });
    // ---------- Sal ----------
    let sp = { x: HP[0] - 4.75, y: 0.6, z: HP[2] + 1.0, yaw: Math.PI }, hang = false;
    if (f >= 114 && f < 213) sp = { x: HP[0] + 2.0, z: HP[2] + 2.6, yaw: -2.3 };
    else if (f >= 213 && f < 318) sp = { x: HP[0] - 3.2, z: HP[2] + 2.4, yaw: f < F.CUT + 2 ? 0.6 : 0.2 };
    else if (f >= 318 && f < 480) sp = { x: HP[0] + 3, z: HP[2] + 4.5, yaw: -2.6 + (f > 420 ? 0.9 * sm(400, 470, f) : 0) };
    else if (f >= 480 && f < F.GRABBED) { const Wk = K.walkPath(f, 486, [[HP[0] + 3, HP[2] + 4.5], [-4, 12.5], [HV[0] - 3, HV[2] + 3.5]], 3.2); sp = { x: Wk.x, z: Wk.z, yaw: Wk.yaw }; }
    else if (f >= F.GRABBED && f < 776) hang = true;
    else if (f >= 1124 && f < 1204) { const t = W(TAIL[0] + 0.3, 0, TAIL[2] + 0.7); sp = { x: t[0], y: 0.0, z: t[2], yaw: 0.2 }; }
    else if (f >= 1204) sp = { x: 8.6, z: 0.4, yaw: 0.3 };
    const sk = [[0, 'push', { expr: 'grin' }], [F.OFF - 4, 'cheer', { expr: 'laugh' }], [F.FORTY - 2, 'show', { expr: 'smug', R: [0.3, 0.2, 'money'] }],
      [114, 'point', { expr: 'proud' }], [F.HUNDRED, 'hips', { expr: 'grin' }], [F.CUT - 6, 'throwBack', { expr: 'proud', talk: true }], [F.CUT + 2, 'throw', { expr: 'grin', talk: true }], [F.PEPPER, 'hips', { expr: 'smug' }],
      [318, 'wave', { expr: 'grin' }], [F.AROUND, 'shock', { expr: 'shock' }], [F.SALAD - 4, 'panic', { expr: 'scared', sweat: true }], [486, 'run', { expr: 'scared' }], [F.GRABBED - 2, 'cheer', { expr: 'yell' }], [F.SPINNING, 'cheer', { expr: 'dazed' }],
      [1124, 'reach', { expr: 'dazed', R: [0.4, 0.1, 'tape'] }], [F.WHISP - 4, 'reach', { expr: 'nervous', talk: true, R: [0.4, 0.1, 'tape'] }], [F.GLUING, 'hammer', { expr: 'dazed' }],
      [1204, 'shock', { expr: 'shock' }], [F.FORTY3, 'facepalm', { expr: 'pained' }], [F.TIP, 'shrug', { expr: 'dazed' }]];
    const sA = T.act(f, sk.map((k) => (f >= 486 && f < F.GRABBED - 2 && k[1] !== 'run' ? k : k)), { seed: 3, blink: blink(3) });
    if (hang) { HELI.g.add(SALPIV); SALPIV.position.set(TAIL[0] + 0.3, TAIL[1] - 0.05, 0); SALPIV.rotation.set(0, 0, -0.7 * sm(F.GRABBED, F.PULLED + 6, f)); SALPIV.add(SAL.root);
      SAL.set(sA, { x: 0, y: -2.25, z: 0, yaw: -Math.PI / 2, visible: true }); }
    else { sc.add(SALPIV); SALPIV.position.set(0, 0, 0); SALPIV.rotation.set(0, 0, 0); SALPIV.add(SAL.root); SAL.set(sA, { ...sp, visible: !ex }); }
    // ---------- Gina (pilot: in the cockpit while flying, on the office chair in the explainer) ----------
    const gk = [[0, 'idle', { expr: 'deadpan' }], [114, 'carry', { expr: 'neutral', item: 'box' }], [F.HUNDRED, 'carry', { expr: 'nervous', item: 'box' }], [213, 'cross', { expr: 'deadpan' }],
      [318, 'sit', { expr: 'proud' }], [F.AROUND, 'sit', { expr: 'confused' }], [F.SALAD, 'sit', { expr: 'scared', sweat: true }], [F.TINY, 'sit', { expr: 'dazed' }],
      [902, 'sit', { expr: 'smile' }], [F.SWING - 4, 'sit', { expr: 'excited', R: [1.0, -0.6, 'open'], L: [-0.2, -0.6, 'open'] }], [F.TURNS, 'sit', { expr: 'shock', R: [1.0, -0.6, 'open'], L: [-0.2, -0.6, 'open'] }],
      [1124, 'facepalm', { expr: 'dazed' }], [1204, 'clap', { expr: 'laugh' }]];
    const gA = T.act(f, gk, { seed: 6, blink: blink(6) });
    if ((f >= 318 && f < 776)) { HELI.g.add(GINA.root); GINA.set(gA, { x: 1.1, y: 0.55, z: -0.3, yaw: Math.PI / 2, seat: 0.45, visible: true }); }
    else if (ex) { sc.add(GINA.root); const cy = f < F.TURNS - 2 ? 0 : -0.9 * sm(F.TURNS - 2, F.TURNS + 12, f); CHAIR.rotation.y = cy; GINA.set(gA, { x: CH[0], y: 0.1, z: CH[2], yaw: cy, seat: 0.45, visible: f >= 902 }); }
    else { sc.add(GINA.root); let gp = { x: HP[0] + 1.8, z: HP[2] + 5.5, yaw: 3.0 };
      if (f >= 114 && f < 213) { const Wk = K.walkPath(f, 116, [[HP[0] + 3.8, HP[2] + 2.9], [HP[0] + 0.6, HP[2] + 1.9]], 1.1); gp = { x: Wk.x, z: Wk.z, yaw: Wk.yaw }; }
      else if (f >= 1124) gp = { x: LND[0] + 2.6, z: LND[2] + 2.8, yaw: 0.2 };
      else if (f < 114) gp = { x: HP[0] + 1.5, z: HP[2] + 2.6, yaw: -2.4 };
      GINA.set(gA, { ...gp, visible: true }); }
    CHAIR.visible = ex && f >= 902;
    // ---------- the mayor ----------
    const mk = [[0, 'idle', { expr: 'smile' }], [F.FLEW, 'pointUp', { expr: 'confused' }], [F.FRISBEES, 'shock', { expr: 'shock' }], [F.LIMO, 'facepalm', { expr: 'pained' }], [600, 'pointUp', { expr: 'shock' }],
      [1124, 'cross', { expr: 'stern' }], [F.LAST, 'reach', { expr: 'shock' }], [F.FORTY3 - 4, 'show', { expr: 'laugh', R: [0.3, 0.1, 'coin'] }], [F.TIP, 'clap', { expr: 'laugh' }]];
    let mp = { x: LIMO[0] + 4.3, z: LIMO[2] + 0.9, yaw: -0.6 }; if (f >= 1124) mp = { x: 11.8, z: -3.4, yaw: -0.4 }; else if (f < 480) mp = { x: 12, z: -5.0, yaw: 0 };
    MAYOR.set(T.act(f, mk, { seed: 8, blink: blink(8) }), { ...mp, visible: !ex });
    // ---------- Pepper the pigeon ----------
    let pg;
    if (f < 318) { HELI.g.add(PEP.root); pg = f < 213 ? { x: -0.6, y: 0.17, z: 0.95, yaw: Math.PI * 0.9, mode: f >= F.OFF && f < F.OFF + 20 ? 'jump' : 'stand', expr: f >= F.SAWED ? 'shock' : 'neutral', flap: f >= F.OFF && f < F.OFF + 20 }
      : { x: DOOR[0], y: 1.6, z: 0.82, yaw: Math.PI * 0.25, mode: 'sit', expr: f >= F.BUCKLED ? 'sad' : 'shock' }; }
    else if (f < 776) { HELI.g.add(PEP.root); pg = { x: DOOR[0], y: 1.6, z: 0.82, yaw: Math.PI * 0.25 + 0.3 * Math.sin(f * 0.4), mode: 'sit', expr: f >= F.AROUND ? 'shock' : 'sad' }; }
    else if (f >= 1124 && f < F.FLEW2 - 4) { HELI.g.add(PEP.root); pg = { x: DOOR[0], y: 1.6, z: 0.82, yaw: Math.PI * 0.25, mode: 'stand', expr: 'sad' }; }
    else if (f >= 1124) { sc.add(PEP.root); const d = W(DOOR[0], 1.6, DOOR[2]); const u = sm(F.FLEW2 - 4, F.FORTY3 - 6, f);
      const p = [lerp(d[0], 11.0, u), lerp(d[1], 1.2, u) + 1.8 * Math.sin(Math.PI * u), lerp(d[2], -2.9, u)];
      pg = { x: p[0], y: p[1], z: p[2], yaw: u < 1 ? Math.atan2(11.0 - d[0], -2.9 - d[2]) : 0.9, mode: u < 1 ? 'jump' : 'stand', flap: u < 1, expr: 'happy' }; }
    if (pg) { PEP.set(f, { ...pg, visible: !ex }); } else PEP.set(f, { visible: false });
    PBOX.visible = f >= F.FLEW2 - 4 && !ex; if (PBOX.visible) { const pp = PEP.root.getWorldPosition(new THREE.Vector3()); PBOX.position.set(pp.x, pp.y - 0.12, pp.z); PBOX.rotation.set(0, 0.4, 0); }
    COIN.visible = f >= F.FORTY3 - 4 && f < F.TIP + 20; COIN.position.set(11.4, 1.3 + 0.4 * sm(F.TIP, F.TIP + 12, f), -3.0); COIN.rotation.set(Math.PI / 2, 0, f * 0.3);
    S.extrasFrame(f, EXTRAS, T);
    // ---------- explainer pieces ----------
    const xp = f < 1012; HX.g.visible = ex && (f < 902 || f >= 1012); HX.tail.visible = f >= 1012;
    HX.rotor.rotation.y = -f * 0.5; HX.tailBlades.rotation.z = f * 0.9;
    const bodyTurn = xp ? 1.6 * sm(F.SHOVE - 4, F.OTHER + 10, f) : 1.6 + 0.3 * (1 - sm(F.SIDEWAYS, F.CANCEL + 10, f)) * Math.sin(f * 0.15);
    HX.g.rotation.y = bodyTurn;
    ARC.blade.show(ex && f < 902 ? sm(F.BLADES - 4, F.ONEWAY + 8, f) : 0); ARC.body.show(ex && f < 902 ? sm(F.SHOVE - 2, F.OTHER + 14, f) : 0);
    ARC.side.show(f >= 1012 && ex ? sm(F.PUSHES - 2, F.SIDEWAYS + 10, f) : 0);
    ARC.arms.show(ex && f >= 902 && f < 1012 ? sm(F.SWING - 2, F.RIGHT + 8, f) : 0); ARC.chair.show(ex && f >= 902 && f < 1012 ? sm(F.TURNS - 2, F.LEFT + 8, f) : 0);
    const tipAt = (m, on, p, dir) => { m.visible = on; if (!on) return; m.position.set(...p); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir).normalize()); };
    tipAt(ARC.hb, ex && f < 902 && f > F.ONEWAY + 6, [EX[0] + Math.cos(-4.4) * 3.2, 4.2, EX[2] + Math.sin(-4.4) * 3.2], [-Math.sin(-4.4) * -1, 0, Math.cos(-4.4) * -1]);
    tipAt(ARC.hbody, ex && f < 902 && f > F.OTHER + 12, [EX[0] + Math.cos(7.9) * 2.6, 1.0, EX[2] + Math.sin(7.9) * 2.6], [-Math.sin(7.9), 0, Math.cos(7.9)]);
    tipAt(ARC.hside, ex && f >= 1012 && f > F.SIDEWAYS + 8, [TAIL[0], TAIL[1], 2.75], [0, 0, 1]);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.3) => [[x, y, z], [x, y + h, z]];
    const HB = () => [W(2.0, 0, -1.2), W(-5.3, 3.2, 1.2), W(2.0, 3.2, 1.2), W(-5.3, 0, -1.2)];
    const salW = SAL.root.getWorldPosition(new THREE.Vector3());
    if (sh(0, 56)) {                          // 1. hook: Sal sawing off the tail propeller, sparks, Pepper on the skid (behind-quarter, heli in depth)
      cam = K.fit([W(-5.4, 0, 0), W(-5.4, 2.9, 0), ...body(sp.x, sp.z, 0.6), W(0.2, 2.9, 0), W(-0.6, 0.1, 0.95)], { yaw: 138, pitch: 10, fov: 42, margin: 0.78, maxDist: 9 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(56, 114)) {                 // 2. it drops off; forty bucks (whole copter + Sal)
      cam = K.fit([...HB(), ...body(sp.x, sp.z, 0.6)], { yaw: 162, pitch: 14, fov: 42, margin: 0.78, maxDist: 11 }); cam.fov *= K.punch(f, F.FORTY, 0.1, 6);
    } else if (sh(114, 162)) {                // 3. loading: Gina carries boxes to the door, Sal points (wide)
      cam = K.fit([W(-2, 0, 0), W(1.5, 3.2, 0), ...body(HP[0] + 2, HP[2] + 2.6), ...body(HP[0] + 3.8, HP[2] + 3.0), [HP[0] + 4.2, 1.7, HP[2] + 3.4]], { yaw: 105, pitch: 12, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(162, 213)) {                // 4. three hundred pizzas (high wide: pad, cart, copter)
      cam = K.fit([...HB(), [HP[0] + 4.2, 1.7, HP[2] + 3.4], ...body(sp.x, sp.z)], { yaw: 128, pitch: 26, fov: 44, margin: 0.8, maxDist: 13 }); cam.fov *= K.punch(f, F.HUNDRED, 0.06, 6);
    } else if (sh(213, 262)) {                // 5. "Cut the fat!" (Sal throws the propeller toward SCRAP)
      cam = K.fit([...body(sp.x, sp.z), [HP[0] - 3.5, 1.0, HP[2] + 5.6], [HP[0] - 3.5, 0, HP[2] + 5.6]], { yaw: 105, pitch: 8, fov: 40, margin: 0.9, maxDist: 7 }); cam.fov *= K.push(u, 0.06); dof = { focus: 5, cinf: 8 };
    } else if (sh(262, 318)) {                // 6. Pepper, who hates flying, buckles up (at the door)
      const d = W(DOOR[0], 1.75, DOOR[2]); cam = { pos: [d[0] + 1.2, d[1] + 0.9, d[2] + 3.8], look: [d[0], d[1] + 0.05, d[2] - 0.2], fov: 34 * K.push(u, 0.06) }; dof = { focus: 4.0, cinf: 12 };
    } else if (sh(318, 365)) {                // 7. Gina lifts off (low wide, dust)
      cam = K.fit([...HB(), [hp[0], 0, hp[2]], ...body(sp.x, sp.z)], { yaw: 140, pitch: 4, fov: 44, margin: 0.75, maxDist: 10 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(365, 411)) {                // 8. then it went around (wide, Sal below)
      cam = K.fit([...HB(), ...body(sp.x, sp.z)], { yaw: 112, pitch: 12, fov: 44, margin: 0.88, maxDist: 12 }); cam.fov *= K.punch(f, F.AROUND, 0.08, 6);
    } else if (sh(411, 480)) {                // 9. like a salad spinner (high orbit, counter-rotating)
      cam = K.fit([...HB(), [hp[0], 0, hp[2]]], { yaw: 150 - 45 * u, pitch: 30, fov: 46, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.SALAD, 0.08, 6);
    } else if (sh(480, 534)) {                // 10. pizzas fly out like frisbees (wide: copter, limo, mayor)
      cam = K.fit([...HB(), [LIMO[0] - 3, 0, LIMO[2]], [LIMO[0] + 3, 1.6, LIMO[2]], ...body(mp.x, mp.z)], { yaw: 100, pitch: 10, fov: 46, margin: 0.8, maxDist: 15 }); cam.fov *= K.punch(f, F.FRISBEES, 0.06, 6);
    } else if (sh(534, 592)) {                // 11. onto the mayor's limo (full shot: limo stack + mayor + party behind)
      cam = K.fit([[LIMO[0] - 3.6, 0, LIMO[2] - 1], [LIMO[0] + 3.6, 1.9, LIMO[2] + 1], ...body(mp.x, mp.z)], { yaw: 70, pitch: 18, fov: 42, margin: 0.8, maxDist: 11 }); cam.fov *= K.punch(f, F.LIMO, 0.1, 6);
    } else if (sh(592, 636)) {                // 12. Sal runs and grabs the tail (wide)
      cam = K.fit([...HB(), [salW.x, 0, salW.z], [salW.x, 2.3, salW.z]], { yaw: 118, pitch: 8, fov: 46, margin: 0.8, maxDist: 13 }); cam.fov *= K.punch(f, F.GRABBED, 0.08, 6);
    } else if (sh(636, 690)) {                // 13. now Sal was spinning too (low wide, tetherball)
      const tw = W(TAIL[0], TAIL[1] + 0.4, 0); cam = K.fit([tw, [salW.x, salW.y, salW.z], [hp[0], hp[1] + 3.2, hp[2]], [hp[0], 0, hp[2]]], { yaw: 100, pitch: 10, fov: 46, margin: 1.0, maxDist: 12 }); cam.mb = 0.2; cam.fov *= K.punch(f, F.SPINNING, 0.1, 6); const s = K.shake(f, F.SPINNING, 0.06, 18); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(690, 734)) {                // 14. Gina + Pepper dizzy in the cockpit (reaction)
      const hw = SAL.root.localToWorld(new THREE.Vector3(0, 1.0, 0)); cam = { pos: [hp[0] + 2, 6.5, hp[2] + 11], look: [hw.x * 0.5 + hp[0] * 0.5, 2.0, hw.z * 0.5 + hp[2] * 0.5], fov: 50, mb: 0.25 }; dof = { focus: 11, cinf: 4 };
    } else if (sh(734, 776)) {                // 15. how can one tiny propeller... (big high wide: copter, limo, party)
      cam = K.fit([...HB(), [12, 3, -7.6], [LIMO[0], 0, LIMO[2]]], { yaw: 105, pitch: 22, fov: 46, margin: 0.8, maxDist: 16 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(776, 840)) {                // 16. explainer: blades go one way (wide holo)
      cam = K.fit([[EX[0] - 5.3, 0, EX[2] - 3.4], [EX[0] + 3.4, 4.4, EX[2] + 3.4]], { yaw: 70 + 15 * u, pitch: 22, fov: 42, margin: 0.8, maxDist: 12 }); cam.fov *= K.punch(f, F.BLADES, 0.06, 6);
    } else if (sh(840, 902)) {                // 17. ... they shove the helicopter the other way (top-down-ish)
      cam = K.fit([[EX[0] - 5.3, 0, EX[2] - 3.4], [EX[0] + 3.4, 4.4, EX[2] + 3.4]], { yaw: 130 - 10 * u, pitch: 48, fov: 42, margin: 0.8, maxDist: 12 }); cam.fov *= K.punch(f, F.OTHER, 0.1, 6);
    } else if (sh(902, 956)) {                // 18. office chair: swing your arms right (full shot)
      cam = K.fit([[CH[0] - 0.7, 0, CH[2] - 0.6], [CH[0] + 0.7, 2.2, CH[2] + 0.6]], { yaw: 90 + 10 * u, pitch: 10, fov: 40, margin: 0.85, maxDist: 7 }); cam.fov *= K.punch(f, F.RIGHT, 0.06, 6);
    } else if (sh(956, 1012)) {               // 19. ... the chair turns left (higher, from the other side)
      cam = K.fit([[CH[0] - 0.7, 0, CH[2] - 0.6], [CH[0] + 0.7, 2.2, CH[2] + 0.6]], { yaw: 55 - 8 * u, pitch: 24, fov: 40, margin: 0.85, maxDist: 7 }); cam.fov *= K.punch(f, F.LEFT, 0.1, 6);
    } else if (sh(1012, 1070)) {              // 20. the tail propeller pushes sideways (side wide on the holo tail)
      cam = K.fit([[EX[0] - 5.4, 0, EX[2] - 2], [EX[0] + 2, 3.4, EX[2] + 3]], { yaw: 60 + 10 * u, pitch: 14, fov: 42, margin: 0.8, maxDist: 12 }); cam.fov *= K.punch(f, F.SIDEWAYS, 0.08, 6);
    } else if (sh(1070, 1124)) {              // 21. ... to cancel the spin (high)
      cam = K.fit([[EX[0] - 5.4, 0, EX[2] - 3.4], [EX[0] + 3.4, 4.4, EX[2] + 3.4]], { yaw: 100 + 12 * u, pitch: 38, fov: 42, margin: 0.78, maxDist: 12 }); cam.fov *= K.punch(f, F.CANCEL, 0.08, 6);
    } else if (sh(1124, 1172)) {              // 22. Sal, dizzy, tapes it back on (wide on the copter parked in the street)
      cam = K.fit([...HB(), ...body(sp.x, sp.z), ...body(LND[0] + 2.6, LND[2] + 2.8)], { yaw: 122, pitch: 10, fov: 42, margin: 0.8, maxDist: 12 }); cam.fov *= K.punch(f, F.DIZZY, 0.06, 6);
    } else if (sh(1172, 1206)) {              // 23. "Cut the fat," he whispered (Sal close)
      cam = { pos: [sp.x + 0.7, 1.7, sp.z + 2.8], look: [sp.x, 1.35, sp.z], fov: 42 * K.push(u, 0.05) }; dof = { focus: 2.9, cinf: 11 };
    } else if (sh(1206, 1262)) {              // 24. Pepper flies the last pizza over (wide toward the party)
      const pp = PEP.root.position; cam = K.fit([[pp.x - 1.4, pp.y - 1.2, pp.z], [pp.x + 1.4, pp.y + 0.8, pp.z]], { yaw: 85, pitch: 22, fov: 40, margin: 0.9, maxDist: 6.5 }); dof = { focus: 5.5, cinf: 6 };
    } else {                                  // 25. forty bucks, plus tip (wide: party, mayor, Pepper, copter, Sal)
      cam = K.fit([...body(mp.x, mp.z), [11.0, 0, -2.9], ...body(sp.x, sp.z), [12, 3.2, -7.6]], { yaw: lerp(78, 88, u), pitch: 8, fov: 42, margin: 0.8, maxDist: 10 }); cam.fov *= K.punch(f, F.TIP, 0.08, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f < F.OFF + 4) K.sparks(f, 0, F.OFF + 4, () => W(TAIL[0], TAIL[1] - 0.05, TAIL[2] + 0.15), { dir: [0, 0.6, 1], spread: 1.2, rate: 40, speed: 3.5, life: 12, color: '#ffd08a', seed: 3 });
    if (f >= F.OFF + 10 && f < F.OFF + 16) K.puff(f, F.OFF + 10, HP[0] - 4.75, HP[2] + 0.8, 6, 0.4);
    if (f >= F.LIFTED && f < 420 && f % 3 === 0) K.puff(f, f, HP[0] + 3 * Math.cos(f), HP[2] + 3 * Math.sin(f), 4, 1.0, '#c8c0b0');
    if (f >= F.GRABBED - 30 && f < 776 && f % 4 === 0) K.puff(f, f, hp[0] + 4 * Math.cos(f * 0.7), hp[2] + 4 * Math.sin(f * 0.7), 4, 0.9, '#c8c0b0');
    if (f >= 1124 && f < 1180 && f % 5 === 0) K.puff(f, f, LND[0] + 3 * Math.cos(f), LND[2] + 3 * Math.sin(f), 3, 0.8, '#c8c0b0');
    if (!ex && f >= 318 && f < 776) K.steam(f, () => W(-1.25, 2.3, 0.35), { rate: 3, size: 0.3, rise: 0.8, drift: [-0.3, 0.1], dark: 0.4 });
    K.leaves(f, cam.look, { area: 12, count: 10, fall: 0.4, colors: ['#4f9a3a', '#6ab84a', '#f2c12e'] });
    K.mist(f, 768, 16); K.mist(f, 1116, 16);
    K.badge(f, F.FORTY, '$40 SAVED', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 112 });
    K.badge(f, F.HUNDRED, '300 PIZZAS', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 210 });
    K.badge(f, F.CUT, 'CUT THE FAT!', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 258 });
    K.badge(f, F.BUCKLED, 'HATES FLYING', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 316 });
    if (f >= F.AROUND && f < 772) K.badge(f, F.AROUND, 'SPINS: ' + Math.floor(psi / 6.283 + 1), { sx: 0.5, sy: 0.14 }, { icon: 'warn', f1: 770 });
    K.badge(f, F.FORTY2, '40 PIZZAS OVERBOARD', { sx: 0.5, sy: 0.24 }, { icon: 'x', f1: F.LIMO - 2 });
    K.badge(f, F.LIMO, "MAYOR'S LIMO", { sx: 0.5, sy: 0.24 }, { icon: 'warn', f1: 588 });
    K.badge(f, F.SPINNING, 'SAL: SPINNING TOO', { sx: 0.5, sy: 0.24 }, { icon: 'x', f1: 686 });
    K.badge(f, F.BLADES, 'BLADES THIS WAY', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: F.SHOVE - 2 });
    K.badge(f, F.OTHER, 'BODY THAT WAY', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 898 });
    K.badge(f, F.RIGHT, 'ARMS: RIGHT', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: F.TURNS - 2 });
    K.badge(f, F.LEFT, 'CHAIR: LEFT', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 1008 });
    K.badge(f, F.SIDEWAYS, 'TAIL PUSHES SIDEWAYS', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: F.CANCEL - 2 });
    K.badge(f, F.CANCEL, 'SPIN: CANCELLED', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 1120 });
    K.badge(f, F.TIP, '+ TIP', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 1348 });
    const L = K.light('golden', { az: 120, el: 34, shadowExt: 26, exposure: 1.25 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
