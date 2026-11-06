import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// A mock Google local pack in which "Your business" climbs from the bottom
// to the top spot as its stars fill — the SEO page's promise as a picture.
// Server-render shows the finished state (your business first); the climb
// replays once in the browser when scrolled into view. Competitors are
// deliberately generic.

type Entry = { id: string; name: string; stars: number; you?: boolean };

const FINAL: Entry[] = [
  { id: 'you', name: 'Your business', stars: 5, you: true },
  { id: 'a', name: 'A. N. Other Services Ltd', stars: 4 },
  { id: 'b', name: 'Example & Sons', stars: 4 },
  { id: 'c', name: 'Somebody Else Ltd', stars: 3 },
];

const START: Entry[] = [FINAL[1], FINAL[2], FINAL[3], { ...FINAL[0], stars: 3 }];

export const MapPackRise: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>(FINAL); // SSR: final state
  const armed = useRef(false);

  useEffect(() => {
    if (reduce || armed.current || !ref.current) return;
    armed.current = true;
    setEntries(START);
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // climb one place at a time, then fill the stars
        const order = [
          [START[0], START[1], { ...FINAL[0], stars: 4 }, START[2]],
          [START[0], { ...FINAL[0], stars: 4 }, START[1], START[2]],
          [{ ...FINAL[0], stars: 5 }, START[0], START[1], START[2]],
        ] as Entry[][];
        order.forEach((state, i) =>
          window.setTimeout(() => setEntries(state), 900 + i * 850)
        );
      },
      { threshold: 0.45 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div className="mpr" ref={ref} role="img" aria-label="Illustration: a Google map-pack listing in which your business climbs from fourth place to the top spot as its reviews build.">
      <div className="mpr-head" aria-hidden="true">
        <span className="mpr-pin" />
        <span>Local results</span>
      </div>
      <div className="mpr-list" aria-hidden="true">
        {entries.map((e, i) => (
          <motion.div
            layout
            key={e.id}
            className={`mpr-row${e.you ? ' mpr-row--you' : ''}`}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <span className="mpr-rank">{i + 1}</span>
            <span className="mpr-name">{e.name}</span>
            <span className="mpr-stars">
              {[0, 1, 2, 3, 4].map((s) => (
                <span key={s} className={`mpr-star${s < e.stars ? ' mpr-star--on' : ''}`}>★</span>
              ))}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mpr-note">The map pack wins the “near me” searches — and it can be climbed deliberately.</p>
    </div>
  );
};
