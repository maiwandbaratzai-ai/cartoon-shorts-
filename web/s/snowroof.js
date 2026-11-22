// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Every Snow House Has a Steep Roof" — invented fable (SCRIPTS.md §00). Henrik's party-hat roof vs Sven's flat roof + hot tub.
// Snowy mountain village Frostdal: autumn -> mist wipe -> three storms -> Sven's roof sags -> Henrik's roof dumps its snow (whump).
import { TOTAL, LINES, wf } from './snowroof_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
let THREE, HEN, SVEN, GOAT, MEN = [], EXTRAS = [], AUT = [], WIN = [], SV = {}, HN = {}, HOLO, HOLO2, TR1, TR2, HAT_S, HAT_G, LADDER, SLIDEG, PARK = [];
// Henrik's house: walls x -5.3..-1.9, z -2..2, h 2.6; steep roof ridge along z
const HX = -3.6, WH = 2.6, RIDGE = 7.0, EAVE_X = 2.05, OVER = 0.35;
const ANG = Math.atan2(RIDGE - WH, EAVE_X);                 // ~64 deg
// a point on Henrik's +x roof slope, s = 0 (ridge) .. 1 (eave edge incl. overhang)
const slopeP = (s, z, side = 1, up = 0) => { const L = Math.hypot(EAVE_X + OVER, (RIDGE - WH) * (EAVE_X + OVER) / EAVE_X);
  const dx = Math.cos(ANG), dy = Math.sin(ANG); return [HX + side * dx * s * L + side * Math.sin(ANG) * up, RIDGE - dy * s * L + Math.cos(ANG) * up, z]; };
// Sven's house: walls x 2.1..5.5, z -2..2, h 2.7; flat roof top at 2.92
const SX = 3.8, SWH = 2.7, ROOF = 2.92;
let F = {};

