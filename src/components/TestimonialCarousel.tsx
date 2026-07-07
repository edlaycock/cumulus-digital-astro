import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
  quote: string;
  attribution: string;
}

export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  const prev = () => {
    setDir(-1);
    setIndex((i) => (i - 1 + items.length) % items.length);
  };

  const next = () => {
    setDir(1);
    setIndex((i) => (i + 1) % items.length);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const t = items[index];

  return (
    <div className="testi-carousel" onKeyDown={onKeyDown}>
      <div className="testi-carousel-stage" aria-live="polite">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            className="testi-carousel-card"
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="testi-mark" aria-hidden="true">&ldquo;</div>
            <blockquote className="testi-carousel-quote">
              {t.quote}
            </blockquote>
            <div className="testi-carousel-author">
              <div className="testi-meta">
                <strong>{t.attribution}</strong>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="testi-carousel-controls">
        <button className="testi-arrow" onClick={prev} aria-label="Previous testimonial">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="testi-dots" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              className={`testi-dot${i === index ? " testi-dot--active" : ""}`}
              onClick={() => go(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              role="tab"
              aria-selected={i === index}
            />
          ))}
        </div>

        <button className="testi-arrow" onClick={next} aria-label="Next testimonial">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
