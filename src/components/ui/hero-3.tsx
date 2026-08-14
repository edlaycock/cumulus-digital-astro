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
  /** word or phrase within the title to highlight in the accent colour */
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

  // The title animates word by word, so the accent phrase is matched as a run
  // of words rather than a substring.
  const bare = (w: string) => w.replace(/[^\w'&]/g, '');
  const words = title.split(' ');
  const accentWords = accent ? accent.split(' ').map(bare) : [];
  const accentStart = accentWords.length
    ? words.findIndex((_, i) =>
        accentWords.every((a, j) => words[i + j] !== undefined && bare(words[i + j]) === a)
      )
    : -1;

  return (
    <section className={cn('amh', className)}>
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
          {words.map((word, i) => {
            const isAccent =
              accentStart >= 0 && i >= accentStart && i < accentStart + accentWords.length;
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
