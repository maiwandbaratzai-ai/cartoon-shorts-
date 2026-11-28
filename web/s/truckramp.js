// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "He Said No to the Runaway Truck Ramp" — invented story, engine: The Overconfident Expert (SCRIPTS.md §000).
// Thirty-year trucker Big Hank ("No sandbox for Hank!") rides his brakes down eleven miles of Mount Grumble with forty tons of
// watermelons: warm, toasty, glowing, smoking. He cools them with his coffee (now glowing AND steaming), the pedal sinks like a
// whoopee cushion, and he still waves off the gravel ramps. Explainer: brakes stop a truck by rubbing, rubbing makes heat; too hot
// and they turn slippery, like grabbing a wet bar of soap. Rookie Junie yanks the wheel into the last ramp before Main Street:
// deep loose gravel swallows the wheels like a ball pit. Hank gets his first sandbox; Pickles the pig gets forty tons of melon.
import { TOTAL, LINES, wf } from './truckramp_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const SL = 0.08, BOT = -300, RS = 0.06;                     // road slope (down toward -x), bottom of the hill, ramp slope (up)
const roadY = (x) => Math.max(0, SL * (x - BOT));
const R1 = -80, R2 = -255, RZ = 7.2;                         // ramp exits, ramp lane centre z
const rampY = (x0, x) => roadY(x0) + RS * (x0 - x);
const EX = [400, 0, 0];
let THREE, F = {}, TRK, HUB, MEL = [], HANK, JUN, PIG, CUP, COF, BUCK, HX = {}, TOWNF = [];

