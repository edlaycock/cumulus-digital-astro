import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

// Fade-up for [data-fade] children, applied only after hydration and only to
// blocks still below the fold, so the server HTML never depends on JS to show.
export function useFadeIn<T extends HTMLElement>() {
  const root = useRef<T>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const els = [...root.current.querySelectorAll<HTMLElement>('[data-fade]')].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    );
    if (!els.length) return;
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          animate(
            el,
            { opacity: 1, transform: 'translateY(0px)' },
            { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: Number(el.dataset.fade) || 0 }
          );
        }),
      { rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      els.forEach((el) => {
        el.style.opacity = '';
        el.style.transform = '';
      });
    };
  }, [reduce]);

  return root;
}
