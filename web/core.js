// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Shared engine for cartoon shorts: plain three.js r160 in headless Chrome.
// index.html?s=<story> loads ./s/<story>.js, whose default export is
//   { TOTAL, build(K), frame(f, K) -> { light, cam, dof, actors, fx } }
// renderFrame(f): colour pass -> normal/depth pass -> ink + grade -> thin-lens DOF.
import * as THREE from './lib/three.module.js';
import * as T from './toon.js';
import * as P from './paint.js';
import * as MO from './motion.js';
import * as LK from './look.js';

const W = 1080, H = 1920;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 2500);
const rx = (a) => a * Math.PI / 180;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- materials ----------
const grad = (() => { const d = new Uint8Array([96, 96, 96, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 2, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
let LOOK = 'rich'; // 'rich' (textured, lit) or 'toon' (old flat look); a story can set `look: 'toon'`
const toon = (opts = {}) => LOOK === 'rich' ? LK.rich(opts) : (({ kind, detail, amt, bump, grime, plain, glow, ...o }) => new THREE.MeshToonMaterial({ gradientMap: grad, ...o }))(opts);
const mat = (kind, color, o = {}) => toon({ kind, color, ...o }); // e.g. K.mat('wood', '#8a5a34')
const col = (c) => toon({ color: c });
const texM = (c, a = 1, b = 1, color = '#ffffff') => toon({ map: P.tex(c, a, b), color });
const ndMat = new THREE.ShaderMaterial({
  vertexShader: `varying vec3 vN; varying float vD; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }`,
  side: THREE.DoubleSide,
});
const cardNd = (map) => new THREE.ShaderMaterial({
  uniforms: { map: { value: map } },
  vertexShader: `varying vec2 vUv; varying float vD; void main(){ vUv=uv; vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying float vD; void main(){ if(texture2D(map,vUv).a<.5) discard; gl_FragColor=vec4(0.,0.,0.,vD); }`,
  side: THREE.DoubleSide,
});
const flatNd = new THREE.ShaderMaterial({
  vertexShader: `varying float vD; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vD; void main(){ gl_FragColor=vec4(.5,1.,.5,vD); }`, side: THREE.DoubleSide,
});

// ---------- helpers ----------
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene, opts = {}) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = opts.cast ?? true; m.receiveShadow = true; parent.add(m); return m;
};
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const slab = (x0, x1, y0, y1, z0, z1, mat, parent = scene, cast = true) => add(box(x1 - x0, y1 - y0, z1 - z0), mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, parent, { cast });
const beam = (a, b, th, mat, parent = scene) => {
  const m = add(box(th, a.distanceTo(b), th), mat, 0, 0, 0, parent);
  m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); return m;
};
const cyl = (rt, rb, h, mat, x, y, z, parent = scene, seg = 32) => add(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y + h / 2, z, parent);
const sphere = (r, mat, x, y, z, parent = scene, sx = 1, sy = 1, sz = 1) => { const m = add(new THREE.SphereGeometry(r, 32, 20), mat, x, y, z, parent); m.scale.set(sx, sy, sz); return m; };
const group = (parent = scene) => { const g = new THREE.Group(); parent.add(g); return g; };
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- sky + lights ----------
const skyU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, hor; varying vec3 vP; void main(){ float h = clamp(vP.y,0.,1.); vec3 c = mix(hor, top, pow(smoothstep(0.,.45,h), .7)); gl_FragColor = vec4(c,1.); }`,
}));
sky.userData.ndSkip = true; scene.add(sky);
const hemi = new THREE.HemisphereLight('#ffffff', '#ffffff', 1); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffffff', 2); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.04; sun.shadow.radius = 2;
scene.add(sun); scene.add(sun.target);
scene.fog = new THREE.Fog('#ffffff', 100, 1000);

const clouds = [];
const addClouds = (n = 12, dist = 900, h0 = 160, seed = 90) => {
  const r = P.rng(seed);
  for (let i = 0; i < n; i++) {
    const c = document.createElement('canvas'); c.width = 600; c.height = 400; const pen = new T.Pen(c.getContext('2d')); pen.ol = 0;
    pen.g.translate(300, 200); pen.g.scale(1.4, 1.2); pen.g.translate(-300, -200); T.fxCloud(pen, i + 1);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.667), new THREE.MeshBasicMaterial({ map: P.tex(c), transparent: true, fog: false, depthWrite: false }));
    const a = r() * Math.PI * 2, d = dist + r() * dist / 3; m.position.set(Math.cos(a) * d, h0 + r() * h0 * 1.4, Math.sin(a) * d); m.scale.setScalar(dist / 4 + r() * dist / 5);
    m.userData.ndSkip = true; m.renderOrder = -1; scene.add(m); clouds.push(m);
  }
};


// ---------- atmosphere: lamps, light shafts, dust (rich look) ----------
const glowTex = P.tex(P.radial('255,214,150', 0.5));
const lamps = [];
/** K.lamp(x,y,z,{color,intensity,distance,flicker,glow,shadow}) -> warm point light with a soft glow sprite */
const lamp = (x, y, z, o = {}) => {
  const L = new THREE.PointLight(o.color || '#ffb060', o.intensity ?? 12, o.distance ?? 14, 2); L.position.set(x, y, z);
  if (o.shadow) { L.castShadow = true; L.shadow.mapSize.set(512, 512); L.shadow.bias = -0.002; L.shadow.radius = 3; }
  (o.parent || scene).add(L);
  let g = null;
  if (o.glow !== false) { g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: o.color || '#ffb060', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: o.glowA ?? 0.8 })); g.position.set(x, y, z); g.scale.setScalar(o.glowS ?? 0.9); g.userData.ndSkip = true; (o.parent || scene).add(g); }
  const rec = { light: L, glow: g, base: L.intensity, flicker: o.flicker ?? 0.08, seed: lamps.length * 7.3 }; lamps.push(rec); return rec;
};
const shaftMat = (color, alpha) => new THREE.ShaderMaterial({
  uniforms: { c: { value: new THREE.Color(color) }, a: { value: alpha } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `uniform vec3 c; uniform float a; varying float vY; varying vec3 vN; varying vec3 vV; void main(){ float e = pow(abs(dot(normalize(vN), vV)), 2.); float f = smoothstep(0., .5, vY) * (1. - smoothstep(.85, 1., vY)) * .35 + smoothstep(.3, 1., vY)*.65; gl_FragColor = vec4(c * a * e * f, 1.); }`,
});
/** K.shaft([x,y,z] top, [x,y,z] bottom, rTop, rBottom, color, alpha) -> soft volumetric light beam */
const shaft = (top, bot, r0 = 0.3, r1 = 1.2, color = '#ffd9a0', alpha = 0.18, parent = scene) => {
  const a = V(...top), b = V(...bot), len = a.distanceTo(b);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 32, 1, true), shaftMat(color, alpha));
  m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), a.clone().sub(b).normalize());
  m.userData.ndSkip = true; m.renderOrder = 5; m.castShadow = false; m.receiveShadow = false; parent.add(m); return m;
};
const dustU = { t: { value: 0 }, ps: { value: 1000 } };
/** K.dust([cx,cy,cz], [sx,sy,sz], n, color, size) -> slowly drifting glowing specks */
const dust = (c, sz, n = 120, color = '#ffd29a', size = 0.012, parent = scene) => {
  const r = P.rng(n * 13 + (c[0] * 7 | 0)), pos = new Float32Array(n * 3), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) { pos[i * 3] = c[0] + (r() - 0.5) * sz[0]; pos[i * 3 + 1] = c[1] + (r() - 0.5) * sz[1]; pos[i * 3 + 2] = c[2] + (r() - 0.5) * sz[2]; ph[i] = r() * 100; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1));
  const m = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: { ...dustU, col: { value: new THREE.Color(color) }, s: { value: size } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float t, ps, s; attribute float ph; varying float vA; void main(){ vec3 p = position + vec3(sin(t*.31+ph)*.25, sin(t*.23+ph*1.7)*.18 + mod(t*.02+ph*.1, .4)-.2, cos(t*.27+ph*.9)*.25); vec4 mv = modelViewMatrix*vec4(p,1.); gl_PointSize = max(1.5, s*ps/-mv.z); vA = .5+.5*sin(t*1.3+ph*3.); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 col; varying float vA; void main(){ vec2 q = gl_PointCoord-.5; float d = 1.-smoothstep(.1,.5,length(q)); gl_FragColor = vec4(col*d*vA*.45, 1.); }` }));
  m.userData.ndSkip = true; m.frustumCulled = false; m.renderOrder = 6; parent.add(m); return m;
};

