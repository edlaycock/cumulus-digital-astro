import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  useScroll,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Adapted from 21st.dev's PerspectiveTunnelHero. The 3D corridor, golden-angle
// card layout and pointer parallax are kept; the Tailwind classes become a
// .ptn-* block in global.css, the indigo/dark chrome becomes the site's light
// canvas and cyan accent, and the images are our real client builds.
//
// One deliberate mechanical change: the original captured the mouse wheel
// inside a fixed viewport (trapping the page once the tunnel ended, and doing
// nothing at all on touch). Here the tunnel is driven by ordinary page scroll
// through a tall sticky track — same journey, no hijack, works everywhere.

export interface TunnelCard {
  src: string;
  title: string;
}

interface Props {
  cards: TunnelCard[];
  tagline: string;
  /** heading, with the serif-accent phrase wrapped in <em> by the caller */
  titleHtml: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
}

interface CardLayout {
  card: TunnelCard;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const layoutCards = (cards: TunnelCard[]): CardLayout[] =>
  cards.map((card, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    return {
      card,
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX: 0.28 + (i % 3) * 0.08,
      radiusFactorY: 0.26 + (i % 2) * 0.09,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });

const SPRING = { stiffness: 60, damping: 25, mass: 0.5 };

interface Stage {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function Card({
  layout, progress, pointer, total, stage, frozen,
}: {
  layout: CardLayout;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: Stage;
  frozen: boolean;
}) {
  const staggerSpan = 0.55;
  const start = (layout.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);
  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(104, Math.min(140, stage.width * 0.32))
    : Math.max(150, Math.min(205, stage.width * 0.14));

  const baseX = layout.angleCos * (stage.width * layout.radiusFactorX);
  const baseY = layout.angleSin * (stage.height * layout.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${layout.rotationZ}deg)`;
    }
  );

  // reduced motion: a still constellation at mid-depth, nothing moves
  const frozenTransform = `translate3d(calc(-50% + ${baseX * 0.8}px), calc(-50% + ${baseY * 0.8}px), ${stage.isMobile ? -300 : -420}px) rotateZ(${layout.rotationZ}deg)`;

  return (
    <motion.div
      className="ptn-card"
      style={
        frozen
          ? { width: cardWidth, transform: frozenTransform, opacity: 1, zIndex: layout.index + 1 }
          : { width: cardWidth, transform, opacity, zIndex: layout.index + 1 }
      }
    >
      <div className="iphone">
        <div className="iphone-screen">
          <img src={layout.card.src} alt={`${layout.card.title} website built by Cumulus Digital`} draggable={false} loading="eager" />
          <span className="ptn-card-label">{layout.card.title}</span>
        </div>
        <span className="iphone-frame" aria-hidden="true" />
      </div>
    </motion.div>
  );
}

export function PerspectiveTunnelHero({
  cards, tagline, titleHtml, description, ctaText, ctaHref, secondaryText, secondaryHref,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Not framer's useReducedMotion: that is true on the very first client
  // render, which mismatches the server HTML — and React keeps mismatched
  // server attributes silently, so the frozen class would never be written.
  // Starting false (matching the server) and flipping in an effect makes the
  // change an ordinary update that React actually applies.
  const [frozen, setFrozen] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setFrozen(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const [stage, setStage] = useState<Stage>({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const update = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // the tunnel rides ordinary page scroll through the tall track
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  const pointer = useCameraParallax(!frozen);

  const titleScale = useTransform(progress, [0, 0.5, 1], [0.82, 1, 1.18]);
  const titleOpacity = useTransform(progress, [0, 0.12, 0.8, 0.97], [1, 1, 1, 0]);

  const layouts = layoutCards(cards);

  return (
    <div ref={trackRef} className={`ptn${frozen ? ' ptn--still' : ''}`}>
      <div className="ptn-stage" style={{ perspective: stage.isMobile ? '900px' : '1200px' }}>
        <div className="ptn-dots" aria-hidden="true" />
        <div className="ptn-glow" aria-hidden="true" />
        <div className="ptn-ring ptn-ring--inner" aria-hidden="true" />
        <div className="ptn-ring ptn-ring--outer" aria-hidden="true" />

        <motion.div
          className="ptn-center"
          style={frozen ? undefined : { scale: titleScale, opacity: titleOpacity }}
        >
          <p className="eyebrow"><span className="eyebrow-dot"></span>{tagline}</p>
          <h1 className="ptn-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
          <p className="ptn-lede">{description}</p>
          <div className="ptn-actions">
            <a className="btn btn--primary btn--lg" href={ctaHref} data-magnetic>{ctaText}</a>
            {secondaryText && (
              <a className="btn btn--outline btn--lg" href={secondaryHref ?? '/services/'}>{secondaryText}</a>
            )}
          </div>
        </motion.div>

        <div className="ptn-space" aria-label="Websites we have designed and built">
          {layouts.map((l) => (
            <Card
              key={l.index}
              layout={l}
              progress={progress}
              pointer={pointer}
              total={layouts.length}
              stage={stage}
              frozen={frozen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
