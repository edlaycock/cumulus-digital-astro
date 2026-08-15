import React, { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

// Adapted from Componentry's FlippingWordSwap. Two changes were needed:
// the project has no Tailwind, so the utility classes become a .fws-* block
// in global.css; and framer-motion is already bundled here, so the flip is
// driven by it rather than pulling in GSAP for one component.

const segmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function segmentCharacters(text: string): string[] {
  if (!segmenter) return Array.from(text);
  return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

export interface FlippingWordSwapProps {
  /** The word or short phrase shown at rest. */
  word1: string;
  /** The word or short phrase revealed on interaction. */
  word2: string;
  /** Duration of each character flip in milliseconds. */
  duration?: number;
  /** Delay between neighbouring character flips in milliseconds. */
  stagger?: number;
  className?: string;
}

export const FlippingWordSwap: React.FC<FlippingWordSwapProps> = ({
  word1,
  word2,
  duration = 400,
  stagger = 44,
  className,
}) => {
  const reduce = useReducedMotion();
  const swapped = useRef(false);
  const [isSwapped, setIsSwapped] = useState(false);

  const update = useCallback((next: boolean) => {
    swapped.current = next;
    setIsSwapped(next);
  }, []);

  const d = reduce ? 0 : Math.max(180, duration) / 1000;
  const s = reduce ? 0 : Math.max(0, stagger) / 1000;

  const chars1 = segmentCharacters(word1);
  const chars2 = segmentCharacters(word2);

  const layer = (
    chars: string[],
    which: 'first' | 'second',
  ) => (
    <span className="fws-layer" aria-hidden="true">
      {chars.map((ch, i) => {
        const out = which === 'first' ? isSwapped : !isSwapped;
        return (
          <motion.span
            key={`${which}-${i}-${ch}`}
            className="fws-char"
            style={{ transformOrigin: which === 'first' ? 'center top' : 'center bottom' }}
            initial={false}
            animate={{ rotateX: out ? (which === 'first' ? 82 : -82) : 0, opacity: out ? 0 : 1 }}
            transition={{
              duration: d,
              // the incoming word starts before the outgoing one has finished,
              // so the two reads overlap rather than leaving a blank frame
              delay: i * s + (which === 'second' && isSwapped ? d * 0.38 : 0),
              ease: which === 'first' ? 'easeIn' : 'easeOut',
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        );
      })}
    </span>
  );

  return (
    <button
      type="button"
      className={cn('fws', className)}
      aria-label={isSwapped ? word2 : word1}
      aria-pressed={isSwapped}
      onMouseEnter={() => update(true)}
      onMouseLeave={() => update(false)}
      onPointerUp={(e) => {
        if (e.pointerType !== 'mouse') update(!swapped.current);
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) update(true);
      }}
      onBlur={() => update(false)}
    >
      <span className="fws-stage">
        {layer(chars1, 'first')}
        {layer(chars2, 'second')}
      </span>
    </button>
  );
};
