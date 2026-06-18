/**
 * WebGL Aurora Mesh hero — Cumulus Digital.
 * Runs the Aurora fragment shader on a full-screen quad behind the hero section.
 * Respects prefers-reduced-motion by freezing at a beautiful static frame.
 */
import { VERT, PRELUDE, VARIANTS } from './shaders.js';

const canvas = document.getElementById('hero-canvas');
if (canvas) init(canvas);

function init(canvas) {
  const gl =
    canvas.getContext('webgl', { antialias: false, alpha: false }) ||
    canvas.getContext('experimental-webgl');

  if (!gl) {
    canvas.style.background =
      'radial-gradient(120% 90% at 75% 15%, #4fc5d5 0%, #141b38 45%, #070a14 100%)';
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const aurora = VARIANTS[0]; // Aurora Mesh is the chosen direction

  // Full-screen quad
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  // Compile program
  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, PRELUDE + aurora.frag);
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Hero shader link error:', gl.getProgramInfoLog(program));
    return;
  }
  const loc = {
    a_pos:        gl.getAttribLocation(program,  'a_pos'),
    u_resolution: gl.getUniformLocation(program, 'u_resolution'),
    u_time:       gl.getUniformLocation(program, 'u_time'),
    u_mouse:      gl.getUniformLocation(program, 'u_mouse'),
  };

  // Resize
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Smooth mouse parallax
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1 - e.clientY / window.innerHeight;
  }, { passive: true });

  const start = performance.now();

  function frame(now) {
    const time = (now - start) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(loc.a_pos);
    gl.vertexAttribPointer(loc.a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(loc.u_resolution, canvas.width, canvas.height);
    gl.uniform1f(loc.u_time, reduceMotion ? 10.0 : time);
    gl.uniform2f(loc.u_mouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!reduceMotion) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
  }
  return shader;
}
