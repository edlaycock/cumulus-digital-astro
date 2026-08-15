import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface MarqueeShot {
  src: string;
  alt: string;
}

interface Props {
  images: MarqueeShot[];
  className?: string;
  label?: string;
}

/** The scrolling strip of real client sites, on its own so it can sit inside
 *  the marquee hero or stand alone as a band under a different hero. */
export const ScreenshotMarquee: React.FC<Props> = ({
  images,
  className,
  label = 'Websites we have designed',
}) => {
  const reduce = useReducedMotion();
  // duplicated so the strip can loop seamlessly
  const strip = [...images, ...images];

  return (
    <div className={cn('amh-marquee', className)} aria-label={label}>
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
  );
};
