// Scroll-reveal for [data-reveal] elements. CSS handles the transition;
// under prefers-reduced-motion the CSS never hides elements, so no JS needed.
const els = document.querySelectorAll('[data-reveal]');

if (els.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
  );
  els.forEach((el) => io.observe(el));
} else {
  els.forEach((el) => el.classList.add('is-visible'));
}
