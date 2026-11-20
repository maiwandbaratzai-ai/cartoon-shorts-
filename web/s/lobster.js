// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did poet Gérard de Nerval walk a lobster through Paris?" (story, inspired by the anecdote of Nerval walking his
// lobster Thibault on a blue silk ribbon in the Palais-Royal garden, and his famous answer about lobsters vs. dogs.)
// Set: a sunny Paris palace garden: gravel walk, clipped lime trees, arcades, a round fountain, benches, pigeons, a poodle.
import { TOTAL, LINES, wf } from './lobster_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, LOB, RIB = [], POOD, PIG = [], JET, SPL = [];
let GER, LADY, KID, GENT, COP, REP, WOM;
const GER_O = { jacket: '#2a5a4a', pants: '#2a2a34', boots: '#111', hat: 'tophat', hatColor: '#1a1a22', scarf: '#c0392b', moustache: '#3a2a1a', gloves: '#f4efe4', vest: '#e8c860', hairStyle: 'long', hair: '#3a2a1a' };
const LADY_O = { jacket: '#e88aa8', dress: '#e88aa8', hairStyle: 'bun', hair: '#c88a3a', collar: '#ffffff', scarf: '#ffffff', gloves: '#ffffff' };
const KID_O = { jacket: '#f2c230', pants: '#3a6ea5', boots: '#7a3a2a', hat: 'beanie', hatColor: '#3a6ea5', build: 'kid', scarf: '#e84a5f' };
const GENT_O = { jacket: '#8a8a92', pants: '#5a5a62', boots: '#111', hat: 'tophat', hatColor: '#6a6a72', glasses: true, tie: '#5a2a7a', vest: '#c8c0b0', moustache: '#e8e0d0' };
const COP_O = { jacket: '#1f2a5a', pants: '#1f2a5a', boots: '#111', hat: 'police', badge: true, belt: '#111', gloves: '#ffffff', moustache: '#111' };
const REP_O = { jacket: '#c87a3a', pants: '#4a4a3a', boots: '#3a2a1a', hat: 'cap', cap: '#5a5a3a', vest: '#7a5a3a', pockets: true, glasses: '#333', bowtie: '#2a6a8a' };
const WOM_O = { jacket: '#5a8a3a', dress: '#5a8a3a', hairStyle: 'ponytail', hair: '#2a1a12', apron: '#f4efe4', collar: '#ffe0a0' };
const SUN = { az: 40, el: 40, sky: '#d8ecf8', ground: '#c8b890', hemi: 1.05, sun: '#fff0d8', sunI: 3.2, skyTop: '#3f80d0', skyHor: '#e8f0f4', fog: '#e4ecf0', fogNear: 45, fogFar: 220,
  sat: 1.16, vig: 0.22, shadowExt: 14, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const FC = [1.5, -3.2];            // fountain centre (x, z), radius 2.6
const PZ = 1.4;                    // the gravel walk's centre line (Gérard walks along +x)
const STOPX = -1.0;                // where Gérard stops

function lobster() {
  const { THREE } = K; const g = K.group(); const red = K.toon({ color: '#e0442a', kind: 'grime', amt: 0.25 }), dark = K.toon({ color: '#b02a1a', plain: true });
  const body = K.group(g); body.position.y = 0.16;
  K.sphere(0.16, red, 0, 0, 0.08, body, 0.9, 0.75, 1.5);                                   // carapace
  const tail = []; let par = body; for (let i = 0; i < 4; i++) { const t = K.group(par); t.position.set(0, 0, i === 0 ? -0.14 : -0.1); K.sphere(0.12 - i * 0.018, red, 0, 0, -0.05, t, 1, 0.7, 0.9); tail.push(t); par = t; }
  const fan = K.group(par); fan.position.z = -0.08; for (const a of [-0.6, 0, 0.6]) { const m = K.sphere(0.06, dark, Math.sin(a) * 0.05, 0, -0.06, fan, 0.8, 0.25, 1.4); m.rotation.y = a; }
  const eyes = []; for (const s of [-1, 1]) { K.beam(new THREE.Vector3(s * 0.05, 0.08, 0.26), new THREE.Vector3(s * 0.08, 0.2, 0.3), 0.015, dark, body); const e = K.sphere(0.05, K.toon({ color: '#ffffff', plain: true }), s * 0.08, 0.22, 0.3, body); K.sphere(0.025, K.toon({ color: '#111', plain: true }), s * 0.085, 0.225, 0.345, body); eyes.push(e); }
  for (const s of [-1, 1]) K.beam(new THREE.Vector3(s * 0.04, 0.05, 0.3), new THREE.Vector3(s * 0.35, 0.35, 0.75), 0.008, dark, body);
  const claws = []; for (const s of [-1, 1]) { const arm = K.group(body); arm.position.set(s * 0.12, 0, 0.18);
    K.beam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * 0.12, 0.02, 0.18), 0.03, red, arm);
    const c = K.group(arm); c.position.set(s * 0.14, 0.03, 0.22); K.sphere(0.075, red, 0, 0, 0.04, c, 1, 0.7, 1.3);
    const top = K.group(c); top.position.z = 0.1; K.sphere(0.04, red, 0, 0.02, 0.08, top, 0.8, 0.5, 2.0); const bot = K.group(c); bot.position.z = 0.1; K.sphere(0.035, dark, 0, -0.02, 0.07, bot, 0.8, 0.5, 1.8);
    claws.push({ arm, top, bot }); }
  const legs = []; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const lg = K.group(body); lg.position.set(s * 0.1, -0.02, 0.1 - i * 0.08); K.beam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * 0.12, -0.14, 0), 0.012, dark, lg); legs.push([lg, s, i]); }
  g.scale.setScalar(1.5);
  return { g, body, tail, claws, legs, eyes,
    set(f, st) { g.position.set(st.x, 0, st.z); g.rotation.y = st.yaw || 0; const walk = st.mode === 'walk', sit = st.mode === 'sit';
      body.position.y = 0.16 + (walk ? 0.012 * Math.abs(Math.sin(f * 0.6)) : 0) - (sit ? 0.06 : 0);
      legs.forEach(([lg, s, i]) => { lg.rotation.z = walk ? 0.35 * Math.sin(f * 0.6 + i * 2 + (s > 0 ? Math.PI : 0)) : 0; lg.rotation.y = walk ? 0.25 * Math.cos(f * 0.6 + i * 2) : 0; });
      tail.forEach((t, i) => { t.rotation.x = sit ? 0.35 : 0.05 * Math.sin(f * 0.15 + i); });
      const sn = st.snap || 0; claws.forEach((c, i) => { c.arm.rotation.y = (i ? -1 : 1) * (0.1 * Math.sin(f * 0.1) - sn * 0.3); c.arm.rotation.x = -sn * 0.5 - (st.wave || 0) * (i ? 0.9 * Math.abs(Math.sin(f * 0.3)) : 0);
        const o = 0.15 + 0.5 * Math.max(sn, 0.5 + 0.5 * Math.sin(f * 0.25 + i)) * (sn > 0 ? 1 : 0.3); c.top.rotation.x = -o; c.bot.rotation.x = o * 0.7; });
      eyes.forEach((e, i) => { e.scale.setScalar(st.shock ? 1.35 : 1); });
    } };
}

