// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Airplane Windows Are Round" — invented story, engine: The Overconfident Expert (SCRIPTS.md §000).
// Vain designer Gordon Glitz gives his jet 40 square windows (with curtains); intern Pia silently holds up a donut.
// Test flight with pilot Doug + 300 belted rubber chickens: cracks start at every corner, duct-tape signature fix fails,
// window seven pops out like toast -> x-ray: the push piles up in a sharp corner -> round windows; the donut goes on the tail.
import { TOTAL, LINES, wf } from './squarejet_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let WINB = [];
let THREE, GORDON, PIA, DOUG, JET, WIN = [], RWIN = [], TAILFACE = [], TAILDONUT = [], CRACKS = [], CLOUDS, CAB, CABSQ = [], CABRD = [], CABCR = [], TAPE, HOLE, FLYCH = [], DOORCH = [],
  HOLO, ARROWS = [], HOT = [], RING, EXTRAS = [], LIFT;
let F = {};
const R = 2.0, NW = 20, WX = (i) => -10.6 + i * 1.08, WY = 0.3, WS = 0.8, I7 = 13;
const GROUND_Y = 2.6, FLY = [600, 120, 0], CX = 400;          // flight spot (no ground below), cabin set at x = 400

// ---------- canvas textures ----------
function canvasMat(w, h, draw, o = {}) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return o.basic ? new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    : new THREE.MeshStandardMaterial({ map: t, roughness: 0.35, transparent: !!o.alpha, side: THREE.DoubleSide }); }
const faceTex = (g, w, h) => { g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2c230'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.46, 0, 7); g.fill();
  g.lineWidth = 14; g.strokeStyle = '#1a1a22'; g.stroke(); g.fillStyle = '#f6d2b0'; g.beginPath(); g.ellipse(w / 2, h * 0.54, w * 0.27, h * 0.3, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = '#3a2418'; g.beginPath(); g.ellipse(w * 0.46, h * 0.28, w * 0.3, h * 0.12, -0.25, 0, 7); g.fill(); g.stroke();                       // swoosh hair
  g.lineWidth = 9; for (const x of [0.4, 0.6]) { g.beginPath(); g.arc(w * x, h * 0.5, w * 0.07, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(w * 0.47, h * 0.5); g.lineTo(w * 0.53, h * 0.5); g.stroke();
  g.fillStyle = '#1a1a22'; for (const x of [0.4, 0.6]) { g.beginPath(); g.arc(w * x, h * 0.51, 7, 0, 7); g.fill(); }
  g.lineWidth = 10; g.beginPath(); g.arc(w / 2, h * 0.63, w * 0.12, 0.2, Math.PI - 0.2); g.stroke();                                                     // smug grin
  g.fillStyle = '#ffffff'; for (const [x, y] of [[0.2, 0.2], [0.8, 0.25], [0.78, 0.8]]) { g.beginPath(); g.moveTo(w * x, h * y - 22); g.lineTo(w * x + 7, h * y); g.lineTo(w * x, h * y + 22); g.lineTo(w * x - 7, h * y); g.fill(); } };
const donutTex = (g, w, h) => { g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h); g.lineWidth = 14; g.strokeStyle = '#1a1a22';
  g.fillStyle = '#d8a05a'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.42, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#f08ab8'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.36, 0, 7); g.fill();
  const cols = ['#ffffff', '#2a9ab8', '#f2c230', '#3ab04a']; for (let i = 0; i < 40; i++) { const a = hash(i) * 6.28, r = w * (0.2 + hash(i + 3) * 0.14); g.fillStyle = cols[i % 4]; g.save(); g.translate(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); g.rotate(hash(i + 9) * 3); g.fillRect(-9, -3, 18, 6); g.restore(); }
  g.fillStyle = '#f4f2ee'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.13, 0, 7); g.fill(); g.stroke(); };
const crackTex = (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#141418'; g.lineCap = 'round'; g.lineJoin = 'round';
  const zig = (x0, y0, ang, n, len, lw, s) => { let x = x0, y = y0; g.lineWidth = lw; g.beginPath(); g.moveTo(x, y);
    for (let i = 0; i < n; i++) { const a = ang + (i % 2 ? 0.55 : -0.55) + (hash(s + i) - 0.5) * 0.4; x += Math.cos(a) * len; y -= Math.sin(a) * len; g.lineTo(x, y); } g.stroke(); return [x, y]; };
  zig(4, h - 4, Math.PI / 4, 7, w * 0.17, 10, 1); zig(w * 0.35, h * 0.62, Math.PI / 4 + 0.6, 3, w * 0.1, 6, 7); zig(w * 0.5, h * 0.45, Math.PI / 4 - 0.6, 3, w * 0.1, 5, 13); };
const sigTex = (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#a8acb4'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 34;
  g.font = `italic 900 ${h * 0.62}px Arial Black, Arial`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.strokeText('Gordon', w / 2, h * 0.48); g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.35)'; g.strokeText('Gordon', w / 2, h * 0.48);
  g.lineWidth = 30; g.strokeStyle = '#a8acb4'; g.beginPath(); g.moveTo(w * 0.1, h * 0.85); g.bezierCurveTo(w * 0.4, h * 0.72, w * 0.6, h * 0.98, w * 0.92, h * 0.8); g.stroke(); };

// ---------- the rubber chicken (faces +x) ----------
let CHM;
function chicken(parent, belt = true) { const g = new THREE.Group(); parent.add(g);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), CHM.y); b.scale.set(1.25, 0.85, 0.8); b.position.set(0, 0.17, 0); g.add(b);
  const nk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.36, 10), CHM.y); nk.position.set(0.13, 0.38, 0); nk.rotation.z = -0.25; g.add(nk);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), CHM.y); hd.position.set(0.18, 0.57, 0); g.add(hd);
  const bk = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 8), CHM.o); bk.rotation.z = -Math.PI / 2; bk.position.set(0.29, 0.56, 0); g.add(bk);
  for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), CHM.r); c.position.set(0.15 + i * 0.035, 0.64 + (i === 1 ? 0.012 : 0), 0); g.add(c); }
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), CHM.k); e.position.set(0.235, 0.59, s * 0.045); g.add(e); }
  for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6), CHM.o); l.position.set(0.12, 0.08, s * 0.07); l.rotation.z = 1.2; g.add(l); }
  if (belt) { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.34), CHM.belt); bl.position.set(0.15, 0.18, 0); g.add(bl); const bu = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.08), CHM.ch); bu.position.set(0.18, 0.18, 0); g.add(bu); }
  g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return g; }

