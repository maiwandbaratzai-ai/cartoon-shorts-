// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Lighthouses Wear Stripes" — invented story, engine: The Overconfident Expert (SCRIPTS.md §000). TikTok, 64 s.
// "Less is more!" designer Sir Reginald paints Puffin Coast's five lighthouses (stripes, spiral, checkers, polka dots, a mustache)
// plain white and cuts off intern Pip. In daylight the lamps are off: Captain Mo drops four tons of cheese on a cheese-hating
// keeper; the mail boat, the ice cream boat and Reginald's own yacht get lost; Gary the pigeon lands on the wrong tower eleven
// times. Explainer: at night each light blinks its own pattern, by day the paint is the pattern (name tags). Pip repaints,
// a tugboat tows Reginald home, Gary flies to his nest on the mustache lighthouse.
import { TOTAL, LINES, wf } from './stripehouse_timing.js';
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
  d = Math.min(d, o.maxDist ?? 60);
  return { pos: [c[0] - fw[0] * d, c[1] - fw[1] * d, c[2] - fw[2] * d], look: c, fov }; };
const WY = -0.6;                                                       // sea level (the quay top is y = 0)
const LH = [[-16, -14], [-8, -22], [2, -16], [11, -24], [19, -15]];    // the five lighthouses (x, z)
const TH = 10;                                                         // tower height
let THREE, F = {}, REG, PIP, MO, KEEP, GARY, TOW = [], LAMPS = [], CHEESE, MAIL, ICE, YACHT, TUG, CRATES = [], PILE = [], ROLLER, HOLO;

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t; }
function patternTex(kind) { return canvasTex(512, 1024, (g, w, h) => { g.fillStyle = '#f6f4ee'; g.fillRect(0, 0, w, h);
  if (kind === 'stripes') { g.fillStyle = '#d8302a'; for (let k = 0; k < 6; k++) g.fillRect(0, k * h / 6, w, h / 12); }
  if (kind === 'spiral') { g.fillStyle = '#2a5ac8'; for (let k = -4; k < 10; k++) { g.beginPath(); g.moveTo(0, k * 180); g.lineTo(w, k * 180 - 360); g.lineTo(w, k * 180 - 270); g.lineTo(0, k * 180 + 90); g.fill(); } }
  if (kind === 'checkers') { g.fillStyle = '#1a1a22'; const s = 64; for (let y = 0; y < h / s; y++) for (let x = 0; x < w / s; x++) if ((x + y) % 2) g.fillRect(x * s, y * s, s, s); }
  if (kind === 'dots') { g.fillStyle = '#f2a020'; for (let y = 0; y < 12; y++) for (let x = 0; x < 6; x++) { g.beginPath(); g.arc(x * 85 + (y % 2) * 42 + 20, y * 85 + 40, 24, 0, 7); g.fill(); } }
  if (kind === 'mustache') { g.fillStyle = '#2a1a14'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(256 + s * 62, 540, 66, 34, s * 0.25, 0, 7); g.fill(); g.beginPath(); g.ellipse(256 + s * 122, 512, 26, 22, 0, 0, 7); g.fill(); } for (const cx of [214, 298]) { g.beginPath(); g.arc(cx, 360, 22, 0, 7); g.fill(); } }
}); }
function tower(K, x, z, kind, seed) { const g = new THREE.Group(); g.position.set(x, 0, z); K.scene.add(g);
  const rk = K.mat('rock', '#7a7a82', { detail: 1.2, amt: 0.5 }); for (let k = 0; k < 6; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2 + hash(seed + k) * 1.2, 1), rk); r.position.set((hash(seed + k + 1) - 0.5) * 4, WY - 0.6 + hash(k) * 0.5, (hash(seed + k + 2) - 0.5) * 4); r.scale.y = 0.55; g.add(r); }
  K.cyl(1.9, 2.1, 0.6, K.mat('rock', '#c8c0b0', { detail: 0.5 }), 0, -0.2, 0, g, 24);
  const geo = new THREE.CylinderGeometry(0.9, 1.35, TH, 32, 1, true); const pat = new THREE.MeshStandardMaterial({ map: patternTex(kind), roughness: 0.5 }), wht = new THREE.MeshStandardMaterial({ map: patternTex('white'), roughness: 0.5 });
  const t = new THREE.Mesh(geo, pat); t.position.y = TH / 2 + 0.4; t.rotation.y = Math.PI; t.castShadow = true; g.add(t);
  const dark = K.paint('#2a2a32', { rough: 0.4 }), red = K.paint('#c0392b', { rough: 0.3 }), gold = K.gold();
  const gal = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.2, 32), dark); gal.position.y = TH + 0.5; g.add(gal);
  for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; K.cyl(0.025, 0.025, 0.7, dark, Math.cos(a) * 1.3, TH + 0.6, Math.sin(a) * 1.3, g, 6); } const rl = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.035, 8, 40), dark); rl.rotation.x = Math.PI / 2; rl.position.y = TH + 1.3; g.add(rl);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.3, 20), K.glass({ color: '#fff4c8', opacity: 0.45 })); glass.position.y = TH + 1.25; g.add(glass);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; K.cyl(0.03, 0.03, 1.3, dark, Math.cos(a) * 0.76, TH + 0.6, Math.sin(a) * 0.76, g, 6); }
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff0b0').multiplyScalar(3), toneMapped: false })); lamp.position.y = TH + 1.25; lamp.userData.ndSkip = true; g.add(lamp);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), red); cap.position.y = TH + 1.9; g.add(cap); const vane = K.sphere(0.12, gold, 0, TH + 2.85, 0, g);
  const door = K.rbox(0.9, 1.6, 0.12, 0.08, red, 0, 1.2, 1.32, g); door.rotation.x = -0.04;
  // the nest (on the mustache one) is added by the caller
  return { g, t, pat, wht, lamp, top: [x, TH + 1.4, z] }; }