// ---------- cards (2D characters / effects on billboards) ----------
const CW = 1200, CH = 2000, CM = 2.25;
const cardGeo = new THREE.PlaneGeometry(CM * 0.6, CM); cardGeo.translate(0, CM / 2 - CM * 0.025, 0);
const blobTex = P.tex(P.radial('20,14,30', 0.55));
class Card {
  constructor() {
    this.c = document.createElement('canvas'); this.c.width = CW; this.c.height = CH; this.g = this.c.getContext('2d');
    this.t = new THREE.CanvasTexture(this.c); this.t.colorSpace = THREE.SRGBColorSpace; this.t.anisotropy = 4;
    this.mat = new THREE.MeshBasicMaterial({ map: this.t, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, fog: true });
    this.mesh = new THREE.Mesh(cardGeo, this.mat); this.mesh.userData.nd = cardNd(this.t); this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.t, alphaTest: 0.5 });
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, fog: true }));
    this.blob.rotation.x = -Math.PI / 2; this.blob.userData.ndSkip = true; this.blob.renderOrder = 1;
    scene.add(this.mesh); scene.add(this.blob); this.key = ''; this.mesh.visible = this.blob.visible = false;
  }
  draw(key, fn) {
    if (key === this.key) return; this.key = key;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, CW, CH); g.setTransform(CW / 600, 0, 0, CH / 1000, 0, 0);
    fn(new T.Pen(g)); g.setTransform(1, 0, 0, 1, 0, 0); this.t.needsUpdate = true;
  }
}
let cardTint = '#ffffff';
const cards = []; const getCard = (i) => cards[i] || (cards[i] = new Card());