function windowSq(K, parent, x, side, i, mats) {       // a square window with chrome frame and red curtains (side +1 = +z)
  const g = new THREE.Group(); g.position.set(x, WY, side * R); if (side < 0) g.rotation.y = Math.PI; parent.add(g);
  K.rbox(WS, WS, 0.06, 0.04, mats.glass, 0, 0, 0.0, g);
  const cl = K.rbox(0.42, WS * 0.95, 0.02, 0.01, mats.curt, -WS / 2 + 0.21, 0, 0.045, g), cr = K.rbox(0.42, WS * 0.95, 0.02, 0.01, mats.curt, WS / 2 - 0.21, 0, 0.045, g);
  for (const [w, h, xx, yy] of [[WS + 0.16, 0.09, 0, WS / 2 + 0.04], [WS + 0.16, 0.09, 0, -WS / 2 - 0.04], [0.09, WS + 0.16, WS / 2 + 0.04, 0], [0.09, WS + 0.16, -WS / 2 - 0.04, 0]]) K.rbox(w, h, 0.07, 0.03, mats.chrome, xx, yy, 0.06, g);
  for (const [xx, yy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const rv = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), mats.gold); rv.position.set(xx * (WS / 2 + 0.04), yy * (WS / 2 + 0.04), 0.1); g.add(rv); }
  const cracks = []; if (side > 0) for (let k = 0; k < 4; k++) { const cg = new THREE.Group(); const sx = k === 1 || k === 2 ? 1 : -1, sy = k >= 2 ? 1 : -1; cg.position.set(sx * (WS / 2 + 0.08), sy * (WS / 2 + 0.08), 0.11); cg.rotation.z = Math.atan2(sy, sx) - Math.PI / 4; g.add(cg);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), mats.crack); pl.position.set(0.45, 0.45, 0); pl.userData.ndSkip = true; cg.add(pl); cg.scale.setScalar(0.001); cracks.push(cg); }
  return { g, cl, cr, cracks, i };
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { GLITZ: wf(0, 'glitz'), FORTY: wf(0, 'forty'), SQUARE: wf(0, 'square'), CURT: wf(0, 'curtains'), TEST: wf(1, 'test'), FACE: wf(1, 'face'), TAIL: wf(1, 'tail'),
      DONUT: wf(2, 'donut'), IGN: wf(2, 'ignored'), ELEVEN: wf(3, 'eleven'), BEST: wf(3, 'best'), HAIR: wf(3, 'hair'), TOOK: wf(4, 'took'), DOUG: wf(4, 'doug'), THREE: wf(4, 'three'), BELTS: wf(4, 'belts'),
      HIGH: wf(5, 'high'), CRACK: wf(5, 'crack'), CORNER: wf(5, 'corner'), EVERY: wf(6, 'every'), CRACKED: wf(6, 'cracked'), TODDLER: wf(6, 'toddler'), FIX: wf(7, 'fix'), ROLLS: wf(7, 'rolls'), SIG: wf(7, 'signature'),
      SEVEN: wf(8, 'seven'), POPPED: wf(8, 'popped'), TOAST: wf(8, 'toast'), TWELVE: wf(8, 'twelve'), LEFT: wf(8, 'left'), WHY: wf(9, 'why'), INSIDE: wf(9, 'inside'), PUSHES: wf(9, 'pushes'),
      SHARP: wf(10, 'sharp'), POINT: wf(10, 'point'), CROWD: wf(10, 'crowd'), DOORWAY: wf(10, 'doorway'), ROUND: wf(11, 'round'), NOWHERE: wf(11, 'nowhere'), START: wf(11, 'start'), PIAS: wf(12, 'pia'), EVTAIL: wf(12, 'tail'), SEAT: wf(12, 'seat') };
    CHM = { y: K.paint('#f6d22a', { rough: 0.35 }), o: K.paint('#f08a24', { rough: 0.4 }), r: K.paint('#d8202a', { rough: 0.4 }), k: K.paint('#141418', { rough: 0.3 }), belt: K.paint('#2a3a5a', { rough: 0.6 }), ch: K.chrome() };
    const white = K.paint('#f6f4f0', { rough: 0.22 }), blue = K.paint('#1f4aa8', { rough: 0.25 }), gold = K.gold(), chrome = K.chrome(), dark = K.paint('#2a2c34', { rough: 0.4 });
    const mats = { glass: K.paint('#2c3e52', { rough: 0.08, metal: 0.4, coat: 1 }), curt: K.mat('fabric', '#c0392b'), chrome, gold, crack: canvasMat(256, 256, crackTex, { basic: true }) };
    mats.crack.color = new THREE.Color('#ffffff');
    // ================= the jet (hero prop): local frame, fuselage axis = x, nose at +x =================
    JET = new THREE.Group(); sc.add(JET); const JS = new THREE.Group(); JET.add(JS);       // JS = static parts (baked)
    const fus = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 26, 56, 1, true), white); fus.rotation.z = Math.PI / 2; JS.add(fus);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 28, 0, Math.PI * 2, 0, Math.PI / 2), white); nose.rotation.z = -Math.PI / 2; nose.scale.set(1, 1.8, 1); nose.position.x = 13; JS.add(nose);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(R, 7, 48, 1, true), white); tail.rotation.z = Math.PI / 2; tail.position.set(-16.5, 0.5, 0); tail.scale.set(1, 1, 1); JS.add(tail);
    for (const s of [-1, 1]) { K.rbox(26, 0.22, 0.05, 0.02, blue, 0, -0.62, s * 1.9, JS); K.rbox(26, 0.08, 0.05, 0.02, gold, 0, -0.88, s * 1.8, JS); K.rbox(26, 0.06, 0.05, 0.02, gold, 0, 1.0, s * 1.74, JS); }
    for (const z of [-0.55, 0, 0.55]) { const ws = K.rbox(0.05, 0.42, 0.5, 0.04, mats.glass, 15.9, 0.75, z, JS); ws.rotation.z = -0.75; ws.rotation.y = z * 0.9; }   // cockpit windows
    for (let k = 0; k < 6; k++) K.rbox(0.03, 0.03, 4.04, 0.01, K.paint('#d8dadc', { rough: 0.3 }), -11.5 + k * 4.6, 0, 0, JS).visible = false;
    for (const x of [-12.2, -8, -4, 0, 4, 8, 12]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.005, 0.012, 6, 64), K.paint('#cfd2d6', { rough: 0.35 })); ring.rotation.y = Math.PI / 2; ring.position.x = x; JS.add(ring); }  // panel seams
    const door = K.rbox(1.0, 1.9, 0.05, 0.08, K.paint('#e8e6e2', { rough: 0.3 }), 11.6, 0.1, 1.98, JS); K.rbox(0.18, 0.05, 0.06, 0.02, chrome, 11.25, 0.1, 2.02, JS);
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.9), S.textMat('GLITZ AIR', { bg: '#f6f4f0', fg: '#1f4aa8', w: 1024, h: 160, border: false })); logo.position.set(2, -1.22, 1.58); logo.rotation.x = 0.66; JS.add(logo);
    // wings, engines, stabilizers, tail fin
    for (const s of [-1, 1]) { const wg = K.rbox(5.2, 0.32, 13, 0.12, white, 0, -1.1, s * 8.2, JS); wg.rotation.y = s * 0.42; const tip = K.rbox(1.0, 1.4, 0.18, 0.08, blue, -2.6, -0.4, s * 14.2, JS); tip.rotation.z = -0.3;
      const eng = new THREE.Group(); eng.position.set(2.2, -1.9, s * 5.6); JS.add(eng); const nac = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.7, 3.6, 32), white); nac.rotation.z = Math.PI / 2; eng.add(nac);
      const lip = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.09, 12, 36), chrome); lip.rotation.y = Math.PI / 2; lip.position.x = 1.8; eng.add(lip);
      const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.05, 32), dark); fan.rotation.z = Math.PI / 2; fan.position.x = 1.7; eng.add(fan); const sp = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 16), chrome); sp.rotation.z = -Math.PI / 2; sp.position.x = 1.95; eng.add(sp);
      K.rbox(3.4, 0.1, 0.1, 0.03, gold, 0, 0.6, 0, eng);
      const hs = K.rbox(2.6, 0.18, 5.0, 0.08, white, -17.2, 0.7, s * 2.8, JS); hs.rotation.y = s * 0.45; }
    const fin = new THREE.Group(); fin.position.set(-17.3, 1.4, 0); JS.add(fin); const fn = K.rbox(4.2, 5.4, 0.3, 0.14, blue, 0, 2.7, 0, fin); fn.rotation.z = 0.0;
    const fpos = new THREE.Group(); fin.add(fpos); fin.rotation.z = 0.35; for (const s of [-1, 1]) K.rbox(4.3, 0.12, 0.34, 0.05, gold, 0, 0.1, 0, fin);
    // tail art (Gordon's face -> the donut) on both sides of the fin
    const fm = canvasMat(512, 512, faceTex), dm = canvasMat(512, 512, donutTex);
    const ART = new THREE.Group(); ART.position.copy(fin.position); ART.rotation.z = 0.35; JET.add(ART);
    for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.CircleGeometry(1.55, 48), fm); a.position.set(0.1, 2.9, s * 0.17); if (s < 0) a.rotation.y = Math.PI; ART.add(a); TAILFACE.push(a);
      const d = new THREE.Mesh(new THREE.CircleGeometry(1.55, 48), dm); d.position.set(0.1, 2.9, s * 0.17); if (s < 0) d.rotation.y = Math.PI; ART.add(d); TAILDONUT.push(d); }
    // landing gear
    const gear = new THREE.Group(); JET.add(gear); JET.gear = gear;
    for (const [x, zs] of [[10.5, [0]], [-1.5, [-1.6, 1.6]]]) for (const z of zs) { const st = K.cyl(0.1, 0.1, 1.6, chrome, x, -2.6 + 0.5, z, gear, 10);
      for (const dz of [-0.28, 0.28]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.32, 24), K.paint('#1d1d22', { rough: 0.8 })); w.rotation.x = Math.PI / 2; w.position.set(x, -2.6 + 0.48, z + dz); gear.add(w);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 16), chrome); hub.rotation.x = Math.PI / 2; hub.position.copy(w.position); gear.add(hub); } }
    S.bake(JS);
    // windows: 20 square per side (+z side animated), 20 round per side (the final jet)
    for (let i = 0; i < NW; i++) for (const s of [1, -1]) { const w = windowSq(K, JET, WX(i), s, i, mats); if (s > 0) { WIN.push(w); CRACKS.push(...w.cracks.map((c) => ({ c, i }))); } else WINB.push(w); }
    const RG = new THREE.Group(); JET.add(RG); JET.RG = RG;
    for (let i = 0; i < NW; i++) for (const s of [1, -1]) { const g = new THREE.Group(); g.position.set(WX(i), WY, s * R); if (s < 0) g.rotation.y = Math.PI; RG.add(g);
      const gl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32), mats.glass); gl.rotation.x = Math.PI / 2; g.add(gl); const rg = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.05, 12, 40), chrome); rg.position.z = 0.05; g.add(rg);
      const pl = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 40), gold); pl.position.z = 0.04; g.add(pl); }
    RING = K.trace(Array.from({ length: 41 }, (_, k) => [WX(9) + Math.cos(k / 40 * Math.PI * 2) * 0.5, WY + Math.sin(k / 40 * Math.PI * 2) * 0.5, R + 0.14]), { parent: JET, color: '#7af8ff', r: 0.035 });
    // x-ray: a glowing box around the cabin + push arrows on the windows + hot corners
    HOLO = K.holoBox(23, 4.2, 4.2, -0.4, 0, 0, JET, '#36e2ff');
    for (let i = 2; i < NW; i += 3) { const g = new THREE.Group(); JET.add(g); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a3a').multiplyScalar(1.8), toneMapped: false });
      const shf = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 10), m); shf.rotation.x = Math.PI / 2; shf.position.z = 0.45; g.add(shf); const hd = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.35, 12), m); hd.rotation.x = Math.PI / 2; hd.position.z = 1.0; g.add(hd);
      g.position.set(WX(i), WY, R - 0.2); g.traverse((o) => { o.userData.ndSkip = true; }); ARROWS.push(g); }
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3a2a').multiplyScalar(2.2), toneMapped: false, transparent: true }));
      m.position.set(WX(9) + sx * (WS / 2 + 0.02), WY + sy * (WS / 2 + 0.02), R + 0.16); m.userData.ndSkip = true; JET.add(m); HOT.push(m); }
    // flying-out chickens (window seven)
    for (let k = 0; k < 12; k++) FLYCH.push(chicken(JET, false));
    // ================= airport apron =================
    const AG = K.group();
    K.slab(-160, 160, -0.3, 0, -120, 120, K.mat('grime', '#8aa858', { amt: 0.6 }), AG, false);
    K.slab(-140, 140, 0, 0.02, -14, 14, K.mat('rock', '#8a8a90', { detail: 2.2 }), AG, false);                                    // runway/apron
    K.slab(-60, 40, 0, 0.02, 14, 34, K.mat('rock', '#9a989c', { detail: 2.0 }), AG, false);
    for (let x = -130; x < 140; x += 9) K.slab(x, x + 4.5, 0.02, 0.035, -0.18, 0.18, K.paint('#f4f2ee', { rough: 0.6 }), AG, false);        // centre dashes
    for (const z of [-12.5, 12.5]) K.slab(-140, 140, 0.02, 0.035, z - 0.15, z + 0.15, K.paint('#f4f2ee', { rough: 0.6 }), AG, false);
    for (let k = 0; k < 8; k++) K.slab(-128 + k * 1.2, -127.4 + k * 1.2, 0.02, 0.035, -10, 10, K.paint('#f4f2ee', { rough: 0.6 }), AG, false);
    K.slab(-50, 30, 0.02, 0.035, 16.8, 17.1, K.paint('#f2c230', { rough: 0.6 }), AG, false);                                                   // yellow taxi line
    for (let x = -120; x <= 120; x += 6) for (const z of [-13.6, 13.6]) { const l = K.cyl(0.08, 0.1, 0.35, K.paint('#5a5c62'), x, 0, z, AG, 8); const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(z < 0 ? '#ffd27a' : '#7ad0ff').multiplyScalar(1.8) })); b.position.set(x, 0.4, z); AG.add(b); }
    // hangar (arched roof), terminal, control tower
    const hg = new THREE.Group(); hg.position.set(-28, 0, 44); AG.add(hg);
    const arch = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 30, 40, 1, true, -Math.PI / 2, Math.PI), K.mat('metal', '#b8bcc4', { detail: 0.6 })); arch.rotation.z = Math.PI / 2; arch.rotation.y = Math.PI / 2; arch.position.y = 0; arch.material.side = THREE.DoubleSide; hg.add(arch);
    K.slab(-14, 14, 0, 9, -15.2, -14.8, K.mat('plaster', '#e8e2d8'), hg); const hs_ = new THREE.Mesh(new THREE.PlaneGeometry(12, 2.2), S.textMat('HANGAR 2  ·  GLITZ AIR', { bg: '#1f4aa8', fg: '#ffffff', w: 1024, h: 180, border: false })); hs_.position.set(0, 10.5, -15.3); hs_.rotation.y = Math.PI; hg.add(hs_);
    for (let k = 0; k < 6; k++) K.slab(-12 + k * 4, -10 + k * 4, 0, 7.5, -15.3, -15.25, K.paint('#4a5a6a', { rough: 0.4 }), hg);
    let tx = 6; for (let i = 0; i < 4; i++) { const w = 9 + (i % 2) * 3; const b = S.building({ w, d: 10, floors: 2 + (i % 2), seed: 40 + i, color: ['#e8dcc8', '#d8e4ee', '#f0d8b8', '#e0e0e8'][i], kind: 'plaster', gable: 'flat', shop: i === 1 ? 'TERMINAL' : i === 2 ? 'CAFE  ·  GATES 1-9' : null, awning: ['#1f4aa8', '#ffffff'] }); b.position.set(tx + w / 2, 0, 38); b.rotation.y = Math.PI; tx += w + 0.3; }
    const tw = new THREE.Group(); tw.position.set(30, 0, 30); AG.add(tw); K.cyl(1.3, 1.7, 16, K.mat('plaster', '#e8e4dc'), 0, 0, 0, tw, 24);
    const cab = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 2.4, 2.6, 16), K.glass({ color: '#9ad0e8', opacity: 0.55 })); cab.position.y = 17.4; tw.add(cab); K.cyl(3.2, 3.2, 0.4, white, 0, 18.7, 0, tw, 24); K.cyl(0.08, 0.08, 3, chrome, 0, 19, 0, tw, 8);
    const ws_ = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 16, 1, true), S.textMat('', { bg: '#f08a24', border: false })); ws_.rotation.z = Math.PI / 2; ws_.position.set(-46, 5.2, 16); sc.add(ws_); K.cyl(0.06, 0.06, 5.2, chrome, -45, 0, 16, AG, 8);
    // fence + trees beyond the runway
    for (let x = -150; x < 150; x += 3) { K.cyl(0.05, 0.05, 2, K.paint('#6a6c70'), x, 0, -22, AG, 6); } K.slab(-150, 150, 0.2, 2, -22.02, -21.98, K.glass({ color: '#9aa0a8', opacity: 0.25 }), AG, false);
    for (let k = 0; k < 40; k++) { const t = S.tree({ h: 5 + hash(k) * 3, seed: k + 3 }); t.position.set(-140 + k * 7 + hash(k + 1) * 3, 0, -27 - hash(k + 2) * 8); }
    // apron props: cones, baggage carts, fuel truck, stairs truck, sign board, trophy table, scissor lift
    for (let k = 0; k < 10; k++) { const c = new THREE.Group(); c.position.set(-14 + k * 3.1, 0, 7.5 + (k % 2) * 0.8); AG.add(c); const cn = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 16), K.paint('#f06a1a', { rough: 0.4 })); cn.position.y = 0.38; c.add(cn); K.cyl(0.165, 0.18, 0.1, white, 0, 0.3, 0, c, 16); K.rbox(0.5, 0.05, 0.5, 0.02, K.paint('#f06a1a'), 0, 0.025, 0, c); }
    for (let k = 0; k < 3; k++) { const c = new THREE.Group(); c.position.set(-22 + k * 2.6, 0, 18); AG.add(c); K.rbox(2.2, 0.15, 1.3, 0.04, K.paint('#3a6a9a'), 0, 0.5, 0, c); for (const x of [-0.8, 0.8]) for (const z of [-0.6, 0.6]) K.cyl(0.18, 0.18, 0.12, dark, x, 0.18, z, c, 12);
      for (let j = 0; j < 3; j++) K.rbox(0.6, 0.45, 0.4, 0.06, K.mat('fabric', ['#c0392b', '#2a7a4a', '#7a4a9a', '#e0a020'][(k + j) % 4]), -0.6 + j * 0.6, 0.82, 0, c); }
    const ft = S.car({ kind: 'van', color: '#e8b820', plate: 'FUEL-1' }); ft.g.position.set(-8, 0, 13); ft.g.rotation.y = 0.2; const ft2 = S.car({ kind: 'hatch', color: '#2a9ab8', plate: 'GLZ-02' }); ft2.g.position.set(16, 0, 19);
    const board = S.board('GLITZ AIR|TEST FLIGHT TODAY!', 3.2, 1.6, { frame: '#1f4aa8' }); board.position.set(9.5, 0, 9.2); board.rotation.y = -0.25;
    LIFT = new THREE.Group(); LIFT.position.set(WX(17) + 0.55, 0, R + 1.25); AG.add(LIFT);
    K.rbox(2.4, 0.3, 1.6, 0.05, K.paint('#f2c230', { rough: 0.35 }), 0, 0.35, 0, LIFT); for (let k = 0; k < 3; k++) for (const s of [-1, 1]) { const x_ = K.rbox(2.2, 0.08, 0.08, 0.02, dark, 0, 0.7 + k * 0.4, s * 0.7, LIFT); x_.rotation.z = (k % 2 ? 1 : -1) * 0.36; }
    K.rbox(2.4, 0.12, 1.6, 0.04, K.paint('#f2c230', { rough: 0.35 }), 0, 1.5, 0, LIFT); for (const [x, z, w, d] of [[0, 0.78, 2.4, 0.05], [1.18, 0, 0.05, 1.6], [-1.18, 0, 0.05, 1.6]]) K.rbox(w, 0.06, d, 0.02, chrome, x, 2.55, z, LIFT);
    for (const [x, z] of [[1.18, 0.78], [-1.18, 0.78], [1.18, -0.78], [-1.18, -0.78]]) K.cyl(0.03, 0.03, 1.0, chrome, x, 1.55, z, LIFT, 8);
    const TT = new THREE.Group(); TT.position.set(WX(16) + 0.4, 0, R + 3.6); AG.add(TT);                                                          // trophy table
    K.rbox(2.4, 0.08, 0.9, 0.03, K.mat('wood', '#7a4a2a'), 0, 0.92, 0, TT); for (const x of [-1.1, 1.1]) for (const z of [-0.38, 0.38]) K.cyl(0.04, 0.04, 0.9, K.mat('wood', '#5a3a24'), x, 0, z, TT, 8);
    K.rbox(2.42, 0.4, 0.02, 0.01, K.mat('fabric', '#1f4aa8'), 0, 0.75, 0.46, TT);
    for (let k = 0; k < 11; k++) { const x = -1.05 + (k % 6) * 0.42, z = k < 6 ? -0.15 : 0.22, h = 0.25 + hash(k) * 0.25 + (k === 7 ? 0.2 : 0);
      K.rbox(0.16, 0.08, 0.16, 0.02, K.mat('wood', '#3a2418'), x, 0.99, z, TT); K.cyl(0.02, 0.03, h * 0.5, gold, x, 1.03, z, TT, 10);
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.03, h * 0.45, 18, 1, true), gold); cup.position.set(x, 1.03 + h * 0.5 + h * 0.22, z); cup.material.side = THREE.DoubleSide; TT.add(cup);
      for (const s of [-1, 1]) { const hdl = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 6, 16), gold); hdl.position.set(x + s * 0.09, 1.03 + h * 0.72, z); TT.add(hdl); } }
    const bh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), S.textMat('BEST|HAIR', { bg: '#f2c230', fg: '#1a1a1a', w: 256, h: 96, border: false })); bh.position.set(-1.05 + 1 * 0.42, 1.06, 0.31); TT.add(bh);
    const bh2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.12), S.textMat('DESIGNER OF THE YEAR', { bg: '#1a1a1a', fg: '#f2c230', w: 512, h: 96, border: false })); bh2.position.set(0.4, 1.02, 0.31); TT.add(bh2);
    S.bake(AG);
    EXTRAS = S.extras(5, { x0: -10, len: 22, z: 11, spread: 2.5, seed: 77, stillShare: 0.6 });
    // ================= flight: a cloud sea under the jet (scrolls past) =================
    CLOUDS = new THREE.Group(); sc.add(CLOUDS); const cm = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#3a4a6a', emissiveIntensity: 0.15 });
    for (let k = 0; k < 90; k++) { const g = new THREE.Group(); const x = (hash(k) - 0.5) * 360, z = (hash(k + 1) - 0.5) * 220, y = -14 - hash(k + 2) * 10; g.position.set(x, y, z); CLOUDS.add(g);
      for (let j = 0; j < 5; j++) { const s = new THREE.Mesh(new THREE.SphereGeometry(4 + hash(k * 5 + j) * 5, 14, 10), cm); s.position.set((j - 2) * 4.5, hash(k + j) * 2, (hash(k * 3 + j) - 0.5) * 6); s.scale.y = 0.55; g.add(s); } }
    CLOUDS.position.set(FLY[0], FLY[1], FLY[2]);
    // ================= cabin set (x = CX): rows of seats with belted rubber chickens; cockpit at the front =================
    CAB = new THREE.Group(); CAB.position.set(CX, 0, 0); sc.add(CAB); const CS = new THREE.Group(); CAB.add(CS);
    const carpet = K.mat('fabric', '#2a3a6a', { detail: 0.4 }), wall = K.mat('plaster', '#f0ece4'), seatM = K.mat('fabric', '#1f4aa8', { detail: 0.3 }), headM = K.mat('fabric', '#f4f0e8');
    K.slab(-14, 10.5, -0.1, 0, -1.9, 1.9, carpet, CS, false); K.slab(-14, 10.5, 0, 0.012, -0.32, 0.32, K.mat('fabric', '#c0392b', { detail: 0.3 }), CS, false);
    for (const s of [-1, 1]) K.slab(-14, 8.2, 0, 1.75, s * 1.9, s * 1.95, wall, CS);
    const ceil = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 22.2, 32, 1, true, Math.PI / 2, Math.PI), wall); ceil.rotation.z = Math.PI / 2; ceil.position.set(-2.9, 1.75, 0); ceil.material.side = THREE.DoubleSide; CS.add(ceil);
    for (const s of [-1, 1]) { K.rbox(22, 0.5, 0.6, 0.08, K.paint('#f4f2ee', { rough: 0.3 }), -2.9, 2.55, s * 1.45, CS); K.rbox(22, 0.04, 0.02, 0.01, gold, -2.9, 2.32, s * 1.15, CS);
      for (let k = 0; k < 20; k++) { const x = -13 + k * 1.08; const lp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c8').multiplyScalar(2) })); lp.position.set(x, 2.28, s * 1.0); CS.add(lp); } }
    for (let k = 0; k < 14; k++) for (const z of [-1.4, -0.85, 0.85, 1.4]) { const x = -12.6 + k * 1.08; if (x > 6.5) continue;
      K.rbox(0.5, 0.12, 0.5, 0.05, seatM, x, 0.45, z, CS); K.rbox(0.12, 0.75, 0.5, 0.05, seatM, x - 0.25, 0.85, z, CS); K.rbox(0.13, 0.2, 0.36, 0.04, headM, x - 0.26, 1.15, z, CS);
      K.rbox(0.45, 0.05, 0.06, 0.02, K.paint('#3a3c44'), x, 0.62, z + (z > 0 ? -0.27 : 0.27), CS);
      const seed = k * 4 + (z + 2) * 7; if (!(k === 10 && z === 1.4) && !(k >= 6 && k <= 7 && z > 0) && !(k === 4 && z === 0.85) && !(k === 4 && z === 1.4)) { const ch = chicken(CS); ch.position.set(x - 0.08, 0.5, z); ch.rotation.y = (hash(seed) - 0.5) * 0.4; } }
    // cabin windows: square (cracked later) and round (the final jet)
    for (let k = 0; k < 20; k++) for (const s of [-1, 1]) { const x = -13 + k * 1.08; const g = new THREE.Group(); g.position.set(x, 1.25, s * 1.88); g.rotation.y = s > 0 ? Math.PI : 0; CAB.add(g);
      const sky = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ color: new THREE.Color('#bfe0ff').multiplyScalar(1.25) })); sky.userData.ndSkip = true; g.add(sky);
      for (const [w, h, xx, yy] of [[0.78, 0.08, 0, 0.35], [0.78, 0.08, 0, -0.35], [0.08, 0.78, 0.35, 0], [0.08, 0.78, -0.35, 0]]) K.rbox(w, h, 0.05, 0.02, K.paint('#d8d4cc', { rough: 0.3 }), xx, yy, 0.02, g);
      for (const x2 of [-0.27, 0.27]) K.rbox(0.18, 0.66, 0.03, 0.01, mats.curt, x2, 0, 0.04, g);
      const cr = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), mats.crack); cr.position.set(0, 0, 0.06); cr.userData.ndSkip = true; cr.visible = false; g.add(cr);
      CABSQ.push({ g, sky, cr, k, s });
      const rg = new THREE.Group(); rg.position.copy(g.position); rg.rotation.copy(g.rotation); CAB.add(rg); const rs = new THREE.Mesh(new THREE.CircleGeometry(0.26, 32), sky.material); rs.userData.ndSkip = true; rg.add(rs);
      const rr = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.06, 10, 32), K.paint('#d8d4cc', { rough: 0.3 })); rr.position.z = 0.02; rg.add(rr); CABRD.push(rg); }
    // cockpit (front, x 8.2..10.4) — panel with glowing dials, two seats, windshield frames; the cockpit door with a CREW ONLY sign
    K.slab(8.2, 10.6, 0, 0.9, -1.9, 1.9, K.paint('#3a3c44', { rough: 0.5 }), CS); K.slab(10.0, 10.6, 0.9, 1.3, -1.6, 1.6, K.paint('#2a2c34', { rough: 0.4 }), CS);
    for (let k = 0; k < 14; k++) { const d = new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(['#7af8a0', '#ffd27a', '#7ad0ff'][k % 3]).multiplyScalar(1.6) })); d.position.set(9.99, 1.0 + (k % 2) * 0.16, -1.2 + Math.floor(k / 2) * 0.38); d.rotation.y = -Math.PI / 2; d.userData.ndSkip = true; CS.add(d); }
    for (const z of [-0.7, 0.7]) { K.rbox(0.6, 0.15, 0.6, 0.06, K.mat('fabric', '#5a3a24'), 9.0, 0.5, z, CS); K.rbox(0.15, 0.9, 0.6, 0.06, K.mat('fabric', '#5a3a24'), 8.65, 0.95, z, CS); }
    for (const s of [-1, 1]) K.slab(8.2, 8.26, 0, 2.4, s * 0.55, s * 1.9, K.paint('#e8e4dc', { rough: 0.35 }), CS);
    const cs_ = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.2), S.textMat('CREW ONLY', { bg: '#c0392b', fg: '#ffffff', w: 256, h: 96, border: false })); cs_.position.set(8.18, 2.05, -0.9); cs_.rotation.y = -Math.PI / 2; CS.add(cs_);
    const fl_ = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.2), S.textMat('FASTEN BELTS', { bg: '#1a1a1a', fg: '#f2c230', w: 256, h: 96, border: false })); fl_.position.set(-2, 2.25, 0); fl_.rotation.y = Math.PI / 2; CS.add(fl_);
    S.bake(CS);
    for (let k = 0; k < 7; k++) { const ch = chicken(CAB, false); ch.position.set(8.0 + (k % 3) * 0.08, 0.3 + Math.floor(k / 3) * 0.42 + hash(k) * 0.05, -0.45 + (k % 3) * 0.45); ch.rotation.set(hash(k) * 0.5 - 0.25, (hash(k + 2) - 0.5) * 0.6, hash(k + 4) * 0.6 - 0.3); DOORCH.push(ch); }
    TAPE = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9), canvasMat(768, 460, sigTex, { basic: false, alpha: true })); TAPE.material.transparent = true; TAPE.position.set(-13 + 8 * 1.08, 1.25, 1.83); TAPE.rotation.y = Math.PI; CAB.add(TAPE);
    // ================= characters =================
    GORDON = K.stick({ jacket: '#f4f0e6', pants: '#2a2a30', boots: '#7a4a2a', hairStyle: 'short', hair: '#3a2418', glasses: '#1a1a1a', scarf: '#c0392b', bowtie: '#1f4aa8', vest: '#f2c230', belt: '#1a1a1a', pockets: true }, { key: 'gordon', head: 1.2 });
    PIA = K.stick({ jacket: '#2a8a7a', pants: '#3a3a48', hairStyle: 'ponytail', hair: '#c0632a', glasses: true, collar: '#f4efe4', badge: true, belt: '#3a2418', build: 'kid' }, { key: 'pia' });
    DOUG = K.stick({ jacket: '#1f2a4a', pants: '#1f2a4a', hat: 'pilot', moustache: '#8a5a34', tie: '#f2c230', badge: true, collar: '#ffffff' }, { key: 'doug' });
    K.addClouds(10, 700, 140);
  },
  frame(f, K) {
    const T = K.T, L = LINES;
    // ---------- where is the jet? ----------
    const flight = f >= 502 && f < 1186, cabin = (f >= 420 && f < 502 && f >= 455) || (f >= 612 && f < 757) || (f >= 850 && f < 882) || (f >= 1035 && f < 1091) || (f >= 1240) || (f >= 420 && f < 455);
    const roundW = f >= 1091;
    let jp = [0, GROUND_Y, 0], pitch = 0;
    if (f >= 376 && f < 502) { const u = (f - 376) / 30; const x = 0.5 * 4.5 * u * u * 4; jp = [x, GROUND_Y + Math.max(0, (x - 30) * 0.22), 0]; pitch = Math.min(0.2, Math.max(0, (x - 26) * 0.02)); }
    if (flight) jp = [FLY[0], FLY[1] + 0.25 * Math.sin(f * 0.05), FLY[2]];
    if (f >= 1186 && f < 1240) jp = [0, GROUND_Y, 0];
    JET.position.set(...jp); JET.rotation.set(flight ? 0.012 * Math.sin(f * 0.04) : 0, 0, pitch);
    JET.gear.visible = !flight; JET.visible = !cabin;
    for (const w of WIN) { w.g.visible = !roundW; } JET.RG.visible = roundW;
    // the twin -z side square windows live in JET too (children after WIN); hide them when round
    for (const w of WINB) w.g.visible = !roundW;
    for (const a of TAILFACE) a.visible = !roundW; for (const a of TAILDONUT) a.visible = roundW;
    // curtains: open, then swish shut on "curtains" (one after another)
    for (const w of WIN) { const u = sm(F.CURT - 4 + w.i * 0.6, F.CURT + 6 + w.i * 0.6, f) * (f < 380 ? 1 : 1); const cw = lerp(0.12, 0.42, u); w.cl.scale.x = cw / 0.42; w.cr.scale.x = cw / 0.42; w.cl.position.x = -WS / 2 + cw / 2; w.cr.position.x = WS / 2 - cw / 2; }
    if (f < F.CURT - 6) for (const w of WIN) { if (w.i === 17) { const u = sm(20, 60, f); const cw = lerp(0.12, 0.42, u); w.cl.scale.x = cw / 0.42; w.cl.position.x = -WS / 2 + cw / 2; } }
    // cracks: one tiny crack on "corner" (window 9, bottom-left), then every corner on "cracked"
    for (const { c, i } of CRACKS) { const first = i === 9 && c === WIN[9].cracks[0]; const t0 = first ? F.CRACK - 2 : F.EVERY + 2 + hash(i * 4 + c.rotation.z) * 26;
      const s = f >= 1091 ? 0 : (first ? lerp(0, 0.3, sm(t0, F.CORNER + 4, f)) + lerp(0, 0.7, sm(F.EVERY, F.CRACKED + 10, f)) : sm(t0, t0 + 12, f)); c.scale.setScalar(Math.max(0.001, s)); }
    // window seven pops out like toast (straight up, then tumbles away in the slipstream)
    const w7 = WIN[I7], tp = (f - F.POPPED + 2) / 30;
    if (tp > 0 && !roundW) { const up = Math.min(tp, 0.35); w7.g.position.set(WX(I7) - Math.max(0, tp - 0.35) * 22, WY + 0.9 * Math.sin(Math.min(1, up / 0.35) * Math.PI / 2) * 1.3 + Math.max(0, tp - 0.35) * 3, R + 0.3 + tp * 2.2); w7.g.rotation.set(Math.max(0, tp - 0.3) * 6, Math.max(0, tp - 0.3) * 4, 0); }
    else { w7.g.position.set(WX(I7), WY, R); w7.g.rotation.set(0, 0, 0); }
    FLYCH.forEach((ch, k) => { const t = (f - F.TWELVE - k * 3) / 30; ch.visible = flight && t > 0 && t < 2.2 && !roundW;
      if (ch.visible) { ch.position.set(WX(I7) - t * t * 9 - t * 3 + (hash(k) - 0.5) * 0.4, WY + t * (2.2 + hash(k + 1) * 2) - t * t * 2.2, R + 0.2 + t * (2.5 + hash(k + 2) * 2)); ch.rotation.set(t * (4 + k), t * 3, t * (5 + hash(k) * 4)); } });
    // x-ray
    const xr = f >= 882 && f < 1035; HOLO.visible = xr; for (const a of ARROWS) { a.visible = xr && f >= F.INSIDE - 4; const p = 0.5 + 0.5 * Math.sin(f * 0.35 + a.position.x); a.scale.set(1, 1, 0.8 + p * 0.4); }
    HOT.forEach((h, k) => { const s = sm(wf(10, 'traps') - 4, wf(10, 'traps') + 10, f) * (f < 1035 ? 1 : 0); h.visible = s > 0.01 && !roundW; h.scale.setScalar(0.4 + s * (1.4 + 0.3 * Math.sin(f * 0.5 + k))); });
    RING.show(roundW && f < 1186 ? sm(F.ROUND - 4, F.NOWHERE + 10, f) : 0);
    CLOUDS.position.x = FLY[0] - ((f * 2.4) % 120) + 60; CLOUDS.visible = flight;
    // cabin windows + tape + chickens in the doorway
    for (const w of CABSQ) { w.g.visible = !roundW; w.cr.visible = f >= F.EVERY + 4 + hash(w.k + w.s) * 20 && f < 1091;
      const hole = w.k === 9 && w.s > 0 && f >= F.POPPED; w.sky.material === w.sky.material; w.g.children.forEach((c, j) => { if (j > 0 && hole) c.visible = false; else if (j > 0 && j < 7) c.visible = true; }); }
    for (const g of CABRD) g.visible = roundW;
    TAPE.visible = f >= F.ROLLS && f < 1091; TAPE.scale.set(sm(F.ROLLS, F.SIG + 6, f) * 0.999 + 0.001, 1, 1); TAPE.position.x = -13 + 8 * 1.08 - (1 - sm(F.ROLLS, F.SIG + 6, f)) * 0.75;
    DOORCH.forEach((ch, k) => { ch.visible = f >= 1035 && f < 1091; ch.position.x = 8.0 + (k % 3) * 0.08 + 0.04 * Math.sin(f * 0.9 + k); });

    // ---------- characters ----------
    const blink = (s) => blinkAt(f, s);
    // Gordon: curtains on the lift (0-118) -> under the tail (118-196) -> ignores Pia (196-293) -> trophies + hair (293-376) -> cabin: tape, panic -> window seat
    let gpos = { visible: false };
    if (f < 196) gpos = f < 118 ? { x: WX(17) + 0.9, y: 1.53, z: R + 1.0, yaw: 0.35 } : { x: -12.5, y: 0, z: 5.2, yaw: -0.5 };
    else if (f < 376) gpos = { x: WX(16) + 0.4, y: 0, z: R + 2.7, yaw: f < 293 ? 0.6 : 0.25 };
    else if (f >= 705 && f < 757) gpos = { x: CX - 13 + 8 * 1.08 - 1.3, y: 0, z: 0.7, yaw: 0.9 };
    else if (f >= 612 && f < 705) gpos = { x: CX - 13 + 8 * 1.08 - 0.3, y: 0, z: 0.95, yaw: 0.6 };
    else if (f >= 850 && f < 882) gpos = { x: CX - 13 + 9 * 1.08 + 0.4, y: 0, z: 0.6, yaw: 1.3 };
    else if (f >= 1240) gpos = { x: CX - 13 + 5 * 1.08 - 0.15, y: 0.5, z: 1.4, yaw: Math.PI / 2, seat: 0.45 };
    const gk = [[0, 'hips', { expr: 'smug', R: [0.75, -0.35, 'open'] }], [40, 'hips', { expr: 'gloat', R: [0.75, -0.25, 'fist'] }], [F.CURT - 4, 'show', { expr: 'proud' }],
      [118, 'pointUp', { expr: 'proud' }], [F.FACE - 3, 'pointUp', { expr: 'gloat' }], [F.TAIL, 'hips', { expr: 'proud' }],
      [196, 'hips', { expr: 'smug', look: -0.4 }], [F.IGN - 6, 'stop', { expr: 'deadpan', look: 0.6 }], [F.IGN + 18, 'cross', { expr: 'smug', look: 0.6 }],
      [293, 'show', { expr: 'proud' }], [F.HAIR - 6, 'hips', { expr: 'gloat', R: [0.1, -0.85, 'open'] }], [F.HAIR + 8, 'hips', { expr: 'smug', R: [0.05, -0.95, 'open'] }],
      [612, 'panic', { expr: 'scared', sweat: true }], [F.FIX - 4, 'hold', { expr: 'nervous', sweat: true, R: [0.4, -0.45, 'tape'] }], [F.ROLLS, 'reach', { expr: 'nervous', sweat: true, R: [0.5, -0.3, 'tape'] }],
      [F.SIG - 4, 'show', { expr: 'gloat', sweat: true }], [850, 'shock', { expr: 'shock', sweat: true }], [866, 'facepalm', { expr: 'pained', sweat: true }],
      [1240, 'sit', { expr: 'deadpan' }], [F.SEAT - 4, 'sit', { expr: 'deadpan', look: -0.5 }]];
    GORDON.set(T.act(f, gk, { seed: 3, blink: blink(3) }), gpos);
    // Pia: holds up the donut (196-293), at the tail with the donut at the end
    let ppos = { visible: false };
    if (f >= 196 && f < 293) ppos = { x: WX(16) + 2.6, y: 0, z: R + 4.6, yaw: -1.9 };
    else if (f >= 118 && f < 196) ppos = { x: -9.2, y: 0, z: 7.0, yaw: -2.2 };
    else if (f >= 1186 && f < 1240) ppos = { x: -14.5, y: 0, z: 5.4, yaw: 0.35 };
    else if (f < 118) ppos = { x: WX(14), y: 0, z: R + 4.0, yaw: -0.3 };
    const pk = [[0, 'hold', { expr: 'deadpan', R: [0.35, -0.1, 'donut'] }], [118, 'hold', { expr: 'deadpan', R: [0.35, -0.1, 'donut'] }], [F.DONUT - 8, 'hold', { expr: 'deadpan', R: [0.15, -0.95, 'donut'] }],
      [F.IGN + 4, 'hold', { expr: 'sad', R: [0.2, -0.7, 'donut'] }], [1186, 'hold', { expr: 'proud', R: [0.3, -0.9, 'donut'] }], [F.EVTAIL, 'cheer', { expr: 'laugh' }]];
    PIA.set(T.act(f, pk, { seed: 6, blink: blink(6) }), ppos);
    // Doug: thumbs-up salute in the cockpit; deadpan behind the jammed doorway
    let dpos = { visible: false };
    if (f >= 420 && f < 455) dpos = { x: CX + 8.9, y: 0.5, z: -0.7, yaw: Math.PI / 2 - 0.25, seat: 0.45 };
    else if (f >= 1035 && f < 1091) dpos = { x: CX + 9.5, y: 0, z: 0.2, yaw: -Math.PI / 2 };
    DOUG.set(T.act(f, [[420, 'sit', { expr: 'grin', R: [0.4, -0.75, 'fist'] }], [F.DOUG, 'salute', { expr: 'grin' }], [1035, 'cross', { expr: 'deadpan' }], [F.DOORWAY, 'facepalm', { expr: 'deadpan' }]], { seed: 8, blink: blink(8) }), dpos);
    S_extras(f, K, T);

    // ---------- shots (a new moving shot every 1.3-2 s, never reused) ----------
    let cam, dof, u, light; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const J = (lx, ly, lz) => { const v = new THREE.Vector3(lx, ly, lz); JET.updateMatrixWorld(true); v.applyMatrix4(JET.matrixWorld); return [v.x, v.y, v.z]; };
    const C = (x, y, z) => [CX + x, y, z];
    const ground = K.light('morning', { az: 120, el: 24, shadowExt: 26 }), sky = K.light('day', { az: 150, el: 40, fogNear: 120, fogFar: 900, fog: '#cfe2f6', skyHor: '#e6f0fa' }), inside = K.light('interior', { az: 120, el: 50, fogNear: 30, fogFar: 90 });
    const gh = (p) => [p.x, (p.y || 0) + 1.6, p.z];                                // head height of a standing stick (seat: lower)
    if (sh(0, 58)) {            // 1. Gordon on the lift, closing the curtain of a giant square window (front quarter, push)
      const h = gh(gpos); cam = { pos: [h[0] + 2.4, h[1] + 0.15, h[2] + 3.0], look: [h[0] - 0.6, h[1] - 0.1, h[2] - 0.6], fov: 42 * K.push(u, 0.1) }; dof = { focus: 3.6, cinf: 10 }; light = ground;
    } else if (sh(58, 118)) {   // 2. wide reveal: the whole jet, 40 square windows, curtains swish shut
      cam = { pos: [lerp(20, 24, u), lerp(4.0, 5.5, u), lerp(24, 30, u)], look: [1, 3.2, 0], fov: 46 }; dof = { focus: 30, cinf: 3 }; light = ground;
    } else if (sh(118, 160)) {  // 3. the tail fin: Gordon's face (low, push-up)
      cam = { pos: [-12, lerp(2.2, 3.4, u), 13], look: [-17.2, 6.6, 0], fov: 36 * K.push(u, 0.1) }; dof = { focus: 14, cinf: 4 }; light = ground;
    } else if (sh(160, 196)) {  // 4. Gordon points up at "every tail", low angle, Pia behind with the donut
      const h = gh(gpos); cam = { pos: [h[0] + 1.2, 0.5, h[2] + 2.6], look: [h[0] - 0.8, h[1] + 0.5, h[2] - 1], fov: 46 * K.push(u, 0.08) }; dof = { focus: 2.8, cinf: 8 }; light = ground;
    } else if (sh(196, 245)) {  // 5. Pia close-up: holds up the donut (deadpan)
      const h = gh(ppos); cam = { pos: [h[0] - 1.9, h[1] - 0.05, h[2] + 1.4], look: [h[0] - 0.05, h[1] - 0.15, h[2]], fov: 38 * K.push(u, 0.1) }; dof = { focus: 2.3, cinf: 14 }; light = ground;
    } else if (sh(245, 293)) {  // 6. over Pia's donut: Gordon turns away with a "stop" hand
      const h = gh(gpos); cam = { pos: [h[0] + 2.6, h[1] + 0.1, h[2] + 2.4], look: [h[0], h[1] - 0.2, h[2]], fov: 40 * K.punch(f, F.IGN, 0.15, 6) }; dof = { focus: 3.5, cinf: 11 }; light = ground;
    } else if (sh(293, 335)) {  // 7. insert: the trophy table, slide along 11 trophies to "BEST HAIR"
      const t = [WX(16) + 0.4, 1.2, R + 3.6]; cam = { pos: [t[0] + lerp(1.1, -0.2, u), 1.45, t[2] + 1.15], look: [t[0] + lerp(0.6, -0.55, u), 1.12, t[2]], fov: 36 }; dof = { focus: 1.2, cinf: 16 }; light = ground;
    } else if (sh(335, 376)) {  // 8. Gordon flips his hair (close, slight orbit)
      const h = gh(gpos); cam = { pos: [h[0] + lerp(0.6, 1.2, u), h[1] + 0.1, h[2] + 2.2], look: [h[0], h[1] - 0.05, h[2]], fov: 36 }; dof = { focus: 2.3, cinf: 14 }; light = ground;
    } else if (sh(376, 420)) {  // 9. takeoff: tracking alongside the jet, low (motion blur)
      const tc = K.track(f, (g) => { const u2 = (g - 376) / 30; const x = 0.5 * 4.5 * u2 * u2 * 4; return [x, GROUND_Y + Math.max(0, (x - 30) * 0.22), 0]; }, { off: [18, 0.8, 21], lag: 3, lead: 0.1, lookY: 0.4 }); cam = { ...tc, fov: 46 }; dof = { focus: 25, cinf: 3 }; light = ground;
    } else if (sh(420, 455)) {  // 10. cockpit: Doug salutes (from the windshield side)
      const h = [CX + 8.9, 1.75, -0.7]; cam = { pos: [h[0] + 1.5, h[1] + 0.15, h[2] + 0.55], look: [h[0], h[1] - 0.15, h[2]], fov: 40 * K.push(u, 0.1) }; dof = { focus: 1.4, cinf: 14 }; light = inside;
    } else if (sh(455, 502)) {  // 11. the cabin: rows of rubber chickens in seat belts (down the aisle, push)
      cam = { pos: C(lerp(6.6, 5.6, u), 1.55, -0.05), look: C(-4, 0.9, 0.2), fov: 44 }; dof = { focus: 4, cinf: 6 }; light = inside;
    } else if (sh(502, 540)) {  // 12. over the clouds: tracking alongside the jet
      cam = { pos: [FLY[0] + lerp(16, 10, u), FLY[1] + 6, 30], look: [FLY[0] - 1, FLY[1] + 0.5, 0], fov: 46 }; dof = { focus: 22, cinf: 3 }; light = sky;
    } else if (sh(540, 570)) {  // 13. macro: a tiny crack in one corner of window 9
      const p = J(WX(9) - 0.4, WY - 0.4, R); cam = { pos: [p[0] - 0.5, p[1] - 0.25, p[2] + 1.4], look: [p[0] + 0.05, p[1] + 0.05, p[2]], fov: 34 * K.push(u, 0.15) }; dof = { focus: 1.4, cinf: 16 }; light = sky;
    } else if (sh(570, 612)) {  // 14. every corner cracks (angled along the fuselage, shake)
      const [sx, sy] = K.shake(f, F.CRACKED, 0.08, 20); cam = { pos: [FLY[0] + 6 + sx, FLY[1] + 1.2 + sy, 6.5], look: [FLY[0] - 6, FLY[1] + 0.2, R], fov: 40 * K.punch(f, F.TODDLER, 0.18, 7) }; dof = { focus: 7, cinf: 6 }; light = sky;
    } else if (sh(612, 654)) {  // 15. inside: cracked windows, chickens, Gordon panics (shake)
      const [sx, sy] = K.shake(f, 612, 0.05, 30); const h = gh(gpos); cam = { pos: [h[0] + 2.8 + sx, 1.85 + sy, -0.6], look: [h[0] - 0.4, 1.4, h[2] + 0.3], fov: 46 }; dof = { focus: 2.8, cinf: 9 }; light = inside;
    } else if (sh(654, 705)) {  // 16. Gordon tapes the window frantically (close, from the aisle)
      const h = gh(gpos); cam = { pos: [h[0] + 1.5, h[1] + 0.05, h[2] + 0.65], look: [h[0] - 0.1, h[1] - 0.2, h[2] + 0.2], fov: 46 * K.push(u, 0.1) }; dof = { focus: 2.3, cinf: 12 }; light = inside;
    } else if (sh(705, 757)) {  // 17. insert: the duct tape is his signature
      cam = { pos: C(-13 + 8 * 1.08 + lerp(-0.3, 0.2, u), 1.35, -0.35), look: C(-13 + 8 * 1.08, 1.25, 1.85), fov: 44 }; dof = { focus: 1.75, cinf: 12 }; light = inside;
    } else if (sh(757, 810)) {  // 18. window seven pops out like toast (punch-in)
      const p = J(WX(I7), WY, R); cam = { pos: [p[0] + 3.2, p[1] + 0.6, p[2] + 5.6], look: [p[0] - 0.6, p[1] + 0.9, p[2]], fov: 42 * K.punch(f, F.POPPED, 0.2, 6) }; dof = { focus: 6, cinf: 6 }; light = sky;
    } else if (sh(810, 850)) {  // 19. twelve rubber chickens tumble out into the sky (wide, slow pan)
      const p = J(WX(I7), WY, R); cam = { pos: [p[0] + 5, p[1] + 1.2, p[2] + 9], look: [p[0] - lerp(1, 6, u), p[1] + lerp(1, 2.5, u), p[2] + 3], fov: 46 }; dof = { focus: 14, cinf: 3 }; light = sky;
    } else if (sh(850, 882)) {  // 20. reaction: Gordon in shock next to the empty window frame (wind)
      const h = gh(gpos); const [sx, sy] = K.shake(f, 850, 0.03, 30); cam = { pos: [h[0] + 1.9 + sx, h[1] + 0.05 + sy, h[2] - 0.7], look: [h[0] - 0.2, h[1] - 0.1, h[2] + 0.4], fov: 40 }; dof = { focus: 2.2, cinf: 14 }; light = inside;
    } else if (sh(882, 930)) {  // 21. x-ray: the air inside pushes on every window (side, slow truck)
      cam = { pos: [FLY[0] + lerp(-3, 2, u), FLY[1] + 1.5, 19], look: [FLY[0] - 1, FLY[1], 0], fov: 44 }; dof = { focus: 19, cinf: 3 }; light = sky;
    } else if (sh(930, 982)) {  // 22. closer on three windows, arrows pulsing outward (low angle)
      cam = { pos: [FLY[0] + WX(8) + 2.5, FLY[1] - 1.2, 6.5], look: [FLY[0] + WX(8), FLY[1] + 0.3, R], fov: 40 * K.push(u, 0.12) }; dof = { focus: 5, cinf: 6 }; light = sky;
    } else if (sh(982, 1035)) { // 23. macro x-ray: the push piles up in the four sharp corners (red hot spots)
      const p = J(WX(9), WY, R); cam = { pos: [p[0] + lerp(0.5, -0.3, u), p[1] + 0.2, p[2] + 2.3], look: p, fov: 40 * K.punch(f, F.POINT, 0.15, 6) }; dof = { focus: 2.3, cinf: 12 }; light = sky;
    } else if (sh(1035, 1091)) {// 24. cutaway: rubber chickens jammed in the cockpit doorway; Doug deadpan behind
      cam = { pos: C(lerp(5.0, 5.5, u), 1.5, 0.7), look: C(8.4, 1.15, -0.1), fov: 46 }; dof = { focus: 2.4, cinf: 10 }; light = inside;
    } else if (sh(1091, 1140)) {// 25. a round window: the glow slides around it, no corner to stop at
      const p = J(WX(9), WY, R); cam = { pos: [p[0] + lerp(-0.6, 0.6, u), p[1] + 0.15, p[2] + 3.4], look: p, fov: 40 * K.push(u, 0.1) }; dof = { focus: 3.4, cinf: 10 }; light = sky;
    } else if (sh(1140, 1186)) {// 26. the new jet with round windows glides past (tracking, front quarter)
      cam = { pos: [FLY[0] + lerp(26, 18, u), FLY[1] + 3, 18], look: [FLY[0] + 2, FLY[1], 0], fov: 46 }; dof = { focus: 26, cinf: 3 }; light = sky;
    } else if (sh(1186, 1240)) {// 27. golden hour: the donut on the tail, Pia cheering below (low, push)
      cam = { pos: [-10, 1.0, 11.5], look: [-16.5, lerp(4.6, 5.6, u), 0], fov: 44 * K.push(u, 0.08) }; dof = { focus: 13, cinf: 4 }; light = K.light('golden', { az: 60, el: 16 });
    } else {                    // 28. Gordon in a window seat between rubber chickens, cheek by a round window (echoes shot 1)
      const h = [gpos.x, 1.32, gpos.z]; cam = { pos: [h[0] + 1.9, h[1] + 0.25, h[2] - 1.6], look: [h[0] - 0.1, h[1] - 0.05, h[2] + 0.25], fov: 40 * K.push(u, 0.12) }; dof = { focus: 2.5, cinf: 12 }; light = inside;
    }
    // ---------- graphics ----------
    K.mist(f, 874, 18); K.mist(f, 1083, 18); K.mist(f, 1178, 16);
    K.badge(f, F.FORTY, '40 SQUARE WINDOWS', [-1, 6.0, 2], { icon: 'warn', f1: 118 });
    K.badge(f, F.TEST, 'TEST FLIGHT', { sx: 0.5, sy: 0.2 }, { f1: 196 });
    K.badge(f, F.ELEVEN, '11 AWARDS', { sx: 0.5, sy: 0.22 }, { icon: 'check', f1: 335 });
    K.badge(f, F.THREE, '300 CHICKENS', { sx: 0.5, sy: 0.2 }, { f1: 502 });
    K.badge(f, F.ROLLS, '40 ROLLS', { sx: 0.5, sy: 0.22 }, { icon: 'x', f1: 757 });
    if (f >= 930 && f < 982) K.badge(f, 934, 'AIR PUSH', (g) => J(WX(8), WY + 1.3, R + 0.8), { icon: 'up', f1: 980 });
    if (f >= 982 && f < 1035) K.badge(f, wf(10, 'traps') + 6, 'ALL THE PUSH HERE', (g) => J(WX(9) + 0.45, WY + 0.75, R + 0.2), { icon: 'warn', f1: 1033 });
    if (f >= 1091 && f < 1140) K.badge(f, F.NOWHERE, 'NO CORNERS', (g) => J(WX(9), WY + 0.85, R + 0.2), { icon: 'check', f1: 1138 });
    K.badge(f, F.PIAS, 'DONUT APPROVED', { sx: 0.5, sy: 0.24 }, { style: 'stamp', f1: 1240, size: 1.3 });
    if (flight) K.steam(f, (s) => J(WX(I7) - 0.6, WY, R + 0.3), { rate: f >= F.POPPED ? 10 : 0, size: 0.6, rise: 0.2, drift: [-9, 0.2], seed: 4 });
    if (f >= 850 && f < 882) K.steam(f, (s) => [CX - 13 + 9 * 1.08, 1.25, 1.6], { rate: 12, size: 0.4, rise: 0.1, drift: [0.4, 0.1], seed: 6 });
    return { light: { ...light, ink: 0.5, cardTint: cabin ? '#fff0e0' : undefined }, cam, dof, actors: [], fx: [] };
  },
};
function S_extras(f, K, T) { K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) { e.r.root.visible = f < 420 || (f >= 1186 && f < 1240); } }
