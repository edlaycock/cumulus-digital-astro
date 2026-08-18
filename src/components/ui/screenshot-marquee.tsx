import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface MarqueeShot {
  src: string;
  alt: string;
  /** when set, the shot is dressed in a device frame rather than a plain tile */
  kind?: 'desktop' | 'mobile';
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
        {strip.map((shot, i) => {
          // Plain tiles read better with a little wobble; device frames do
          // not — a tilted laptop looks broken, not casual.
          const tilt = shot.kind ? '0deg' : `${i % 2 === 0 ? -2 : 2.5}deg`;
          // eager: a lazy tile in a scrolling strip pops in blank as it arrives
          const img = <img src={shot.src} alt={shot.alt} loading="eager" />;

          if (shot.kind === 'mobile') {
            return (
              <figure key={i} className="amh-dev amh-dev--phone" style={{ rotate: tilt }}>
                <span className="amh-notch" aria-hidden="true" />
                <span className="amh-dev-screen">{img}</span>
              </figure>
            );
          }

          if (shot.kind === 'desktop') {
            return (
              <figure key={i} className="amh-dev amh-dev--mac" style={{ rotate: tilt }}>
                <span className="amh-dev-screen">{img}</span>
                <span className="amh-dev-base" aria-hidden="true" />
              </figure>
            );
          }

          return (
            <figure key={i} className="amh-shot" style={{ rotate: tilt }}>
              {img}
            </figure>
          );
        })}
      </motion.div>
    </div>
  );
};
