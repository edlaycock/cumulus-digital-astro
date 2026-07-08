// Site-wide micro-interactions. Everything here is progressive enhancement:
// it no-ops under reduced-motion or when the target elements are absent.

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---- scroll progress bar ---- */
(() => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.transform = `scaleX(${pct / 100})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- cursor accent dot ---- */
(() => {
  if (reduced || !finePointer) return;
  const dot = document.getElementById('cursor-dot');
  if (!dot) return;
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  const hoverables = 'a, button, [data-magnetic], input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) dot.classList.add('cursor-dot--active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) dot.classList.remove('cursor-dot--active');
  });
  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  document.body.classList.add('has-cursor-dot');
})();

/* ---- magnetic buttons ---- */
(() => {
  if (reduced || !finePointer) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ---- animated counters ---- */
(() => {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  if (reduced) {
    els.forEach((el) => { el.textContent = el.dataset.count; });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    }
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
})();