// ---------- post ----------
const rtColor = new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType });
const rtNd = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const rtInk = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsGeo = new THREE.PlaneGeometry(2, 2);
const fs = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(fsGeo, mat)); return s; };
const rtB1 = new THREE.WebGLRenderTarget(W / 4, H / 4, { type: THREE.HalfFloatType }), rtB2 = rtB1.clone();
const vsFS = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`;
const brightU = { src: { value: rtColor.texture }, thr: { value: 0.9 } };
const brightScene = fs(new THREE.ShaderMaterial({ uniforms: brightU, vertexShader: vsFS,
  fragmentShader: `uniform sampler2D src; uniform float thr; varying vec2 vUv; void main(){ vec3 c = vec3(0.); for(int i=0;i<4;i++){ vec2 o = vec2(float(i-(i/2)*2)-.5, float(i/2)-.5)*1.5/vec2(270.,480.); c += max(texture2D(src, vUv+o).rgb - thr, 0.); } gl_FragColor = vec4(c*.25, 1.); }` }));
const blurU = { src: { value: null }, dir: { value: new THREE.Vector2() } };
const blurScene = fs(new THREE.ShaderMaterial({ uniforms: blurU, vertexShader: vsFS,
  fragmentShader: `uniform sampler2D src; uniform vec2 dir; varying vec2 vUv; void main(){ vec3 c = texture2D(src, vUv).rgb*.2; float w[4]; w[0]=.18; w[1]=.13; w[2]=.08; w[3]=.04; for(int i=0;i<4;i++){ vec2 o = dir*float(i+1)*1.6; c += (texture2D(src, vUv+o).rgb + texture2D(src, vUv-o).rgb)*w[i]; } gl_FragColor = vec4(c, 1.); }` }));
const inkU = { col: { value: rtColor.texture }, nd: { value: rtNd.texture }, bl: { value: rtB1.texture }, res: { value: new THREE.Vector2(W, H) }, px: { value: 2.5 },
  sat: { value: 1.08 }, lift: { value: new THREE.Color(0, 0, 0) }, gain: { value: new THREE.Color(1, 1, 1) }, vig: { value: 0.22 }, flash: { value: 0 }, fade: { value: 0 },
  ink: { value: 1 }, ao: { value: 0 }, bloom: { value: 0 }, expo: { value: 1 }, tm: { value: 0 }, tanH: { value: new THREE.Vector2(1, 1) }, projS: { value: 1000 } };
const inkScene = fs(new THREE.ShaderMaterial({ uniforms: inkU, vertexShader: vsFS,
  fragmentShader: `uniform sampler2D col, nd, bl; uniform vec2 res, tanH; uniform float px, sat, vig, flash, fade, ink, ao, bloom, expo, tm, projS; uniform vec3 lift, gain; varying vec2 vUv;
  float edgeAt(vec2 uv, float r){
    vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01) return 0.; float d = c.a; vec3 n = c.rgb*2.-1.;
    float e = 0.; float rr = r * clamp(7./d, .62, 1.25);
    for (int i=0;i<16;i++){ float a = float(i)*.785398 + (i>7 ? .39 : 0.); float k = i>7 ? .5 : 1.;
      vec2 o = vec2(cos(a), sin(a))*rr*k/res; vec4 s = texture2D(nd, uv+o);
      float ds = s.a; bool card = dot(s.rgb,s.rgb) < .01;
      if (card && ds > 0.) continue;
      if (card) ds = 1e4;
      vec3 ns = s.rgb*2.-1.;
      float rel = (ds - d)/d; float same = card ? 0. : smoothstep(.97, .995, dot(n, ns));
      e = max(e, smoothstep(mix(.006, .07, same), mix(.02, .22, same), rel));
      if (!card && abs(ds-d)/d < .06) e = max(e, smoothstep(.88, .72, dot(n, ns)) * .9);
    }
    return e * (1. - smoothstep(180., 700., d)*.8);
  }
  vec3 vpos(vec2 uv, float d){ return vec3((uv*2.-1.)*tanH*d, -d); }
  float aoAt(vec2 uv){
    vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01) return 0.; float d = c.a; vec3 n = normalize(c.rgb*2.-1.); vec3 P = vpos(uv, d);
    float rad = .5, rpx = clamp(rad*projS/d, 3., 110.), occ = 0., rot = fract(52.9829189*fract(dot(gl_FragCoord.xy, vec2(.06711056,.00583715))))*6.283;
    for (int i=0;i<10;i++){ float fi = float(i); float r = (fi+.5)/10.; float a = fi*2.39996 + rot;
      vec2 u2 = uv + vec2(cos(a), sin(a))*rpx*r/res; vec4 s = texture2D(nd, u2); if (dot(s.rgb,s.rgb) < .01 || s.a <= 0.) continue;
      vec3 v = vpos(u2, s.a) - P; float L = length(v); occ += max(0., dot(n, v/L) - .12) * (1. - smoothstep(rad*.7, rad*2., L)); }
    return clamp(occ/10.*1.8, 0., 1.);
  }
  vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14), 0., 1.); }
  void main(){
    vec3 c = texture2D(col, vUv).rgb;
    vec4 q0 = texture2D(nd, vUv); bool isCard = dot(q0.rgb,q0.rgb) < .01 && q0.a > 0.;
    if (!isCard && ao > 0.) c *= 1. - ao*aoAt(vUv);
    c += texture2D(bl, vUv).rgb * bloom;
    if (tm > .5 && !isCard) c = aces(c*expo);
    float e = edgeAt(vUv, px) * ink;
    c = mix(c, vec3(.012,.01,.014), e);
    float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
    c = c*gain + lift;
    vec2 q = vUv-.5; c *= 1. - vig*dot(q*vec2(1.,.75), q*vec2(1.,.75))*2.2;
    c = mix(c, vec3(1.), flash); c = mix(c, vec3(0.), fade);
    gl_FragColor = vec4(c,1.); }` }));
const dofU = { src: { value: rtInk.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 5 }, cinf: { value: 0 }, near: { value: 1 } };
const dofScene = fs(new THREE.ShaderMaterial({ uniforms: dofU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D src, nd; uniform vec2 res; uniform float focus, cinf, near; varying vec2 vUv;
  float coc(vec2 uv){ float d = texture2D(nd, uv).a; if (d <= 0.) d = 2000.; float k = 1. - focus/d; return k > 0. ? cinf*k : min(-k*cinf*near, cinf*1.4); }
  void main(){
    float c0 = coc(vUv);
    if (cinf < .5 || c0 < .6) { gl_FragColor = linearToOutputTexel(vec4(texture2D(src, vUv).rgb, 1.)); return; }
    vec3 acc = vec3(0.); float wsum = 0.;
    for (int i=0;i<48;i++){ float fi = float(i); float r = sqrt((fi+.5)/48.); float a = fi*2.39996;
      vec2 o = vec2(cos(a), sin(a))*r*c0/res; float cs = coc(vUv+o);
      float w = smoothstep(r*c0-1.5, r*c0+.5, cs + .5);
      acc += texture2D(src, vUv+o).rgb*w; wsum += w; }
    gl_FragColor = linearToOutputTexel(vec4(acc/max(wsum,1e-3), 1.)); }` }));