function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K;
  K.slab(-80, 80, -0.3, 0, -80, 80, K.mat('grime', '#7aae4c', { amt: 0.5, detail: 2 }), K.scene, false);
  K.slab(-60, 60, -0.02, 0.02, PZ - 2.2, PZ + 2.2, K.mat('dirt', '#d8c8a0', { detail: 0.4, amt: 0.3 }), K.scene, false);    // gravel walk
  K.slab(FC[0] - 4, FC[0] + 4, -0.01, 0.025, FC[1] - 4, PZ, K.mat('dirt', '#d8c8a0', { detail: 0.4, amt: 0.3 }), K.scene, false);
  // fountain: stone basin, water, jet
  const stone = K.mat('rock', '#e0d8c8', { detail: 0.4, amt: 0.2 });
  const rim = K.add(new THREE.TorusGeometry(2.6, 0.22, 12, 48), stone, FC[0], 0.5, FC[1]); rim.rotation.x = Math.PI / 2;
  K.cyl(2.6, 2.6, 0.5, stone, FC[0], 0, FC[1]); K.cyl(2.45, 2.45, 0.06, K.toon({ color: '#5ab0d0', plain: true, roughness: 0.1, emissive: '#1a5a7a' }), FC[0], 0.47, FC[1]);
  K.cyl(0.35, 0.5, 1.4, stone, FC[0], 0.5, FC[1]); K.cyl(0.9, 0.7, 0.18, stone, FC[0], 1.9, FC[1]);
  JET = K.cyl(0.08, 0.16, 1.6, K.toon({ color: '#cfefff', plain: true, emissive: '#5a9ac0' }), FC[0], 2.05, FC[1]);
  const fsolid = K.group(); fsolid.position.set(FC[0], 0, FC[1]); K.slab(-2.4, 2.4, 0, 0.5, -2.4, 2.4, K.toon({ color: '#000', plain: true }), fsolid).visible = false; K.solid(fsolid, 0.3);
  // clipped lime trees in rows (box canopies), flower beds, benches, lamp posts
  const bark = K.mat('wood', '#5a3a24'), leaf = K.mat('grime', '#4a8a3a', { amt: 0.5, detail: 1.2 });
  for (let x = -40; x <= 40; x += 5) for (const z of [PZ - 6.5, PZ + 5.5]) { if (Math.abs(x - FC[0]) < 5 && z < 0) continue; K.cyl(0.14, 0.18, 2.6, bark, x, 0, z); K.slab(x - 1.6, x + 1.6, 2.6, 4.6, z - 1.3, z + 1.3, leaf); }
  for (let x = -36; x <= 36; x += 10) { K.slab(x - 1.6, x + 1.6, 0, 0.25, PZ + 2.6, PZ + 3.4, K.mat('dirt', '#6a4a30')); for (let i = 0; i < 8; i++) K.sphere(0.13, K.toon({ color: ['#e84a5f', '#f2c230', '#ffffff', '#c86ad8'][i % 4], plain: true }), x - 1.4 + i * 0.4, 0.35, PZ + 3.0); }
  const bench = (x, z, ry) => { const b = K.group(); b.position.set(x, 0, z); b.rotation.y = ry; K.slab(-1, 1, 0.42, 0.5, -0.25, 0.25, K.mat('wood', '#3a6a3a'), b); K.slab(-1, 1, 0.5, 1.0, 0.2, 0.26, K.mat('wood', '#3a6a3a'), b);
    for (const s of [-0.85, 0.85]) K.slab(s - 0.05, s + 0.05, 0, 0.45, -0.25, 0.25, K.mat('metal', '#2a2a2a'), b); K.solid(b); return b; };
  bench(-8, PZ + 2.7, 0); bench(6, PZ + 2.7, 0); bench(-14, PZ - 2.7, Math.PI);
  for (const x of [-12, -4, 4, 12]) { K.cyl(0.06, 0.08, 3.2, K.mat('metal', '#1a1a1a'), x, 0, PZ - 2.5); K.add(new THREE.BoxGeometry(0.35, 0.45, 0.35), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), x, 3.4, PZ - 2.5); }
  // arcades all around (facades with arches)
  const arc = PR.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, w, h); g.fillStyle = '#5a4a3a'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(16 + i * 128, h); g.lineTo(16 + i * 128, h * 0.62); g.arc(64 + i * 128, h * 0.62, 48, Math.PI, 0); g.lineTo(112 + i * 128, h); g.fill(); }
    g.fillStyle = '#7a8aa0'; for (let i = 0; i < 4; i++) for (const y of [0.12, 0.34]) g.fillRect(36 + i * 128, h * y, 56, h * 0.14); g.fillStyle = '#c8b898'; g.fillRect(0, h * 0.5, w, 8); }, [6, 1]);
  const fm = K.toon({ map: arc, kind: 'plaster', amt: 0.1 });
  K.add(new THREE.BoxGeometry(120, 14, 2), fm, 0, 7, -24); K.add(new THREE.BoxGeometry(120, 14, 2), fm, 0, 7, 26);
  K.add(new THREE.BoxGeometry(2, 14, 50), fm, -48, 7, 1); K.add(new THREE.BoxGeometry(2, 14, 50), fm, 48, 7, 1);
  K.slab(-60, 60, 14, 15, -25, -23, K.mat('metal', '#4a5a6a')); K.slab(-60, 60, 14, 15, 25, 27, K.mat('metal', '#4a5a6a'));
  for (let x = -40; x <= 40; x += 8) { K.slab(x - 0.03, x + 0.03, 15, 17, -24.03, -23.97, K.mat('metal', '#333')); K.slab(x, x + 1.2, 16.2, 17, -24.02, -23.98, K.toon({ color: ['#2a4aa0', '#ffffff', '#c0392b'][(x / 8 + 10) % 3], plain: true, side: THREE.DoubleSide })); }
  D.sign(2.2, 0.6, D.txtTex(512, 140, '#1a3a6a', '#f2e6c0', ['JARDIN'], 'bold 90px Georgia, serif'), 0, 3.4, -22.95, 0, K.scene);
  // creatures
  LOB = lobster();
  const rm = K.toon({ color: '#3a6ad8', plain: true, roughness: 0.3 });
  for (let i = 0; i < 10; i++) { const s = K.slab(-0.012, 0.012, 0, 1, -0.012, 0.012, rm, K.scene); s.castShadow = false; RIB.push(s); }
  POOD = K.animal('dog', { seed: 4, color: '#f4f0ec', scale: 0.75 });
  for (let i = 0; i < 4; i++) PIG.push(K.animal('pigeon', { seed: 10 + i, color: ['#8a8a9a', '#6a6a7a', '#a8a8b0', '#7a7a8a'][i] }));
  for (let i = 0; i < 18; i++) { const s = K.sphere(0.07, K.toon({ color: '#e8f8ff', plain: true, emissive: '#6ab0d0' }), 0, -10, 0); SPL.push(s); }
  GER = K.stick(GER_O, { key: 'ger' }); LADY = K.stick(LADY_O, { key: 'lady' }); KID = K.stick(KID_O, { key: 'kid' }); GENT = K.stick(GENT_O, { key: 'gent' }); COP = K.stick(COP_O, { key: 'cop' }); REP = K.stick(REP_O, { key: 'rep' }); WOM = K.stick(WOM_O, { key: 'wom' });
  K.addClouds(10, 700, 160);
}

