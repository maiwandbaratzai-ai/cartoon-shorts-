// Reusable props + 2D creature/effect drawings for stories. Everything takes the kit context K from core.js.
import * as THREE from './lib/three.module.js';
import { INK } from './toon.js';

/** canvas texture helper: draw(g, w, h) */
export const canvasTex = (w, h, draw, repeat = [1, 1]) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); return t;
};
/** sand / dirt ground texture with speckles */
export const speckTex = (base, specks, seed = 3, n = 2600, rep = 40) => canvasTex(512, 512, (g) => {
  let s = seed; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { g.fillStyle = specks[(r() * specks.length) | 0]; g.beginPath(); g.ellipse(r() * 512, r() * 512, 1 + r() * 2.5, 1 + r() * 2, r() * 3, 0, 7); g.fill(); }
}, [rep, rep]);

/** ground with gentle bumps: h(x,z) height function */
export const terrain = (K, size, seg, h, mat, parent = K.scene) => {
  const g = new THREE.PlaneGeometry(size, size, seg, seg); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, h(p.getX(i), p.getZ(i)));
  g.computeVertexNormals(); const m = K.add(g, mat, 0, 0, 0, parent, { cast: false }); m.frustumCulled = false; return m;
};

/** stylised sea: flat plane with moving foam bands near the shore line z = shoreZ (sea toward -z) */
export const ocean = (K, { y = 0, deep = '#1f6f93', shal = '#4fb2c8', foam = '#f4fbff', shoreZ = 0, size = 3000 } = {}) => {
  const U = { t: { value: 0 }, deep: { value: new THREE.Color(deep) }, shal: { value: new THREE.Color(shal) }, foam: { value: new THREE.Color(foam) }, shore: { value: shoreZ } };
  const mat = new THREE.ShaderMaterial({ uniforms: { ...THREE.UniformsLib.fog, ...U }, fog: true,
    vertexShader: `varying vec3 vW; #include <fog_pars_vertex>
      void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition; #include <fog_vertex> }`.replace(/#include <(\w+)>/g, '\n#include <$1>\n'),
    fragmentShader: `uniform float t, shore; uniform vec3 deep, shal, foam; varying vec3 vW; #include <fog_pars_fragment>
      float n2(vec2 p){ return sin(p.x*.21+sin(p.y*.17+t*.6)*1.7)*sin(p.y*.23+t*.4+sin(p.x*.13)*1.3); }
      void main(){ float d = shore - vW.z; vec3 c = mix(shal, deep, smoothstep(4., 90., d));
        float sw = fract(d*.045 + t*.22 + n2(vW.xz*.6)*.08); float band = smoothstep(.0,.04,sw)*smoothstep(.12,.06,sw)*(1.-smoothstep(10.,60.,d));
        float sp = step(.82, n2(vW.xz*1.7 + vec2(t*.3,0.)))*.35*smoothstep(30.,8.,d);
        float edge = smoothstep(2.2, .2, d);
        c = mix(c, foam, clamp(band*.9 + sp + edge, 0., 1.)); gl_FragColor = vec4(c,1.);
        #include <fog_fragment> }`.replace(/#include <(\w+)>/g, '\n#include <$1>\n'),
  });
  const g = new THREE.PlaneGeometry(size, size, 1, 1); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, mat); m.position.set(0, y, shoreZ - size / 2 + 6); m.userData.nd = K.flatNd; m.frustumCulled = false; K.scene.add(m);
  return { mesh: m, U };
};

/** wooden crate with a stencil label */
export const crate = (K, label = 'DYNAMITE', col = '#b8322f', parent = K.scene, s = [0.9, 0.55, 0.6]) => {
  const t = canvasTex(256, 160, (g, w, h) => {
    g.fillStyle = col; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3;
    for (let y = 40; y < h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.fillStyle = '#fff6dc'; g.font = 'bold 40px Poppins, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, w / 2, h / 2 + 2);
    g.strokeStyle = '#3b1f14'; g.lineWidth = 10; g.strokeRect(0, 0, w, h);
  });
  const m = K.add(new THREE.BoxGeometry(...s), K.toon({ map: t }), 0, 0, 0, parent); m.geometry.translate(0, s[1] / 2, 0); return m;
};

/** 1970-ish sedan, ~5.4 m long, along +x. returns { root, body, cabin } (squash cabin.scale.y to crush) */
export const sedan = (K, color = '#5a8fc2', parent = K.scene) => {
  const root = K.group(parent), body = K.group(root), c = K.col(color), dark = K.col('#2b2e36'), chrome = K.col('#d7dbe2'), glass = K.col('#9fd0e8');
  K.slab(-2.7, 2.7, 0.35, 1.0, -0.95, 0.95, c, body); K.slab(2.55, 2.75, 0.4, 0.7, -0.9, 0.9, chrome, body); K.slab(-2.75, -2.55, 0.4, 0.7, -0.9, 0.9, chrome, body);
  const cabin = K.group(body); cabin.position.y = 1.0;
  K.slab(-1.3, 1.0, 0, 0.62, -0.85, 0.85, c, cabin); K.slab(-1.25, 0.95, 0.06, 0.56, -0.87, 0.87, glass, cabin); K.slab(-1.35, 1.05, 0.56, 0.66, -0.86, 0.86, c, cabin);
  for (const x of [-1.8, 1.8]) for (const z of [-0.9, 0.9]) { const w = K.add(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20), dark, x, 0.38, z, root); w.rotation.x = Math.PI / 2; }
  for (const z of [-0.6, 0.6]) K.add(new THREE.SphereGeometry(0.13, 12, 8), K.col('#fff6c8'), 2.72, 0.75, z, body);
  return { root, body, cabin };
};

// ---------------- 2D drawings for cards (600 x 1000 design canvas, feet at y ~ 975) ----------------
/** seagull in flight, flap 0..1 */
export const gull = (p, flap = 0, glide = false) => {
  const up = glide ? 0.2 : Math.sin(flap * Math.PI * 2), cx = 300, cy = 500;
  const wing = (s) => p.poly([[cx + s * 20, cy - 6], [cx + s * 120, cy - 40 - 70 * up], [cx + s * 210, cy - 10 - 110 * up], [cx + s * 120, cy + 12 - 30 * up], [cx + s * 30, cy + 14]], '#e9edf2', 9);
  wing(-1); p.ell(cx, cy + 8, 70, 30, '#ffffff', 9); p.ell(cx + 64, cy - 6, 26, 22, '#ffffff', 9);
  p.poly([[cx + 86, cy - 6], [cx + 124, cy + 2], [cx + 86, cy + 6]], '#f2c230', 6); p.dot(cx + 70, cy - 12, 4); wing(1);
  p.poly([[cx - 62, cy], [cx - 104, cy - 12], [cx - 100, cy + 20]], '#ffffff', 8);
};
/** wavy stink lines rising, t 0..1 loops */
export const stink = (p, t, col = '#8fbf3a') => {
  for (let i = 0; i < 3; i++) {
    const x0 = 180 + i * 120, pts = []; const ph = (t + i * 0.33) % 1;
    for (let k = 0; k <= 16; k++) { const y = 900 - k * 40 - ph * 120; pts.push([x0 + 26 * Math.sin(k * 0.8 + ph * 6.28 + i), y]); }
    p.g.save(); p.g.globalAlpha = Math.sin(ph * Math.PI); p.stroke(pts, 16, INK); p.stroke(pts, 9, col); p.g.restore();
  }
};
/** emu: side view facing +x (right). phase 0..1 run cycle, mode 'run' | 'stand' | 'peck'. ~1.9 m tall on a person-scale card */
export const emu = (p, phase = 0, mode = 'run', look = 0) => {
  const TAU = Math.PI * 2, run = mode === 'run', bob = run ? 14 * Math.abs(Math.sin(phase * TAU)) : 0;
  const body = '#6b5440', bodyD = '#4f3d2e', leg = '#8b7a66', skin = '#7d93b0';
  const hip = [300, 560 - bob];
  const legP = (s) => {
    const a = run ? s * 0.75 * Math.sin(phase * TAU) : s * 0.08;
    const knee = [hip[0] + 40 * Math.sin(a) + 30, hip[1] + 170 * Math.cos(a) * 0.9];
    const lift = run ? Math.max(0, Math.sin(phase * TAU + (s > 0 ? 0 : Math.PI))) * 90 : 0;
    const foot = [knee[0] - 60 * Math.sin(a) - 10 + (run ? s * 20 : 0), 975 - lift];
    return [hip, knee, foot];
  };
  for (const s of [-1, 1]) {
    const L = legP(s), col = s < 0 ? '#6f604f' : leg;
    p.line(L, col, 22); const f = L[2]; p.stroke([[f[0] - 30, f[1]], [f[0] + 40, f[1] - 4]], 12, INK); p.stroke([[f[0] - 28, f[1]], [f[0] + 38, f[1] - 4]], 6, col);
  }
  // shaggy body
  const bx = 300, by = 470 - bob, pts = [];
  for (let i = 0; i <= 40; i++) { const a = Math.PI * 2 * i / 40, rr = 1 + 0.07 * Math.sin(i * 2.7); pts.push([bx + Math.cos(a) * 190 * rr, by + Math.sin(a) * 125 * rr * (Math.sin(a) > 0 ? 1 : 0.92)]); }
  p.poly(pts, body, 12);
  for (let i = 0; i < 9; i++) p.stroke([[bx - 150 + i * 32, by + 40 + (i % 2) * 20], [bx - 170 + i * 32, by + 120]], 6, bodyD);
  // neck + head (S-curve up from the chest; down and forward when pecking)
  const peck = mode === 'peck';
  const neck = peck ? [[bx + 140, by - 50], [bx + 215, by + 40], [bx + 245, by + 200], [bx + 230, by + 330]]
    : [[bx + 140, by - 50], [bx + 165, by - 150], [bx + 150 + look * 8, by - 240], [bx + 168 + look * 12, by - 320]];
  p.line(neck, skin, 40); p.line(neck.slice(0, 2), body, 58);
  const hx = neck[3][0] + (peck ? 6 : 10), hy = neck[3][1] + (peck ? 20 : -6);
  p.ell(hx, hy, 44, 34, skin, 10); p.ell(hx + 12, hy - 8, 15, 16, '#ffffff', 6); p.dot(hx + 18, hy - 6, 7);
  p.poly([[hx + 34, hy - 2], [hx + 92, hy + 8], [hx + 34, hy + 16]], '#3a2e2a', 7);
  p.stroke([[hx - 20, hy - 34], [hx - 4, hy - 46], [hx + 10, hy - 36]], 6, bodyD);
};
/** chunk of whale blubber / dirt as a 2D splat */
export const splat = (p, t, col = '#8a4a5a') => {
  for (let i = 0; i < 7; i++) { const a = i * 0.9, d = 60 + 180 * t; p.ell(300 + Math.cos(a) * d, 900 - Math.abs(Math.sin(a)) * d * 0.5 + 400 * t * t, 30 * (1 - t) + 8, 22 * (1 - t) + 6, col, 6); }
};
/** big cartoon explosion cloud: t 0..1 */
export const kaboom = (p, t, seed = 1) => {
  const g = p.g, k = Math.min(1, t * 3), fade = 1 - Math.max(0, (t - 0.55) / 0.45);
  g.save(); g.globalAlpha = Math.max(0, fade);
  const ring = (r, col, n, j) => { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * (1 + 0.18 * Math.sin(i * 7.3 + seed + j)); pts.push([300 + Math.cos(a) * rr, 560 + Math.sin(a) * rr * 0.9]); } p.poly(pts, col, 12); };
  ring(280 * k, '#7a6a5a', 18, 0); ring(220 * k, '#e8692e', 16, 1); ring(150 * k, '#f6b13a', 14, 2); ring(80 * k, '#fff3b0', 12, 3);
  g.restore();
};
/** speech-free comic word ("BOOM!") */
export const word = (p, txt, t = 1, col = '#f6c83a', size = 210) => {
  const s = 0.6 + 0.4 * Math.min(1, t * 4) + 0.06 * Math.sin(t * 30) * (1 - t);
  p.g.save(); p.g.translate(300, 500); p.g.scale(s, s); p.g.rotate(-0.08);
  p.g.font = `bold ${size}px Poppins, sans-serif`; p.g.textAlign = 'center'; p.g.textBaseline = 'middle';
  p.g.lineJoin = 'round'; p.g.lineWidth = size * 0.16; p.g.strokeStyle = INK; p.g.strokeText(txt, 0, 0); p.g.fillStyle = col; p.g.fillText(txt, 0, 0); p.g.restore();
};