// ---------- per-frame ----------
const tmpV = new THREE.Vector3();
function applyLight(L) {
  hemi.color.set(L.sky); hemi.groundColor.set(L.ground); hemi.intensity = L.hemi;
  sun.color.set(L.sun); sun.intensity = L.sunI;
  scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
  skyU.top.value.set(L.skyTop); skyU.hor.value.set(L.skyHor);
  const R_ = LOOK === 'rich'; inkU.ink.value = L.ink ?? (R_ ? 0.3 : 1); inkU.ao.value = L.ao ?? (R_ ? 0.7 : 0); inkU.bloom.value = L.bloom ?? (R_ ? 0.6 : 0); inkU.expo.value = L.exposure ?? 1.35; inkU.tm.value = R_ ? 1 : 0; brightU.thr.value = L.bloomThr ?? 0.85;
  inkU.sat.value = L.sat ?? 1.08; inkU.gain.value.set(L.gain || '#ffffff'); inkU.lift.value.set(L.lift || '#000000'); inkU.vig.value = L.vig ?? 0.22;
}
function placeSun(L, focus) {
  const az = rx(L.az), el = rx(L.el); tmpV.set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
  sun.position.copy(focus).addScaledVector(tmpV, 150); sun.target.position.copy(focus);
  const ext = L.shadowExt || 30, sc = sun.shadow.camera; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = 400; sc.updateProjectionMatrix();
}
function drawActors(list, cam) {
  cards.forEach((c) => { c.mesh.visible = c.blob.visible = false; });
  list.forEach((a, i) => {
    const c = getCard(i);
    c.draw(a.key, a.draw);
    c.mesh.visible = true; c.mesh.position.set(a.x, a.y, a.z);
    const s = a.s || 1; c.mesh.scale.set(s * (a.flip ? -1 : 1) * (a.sx || 1), s * (a.sy || 1), s);
    c.mesh.rotation.set(0, Math.atan2(cam.position.x - a.x, cam.position.z - a.z) + (a.yaw || 0), a.roll || 0);
    c.mat.opacity = a.alpha ?? 1; c.mat.color.set(a.tint || cardTint); c.mesh.castShadow = a.shadow !== false; c.mesh.renderOrder = a.order || 2;
    if (a.blob !== false) { c.blob.visible = true; c.blob.position.set(a.x, (a.ground ?? a.y) + 0.03, a.z); c.blob.scale.set(0.95 * s, 0.6 * s, 1); }
  });
}
const swapForNd = (on) => {
  scene.traverse((o) => {
    if (!o.isMesh && !o.isPoints && !o.isSprite) return;
    if (on) {
      o.userData.mat0 = o.material;
      if (o.userData.ndSkip) { o.userData.vis0 = o.visible; o.visible = false; return; }
      o.material = o.userData.nd || ndMat;
    } else {
      o.material = o.userData.mat0; if (o.userData.vis0 !== undefined) { o.visible = o.userData.vis0; delete o.userData.vis0; }
    }
  });
};

