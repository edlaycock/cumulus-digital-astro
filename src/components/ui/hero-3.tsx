import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface MarqueeShot {
  src: string;
  alt: string;
}

interface AnimatedMarqueeHeroProps {
  tagline: string;
  /** plain string so it can be passed from an .astro template (no JSX there) */
  title: string;
  /** word within the title to highlight in the accent colour */
  accent?: string;
  description: string;
  ctaText: string;
  ctaHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  images: MarqueeShot[];
  className?: string;
}

const FADE = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
} as const;

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  accent,
  description,
  ctaText,
  ctaHref = '/contact/',
  secondaryText,
  secondaryHref,
  images,
  className,
}) => {
  const reduce = useReducedMotion();
  // duplicated so the strip can loop seamlessly
  const strip = [...images, ...images];

  return (
    <section className={cn('amh', className)} data-light-hero>
      <div className="amh-copy">
        <motion.div initial="hidden" animate="show" variants={FADE} className="amh-tag">
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="amh-title"
        >
          {title.split(' ').map((word, i) => {
            const isAccent = accent && word.replace(/[^\w']/g, '') === accent;
            return (
              <motion.span key={i} variants={FADE} className="amh-word">
                {isAccent ? <em>{word}</em> : word}&nbsp;
              </motion.span>
            );
          })}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE}
          transition={{ delay: 0.45 }}
          className="amh-desc"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE}
          transition={{ delay: 0.55 }}
          className="amh-actions"
        >
          <motion.a
            href={ctaHref}
            className="btn btn--primary btn--lg"
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            {ctaText}
          </motion.a>
          {secondaryText && (
            <a href={secondaryHref ?? '/work/'} className="btn btn--outline btn--lg">
              {secondaryText}
            </a>
          )}
        </motion.div>
      </div>

      {/* real client sites, scrolling */}
      <div className="amh-marquee" aria-label="Websites we have designed">
        <motion.div
          className="amh-track"
          animate={reduce ? undefined : { x: ['-50%', '0%'] }}
          transition={reduce ? undefined : { ease: 'linear', duration: 55, repeat: Infinity }}
        >
          {strip.map((shot, i) => (
            <figure key={i} className="amh-shot" style={{ rotate: `${i % 2 === 0 ? -2 : 2.5}deg` }}>
              {/* eager: a lazy tile in a scrolling strip pops in blank as it arrives */}
              <img src={shot.src} alt={shot.alt} loading="eager" />
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
