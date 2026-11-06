import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// The "3 pages becomes 7" scoping insight, animated: the three pages
// everyone starts with, then the four that every growing site gains.
// Server-render shows all seven (the honest final state); in the browser
// the extra four spring in once the panel scrolls into view.

const CORE = ['Home', 'About', 'Contact'];
const GROWTH = ['Services', 'Our Work', 'Reviews', 'FAQs'];

export const PagesMultiply: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(true); // SSR: final state
  const armed = useRef(false);

  useEffect(() => {
    if (reduce || armed.current || !ref.current) return;
    armed.current = true;
    setGrown(false);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          window.setTimeout(() => setGrown(true), 500);
        }
      },
      { threshold: 0.45 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div className="pgm" ref={ref} role="img" aria-label="Illustration: a website that starts with three pages — home, about, contact — grows to seven or more, adding services, work, reviews and FAQs.">
      <div className="pgm-row" aria-hidden="true">
        <span className={`pgm-count${grown ? ' pgm-count--dim' : ''}`}>3 pages</span>
        <span className="pgm-arrow">→</span>
        <span className={`pgm-count pgm-count--glow${grown ? '' : ' pgm-count--dim'}`}>7+</span>
      </div>
      <div className="pgm-grid" aria-hidden="true">
        {CORE.map((p) => (
          <div key={p} className="pgm-card">
            <span className="pgm-card-bar" />
            <span className="pgm-card-label">{p}</span>
          </div>
        ))}
        {GROWTH.map((p, i) =>
          grown ? (
            <motion.div
              key={p}
              className="pgm-card pgm-card--new"
              initial={reduce ? false : { opacity: 0, scale: 0.6, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.14 }}
            >
              <span className="pgm-card-bar" />
              <span className="pgm-card-label">{p}</span>
            </motion.div>
          ) : (
            <div key={p} className="pgm-card pgm-card--ghost" />
          )
        )}
      </div>
      <p className="pgm-note">
        Every page is another thing your business can be found for.
      </p>
    </div>
  );
};
