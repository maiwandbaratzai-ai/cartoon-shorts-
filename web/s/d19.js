// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Small shared helpers for the 2026-11-19 stories: a shot runner with whip-pans + push-ins, acting rigs, word cards.
import * as X from './kit3d.js';
import { blinkAt, clamp, lerp } from '../motion.js';
export { clamp, lerp };
export const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const rotY = (pos, look, ang) => { const dx = look[0] - pos[0], dz = look[2] - pos[2], c = Math.cos(ang), s = Math.sin(ang); return [pos[0] + dx * c - dz * s, look[1], pos[2] + dx * s + dz * c]; };

// shots: [[startFrame, (u, f) => ({ pos, look, fov, dof?, light? }), { whip }]] — whip = whip-pan INTO this shot.
// Returns { cam, dof, id, u }. Every shot gets a gentle push-in unless it sets noPush.
export function runShots(S, f, TOTAL) {
  let i = 0; while (i + 1 < S.length && f >= S[i + 1][0]) i++;
  const a = S[i][0], b = i + 1 < S.length ? S[i + 1][0] : TOTAL, u = clamp((f - a) / Math.max(1, b - a), 0, 1);
  const c = S[i][1](u, f); const cam = { pos: c.pos, look: c.look, fov: c.fov ?? 40, roll: c.roll || 0 };
  if (!c.noPush) cam.fov *= 1 - 0.08 * u;
  const nxt = S[i + 1];
  if (nxt && nxt[2] && nxt[2].whip && f > b - 6) { const w = (f - (b - 6)) / 6; cam.look = rotY(cam.pos, cam.look, -0.8 * w * w); cam.roll -= 7 * w; }
  if (S[i][2] && S[i][2].whip && f < a + 4) { const w = 1 - (f - a) / 4; cam.look = rotY(cam.pos, cam.look, 0.6 * w * w); cam.roll += 6 * w; }
  const d = Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]);
  const dof = c.dof || { focus: c.focus ?? d, cinf: c.cinf ?? 12 };
  cam.shadowAt = c.shadowAt || cam.look;
  return { cam, dof, id: i, u, light: c.light };
}
// drive a K.stick rig with acting keys
export function act(K, rig, f, keys, seed, pos) {
  const A = K.T.act(f, keys, { seed, blink: blinkAt(f, seed) });
  rig.set(A, pos); return A;
}
export const card = (out, f, f0, txt, cam, col = '#f6c83a', size = 170, dur = 45, uy = 0.5) => { const c = X.wordCard(f, f0, txt, cam, col, dur, size, uy, 1.4); if (c) out.push(c); };
export const init = (K) => X.init(K);
export const txtTex = (...a) => X.txtTex(...a);
export const sign = (...a) => X.sign(...a);
// rhythmic keys: alternate two poses every n frames from f0 to f1
export const pump = (f0, f1, n, A, B) => { const k = []; for (let t = f0, j = 0; t < f1; t += n, j++) k.push([t, ...(j % 2 ? B : A)]); return k; };
