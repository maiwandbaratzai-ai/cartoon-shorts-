// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Rich" look: every material becomes a lit, textured surface (MeshStandardMaterial)
// with procedural world-space detail (triplanar): colour variation, grime, bumps, roughness.
// Kinds: grime (default), wood, rock, dirt, metal, fabric, brick, plaster.
import * as THREE from './lib/three.module.js';

const N = 256;
const rngf = (seed) => { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
// tileable value noise on an N×N grid with period p
function vnoise(seed, p) {
  const r = rngf(seed), g = new Float32Array(p * p); for (let i = 0; i < g.length; i++) g[i] = r();
  const out = new Float32Array(N * N), s = p / N;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const fx = x * s, fy = y * s, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const a = g[(y0 % p) * p + (x0 % p)], b = g[(y0 % p) * p + ((x0 + 1) % p)], c = g[((y0 + 1) % p) * p + (x0 % p)], d = g[((y0 + 1) % p) * p + ((x0 + 1) % p)];
    out[y * N + x] = (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }
  return out;
}
function fbm(seed, p0 = 4, oct = 5) {
  const out = new Float32Array(N * N); let amp = 0.5, tot = 0;
  for (let o = 0; o < oct; o++) { const n = vnoise(seed + o * 17, p0 << o); for (let i = 0; i < out.length; i++) out[i] += n[i] * amp; tot += amp; amp *= 0.5; }
  for (let i = 0; i < out.length; i++) out[i] /= tot; return out;
}
// tileable cellular: returns [F1, F2-F1] for k points
function cells(seed, k) {
  const r = rngf(seed), P = []; for (let i = 0; i < k; i++) P.push([r() * N, r() * N]);
  const f1 = new Float32Array(N * N), ed = new Float32Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let a = 1e9, b = 1e9;
    for (const [px, py] of P) { let dx = Math.abs(px - x), dy = Math.abs(py - y); dx = Math.min(dx, N - dx); dy = Math.min(dy, N - dy); const d = Math.sqrt(dx * dx + dy * dy); if (d < a) { b = a; a = d; } else if (d < b) b = d; }
    f1[y * N + x] = a; ed[y * N + x] = b - a;
  }
  return [f1, ed];
}
const cl = (v) => Math.max(0, Math.min(1, v));
const sm = (a, b, x) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// R = albedo variation (0.5 neutral), G = height, B = roughness variation, A = grime/cavity
function build(kind, seed) {
  const R = new Float32Array(N * N), G = new Float32Array(N * N), B = new Float32Array(N * N), A = new Float32Array(N * N);
  const big = fbm(seed, 2, 4), mid = fbm(seed + 5, 6, 4), fine = fbm(seed + 9, 32, 3);
  const r = rngf(seed + 77);
  if (kind === 'wood') {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x, plank = Math.floor(x / 64), lx = x % 64;
      const pr = rngf(seed + plank * 31)(), warp = mid[i] * 3 + pr * 9;
      const grain = 0.5 + 0.5 * Math.sin((lx + warp * 4) * 0.45 + fine[i] * 2.5);
      const streak = sm(0.55, 0.75, vnoiseStretch(seed, x, y));
      const seam = sm(0, 2.5, lx) * sm(0, 2.5, 63 - lx);
      R[i] = 0.5 + (pr - 0.5) * 0.4 + (grain - 0.5) * 0.1 - streak * 0.12 + (big[i] - 0.5) * 0.3;
      G[i] = seam * (0.6 + grain * 0.25 + fine[i] * 0.15);
      B[i] = 0.5 + (grain - 0.5) * 0.3; A[i] = 1 - seam;
    }
  } else if (kind === 'rock' || kind === 'brick') {
    const [f1, ed] = cells(seed, kind === 'rock' ? 26 : 1);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = y * N + x;
      let crack, face;
      if (kind === 'brick') { const row = Math.floor(y / 32), bx = (x + (row % 2) * 32) % 64, by = y % 32; crack = 1 - sm(0, 3, bx) * sm(0, 3, 63 - bx) * sm(0, 3, by) * sm(0, 3, 31 - by); face = rngf(seed + row * 9 + Math.floor((x + (row % 2) * 32) / 64))(); }
      else { crack = 1 - sm(0, 5, ed[i] + mid[i] * 4); face = f1[i] / 40; }
      R[i] = 0.5 + (big[i] - 0.5) * 0.7 + (mid[i] - 0.5) * 0.4 + (face - 0.5) * 0.25 - crack * 0.35;
      G[i] = (1 - crack) * (0.55 + mid[i] * 0.3 + fine[i] * 0.25) - (kind === 'rock' ? Math.min(f1[i] / 60, 0.3) : 0);
      B[i] = 0.55 + (fine[i] - 0.5) * 0.4; A[i] = 1 - crack;
    }
  } else if (kind === 'dirt') {
    const peb = new Float32Array(N * N);
    for (let k = 0; k < 220; k++) { const cx = r() * N, cy = r() * N, rad = 1.5 + r() * 4; for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) { const d = Math.hypot(x, y) / rad; if (d < 1) { const ix = ((Math.floor(cx + x) % N) + N) % N, iy = ((Math.floor(cy + y) % N) + N) % N; peb[iy * N + ix] = Math.max(peb[iy * N + ix], Math.sqrt(1 - d * d)); } } }
    for (let i = 0; i < N * N; i++) { R[i] = 0.5 + (big[i] - 0.5) * 0.8 + (fine[i] - 0.5) * 0.4 + peb[i] * 0.12; G[i] = mid[i] * 0.4 + fine[i] * 0.3 + peb[i] * 0.5; B[i] = 0.6 + (fine[i] - 0.5) * 0.3; A[i] = cl(0.4 + mid[i]); }
  } else if (kind === 'metal') {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x, brush = vnoiseRow(seed, x, y); const rust = sm(0.62, 0.8, big[i] * 0.7 + mid[i] * 0.4); R[i] = 0.5 + (big[i] - 0.5) * 0.3 + brush * 0.08 - rust * 0.2; G[i] = 0.5 + fine[i] * 0.15 + rust * 0.2; B[i] = 0.3 + rust * 0.5 + brush * 0.1; A[i] = 1 - rust * 0.6; }
  } else if (kind === 'fabric') {
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x, w = (Math.sin(x * 1.6) * Math.sin(y * 1.6)) * 0.5 + 0.5; R[i] = 0.5 + (w - 0.5) * 0.15 + (big[i] - 0.5) * 0.3; G[i] = w * 0.6 + fine[i] * 0.2; B[i] = 0.75; A[i] = 1; }
  } else if (kind === 'plaster') {
    for (let i = 0; i < N * N; i++) { R[i] = 0.5 + (big[i] - 0.5) * 0.45 + (mid[i] - 0.5) * 0.2; G[i] = mid[i] * 0.5 + fine[i] * 0.35; B[i] = 0.6; A[i] = cl(0.3 + big[i] * 1.2); }
  } else { // grime
    for (let i = 0; i < N * N; i++) { R[i] = 0.5 + (big[i] - 0.5) * 0.6 + (fine[i] - 0.5) * 0.25; G[i] = mid[i] * 0.55 + fine[i] * 0.3; B[i] = 0.5 + (mid[i] - 0.5) * 0.4; A[i] = cl(0.2 + big[i] * 1.3); }
    for (let k = 0; k < 18; k++) { let x = r() * N, y = r() * N; const a = r() * 6.28, len = 10 + r() * 40; for (let t = 0; t < len; t++) { x += Math.cos(a); y += Math.sin(a); const i = (((y | 0) % N + N) % N) * N + (((x | 0) % N + N) % N); G[i] -= 0.25; R[i] -= 0.06; } }
  }
  const data = new Uint8Array(N * N * 4);
  for (let i = 0; i < N * N; i++) { data[i * 4] = cl(R[i]) * 255; data[i * 4 + 1] = cl(G[i]) * 255; data[i * 4 + 2] = cl(B[i]) * 255; data[i * 4 + 3] = cl(A[i]) * 255; }
  const t = new THREE.DataTexture(data, N, N); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 4; t.needsUpdate = true;
  return t;
}
let _st = null;
function vnoiseStretch(seed, x, y) { // noise stretched along y (wood fibres)
  if (!_st) { const n = vnoise(seed + 99, 64); _st = n; }
  const yy = Math.floor(y / 8) % N, xx = (x * 4) % N; return _st[yy * N + xx];
}
function vnoiseRow(seed, x, y) { const r = rngf(seed + y * 7 + 3)(); return r - 0.5; }

