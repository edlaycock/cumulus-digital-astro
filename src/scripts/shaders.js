/**
 * Cumulus Digital — animated shader hero backgrounds.
 *
 * Six WebGL1 (GLSL ES 1.00) fragment programs, all painted in the Cumulus
 * brand palette: deep navy #141b38, cyan #4fc5d5, light cyan #8fe3ee.
 *
 * Each VARIANT supplies only a `main()`. It is concatenated onto PRELUDE,
 * which declares the uniforms, brand colour constants, and the shared
 * noise toolkit (Ashima simplex noise + fBm + a cheap hash for grain).
 */

export const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const PRELUDE = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
varying vec2  v_uv;

/* --- Cumulus brand palette (linear-ish sRGB) --- */
const vec3 INK    = vec3(0.027, 0.035, 0.078); // #070a14 near-black sky
const vec3 NAVY   = vec3(0.043, 0.063, 0.149); // #0b1026 deep brand navy
const vec3 NAVY2  = vec3(0.078, 0.106, 0.220); // #141b38 brand navy
const vec3 CYAN   = vec3(0.310, 0.773, 0.835); // #4fc5d5 brand cyan
const vec3 CYAN2  = vec3(0.561, 0.890, 0.933); // #8fe3ee light cyan
const vec3 VIOLET = vec3(0.380, 0.340, 0.680); // depth accent

/* --- cheap hash for film grain --- */
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* --- Ashima 2D simplex noise --- */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* fractal Brownian motion, ~[-1, 1] */
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) {
    s += a * snoise(p);
    p = p * 2.02 + 11.3;
    a *= 0.5;
  }
  return s;
}

/* shared finishing pass: film grain + soft vignette */
vec3 finish(vec3 col) {
  float gr = (hash12(gl_FragCoord.xy + u_time * 60.0) - 0.5) * 0.045;
  col += gr;
  vec2 vc = v_uv - 0.5;
  col *= 1.0 - dot(vc, vc) * 0.55;
  return max(col, 0.0);
}
`;

/* ---------------------------------------------------------------- */
/* Each variant defines only main(). PRELUDE is prepended at build. */
/* ---------------------------------------------------------------- */

const AURORA_MESH = `
void main() {
  vec2 uv = v_uv;
  float a = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5); p.x *= a;
  float t = u_time * 0.06;
  vec2 mo = (u_mouse - 0.5) * 0.30;
  float n1 = fbm(p * 1.6 + vec2(t, -t * 0.6) + mo);
  float n2 = fbm(p * 2.7 - vec2(t * 0.7, t * 0.4) + n1 * 0.6);
  vec3 col = mix(INK, NAVY2, smoothstep(-0.6, 0.85, uv.y));
  col = mix(col, CYAN,   smoothstep(-0.20, 0.90, n1));
  col = mix(col, VIOLET, smoothstep( 0.10, 1.10, n2) * 0.45);
  col = mix(col, CYAN2,  pow(max(n1, 0.0), 3.0) * 0.55);
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