// Gérard's stroll: x along the walk from -15 to STOPX
const STOP = () => L[4][0] - 6;
const gerX = (f) => lerp(-15, STOPX, clamp(f / STOP(), 0, 1));
function frame(f) {
  const fx = [];
  const SNAP = W(4, 'snaps'), SPLASH = W(5, 'fountain') - 4, SITS = W(7, 'sits'), BARK = W(12, 'poodle') - 6, ANS = L[10][0];
  const walking = f < STOP();
  const gx = gerX(f), gz = PZ - 0.35;
  // lobster: ahead of Gérard; lunges at the pigeons; sits and won't budge
  const lunge = f >= SNAP - 6 && f < SNAP + 24 ? Math.sin(Math.PI * (f - SNAP + 6) / 30) : 0;
  const lx = gx + 1.4 + lunge * 0.5, lz = PZ + 0.25;
  const sit = f >= SITS - 4;
  LOB.set(f, { x: lx, z: lz, yaw: Math.PI / 2 + (sit ? -0.9 : 0) + (f >= ANS && f < BARK ? -1.3 : 0), mode: walking || lunge > 0 ? 'walk' : sit ? 'sit' : 'stand', snap: f >= SNAP - 3 && f < SNAP + 20 ? 1 : 0,
    shock: (f >= SPLASH && f < SPLASH + 20) || (f >= BARK && f < BARK + 30), wave: f >= L[13][0] ? 1 : 0 });
  // Gérard
  const gerKeys = walking ? [[0, 'stroll', { expr: 'proud' }], [W(3, 'tips') - 3, 'salute', { expr: 'grin' }], [W(3, 'tips') + 16, 'stroll', { expr: 'proud' }]]
    : [[0, 'shock', { expr: 'shock' }], [SPLASH, 'facepalm', { expr: 'nervous', sweat: true }], [L[6][0] + 20, 'hips', { expr: 'stern' }], [W(6, 'lobster') - 2, 'shrug', { expr: 'confused' }],
      [SITS - 2, 'pointDown', { expr: 'nervous', sweat: true }], [W(7, 'refuses'), 'reach', { expr: 'pained', sweat: true }], [L[8][0], 'cross', { expr: 'nervous', sweat: true }], [L[9][0] - 2, 'think', { expr: 'neutral' }],
      [ANS - 3, 'pointUp', { expr: 'proud', talk: true }], [W(10, 'serious') - 3, 'hips', { expr: 'proud', talk: true }], [L[11][0], 'show', { expr: 'smile', talk: true }], [W(11, 'barks') - 3, 'cross', { expr: 'grin', talk: true }],
      [BARK, 'shock', { expr: 'shock' }], [L[12][0] + 50, 'laugh', { expr: 'laugh' }], [L[13][0], 'stroll', { expr: 'proud' }]];
  const gWalk2 = f >= L[13][0];
  D.act(K, GER, f, gerKeys, 3, { x: gWalk2 ? STOPX + (f - L[13][0]) * 0.03 : gx, z: gz, yaw: walking || gWalk2 ? Math.PI / 2 : Math.PI / 2 - 0.5 });
  if (walking && f % 15 === 0) K.puff(f, f, gx, gz, 3, 0.2, '#d8c8a0');
  // ribbon from Gérard's right hand to the lobster's neck (a sagging curve)
  GER.root.updateMatrixWorld(true); const hp = X.hands(GER)[1]?.getWorldPosition(new K.THREE.Vector3()) || new K.THREE.Vector3(gx, 1, gz);
  const lp = new K.THREE.Vector3(LOB.g.position.x - 0.15 * Math.sin(LOB.g.rotation.y), 0.35, LOB.g.position.z - 0.15 * Math.cos(LOB.g.rotation.y));
  const pts = []; for (let i = 0; i <= RIB.length; i++) { const t = i / RIB.length; const p = hp.clone().lerp(lp, t); p.y -= Math.sin(Math.PI * t) * 0.35; pts.push(p); }
  RIB.forEach((s, i) => { const a = pts[i], b = pts[i + 1]; s.position.copy(a); s.scale.y = a.distanceTo(b); s.lookAt(b); s.rotateX(Math.PI / 2); });
  // poodle on the bench beside the lady; barks at line 2 and at the end
  const barking = (f >= W(2, 'poodle') - 4 && f < W(2, 'poodle') + 30) || (f >= BARK && f < BARK + 40);
  POOD.set(f, { x: -8.3, z: PZ + 2.75, yaw: Math.PI, mode: barking ? 'stand' : 'sit', expr: barking ? 'angry' : f >= BARK + 40 ? 'shock' : 'happy', look: barking ? 0.4 : 0.2 * Math.sin(f / 30), nod: barking ? -0.15 * Math.abs(Math.sin(f * 0.8)) : 0 });
  POOD.root.position.y = 0.5;
  // pigeons pecking ahead, then flapping away
  PIG.forEach((p, i) => { const fl = f >= SNAP - 2 ? (f - SNAP + 2) / 30 : 0; const x0 = STOPX + 3.0 + (i % 2) * 0.6, z0 = PZ - 0.3 + i * 0.35;
    p.set(f, { x: x0 + fl * (1.5 + i), z: z0 - fl * (2 + i * 0.5), yaw: fl ? Math.PI * 0.75 : -Math.PI / 2 + i, mode: fl ? 'jump' : (f + i * 20) % 60 < 30 ? 'eat' : 'walk', flap: fl ? 1 : 0, expr: fl ? 'shock' : 'neutral' });
    p.root.position.y = fl ? Math.min(6, fl * fl * 3) : 0; p.root.visible = fl < 3; });
  // gentleman: watching at the fountain rim, jumps back INTO the fountain
  const gt = clamp((f - SPLASH) / 14, 0, 1);
  const gentPos = f < SPLASH ? { x: FC[0] - 0.4, z: FC[1] + 3.0, yaw: -0.3 } : { x: FC[0] - 0.4 + gt * 0.4, y: gt < 1 ? 0.9 * Math.sin(Math.PI * gt) + 0.2 * gt : 0.2, z: FC[1] + 3.0 - gt * 1.6, yaw: -0.3, seat: 0.3 };
  D.act(K, GENT, f, [[0, 'cross', { expr: 'stern' }], [W(2, 'gasp') - 2, 'shock', { expr: 'shock' }], [L[3][0], 'read', { item: 'paper', expr: 'stern' }], [SNAP - 2, 'scared', { expr: 'scared', sweat: true }], [SPLASH, 'fall', { expr: 'scared' }],
    [SPLASH + 14, 'sit', { expr: 'dazed' }], [L[7][0], 'sit', { expr: 'angry' }], [L[8][0], 'sit', { expr: 'confused' }], [ANS, 'sit', { expr: 'confused' }], [BARK + 6, 'sit', { expr: 'laugh' }]], 7, gentPos);
  if (f >= SPLASH + 10) { const t = (f - SPLASH - 10) / 30; SPL.forEach((s, i) => { const a = i / SPL.length * Math.PI * 2; s.visible = t < 1; s.position.set(FC[0] + Math.cos(a) * (0.3 + t * 1.2), 0.5 + 2.4 * t - 3.2 * t * t, FC[1] + 1.4 + Math.sin(a) * (0.3 + t)); }); }
  else SPL.forEach((s) => { s.visible = false; });
  // lady + kid on the bench; later in the crowd
  const crowd = f >= L[8][0] - 6;
  const cr = (i) => { const a = Math.PI * (0.2 + i * 0.3); return { x: lx + 0.2 + Math.cos(a) * 2.6, z: lz + Math.sin(a) * 2.4, yaw: Math.atan2(lx - (lx + Math.cos(a) * 2.6), lz - (lz + Math.sin(a) * 2.4)) }; };
  D.act(K, LADY, f, [[0, 'idle', { expr: 'smile' }], [W(2, 'gasp') - 3, 'shock', { expr: 'shock' }], [W(2, 'kids'), 'ears', { expr: 'confused' }], [SNAP, 'scared', { expr: 'scared' }], [SPLASH + 4, 'laugh', { expr: 'laugh' }],
    [L[8][0], 'pointL', { expr: 'excited' }], [ANS, 'think', { expr: 'confused' }], [BARK + 8, 'laugh', { expr: 'laugh' }]], 11, crowd ? cr(0) : { x: -7.6, z: PZ + 2.75, yaw: Math.PI, seat: 0.48 });
  D.act(K, KID, f, [[0, 'clap', { expr: 'laugh' }], [W(2, 'kids') - 3, 'laugh', { expr: 'laugh' }], [SNAP, 'shock', { expr: 'shock' }], [SPLASH + 4, 'celebrate', { expr: 'laugh' }], [L[8][0], 'jump', { expr: 'excited' }],
    [ANS, 'sit', { expr: 'neutral' }], [BARK + 6, 'laugh', { expr: 'laugh' }]], 12, crowd ? { ...cr(1), seat: 0.0 } : { x: -6.8, z: PZ + 2.2, yaw: Math.PI });
  // policeman marches over
  const cw = K.walkPath(f, L[6][0] - 14, [[8, PZ + 4.4], [4.0, PZ + 1.2], [STOPX + 3.0, PZ + 0.6]], 2.6, { endYaw: -Math.PI / 2 });
  if (f >= L[6][0] - 14) D.act(K, COP, f, cw.moving ? [[0, 'walk', { expr: 'stern' }]] : [[0, 'stop', { expr: 'stern', talk: true }], [W(6, 'lobster') - 3, 'pointDown', { expr: 'stern', talk: true }], [SITS, 'shock', { expr: 'confused' }],
    [W(7, 'refuses') + 6, 'facepalm', { expr: 'dazed' }], [L[8][0], 'write', { expr: 'stern' }], [ANS, 'think', { expr: 'confused' }], [W(11, 'secrets'), 'shrug', { expr: 'confused' }], [BARK + 4, 'shock', { expr: 'shock' }], [L[13][0], 'salute', { expr: 'smile' }]], 13,
    { x: cw.x, z: cw.z, yaw: cw.yaw }); else COP.root.visible = false;
  // reporter + a woman join the circle
  if (crowd) {
    D.act(K, REP, f, [[0, 'write', { expr: 'excited' }], [W(8, 'Some') - 2, 'show', { R: [0.42, -0.6, 'money'], expr: 'grin' }], [L[9][0], 'write', { expr: 'confused' }], [ANS, 'write', { expr: 'excited' }], [BARK + 4, 'shock', { expr: 'shock' }], [BARK + 30, 'laugh', { expr: 'laugh' }]], 14, cr(2));
    D.act(K, WOM, f, [[0, 'pointL', { expr: 'excited' }], [W(8, 'Some') + 4, 'show', { R: [0.42, -0.6, 'money'], expr: 'grin' }], [L[9][0], 'think', { expr: 'confused' }], [ANS, 'clap', { expr: 'smile' }], [BARK + 4, 'shock', { expr: 'shock' }], [BARK + 30, 'laugh', { expr: 'laugh' }]], 15, cr(3));
  } else { REP.root.visible = false; WOM.root.visible = false; }
  JET.scale.y = 1 + 0.06 * Math.sin(f * 0.7);
  // ---------- shots ----------
  const gP = (q) => [gerX(q), 0, gz], lobP = (q) => [gerX(q) + 1.4, 0, lz];
  const tr = (at, off, o = {}) => K.track(f, at, { off, lag: 3, ...o });
  const S = [
    [0, (u) => { const t = tr((q) => [gerX(q) + 0.7, 0, PZ], [2.4, 0.9, 4.2], { lookY: 0.9 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 8 }; }],
    [W(0, 'Paris') - 6, (u) => { const t = tr(lobP, [1.3, 0.35, 1.0], { lookY: 0.25 }); return { pos: t.pos, look: t.look, fov: 42, cinf: 16 }; }],
    [L[1][0] - 4, (u) => { const t = tr(gP, [2.8, 1.7, 2.6], { lookY: 1.7 }); return { pos: t.pos, look: t.look, fov: 40, cinf: 12 }; }, { whip: true }],
    [W(1, 'leash') - 4, (u) => { const p = gerX(f); return { pos: [p + 1.6, 0.8, PZ + 1.7], look: [p + 1.2, 0.45, PZ], fov: 42, cinf: 16 }; }],
    [L[2][0] - 4, (u) => ({ pos: [-7.6, 1.3, PZ + 0.3], look: [-7.8, 1.0, PZ + 2.8], fov: 44, cinf: 10 }), { whip: true }],
    [W(2, 'poodle') - 4, (u) => ({ pos: [-8.3, 1.0, PZ + 1.1], look: [-8.3, 0.85, PZ + 2.75], fov: 38 * K.punch(f, W(2, 'poodle'), 0.15, 6), cinf: 16, noPush: true })],
    [L[3][0] - 4, (u) => { const t = tr(gP, [1.6, 1.7, -2.4], { lookY: 1.75 }); return { pos: t.pos, look: t.look, fov: 38, cinf: 14 }; }, { whip: true }],
    [W(3, 'proud') - 4, (u) => ({ pos: [lerp(-6, -3, u), 4.0, -6], look: [gerX(f) + 0.6, 0.8, PZ], fov: 48, cinf: 5 })],
    [L[4][0] - 4, (u) => ({ pos: [STOPX + 1.6, 0.35, PZ + 1.6], look: [STOPX + 3.2, 0.3, PZ], fov: 44 * K.punch(f, SNAP, 0.15, 6), cinf: 12, noPush: true }), { whip: true }],
    [W(4, 'whole') - 4, (u) => ({ pos: [STOPX - 1.5, 2.6, PZ + 6.0], look: [STOPX + 1.5, 1.2, PZ - 1.5], fov: 50, cinf: 5 })],
    [L[5][0] - 4, (u) => { const sh = K.shake(f, SPLASH + 12, 0.06, 12); return { pos: [FC[0] - 1.6 + sh[0], 1.6 + sh[1], FC[1] + 6.4], look: [FC[0] - 0.3, 1.0, FC[1] + 2.0], fov: 44, cinf: 8 }; }, { whip: true }],
    [L[6][0] - 4, (u) => { const t = tr((q) => { const w = K.walkPath(q, L[6][0] - 14, [[8, PZ + 4.4], [4.0, PZ + 1.2], [STOPX + 3.0, PZ + 0.6]], 2.6); return [w.x, 0, w.z]; }, [1.8, 1.6, 3.0], { lookY: 1.5 }); return { pos: t.pos, look: t.look, fov: 42, cinf: 8 }; }, { whip: true }],
    [W(6, 'asks') - 4, (u) => ({ pos: [STOPX + 1.4, 1.75, PZ + 2.4], look: [STOPX + 3.0, 1.65, PZ + 0.6], fov: 38, cinf: 14 })],
    [W(6, 'lobster') - 4, (u) => ({ pos: [STOPX + 1.8, 1.8, PZ - 2.2], look: [STOPX, 1.6, gz], fov: 38, cinf: 14 })],
    [L[7][0] - 4, (u) => ({ pos: [lx + 0.9, 0.45, lz + 1.1], look: [lx, 0.25, lz], fov: 42 * K.punch(f, SITS, 0.12, 6), cinf: 16, noPush: true }), { whip: true }],
    [W(7, 'refuses') - 4, (u) => ({ pos: [STOPX - 0.6, 1.75, PZ + 1.8], look: [STOPX, 1.5, gz], fov: 38, cinf: 14 })],
    [L[8][0] - 4, (u) => ({ pos: [lx + 0.2 + 6 * Math.cos(lerp(0.3, 0.9, u)), lerp(4.5, 3.6, u), lz + 6 * Math.sin(lerp(0.3, 0.9, u))], look: [lx, 0.8, lz], fov: 46, cinf: 5 }), { whip: true }],
    [W(8, 'Some') - 4, (u) => { const c = cr(2); return { pos: [lx + (c.x - lx) * 0.3 + 0.3, 1.6, lz + (c.z - lz) * 0.3], look: [c.x, 1.6, c.z], fov: 40, cinf: 14 }; }],
    [L[9][0] - 4, (u) => ({ pos: [STOPX + 1.3, 1.7, gz + 1.8], look: [STOPX, 1.7, gz], fov: 36 * K.push(u, 0.12), cinf: 14, noPush: true }), { whip: true }],
    [ANS - 4, (u) => ({ pos: [STOPX + 2.2, 1.5, gz + 2.6], look: [STOPX + 0.4, 1.3, gz], fov: 40, cinf: 10 })],
    [W(10, 'serious') - 6, (u) => ({ pos: [lx - 1.2, 0.75, lz + 1.6], look: [lx, 0.35, lz], fov: 40, cinf: 14 })],
    [L[11][0] - 4, (u) => ({ pos: [STOPX + 0.6, 1.8, gz + 2.0], look: [STOPX, 1.75, gz], fov: 36, cinf: 14 }), { whip: true }],
    [W(11, 'barks') - 4, (u) => { const c = cr(0); return { pos: [lx + (c.x - lx) * 0.3 - 0.3, 1.6, lz + (c.z - lz) * 0.3], look: [c.x, 1.55, c.z], fov: 40, cinf: 14 }; }],
    [BARK - 4, (u) => ({ pos: [-8.3, 1.2, PZ + 1.0], look: [-8.3, 0.95, PZ + 2.75], fov: 38 * K.punch(f, BARK + 4, 0.2, 6), cinf: 16, noPush: true }), { whip: true }],
    [W(12, 'stares') - 6, (u) => ({ pos: [-8.3 + 0.5, 1.25, PZ + 4.6], look: [lerp(-5, -3, u), 1.4, PZ], fov: 46, cinf: 6 })],
    [L[13][0] - 4, (u) => ({ pos: [STOPX + lerp(6.5, 7.0, u), 1.0, PZ - 2.6], look: [STOPX + 1.4 + (f - L[13][0]) * 0.03, 0.8, PZ], fov: 46, cinf: 8 }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  return { light: SUN, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