function stripeTex(K) { const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#3f9a3a'; g.fillRect(0, 0, 256, 128);
  g.fillStyle = '#1f5a24'; for (let k = 0; k < 8; k++) { g.beginPath(); for (let y = 0; y <= 128; y += 8) g.lineTo(k * 32 + 6 * Math.sin(y * 0.15 + k), y); for (let y = 128; y >= 0; y -= 8) g.lineTo(k * 32 + 12 + 6 * Math.sin(y * 0.15 + k), y); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function sign(K, S, text, w, h, bg, fg, x, y, z, ry = 0) { const g = new THREE.Group(); K.scene.add(g); g.position.set(x, y, z); g.rotation.y = ry;
  for (const s of [-1, 1]) K.cyl(0.06, 0.06, h + 1.6, K.paint('#8a8a90', { rough: 0.4 }), s * w * 0.38, 0, -0.05, g, 8);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), S.textMat(text, { bg, fg, w: 512, h: Math.round(512 * h / w), border: false })); p.position.set(0, 1.6 + h / 2, 0.02); g.add(p);
  K.rbox(w + 0.1, h + 0.1, 0.06, 0.03, K.paint('#2a2a30'), 0, 1.6 + h / 2, -0.03, g); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { GLOWED: wf(0, 'glowed'), TOASTERS: wf(0, 'toasters'), WAVED: wf(0, 'waved'), RAMP: wf(0, 'ramp'), FORTY: wf(1, 'forty'), MELONS: wf(1, 'watermelons'), PICKLES: wf(1, 'pickles'), DROOL: wf(1, 'drooling'),
      SANDBOX: wf(2, 'sandbox'), JUNIE: wf(2, 'junie'), GRAVEL: wf(2, 'gravel'), FLEW: wf(2, 'flew'), RIDDEN: wf(3, 'ridden'), ELEVEN: wf(3, 'eleven'), WARMW: wf(3, 'warm'), TOASTY: wf(3, 'toasty'), GLOWING: wf(3, 'glowing'), SMOKING: wf(3, 'smoking'),
      POURED: wf(4, 'poured'), COFFEE: wf(4, 'coffee'), STEAM: wf(4, 'steaming'), PEDAL: wf(5, 'pedal'), SANK: wf(5, 'sank'), WHOOPEE: wf(5, 'whoopee'), FORTY2: wf(5, 'forty'), NOBR: wf(5, 'brakes'),
      ONE: wf(6, 'one'), MAIN: wf(6, 'main'), SANDBOX2: wf(6, 'sandbox'), TOP: wf(7, 'top'), BOTTOM: wf(7, 'bottom'), RUBBING: wf(8, 'rubbing'), HEAT: wf(8, 'heat'), ELEVEN2: wf(8, 'eleven'),
      HOT: wf(9, 'hot'), SLIPPERY: wf(9, 'slippery'), GRAB: wf(9, 'grabbing'), SOAP: wf(9, 'soap'), YANKED: wf(10, 'yanked'), STRAIGHT: wf(10, 'straight'), SANDBOX3: wf(10, 'sandbox'),
      DEEP: wf(11, 'deep'), SWALLOWS: wf(11, 'swallows'), SOAKS: wf(11, 'soaks'), BALL: wf(11, 'ball'), HANK: wf(12, 'hank'), FIRST: wf(12, 'first'), PICKLES2: wf(12, 'pickles'), FORTY3: wf(12, 'forty'), MELON: wf(12, 'melon') };
    const tilt = (m, x0) => { m.rotation.z = Math.atan(SL); return m; };
    // ================= the mountain road =================
    const G = K.group();
    { const len = 380, cx = BOT + len / 2 - 20; const road = new THREE.Mesh(new THREE.BoxGeometry(len / Math.cos(Math.atan(SL)), 0.3, 8), K.mat('grime', '#5a5860', { detail: 1.0, amt: 0.3 })); road.position.set(cx, roadY(cx) - 0.12, 0); tilt(road); road.receiveShadow = true; G.add(road);
      const gnd = new THREE.Mesh(new THREE.BoxGeometry(len / Math.cos(Math.atan(SL)), 0.4, 160), K.mat('grime', '#8a9a4a', { detail: 2.0, amt: 0.5 })); gnd.position.set(cx, roadY(cx) - 0.45, 0); tilt(gnd); gnd.receiveShadow = true; G.add(gnd);
      for (const lz of [-0.08, 0.08]) { const ln = new THREE.Mesh(new THREE.BoxGeometry(len / Math.cos(Math.atan(SL)), 0.02, 0.1), K.paint('#f2c230')); ln.position.set(cx, roadY(cx) + 0.04, lz); tilt(ln); G.add(ln); }
      for (const ez of [-3.75, 3.75]) { const ln = new THREE.Mesh(new THREE.BoxGeometry(len / Math.cos(Math.atan(SL)), 0.02, 0.12), K.paint('#f4f4f0')); ln.position.set(cx, roadY(cx) + 0.04, ez); tilt(ln); G.add(ln); } }
    K.slab(-700, BOT, -0.6, 0.0, -80, 80, K.mat('grime', '#8a9a4a', { detail: 2.0, amt: 0.5 }), G, false); K.slab(-700, BOT, 0.0, 0.03, -4, 4, K.mat('grime', '#5a5860', { detail: 1.0 }), G, false);
    // guard rail on the +z side (gaps at the ramps), cliff + rocks on the -z side, mile markers
    for (let x = BOT + 2; x < 70; x += 4) { if ((x > R1 - 14 && x < R1 + 4) || (x > R2 - 14 && x < R2 + 4)) continue; K.rbox(0.12, 0.8, 0.12, 0.02, K.paint('#9a9aa0', { rough: 0.4 }), x, roadY(x) + 0.4, 4.3, G);
      const rl = K.rbox(4.05, 0.3, 0.06, 0.02, K.chrome(), x + 2, roadY(x + 2) + 0.7, 4.35, G); rl.rotation.z = Math.atan(SL); }
    for (let x = BOT - 10; x < 80; x += 7) { const h = 5 + hash(x) * 8; const r = K.rbox(7.5, h, 4 + hash(x + 3) * 3, 0.8, K.mat('rock', ['#9a8a78', '#8a7a68', '#a89880'][Math.abs(x) % 3], { detail: 0.8, bump: 0.08 }), x, roadY(x) + h / 2 - 0.5, -9.5 - hash(x + 1) * 2, G); r.rotation.y = hash(x + 5) * 0.4; }
    for (let k = 0; k < 40; k++) { const x = BOT + hash(k) * 360, z = -5.2 - hash(k + 9) * 1.5; K.sphere(0.3 + hash(k + 2) * 0.5, K.mat('rock', '#9a8a78', { detail: 0.4 }), x, roadY(x), z, G, 1, 0.7, 1); }
    // ramps: gravel beds climbing away from the road, sand mounds, barrels, signs
    for (const x0 of [R1, R2]) { const L = 40, cx = x0 - 6 - L / 2;
      const wedge = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 7), K.mat('grime', '#6a6870', { detail: 1.0 })); wedge.position.set(x0 - 3, roadY(x0 - 3) - 0.1, 4.2); tilt(wedge); wedge.rotation.y = 0.25; G.add(wedge);
      const bed = new THREE.Mesh(new THREE.BoxGeometry(L / Math.cos(Math.atan(RS)), 0.5, 5.6), K.mat('dirt', '#b0a088', { detail: 0.25, amt: 0.6, bump: 0.06 })); bed.position.set(cx, rampY(x0 - 6, cx) - 0.15, RZ); bed.rotation.z = -Math.atan(RS); bed.receiveShadow = true; G.add(bed);
      for (let k = 0; k < 90; k++) { const x = x0 - 6 - hash(k + x0) * L, z = RZ - 2.6 + hash(k * 3 + x0) * 5.2; K.sphere(0.1 + hash(k + 7) * 0.12, K.mat('rock', ['#c8b8a0', '#8a8478', '#a89880'][k % 3], { detail: 0.2 }), x, rampY(x0 - 6, x) + 0.08, z, G, 1, 0.6, 1); }
      for (const s of [-1, 1]) for (let x = x0 - 8; x > x0 - 6 - L; x -= 5) { const y = rampY(x0 - 6, x); K.rbox(0.18, 0.9, 0.18, 0.04, K.paint(s > 0 ? '#f2c230' : '#2a2a30'), x, y + 0.4, RZ + s * 3.0, G); }
      for (let k = 0; k < 3; k++) { const x = x0 - 6 - L + 4 + k * 2.5; K.sphere(2.2 - k * 0.4, K.mat('dirt', '#c8b090', { detail: 0.3 }), x, rampY(x0 - 6, x), RZ + (k - 1) * 1.6, G, 1, 0.55, 1); }
      for (let k = 0; k < 5; k++) { const x = x0 - 6 - L + 1; K.cyl(0.4, 0.4, 1.0, K.paint(k % 2 ? '#f2c230' : '#2a2a30', { rough: 0.4 }), x, rampY(x0 - 6, x), RZ - 2 + k, G, 16); }
      sign(K, S, 'RUNAWAY|TRUCK RAMP', 3.2, 1.6, '#f2c230', '#1a1a1a', x0 + 14, roadY(x0 + 14), 5.6, Math.PI / 2 - 0.3);
      sign(K, S, 'RAMP|1/2 MILE', 2.4, 1.2, '#f2c230', '#1a1a1a', x0 + 40, roadY(x0 + 40), 5.0, Math.PI / 2 - 0.3); }
    sign(K, S, 'STEEP GRADE|11 MILES', 3.0, 1.6, '#f2c230', '#1a1a1a', 40, roadY(40), 5.0, Math.PI / 2 - 0.3);
    sign(K, S, 'TRUCKS|USE LOW GEAR', 3.0, 1.6, '#f4f4f0', '#1a1a1a', -150, roadY(-150), 5.0, Math.PI / 2 - 0.3);
    sign(K, S, 'MAIN ST.|2 MILES', 2.6, 1.3, '#2a7a4a', '#ffffff', -190, roadY(-190), 5.0, Math.PI / 2 - 0.3);
    for (const x of [-20, -120, -210]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.8), S.textMat('MILE|' + Math.round(-x / 20), { bg: '#2a7a4a', fg: '#ffffff', w: 128, h: 170, border: false })); m.position.set(x, roadY(x) + 1.1, 4.6); m.rotation.y = Math.PI / 2 - 0.3; G.add(m); K.cyl(0.03, 0.03, 0.8, K.paint('#8a8a90'), x, roadY(x), 4.62, G, 6); }
    S.bake(G);
    for (let k = 0; k < 46; k++) { const x = BOT - 20 + hash(k + 50) * 380, z = k % 3 === 0 ? -14 - hash(k) * 10 : 14 + hash(k + 1) * 26; if (z > 3 && z < 12 && ((x < R1 && x > R1 - 80) || (x < R2 && x > R2 - 80))) continue;
      const t = S.tree({ h: 5 + hash(k + 3) * 3, seed: k + 11, colors: ['#2f6a3a', '#3f7a4a', '#c86a2a', '#e8a030'] }); t.position.set(x, roadY(x) - (z > 0 ? (z - 4) * 0.08 : 0) - 0.2, z); }
    // distant mountains
    for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(new THREE.ConeGeometry(30 + hash(k) * 20, 40 + hash(k + 1) * 30, 6), K.mat('rock', '#7a7a8a', { detail: 3 })); m.position.set(-200 + k * 70, 10, -90 - hash(k + 2) * 40); sc.add(m);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(12, 14, 6), K.paint('#f4f6f8', { rough: 0.6 })); cap.position.set(m.position.x, m.position.y + 20 + hash(k + 1) * 15 - 7, m.position.z); sc.add(cap); }
    // Main Street at the bottom
    let x = BOT - 8, i = 0; while (x > BOT - 80) { const w = 5 + (i * 7 % 3); for (const s of [-1, 1]) { const b = S.building({ w, d: 8, floors: 2 + ((i + (s > 0 ? 1 : 0)) % 2), seed: i * 2 + (s > 0 ? 1 : 0) + 30, shop: [null, 'DINER', null, 'BANK', 'MELONS?', null, 'HOTEL'][(i + (s > 0 ? 3 : 0)) % 7], flowers: true, awning: i % 2 ? '#c83a2a' : undefined }); b.position.set(x - w / 2, 0, s * 9); b.rotation.y = s > 0 ? Math.PI : 0; } x -= w + 0.1; i++; }
    for (const s of [-1, 1]) K.cyl(0.12, 0.12, 6, K.paint('#3a4048'), BOT - 6, 0, s * 4.6, sc, 10);
    { const b = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.2), S.textMat('WELCOME TO MAIN STREET', { bg: '#c83a2a', fg: '#ffffff', w: 1024, h: 140, border: false })); b.position.set(BOT - 6, 5.4, 0); b.rotation.y = Math.PI / 2; sc.add(b); }
    TOWNF = S.extras(8, { x0: BOT - 60, len: 50, z: 5.4, spread: 0.8, seed: 5, stillShare: 0.6 });
    // ================= the hero prop: Hank's big rig with forty tons of watermelons (front = local +x) =================
    TRK = new THREE.Group(); sc.add(TRK); { const RD = K.paint('#c8282a', { rough: 0.22 }), CR = K.chrome(), BK = K.paint('#1c1c22', { rough: 0.45 }), GD = K.gold(), GLs = K.glass({ color: '#bfe4ff', opacity: 0.1 });
      K.rbox(13, 0.35, 1.9, 0.06, BK, -1, 0.95, 0, TRK);                                                   // chassis
      K.rbox(1.8, 1.15, 2.3, 0.25, RD, 5.3, 1.75, 0, TRK); K.rbox(0.18, 1.0, 2.0, 0.05, CR, 6.25, 1.7, 0, TRK);   // hood + grille
      for (let k = 0; k < 7; k++) K.rbox(0.05, 0.9, 0.05, 0.01, BK, 6.36, 1.7, -0.84 + k * 0.28, TRK);
      K.rbox(0.35, 0.35, 2.7, 0.1, CR, 6.35, 0.95, 0, TRK);                                                   // bumper
      K.rbox(2.3, 1.25, 2.6, 0.2, RD, 3.4, 1.75, 0, TRK);                                                     // cab lower
      K.rbox(0.16, 1.5, 2.56, 0.05, RD, 2.3, 3.1, 0, TRK); for (const s of [-1, 1]) { K.rbox(0.14, 1.45, 0.14, 0.04, RD, 4.45, 3.1, s * 1.23, TRK); K.rbox(0.12, 1.45, 0.12, 0.04, RD, 2.4, 3.1, s * 1.23, TRK); }
      K.rbox(2.4, 0.16, 2.62, 0.05, RD, 3.4, 3.88, 0, TRK); K.rbox(0.5, 0.12, 2.5, 0.04, BK, 4.75, 3.82, 0, TRK);   // roof + visor
      for (let k = 0; k < 5; k++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb030').multiplyScalar(2), toneMapped: false })); l.position.set(4.6, 4.0, -0.8 + k * 0.4); TRK.add(l); }
      const ws = K.rbox(0.06, 1.2, 2.3, 0.03, GLs, 4.5, 3.1, 0, TRK); ws.rotation.z = 0.12;
      K.rbox(1.5, 2.7, 2.5, 0.2, RD, 1.45, 2.4, 0, TRK);                                                      // sleeper
      for (const s of [-1, 1]) { K.cyl(0.1, 0.1, 3.2, CR, 2.1, 1.6, s * 1.3, TRK, 12); K.rbox(0.1, 0.55, 0.08, 0.02, CR, 4.5, 3.0, s * 1.45, TRK); const tank = K.cyl(0.36, 0.36, 1.6, CR, 3.3, 0.95, s * 1.15, TRK, 20); tank.rotation.z = Math.PI / 2; tank.position.set(3.3, 0.95, s * 1.15); }
      for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.025, 6, 30, Math.PI), GD); st.position.set(3.4, 1.5, s * 1.31); TRK.add(st); }
      for (const s of [-0.85, 0.85]) { const hl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2), toneMapped: false })); hl.position.set(6.3, 1.55, s); TRK.add(hl); }
      const dn = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.45), S.textMat('BIG HANK', { bg: '#c8282a', fg: '#f2c230', w: 400, h: 130, border: false })); for (const s of [-1, 1]) { const n = dn.clone(); n.position.set(3.4, 1.75, s * 1.31); n.rotation.y = s > 0 ? 0 : Math.PI; TRK.add(n); }
      // cab interior: bench, steering wheel, dash
      K.rbox(0.7, 0.5, 2.3, 0.1, K.mat('fabric', '#6a3a24'), 2.9, 2.35, 0, TRK); K.rbox(0.4, 0.5, 2.3, 0.08, BK, 4.2, 2.45, 0, TRK);
      const sw = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 8, 24), BK); sw.position.set(3.95, 2.95, 0.6); sw.rotation.set(0, Math.PI / 2, 0.5); sw.rotation.order = 'YXZ'; TRK.add(sw); TRK.userData.sw = sw;
      // flatbed + rails + watermelons
      K.rbox(9.2, 0.3, 2.5, 0.05, K.mat('wood', '#8a5a34'), -3.8, 1.3, 0, TRK);
      for (const s of [-1, 1]) for (let k = 0; k < 7; k++) K.rbox(0.1, 1.2, 0.1, 0.02, K.mat('wood', '#a8703a'), -8.2 + k * 1.45, 2.0, s * 1.2, TRK);
      for (const s of [-1, 1]) for (const y of [1.9, 2.5]) K.rbox(9.0, 0.12, 0.08, 0.02, K.mat('wood', '#a8703a'), -3.8, y, s * 1.22, TRK);
      const mm = K.paint('#ffffff', { rough: 0.25, coat: 0.6 }); mm.map = stripeTex(K);
      for (let k = 0; k < 64; k++) { const lay = k < 30 ? 0 : k < 50 ? 1 : 2, n = lay === 0 ? 30 : lay === 1 ? 20 : 14, kk = lay === 0 ? k : lay === 1 ? k - 30 : k - 50, cols = lay === 0 ? 10 : lay === 1 ? 10 : 7;
        const mx = -8.0 + (kk % cols) * (8.4 / cols) + (lay ? 0.3 : 0), mz = (Math.floor(kk / cols) - (n / cols - 1) / 2) * 0.75; void n;
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12), mm); m.scale.set(1.3, 0.95, 0.95); m.position.set(mx, 1.85 + lay * 0.62, mz); m.rotation.set(hash(k) * 0.4, hash(k + 1) * 6, 0); m.castShadow = true; TRK.add(m); MEL.push({ m, p: m.position.clone(), k }); }
      const tb = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.8), S.textMat("HANK'S MELONS|40 TONS", { bg: '#2a7a3a', fg: '#ffffff', w: 512, h: 170, border: false })); tb.position.set(-8.45, 2.1, 0); tb.rotation.y = -Math.PI / 2; TRK.add(tb);
      // wheels with brake hubs (glow with heat)
      HUB = new THREE.MeshBasicMaterial({ color: '#333', toneMapped: false }); TRK.userData.wheels = [];
      for (const wx of [5.2, 1.9, 0.8, -6.6, -7.7]) for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(wx, 0.55, s * 1.12); TRK.add(w);
        const t = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.42, 24), K.paint('#1a1a1a', { rough: 0.7, coat: 0.2 })); t.rotation.x = Math.PI / 2; w.add(t);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.44, 16), CR); rim.rotation.x = Math.PI / 2; w.add(rim);
        const hub = new THREE.Mesh(new THREE.CircleGeometry(0.26, 20), HUB); hub.position.z = s * 0.23; hub.rotation.y = s > 0 ? 0 : Math.PI; hub.userData.ndSkip = true; w.add(hub);
        for (let k = 0; k < 6; k++) { const sp = K.rbox(0.05, 0.3, 0.02, 0.01, CR, 0, 0, s * 0.235, w); sp.rotation.z = k * Math.PI / 3; sp.geometry.translate(0, 0.15, 0); }
        TRK.userData.wheels.push(w); }
      for (const wx of [5.2, 1.35, -7.15]) for (const s of [-1, 1]) K.rbox(wx === 1.35 ? 2.4 : wx < 0 ? 2.4 : 1.4, 0.1, 0.5, 0.04, BK, wx, 1.2, s * 1.15, TRK);
      TRK.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; }); }
    CUP = new THREE.Group(); sc.add(CUP); K.cyl(0.07, 0.06, 0.16, K.paint('#f4f4f0'), 0, 0, 0, CUP, 12); COF = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 1, 8), K.paint('#5a3418', { rough: 0.2, coat: 1 })); sc.add(COF);
    BUCK = new THREE.Group(); sc.add(BUCK); K.cyl(0.18, 0.13, 0.3, K.paint('#e8202a', { rough: 0.3 }), 0, 0, 0, BUCK, 16); const sp = K.rbox(0.05, 0.5, 0.03, 0.01, K.paint('#2a6ad0'), 0.3, 0.25, 0, BUCK); sp.rotation.z = -0.3; K.rbox(0.16, 0.18, 0.03, 0.03, K.paint('#2a6ad0'), 0.36, 0.0, 0, BUCK);
    // ================= explainer stage: x-ray brake + soap =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    HX.wheel = new THREE.Group(); HX.wheel.position.set(EX[0] - 1.0, 2.2, EX[2]); sc.add(HX.wheel);
    { const tire = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.45, 16, 48), K.holo('#36e2ff')); HX.wheel.add(tire); HX.drum = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.5, 40), new THREE.MeshBasicMaterial({ color: '#444', toneMapped: false })); HX.drum.rotation.x = Math.PI / 2; HX.wheel.add(HX.drum);
      HX.spin = new THREE.Group(); HX.wheel.add(HX.spin); for (let k = 0; k < 8; k++) { const s = K.rbox(0.08, 1.4, 0.06, 0.02, K.holo('#7af8ff'), 0, 0, 0.3, HX.spin); s.rotation.z = k * Math.PI / 4; }
      HX.pads = []; for (const s of [-1, 1]) { const p = K.rbox(0.35, 1.1, 0.4, 0.06, K.paint('#d8a030', { rough: 0.4 }), s * 1.2, 0, 0, HX.wheel); HX.pads.push(p); } }
    HX.soap = new THREE.Group(); sc.add(HX.soap); K.rbox(0.7, 0.3, 0.42, 0.14, K.paint('#9ad8ff', { rough: 0.05, coat: 1 }), 0, 0, 0, HX.soap); for (let k = 0; k < 6; k++) K.sphere(0.06 + hash(k) * 0.05, K.glass({ color: '#ffffff', opacity: 0.5 }), -0.3 + hash(k + 1) * 0.6, 0.18, -0.2 + hash(k + 2) * 0.4, HX.soap);
    HX.therm = new THREE.Group(); HX.therm.position.set(EX[0] + 2.6, 0, EX[2] + 0.5); sc.add(HX.therm); K.cyl(0.18, 0.18, 4, K.glass({ color: '#ffffff', opacity: 0.3 }), 0, 0.4, 0, HX.therm, 16); K.sphere(0.35, K.paint('#e8202a'), 0, 0.4, 0, HX.therm);
    HX.merc = K.cyl(0.11, 0.11, 1, K.paint('#e8202a', { rough: 0.2 }), 0, 0.5, 0, HX.therm, 12);
    // ================= characters =================
    HANK = K.stick({ jacket: '#3a5a9a', pants: '#2a2a40', hat: 'cowboy', hatColor: '#8a5a34', moustache: '#5a3a24', vest: '#c8a070', belt: '#3a2418', scarf: '#c83a2a', build: 'stout', boots: '#5a3a24' }, { key: 'hank' });
    JUN = K.stick({ jacket: '#f2a030', pants: '#2a3a5a', hat: 'cap', hatColor: '#2a7a4a', hairStyle: 'ponytail', hair: '#1a1210', glasses: '#2a2a2a', collar: '#f4f4f0', pockets: true }, { key: 'jun' });
    PIG = K.animal('pig', { seed: 2, scale: 0.8 });
    K.addClouds(10, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), sc = K.scene;
    const ex = f >= 828 && f < 1046;
    // ---------- truck path ----------
    let tx = -48 - 0.4 * f, onRamp = 0, speed = 0.4;
    if (f >= 350 && f < 548) tx = -60 - 0.4 * (f - 350);
    else if (f >= 548 && f < 828) { tx = -100 - 0.45 * (f - 548) - 0.0006 * (f - 548) ** 2; speed = 0.45 + 0.0012 * (f - 548); }
    else if (f >= 1046) { const u = f - 1046; if (u < 50) tx = -222 - 0.75 * u; else { const v = Math.min(u - 50, 80); tx = -259.5 - 0.75 * v + 0.0047 * v * v; onRamp = 1; } speed = u < 50 ? 0.75 : Math.max(0, 0.75 - 0.0094 * Math.min(u - 50, 80)); }
    const veer = f >= 1046 ? sm(F.YANKED - 4, F.SANDBOX3 + 6, f) : 0;
    const tz = lerp(-1.8, RZ, veer), sink = onRamp ? 0.38 * sm(F.DEEP - 10, F.SOAKS, f) : 0;
    const ty = lerp(roadY(tx), Math.max(roadY(tx), rampY(R2 - 6, tx)), veer) - sink;
    const pitch = lerp(-Math.atan(SL), Math.atan(RS), sm(F.SANDBOX3 - 6, F.SANDBOX3 + 14, f) * (f >= 1046 ? 1 : 0));
    TRK.visible = !ex; TRK.position.set(tx, ty, tz); TRK.rotation.set(0, Math.PI - 0.35 * Math.sin(Math.PI * veer) * (f < 1200 ? 1 : 0), pitch);
    TRK.userData.wheels.forEach((w) => { w.rotation.z = -tx / 0.55; });
    TRK.userData.sw.rotation.z = 0.5 + (f >= F.YANKED - 4 && f < F.SANDBOX3 + 6 ? -1.6 * Math.sin(Math.PI * sm(F.YANKED - 4, F.SANDBOX3 + 6, f)) : 0.15 * Math.sin(f * 0.2));
    // brake heat
    let H = 0.72; if (f >= 350 && f < 455) H = [0.15, 0.4, 0.7, 0.95][f < F.TOASTY - 2 ? 0 : f < F.GLOWING - 2 ? 1 : f < F.SMOKING - 2 ? 2 : 3]; else if (f >= 455) H = 1.0; if (f >= 1231) H = 1.0 - 0.4 * sm(1231, 1364, f);
    if (f < 350 && f >= 0) H = 0.78;
    const c = new THREE.Color('#2a2a2a').lerp(new THREE.Color('#ff3a10'), clamp(H * 1.4, 0, 1)).lerp(new THREE.Color('#ffd070'), clamp((H - 0.7) * 2.5, 0, 1)); HUB.color.copy(c).multiplyScalar(0.6 + 2.2 * H);
    // melons spill forward when it stops
    const spill = sm(F.SOAKS, F.BALL + 6, f);
    MEL.forEach(({ m, p, k }) => { if (k >= 50) { m.position.set(p.x + spill * (3 + hash(k) * 4), p.y + spill * (Math.sin(Math.PI * spill) * 1.5 - 0.6), p.z + spill * (hash(k + 3) - 0.5) * 3); } else m.position.copy(p); });
    const WV = (lx, ly, lz) => TRK.localToWorld(new THREE.Vector3(lx, ly, lz)); const WP = (lx, ly, lz) => WV(lx, ly, lz).toArray();
    TRK.updateMatrixWorld(true);
    // ---------- Hank, Junie, Pickles in the cab ----------
    const inCab = !ex && f < 1231;
    const hk = [[0, 'wave', { expr: 'grin', sweat: true }], [F.RAMP, 'wave', { expr: 'smug' }], [100, 'sit', { expr: 'proud' }], [F.SANDBOX - 6, 'sit', { expr: 'grin', talk: true, R: [0.6, -0.3, 'open'] }], [F.FLEW, 'sit', { expr: 'smug' }],
      [350, 'sit', { expr: 'whistle' }], [F.GLOWING, 'sit', { expr: 'nervous', sweat: true }], [455, 'sit', { expr: 'proud', R: [0.6, -0.2, 'cup'] }], [F.STEAM, 'sit', { expr: 'nervous', sweat: true, R: [0.6, -0.2, 'cup'] }],
      [548, 'sit', { expr: 'confused' }], [F.SANK, 'sit', { expr: 'shock' }], [F.NOBR, 'sit', { expr: 'scared', sweat: true }], [661, 'sit', { expr: 'scared', sweat: true }], [F.SANDBOX2 - 6, 'sit', { expr: 'yell', talk: true, R: [0.6, -0.3, 'open'] }],
      [1046, 'sit', { expr: 'scared', sweat: true }], [F.YANKED, 'sit', { expr: 'shock' }], [F.SOAKS, 'sit', { expr: 'dazed' }],
      [1231, 'sit', { expr: 'sad', R: [0.4, -0.2, 'open'] }], [F.FIRST, 'shrug', { expr: 'pained' }], [F.PICKLES2, 'sit', { expr: 'dazed' }]];
    const hA = T.act(f, hk, { seed: 3, blink: blink(3) });
    if (inCab) { TRK.add(HANK.root); HANK.set(hA, { x: 3.0, y: 1.95, z: 0.65, yaw: Math.PI / 2 + (f < 100 || (f >= F.SANDBOX - 6 && f < F.FLEW) || (f >= F.SANDBOX2 - 6 && f < 759) ? 0.9 : 0), seat: 0.45, visible: true }); }
    else { sc.add(HANK.root); const p = WV(-8.2, 0, 3.2); HANK.set(hA, { x: p.x, y: rampY(R2 - 6, p.x) + 0.05, z: p.z + 0.4, yaw: 0.9, seat: 0.12, visible: !ex }); }
    const jk = [[0, 'sit', { expr: 'scared', sweat: true }], [F.GRAVEL, 'sit', { expr: 'nervous', R: [0.7, -0.6, 'open'] }], [350, 'sit', { expr: 'nervous' }], [F.COFFEE, 'sit', { expr: 'shock' }], [548, 'sit', { expr: 'scared', sweat: true }], [661, 'sit', { expr: 'stern' }],
      [F.SANDBOX2, 'sit', { expr: 'angry' }], [ex ? 952 : 1046, 'grab', { expr: 'stern' }], [F.YANKED - 4, 'sit', { expr: 'yell', R: [0.6, 0.0, 'open'], L: [-0.6, 0.0, 'open'] }], [F.SOAKS, 'sit', { expr: 'relief' }], [1231, 'cheer', { expr: 'laugh' }], [F.PICKLES2, 'clap', { expr: 'laugh' }]];
    const jA = T.act(f, ex ? [[952, 'reach', { expr: 'proud' }], [F.GRAB - 4, 'grab', { expr: 'excited' }], [F.SOAP, 'shock', { expr: 'shock' }], [F.SOAP + 14, 'facepalm', { expr: 'pained' }]] : jk, { seed: 6, blink: blink(6) });
    if (inCab) { TRK.add(JUN.root); JUN.set(jA, { x: 3.0, y: 1.95, z: -0.65, yaw: Math.PI / 2 + (f < F.GRAVEL + 20 && f >= F.GRAVEL - 4 ? 0.8 : 0), seat: 0.45, visible: true }); }
    else if (ex) { sc.add(JUN.root); JUN.set(jA, { x: EX[0] + 0.3, z: EX[2] + 1.6, yaw: -0.5, visible: f >= 952 }); }
    else { sc.add(JUN.root); const p = WV(-6.0, 0, 3.0); JUN.set(jA, { x: p.x, y: rampY(R2 - 6, p.x) + 0.05, z: p.z + 0.6, yaw: 0.9, visible: true }); }
    if (inCab) { TRK.add(PIG.root); PIG.set(f, { x: 3.1, y: 2.45, z: 0, yaw: Math.PI / 2, mode: f < 548 ? 'sit' : 'sit', expr: f < 100 ? 'shock' : f < 218 ? 'happy' : f < 548 ? 'neutral' : 'shock', visible: true }); }
    else { TRK.add(PIG.root); PIG.set(f, { x: -4.0, y: 2.9, z: 0, yaw: Math.PI / 2 + 0.3 * Math.sin(f * 0.05), mode: 'eat', expr: 'happy', visible: !ex }); }
    // coffee cup + pour
    const pour = f >= F.POURED - 4 && f < F.STEAM + 6; CUP.visible = false; COF.visible = pour && !ex;
    if (pour) { const a = WV(3.6, 2.9, 1.45), b = WV(5.2, 0.6, 1.4); COF.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2); COF.scale.set(1, a.distanceTo(b), 1); COF.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize()); }
    BUCK.visible = f >= 1231; { const p = WV(-8.2, 0, 3.2); BUCK.position.set(p.x + 0.8, rampY(R2 - 6, p.x + 0.8) + 0.2, p.z + 0.9); }
    K.set.extrasFrame(f, TOWNF, T);
    // ---------- explainer ----------
    HX.wheel.visible = HX.therm.visible = ex && f < 952; HX.spin.rotation.z = -f * 0.3;
    const squeeze = sm(F.RUBBING - 6, F.RUBBING + 6, f); HX.pads.forEach((p, k) => { p.position.x = (k ? 1 : -1) * lerp(1.45, 1.12, squeeze); });
    const hx = sm(F.HEAT - 10, F.HEAT + 50, f); const hc = new THREE.Color('#444').lerp(new THREE.Color('#ff3a10'), hx).lerp(new THREE.Color('#ffd070'), sm(F.ELEVEN2, F.ELEVEN2 + 20, f)); HX.drum.material.color.copy(hc).multiplyScalar(0.7 + 1.8 * hx);
    HX.merc.scale.set(1, 0.3 + 3.2 * hx, 1); HX.merc.position.y = 0.5;
    HX.soap.visible = ex && f >= 952; { const u = clamp((f - F.SOAP + 4) / 24, 0, 1); HX.soap.position.set(EX[0] + 0.9 + 6 * u, 1.0 + 2.5 * Math.sin(Math.PI * Math.min(1, u * 1.4)), EX[2] + 1.6 - 2 * u); HX.soap.rotation.set(u * 8, u * 5, 0); }
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const TB = () => [WP(6.5, 0, -1.4), WP(6.5, 4.0, 1.4), WP(-8.5, 0, 1.4), WP(-8.5, 3.6, -1.4)];
    
    if (sh(0, 48)) {                          // 1. hook: the rig barrels downhill, brakes glowing, Hank waving out the window (front-quarter low wide)
      cam = K.fit([...TB(), WP(10, 0, 4)], { yaw: 140, pitch: 7, fov: 44, margin: 0.72, maxDist: 14 }); cam.mb = f > 0 ? 0.2 : 0;
    } else if (sh(48, 100)) {                 // 2. ... and he waved off the ramp (wide: the ramp sign flies by, the gravel bed)
      cam = K.fit([...TB(), [R1 - 10, roadY(R1 - 10), RZ], [R1 + 14, roadY(R1 + 14) + 3, 5.6]], { yaw: 100, pitch: 14, fov: 46, margin: 0.75, maxDist: 18 }); cam.fov *= K.punch(f, F.RAMP, 0.08, 6);
    } else if (sh(100, 153)) {                // 3. forty tons of watermelons (high rear wide)
      cam = K.fit(TB(), { yaw: 30, pitch: 26, fov: 44, margin: 0.8, maxDist: 15 }); cam.fov *= K.punch(f, F.FORTY, 0.08, 6);
    } else if (sh(153, 218)) {                // 4. Pickles the pig, drooling (through the windscreen)
      const l = WV(3.2, 2.7, 0); const p = WV(7.6, 3.4, 1.0); cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 34 * K.push(u, 0.06) }; dof = { focus: 4.4, cinf: 10 };
    } else if (sh(218, 280)) {                // 5. "No sandbox for Hank!" (Hank at the window, side)
      const l = WV(3.0, 2.8, 0.7); const p = WV(4.6, 3.4, 4.2); cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 40 * K.push(u, 0.05) }; dof = { focus: 3.8, cinf: 10 };
    } else if (sh(280, 350)) {                // 6. Junie points, the gravel ramp flies by (wide side)
      cam = K.fit(TB(), { yaw: 118, pitch: 12, fov: 46, margin: 0.75, maxDist: 15 }); cam.fov *= K.punch(f, F.GRAVEL, 0.06, 6);
    } else if (sh(350, 400)) {                // 7. warm, toasty (low wide on the wheels, hubs glowing)
      cam = K.fit([WP(6, 0, 1.2), WP(-1, 2.4, 1.2), WP(2, 0, 3)], { yaw: 80, pitch: 4, fov: 40, margin: 0.9, maxDist: 8 }); cam.fov *= K.punch(f, F.TOASTY, 0.06, 6);
    } else if (sh(400, 455)) {                // 8. glowing, smoking (tracking wide, smoke trailing)
      cam = K.fit(TB(), { yaw: 75 + 12 * u, pitch: 10, fov: 46, margin: 0.78, maxDist: 15 }); cam.fov *= K.punch(f, F.SMOKING, 0.08, 6);
    } else if (sh(455, 500)) {                // 9. he poured his coffee on them (full side: arm, cup, front wheel)
      cam = K.fit([WP(6.4, 0, 1.3), WP(2.2, 3.9, 1.3), WP(4, 0, 3)], { yaw: 100, pitch: 8, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.COFFEE, 0.06, 6);
    } else if (sh(500, 548)) {                // 10. glowing and steaming (wide, steam clouds)
      cam = K.fit(TB(), { yaw: 140, pitch: 12, fov: 46, margin: 0.8, maxDist: 15 }); cam.fov *= K.punch(f, F.STEAM, 0.08, 6);
    } else if (sh(548, 600)) {                // 11. the pedal sinks like a whoopee cushion (Hank reaction through the windscreen)
      const l = WV(3.0, 2.8, 0.4); const p = WV(7.2, 3.3, 1.6); cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 36 * K.punch(f, F.WHOOPEE, 0.1, 6) }; dof = { focus: 4.4, cinf: 10 };
    } else if (sh(600, 661)) {                // 12. forty tons, no brakes (fast tracking wide)
      cam = K.fit(TB(), { yaw: 160 - 30 * u, pitch: 15, fov: 50, margin: 0.75, maxDist: 15 }); cam.mb = 0.5; const s = K.shake(f, F.NOBR, 0.06, 14); cam.pos[1] += s[1];
    } else if (sh(661, 712)) {                // 13. one ramp left before Main Street (behind the truck, the town below)
      const p = WV(-16, 6.5, -2.5), l = WV(30, 0, 1); cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y - 4, l.z], fov: 50 * K.push(u, 0.05) };
    } else if (sh(712, 759)) {                // 14. "No sandbox for Hank!" (Hank yelling, Junie glaring)
      const l = WV(3.0, 2.8, 0); const p = WV(7.4, 3.4, 1.2); cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 42 * K.punch(f, F.SANDBOX2, 0.08, 6) }; dof = { focus: 4.5, cinf: 9 };
    } else if (sh(759, 828)) {                // 15. why would brakes quit at the bottom? (high wide: truck, ramp, town)
      cam = K.fit([...TB(), [R2 - 10, roadY(R2 - 10), RZ]], { yaw: 80, pitch: 16, fov: 46, margin: 0.75, maxDist: 17 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(828, 890)) {                // 16. explainer: brakes stop a truck by rubbing (x-ray wheel)
      cam = K.fit([[EX[0] - 3.2, 0, EX[2] - 1], [EX[0] + 3, 4.4, EX[2] + 1]], { yaw: 90 + 10 * u, pitch: 8, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.RUBBING, 0.06, 6);
    } else if (sh(890, 952)) {                // 17. eleven miles of heat (closer, glow + thermometer)
      cam = K.fit([[EX[0] - 2.8, 0.5, EX[2] - 1], [EX[0] + 3, 4.4, EX[2] + 1]], { yaw: 70 - 10 * u, pitch: 12, fov: 40, margin: 0.85, maxDist: 10 }); cam.fov *= K.punch(f, F.ELEVEN2, 0.1, 6);
    } else if (sh(952, 1000)) {               // 18. too hot = slippery: Junie grabs a wet bar of soap (full shot)
      cam = K.fit([[EX[0] - 0.5, 0, EX[2] + 1], [EX[0] + 2.5, 2.4, EX[2] + 2]], { yaw: 80, pitch: 8, fov: 40, margin: 1.0, maxDist: 8 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(1000, 1046)) {              // 19. ... the soap shoots away (wide)
      cam = K.fit([[EX[0] - 0.5, 0, EX[2]], [EX[0] + 7, 3.6, EX[2] + 2]], { yaw: 110, pitch: 10, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.SOAP, 0.1, 6);
    } else if (sh(1046, 1088)) {              // 20. Junie yanks the wheel (cab, through the windscreen)
      const l = WV(3.1, 2.8, -0.2); const p = WV(7.4, 3.3, -1.2); cam = { pos: [p.x, p.y, p.z], look: [l.x, l.y, l.z], fov: 42 * K.punch(f, F.YANKED, 0.1, 6) }; dof = { focus: 4.5, cinf: 9 };
    } else if (sh(1088, 1123)) {              // 21. straight into the sandbox (high wide)
      cam = K.fit([...TB(), [R2 - 30, rampY(R2 - 6, R2 - 30), RZ]], { yaw: 60, pitch: 26, fov: 46, margin: 0.75, maxDist: 22 }); cam.fov *= K.punch(f, F.SANDBOX3, 0.08, 6);
    } else if (sh(1123, 1175)) {              // 22. deep gravel swallows the wheels (low wide, gravel spray)
      cam = K.fit([...TB(), WP(0, 0, 4)], { yaw: 60, pitch: 5, fov: 46, margin: 0.75, maxDist: 15 }); cam.fov *= K.punch(f, F.SWALLOWS, 0.08, 6); const s = K.shake(f, F.SOAKS, 0.06, 16); cam.pos[1] += s[1];
    } else if (sh(1175, 1231)) {              // 23. like a ball pit: stopped, melons tumble (wide)
      cam = K.fit([...TB(), WP(10, 0, 0)], { yaw: 70, pitch: 14, fov: 46, margin: 0.85, maxDist: 18 }); cam.fov *= K.punch(f, F.BALL, 0.08, 6);
    } else if (sh(1231, 1272)) {              // 24. Hank got his first sandbox (full shot: Hank in the gravel with a bucket)
      const h = HANK.root.position; cam = K.fit([[h.x - 1.2, h.y, h.z], [h.x + 1.6, h.y + 1.8, h.z + 1], [JUN.root.position.x, JUN.root.position.y + 2.2, JUN.root.position.z]], { yaw: 40, pitch: 10, fov: 40, margin: 0.95, maxDist: 8 }); cam.fov *= K.punch(f, F.FIRST, 0.08, 6);
    } else {                                  // 25. Pickles got forty tons of melon (wide pull-back: truck in the gravel, town below)
      cam = K.fit([...TB(), WP(10, 0, 0), [HANK.root.position.x, HANK.root.position.y, HANK.root.position.z]], { yaw: lerp(25, 40, u), pitch: 16, fov: 46, margin: 0.8, maxDist: 17 }); cam.fov *= K.punch(f, F.MELON, 0.06, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (!ex && H > 0.85 && f < 1300) for (const wl of [[1.9, 1.12], [-6.6, 1.12]]) K.steam(f, () => { const p = WV(wl[0], 0.55, wl[1]); return [p.x, p.y, p.z]; }, { rate: 3, size: 0.4, rise: 1.0, drift: [1.5, 0], dark: f >= F.COFFEE + 4 && f < 600 ? 0 : 0.6 });
    if (!ex && f >= F.COFFEE && f < 600) K.steam(f, () => { const p = WV(5.2, 0.6, 1.3); return [p.x, p.y, p.z]; }, { rate: 8, size: 0.6, rise: 1.6, drift: [1, 0], dark: 0 });
    if (!ex && f < 1300) K.steam(f, () => { const p = WV(2.1, 4.8, 1.3); return [p.x, p.y, p.z]; }, { rate: 2, size: 0.3, rise: 1.0, drift: [0.6, 0], dark: 0.6 });
    if (f >= F.SANDBOX3 - 4 && f < 1231) { K.sparks(f, F.SANDBOX3 - 4, 1231, () => { const p = WV(5.2, 0.3, 1.2); return [p.x, p.y, p.z]; }, { dir: [0, 1.2, 1], spread: 1.6, rate: 30 * Math.max(0.2, speed), speed: 4, life: 14, color: '#c8b8a0', seed: 7 }); if (f % 3 === 0) { const p = WV(1.4, 0, 1.4); K.puff(f, f, p.x, p.z, 6, 1.1, '#c8b8a0'); } }
    if (f >= F.SANDBOX3 - 4 && f < 1231 && f % 4 === 0) { const p = WV(-7, 0, -1.4); K.puff(f, f, p.x, p.z, 5, 1.0, '#c8b8a0'); }
    if (ex && f < 952 && f >= F.RUBBING) K.sparks(f, F.RUBBING, 952, [EX[0] - 1.0 + 1.1, 2.2, EX[2] + 0.3], { dir: [0.3, 1, 0.5], spread: 1.2, rate: 26, speed: 3, life: 10, color: '#ffb050', seed: 3 });
    K.leaves(f, cam.look, { area: 14, count: 14, fall: 0.6, colors: ['#e8a030', '#c86a2a', '#f2c12e'] });
    K.mist(f, 822, 14); K.mist(f, 1040, 14);
    K.badge(f, F.TOASTERS, 'BRAKES: GLOWING', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: F.RAMP - 2 });
    K.badge(f, F.RAMP, 'RAMP: NO THANKS', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 98 });
    K.badge(f, F.FORTY, '40 TONS OF MELONS', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 212 });
    K.badge(f, F.SANDBOX, 'NO SANDBOX FOR HANK!', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 344 });
    for (const [w, t, nx] of [['WARM', F.WARMW, F.TOASTY], ['TOASTY', F.TOASTY, F.GLOWING], ['GLOWING', F.GLOWING, F.SMOKING], ['SMOKING', F.SMOKING, 452]]) K.badge(f, t, w, { sx: 0.5, sy: 0.3 }, { icon: 'up', f1: nx - 2 });
    if (f >= 350 && f < 455) K.hud(f, 352, { stages: 4, labels: ['WARM', 'TOASTY', 'GLOWING', 'SMOKING'], u: [0.08, 0.36, 0.64, 0.95][f < F.TOASTY ? 0 : f < F.GLOWING ? 1 : f < F.SMOKING ? 2 : 3], f1: 453 });
    K.badge(f, F.COFFEE, 'COFFEE FIX', { sx: 0.5, sy: 0.2 }, { icon: 'drop', f1: F.STEAM - 2 });
    K.badge(f, F.STEAM, 'NOW STEAMING TOO', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 544 });
    K.badge(f, F.NOBR, 'NO BRAKES', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 658 });
    K.badge(f, F.MAIN, 'LAST RAMP BEFORE TOWN', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 756 });
    K.badge(f, F.HEAT, 'RUBBING = HEAT', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 948 });
    K.badge(f, F.SLIPPERY, 'TOO HOT = SLIPPERY', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1042 });
    K.badge(f, F.SOAKS, 'GRAVEL SOAKS UP SPEED', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1228 });
    K.badge(f, F.FIRST, "HANK'S FIRST SANDBOX", { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 1362 });
    const L = ex ? K.light('night', { az: 120, el: 40, exposure: 1.3 }) : K.light('golden', { az: 125, el: 30, shadowExt: 30, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
