// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Detail-density test (reference study 2026-11-21 #2): a dense little town street built only from K.set builders.
// Copy the build() of this file whenever a story happens in a town, street or square.
import { blinkAt, lerp, clamp } from '../motion.js';
export const TOTAL = 180;
const QS_LIGHT = new URLSearchParams(location.search).get('light') || 'golden';
let LIGHT, CARS = [], BIKE, EXTRAS, HERO, GRAN, PROT = [];
export default {
  TOTAL, look: 'rich',
  build(K) {
    const { THREE } = K, S = K.set;
    S.street({ len: 90, width: 7, sidewalk: 4.5, crossings: [0, 24] });
    const grass = K.slab(-80, 80, -0.2, 0, -60, 60, K.mat('grime', '#6aa84f', { amt: 0.6 }), K.scene, false); grass.position.y -= 0.01;
    // two rows of different buildings (front faces the street)
    let x = -44, i = 0;
    while (x < 44) { const w = 5 + (i * 7 % 4); const shop = [3, 6, 9][i % 3] === i % 10 ? null : (i % 4 === 1 ? ['BAKERY', 'CAFE', 'BOOKS', 'FLOWERS'][i % 4 === 1 ? (i / 4 | 0) % 4 : 0] : null);
      const b = S.building({ w, d: 9, floors: 3 + (i % 2), seed: i + 1, shop, shutters: i % 3 === 0 ? '#2a5a3a' : null, flowers: i % 2 === 0, kind: i % 5 === 3 ? 'plaster' : 'brick' }); b.position.set(x + w / 2, 0.15, -8); x += w + 0.05; i++; }
    x = -44; i = 20;
    while (x < 44) { const w = 5 + (i * 5 % 4); const b = S.building({ w, d: 9, floors: 3 + (i % 3 === 0 ? 1 : 0), seed: i + 1, shop: i === 22 ? 'SUPERMARKET' : i % 4 === 0 ? 'CAFE' : null, shutters: i % 4 === 1 ? '#7a2a2a' : null, flowers: true }); b.position.set(x + w / 2, 0.15, 8); b.rotation.y = Math.PI; x += w + 0.05; i++; }
    // street furniture along both sidewalks
    for (let k = -40; k <= 40; k += 8) for (const s of [-1, 1]) { if (Math.abs(k) < 4) continue; const t = S.tree({ h: 4.2, seed: k + s * 7 }); t.position.set(k + (s > 0 ? 4 : 0), 0.15, s * 5.6); }
    for (let k = -30; k <= 36; k += 12) { const l = S.streetLamp(); l.position.set(k, 0.15, -4.1); }
    for (let k = -6; k <= 6; k += 1.5) for (const s of [-1, 1]) if (Math.abs(k) > 2) { const b = S.bollard(); b.position.set(k, 0.15, s * 3.85); }
    LIGHT = S.trafficLight(); LIGHT.g.position.set(-2.2, 0.15, 4.0); LIGHT.g.rotation.y = Math.PI / 2;
    const l2 = S.trafficLight(); l2.g.position.set(2.2, 0.15, -4.0); l2.g.rotation.y = -Math.PI / 2; l2.set('red');
    const sg = [['yield', -3.5, 4.2], ['warn', 3.5, -4.2], ['arrow', 8, 4.2], ['bike', -9, -4.2], ['parking', 14, 4.2]];
    for (const [k, sx, sz] of sg) { const s = S.sign(k); s.position.set(sx, 0.15, sz); s.rotation.y = sz > 0 ? Math.PI : 0; }
    for (const [bx, bz, r] of [[-12, -5.8, 0], [10, 5.8, Math.PI]]) { const b = S.bench(); b.position.set(bx, 0.15, bz); b.rotation.y = r; }
    for (const [px, pz] of [[-6, -6.2], [6, 6.2], [18, -6.2]]) { const p = S.planter(K.scene, px); p.position.set(px, 0.15, pz); }
    for (const [bx, bz] of [[-15, -4.4], [16, 4.4]]) { const b = S.bin(); b.position.set(bx, 0.15, bz); }
    const board = S.board('CRASHES|BEFORE: 8   NOW: 2', 2.6, 1.6); board.position.set(-18, 0.15, -6.4);
    // parked + moving cars, a cyclist, background people, a little protest
    for (const [cx, cz, kind, seed] of [[-24, -2.7, 'hatch', 2], [-19.5, -2.7, 'van', 3], [20, 2.7, 'taxi', 4], [28, 2.7, 'hatch', 5]]) { const c = S.car({ kind, seed }); c.g.position.set(cx, 0, cz); if (cz > 0) c.g.rotation.y = Math.PI; }
    CARS = [S.car({ seed: 7, color: '#2a9ab8' }), S.car({ seed: 8, color: '#f2c230', kind: 'taxi' })];
    BIKE = S.bike({ color: '#c0392b' });
    EXTRAS = S.extras(8, { x0: -16, len: 32, z: -5.4, spread: 1.4, seed: 3 }).concat(S.extras(6, { x0: -14, len: 28, z: 5.4, spread: 1.2, seed: 40 }));
    HERO = K.stick({ jacket: '#2a4a7a', pants: '#2a2a30', hairStyle: 'curly', hair: '#d8d4cc', glasses: true, scarf: '#f08a24', vest: '#f2e2c0', belt: '#3a2418' }, { key: 'hero' });
    GRAN = K.stick({ jacket: '#6a4a9a', pants: '#3a2a4a', hairStyle: 'bun', hair: '#d8d4cc', glasses: true, collar: '#f4efe4', dress: '#5a3a8a', scarf: '#f2e2c0' }, { key: 'gran' });
    for (let k = 0; k < 3; k++) { const p = S.protestSign(['MORE|LIGHTS!', 'SLOW|DOWN!', 'TOO|FAST!'][k], { bg: '#e8d4a8' }); p.position.set(5 + k * 1.1, 0.15, -5.9 + (k % 2) * 0.4); p.rotation.y = -0.2 + k * 0.15; PROT.push(p); }
  },
  frame(f, K) {
    const T = K.T, S = K.set, t = f / 30;
    LIGHT.set(['green', 'amber', 'red'][Math.floor(t / 2) % 3]);
    const cx0 = -30 + t * 6, cx1 = 30 - t * 5;
    CARS[0].g.position.set(cx0, 0, -1.6); CARS[1].g.position.set(cx1, 0, 1.6); CARS[1].g.rotation.y = Math.PI;
    for (const w of CARS[0].wheels) w.rotation.z = -cx0 / 0.36; for (const w of CARS[1].wheels) w.rotation.z = -(30 - cx1) / 0.36;
    const bx = -12 + t * 3.2; BIKE.g.position.set(bx, 0, -2.9); for (const w of BIKE.wheels) w.rotation.z = -bx / 0.34;
    S.extrasFrame(f, EXTRAS, T);
    HERO.set(T.act(f, [[0, 'point', { expr: 'smug' }], [60, 'hips', { expr: 'deadpan' }], [120, 'shrug', { expr: 'smile' }]], { seed: 1, blink: blinkAt(f, 1) }), { x: -1.2, z: -5.0, yaw: 0.4 });
    GRAN.set(T.act(f, [[0, 'shock', { expr: 'shock' }], [50, 'angry', { expr: 'angry' }], [110, 'cross', { expr: 'stern' }]], { seed: 2, blink: blinkAt(f, 2) }), { x: 0.3, z: -5.4, yaw: -0.3 });
    K.leaves(f, [0, 0, -2], { area: 14, count: 20, fall: 0.4, colors: ['#4f9a3a', '#6ab84a', '#f2c12e'] });
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    if (sh(0, 60)) { cam = { pos: [lerp(13, 9, u), 8.5, 5.5], look: [-2, 0.8, -3], fov: 42 }; dof = { focus: 14, cinf: 3 }; }                 // wide: the whole busy street
    else if (sh(60, 120)) { cam = K.fit([[-1.2, 0, -5], [-1.2, 2.1, -5], [0.3, 0, -5.4], [0.3, 2.1, -5.4], [5, 0, -5.9], [7.2, 2.9, -5.5]], { yaw: lerp(78, 70, u), pitch: 6, fov: 40 }); dof = { focus: 7, cinf: 5 }; /* see everything: both characters + the protest */ } // hero + gran, street behind
    else { cam = { pos: [lerp(-8, -6, u), 1.1, 3.2], look: [0, 1.6, -6], fov: 34 }; dof = { focus: 9, cinf: 6 }; }                                   // low across the crossing
    return { light: K.light(QS_LIGHT), cam, dof, actors: [], fx: [] };
  },
};
