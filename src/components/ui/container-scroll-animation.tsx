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
  children: React.ReactNode;
}

export const ContainerScroll: React.FC<Props> = ({ titleComponent, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
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
    <div className="cs" ref={containerRef}>
      <div className="cs-inner">
        <motion.div className="cs-header" style={reduce ? undefined : { translateY: translate }}>
          {titleComponent}
        </motion.div>

        <motion.div
          className="cs-card"
          style={reduce ? undefined : { rotateX: rotate, scale }}
        >
          <div className="cs-screen">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};