const LIQUID_WAVES = `
void main() {
  vec2 uv = v_uv;
  float t = u_time * 0.18;
  float warp  = fbm(uv * 2.5 + vec2(t * 0.5, 0.0));
  float w     = sin(uv.x * 5.0 + warp * 2.2 + t);
  float bands = sin((uv.y * 7.0 + w * 0.9 - t * 1.2) * 1.4);
  float m = bands * 0.5 + 0.5;
  vec3 col = mix(NAVY, CYAN, smoothstep(0.15, 0.85, m));
  col = mix(col, CYAN2, pow(m, 5.0));
  col = mix(col, VIOLET * 0.7, (1.0 - m) * 0.25);
  col = mix(col, INK, smoothstep(0.0, 0.45, 1.0 - uv.y) * 0.30);
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

const CUMULUS_CLOUDS = `
void main() {
  vec2 uv = v_uv;
  float a = u_resolution.x / u_resolution.y;
  vec2 p = uv; p.x *= a;
  float t = u_time * 0.025;
  vec2 q = p * 2.2;
  float warp   = fbm(q + vec2(t * 2.0, t * 0.4));
  float clouds = fbm(q + warp * 1.6 + vec2(-t * 1.6, t * 0.2));
  clouds = smoothstep(-0.20, 0.85, clouds);
  vec3 sky = mix(INK, NAVY2, smoothstep(-0.2, 1.0, uv.y));
  vec3 cc  = mix(NAVY2, CYAN, clouds);
  cc = mix(cc, CYAN2, pow(clouds, 3.0) * 0.9);
  vec3 col = mix(sky, cc, clouds * 0.92);
  float glow = exp(-length(p - vec2(a * 0.80, 0.85)) * 1.6);
  col += CYAN2 * glow * 0.25;
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

const NEBULA_DRIFT = `
void main() {
  vec2 uv = v_uv;
  float a = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5); p.x *= a;
  float t = u_time * 0.04;
  float neb = fbm(p * 3.0 + vec2(t, -t * 0.7));
  neb = pow(neb * 0.5 + 0.5, 2.0);
  vec3 col = mix(INK, NAVY, 1.0 - length(p) * 0.8);
  col += CYAN   * neb * 0.7;
  col += VIOLET * pow(neb, 2.0) * 0.5;
  /* twinkling stars on a fixed grid */
  vec2 sg = floor(uv * vec2(a, 1.0) * 140.0);
  float h = hash12(sg);
  float star = smoothstep(0.992, 1.0, h);
  float tw = 0.6 + 0.4 * sin(u_time * 3.0 + h * 30.0);
  col += vec3(0.80, 0.95, 1.0) * star * tw;
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

const PLASMA_WARP = `
void main() {
  vec2 uv = v_uv;
  float a = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(a, 1.0) * 2.0;
  float t = u_time * 0.06;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(p + 4.0 * q + vec2(8.3, 2.8)));
  float f = fbm(p + 4.0 * r);
  vec3 col = mix(NAVY, CYAN, clamp(f * 0.5 + 0.5, 0.0, 1.0));
  col = mix(col, VIOLET, clamp(length(q), 0.0, 1.0) * 0.50);
  col = mix(col, CYAN2,  clamp(r.x, 0.0, 1.0) * 0.35);
  col = mix(col, INK,    clamp(length(r) - 0.4, 0.0, 1.0) * 0.40);
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

const LIGHT_BEAMS = `
void main() {
  vec2 uv = v_uv;
  float a = u_resolution.x / u_resolution.y;
  vec2 p = vec2((uv.x - 0.5) * a, uv.y);
  float t = u_time * 0.12;
  vec2 c = p - vec2(0.15, 1.25);
  float ang  = atan(c.x, -c.y);
  float rays = 0.5 + 0.5 * sin(ang * 13.0 + t * 2.0 + fbm(p * 3.0 + t) * 2.5);
  rays *= smoothstep(1.4, 0.0, length(c));
  vec3 col = mix(INK, NAVY2, smoothstep(0.0, 1.0, uv.y));
  col += CYAN  * rays * 0.55;
  col += CYAN2 * pow(rays, 3.0) * 0.35;
  col = mix(col, VIOLET * 0.5, (1.0 - uv.y) * 0.15);
  gl_FragColor = vec4(finish(col), 1.0);
}
`;

export const VARIANTS = [
  { id: 'aurora',  name: 'Aurora Mesh',     blurb: 'Flowing mesh gradient — the reference look, in brand colours.', frag: AURORA_MESH },
  { id: 'waves',   name: 'Liquid Waves',    blurb: 'Silky sine-warped bands with a metallic sheen.',                frag: LIQUID_WAVES },
  { id: 'clouds',  name: 'Cumulus Clouds',  blurb: 'Drifting fractal clouds — the literal brand metaphor.',         frag: CUMULUS_CLOUDS },
  { id: 'nebula',  name: 'Nebula Drift',    blurb: 'Deep-space dust with twinkling stars.',                         frag: NEBULA_DRIFT },
  { id: 'plasma',  name: 'Plasma Warp',     blurb: 'Organic domain-warped plasma, slow and hypnotic.',              frag: PLASMA_WARP },
  { id: 'beams',   name: 'Light Beams',     blurb: 'Minimal scanning god-rays — the calmest option.',               frag: LIGHT_BEAMS },
];