const cache = {};
export const detailTex = (kind) => cache[kind] || (cache[kind] = build(kind, { grime: 11, wood: 23, rock: 37, dirt: 41, metal: 53, fabric: 61, brick: 71, plaster: 83 }[kind] || 11));

// defaults per kind: [world tile size (m), colour amount, bump (m), roughness]
const KIND = {
  grime: [1.6, 0.55, 0.006, 0.82], wood: [1.4, 0.7, 0.01, 0.75], rock: [2.2, 0.9, 0.03, 0.9], dirt: [1.2, 0.8, 0.02, 0.95],
  metal: [1.2, 0.45, 0.004, 0.45], fabric: [0.35, 0.5, 0.004, 0.95], brick: [1.4, 0.7, 0.02, 0.9], plaster: [2.0, 0.5, 0.006, 0.9],
};

const VERT_HEAD = `varying vec3 vWP; varying vec3 vWN;\n`;
const VERT_BODY = `
  { vec4 wp_ = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
      wp_ = instanceMatrix * wp_;
    #endif
    vWP = (modelMatrix * wp_).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal); }
`;
const FRAG_HEAD = `varying vec3 vWP; varying vec3 vWN; uniform sampler2D uDet; uniform float uScale, uAmt, uBump, uRgh, uGrime;
vec4 detS(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.)); w /= (w.x+w.y+w.z+1e-4);
  return texture2D(uDet, p.zy*s)*w.x + texture2D(uDet, p.xz*s)*w.y + texture2D(uDet, p.xy*s)*w.z; }
`;
const FRAG_COLOR = `
  vec3 wn_ = normalize(vWN);
  vec4 dA = detS(vWP, wn_, 1.0/uScale), dB = detS(vWP + vec3(17.3, 5.1, 9.7), wn_, 0.23/uScale);
  float var_ = (dA.r-.5)*0.7 + (dB.r-.5)*1.0;
  float grime_ = (1.0 - dA.a*0.6 - dB.a*0.4);
  diffuseColor.rgb *= clamp(1.0 + var_*uAmt, 0.2, 1.8) * (1.0 - grime_*uGrime);
  float hgt_ = dA.g + dB.g*0.6;
`;
const FRAG_ROUGH = `roughnessFactor = clamp(roughnessFactor + (dA.b-.5)*0.35, 0.05, 1.0);`;
const FRAG_NORMAL = `
  { vec3 sx_ = dFdx(-vViewPosition), sy_ = dFdy(-vViewPosition);
    float hx_ = dFdx(hgt_)*uBump, hy_ = dFdy(hgt_)*uBump;
    vec3 r1_ = cross(sy_, normal), r2_ = cross(normal, sx_);
    float det_ = dot(sx_, r1_) * faceDirection;
    vec3 g_ = sign(det_) * (hx_*r1_ + hy_*r2_);
    normal = normalize(abs(det_)*normal - g_); }
`;
function onBC(shader) {
  const d = this.userData.det;
  shader.uniforms.uDet = { value: detailTex(d.kind) };
  shader.uniforms.uScale = { value: d.scale }; shader.uniforms.uAmt = { value: d.amt }; shader.uniforms.uBump = { value: d.bump };
  shader.uniforms.uRgh = { value: d.rough }; shader.uniforms.uGrime = { value: d.grime };
  shader.vertexShader = VERT_HEAD + shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n' + VERT_BODY);
  shader.fragmentShader = FRAG_HEAD + shader.fragmentShader
    .replace('#include <map_fragment>', '#include <map_fragment>\n' + FRAG_COLOR)
    .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + FRAG_ROUGH)
    .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL);
}

/** Drop-in replacement for the old toon(): accepts MeshToonMaterial-style opts plus
 *  kind ('grime'|'wood'|'rock'|'dirt'|'metal'|'fabric'|'brick'|'plaster'), detail (tile size m),
 *  amt (colour variation), bump (m), grime (0..1 cavity darkening), plain (true = no detail). */
export function rich(opts = {}) {
  const { kind = 'grime', detail, amt, bump, grime, plain, gradientMap, ...rest } = opts;
  const k = KIND[kind] || KIND.grime;
  const m = new THREE.MeshStandardMaterial({ roughness: k[3], metalness: 0, ...rest });
  if (rest.emissive === undefined && rest.color && opts.glow) m.emissive = new THREE.Color(rest.color);
  if (plain) return m;
  m.userData.det = { kind, scale: detail ?? k[0], amt: amt ?? k[1], bump: bump ?? k[2], rough: k[3], grime: grime ?? 0.25 };
  m.onBeforeCompile = onBC;
  return m;
}