// ---------- kit context handed to stories ----------
const K = { lamp, shaft, dust, mat, kinds: ['grime', 'wood', 'rock', 'dirt', 'metal', 'fabric', 'brick', 'plaster'], THREE, T, P, MO, scene, camera, renderer, V, rx, toon, col, texM, grad, ndMat, flatNd, cardNd, add, box, slab, beam, cyl, sphere, group, smoothstep, addClouds, CM, W, H };

const QS = new URLSearchParams(location.search), story = QS.get('s'), DBG = QS.get('dbg');
const S = (await import(`./s/${story}.js`)).default;
LOOK = QS.get('look') || S.look || 'rich';
await S.build(K);

window.renderFrame = (f) => {
  const R = S.frame(f, K), L = R.light, Cm = R.cam;
  applyLight(L); cardTint = L.cardTint || '#ffffff';
  camera.position.set(...Cm.pos); camera.up.set(0, 1, 0); camera.lookAt(...Cm.look); camera.rotateZ(rx(Cm.roll || 0));
  camera.fov = Cm.fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  placeSun(L, new THREE.Vector3(...(Cm.shadowAt || Cm.look)));
  drawActors([...(R.actors || []), ...(R.fx || [])], camera);
  for (const l of lamps) { const k = 1 + l.flicker * (Math.sin(f * 0.37 + l.seed) * 0.6 + Math.sin(f * 1.13 + l.seed * 2) * 0.4); l.light.intensity = l.base * k * (R.lampK ?? 1); if (l.glow) l.glow.material.opacity = 0.8 * k * (R.lampK ?? 1); }
  dustU.t.value = f / 30; const th = Math.tan(rx(camera.fov) / 2); dustU.ps.value = (H / 2) / th;
  inkU.tanH.value.set(th * W / H, th); inkU.projS.value = (H / 2) / th;
  sky.position.copy(camera.position);
  for (const c of clouds) c.quaternion.copy(camera.quaternion);
  if (DBG === 'col') { renderer.setRenderTarget(null); renderer.setClearColor(0xff00ff, 1); renderer.clear(); renderer.render(scene, camera); return true; }
  renderer.setRenderTarget(rtColor); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, camera);
  const fog = scene.fog; scene.fog = null; const sm = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false; renderer.shadowMap.autoUpdate = false;
  swapForNd(true); renderer.setRenderTarget(rtNd); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, camera); swapForNd(false);
  scene.fog = fog; renderer.shadowMap.enabled = sm; renderer.shadowMap.autoUpdate = true;
  const D = R.dof || { focus: 10, cinf: 0 };
  inkU.flash.value = Cm.flash || 0; inkU.fade.value = Cm.fade || 0;
  if (inkU.bloom.value > 0) {
    renderer.setRenderTarget(rtB1); renderer.render(brightScene, fsCam);
    for (let i = 0; i < 2; i++) { blurU.src.value = rtB1.texture; blurU.dir.value.set(1 / 270, 0); renderer.setRenderTarget(rtB2); renderer.render(blurScene, fsCam);
      blurU.src.value = rtB2.texture; blurU.dir.value.set(0, 1 / 480); renderer.setRenderTarget(rtB1); renderer.render(blurScene, fsCam); }
  }
  renderer.setRenderTarget(rtInk); renderer.render(inkScene, fsCam);
  dofU.focus.value = D.focus; dofU.cinf.value = D.cinf; dofU.near.value = D.near ?? 1;
  renderer.setRenderTarget(null); renderer.render(dofScene, fsCam);
  return true;
};
window.TOTAL = S.TOTAL;
window.ready = true;
