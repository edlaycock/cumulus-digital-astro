import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, useReducedMotion, type MotionValue } from 'framer-motion';

// Adapted from Aceternity's ContainerScroll. The behaviour is unchanged —
// the screen starts tilted back and lies flat as you scroll, while the
// heading drifts up — but the Tailwind classes become a .cs-* block in
// global.css, and the dark #222 chrome is swapped for the black-bordered
// device frame the rest of this site uses.

interface Props {
  /** heading block, passed from the .astro page as a named slot */
  titleComponent: React.ReactNode;
  /** the screen. Omit for a type-only reveal with no device. */
  children?: React.ReactNode;
  /** extra class on the track, e.g. cs--device to match the frame to the capture */
  className?: string;
  /**
   * Drive the motion from the section crossing the viewport rather than from
   * scrolling through a tall track. Needed when there is no device, because
   * the short track leaves the default offset with no range to animate over.
   */
  parallax?: boolean;
}

export const ContainerScroll: React.FC<Props> = ({
  titleComponent, children, className, parallax,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: parallax ? ['start start', 'end start'] : ['start start', 'end end'],
  });
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.8, 0.95] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className={className ? `cs ${className}` : 'cs'} ref={containerRef}>
      <div className="cs-inner">
        <motion.div className="cs-header" style={reduce ? undefined : { translateY: translate }}>
          {titleComponent}
        </motion.div>

        {children && (
          <motion.div
            className="cs-card"
            style={reduce ? undefined : { rotateX: rotate, scale }}
          >
            <div className="cs-screen">{children}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
