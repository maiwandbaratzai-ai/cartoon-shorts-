// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Demo of the 2026-11-21 pro look (reference study): an invented fable that explains a real "why".
// Glossy hero props (K.paint/K.gold/K.chrome + K.rbox bevels) with reflections, motion blur, steam, sparks, rain,
// falling leaves, x-ray hologram + self-drawing glow line, pop-in badges, a progress HUD and a white mist wipe.
import { TOTAL, LINES, wf } from './demo2_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const S = 1.3;                                    // tractor scale (local units -> metres)
const roadY = (x) => (x < 2 ? 0 : (x - 2) * 0.16);
const slope = (x) => (x < 2 ? 0 : Math.atan(0.16));
let GUS, RUSTY, TG, TR, HOLO, TRACE;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ---- positions are pure functions of the frame (motion blur and particles evaluate other frames) ----
const RAIN0 = 161;                               // the mist wipe peaks here: sunny -> rain
const gusX = (f) => (f < 165 ? 0 : 0 + Math.min(f - 165, 200) * 0.042);
const rustyX = (f) => (f < 89 ? -16 : f < 150 ? lerp(-16, 0, sm(89, 150, f)) : f < 165 ? 0 : Math.min(4.1, (f - 165) * 0.09) - (f > 215 ? 0.08 * Math.sin((f - 215) * 0.6) * 0.3 : 0));
const LANE = { gus: -1.5, rusty: 1.5 };
// a point on a tractor (local units) -> world, given its x on the road
const onTractor = (x, z, lx, ly, lz) => { const p = slope(x), c = Math.cos(p), s = Math.sin(p);
  return [x + (lx * c - ly * s) * S, roadY(x) + (lx * s + ly * c) * S, z + lz * S]; };