/** merge many copies of one geometry (transforms: array of THREE.Matrix4) into one mesh-ready BufferGeometry */
export const mergeCopies = (geo, mats) => {
  const g0 = geo.index ? geo.toNonIndexed() : geo, P = g0.attributes.position, Nn = g0.attributes.normal, n = P.count;
  const pos = new Float32Array(n * 3 * mats.length), nor = new Float32Array(n * 3 * mats.length), v = new THREE.Vector3(), nm = new THREE.Matrix3();
  mats.forEach((m, k) => { nm.getNormalMatrix(m); for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(P, i).applyMatrix4(m); pos.set([v.x, v.y, v.z], (k * n + i) * 3);
    v.fromBufferAttribute(Nn, i).applyMatrix3(nm).normalize(); nor.set([v.x, v.y, v.z], (k * n + i) * 3); } });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); return g;
};
/** 1930s flatbed truck along +x, ~5.5 m. returns { root, wheels[] } */
export const oldTruck = (K, color = '#5d6b4a', parent = K.scene) => {
  const root = K.group(parent), c = K.col(color), dark = K.col('#2b2e36'), wood = K.col('#9a6a44'), glass = K.col('#9fd0e8'), chrome = K.col('#c9ced6');
  K.slab(-2.8, 2.6, 0.55, 0.75, -0.9, 0.9, dark, root);
  K.slab(1.3, 2.7, 0.75, 1.55, -0.7, 0.7, c, root); K.slab(2.65, 2.75, 0.8, 1.5, -0.6, 0.6, chrome, root);
  K.slab(0.1, 1.35, 0.75, 2.35, -0.9, 0.9, c, root); K.slab(1.3, 1.37, 1.6, 2.2, -0.75, 0.75, glass, root); K.slab(0.0, 1.45, 2.35, 2.45, -0.95, 0.95, c, root);
  K.slab(-2.8, 0.0, 0.75, 0.95, -1.0, 1.0, wood, root);
  for (const z of [-1, 1]) K.slab(-2.8, 0.0, 0.95, 1.35, z * 0.97 - 0.03, z * 0.97 + 0.03, wood, root);
  for (const s of [-1, 1]) { const m = K.add(new THREE.CylinderGeometry(0.75, 0.75, 0.3, 16, 1, false, 0, Math.PI), c, 2.0, 0.75, s * 0.85, root); m.rotation.set(Math.PI / 2, 0, 0); }
  const wheels = [];
  for (const x of [-1.9, 2.0]) for (const z of [-0.95, 0.95]) { const w = K.add(new THREE.CylinderGeometry(0.48, 0.48, 0.24, 16), dark, x, 0.48, z, root); w.rotation.x = Math.PI / 2; wheels.push(w);
    const hub = K.add(new THREE.CylinderGeometry(0.16, 0.16, 0.26, 10), chrome, 0, 0, 0, w); }
  for (const z of [-0.5, 0.5]) K.add(new THREE.SphereGeometry(0.14, 12, 8), K.col('#fff6c8'), 2.72, 1.2, z, root);
  return { root, wheels };
};

/** brick facade texture with a window grid (cols x rows windows) */
export const facadeTex = (brick = '#a8483a', cols = 4, rows = 4, seed = 1, trim = '#e8dcc4') => canvasTex(512, 512, (g, w, h) => {
  let s = seed; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  g.fillStyle = brick; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 10) for (let x = (y / 10) % 2 * 12; x < w; x += 24) { g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.1})`; g.fillRect(x, y, 22, 8); }
  const cw = w / cols, rh = h / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const x = i * cw + cw * 0.25, y = j * rh + rh * 0.2, ww = cw * 0.5, hh = rh * 0.55;
    g.fillStyle = trim; g.fillRect(x - 5, y - 8, ww + 10, hh + 14);
    g.fillStyle = r() < 0.3 ? '#f3d98a' : '#3a4a5c'; g.fillRect(x, y, ww, hh);
    g.fillStyle = trim; g.fillRect(x + ww / 2 - 2, y, 4, hh); g.fillRect(x, y + hh / 2 - 2, ww, 4);
  }
  g.fillStyle = trim; g.fillRect(0, 0, w, 10);
});