function pine(K, g, x, z, h, m, snowM, snowG) {
  K.cyl(0.12, 0.18, h * 0.25, K.mat('wood', '#5a3a24'), x, 0, z, g, 8);
  for (let k = 0; k < 3; k++) { const r = h * (0.32 - k * 0.08), y = h * (0.2 + k * 0.22), c = new THREE.Mesh(new THREE.ConeGeometry(r, h * 0.38, 12), m); c.position.set(x, y + h * 0.19, z); c.castShadow = true; g.add(c);
    const s = new THREE.Mesh(new THREE.ConeGeometry(r * 0.82, h * 0.16, 12), snowM); s.position.set(x, y + h * 0.33, z); snowG.add(s); }
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    const L = LINES;
    F = { SLID: wf(0, 'slid'), TWICE: wf(0, 'twice'), THREE_: wf(1, 'three'), LAUGH: wf(2, 'laughed'), PARTY: wf(2, 'party'), HOT: wf(3, 'hot'), SOAK: wf(3, 'soaked'),
      STORMS: wf(4, 'storms'), ONE: wf(4, 'one'), HALF: wf(4, 'half'), WAVED: wf(4, 'waved'), TWO: wf(5, 'two'), CREAK: wf(5, 'creaked'), GRIN: wf(5, 'grinned'),
      WET: wf(6, 'wet'), FOUR: wf(6, 'four'), SAG: wf(7, 'sagged'), JAM: wf(7, 'jammed'), SLIDE: wf(8, 'slide'), CANT: wf(8, 'can'), NEITHER: wf(9, 'neither'),
      STEEP: wf(9, 'steep'), SLIDES: wf(9, 'slides'), WHUMP: wf(10, 'whump'), DRY: wf(10, 'dry'), CLIMB: wf(11, 'climbed'), BEG: wf(11, 'begged'), HAND: wf(12, 'handed'),
      HAT: wf(12, 'hat'), GOATW: wf(12, 'goat'), ONE2: wf(12, 'one') };
    // ---------- ground ----------
    const gGeo = new THREE.PlaneGeometry(200, 160, 100, 80); gGeo.rotateX(-Math.PI / 2);
    const P = gGeo.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i), far = clamp((Math.abs(z + 4) - 12) / 30, 0, 1); P.setY(i, far * (2 + 1.5 * Math.sin(x * 0.11) + Math.sin(z * 0.2 + x * 0.05))); }
    gGeo.computeVertexNormals();
    const gA = new THREE.Mesh(gGeo, K.mat('grime', '#8a9440', { amt: 0.7 })); gA.receiveShadow = true; sc.add(gA); AUT.push(gA);
    const gW = new THREE.Mesh(gGeo.clone(), K.mat('plaster', '#eaf0f8', { amt: 0.12, detail: 2 })); gW.position.y = 0.025; gW.receiveShadow = true; sc.add(gW); WIN.push(gW);
    const n0 = sc.children.length; K.leafLitter(-14, 14, -6, 7, 900, 0.02); for (const c of sc.children.slice(n0)) AUT.push(c);
    // a stone path to each door + a lane in front
    const stone = K.mat('rock', '#9a8f84', { detail: 0.6 });
    const pathG = K.group();
    for (let i = 0; i < 9; i++) { K.rbox(0.62, 0.06, 0.42, 0.03, stone, HX + (i % 2) * 0.1, 0.03, 2.9 + i * 0.5, pathG); K.rbox(0.6, 0.06, 0.4, 0.03, stone, SX - 0.6 + (i % 2) * 0.1, 0.03, 2.9 + i * 0.5, pathG); }
    S.bake(pathG);
    // ---------- mountains + village behind ----------
    const rockM = K.mat('rock', '#7a86a0', { detail: 6 }), capM = K.mat('plaster', '#f4f8ff', { amt: 0.1 });
    for (const [x, z, r, h] of [[-60, -95, 42, 46], [-10, -110, 50, 60], [45, -95, 40, 44], [90, -120, 55, 58], [-100, -120, 50, 50]]) {
      const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), rockM); m.position.set(x, h / 2 - 2, z); m.rotation.y = x; sc.add(m);
      const c = new THREE.Mesh(new THREE.ConeGeometry(r * 0.42, h * 0.42, 7), capM); c.position.set(x, h - 2 - h * 0.21 + 0.3, z); c.rotation.y = x; sc.add(c); }
    const cols = ['#c8573a', '#e8c46a', '#5a8ac8', '#7ab06a', '#e89a5a', '#b05a8a', '#f2e2c0', '#6a9a9a'];
    let x = -30, i = 0;
    while (x < 30) { const w = 4.4 + (i * 7 % 3); if (Math.abs(x + w / 2) > 1) { const b = S.building({ w, d: 6, floors: 2 + (i % 2), seed: i + 3, color: cols[i % cols.length], kind: i % 3 ? 'plaster' : 'brick', gable: 'pitched', shutters: i % 2 ? '#2a5a3a' : '#7a2a2a', flowers: i % 2 === 0, shop: i === 3 ? 'BAKERY' : i === 6 ? 'SKI SHOP' : null });
      b.position.set(x + w / 2, 0, -14 - (i % 2) * 1.5); } x += w + 1.2; i++; }
    // roof snow on the background houses (winter): white slabs on top
    // pines everywhere (green) + their winter snow caps
    const pineM = K.mat('grime', '#2f5a3a', { amt: 0.4 }), pg = K.group(), psg = K.group();
    for (let k = 0; k < 40; k++) { const px = -40 + k * 2.1 + Math.sin(k * 3.3) * 1.2, pz = -9 - (k % 4) * 2.6 - (Math.abs(px) < 8 ? 0 : 0); pine(K, pg, px, pz, 4 + (k % 3), pineM, capM, psg); }
    for (const [px, pz, h] of [[-8.2, -3.5, 5.5], [-9.6, 1.2, 4.6], [8.4, -3.8, 5.2], [9.8, 0.8, 4.8], [-7.6, 5.4, 3.8], [7.8, 5.8, 4]]) pine(K, pg, px, pz, h, pineM, capM, psg);
    S.bake(pg); S.bake(psg); WIN.push(psg);
    // autumn maples (only before the mist)
    for (const [tx, tz] of [[-10.8, 4.8], [11.5, 2.6], [-12, -4], [12.4, -5]]) { const t = S.tree({ h: 4, seed: tx * 3, colors: ['#e0482a', '#f08a24', '#f2c12e', '#c8381c'] }); t.position.set(tx, 0, tz); AUT.push(t); }
    // ---------- Henrik's house (the hero prop): glossy red walls, gold trim, the party-hat roof ----------
    const H = K.group(); HN.g = H;
    const red = K.paint('#c8402e', { rough: 0.32 }), cream = K.paint('#f4ead8', { rough: 0.35 }), gold = K.gold(), dark = K.paint('#3a2418', { rough: 0.45 }), chrome = K.chrome();
    K.rbox(3.4, WH, 4.0, 0.08, red, HX, WH / 2, 0, H);
    for (const yy of [0.7, 1.3, 1.9]) for (const zz of [2.01]) K.rbox(3.42, 0.04, 0.03, 0.01, K.paint('#a8301e', { rough: 0.4 }), HX, yy, zz, H);   // plank lines
    for (const cx of [-1.7, 1.7]) for (const cz of [-2, 2]) K.rbox(0.16, WH, 0.16, 0.04, cream, HX + cx, WH / 2, cz, H);                       // corner posts
    K.rbox(3.6, 0.14, 4.2, 0.04, cream, HX, WH + 0.05, 0, H);                                                                                 // top trim
    K.rbox(3.7, 0.3, 4.3, 0.05, K.mat('rock', '#8a8078'), HX, 0.15, 0, H);                                                                    // stone base
    // the steep roof: two shingled slopes + gable triangle + gold ridge
    const shingle = K.paint('#3a4a6a', { rough: 0.45 }), shingle2 = K.paint('#2e3c58', { rough: 0.45 });
    const slopeLen = Math.hypot(EAVE_X + OVER, (RIDGE - WH) * (EAVE_X + OVER) / EAVE_X);
    for (const side of [-1, 1]) { const rg = new THREE.Group(); rg.position.set(HX, RIDGE, 0); rg.rotation.z = -side * (Math.PI / 2 - ANG) * 0 + (side > 0 ? -ANG : ANG); H.add(rg);
      // a deck board under the shingles
      K.rbox(slopeLen, 0.12, 4.5, 0.04, dark, side * slopeLen / 2, -0.06, 0, rg);
      for (let r = 0; r < 12; r++) for (let c = 0; c < 9; c++) { const sx = side * (0.3 + r * (slopeLen - 0.3) / 12); K.rbox(0.42, 0.05, 0.5, 0.02, (r + c) % 2 ? shingle : shingle2, sx, 0.03 + (r % 2) * 0.01, -2.0 + c * 0.5 + (r % 2) * 0.25 - 0.1, rg); }
      K.rbox(slopeLen, 0.05, 0.08, 0.02, gold, side * slopeLen / 2, 0.08, 2.24, rg); K.rbox(slopeLen, 0.05, 0.08, 0.02, gold, side * slopeLen / 2, 0.08, -2.24, rg); }
    const gab = new THREE.Shape(); gab.moveTo(-EAVE_X + 0.3, 0); gab.lineTo(EAVE_X - 0.3, 0); gab.lineTo(0, RIDGE - WH - 0.3); gab.closePath();
    for (const zz of [1.98, -2.02]) { const gm = new THREE.Mesh(new THREE.ExtrudeGeometry(gab, { depth: 0.04, bevelEnabled: false }), cream); gm.position.set(HX, WH + 0.1, zz); gm.castShadow = gm.receiveShadow = true; H.add(gm); }
    // round attic window + gold ring on the gable
    const aw = new THREE.Mesh(new THREE.CircleGeometry(0.32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc870').multiplyScalar(1.6) })); aw.position.set(HX, WH + 1.6, 2.04); H.add(aw);
    const ar = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 10, 32), gold); ar.position.set(HX, WH + 1.6, 2.05); H.add(ar);
    const rb = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.6, 16), gold); rb.rotation.x = Math.PI / 2; rb.position.set(HX, RIDGE + 0.06, 0); H.add(rb);
    const fin = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), gold); fin.position.set(HX, RIDGE + 0.25, 2.2); H.add(fin);
    // chimney (steam)
    K.rbox(0.5, 1.6, 0.5, 0.05, K.mat('brick', '#a8503a', { detail: 0.6 }), HX - 0.9, RIDGE - 1.2, -1.1, H); K.rbox(0.62, 0.12, 0.62, 0.03, dark, HX - 0.9, RIDGE - 0.35, -1.1, H);
    // door with gold knocker, steps, lanterns, windows with warm light, flower boxes, a name sign
    K.rbox(1.0, 2.0, 0.1, 0.04, K.paint('#2a5a3a', { rough: 0.35 }), HX, 1.0 + 0.3, 2.04, H);
    for (const yy of [0.75, 1.55]) K.rbox(0.8, 0.5, 0.03, 0.02, K.paint('#24503a', { rough: 0.4 }), HX, yy + 0.3, 2.1, H);
    const kn = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.018, 8, 20), gold); kn.position.set(HX, 1.55, 2.13); H.add(kn);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), gold); knob.position.set(HX + 0.36, 1.25, 2.13); H.add(knob);
    for (let s = 0; s < 2; s++) K.rbox(1.6 - s * 0.3, 0.15, 0.7 - s * 0.25, 0.03, K.mat('wood', '#9a7048'), HX, 0.075 + s * 0.15, 2.4 - s * 0.12, H);
    const winM = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffcc78').multiplyScalar(1.35) });
    for (const wx of [-1.05, 1.05]) { const wp = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.85), winM); wp.position.set(HX + wx, 1.55, 2.06); H.add(wp);
      K.rbox(0.9, 0.08, 0.1, 0.02, cream, HX + wx, 2.0, 2.08, H); K.rbox(0.9, 0.08, 0.14, 0.02, cream, HX + wx, 1.1, 2.1, H); K.rbox(0.05, 0.85, 0.06, 0.01, cream, HX + wx, 1.55, 2.08, H); K.rbox(0.75, 0.05, 0.06, 0.01, cream, HX + wx, 1.55, 2.08, H);
      for (const sx of [-0.52, 0.52]) K.rbox(0.28, 0.9, 0.05, 0.02, K.paint('#2a5a3a', { rough: 0.4 }), HX + wx + sx, 1.55, 2.08, H);
      K.rbox(0.8, 0.18, 0.22, 0.03, K.mat('wood', '#7a4a2a'), HX + wx, 1.0, 2.2, H);
      for (let fl = 0; fl < 5; fl++) { const fm = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), K.paint(['#e84a5f', '#f2c230', '#ffffff'][fl % 3], { rough: 0.5 })); fm.position.set(HX + wx - 0.3 + fl * 0.15, 1.13, 2.22); H.add(fm); } }
    for (const lx of [-0.72, 0.72]) { K.rbox(0.18, 0.26, 0.18, 0.03, dark, HX + lx, 2.05, 2.18, H); const gl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd27a').multiplyScalar(2) })); gl.position.set(HX + lx, 2.05, 2.2); H.add(gl); }
    const nm = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.3), S.textMat('HENRIK', { bg: '#f4ead2', fg: '#2a5a3a', w: 384, h: 128 })); nm.position.set(HX, 2.48, 2.14); H.add(nm);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { const rv = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), gold); rv.position.set(HX + (c ? 1.7 : -1.7), 0.4 + r * 0.6, 2.09); H.add(rv); }
    // woodpile + axe-free chopping block + sled by Henrik's house
    const logM = K.mat('wood', '#8a5a34', { detail: 0.4 }), endM = K.paint('#d8b080', { rough: 0.7 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6 - r; c++) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.0, 12), logM); lg.rotation.x = Math.PI / 2; lg.position.set(HX - 2.15 - 0.0, 0.14 + r * 0.24, -1.4 + c * 0.27 + r * 0.13); lg.castShadow = true; H.add(lg); }
    S.bake(H); K.solid(H);
    HN.steam = [HX - 0.9, RIDGE + 0.45, -1.1];
    // Henrik's roof snow (winter): two slabs that slide off on WHUMP
    const snowM = K.mat('plaster', '#f2f6fc', { amt: 0.1 });
    HN.snow = [-1, 1].map((side) => { const g = new THREE.Group(); g.position.set(HX, RIDGE, 0); g.rotation.z = side > 0 ? -ANG : ANG; sc.add(g);
      const inner = new THREE.Group(); g.add(inner); K.rbox(slopeLen * 0.92, 0.22, 4.4, 0.1, snowM, side * slopeLen * 0.5, 0.14, 0, inner); return { g, inner, side }; });
    HN.pile = [-1, 1].map((side) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), snowM); m.position.set(HX + side * 2.6, 0, 0); m.scale.set(0.9, 0.001, 2.4); m.castShadow = m.receiveShadow = true; sc.add(m); return m; });
    // ladder on Henrik's +x wall (Henrik hammers at the eave)
    LADDER = K.group(); const lw = K.mat('wood', '#b07a48');
    for (const zz of [-0.25, 0.25]) K.rbox(0.07, 3.1, 0.07, 0.02, lw, 0, 1.55, zz, LADDER);
    for (let r = 0; r < 9; r++) K.rbox(0.05, 0.05, 0.5, 0.015, lw, 0, 0.3 + r * 0.33, 0, LADDER);
    LADDER.position.set(-1.35, 0, 1.25); LADDER.rotation.z = 0.17; S.bake(LADDER);
    // ---------- Sven's house: flat roof, hot tub, deck, see-through window (Sven inside) ----------
    const SG = K.group(); SV.g = SG;
    const blue = K.paint('#3a7ac8', { rough: 0.32 }), white = K.paint('#f4f2ee', { rough: 0.35 });
    // walls (front has a door + a window opening)
    K.rbox(3.4, SWH, 0.16, 0.04, blue, SX, SWH / 2, -1.98, SG); K.rbox(0.16, SWH, 4.0, 0.04, blue, SX - 1.7, SWH / 2, 0, SG); K.rbox(0.16, SWH, 4.0, 0.04, blue, SX + 1.7, SWH / 2, 0, SG);
    const fw = (x0, x1, y0, y1) => K.rbox(x1 - x0, y1 - y0, 0.16, 0.03, blue, (x0 + x1) / 2, (y0 + y1) / 2, 1.98, SG);
    fw(2.1, 2.55, 0, SWH); fw(2.55, 3.45, 2.1, SWH); fw(3.45, 4.05, 0, SWH); fw(4.05, 5.05, 0, 1.05); fw(4.05, 5.05, 2.0, SWH); fw(5.05, 5.5, 0, SWH);
    K.slab(2.2, 5.4, 0, 0.06, -1.9, 1.9, K.mat('wood', '#8a6040'), SG);                                   // floor
    K.rbox(3.3, 1.2, 0.1, 0.03, K.paint('#e8d8b0', { rough: 0.6 }), SX, 1.4, -1.88, SG);                 // inside: back wall panel
    K.rbox(0.9, 0.9, 0.5, 0.05, K.mat('wood', '#7a4a2a'), 4.9, 0.45, -1.4, SG);                           // a cupboard
    for (const cx of [-1.7, 1.7]) for (const cz of [-2, 2]) K.rbox(0.18, SWH, 0.18, 0.04, white, SX + cx, SWH / 2, cz, SG);
    K.rbox(3.7, 0.3, 4.3, 0.05, K.mat('rock', '#8a8078'), SX, 0.15, 0, SG);
    // window frame + shutters + sill + flower box
    K.rbox(1.06, 0.08, 0.12, 0.02, white, 4.55, 2.02, 2.04, SG); K.rbox(1.12, 0.08, 0.2, 0.02, white, 4.55, 1.02, 2.08, SG);
    for (const sx of [-0.62, 0.62]) K.rbox(0.3, 1.0, 0.05, 0.02, K.paint('#f2c230', { rough: 0.4 }), 4.55 + sx, 1.52, 2.07, SG);
    // door frame + steps + mailbox + sign
    K.rbox(1.06, 0.1, 0.14, 0.02, white, 3.0, 2.12, 2.04, SG); for (const sx of [-0.5, 0.5]) K.rbox(0.08, 2.1, 0.14, 0.02, white, 3.0 + sx, 1.05, 2.04, SG);
    K.rbox(1.3, 0.15, 0.6, 0.03, K.mat('wood', '#9a7048'), 3.0, 0.075, 2.35, SG);
    const sn = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.32), S.textMat('SVEN', { bg: '#f4ead2', fg: '#1f5fc8', w: 384, h: 128 })); sn.position.set(4.55, 2.35, 2.08); SG.add(sn);
    K.cyl(0.04, 0.04, 1.1, K.mat('wood', '#6a4a2a'), 5.2, 0, 3.4, SG); K.rbox(0.3, 0.26, 0.45, 0.08, K.paint('#c0392b'), 5.2, 1.2, 3.4, SG);
    const mb = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.14), S.textMat('SVEN', { bg: '#c0392b', fg: '#ffffff', w: 256, h: 96 })); mb.position.set(5.42, 1.2, 3.4); mb.rotation.y = Math.PI / 2; SG.add(mb);
    S.bake(SG); K.solid(SG);
    SV.door = K.rbox(0.92, 2.0, 0.08, 0.03, K.paint('#f2c230', { rough: 0.35 }), 3.0, 1.0, 1.99); const dk = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), gold); dk.position.set(0.32, 0, 0.06); SV.door.add(dk);
    // window glass (opens on CLIMB) + inside lamp
    SV.win = new THREE.Group(); SV.win.position.set(4.05, 1.52, 2.0); sc.add(SV.win);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.95), K.glass({ opacity: 0.18 })); glass.position.x = 0.5; SV.win.add(glass);
    K.rbox(1.0, 0.06, 0.06, 0.02, white, 0.5, 0, 0.02, SV.win); K.rbox(0.06, 0.95, 0.06, 0.02, white, 0.5, 0, 0.02, SV.win);
    K.lamp(4.1, 2.2, 0.6, { color: '#ffd09a', intensity: 3.2, distance: 6, flicker: 0.04 });
    // the flat roof: 6 segments so it can sag in the middle; snow on top; hot tub, rails, deck chair, parasol
    SV.roof = []; const deckM = K.mat('wood', '#a87a4a', { detail: 0.5 });
    for (let k = 0; k < 6; k++) { const g = new THREE.Group(); sc.add(g); const x0 = SX - 1.95 + k * 0.65;
      K.rbox(0.66, 0.22, 4.4, 0.03, K.paint('#2a3a5a', { rough: 0.4 }), x0 + 0.325, ROOF - 0.11, 0, g);
      for (let p = 0; p < 6; p++) K.rbox(0.62, 0.04, 0.68, 0.01, deckM, x0 + 0.325, ROOF + 0.02, -1.85 + p * 0.74, g);
      for (let r = 0; r < 4; r++) { const rafter = K.rbox(0.12, 0.16, 0.5, 0.02, K.mat('wood', '#7a5030'), x0 + 0.33, ROOF - 0.26, 2.2, g); }
      const snow = K.rbox(0.68, 1, 4.42, 0.12, snowM, x0 + 0.325, ROOF + 0.5, 0, g); snow.scale.y = 0.001;
      SV.roof.push({ g, snow, x: x0 + 0.325 }); }
    // rails on the roof edge (front + sides)
    SV.rail = new THREE.Group(); sc.add(SV.rail); const rail = K.paint('#f4f2ee', { rough: 0.3 });
    for (let k = 0; k <= 10; k++) K.rbox(0.05, 0.8, 0.05, 0.01, rail, SX - 1.9 + k * 0.38, ROOF + 0.4, 2.1, SV.rail);
    K.rbox(3.9, 0.07, 0.08, 0.02, rail, SX, ROOF + 0.82, 2.1, SV.rail);
    // hot tub: wooden barrel with gold hoops, steaming blue water
    SV.tub = new THREE.Group(); sc.add(SV.tub); SV.tub.position.set(4.3, ROOF, -0.4);
    const tubW = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.85, 36, 1, true), K.mat('wood', '#9a6a3a', { detail: 0.3 })); tubW.material.side = THREE.DoubleSide; tubW.position.y = 0.43; tubW.castShadow = true; SV.tub.add(tubW);
    for (const yy of [0.15, 0.7]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.03, 8, 40), gold); h.rotation.x = Math.PI / 2; h.position.y = yy; SV.tub.add(h); }
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.06, 10, 40), K.mat('wood', '#b08050')); rim.rotation.x = Math.PI / 2; rim.position.y = 0.86; SV.tub.add(rim);
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.82, 36), K.paint('#3ab0d8', { rough: 0.05, coat: 1, env: 1.6 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.72; SV.tub.add(water);
    // deck chair + parasol + towel
    SV.chair = new THREE.Group(); sc.add(SV.chair); SV.chair.position.set(2.7, ROOF, -0.8);
    K.rbox(0.6, 0.06, 1.4, 0.02, K.paint('#e84a5f'), 0, 0.35, 0, SV.chair); const back = K.rbox(0.6, 0.06, 0.7, 0.02, K.paint('#e84a5f'), 0, 0.6, -0.8, SV.chair); back.rotation.x = -0.9;
    for (const [a, b] of [[-0.25, -0.6], [0.25, -0.6], [-0.25, 0.6], [0.25, 0.6]]) K.rbox(0.04, 0.35, 0.04, 0.01, chrome, a, 0.17, b, SV.chair);
    const para = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.4, 12, 1, true), K.paint('#f2c230')); para.material.side = THREE.DoubleSide; para.position.set(0.5, 2.1, 0.4); SV.chair.add(para);
    K.cyl(0.025, 0.025, 2.0, chrome, 0.5, 0, 0.4, SV.chair, 8);
    // Sven's ground snow piles (grow with the storms, block his door)
    SV.piles = [[2.6, 2.9, 1.2], [4.6, 3.0, 1.5], [6.4, 1.0, 1.3], [1.0, 2.6, 1.0]].map(([px, pz, r]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 12), snowM); m.position.set(px, 0, pz); m.scale.y = 0.001; m.castShadow = m.receiveShadow = true; sc.add(m); WIN.push(m); return m; });
    // ---------- props between the houses: snow gauge pole, Frostdal board, lamps, fence, bench, snowman ----------
    const PG = K.group(), POLE = K.group(); SV.pole = POLE;
    for (let k = 0; k < 7; k++) K.cyl(0.07, 0.07, 0.5, K.paint(k % 2 ? '#ffffff' : '#d8302a', { rough: 0.4 }), 0.25, k * 0.5, 3.3, POLE, 14);
    const gs = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), S.textMat('3 M', { bg: '#1f3a6a', fg: '#ffffff', w: 256, h: 144 })); gs.position.set(0.25, 3.25, 3.4); POLE.add(gs);
    for (let k = 1; k <= 3; k++) { const tk = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.16), S.textMat(k + 'm', { bg: '#ffffff', fg: '#1a1a1a', w: 128, h: 64 })); tk.position.set(0.48, k - 0.02, 3.3); POLE.add(tk); }
    for (let fx_ = -12; fx_ <= 12; fx_ += 1.2) if (Math.abs(fx_) > 0.8 && Math.abs(fx_ - HX) > 1.2 && Math.abs(fx_ - SX + 0.6) > 1.2) { K.cyl(0.05, 0.05, 0.9, K.mat('wood', '#e8dcc4'), fx_, 0, 5.4, PG, 8); K.rbox(1.2, 0.08, 0.04, 0.01, K.mat('wood', '#e8dcc4'), fx_ + 0.6, 0.62, 5.4, PG); K.rbox(1.2, 0.08, 0.04, 0.01, K.mat('wood', '#e8dcc4'), fx_ + 0.6, 0.32, 5.4, PG); }
    S.bake(PG); S.bake(POLE);
    const board = S.board('FROSTDAL|SNOW: 3 M A YEAR', 2.4, 1.2, { frame: '#2a5a3a' }); board.position.set(-8.6, 0, 6.6); board.rotation.y = 0.5;
    for (const [lx, lz] of [[9.6, 6.4], [8.6, 4.6], [-11, 5]]) { const l = S.streetLamp(); l.position.set(lx, 0, lz); l.rotation.y = Math.PI / 2; }
    const bn = S.bench(); bn.position.set(7.2, 0, 4.2); bn.rotation.y = -0.4;
    const snowman = K.group(); for (const [r, y] of [[0.45, 0.4], [0.32, 1.05], [0.22, 1.5]]) { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), snowM); s.position.y = y; s.castShadow = true; snowman.add(s); }
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.25, 10), K.paint('#f08a24')); nose.rotation.x = Math.PI / 2; nose.position.set(0, 1.5, 0.3); snowman.add(nose);
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 8, 20), K.paint('#c0392b')); scarf.rotation.x = Math.PI / 2; scarf.position.y = 1.3; snowman.add(scarf);
    snowman.position.set(-7.2, 0, 2.6); WIN.push(snowman);
    const sled = K.group(); K.rbox(0.5, 0.06, 1.1, 0.02, K.paint('#c0392b'), 0, 0.2, 0, sled); for (const sx of [-0.2, 0.2]) K.rbox(0.04, 0.05, 1.3, 0.02, chrome, sx, 0.05, 0.05, sled); sled.position.set(-6.0, 0, 1.4); sled.rotation.y = 0.4;
    // ---------- cutaway: summer playground slide (far away at x = 70) ----------
    const PK = K.group(); const grass = K.mat('grime', '#6aa84f', { amt: 0.6 });
    K.slab(52, 88, -0.05, 0.05, -20, 20, grass, PK, false);
    SLIDEG = { x0: 70, top: 2.3, len: 3.6 };
    for (const [lx, lz] of [[69.3, -0.45], [69.3, 0.45], [70.2, -0.45], [70.2, 0.45]]) K.rbox(0.08, 2.9, 0.08, 0.02, K.paint('#2a62c8'), lx, 1.45, lz, PK);
    K.rbox(1.05, 0.08, 1.05, 0.03, K.paint('#f2c230'), 69.75, SLIDEG.top, 0, PK);
    for (let r = 0; r < 6; r++) K.rbox(0.06, 0.05, 0.9, 0.015, chrome, 69.2, 0.35 + r * 0.36, 0, PK);
    { const ch = new THREE.Group(); ch.position.set(70.25, SLIDEG.top, 0); ch.rotation.z = -Math.atan2(SLIDEG.top - 0.3, SLIDEG.len); PK.add(ch); const L2 = Math.hypot(SLIDEG.top - 0.3, SLIDEG.len);
      K.rbox(L2, 0.05, 0.62, 0.02, K.paint('#e8402e', { rough: 0.2 }), L2 / 2, 0, 0, ch); for (const zz of [-0.33, 0.33]) K.rbox(L2, 0.18, 0.05, 0.02, K.paint('#e8402e', { rough: 0.2 }), L2 / 2, 0.08, zz, ch); }
    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.6, 4), K.paint('#2ab07a')); roof2.position.set(69.75, 3.2, 0); roof2.rotation.y = Math.PI / 4; PK.add(roof2);
    for (const [tx, tz] of [[66, -5], [76, -6], [73, -9], [64, -9]]) { const t = S.tree({ h: 4.5, seed: tx, colors: ['#4f9a3a', '#6ab84a', '#3a8a3a'] }); t.position.set(tx, 0, tz); }
    const b2 = S.bench(); b2.position.set(74.8, 0, -2.2); const bi = S.bin(); bi.position.set(66.5, 0, -1.8);
    const ps = S.board('PARK|NO SNOW HERE', 1.6, 0.9, { frame: '#2ab07a' }); ps.position.set(66.8, 0, -3.6); ps.rotation.y = 0.3;
    S.bake(PK);
    // ---------- characters ----------
    HEN = K.stick({ jacket: '#3a6a4a', pants: '#3a2a20', boots: '#2a1a12', hat: 'beanie', hatColor: '#c0392b', moustache: '#6a3a1a', scarf: '#f2c230', vest: '#8a5a34', belt: '#2a1a12', gloves: '#c0392b', pockets: true }, { key: 'hen' });
    SVEN = K.stick({ jacket: '#2a62c8', pants: '#e8e0d0', boots: '#f2f2f2', hairStyle: 'spiky', hair: '#f2d060', glasses: '#1a1a1a', scarf: '#e84a5f', bowtie: '#f2c230', belt: '#1a1a1a' }, { key: 'sven' });
    GOAT = K.animal('sheep', { fluffy: false, horns: true, color: '#f2ece2', face: '#efe6d8', nose: '#4a3a30', seed: 4, scale: 1.05 });
    // party hats (cones with stripes + gold pompom), parented to the heads
    const hatM = K.paint('#e84a8a', { rough: 0.3 }), hatS = K.paint('#f2c230', { rough: 0.3 });
    const mkHat = (parent, y, s) => { const g = new THREE.Group(); parent.add(g); g.position.y = y; g.scale.setScalar(s);
      const c = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.36, 24), hatM); c.position.y = 0.18; c.castShadow = true; g.add(c);
      for (const yy of [0.08, 0.2]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.14 * (1 - yy / 0.36) + 0.005, 0.014, 8, 24), hatS); r.rotation.x = Math.PI / 2; r.position.y = yy; g.add(r); }
      const pp = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), gold); pp.position.y = 0.37; g.add(pp); return g; };
    HAT_S = mkHat(SVEN.head, 0.2, 1.1); HAT_G = mkHat(GOAT.head, 0.1, 0.75);
    // four men on one square metre of snow (storm three)
    for (let k = 0; k < 4; k++) MEN.push(K.stick({ jacket: ['#c0632a', '#7a4a9a', '#3a7a4a', '#a83a3a'][k], pants: '#2c3e5a', hat: ['beanie', 'cap', 'cowboy', 'beanie'][k], hatColor: ['#2a62c8', '#f2c230', '#8a5a34', '#2ab07a'][k], cap: '#f2c230', scarf: ['#f2c230', '#c0392b', '#ffffff', '#2a62c8'][k], belt: '#1a1a1a', build: k === 2 ? 'stout' : undefined }, { key: 'man' + k }));
    HOLO = K.holoBox(1.0, 1.0, 1.0, 0, 0, 0, sc, '#36e2ff'); HOLO.visible = false;
    HOLO2 = K.holoBox(slopeLen * 0.9, 0.3, 4.4, 0, 0, 0, sc, '#7affb0'); HOLO2.visible = false;
    TR1 = K.trace([slopeP(0.05, 2.5, 1, 0.5), slopeP(0.5, 2.5, 1, 0.5), slopeP(1.0, 2.5, 1, 0.5), [slopeP(1, 2.5)[0] + 0.6, 0.5, 2.5]], { color: '#7affb0', r: 0.05 });
    TR2 = K.trace([[SX - 1.6, ROOF + 1.7, 2.5], [SX, ROOF + 1.7, 2.5], [SX + 1.6, ROOF + 1.7, 2.5]], { color: '#ff6a5a', r: 0.05 });
    EXTRAS = S.extras(5, { x0: -10, len: 20, z: 7.2, spread: 0.8, seed: 21, stillShare: 0.2 });
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, L = LINES, sc = K.scene;
    const MIST = 386, winter = f >= MIST + 13;              // mist wipe peaks at ~399 (line 4)
    const cut = f >= 788 && f < 883;                         // summer playground cutaway
    for (const o of AUT) o.visible = !winter; for (const o of WIN) o.visible = winter;
    // ---------- storms: snow heights, sag ----------
    const st1 = sm(F.ONE, F.WAVED, f), st2 = sm(F.TWO, F.GRIN, f), st3 = sm(F.WET - 10, F.FOUR + 10, f);
    const sSnow = winter ? 0.32 * st1 + 0.55 * st2 + 0.55 * st3 + 0.04 : 0;
    const sag = sm(F.SAG - 3, F.SAG + 8, f) + 0.06 * Math.sin(f * 1.7) * (f > F.CREAK && f < F.CREAK + 14 ? 1 : 0);
    SV.roof.forEach((r, k) => { const d = -0.55 * sag * Math.sin(Math.PI * (k + 0.5) / 6); r.g.position.y = d; r.g.rotation.z = 0; r.snow.scale.y = Math.max(0.001, sSnow * (1 + 0.06 * Math.sin(k * 2.1))); r.snow.position.y = ROOF + 0.02 + r.snow.scale.y * 0.5; });
    const midDrop = -0.55 * sag;
    SV.rail.position.y = midDrop * 0.7; SV.tub.position.y = ROOF + midDrop; SV.chair.position.y = ROOF + midDrop * 0.6;
    SV.tub.visible = !winter || true; SV.chair.visible = true;
    SV.chair.children.forEach(() => {});
    for (const [i, p] of SV.piles.entries()) p.scale.y = Math.max(0.001, (0.25 * st1 + 0.5 * st2 + 0.45 * st3) * (0.8 + i * 0.1));
    // Sven's door rattles while jammed
    SV.door.position.x = 3.0 + (f > F.JAM - 4 && f < 790 ? 0.012 * Math.sin(f * 2.9) : 0); SV.door.rotation.y = 0;
    SV.win.rotation.y = -1.6 * sm(F.CLIMB - 12, F.CLIMB - 2, f);
    // Henrik's roof snow: thin, then slides off on WHUMP
    const hSnow = winter ? 0.25 + 0.5 * st2 + 0.25 * st3 : 0, slideU = sm(F.WHUMP - 2, F.WHUMP + 16, f);
    for (const s of HN.snow) { s.g.visible = winter && slideU < 0.98; s.inner.scale.set(1, Math.max(0.01, hSnow), 1); s.inner.position.x = s.side * slideU * 7.5; s.inner.position.y = -slideU * slideU * 1.5; }
    HN.pile.forEach((p) => { p.visible = winter; p.scale.y = Math.max(0.001, 0.15 * st1 + 0.2 * st2 + 0.9 * sm(F.WHUMP + 8, F.WHUMP + 18, f)); });
    // ---------- Henrik ----------
    const hk = [[0, 'hammer', { expr: 'deadpan', look: -0.2 }], [F.SLID - 2, 'hammer', { expr: 'deadpan', look: 0.5 }], [F.SLID + 12, 'hammer', { expr: 'deadpan' }], [F.TWICE + 6, 'shrug', { expr: 'deadpan' }],
      [L[1][0], 'hammer', { expr: 'deadpan' }], [F.LAUGH, 'hammer', { expr: 'deadpan', look: 0.6 }], [F.PARTY + 10, 'idle', { expr: 'deadpan', look: 0.7 }], [L[3][0], 'hammer', { expr: 'deadpan' }]];
    if (f < MIST + 13) HEN.set(T.act(f, hk, { seed: 2, blink: blinkAt(f, 2) }), { x: -1.05, y: 1.15, z: 1.25, yaw: -0.75 });
    else {
      const k2 = [[0, 'drink', { expr: 'deadpan', R: [0.25, 0.1, 'cup'] }], [F.DRY - 6, 'drink', { expr: 'smile', R: [0.25, 0.1, 'cup'] }], [F.BEG, 'idle', { expr: 'deadpan', look: 0.2 }],
        [F.HAND - 4, 'reach', { expr: 'deadpan' }], [F.HAT + 8, 'hips', { expr: 'deadpan' }], [F.GOATW, 'pointL', { expr: 'smile', look: -0.5 }]];
      HEN.set(T.act(f, k2, { seed: 2, blink: blinkAt(f, 2) }), { x: HX + 0.7, y: 0.3, z: 2.55, yaw: 0.25, visible: f >= F.WHUMP - 4 });
    }
    LADDER.visible = !winter; SV.pole.visible = (f >= 98 && f < 250) || (f >= 399 && f < 502);
    // ---------- Sven ----------
    HAT_S.visible = f >= F.HAT - 2; HAT_G.visible = f >= F.HAND - 10;
    if (f < MIST + 13) {   // in the hot tub
      const sk = [[0, 'sit', { expr: 'smug', R: [0.3, 0.05, 'cup'] }], [F.LAUGH - 4, 'pointL', { expr: 'gloat', talk: true, R: [0.3, 0.05, 'cup'] }], [F.PARTY + 14, 'sit', { expr: 'laugh', R: [0.3, 0.05, 'cup'] }],
        [L[3][0], 'sit', { expr: 'smug', R: [0.3, 0.05, 'cup'] }], [F.SOAK - 6, 'drink', { expr: 'smug', R: [0.3, 0.05, 'cup'] }]];
      SVEN.set(T.act(f, sk, { seed: 5, blink: blinkAt(f, 5) }), { x: 4.3, y: ROOF + 0.05, z: -0.15, yaw: -0.9, seat: 0.5 });
    } else if (f < 716) {  // on the roof deck through the storms
      const sk = [[0, 'idle', { expr: 'smug' }], [F.WAVED - 4, 'wave', { expr: 'grin' }], [L[5][0], 'hips', { expr: 'smug' }], [F.CREAK, 'shock', { expr: 'nervous' }], [F.GRIN - 3, 'cheer', { expr: 'grin', sweat: true, talk: true }]];
      SVEN.set(T.act(f, sk, { seed: 5, blink: blinkAt(f, 5) }), { x: 3.0, y: ROOF + 0.03 + sSnow * 0.25, z: 1.55, yaw: -0.4 });
    } else if (f < F.CLIMB) {  // inside, pushing the jammed door
      const sk = [[0, 'push', { expr: 'nervous', look: -0.4 }], [F.JAM, 'push', { expr: 'scared', sweat: true, look: -0.3 }], [760, 'shock', { expr: 'scared', sweat: true }], [776, 'push', { expr: 'nervous', sweat: true }]];
      SVEN.set(T.act(f, sk, { seed: 5, blink: blinkAt(f, 5) }), { x: 4.5, y: 0.3, z: 1.45, yaw: -0.35 });
    } else {                  // climbs out the window, flops into the snow, wades to Henrik, begs
      const u = sm(F.CLIMB, F.CLIMB + 22, f), land = F.CLIMB + 22;
      let x, y, z, yaw = Math.PI * 0.85, pose;
      if (f < land) { x = 4.55; z = lerp(1.4, 3.1, u); y = 0.06 + 1.1 * Math.sin(Math.PI * u) - 0.4 * u; pose = [[0, 'jump', { expr: 'scared', sweat: true }]]; yaw = 0; }
      else { const W = f < 1120 ? K.walkPath(f, land + 6, [[4.55, 3.1], [2.0, 4.3], [-1.6, 4.0]], 1.6) : { x: -2.7, z: 3.55, yaw: Math.PI, moving: false };
        x = W.x; z = W.z; yaw = W.yaw; y = f < 1120 ? -0.32 : -0.05;
        pose = W.moving ? [[0, 'walk', { expr: 'sad', sweat: true }]] : [[0, 'idle', { expr: 'beg', sweat: true }], [F.BEG - 2, 'beg', { expr: 'beg', talk: true, L: [0.3, -0.55, 'open'], R: [0.3, -0.55, 'open'] }],
          [F.HAND + 2, 'reach', { expr: 'confused' }], [F.HAT + 6, 'idle', { expr: 'confused' }], [F.GOATW + 4, 'facepalm', { expr: 'deadpan' }]]; }
      SVEN.set(T.act(f, pose, { seed: 5, blink: blinkAt(f, 5) }), { x, y, z, yaw });
    }
    SVEN.root.visible = !cut;
    // ---------- the goat ----------
    const goatSlide = (f0, f1, z) => { const u = clamp((f - f0) / (f1 - f0), 0, 1); return u; };
    let gp = null;
    const qz = new THREE.Quaternion(), qy = new THREE.Quaternion();
    if (f < 98) {
      const [f0, f1, z, s0] = f < 50 ? [-12, 30, 1.0, 0.0] : [52, 84, 0.6, 0.0], sd = f < 50 ? 1 : -1;
      const u = (f - f0) / (f1 - f0), land = f1 + 12;
      if (u < 1) { const s = s0 + (1 - s0) * u * u; const p = slopeP(s, z, sd, 0.05); GOAT.set(f, { x: p[0], y: p[1] - 0.02, z: p[2], yaw: sd * Math.PI / 2, mode: 'sit', expr: 'shock' });
        qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), sd * (-ANG + 0.2)); qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), sd * Math.PI / 2); GOAT.root.quaternion.copy(qz).multiply(qy); gp = p; }
      else if (f < land) { const e = slopeP(1, z, sd), v = (f - f1) / 12; GOAT.set(f, { x: e[0] + sd * v * 1.3, y: Math.max(0, e[1] - v * v * e[1]), z, yaw: sd * Math.PI / 2, mode: 'jump', expr: 'shock' }); GOAT.root.rotation.z = -sd * 0.6 * (1 - v); }
      else GOAT.set(f, { x: slopeP(1, z, sd)[0] + sd * 1.3, y: 0, z, yaw: 0.4, mode: 'stand', expr: 'dazed' === 'x' ? 'sad' : 'sad', look: -0.3 });
    } else if (f < MIST + 13) GOAT.set(f, { x: -0.25, y: 0, z: 2.3, yaw: -0.5, mode: f > F.LAUGH && f < F.PARTY + 30 ? 'stand' : 'eat', expr: f > F.LAUGH && f < F.PARTY + 30 ? 'angry' : 'neutral', look: 0.3 });
    else if (cut) {   // playground: sits at the top, then slides down
      const ang = Math.atan2(SLIDEG.top - 0.3, SLIDEG.len), u = sm(F.CANT - 6, F.CANT + 16, f), L2 = Math.hypot(SLIDEG.top - 0.3, SLIDEG.len);
      if (f < F.CANT - 6) GOAT.set(f, { x: 69.85, y: SLIDEG.top + 0.04, z: 0, yaw: Math.PI / 2, mode: 'sit', expr: 'happy', look: Math.sin(f * 0.1) * 0.4 });
      else if (u < 1) { const d = u * L2; GOAT.set(f, { x: 70.25 + d * Math.cos(ang), y: SLIDEG.top + 0.05 - d * Math.sin(ang), z: 0, yaw: Math.PI / 2, mode: 'sit', expr: 'shock' }); qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -ang); qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); GOAT.root.quaternion.copy(qz).multiply(qy); }
      else { const v = clamp((f - F.CANT - 16) / 10, 0, 1); GOAT.set(f, { x: 70.25 + L2 * Math.cos(ang) + v * 0.9, y: 0.3 * (1 - v), z: 0, yaw: Math.PI / 2, mode: v < 1 ? 'jump' : 'stand', expr: 'happy' }); }
    } else GOAT.set(f, { x: HX - 0.85, y: 0.3, z: 2.55, yaw: 0.3, mode: f > F.HAND - 10 ? 'sit' : 'sleep', expr: f > F.HAND - 10 ? 'happy' : 'sleepy', look: f > F.GOATW ? 0.3 : 0, visible: f > F.WHUMP });
    // ---------- four men on one square metre ----------
    const menOn = f >= 660 && f < 716;
    MEN.forEach((m, k) => { const px = SX + 0.4 + (k % 2 ? 0.24 : -0.24), pz = 1.0 + (k < 2 ? -0.22 : 0.22);
      m.set(T.act(f, [[0, 'idle', { expr: ['nervous', 'confused', 'shock', 'nervous'][k] }], [F.FOUR + k * 2, ['shrug', 'cross', 'shock', 'wave'][k], { expr: ['nervous', 'stern', 'shock', 'smile'][k], sweat: k === 0 }]], { seed: 30 + k, blink: blinkAt(f, 30 + k) }),
        { x: px, y: ROOF + sSnow + 0.02, z: pz, yaw: 0.2 - k * 0.1, visible: menOn }); });
    HOLO.visible = menOn && f > F.FOUR - 10; HOLO.position.set(SX + 0.4, ROOF + sSnow * 0.5 + 0.02, 1.0); HOLO.scale.set(1, Math.max(0.01, sSnow), 1);
    S_extras(f, K);
    // ---------- explainer: slide vs stay ----------
    const exp = f >= 883 && f < 999;
    TR1.show(exp ? sm(F.NEITHER, F.SLIDES + 10, f) : 0); TR2.show(exp ? sm(F.STEEP - 20, F.STEEP, f) : 0);
    HOLO2.visible = f >= 940 && f < 1000; { const p = slopeP(0.5, 0, 1, 0.25); HOLO2.position.set(p[0], p[1], 0); HOLO2.rotation.set(0, 0, -ANG); HOLO2.scale.set(1, 1 + 0.3 * Math.sin(f * 0.2), 1); }

    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const hp = (rig) => { rig.root.updateMatrixWorld(true); const v = new THREE.Vector3(); rig.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
    const orbit = (t, yaw, pitch, dist, fov, roll = 0) => { const a = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return { pos: [t[0] + Math.sin(a) * Math.cos(p) * dist, t[1] + Math.sin(p) * dist, t[2] + Math.cos(a) * Math.cos(p) * dist], look: t, fov, roll }; };
    const shakeIt = (c, f0, amp, dur) => { const [sx, sy] = K.shake(f, f0, amp, dur); c.pos[0] += sx; c.pos[1] += sy; return c; };
    const eave = slopeP(1, 1.0);
    if (sh(0, 50)) {           // 1. Henrik on the ladder hammering; the goat slides down past him and off the eave
      cam = orbit([-1.4, 3.3, 1.0], lerp(-4, -10, u), 4, 6.2, 46 * K.push(u, 0.1)); dof = { focus: 6, cinf: 7 };
    } else if (sh(50, 98)) {   // 2. side telephoto of the steep roof: the goat slides off again (track)
      const gq = GOAT.root.position; cam = { pos: [lerp(-15, -14.2, u), 6.2, 7.0], look: [lerp(-5.6, -6.4, u), lerp(4.6, 2.2, sm(0.1, 1, u)), 0.6], fov: 40 }; dof = { focus: 12, cinf: 4 };
    } else if (sh(98, 150)) {  // 3. wide: the village of Frostdal in autumn (crane down)
      cam = { pos: [lerp(-1, 1, u), lerp(9, 6.2, u), lerp(17, 15, u)], look: [0, 2.6, -1], fov: 46 }; dof = { focus: 16, cinf: 3 };
    } else if (sh(150, 198)) { // 4. low angle up the snow gauge pole: 3 M
      cam = { pos: [lerp(1.6, 1.3, u), 0.5, 5.3], look: [0.25, lerp(1.6, 2.9, u), 3.3], fov: 40 }; dof = { focus: 2.3, cinf: 12 };
    } else if (sh(198, 245)) { // 5. Sven in his hot tub laughing at the roof
      cam = orbit(hp(SVEN), lerp(-20, -10, u), 6, 2.3, 40 * K.punch(f, F.PARTY, 0.15, 7)); dof = { focus: 2.3, cinf: 14 };
    } else if (sh(245, 289)) { // 6. reaction: Henrik deadpan on the ladder, the goat glaring below
      cam = orbit([-1.1, 2.3, 1.25], lerp(70, 78, u), -8, 3.3, 42 * K.push(u, 0.08)); dof = { focus: 3.3, cinf: 12 };
    } else if (sh(289, 340)) { // 7. crane over Sven's roof deck: hot tub, parasol, deck chair
      cam = { pos: [lerp(7.5, 6.6, u), lerp(7.2, 6.0, u), lerp(5.5, 4.6, u)], look: [3.9, ROOF + 0.5, -0.2], fov: 44 }; dof = { focus: 6, cinf: 6 };
    } else if (sh(340, 399)) { // 8. Sven soaking, sipping (close, steam)
      cam = orbit(hp(SVEN), lerp(-45, -35, u), 10, 2.0, 38 * K.push(u, 0.08)); dof = { focus: 2.0, cinf: 15 };
    } else if (sh(399, 450)) { // 9. winter wide: storm one starts, both houses
      cam = { pos: [lerp(0.5, 0.2, u), lerp(4.0, 3.5, u), lerp(14.5, 13.2, u)], look: [0.2, 3.0, 0], fov: 46 }; dof = { focus: 13, cinf: 4 };
    } else if (sh(450, 502)) { // 10. low angle from between the houses: Sven waves from his roof
      cam = { pos: [lerp(0.4, 0.7, u), 3.0, lerp(6.2, 5.6, u)], look: [3.0, ROOF + 1.3, 1.5], fov: 40 }; dof = { focus: 5, cinf: 9 };
    } else if (sh(502, 545)) { // 11. storm two: telephoto on Sven's roof piling up
      cam = { pos: [lerp(9.5, 9.0, u), 5.2, 9.5], look: [SX, ROOF + 0.4, 0], fov: lerp(30, 27, u) }; dof = { focus: 10, cinf: 6 };
    } else if (sh(545, 578)) { // 12. macro: the rafter ends creak under the weight (shake)
      cam = shakeIt({ pos: [lerp(SX - 1.4, SX - 1.0, u), 1.5, 3.8], look: [SX, ROOF + 0.35, 2.0], fov: 36 }, F.CREAK, 0.03, 14); dof = { focus: 2.6, cinf: 14 };
    } else if (sh(578, 616)) { // 13. Sven grins "strong roof!", sweating
      cam = orbit(hp(SVEN), lerp(-10, -20, u), 8, 2.1, 38 * K.push(u, 0.1)); dof = { focus: 2.1, cinf: 15 };
    } else if (sh(616, 662)) { // 14. storm three: blizzard wide, punch on "wet"
      cam = shakeIt({ pos: [lerp(8.0, 7.2, u), 2.8, 10], look: [2.2, 2.8, 0], fov: 44 * K.punch(f, F.WET, 0.18, 8) }, F.WET, 0.02, 12); dof = { focus: 10, cinf: 5 };
    } else if (sh(662, 716)) { // 15. x-ray: one square metre of snow = four grown men
      cam = { pos: [lerp(SX + 3.2, SX + 2.6, u), ROOF + 2.6, 5.0], look: [SX + 0.4, ROOF + sSnow + 0.6, 1.0], fov: 40 }; dof = { focus: 4.4, cinf: 10 };
    } else if (sh(716, 752)) { // 16. low angle: the roof sags (shake + punch)
      cam = shakeIt({ pos: [SX - 1.0, 0.7, 6.4], look: [SX, 2.4, 1.5], fov: 46 * K.punch(f, F.SAG, 0.15, 6) }, F.SAG, 0.06, 18); dof = { focus: 5, cinf: 8 };
    } else if (sh(752, 788)) { // 17. the jammed door rattles; Sven sweating at the window
      cam = { pos: [lerp(4.0, 4.2, u), 2.2, lerp(4.8, 4.3, u)], look: [4.1, 1.6, 1.6], fov: 42 }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(788, 836)) { // 18. cutaway: the goat at the top of a playground slide
      cam = { pos: [lerp(74.5, 74, u), 1.9, 3.6], look: [70.0, 2.3, 0], fov: 40 }; dof = { focus: 5.5, cinf: 8 };
    } else if (sh(836, 883)) { // 19. it can't stay: the goat whooshes down (tracking)
      const tc = K.track(f, () => { const p = GOAT.root.position; return [p.x, p.y, p.z]; }, { off: [1.2, 0.8, 3.2], lag: 3, lead: 0.1, lookY: 0.4 }); cam = { ...tc, fov: 42 }; dof = { focus: 3.4, cinf: 10 };
    } else if (sh(883, 940)) { // 20. explainer: both roofs side by side, glowing lines (snow slides vs snow stays)
      cam = { pos: [lerp(SX + 0.9, SX + 0.5, u), 4.0, lerp(9.0, 8.2, u)], look: [SX - 0.2, ROOF + 0.9, 0.8], fov: 40 }; dof = { focus: 8, cinf: 5 };
    } else if (sh(940, 999)) { // 21. low on Henrik's steep slope: x-ray on the snow, it creeps down
      cam = { pos: [lerp(1.8, 1.4, u), 2.0, 7.4], look: [-2.2, 4.8, 0.5], fov: 40 }; dof = { focus: 8, cinf: 5 };
    } else if (sh(999, 1037)) { // 22. WHUMP: the roof shrugs off its snow (wide, shake, punch)
      cam = shakeIt({ pos: [lerp(2.6, 2.2, u), 1.3, 8.6], look: [HX, 3.6, 0], fov: 48 * K.punch(f, F.WHUMP + 6, 0.12, 6) }, F.WHUMP + 8, 0.08, 18); dof = { focus: 8, cinf: 5 };
    } else if (sh(1037, 1075)) { // 23. Henrik on his porch, deadpan, sipping; dry roof above
      cam = orbit(hp(HEN), lerp(20, 30, u), 4, 2.3, 40 * K.push(u, 0.08)); dof = { focus: 2.3, cinf: 14 };
    } else if (sh(1075, 1120)) { // 24. Sven climbs out his window and flops into the snow (tracking)
      const tc = K.track(f, () => { const p = SVEN.root.position; return [p.x, p.y, p.z]; }, { off: [-1.2, 1.1, 4.2], lag: 4, lead: 0.15, lookY: 1.0 }); cam = { ...tc, fov: 44 }; dof = { focus: 4.4, cinf: 9 };
    } else if (sh(1120, 1171)) { // 25. Sven begs (close, low, Henrik's door glowing behind)
      cam = orbit(hp(SVEN), lerp(138, 126, u), -4, 2.0, 38 * K.push(u, 0.1)); dof = { focus: 2.1, cinf: 14 };
    } else if (sh(1171, 1228)) { // 26. two-shot: Henrik hands over the tiny party hat
      cam = { pos: [lerp(-0.3, -0.6, u), 1.6, lerp(6.4, 5.9, u)], look: [-2.8, 1.3, 3.0], fov: 40 }; dof = { focus: 3.7, cinf: 10 };
    } else {                    // 27. the goat already has one (close, slow push, hold)
      const g = GOAT.root.position; cam = orbit([g.x, g.y + 0.65, g.z], lerp(20, 8, u), 6, 1.6, 40 * K.push(u, 0.12)); dof = { focus: 1.6, cinf: 16 };
    }
    // ---------- weather + graphics ----------
    K.mist(f, MIST, 26);
    if (winter && !cut) {
      const storm = f < 502 ? 1 : f < 616 ? 2 : f < 716 ? 3 : f < 999 ? 0.6 : 0, wind = storm >= 3 ? [1.4, 0.3] : [0.4, 0.1];
      if (storm) K.leaves(f, cam.look, { area: 12, count: Math.round(110 * storm), fall: 0.7 + 0.25 * storm, wind, colors: ['#ffffff', '#f2f6ff', '#e8eef8'] });
    } else if (!winter) K.leaves(f, cam.look, { area: 10, count: 28, fall: 0.5 });
    if (!cut) { K.steam(f, HN.steam, { rate: 5, size: 0.8, rise: 2.0, drift: [0.5, 0.1], seed: 1 }); if (!winter) K.steam(f, [4.3, ROOF + 0.9, -0.4], { rate: 6, size: 0.7, rise: 1.2, drift: [0.3, 0.1], alpha: 0.5, seed: 2 }); }
    if (f >= F.WHUMP + 6 && f < F.WHUMP + 40) { K.puff(f, F.WHUMP + 8, HX + 2.7, 0.8, 12, 1.6, '#f4f8ff'); K.puff(f, F.WHUMP + 8, HX - 2.7, 0.8, 12, 1.6, '#f4f8ff'); }
    K.puff(f, 42, eave[0] + 1.3, 1.0, 8, 0.6, '#e8d8b8'); K.puff(f, 96, slopeP(1, 0.6, -1)[0] - 1.3, 0.6, 8, 0.6, '#e8d8b8');
    K.puff(f, F.CLIMB + 22, 4.55, 3.1, 10, 0.9, '#f4f8ff'); K.puff(f, F.SAG, SX, 2.4, 10, 1.0, '#f4f8ff');
    K.badge(f, F.THREE_, '3 M OF SNOW', [0.25, 3.0, 3.3], { icon: 'warn', f1: 196 });
    K.badge(f, F.PARTY, 'PARTY HAT?', { sx: 0.5, sy: 0.3 }, { style: 'stamp', f1: 287, size: 1.4 });
    K.hud(f, F.STORMS, { stages: 3, labels: ['STORM 1', 'STORM 2', 'STORM 3'], u: clamp((f - F.ONE) / (F.SAG - F.ONE), 0, 1), f1: 786 });
    K.badge(f, F.HALF, '0.5 M', [SX, ROOF + 1.2, 1.5], { icon: 'down', f1: 500 });
    K.badge(f, F.TWO + 4, '2 M', [SX, ROOF + 1.6, 1.0], { icon: 'down', f1: 545 });
    K.badge(f, F.FOUR, '1 M² = 4 MEN', [SX + 0.4, ROOF + sSnow + 2.0, 1.0], { icon: 'weight', f1: 714 });
    if (exp) { K.badge(f, F.SLIDES - 4, 'SLIDES OFF', [HX + 1.2, 5.6, 2.5], { icon: 'check', f1: 997 }); K.badge(f, F.STEEP - 26, 'STAYS ON', [SX - 0.3, ROOF + 2.3, 1.5], { icon: 'x', f1: 940 }); }
    // ---------- light ----------
    let light;
    if (cut) light = K.light('day', { az: 70, el: 40 });
    else if (!winter) light = K.light('golden', { az: 68, el: 26, shadowExt: 22 });
    else if (f < 999) light = K.light('overcast', { az: 70, el: 40, sunI: 1.8, hemi: 1.35, exposure: 1.32, skyTop: '#8a9ab0', fog: '#c8d0da', fogFar: 140 });
    else light = K.light('morning', { az: 72, el: 24, shadowExt: 22, exposure: 1.3 });
    return { light, cam, dof, actors: [], fx: [] };
  },
};
function S_extras(f, K) { const T = K.T; K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) e.r.root.visible = f < 386; }
