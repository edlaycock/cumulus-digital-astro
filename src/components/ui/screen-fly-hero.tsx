import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { GlassFold } from './glass-fold';

// Web design hero: client sites in browser frames rise from a perspective
// grid floor and fly past the camera as the page scrolls through a tall
// sticky track. Ordinary page scroll drives it, so nothing is hijacked.

export interface FlyScreen {
  src: string;
  alt: string;
  domain: string;
}

interface Props {
  screens: FlyScreen[];
  tagline: string;
  titleHtml: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
}

interface Stage {
  w: number;
  h: number;
  mobile: boolean;
}

const TRAVEL = 7600;
const FAR = -3900;
const SPRING = { stiffness: 90, damping: 28, restDelta: 0.0001 };

// lanes alternate either side of the vanishing point, a few hug the centre
const LANES = [0.22, -0.26, 0.62, -0.7, 0.05, 0.95, -1.05, 0.4, -0.45, 1.2, -0.12, -1.3, 0.75];
const LIFTS = [0, 40, 90, 20, 140, 10, 60, 110, 30, 70, 160, 0, 50];

function Screen({
  s, i, count, cam, stage,
}: {
  s: FlyScreen;
  i: number;
  count: number;
  cam: MotionValue<number>;
  stage: Stage;
}) {
  const width = stage.mobile ? Math.min(190, stage.w * 0.5) : Math.min(340, stage.w * 0.24);
  const height = width * 0.68;
  const spread = stage.mobile ? stage.w * 0.6 : Math.min(stage.w * 0.5, 760);
  const floorY = stage.mobile ? stage.h * 0.24 : stage.h * 0.34;
  // the first two start far off as specks on the horizon, the rest queue behind
  const startZ = -2500 - i * ((TRAVEL - 300) / count);
  const x = LANES[i % LANES.length] * spread;
  const y = floorY - height - LIFTS[i % LIFTS.length] * (stage.mobile ? 0.5 : 1);
  const turn = -LANES[i % LANES.length] * 14;

  const z = useTransform(cam, (c) => startZ + c);
  const opacity = useTransform(z, [FAR, FAR + 900, 250, 650], [0, 1, 1, 0]);
  const transform = useTransform(
    z,
    (zz) => `translate3d(${x - width / 2}px, ${y}px, ${zz}px) rotateY(${turn}deg)`
  );

  return (
    <motion.figure className="sfh-screen" style={{ width, transform, opacity }}>
      <div className="sfh-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{s.domain}</span>
      </div>
      <img
        src={s.src}
        alt={s.alt}
        width={680}
        height={425}
        draggable={false}
        decoding="async"
        {...(i < 3 ? { fetchPriority: 'high' as const } : { loading: 'eager' as const })}
      />
    </motion.figure>
  );
}

export function ScreenFlyHero({
  screens, tagline, titleHtml, description, ctaText, ctaHref, secondaryText, secondaryHref,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);
  const [stage, setStage] = useState<Stage>({ w: 1440, h: 900, mobile: false });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    const size = () =>
      setStage({ w: window.innerWidth, h: window.innerHeight, mobile: window.innerWidth < 768 });
    size();
    window.addEventListener('resize', size);
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('resize', size);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, SPRING);

  // on first paint the screens glide up from the horizon before scroll takes over
  const intro = useMotionValue(0);
  useEffect(() => {
    if (still) {
      intro.set(1);
      return;
    }
    const a = animate(intro, 1, { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 });
    return () => a.stop();
  }, [still, intro]);

  const cam = useTransform([progress, intro], ([p, k]: number[]) =>
    still ? TRAVEL * 0.3 : p * TRAVEL - (1 - k) * 1400
  );
  const gridShift = useTransform(cam, (c) => `0px ${-(c % 120)}px`);
  const copyY = useTransform(progress, [0, 1], [0, -60]);

  const shown = stage.mobile ? screens.slice(0, 9) : screens;

  return (
    <div ref={trackRef} className={`sfh${still ? ' sfh--still' : ''}`}>
      <div className="sfh-stage">
        <div className="page-hero-bg" aria-hidden="true">
          <GlassFold />
        </div>
        <div className="sfh-world">
          <motion.div
            className="sfh-floor"
            aria-hidden="true"
            style={{
              backgroundPosition: gridShift,
              transform: `translateY(${stage.mobile ? stage.h * 0.24 : stage.h * 0.34}px) translateZ(800px) rotateX(-90deg)`,
            }}
          />
          <div className="sfh-horizon" aria-hidden="true" />
          {shown.map((s, i) => (
            <Screen key={s.src} s={s} i={i} count={shown.length} cam={cam} stage={stage} />
          ))}
        </div>

        <motion.div className="sfh-copy" style={still ? undefined : { y: copyY }}>
          <p className="eyebrow"><span className="eyebrow-dot" />{tagline}</p>
          <h1 className="sfh-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
          <p className="sfh-lede">{description}</p>
          <div className="sfh-actions">
            <a className="btn btn--primary btn--lg" href={ctaHref} data-magnetic>{ctaText}</a>
            {secondaryText && secondaryHref && (
              <a className="btn btn--outline btn--lg" href={secondaryHref}>{secondaryText}</a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
