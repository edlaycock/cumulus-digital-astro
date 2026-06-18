import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    stars: 5,
    quote: "Cumulus completely transformed how we look online. The new brand and website have made a real difference to how clients perceive us — and the enquiries have followed.",
    name: "James M.",
    company: "CEO, Surrey Professional Services",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&auto=format&fit=crop&q=80",
  },
  {
    stars: 5,
    quote: "Their travel industry knowledge is a genuine advantage. They understood what our customers needed before we'd even finished explaining it — and delivered an SEO strategy that continues to drive bookings.",
    name: "Sarah K.",
    company: "MD, UK Tour Operator",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=88&auto=format&fit=crop&q=80",
  },
  {
    stars: 5,
    quote: "Professional, responsive, and technically excellent. The website they built for us is fast, clean, and exactly what we asked for — actually delivered on time.",
    name: "Rachel T.",
    company: "Director, Membership Organisation",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&auto=format&fit=crop&q=80",
  },
  {
    stars: 5,
    quote: "We'd worked with two agencies before Cumulus. Night and day difference. They gave us real strategic input, not just execution. The results speak for themselves.",
    name: "Daniel F.",
    company: "Founder, B2B SaaS Start-up",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=88&auto=format&fit=crop&q=80",
  },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const go = (next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  const prev = () => {
    setDir(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDir(1);
    setIndex((i) => (i + 1) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <div className="testi-carousel">
      <div className="testi-carousel-stage">
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
            <div className="testi-stars" aria-label={`${t.stars} stars`}>
              {"★".repeat(t.stars)}
            </div>
            <blockquote className="testi-carousel-quote">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="testi-carousel-author">
              <img
                className="testi-avatar"
                src={t.avatar}
                alt={t.name}
                loading="lazy"
              />
              <div className="testi-meta">
                <strong>{t.name}</strong>
                <span>{t.company}</span>
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
          {testimonials.map((_, i) => (
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