function tractor(K, o) {
  const { THREE } = K, g = K.group(), R = o.rear, rf = 0.3, hb = Math.max(rf, 0.32) + 0.12;
  const paint = K.paint(o.color), trim = K.gold(), chrome = K.chrome(), black = K.paint('#1b1b1f', { rough: 0.3 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#202024', roughness: 0.85 });
  K.rbox(1.5, 0.22, 0.62, 0.07, paint, 0.1, hb, 0, g);                          // chassis
  K.rbox(0.86, 0.46, 0.56, 0.13, paint, 0.42, hb + 0.33, 0, g);                 // hood
  K.rbox(0.05, 0.36, 0.44, 0.02, trim, 0.86, hb + 0.33, 0, g);                  // gold grille
  for (let i = 0; i < 5; i++) K.rbox(0.03, 0.3, 0.012, 0.005, black, 0.885, hb + 0.33, -0.16 + i * 0.08, g);
  for (const z of [-0.285, 0.285]) K.rbox(0.8, 0.025, 0.012, 0.006, trim, 0.42, hb + 0.5, z, g);   // gold pinstripes
  K.rbox(0.36, 0.08, 0.42, 0.035, K.paint('#4a2a1a', { rough: 0.55, coat: 0.3 }), -0.32, hb + 0.2, 0, g);  // leather seat
  K.rbox(0.07, 0.36, 0.42, 0.03, K.paint('#4a2a1a', { rough: 0.55, coat: 0.3 }), -0.52, hb + 0.4, 0, g);
  const chim = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.55, 24), black); chim.position.set(0.62, hb + 0.82, 0.12); g.add(chim);
  for (const y of [0.6, 1.05]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.016, 10, 28), trim); r.rotation.x = Math.PI / 2; r.position.set(0.62, hb + y, 0.12); g.add(r); }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.06, 0.08, 24), trim); cap.position.set(0.62, hb + 1.12, 0.12); g.add(cap);
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 12, 0, Math.PI * 2, 0, 1.9), trim); bell.position.set(0.25, hb + 0.62, -0.15); g.add(bell);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.45, 10), chrome); col.position.set(-0.06, hb + 0.42, 0); col.rotation.z = 0.45; g.add(col);
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 10, 30), black); sw.position.set(-0.16, hb + 0.62, 0); sw.rotation.set(0, Math.PI / 2, 0.45); sw.rotateX(0); g.add(sw);
  for (const z of [-0.2, 0.2]) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 14), K.glass({ color: '#fff4c8', opacity: 0.6 })); l.position.set(0.88, hb + 0.5, z); g.add(l);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2b0').multiplyScalar(2.5) })); bulb.position.copy(l.position); bulb.userData.ndSkip = true; g.add(bulb);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 24), trim); rim.rotation.y = Math.PI / 2; rim.position.set(0.9, hb + 0.5, z); g.add(rim); }
  const wheel = (r, x, z, lugs) => { const w = new THREE.Group(); w.position.set(x, r, z); g.add(w);
    const tyre = new THREE.Mesh(new THREE.TorusGeometry(r - 0.08 * (r / 0.5), 0.085 * (r / 0.5), 14, 48), rubber); w.add(tyre);
    for (let i = 0; i < lugs; i++) { const a = i / lugs * Math.PI * 2, lug = new THREE.Mesh(new THREE.BoxGeometry(0.045 * (r / 0.5), 0.05 * (r / 0.5), 0.15 * (r / 0.5)), rubber);
      lug.position.set(Math.cos(a) * r * 0.985, Math.sin(a) * r * 0.985, (i % 2 ? 0.02 : -0.02)); lug.rotation.set(0, 0, a); w.add(lug); }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.72, 0.05, 40), K.paint(o.rim || '#f2ece0')); disc.rotation.x = Math.PI / 2; w.add(disc);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.72, 0.018 * (r / 0.5) + 0.01, 10, 48), trim); w.add(ring);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, b = K.rbox(r * 0.12, r * 0.12, 0.07, 0.02, trim, Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.48, 0, w); b.rotation.z = a; }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.16, r * 0.18, 0.14, 24), trim); hub.rotation.x = Math.PI / 2; w.add(hub);
    return w; };
  const wr = [wheel(R, -0.35, 0.44, 22), wheel(R, -0.35, -0.44, 22)], wf_ = [wheel(rf, 0.68, 0.34, 12), wheel(rf, 0.68, -0.34, 12)];
  for (const z of [0.44, -0.44]) { const fe = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.07, R + 0.07, 0.24, 40, 1, true, -Math.PI / 2 - 1.1, 2.2), paint); fe.rotation.x = Math.PI / 2; fe.rotation.z = 0; fe.position.set(-0.35, R, z); fe.material.side = THREE.DoubleSide; g.add(fe); }
  g.scale.setScalar(S);
  return { g, wr, wf: wf_, R, seatY: hb + 0.24 };
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    const { THREE } = K;
    // ground: farm fields and an autumn road that climbs a hill
    const road = new THREE.PlaneGeometry(70, 7.5, 140, 6); road.rotateX(-Math.PI / 2);
    const P = road.attributes.position; for (let i = 0; i < P.count; i++) P.setY(i, roadY(P.getX(i) + 15) + 0.02); road.translate(15, 0, 0);
    for (let i = 0; i < P.count; i++) P.setY(i, roadY(P.getX(i)) + 0.02); road.computeVertexNormals();
    K.add(road, K.mat('rock', '#8a7a68', { detail: 2.4 }));
    const grass = new THREE.PlaneGeometry(140, 120, 140, 60); grass.rotateX(-Math.PI / 2);
    const G = grass.attributes.position; for (let i = 0; i < G.count; i++) { const x = G.getX(i), z = G.getZ(i); G.setY(i, roadY(x) * (1 - Math.min(1, Math.abs(z) / 40)) - 0.03 + 0.4 * Math.sin(x * 0.2 + z * 0.13) * Math.min(1, Math.abs(z) / 12)); }
    grass.computeVertexNormals(); K.add(grass, K.mat('grime', '#7a9a3a', { amt: 0.7 }));
    K.leafLitter(-30, 40, -12, 12, 1400, 0.03);
    // autumn trees and fence posts along the road
    const trunkM = K.mat('wood', '#5a3a24'), leafCols = ['#e0482a', '#f08a24', '#f2c12e', '#c8381c'].map((c) => K.mat('grime', c, { amt: 0.35 }));
    for (let i = 0; i < 46; i++) { const side = i % 2 ? 1 : -1, x = -28 + i * 1.6 + (i % 3) * 0.4, z = side * (5.5 + (i * 7 % 5) * 1.6), y = roadY(x) * 0.8;
      K.cyl(0.12, 0.16, 1.8, trunkM, x, y, z);
      for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.9 - k * 0.12, 20, 14), leafCols[(i + k) % 4]);
        m.position.set(x + Math.cos(k * 2.1 + i) * 0.5, y + 2.1 + k * 0.35, z + Math.sin(k * 2.1 + i) * 0.5); m.castShadow = true; K.scene.add(m); } }
    for (let x = -24; x < 34; x += 1.4) for (const z of [-3.9, 3.9]) { K.cyl(0.05, 0.05, 0.9, trunkM, x, roadY(x), z); K.slab(x - 0.7, x + 0.7, roadY(x) + 0.62, roadY(x) + 0.7, z - 0.03, z + 0.03, trunkM); }
    // red barn in the distance
    K.slab(-22, -14, 0, 5, -26, -18, K.mat('brick', '#b03a2e', { detail: 1.4 })); K.slab(-22.3, -13.7, 5, 5.3, -26.3, -17.7, K.mat('wood', '#f2ece0'));
    K.addClouds(10, 700, 160);
    TG = tractor(K, { color: '#d8322a', rear: 0.78, rim: '#f4ead8' });          // Gus: tiny red tractor, giant wheels
    TR = tractor(K, { color: '#2a62c8', rear: 0.4, rim: '#f4ead8' });         // Rusty: big-headed blue tractor, small wheels
    GUS = K.stick({ jacket: '#3a7a4a', pants: '#2c3e5a', hat: 'cap', cap: '#f2c230', vest: '#8a5a34', scarf: '#c0392b', hairStyle: 'short', hair: '#5a3a24' }, { key: 'gus' });
    RUSTY = K.stick({ jacket: '#e8e0d0', pants: '#4a3a2a', hat: 'cowboy', moustache: '#3a2a1a', bowtie: '#c0392b', belt: '#3a2418', vest: '#2a62c8' }, { key: 'rusty' });
    HOLO = K.holoBox(1.0, 0.36, 0.42, -0.35, 0.16, -0.44, TG.g);  // x-ray around the giant tyre's contact patch
    TRACE = K.trace([[-0.75, 0.01, -0.62], [-0.35, 0.01, -0.62], [0.05, 0.01, -0.62]], { parent: TG.g, color: '#fff3b0', r: 0.02 });
  },
  frame(f, K) {
    const T = K.T, L = LINES;
    const GIANT = wf(0, 'giant'), LAUGH = wf(1, 'laughed'), FER = wf(1, 'ferris'), RAIN = wf(2, 'rain'), SPUN = wf(2, 'spun'), SPARK = wf(2, 'spitting'), GRIP = wf(3, 'grip'), PAST = wf(4, 'past'), WON = wf(4, 'won');
    const wet = f >= RAIN0;
    // tractors on the road
    const place = (t, x, z, spin) => { t.g.position.set(x, roadY(x), z); t.g.rotation.set(0, 0, slope(x)); for (const w of t.wr) w.rotation.z = spin; for (const w of t.wf) w.rotation.z = spin * t.R / 0.3; };
    const gx = gusX(f), rx_ = rustyX(f);
    place(TG, gx, LANE.gus, -gx / (TG.R * S) - (f < 89 ? 0 : 0));
    const stuck = f > 196, rspin = -rx_ / (TR.R * S) - (stuck ? (f - 196) * 0.55 : 0);   // stuck: wheels spin in place
    place(TR, rx_, LANE.rusty, rspin);
    // characters: Gus bolts the wheel (frame 0 strange action), then drives; Rusty laughs, then begs
    const seat = (t, x, z) => onTractor(x, z, -0.32, t.seatY, 0);
    if (f < 44) {
      const A = T.act(f, [[0, 'hammer', { expr: 'deadpan' }], [GIANT, 'hammer', { expr: 'deadpan' }], [60, 'hips', { expr: 'smug' }]], { seed: 2, blink: blinkAt(f, 2) });
      GUS.set(A, { x: -1.15, z: LANE.gus - 1.2, yaw: 1.25, y: 0 });
    } else {
      const sp = seat(TG, gx, LANE.gus);
      const keys = [[44, 'sit', { expr: 'deadpan', L: [0.12, 0.25, 'fist', true], R: [0.12, 0.25, 'fist', true] }], [GRIP - 2, 'sit', { expr: 'deadpan', look: 0.4, L: [0.12, 0.25, 'fist', true], R: [0.12, 0.25, 'fist', true] }],
        [PAST, 'sit', { expr: 'smug', L: [0.12, 0.25, 'fist', true], R: [0.42, -0.55, 'open'] }], [WON, 'sit', { expr: 'smile', L: [0.12, 0.25, 'fist', true], R: [0.42, -0.55, 'open'] }]];
      GUS.set(T.act(f, keys, { seed: 2, blink: blinkAt(f, 2) }), { x: sp[0], y: sp[1] - 0.49, z: sp[2], yaw: Math.PI / 2, seat: 0.45 });
    }
    { const sp = seat(TR, rx_, LANE.rusty), drive = { L: [0.12, 0.25, 'fist', true], R: [0.12, 0.25, 'fist', true] };
      const keys = [[0, 'sit', { expr: 'smug', ...drive }], [LAUGH, 'sit', { expr: 'gloat', talk: true, L: [0.12, 0.25, 'fist', true], R: [0.35, -0.5, 'point'] }], [FER + 8, 'sit', { expr: 'gloat', ...drive }],
        [SPUN, 'sit', { expr: 'nervous', ...drive, shake: 1 }], [SPARK + 6, 'sit', { expr: 'scared', sweat: true, ...drive, shake: 1 }], [PAST, 'sit', { expr: 'beg', sweat: true, L: [0.3, -0.6, 'open'], R: [0.3, -0.6, 'open'] }]];
      RUSTY.set(T.act(f, keys, { seed: 5, blink: blinkAt(f, 5) }), { x: sp[0], y: sp[1] - 0.49, z: sp[2], yaw: Math.PI / 2, seat: 0.45 }); }
    // steam from both chimneys (Rusty chuffs hard when he is stuck)
    K.steam(f, (s) => onTractor(gusX(s), LANE.gus, 0.62, 1.2 + 0.32, 0.12), { rate: 7, size: 0.9, rise: 2.2, drift: [-0.8, 0.1], seed: 1 });
    K.steam(f, (s) => onTractor(rustyX(s), LANE.rusty, 0.62, 1.2 + 0.32, 0.12), { rate: f > 196 ? 14 : 7, size: f > 196 ? 1.3 : 0.9, rise: 2.4, drift: [-0.8, 0.1], dark: 0.15, seed: 2 });
    // sparks where Rusty's spinning tyre grinds the wet cobbles
    K.sparks(f, 196, 300, (s) => onTractor(rustyX(s), LANE.rusty, -0.35 - TR.R * 0.6, 0.02, 0.5), { dir: [-1, 0.9, 0.15], spread: 0.6, rate: 10, speed: 5, life: 11, seed: 4 });
    K.sparks(f, 196, 300, (s) => onTractor(rustyX(s), LANE.rusty, -0.35 - TR.R * 0.6, 0.02, -0.44), { dir: [-1, 0.9, -0.15], spread: 0.6, rate: 10, speed: 5, life: 11, seed: 7 });
    // x-ray + glow line under Gus's giant tyre on "grip"
    const hv = sm(GRIP - 8, GRIP + 4, f) * (1 - sm(L[3][1] + 4, L[3][1] + 10, f)); HOLO.visible = hv > 0.01; HOLO.scale.set(1, Math.max(0.01, hv), 1);
    TRACE.show(sm(GRIP - 4, GRIP + 14, f) * (f < L[3][1] + 10 ? 1 : 0));

    // ---- shots: a new moving shot every ~1.5-3 s, never reused ----
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const wheelG = onTractor(0, LANE.gus, -0.35, TG.R, -0.44), wheelR = (x) => onTractor(x, LANE.rusty, -0.35, TR.R, 0.44);
    // camAround(target, yaw, pitch, dist): yaw 0 = camera in front of the tractors (+x), 90 = from the +z side, -90 = from the -z side
    const camAround = (t, yaw, pitch, dist, fov, roll = 0) => { const a = yaw * Math.PI / 180, p = pitch * Math.PI / 180;
      return { pos: [t[0] + Math.cos(a) * Math.cos(p) * dist, t[1] + Math.sin(p) * dist, t[2] + Math.sin(a) * Math.cos(p) * dist], look: t, fov, roll }; };
    const head = (which, g) => which === 'gus' ? onTractor(gusX(g), LANE.gus, -0.3, TG.seatY + 0.75, 0) : onTractor(rustyX(g), LANE.rusty, -0.3, TR.seatY + 0.75, 0);
    if (sh(0, 44)) {                 // 1. frame 0: Gus hammering a giant wheel onto a tiny tractor (push-in)
      cam = camAround([-0.8, 1.3, LANE.gus - 1.0], lerp(-32, -26, u), 6, 3.4, 44 * K.push(u, 0.1)); dof = { focus: 3.2, cinf: 9 };
    } else if (sh(44, 89)) {         // 2. reveal: the whole tractor, wheels taller than Gus (slow orbit)
      cam = camAround([0.2, 1.0, LANE.gus], lerp(-12, -30, u), 16, 5.6, 42); dof = { focus: 5.6, cinf: 5 };
    } else if (sh(89, 124)) {        // 3. Rusty rolls up, laughing (tracking, front quarter, above the chimney line)
      const tc = K.track(f, (g) => head('rusty', g), { off: [2.2, 0.7, 2.9], lag: 2, lead: 0, lookY: -0.15 }); cam = { ...tc, fov: 40 }; dof = { focus: 3.7, cinf: 10 };
    } else if (sh(124, 152)) {       // 4. close-up: Rusty points and laughs at the giant wheels
      cam = camAround(head('rusty', f), lerp(38, 32, u), 8, 2.3, 38 * K.push(u, 0.1)); dof = { focus: 2.3, cinf: 15 };
    } else if (sh(152, 196)) {       // 5. the race starts in the rain: low head-on telephoto, both tractors
      cam = { pos: [lerp(10.5, 9.5, u), 2.1 + roadY(10), 0.1], look: [lerp(1.2, 2.4, u), 1.5, 0], fov: 34 }; dof = { focus: 8, cinf: 5 };
    } else if (sh(196, 218)) {       // 6a. Rusty's wheel spins and sprays sparks at the camera (low, rear quarter, shake)
      const w = onTractor(rustyX(f), LANE.rusty, -0.35, TR.R, 0.44); const [sx, sy] = K.shake(f, SPUN, 0.03, 30);
      const c = camAround([w[0] - 0.2, w[1] - 0.1, w[2]], 145, 4, 2.4, 46); c.pos[0] += sx; c.pos[1] += sy; cam = c; dof = { focus: 2.3, cinf: 10 };
    } else if (sh(218, 238)) {       // 6b. Rusty sweating, wheels screaming (close, punch-in on "spitting sparks")
      const [sx, sy] = K.shake(f, SPUN, 0.02, 40); const c = camAround(head('rusty', f), 35, 6, 2.2, 38 * K.punch(f, SPARK, 0.18, 7)); c.pos[0] += sx; c.pos[1] += sy; cam = c; dof = { focus: 2.2, cinf: 14 };
    } else if (sh(238, 270)) {       // 7. x-ray: the giant tyre's long contact patch = grip (slow push, low)
      const w = onTractor(gusX(f), LANE.gus, -0.35, 0.1, -0.44); cam = camAround([w[0] + 0.1, w[1] + 0.45, w[2]], -18, 10, lerp(3.1, 2.6, u), 44); dof = { focus: 2.8, cinf: 9 };
    } else if (sh(270, 312)) {       // 8. Gus rolls past stuck Rusty (tracking from between the lanes, front quarter)
      const tc = K.track(f, (g) => head('gus', g), { off: [2.8, 1.3, 1.5], lag: 3, lead: 0, lookY: -0.35 }); cam = { ...tc, fov: 46 }; dof = { focus: 3.4, cinf: 7 };
    } else {                         // 9. Gus: deadpan, tiny smile — the Ferris wheel won (close, front quarter)
      cam = camAround(head('gus', f), lerp(28, 22, u), 10, 2.1, 38 * K.push(u, 0.08)); dof = { focus: 2.1, cinf: 15 };
    }
    // weather + graphics
    K.mist(f, 150, 22);
    if (wet) { K.rain(f, cam.look, { area: 12, count: 700, speed: 12 }); K.leaves(f, cam.look, { area: 9, count: 50, fall: 0.8, wind: [-0.9, 0.2] }); }
    else K.leaves(f, cam.look, { area: 9, count: 25, fall: 0.5 });
    K.badge(f, GIANT, '2 M WHEELS', [-0.46, 2.45, LANE.gus - 0.8], { icon: 'up', f1: 44 });
    K.badge(f, FER, 'FERRIS WHEEL?', { sx: 0.5, sy: 0.24 }, { style: 'stamp', f1: 152, size: 1.5 });
    K.hud(f, 160, { stages: 2, labels: ['DRY', 'WET'], u: clamp(gusX(f) / 8, 0, 1), rival: clamp(rustyX(f) / 8, 0, 1) });
    if (f >= 196 && f < 238) K.badge(f, SPUN + 2, 'GRIP', (g) => { const w = wheelR(rustyX(g)); return [w[0] - 0.3, w[1] + 0.2, w[2]]; }, { icon: 'x', f1: 236 });
    if (f >= 238 && f < 270) K.badge(f, GRIP, 'GRIP', (g) => { const w = onTractor(gusX(g), LANE.gus, -0.35, 0.1, -0.44); return [w[0] + 0.6, w[1] + 0.5, w[2]]; }, { icon: 'check', f1: 268 });
    K.badge(f, WON, 'FERRIS WHEEL WINS', { sx: 0.5, sy: 0.3 }, { style: 'stamp', icon: 'check', size: 1.25 });
    const light = wet
      ? { az: 150, el: 40, sky: '#9aa8b8', ground: '#5a5a48', hemi: 1.15, sun: '#e8eef8', sunI: 1.6, skyTop: '#6a7a90', skyHor: '#c8ccd0', fog: '#b8c0c8', fogNear: 30, fogFar: 170, shadowExt: 14, sat: 1.18, exposure: 1.4, bloom: 0.7 }
      : { az: 140, el: 32, sky: '#cfe4f4', ground: '#7a9a3a', hemi: 1.0, sun: '#ffe6c0', sunI: 3.2, skyTop: '#3f7ad0', skyHor: '#f0dcc0', fog: '#e8dcc8', fogNear: 25, fogFar: 200, shadowExt: 14, sat: 1.16 };
    return { light, cam, dof, actors: [], fx: [] };
  },
};
