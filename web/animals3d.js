// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Real 3D cartoon animals (they look like the animal, not a stick man in a costume).
//   const dog = K.animal('dog', { color: '#c8874a' });           // build()
//   dog.set(f, { x, z, yaw, mode: 'walk', look: 0.3, expr: 'happy' });   // frame()
// types: beaver, mouse, dog, cat, pig, cow, horse, sheep, bear, fox, rabbit, monkey (baboon), chicken, duck, pigeon, elephant
// modes: stand, walk, run, sit, jump, eat (head down), beg (sit up), sleep, wag (stand + fast tail)
// expr: neutral, happy, shock, angry, sad, sleepy. Extras: nod (head tilt down, radians), lift (0..1 raises the right front foot). Faces +z at yaw 0. Units: metres.
import * as THREE from './lib/three.module.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
function ik2(S, Tg, a, b, pole) {
  const d0 = Tg.clone().sub(S), d = Math.min(Math.max(d0.length(), 0.01), a + b - 0.002), n = d0.normalize();
  const along = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(a * a - along * along, 0));
  const pp = pole.clone().sub(n.clone().multiplyScalar(pole.dot(n))).normalize();
  return [S.clone().addScaledVector(n, along).addScaledVector(pp, h), S.clone().addScaledVector(n, d)];
}

// size: body [length, height, width], legLen, head radius, snout [len, radius], neck [up, forward]
const SPEC = {
  dog:     { body: [0.62, 0.3, 0.28], leg: 0.26, head: 0.16, snout: [0.13, 0.065], neck: [0.16, 0.12], ears: 'floppy', tail: 'up', color: '#c8874a', belly: '#f2e2c8', nose: '#2a1a14' },
  cat:     { body: [0.48, 0.22, 0.2], leg: 0.19, head: 0.13, snout: [0.04, 0.05], neck: [0.12, 0.08], ears: 'pointy', tail: 'long', color: '#e08a3a', belly: '#f6e2c8', nose: '#d86a7a', stripes: '#b8642a', whiskers: true },
  pig:     { body: [0.7, 0.42, 0.42], leg: 0.2, head: 0.19, snout: [0.08, 0.085], neck: [0.06, 0.16], ears: 'flop', tail: 'curl', color: '#f2a7b0', nose: '#e57f8f', snoutDisc: true },
  cow:     { body: [0.95, 0.48, 0.45], leg: 0.38, head: 0.19, snout: [0.12, 0.11], neck: [0.12, 0.2], ears: 'side', tail: 'tuft', color: '#f4f1ea', spots: '#2a2622', nose: '#e8a3a8', horns: true, udder: true },
  horse:   { body: [1.0, 0.42, 0.36], leg: 0.56, head: 0.15, snout: [0.3, 0.09], neck: [0.34, 0.3], ears: 'pointy', tail: 'long', color: '#8a5a34', mane: '#3a2418', nose: '#5a3a24' },
  sheep:   { body: [0.65, 0.42, 0.42], leg: 0.22, head: 0.13, snout: [0.1, 0.07], neck: [0.1, 0.14], ears: 'side', tail: 'stub', color: '#f6f2e8', face: '#2a2622', fluffy: true, nose: '#1a1614' },
  bear:    { body: [0.95, 0.55, 0.55], leg: 0.3, head: 0.24, snout: [0.12, 0.09], neck: [0.12, 0.18], ears: 'round', tail: 'stub', color: '#7a4a2a', belly: '#a8784a', nose: '#1a1210' },
  fox:     { body: [0.55, 0.24, 0.22], leg: 0.22, head: 0.14, snout: [0.14, 0.05], neck: [0.13, 0.1], ears: 'pointy', tail: 'bushy', color: '#e0702a', belly: '#f6efe2', nose: '#1a1210' },
  rabbit:  { body: [0.32, 0.26, 0.24], leg: 0.14, head: 0.12, snout: [0.04, 0.05], neck: [0.12, 0.06], ears: 'long', tail: 'puff', color: '#b8a898', belly: '#f2ece2', nose: '#e88a9a', hop: true },
  monkey:  { body: [0.5, 0.38, 0.32], leg: 0.3, head: 0.15, snout: [0.12, 0.08], neck: [0.16, 0.1], ears: 'round', tail: 'curve', color: '#8a7a5a', nose: '#e88a8a', muzzleCol: '#f0a0a0', upright: 0.45, longArms: 1.3 },
  elephant:{ body: [1.3, 0.85, 0.75], leg: 0.5, head: 0.36, snout: [0.0, 0.1], neck: [0.2, 0.3], ears: 'elephant', tail: 'thin', color: '#9a9aa2', trunk: true, tusks: true },
  chicken: { bird: true, body: [0.28, 0.24, 0.22], leg: 0.18, head: 0.09, color: '#f6f2e8', beak: '#f2a830', comb: '#d8302a', feet: '#f2a830' },
  duck:    { bird: true, body: [0.34, 0.2, 0.22], leg: 0.1, head: 0.1, color: '#f2f0e6', beak: '#f2a830', feet: '#f2a830', flatBeak: true },
  beaver:  { body: [0.56, 0.36, 0.38], leg: 0.12, head: 0.17, snout: [0.06, 0.085], neck: [0.1, 0.1], ears: 'round', tail: 'paddle', color: '#8a5a34', belly: '#c89a6a', nose: '#2a1a14', teeth: true, whiskers: true },
  mouse:   { body: [0.24, 0.15, 0.14], leg: 0.07, head: 0.1, snout: [0.08, 0.045], neck: [0.08, 0.06], ears: 'mouse', tail: 'thin', color: '#a4a2b0', belly: '#f2ece6', nose: '#f08a9a', whiskers: true },
  pigeon:  { bird: true, body: [0.24, 0.16, 0.15], leg: 0.08, head: 0.07, color: '#8a90a0', beak: '#3a3a3a', feet: '#e88a8a', neckSheen: '#5a9a8a' },
};