function boat(K, hull, cabin, name, len = 6) { const g = new THREE.Group(); K.scene.add(g);
  K.rbox(len, 1.1, 2.2, 0.4, K.paint(hull, { rough: 0.3 }), 0, 0.2, 0, g); K.rbox(len + 0.05, 0.18, 2.25, 0.08, K.paint('#f4f2ee', { rough: 0.3 }), 0, 0.7, 0, g); const bow = K.add(new THREE.ConeGeometry(1.1, 1.6, 4), K.paint(hull, { rough: 0.3 }), len / 2 + 0.6, 0.25, 0, g); bow.rotation.z = -Math.PI / 2; bow.rotation.x = Math.PI / 4; bow.scale.set(1, 1, 0.95);
  K.rbox(len * 0.32, 1.2, 1.6, 0.15, K.paint(cabin, { rough: 0.3 }), -len * 0.18, 1.35, 0, g); for (const s of [-1, 1]) K.rbox(len * 0.24, 0.5, 0.03, 0.05, K.paint('#2c3e52', { rough: 0.06, metal: 0.4 }), -len * 0.18, 1.5, s * 0.81, g);
  K.cyl(0.05, 0.05, 1.6, K.chrome(), -len * 0.18, 1.95, 0, g, 8);
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.5, 0.35), K.set.textMat(name, { bg: hull, fg: '#ffffff', w: 512, h: 96, border: false })); nm.position.set(len * 0.12, 0.25, 1.12); g.add(nm); const nm2 = nm.clone(); nm2.position.z = -1.12; nm2.rotation.y = Math.PI; g.add(nm2);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { WHITE: wf(0, 'white'), LOST: wf(0, 'lost'), MOTTO: wf(1, 'motto'), LESS: wf(1, 'less'), WHY: wf(1, 'why'), STRIPES: wf(2, 'stripes'), SPIRAL: wf(2, 'spiral'), CHECK: wf(2, 'checkers'), DOTS: wf(2, 'polka'), MUST: wf(2, 'mustache'),
      TACKY: wf(3, 'tacky'), LESS2: wf(3, 'less'), TUES: wf(3, 'tuesday'), PIP: wf(4, 'pip'), RAISED: wf(4, 'raised'), UM: wf(4, 'um'), LESS3: wf(4, 'less'), MO: wf(5, 'captain'), CHEESE: wf(5, 'cheese'), THREE: wf(5, 'lighthouse'),
      LAMPS: wf(6, 'lamps'), FIVE: wf(6, 'five'), PICKED: wf(6, 'picked'), WRONG: wf(6, 'wrong'), UNLOAD: wf(7, 'unloaded'), HATES: wf(7, 'hates'), FRIDAY: wf(8, 'friday'), MAIL: wf(8, 'mail'), ICE: wf(8, 'ice'), YACHT: wf(8, 'reginald'),
      GARY: wf(9, 'gary'), ELEVEN: wf(9, 'eleven'), NEST: wf(9, 'nest'), WHAT: wf(10, 'what'), NIGHT: wf(11, 'night'), BLINKS: wf(11, 'blinks'), DAY: wf(11, 'daylight'), PAINT: wf(11, 'paint'),
      ONE: wf(12, 'one'), TWO: wf(12, 'two'), THREE2: wf(12, 'three'), FOUR: wf(12, 'four'), TAGS: wf(12, 'name'), MILES: wf(12, 'miles'), REPAINT: wf(13, 'repainted'), TUG: wf(13, 'tugboat'), TOWED: wf(13, 'towed'), STRAIGHT: wf(14, 'straight'), MUST2: wf(14, 'mustache') };
    // ================= Puffin Coast =================
    const G = K.group();
    K.add(new THREE.PlaneGeometry(800, 800), K.paint('#1a6a9a', { rough: 0.14, coat: 1 }), 0, WY, 0, G).rotation.x = -Math.PI / 2;
    K.slab(-30, 30, WY - 2, 0, -3, 12, K.mat('rock', '#a8a098', { detail: 0.6 }), G);                    // the quay (foreground)
    for (let x = -30; x < 30; x += 0.9) K.rbox(0.85, 0.35, 0.4, 0.05, K.mat('rock', '#c8c0b0', { detail: 0.4 }), x, 0.17, -2.8, G);   // quay edge stones
    for (const x of [-9, -3, 7, 13]) { const b = S.bollard(); b.position.set(x, 0, -2.2); }
    for (const x of [-12, 5]) { const l = S.streetLamp(); l.position.set(x, 0, 2.5); }
    const sb = S.board('PUFFIN COAST|5 LIGHTHOUSES', 2.4, 1.2, { frame: '#1f3a6a' }); sb.position.set(-5.5, 0, 1.0); sb.rotation.y = 0.3;
    const hut = S.building({ w: 6, d: 5, floors: 1, seed: 3, color: '#f4efe4', kind: 'plaster', gable: 'pitched', shop: 'DESIGN STUDIO', awning: ['#1a1a22', '#f4efe4'], shutters: '#1a1a22', flowers: true }); hut.position.set(-24, 0, 4); hut.rotation.y = Math.PI / 2;
    for (let k = 0; k < 6; k++) { const c = K.rbox(0.8, 0.6, 0.8, 0.04, K.mat('wood', '#a8703a'), -14 + k * 0.85, 0.3, 0.6, G); }
    for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(3 + hash(k) * 3, 1), K.mat('rock', '#6a7a6a', { detail: 1.5 })); r.position.set(-40 + k * 26, WY - 1, -60 - hash(k + 1) * 20); r.scale.set(2.5, 1.2, 1.5); G.add(r); }
    S.bake(G);
    const kinds = ['stripes', 'spiral', 'checkers', 'dots', 'mustache'];
    LH.forEach(([x, z], k) => TOW.push(tower(K, x, z, kinds[k], k * 10)));
    // Gary's nest on the mustache lighthouse gallery
    const nest = new THREE.Group(); const t5 = TOW[4]; nest.position.set(t5.g.position.x + 0.9, TH + 0.6, t5.g.position.z + 0.6); sc.add(nest); const nm = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 8, 16), K.mat('wood', '#a8803a', { detail: 0.1 })); nm.rotation.x = Math.PI / 2; nest.add(nm);
    // boats: the cheese boat (+ cheese crates), mail boat, ice cream boat, Reginald's yacht, the tug
    CHEESE = boat(K, '#f2a020', '#f4f2ee', 'CHEESE EXPRESS', 7);
    for (let k = 0; k < 6; k++) { const c = new THREE.Group(); CHEESE.add(c); c.position.set(0.8 + (k % 3) * 0.8, 0.95 + Math.floor(k / 3) * 0.6, (k % 2) * 0.5 - 0.25); K.rbox(0.7, 0.55, 0.7, 0.05, K.paint('#f2d040', { rough: 0.4 }), 0, 0, 0, c);
      for (let h = 0; h < 3; h++) K.sphere(0.07, K.paint('#d8b020'), -0.2 + h * 0.2, 0.1 - h * 0.05, 0.351, c, 1, 1, 0.2); CRATES.push(c); }
    for (let k = 0; k < 10; k++) { const c = new THREE.Group(); sc.add(c); K.rbox(0.7, 0.55, 0.7, 0.05, K.paint('#f2d040', { rough: 0.4 }), 0, 0.27, 0, c); for (let h = 0; h < 3; h++) K.sphere(0.07, K.paint('#d8b020'), -0.2 + h * 0.2, 0.37 - h * 0.05, 0.351, c, 1, 1, 0.2); c.position.set(LH[1][0] + 1.4 + (k % 4) * 0.72, 0.15 + Math.floor(k / 4) * 0.55, LH[1][1] + 2.2 + (k % 2) * 0.1); PILE.push(c); }
    MAIL = boat(K, '#c0392b', '#f4f2ee', 'MAIL', 5); ICE = boat(K, '#f28ab8', '#fdf6e4', 'ICE CREAM', 5);
    const cone = new THREE.Group(); ICE.add(cone); cone.position.set(-0.9, 2.6, 0); const cc = K.add(new THREE.ConeGeometry(0.35, 0.9, 16), K.paint('#d8a060'), 0, 0, 0, cone); cc.rotation.x = Math.PI; K.sphere(0.4, K.paint('#f8e0f0', { rough: 0.3 }), 0, 0.5, 0, cone);
    YACHT = boat(K, '#f4f2ee', '#1a1a22', 'LESS IS MORE', 8); TUG = boat(K, '#c0392b', '#f2c230', 'TUG', 4.5);
    ROLLER = new THREE.Group(); sc.add(ROLLER); K.cyl(0.1, 0.1, 0.5, K.paint('#f6f4ee'), 0, 0, 0, ROLLER, 12).rotation.z = Math.PI / 2; K.cyl(0.02, 0.02, 1.2, K.mat('wood', '#c8a070'), 0, -1.2, 0, ROLLER, 6);
    // ================= characters =================
    REG = K.stick({ jacket: '#1a1a22', pants: '#f4f2ee', hat: 'tophat', hatColor: '#1a1a22', glasses: '#1a1a1a', moustache: '#c8c0b8', bowtie: '#c0392b', vest: '#f4f2ee', scarf: '#f4f2ee' }, { key: 'reg' });
    PIP = K.stick({ jacket: '#f2c230', pants: '#2a5ac8', hat: 'cap', hatColor: '#2a5ac8', hairStyle: 'ponytail', hair: '#c8402a', glasses: true, pockets: true, belt: '#3a2418' }, { key: 'pip' });
    MO = K.stick({ jacket: '#1f3a6a', pants: '#2a2a30', hat: 'pilot', hatColor: '#f4f2ee', moustache: '#e8e4dc', scarf: '#c0392b', badge: true, build: 'stout' }, { key: 'mo' });
    KEEP = K.stick({ jacket: '#3a7a5a', pants: '#3a3a48', hat: 'beanie', hatColor: '#c0392b', moustache: '#6a3a1a', vest: '#c8a070', gloves: '#3a2418' }, { key: 'keep' });
    GARY = K.animal('pigeon', { seed: 4, scale: 3.2 });
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const night = f >= 1270 && f < 1345;
    // ---------- tower paint: patterns (start, flashback, Pip's repaint) or white ----------
    const flash = f >= 297 && f < 443 + 0;                      // flashback: they used to be colourful
    TOW.forEach((t, k) => { let pat = flash || f >= F.REPAINT - 4 + k * 4 || (f >= 1279 && f < 1409 ? false : false);
      if (f >= 1340 && f < 1653) pat = true;                    // explainer: the paint is the pattern
      if (f >= 443 && f < F.TUES) pat = !(k <= Math.floor((f - 443) / ((F.TUES - 443) / 5)));
      t.t.material = pat ? t.pat : t.wht;
      const on = night ? [[1, 0, 1, 0, 0, 0], [1, 1, 0, 0, 1, 1], [1, 0, 0, 1, 0, 0], [1, 1, 1, 0, 0, 0], [1, 0, 1, 0, 1, 0]][k][Math.floor(f / 6 + k) % 6] : 0;
      t.lamp.visible = !!on; t.lamp.scale.setScalar(2.2); });
    // ---------- boats ----------
    const cx = (g) => lerp(-30, -12, sm(685, 900, g)), cz = (g) => lerp(-8, LH[1][1] + 4.6, sm(850, 900, g));
    CHEESE.visible = f >= 685 && f < 979; CHEESE.position.set(cx(f), WY + 0.1 + 0.08 * Math.sin(f * 0.1), cz(f)); CHEESE.rotation.y = f >= 850 ? -0.6 * sm(850, 900, f) : 0; CHEESE.rotation.z = 0.03 * Math.sin(f * 0.08);
    CRATES.forEach((c, k) => { c.visible = f < F.UNLOAD + k * 6; });
    PILE.forEach((c, k) => { c.visible = f >= F.UNLOAD + k * 5 && f < 979; });
    const lost = (b, seed, cxp, czp, r, on) => { b.visible = on; if (on) { const a = f * 0.012 + seed; b.position.set(cxp + Math.cos(a) * r, WY + 0.1 + 0.08 * Math.sin(f * 0.1 + seed), czp + Math.sin(a) * r * 0.6); b.rotation.y = -a - Math.PI / 2; b.rotation.z = 0.04 * Math.sin(f * 0.09 + seed); } };
    lost(MAIL, 0, -4, -10, 5, f >= 979 && f < 1092); lost(ICE, 2.1, 6, -9, 4, f >= 979 && f < 1092);
    const ytow = f >= F.TUG - 4;
    if (ytow) { const x = lerp(-20, 4, sm(F.TUG - 4, 1778, f)); YACHT.visible = TUG.visible = f < 1778; YACHT.position.set(x - 7.5, WY + 0.1, -6); YACHT.rotation.set(0, 0, 0); TUG.position.set(x, WY + 0.1, -6); TUG.rotation.set(0, 0, 0); }
    else { lost(YACHT, 4.2, 14, -8, 4, f >= F.YACHT - 4 && f < 1092); TUG.visible = false; }
    // ---------- characters ----------
    let rp = { x: 1.0, z: 0.0, yaw: -0.3 };
    if (f < 138) rp = { x: 2.0, z: -14.0 + 1.6, y: 0.4, yaw: Math.PI + 0.2 };          // painting the last stripe (on Lighthouse Three's rock)
    if (f >= F.YACHT - 4 && f < 1092) { const ry = YACHT.rotation.y; rp = { x: YACHT.position.x - 3.0 * Math.cos(ry), z: YACHT.position.z + 3.0 * Math.sin(ry), y: YACHT.position.y + 0.8, yaw: ry + Math.PI / 2 }; }
    if (ytow && f < 1778) rp = { x: YACHT.position.x - 3.0, z: -6, y: WY + 0.85, yaw: 0.6 };
    if (f >= 1092 && f < F.TUG - 4) rp = { visible: false };
    if (f >= 685 && f < 979) rp = { visible: false };
    const rk = [[0, 'hammer', { expr: 'proud', R: [0.45, -1.0, 'hammer'] }], [F.LOST - 6, 'shrug', { expr: 'smug' }], [138, 'hips', { expr: 'smug' }], [F.LESS - 4, 'pointUp', { expr: 'proud', talk: true }], [F.WHY, 'cross', { expr: 'smug' }],
      [443, 'cross', { expr: 'smug' }], [F.TACKY - 4, 'stop', { expr: 'smug', talk: true }], [F.LESS2, 'pointUp', { expr: 'proud', talk: true }], [563, 'hips', { expr: 'smug' }], [F.LESS3 - 4, 'stop', { expr: 'smug', talk: true }],
      [979, 'panic', { expr: 'scared', sweat: true }], [F.TUG, 'facepalm', { expr: 'sad' }], [F.TOWED, 'sit', { expr: 'pained' }]];
    REG.set(T.act(f, rk, { seed: 3, blink: blink(3) }), { ...rp, seat: 0.4 });
    ROLLER.visible = f < 138; ROLLER.position.set(rp.x - 0.3, 2.2 + 0.4 * Math.sin(f * 0.25), (rp.z || 0) - 0.5);
    let pp = { x: -0.6, z: 0.6, yaw: 0.3 };
    if (f < 138) pp = { visible: false };
    if (f >= 685 && f < 1228) pp = { visible: false };
    if (f >= 1228 && f < 1279) pp = { x: -0.6, z: 0.6, yaw: 0.2 };
    if (f >= 1279 && f < 1653) pp = { x: -2.2, z: 0.4, yaw: -0.3 };
    if (f >= 1653) pp = { x: -1.4, z: -1.2, yaw: 0.2 };
    const pk = [[138, 'read', { expr: 'neutral', item: 'book' }], [F.WHY, 'shrug', { expr: 'confused' }], [443, 'facepalm', { expr: 'pained' }], [563, 'idle', { expr: 'nervous' }], [F.RAISED - 4, 'pointUp', { expr: 'nervous', talk: true }], [F.LESS3, 'idle', { expr: 'sad' }],
      [1228, 'think', { expr: 'confused' }], [1279, 'show', { expr: 'smile', talk: true }], [F.TAGS, 'point', { expr: 'grin' }], [1653, 'hammer', { expr: 'proud', R: [0.45, -1.0, 'hammer'] }], [F.TOWED, 'laugh', { expr: 'laugh' }], [1778, 'cheer', { expr: 'laugh' }]];
    PIP.set(T.act(f, pk, { seed: 6, blink: blink(6) }), pp);
    let mp = { visible: false };
    if (f >= 685 && f < 979) mp = { x: CHEESE.position.x - 1.0, z: CHEESE.position.z, y: CHEESE.position.y + 0.85, yaw: Math.PI / 2 - CHEESE.rotation.y };
    if (f >= 1580 && f < 1653) mp = { x: -10, z: -6, y: WY + 0.9, yaw: Math.PI };
    const mk = [[685, 'salute', { expr: 'grin' }], [F.LAMPS, 'lookAround', { expr: 'confused' }], [F.PICKED, 'point', { expr: 'proud' }], [F.WRONG, 'shock', { expr: 'shock' }], [F.UNLOAD, 'carry', { expr: 'grin', item: 'box' }], [F.HATES, 'shrug', { expr: 'confused' }],
      [1580, 'read', { expr: 'smile', item: 'paper' }], [F.MILES, 'salute', { expr: 'grin' }]];
    MO.set(T.act(f, mk, { seed: 8, blink: blink(8) }), mp);
    if (f >= 1580 && f < 1653) { MAIL.visible = true; MAIL.position.set(-9.5, WY + 0.1 + 0.08 * Math.sin(f * 0.1), -6); MAIL.rotation.set(0, Math.PI, 0); }
    KEEP.set(T.act(f, [[0, 'idle', { expr: 'neutral' }], [F.UNLOAD, 'shock', { expr: 'shock' }], [F.HATES - 4, 'stop', { expr: 'angry' }], [F.HATES + 15, 'cross', { expr: 'stern' }]], { seed: 9, blink: blink(9) }), f >= 850 && f < 979 ? { x: LH[1][0] + 0.6, z: LH[1][1] + 2.3, y: 0.15, yaw: 0.2 } : { visible: false });
    // Gary the pigeon: circles confused, lands on wrong towers, finally flies home to the mustache one
    let gp = { visible: false };
    if (f < 297) { const a = f * 0.05; gp = { x: 2 + Math.cos(a) * 3, z: -16 + Math.sin(a) * 3 + 3, y: TH + 3 + Math.sin(f * 0.2) * 0.3, yaw: -a, mode: 'stand', flap: true, expr: 'shock' }; }
    else if (f >= 1092 && f < 1228) { const k = Math.floor((f - 1092) / 30) % 4, ph = ((f - 1092) % 30) / 30, tt = TOW[[0, 1, 2, 3][k]].top, nx = TOW[[1, 2, 3, 0][k]].top;
      gp = ph < 0.6 ? { x: tt[0] + 0.9, z: tt[2] + 0.9, y: tt[1] - 0.8, yaw: 0.5, mode: 'stand', expr: 'sad' } : { x: lerp(tt[0], nx[0], (ph - 0.6) / 0.4), z: lerp(tt[2], nx[2], (ph - 0.6) / 0.4) + 1, y: tt[1] + 1.5, yaw: -1.2, mode: 'stand', flap: true, expr: 'shock' }; }
    else if (f >= 1778) { const t5 = TOW[4].top, u = sm(F.STRAIGHT - 4, F.MUST2, f); gp = { x: lerp(-4, t5[0] + 0.9, u), z: lerp(-4, t5[2] + 0.6, u), y: lerp(4, TH + 0.75, u), yaw: -0.9, mode: u < 1 ? 'stand' : 'sit', flap: u < 1, expr: 'happy' }; }
    GARY.set(f, gp);

    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const L = K.light('golden', { az: 70, el: 30, shadowExt: 40, exposure: 1.25 }), LN = K.light('night', { exposure: 1.4 });
    const tw = (k, y0 = -0.5, y1 = TH + 3) => { const [x, z] = LH[k]; return [[x - 2.2, y0, z], [x + 2.2, y1, z]]; };
    const body = (p, h = 1.95) => [[p.x, p.y || 0, p.z], [p.x, (p.y || 0) + h, p.z]];
    let light = night ? LN : L;
    if (sh(0, 70)) {                           // 1. Reginald rolls the last tower white; Gary circles, lost (wide on two white towers)
      cam = fitT(K, [...tw(2), ...body(rp), [gp.x || 2, (gp.y || 12) + 0.5, gp.z || -14]], { yaw: 80, pitch: 4, fov: 44 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(70, 138)) {                  // 2. even the pigeon got lost: Gary circles Lighthouse Three's lantern
      cam = fitT(K, [[-1, TH - 1, -16], [5, TH + 4, -16], [gp.x || 2, gp.y || 12, gp.z || -14]], { yaw: 70, pitch: -6, fov: 42 }); cam.fov *= K.punch(f, F.LOST, 0.08, 6);
    } else if (sh(138, 200)) {                 // 3. Sir Reginald, the world's fanciest designer, on the quay (full) — Pip behind
      cam = fitT(K, [...body(rp), ...body(pp), [-5.5, 2.6, 1.0]], { yaw: 75, pitch: 6, fov: 40 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(200, 297)) {                 // 4. "Less is more!" — a plain white tower behind him (why stripes?)
      cam = fitT(K, [...body(rp), ...tw(2)], { yaw: 95, pitch: 4, fov: 44 });
    } else if (sh(297, 345)) {                 // 5. flashback: stripes + spiral
      cam = fitT(K, [...tw(0), ...tw(1)], { yaw: lerp(80, 95, u), pitch: 4, fov: 44 });
    } else if (sh(345, 395)) {                 // 6. checkers + polka dots
      cam = fitT(K, [...tw(2), ...tw(3)], { yaw: lerp(85, 100, u), pitch: 4, fov: 44 });
    } else if (sh(395, 443)) {                 // 7. ...and one with a mustache
      cam = fitT(K, [...tw(4)], { yaw: 90, pitch: 2, fov: 40, margin: 1.3 }); cam.fov *= K.punch(f, F.MUST, 0.1, 6);
    } else if (sh(443, 505)) {                 // 8. "Tacky." Reginald, nose in the air (full shot)
      cam = fitT(K, [...body(rp), ...body(pp), [3, 0, -2.6]], { yaw: 65, pitch: 6, fov: 40 });
    } else if (sh(505, 563)) {                 // 9. by Tuesday, all five white (wide pan along the coast)
      cam = fitT(K, [...tw(0), ...tw(4), ...tw(2)], { yaw: lerp(82, 98, u), pitch: 6, fov: 46, margin: 1.05 });
    } else if (sh(563, 625)) {                 // 10. Pip raises her hand (both, full)
      cam = fitT(K, [...body(rp), ...body(pp), [0, 2.4, 0.6]], { yaw: 100, pitch: 6, fov: 40 });
    } else if (sh(625, 685)) {                 // 11. "Less is more, Pip." (Pip reaction close)
      cam = { pos: [pp.x + 0.4, 1.55, pp.z + 2.2], look: [pp.x, 1.55, pp.z], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.2, cinf: 12 };
    } else if (sh(685, 745)) {                 // 12. Captain Mo sails in with four tons of cheese (tracking, wide)
      const tc = K.track(f, (g) => [cx(g), WY, cz(g)], { off: [1.5, 3.5, 13], lag: 5, lookY: 1.6 }); cam = { ...tc, fov: 44 };
    } else if (sh(745, 795)) {                 // 13. insert: the cheese crates on deck
      cam = fitT(K, [[cx(f) + 0.3, WY + 0.6, cz(f)], [cx(f) + 2.8, WY + 2.2, cz(f)], [cx(f) - 1.2, WY + 2.8, cz(f)]], { yaw: 75, pitch: 12, fov: 40 });
    } else if (sh(795, 850)) {                 // 14. daylight, lamps off: five white towers ahead (over Mo's shoulder, wide)
      cam = { pos: [cx(f) - 3.5, WY + 3.4, cz(f) + 2.5], look: [2, 5, -18], fov: 48 }; dof = { focus: 18, cinf: 2 };
    } else if (sh(850, 903)) {                 // 15. he picked one. Wrong. (wide, the boat turns to Lighthouse Two)
      cam = fitT(K, [...tw(1), [cx(f) - 3, WY, cz(f)], [cx(f) + 4, WY + 3, cz(f)]], { yaw: 70, pitch: 8, fov: 44 }); cam.fov *= K.punch(f, F.WRONG, 0.1, 6);
    } else if (sh(903, 979)) {                 // 16. the cheese piles up for a keeper who hates cheese (wide on the rock)
      cam = fitT(K, [[LH[1][0] - 0.5, 0, LH[1][1] + 2.2], [LH[1][0] + 4, 2.4, LH[1][1] + 2.4], [cx(f), WY + 2, cz(f)]], { yaw: 80, pitch: 10, fov: 42 }); cam.fov *= K.punch(f, F.HATES, 0.08, 6);
    } else if (sh(979, 1035)) {                // 17. by Friday: the mail boat and the ice cream boat go round in circles (high wide)
      cam = fitT(K, [[-9, WY, -13], [10, WY + 3, -5], ...tw(2)], { yaw: 80, pitch: 26, fov: 46 });
    } else if (sh(1035, 1092)) {               // 18. ...and Reginald's own yacht (tracking it, Reginald panicking)
      cam = fitT(K, [[YACHT.position.x - 4.5, WY, YACHT.position.z], [YACHT.position.x + 4.5, WY + 3.2, YACHT.position.z], ...tw(3)], { yaw: 75, pitch: 8, fov: 44 });
    } else if (sh(1092, 1160)) {               // 19. Gary lands on the wrong lighthouse (eleven times)
      cam = fitT(K, [...tw(0, TH - 2, TH + 4), ...tw(1, TH - 2, TH + 4), [gp.x, gp.y, gp.z]], { yaw: lerp(74, 88, u), pitch: 4, fov: 44 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(1160, 1228)) {               // 20. he wanted his nest (Gary close on a wrong gallery)
      cam = fitT(K, [[gp.x - 1.2, gp.y - 0.4, gp.z], [gp.x + 1.2, gp.y + 1.0, gp.z]], { yaw: lerp(68, 82, u), pitch: 8, fov: 40, margin: 1.6 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1228, 1279)) {               // 21. so what were the tacky stripes for? Pip thinks (medium)
      cam = fitT(K, [...body(pp), ...tw(2)], { yaw: 105, pitch: 4, fov: 44 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(1279, 1340)) {               // 22. at night: each light blinks its own pattern (wide, night)
      cam = fitT(K, [...tw(0), ...tw(4), ...tw(2)], { yaw: 90, pitch: 6, fov: 46, margin: 1.05 }); light = LN;
    } else if (sh(1340, 1409)) {               // 23. in daylight the paint is the pattern (towers pop their colours)
      cam = fitT(K, [...tw(1), ...tw(2), ...tw(3)], { yaw: lerp(95, 85, u), pitch: 4, fov: 46 });
    } else if (sh(1409, 1455)) {               // 24. stripes = Lighthouse One
      cam = fitT(K, [...tw(0)], { yaw: lerp(74, 88, u), pitch: 4, fov: 40, margin: 1.35 }); cam.fov *= K.push(u, 0.06); cam.fov *= K.punch(f, F.ONE, 0.08, 6);
    } else if (sh(1455, 1500)) {               // 25. the spiral is Two
      cam = fitT(K, [...tw(1)], { yaw: lerp(100, 88, u), pitch: 4, fov: 40, margin: 1.35 }); cam.fov *= K.push(u, 0.06); cam.fov *= K.punch(f, F.TWO, 0.08, 6);
    } else if (sh(1500, 1580)) {               // 26. checkers Three, polka dots Four
      cam = fitT(K, [...tw(2), ...tw(3)], { yaw: lerp(80, 92, u), pitch: 4, fov: 44 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1580, 1653)) {               // 27. name tags, from three miles out: Mo reads them through his telescope (wide from the boat)
      cam = fitT(K, [...body(mp), [-11, WY, -6], [-8, WY + 1, -6], ...tw(0), ...tw(1)], { yaw: 70, pitch: 4, fov: 46 });
    } else if (sh(1653, 1715)) {               // 28. Pip repainted all five by Monday (quay, towers behind)
      cam = fitT(K, [...body(pp), ...tw(2), ...tw(1)], { yaw: lerp(86, 94, u), pitch: 6, fov: 44 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1715, 1778)) {               // 29. a tugboat tows Sir Reginald home (tracking, wide)
      cam = fitT(K, [[TUG.position.x - 0.5, WY, -6], [YACHT.position.x - 3.5, WY + 3.2, -6]], { yaw: 70, pitch: 30, fov: 42 });
    } else if (sh(1778, 1850)) {               // 30. Gary flies straight to his nest — the one with the mustache
      cam = fitT(K, [...tw(4, 2, TH + 3), [gp.x, gp.y, gp.z]], { yaw: lerp(76, 86, u), pitch: 4, fov: 42 }); cam.fov *= K.push(u, 0.1);
    } else { u = clamp((f - 1850) / 70, 0, 1);                                   // 31. pull back: all five lighthouses in their colours (loops to the start)
      cam = fitT(K, [...tw(0), ...tw(4), ...tw(2), [0, 0, 0]], { yaw: lerp(96, 78, u), pitch: lerp(4, 14, u), fov: 46, margin: 1.05 });
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 3 };
    // ---------- effects + graphics ----------
    if (f >= 685 && f < 979) K.steam(f, () => [CHEESE.position.x - 1.3, CHEESE.position.y + 3.0, CHEESE.position.z], { rate: 3, size: 0.5, dark: 0.3, rise: 1.5 });
    K.mist(f, 289, 14); K.mist(f, 435, 14); K.mist(f, 1271, 14); K.mist(f, 1337, 14);
    K.badge(f, F.WHY, 'WHY STRIPES?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 295 });
    K.badge(f, F.TUES, 'ALL 5 WHITE', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 561 });
    K.badge(f, F.CHEESE, '4 TONS OF CHEESE', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 793 });
    K.badge(f, F.WRONG, 'WRONG LIGHTHOUSE', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 901 });
    K.badge(f, F.ELEVEN, '11 WRONG LANDINGS', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1226 });
    K.badge(f, F.BLINKS, 'NIGHT: LIGHT PATTERN', { sx: 0.5, sy: 0.17 }, { icon: 'bolt', f1: 1407 });
    K.badge(f, F.PAINT, 'DAY: PAINT PATTERN', { sx: 0.5, sy: 0.23 }, { icon: 'check', f1: 1407 });
    if (f >= 1409 && f < 1653) K.hud(f, 1409, { stages: 4, labels: ['1 STRIPES', '2 SPIRAL', '3 CHECKS', '4 DOTS'], u: f < F.TWO ? 0.12 : f < F.THREE2 ? 0.38 : f < F.FOUR ? 0.62 : 0.88, f1: 1651 });
    K.badge(f, F.TAGS, 'LIKE NAME TAGS', { sx: 0.5, sy: 0.24 }, { icon: 'check', f1: 1651 });
    K.badge(f, F.MUST2, 'HOME', [LH[4][0] + 0.9, TH + 1.8, LH[4][1] + 0.6], { style: 'stamp', size: 1.2 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