export function animal(K, type, opts = {}) {
  const S = { ...SPEC[type] || SPEC.dog, ...opts }, sc = opts.scale ?? 1;
  const fur = K.toon({ color: S.color, kind: 'fabric', amt: 0.35, bump: 0.003, detail: 0.25 });
  const plain = (c, r = 0.6) => K.toon({ color: c, plain: true, roughness: r });
  const root = new THREE.Group(); (opts.parent || K.scene).add(root); root.scale.setScalar(sc);
  const body = new THREE.Group(); root.add(body);
  const [BL, BHt, BW] = S.body, legL = S.leg;
  const add = (geo, mat, x, y, z, parent = body) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
  const torso = add(new THREE.SphereGeometry(0.5, 40, 28), fur, 0, 0, 0); torso.scale.set(BW, BHt, BL);
  if (S.belly) { const b = add(new THREE.SphereGeometry(0.5, 32, 20), plain(S.belly, 0.8), 0, -BHt * 0.12, 0.02); b.scale.set(BW * 0.82, BHt * 0.8, BL * 0.86); }
  if (S.fluffy) for (let i = 0; i < 22; i++) { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 22); const p = add(new THREE.SphereGeometry(0.11, 14, 10), fur, Math.cos(a) * BW * 0.42 * r, BHt * 0.28 * Math.sin(a * 1.3), (r - 0.5) * BL * 0.9); p.scale.setScalar(0.9 + 0.3 * ((i * 7) % 3) / 3); }
  if (S.spots) for (let i = 0; i < 6; i++) { const sp = add(new THREE.SphereGeometry(0.5, 16, 12), plain(S.spots, 0.8), (i % 2 ? 1 : -1) * BW * 0.42, BHt * (0.1 - (i % 3) * 0.12), (i / 5 - 0.5) * BL * 0.7); sp.scale.set(0.05, BHt * 0.42, BL * 0.22); }
  if (S.stripes) for (let i = 0; i < 4; i++) { const st = add(new THREE.TorusGeometry(0.5, 0.012, 6, 30, Math.PI), plain(S.stripes, 0.8), 0, 0, (i / 3 - 0.5) * BL * 0.5); st.scale.set(BW * 1.0, BHt * 1.02, 1); }
  if (S.udder) { const u = add(new THREE.SphereGeometry(0.09, 16, 12), plain('#f2a8b0'), 0, -BHt * 0.45, -BL * 0.25); u.scale.y = 0.7; }
  const bodyY = legL + BHt * 0.42;
  // neck + head
  const neck = new THREE.Group(); neck.position.set(0, BHt * 0.25, BL * 0.42); body.add(neck);
  const [nUp, nFw] = S.neck || [0.1, 0.1];
  if (!S.bird) { const nk = add(new THREE.CylinderGeometry(S.head * 0.55, BW * 0.38, Math.hypot(nUp, nFw) + 0.05, 20), fur, 0, nUp / 2, nFw / 2, neck); nk.rotation.x = Math.atan2(nFw, nUp); }
  const head = new THREE.Group(); head.position.set(0, nUp, nFw); neck.add(head);
  const hr = S.head, skull = add(new THREE.SphereGeometry(hr, 36, 26), S.face ? plain(S.face, 0.7) : fur, 0, 0, 0, head);
  if (type === 'horse') skull.scale.set(0.9, 1, 1.1);
  // snout / muzzle / beak
  if (S.bird) {
    const bk = add(new THREE.ConeGeometry(hr * (S.flatBeak ? 0.5 : 0.32), hr * (S.flatBeak ? 1.0 : 0.8), 12), plain(S.beak, 0.4), 0, -hr * 0.1, hr * 1.2, head); bk.rotation.x = Math.PI / 2; if (S.flatBeak) bk.scale.set(1.3, 1, 0.45);
    if (S.comb) for (let i = 0; i < 3; i++) add(new THREE.SphereGeometry(hr * 0.28, 10, 8), plain(S.comb), 0, hr * (0.95 + (i === 1 ? 0.12 : 0)), hr * (0.3 - i * 0.3), head);
    if (S.comb) add(new THREE.SphereGeometry(hr * 0.2, 10, 8), plain(S.comb), 0, -hr * 0.55, hr * 0.85, head);
  } else if (S.trunk) {
    const tr = new THREE.Group(); tr.position.set(0, -hr * 0.2, hr * 0.85); head.add(tr); let parent = tr;
    for (let i = 0; i < 6; i++) { const seg = new THREE.Group(); seg.position.set(0, i ? -0.1 : 0, 0); parent.add(seg); add(new THREE.SphereGeometry(0.075 - i * 0.008, 14, 10), fur, 0, -0.05, 0, seg); seg.rotation.x = 0.18; seg.userData.trunk = i; parent = seg; }
    if (S.tusks) for (const sx of [-1, 1]) { const t = add(new THREE.ConeGeometry(0.025, 0.25, 10), plain('#f6f0dc', 0.3), sx * 0.12, -hr * 0.45, hr * 0.7, head); t.rotation.x = 2.2; }
  } else {
    const [sl, sr] = S.snout;
    const muz = add(new THREE.SphereGeometry(sr, 24, 16), plain(S.muzzleCol || (S.belly && type !== 'bear' ? S.belly : S.color), 0.7), 0, -hr * 0.25, hr * 0.78 + sl * 0.5, head); muz.scale.set(1.15, 0.85, 1 + sl / sr * 0.9);
    if (S.snoutDisc) { const d = add(new THREE.CylinderGeometry(sr * 0.9, sr * 0.9, 0.04, 24), plain(S.nose), 0, -hr * 0.2, hr * 0.85 + sl + sr * 0.6, head); d.rotation.x = Math.PI / 2; for (const sx of [-1, 1]) add(new THREE.SphereGeometry(sr * 0.18, 8, 6), plain('#8a3a4a'), sx * sr * 0.35, -hr * 0.2, hr * 0.85 + sl + sr * 0.62 + 0.02, head); }
    else add(new THREE.SphereGeometry(sr * 0.42, 14, 10), plain(S.nose || '#1a1210', 0.3), 0, -hr * 0.12, hr * 0.78 + sl + sr * 0.75, head);
    if (S.whiskers) for (const sx of [-1, 1]) for (const dy of [-0.01, 0.015]) { const w = add(new THREE.CylinderGeometry(0.002, 0.002, 0.14, 4), plain('#f6f2ea'), sx * 0.08, -hr * 0.28 + dy, hr * 0.95, head); w.rotation.z = Math.PI / 2 + sx * 0.15; }
    if (S.teeth) for (const sx of [-1, 1]) add(new THREE.BoxGeometry(sr * 0.42, sr * 0.7, sr * 0.14), plain('#fbf6ea', 0.3), sx * sr * 0.23, -hr * 0.25 - sr * 0.75, hr * 0.78 + sl * 0.5 + sr * 0.95, head);
    if (S.horns) for (const sx of [-1, 1]) { const h = add(new THREE.ConeGeometry(0.03, 0.14, 10), plain('#f2e8cc', 0.4), sx * hr * 0.6, hr * 0.85, -hr * 0.1, head); h.rotation.z = -sx * 0.7; }
    if (S.mane) for (let i = 0; i < 7; i++) { const m = add(new THREE.BoxGeometry(0.04, 0.12, 0.1), plain(S.mane, 0.8), 0, nUp * (1 - i / 7) + 0.04, nFw * (1 - i / 7) - 0.03, neck); m.rotation.x = 0.4; }
  }
  // ears
  const earMat = S.face ? plain(S.face, 0.7) : fur, inner = plain('#f0b0b8', 0.8);
  for (const sx of [-1, 1]) {
    let e;
    if (S.ears === 'pointy') { e = add(new THREE.ConeGeometry(hr * 0.32, hr * 0.7, 4), earMat, sx * hr * 0.55, hr * 0.85, -hr * 0.05, head); e.rotation.z = -sx * 0.25; e.scale.z = 0.5; }
    else if (S.ears === 'long') { e = add(new THREE.CapsuleGeometry(hr * 0.2, hr * 1.4, 4, 12), earMat, sx * hr * 0.35, hr * 1.5, -hr * 0.1, head); e.rotation.z = -sx * 0.15; e.scale.z = 0.45; }
    else if (S.ears === 'mouse') { e = add(new THREE.SphereGeometry(hr * 0.55, 18, 12), earMat, sx * hr * 0.8, hr * 0.85, -hr * 0.1, head); e.scale.z = 0.3; const inr = add(new THREE.SphereGeometry(hr * 0.4, 16, 10), plain('#f2a0b0'), 0, 0, hr * 0.06, e); inr.scale.z = 0.4; }
    else if (S.ears === 'round') { e = add(new THREE.SphereGeometry(hr * 0.3, 16, 12), earMat, sx * hr * 0.75, hr * 0.7, -hr * 0.05, head); e.scale.z = 0.5; }
    else if (S.ears === 'floppy' || S.ears === 'flop') { e = add(new THREE.CapsuleGeometry(hr * 0.22, hr * 0.6, 4, 12), S.ears === 'flop' ? fur : plain(shade(S.color, 0.75)), sx * hr * 0.85, hr * 0.15, -hr * 0.05, head); e.rotation.z = sx * 0.35; e.scale.z = 0.45; }
    else if (S.ears === 'side') { e = add(new THREE.SphereGeometry(hr * 0.3, 14, 10), earMat, sx * hr * 1.05, hr * 0.35, -hr * 0.1, head); e.scale.set(1.4, 0.55, 0.4); }
    else if (S.ears === 'elephant') { e = add(new THREE.SphereGeometry(hr * 0.9, 24, 16), fur, sx * hr * 0.95, hr * 0.05, -hr * 0.25, head); e.scale.set(0.12, 1.1, 0.95); }
    if (e) e.userData.ear = sx;
  }
  // eyes: white + pupil + eyelid (blink/expressions)
  const eyes = [];
  for (const sx of [-1, 1]) {
    const eg = new THREE.Group(); eg.position.set(sx * hr * (S.bird ? 0.6 : 0.42), hr * 0.22, hr * (S.bird ? 0.55 : 0.78)); head.add(eg);
    const white = add(new THREE.SphereGeometry(hr * 0.27, 20, 14), plain('#ffffff', 0.25), 0, 0, 0, eg);
    const pupil = add(new THREE.SphereGeometry(hr * 0.15, 16, 12), plain('#111111', 0.15), 0, 0, hr * 0.17, eg);
    const shine = add(new THREE.SphereGeometry(hr * 0.045, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), hr * 0.05, hr * 0.06, hr * 0.3, eg);
    const lid = add(new THREE.SphereGeometry(hr * 0.29, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), earMat, 0, 0, 0, eg); lid.rotation.x = -Math.PI / 2 - 0.2;
    const brow = add(new THREE.BoxGeometry(hr * 0.42, hr * 0.07, hr * 0.06), plain(shade(S.face || S.color, 0.45)), 0, hr * 0.33, hr * 0.12, eg);
    eyes.push({ eg, white, pupil, shine, lid, brow, sx });
  }
  // legs (front L/R, back L/R), monkeys get long front arms
  const legMat = S.face ? plain(S.face, 0.7) : fur, footMat = plain(S.feet || shade(S.face || S.color, 0.6), 0.5);
  const unit = new THREE.CylinderGeometry(1, 1, 1, 12, 1, true), seg = (r, mat = legMat) => { const m = new THREE.Mesh(unit, mat); m.userData.r = r; root.add(m); return m; };
  const ball = (r, mat = legMat) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat); root.add(m); return m; };
  const place = (m, a, b) => { const d = b.clone().sub(a), L = d.length(); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); m.scale.set(m.userData.r, L, m.userData.r); };
  const legR = S.bird ? 0.01 : Math.max(0.03, BW * 0.17), legs = [];
  const nLegs = S.bird ? [[-1, 0], [1, 0]] : [[-1, 1], [1, 1], [-1, -1], [1, -1]];
  for (const [sx, fz] of nLegs) {
    const front = fz > 0, L = legL * (front && S.longArms ? S.longArms : 1);
    legs.push({ sx, fz, L, up: seg(front && !S.bird ? legR : legR), lo: seg(legR * 0.85), joint: ball(legR), foot: ball(S.bird ? 0.02 : legR * 1.35, footMat) });
  }
  // tail
  const tail = new THREE.Group(); tail.position.set(0, BHt * 0.15, -BL * 0.48); body.add(tail);
  const tm = S.tail === 'bushy' ? fur : fur;
  if (S.bird) { const tf = add(new THREE.ConeGeometry(BW * 0.35, BL * 0.45, 4), fur, 0, BHt * 0.1, -BL * 0.12, tail); tf.rotation.x = -2.0; tf.scale.z = 0.35; }
  else if (S.tail === 'paddle') { const t = add(new THREE.SphereGeometry(0.5, 20, 12), plain('#4a3a32', 0.5), 0, -BHt * 0.3, -BL * 0.42, tail); t.scale.set(BW * 0.55, 0.05, BL * 0.75); for (let i = 0; i < 4; i++) { const x = add(new THREE.BoxGeometry(BW * 0.5, 0.012, 0.01), plain('#2a201a', 0.6), 0, -BHt * 0.3 + 0.025, -BL * (0.2 + i * 0.16), tail); x.rotation.y = 0.5; } }
  else if (S.tail === 'curl') { const t = add(new THREE.TorusGeometry(0.035, 0.01, 8, 20, Math.PI * 1.6), tm, 0, 0.02, -0.02, tail); t.rotation.y = Math.PI / 2; }
  else if (S.tail === 'puff' || S.tail === 'stub') add(new THREE.SphereGeometry(S.tail === 'puff' ? 0.06 : 0.05, 14, 10), S.tail === 'puff' ? plain('#ffffff', 0.9) : tm, 0, 0, -0.02, tail);
  else { const n = 6, len = S.tail === 'long' ? BL * 0.8 : S.tail === 'thin' || S.tail === 'tuft' ? BL * 0.55 : BL * 0.5; let par = tail;
    for (let i = 0; i < n; i++) { const g = new THREE.Group(); g.position.z = i ? -len / n : 0; par.add(g);
      const r = S.tail === 'bushy' ? 0.035 + 0.04 * Math.sin(Math.PI * (i + 1) / (n + 1)) : 0.018 * (1 - i / n * 0.5) + 0.005;
      add(new THREE.SphereGeometry(r, 10, 8), S.tail === 'bushy' && i === n - 1 ? plain('#f6f2ea', 0.9) : tm, 0, 0, -len / n / 2, g).scale.z = (len / n) / (r * 1.6);
      g.userData.i = i; par = g; }
    if (S.tail === 'tuft') add(new THREE.SphereGeometry(0.04, 10, 8), plain(S.spots || shade(S.color, 0.4)), 0, 0, -len / n, par);
  }
  // wings for birds
  const wings = [];
  if (S.bird) for (const sx of [-1, 1]) { const w = new THREE.Group(); w.position.set(sx * BW * 0.45, BHt * 0.1, 0); body.add(w); const wm = add(new THREE.SphereGeometry(0.5, 20, 12), S.neckSheen ? plain(shade(S.color, 0.85)) : fur, sx * 0.02, 0, -0.02, w); wm.scale.set(0.05, BHt * 0.7, BL * 0.75); wings.push(w); }
  root.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (m.material.emissive && !m.material.userData.lit) { m.material.emissive.copy(m.material.color).multiplyScalar(0.18); m.material.userData.lit = true; } } });

  const api = {
    root, head, body, type,
    set(f, st = {}) {
      const mode = st.mode || 'stand', sec = f / 30, spd = st.speed ?? 1;
      const gaitHz = mode === 'run' ? 2.6 : mode === 'walk' ? 1.4 : 0, ph = sec * gaitHz * Math.PI * 2 * spd;
      root.visible = st.visible !== false;
      root.position.set(st.x || 0, st.y || 0, st.z || 0); root.rotation.set(0, st.yaw || 0, 0);
      let by = bodyY, pitch = -(S.upright || 0), roll = 0;
      // walk: 4-beat gait (each foot in turn) with the body dipping twice per cycle, rocking side to side over the
      // planted feet and pitching gently — weight you can feel (YouTube feedback 2026-11-18: walks felt stiff)
      if (mode === 'walk') { by += (S.bird ? 0.012 : 0.022) * (0.5 + 0.5 * Math.cos(ph * 2)); roll = (S.bird ? 0.06 : 0.035) * Math.sin(ph); pitch += 0.02 * Math.sin(ph * 2 + 0.6); }
      if (mode === 'run') { by += 0.05 * Math.abs(Math.sin(ph)); pitch += 0.12 * Math.sin(ph); }
      if (S.hop && (mode === 'walk' || mode === 'run' || mode === 'jump')) by += (mode === 'run' ? 0.2 : 0.1) * Math.max(0, Math.sin(ph * 0.5 + 0.0));
      if (mode === 'jump') by += 0.35 * Math.max(0, Math.sin(Math.PI * ((sec * 1.5) % 1)));
      if (mode === 'sit' || mode === 'beg') { pitch = -0.55 - (mode === 'beg' ? 0.5 : 0); by = bodyY * 0.8; }
      if (mode === 'sleep') { by = BHt * 0.42; roll = 0.0; }
      by += 0.006 * Math.sin(sec * 2.4); // breathing
      body.position.set(0, by, 0); body.rotation.set(pitch, mode === 'walk' ? 0.03 * Math.sin(ph + 1) : 0, roll);
      // head: look, nod while walking, down to eat
      const look = st.look || 0;
      neck.rotation.set((mode === 'eat' ? 0.9 : mode === 'sleep' ? 0.5 : 0) + (st.nod || 0) + (mode === 'walk' ? (S.bird ? 0.1 : 0.07) * Math.sin(ph * 2 - 0.9) : 0) - pitch * 0.8 + 0.03 * Math.sin(sec * 1.3), look * 0.7 + (mode === 'walk' ? 0.05 * Math.sin(ph - 0.5) : 0), -roll * 0.6);
      for (const c of head.children) if (c.userData.ear) c.rotation.x = 0.15 * Math.sin(sec * 3 + c.userData.ear) * (mode === 'run' ? 2 : 0.4) + (mode === 'walk' ? 0.12 * Math.sin(ph * 2 - 1.6) : 0);
      // trunk: swings with the steps, each segment a little later than the one before (follow-through)
      head.traverse((g) => { if (g.userData.trunk !== undefined) { const i = g.userData.trunk; g.rotation.z = (mode === 'walk' || mode === 'run' ? 0.09 : 0.04) * Math.sin((mode === 'walk' || mode === 'run' ? ph : sec * 1.6) - i * 0.55); g.rotation.x = 0.18 + 0.03 * Math.sin(sec * 1.1 - i * 0.4); } });
      // eyes & expressions
      const ex = st.expr || 'neutral', blink = (Math.sin(sec * 1.7 + (opts.seed || 0)) > 0.985) || mode === 'sleep' || ex === 'sleepy';
      for (const e of eyes) {
        const big = ex === 'shock' ? 1.35 : 1; e.white.scale.setScalar(big); e.pupil.scale.setScalar(ex === 'shock' ? 0.8 : 1);
        e.pupil.position.set(look * hr * 0.08, 0, hr * 0.17 * big); e.shine.position.set(hr * 0.05 + look * hr * 0.08, hr * 0.06, hr * 0.3 * big);
        const lidOpen = blink ? 1 : ex === 'happy' ? 0.55 : ex === 'angry' ? 0.45 : ex === 'sad' ? 0.35 : ex === 'sleepy' ? 0.85 : 0.08;
        e.lid.rotation.x = -Math.PI / 2 - 0.2 + (1 - lidOpen) * -1.3; e.lid.visible = lidOpen > 0.1;
        e.brow.rotation.z = e.sx * (ex === 'angry' ? -0.45 : ex === 'sad' ? 0.45 : ex === 'shock' ? 0.15 : 0); e.brow.position.y = hr * (ex === 'shock' ? 0.45 : 0.33);
      }
      // tail wag
      const wag = mode === 'wag' || st.wag ? 0.7 * Math.sin(sec * 18) : 0.25 * Math.sin(sec * 3) + (mode === 'run' ? 0.2 * Math.sin(ph) : mode === 'walk' ? 0.25 * Math.sin(ph - 1.2) : 0);
      tail.rotation.y = wag;
      // tail base angle (+ = up) and curl per segment: dogs up, cats/monkeys curve up, horses/cows/elephants hang down
      const TB = { up: 0.55, curve: 0.2, long: type === 'cat' ? 0.35 : -0.55, tuft: -0.9, thin: -0.8, bushy: -0.15 }[S.tail] ?? 0;
      const TC = { up: 0.12, curve: 0.3, long: type === 'cat' ? 0.22 : -0.08, tuft: -0.05, thin: -0.05, bushy: 0.05 }[S.tail] ?? 0;
      tail.rotation.x = TB + (mode === 'wag' ? 0.25 : 0);
      tail.traverse((g) => { if (g.userData.i !== undefined) g.rotation.x = TC + 0.05 * Math.sin(sec * 4 - g.userData.i); });
      for (const [i, w] of wings.entries()) w.rotation.z = (i ? -1 : 1) * (mode === 'run' || mode === 'jump' || st.flap ? 0.9 * Math.abs(Math.sin(sec * 14)) : 0.05 * Math.sin(sec * 2));
      // legs: trot (diagonal pairs) for walk, gallop-ish for run, folded for sit/sleep
      body.updateMatrixWorld(true);
      for (const lg of legs) {
        const front = lg.fz > 0, hipL = V(lg.sx * BW * 0.32, -BHt * 0.15, lg.fz * BL * 0.32);
        const hipW = body.localToWorld(hipL.clone()); root.worldToLocal(hipW);
        const off = S.bird ? (lg.sx > 0 ? 0 : Math.PI) : mode === 'run' ? (front ? 0 : Math.PI * 0.9) + (lg.sx > 0 ? 0.6 : 0)
          : mode === 'walk' ? (front ? Math.PI / 2 : 0) + (lg.sx > 0 ? Math.PI : 0)   // 4-beat walk: LH, LF, RH, RF
          : ((lg.sx > 0) === front ? 0 : Math.PI);
        let F;
        if (mode === 'walk' && !S.upright) {
          // each foot stays planted ~70% of the cycle and slides back with the body, then lifts, swings forward and sets down
          const u = (((ph + off) / (Math.PI * 2)) % 1 + 1) % 1, st2 = 0.13 * (lg.L / 0.4), STN = 0.7;
          let z, y = 0.02;
          if (u < STN) z = st2 * (1 - 2 * u / STN);
          else { const w = (u - STN) / (1 - STN), e = w * w * (3 - 2 * w); z = -st2 + 2 * st2 * e; y += Math.sin(Math.PI * w) * 0.09 * (lg.L / 0.4); }
          F = V(lg.sx * BW * 0.3, y, hipW.z + z);
        } else if (mode === 'walk' || mode === 'run') { const st2 = mode === 'run' ? 0.22 : 0.12, c = Math.sin(ph + off);
          F = V(lg.sx * BW * 0.3, 0.02 + Math.max(0, Math.cos(ph + off)) * (mode === 'run' ? 0.14 : 0.07) * (lg.L / 0.4), hipW.z + st2 * c * (lg.L / 0.4)); }
        else if (mode === 'sit' || mode === 'beg') F = front ? V(lg.sx * BW * 0.25, mode === 'beg' ? hipW.y * 0.7 : 0.02, hipW.z + 0.05) : V(lg.sx * BW * 0.4, 0.02, hipW.z + 0.15);
        else if (mode === 'sleep') F = V(lg.sx * BW * 0.45, 0.03, hipW.z + (front ? 0.2 : -0.1));
        else if (mode === 'jump') F = V(lg.sx * BW * 0.3, hipW.y - lg.L * 0.6, hipW.z + (front ? 0.12 : -0.12));
        else F = V(lg.sx * BW * 0.3, 0.02, hipW.z + (front && S.upright ? 0.12 : 0));
        if (st.lift && front && lg.sx > 0 && mode !== 'walk' && mode !== 'run') { F.y += st.lift * lg.L * 0.6; F.z += st.lift * lg.L * 0.3; } // lift the right front paw/foot
        const a = lg.L * 0.52, b = lg.L * 0.5;
        const [J, Ft] = ik2(hipW, F, a, b, front ? V(0, 0, -1) : V(0, 0.2, 1));
        place(lg.up, hipW, J); place(lg.lo, J, Ft); lg.joint.position.copy(J); lg.foot.position.copy(Ft);
        if (!S.bird) lg.foot.scale.set(1, 0.6, 1.3);
      }
      return api;
    },
  };
  return api;
}
function shade(hex, k) { const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString(); }
