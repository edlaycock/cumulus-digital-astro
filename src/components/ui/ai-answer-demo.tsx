import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// A staged mock of an AI assistant answering a local question — the page's
// product, demonstrated. Server-render shows the finished answer (what
// crawlers read); in the browser it replays once as a typed sequence when
// scrolled into view, unless the visitor prefers reduced motion.
// The business named is fictional on purpose.

const QUESTION = 'Who should I use for an electrician in Woking?';

export const AiAnswerDemo: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // phase 5 = everything shown (SSR state). 0..4 = replay stages.
  const [phase, setPhase] = useState(5);
  const [typed, setTyped] = useState(QUESTION);
  const played = useRef(false);

  useEffect(() => {
    if (reduce || played.current || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || played.current) return;
        played.current = true;
        io.disconnect();
        setTyped('');
        setPhase(0);
        let i = 0;
        const type = window.setInterval(() => {
          i += 1;
          setTyped(QUESTION.slice(0, i));
          if (i >= QUESTION.length) {
            window.clearInterval(type);
            setPhase(1); // thinking
            window.setTimeout(() => setPhase(2), 900); // intro line
            window.setTimeout(() => setPhase(3), 1700); // recommendation card
            window.setTimeout(() => setPhase(4), 2600); // closing line
            window.setTimeout(() => setPhase(5), 3300); // citation chips
          }
        }, 28);
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  const show = (n: number) => (phase >= n ? ' aid-show' : '');

  return (
    <div className="aid" ref={ref} role="img" aria-label="Illustration: an AI assistant answering a local question by recommending a well-evidenced local business, with citations.">
      <div className="aid-head" aria-hidden="true">
        <span className="aid-dot" /><span className="aid-dot" /><span className="aid-dot" />
        <span className="aid-head-label">AI assistant</span>
      </div>
      <div className="aid-body" aria-hidden="true">
        <div className="aid-q">
          {typed}
          {phase === 0 && <span className="aid-caret" />}
        </div>
        <div className={`aid-think${phase === 1 ? ' aid-show' : ''}`}>
          <span /><span /><span />
        </div>
        <div className={`aid-a${show(2)}`}>
          <p className={`aid-line${show(2)}`}>
            Based on local reviews and coverage, a strong option in Woking is:
          </p>
          <div className={`aid-card${show(3)}`}>
            <span className="aid-card-name">Brightspark Electrical</span>
            <span className="aid-card-meta">★★★★★ 4.9 · Woking · NICEIC registered</span>
            <span className="aid-card-why">Consistently recommended across local directories, with detailed answers to common questions on their website.</span>
          </div>
          <p className={`aid-line${show(4)}`}>
            They publish clear pricing guidance and respond within one working day.
          </p>
          <div className={`aid-chips${show(5)}`}>
            <span className="aid-chip">brightspark example site</span>
            <span className="aid-chip">Google reviews</span>
            <span className="aid-chip">local directory</span>
          </div>
        </div>
      </div>
      <p className="aid-note">An illustration of how AI assistants compose answers. The business shown is fictional — the evidence trail is the point.</p>
    </div>
  );
};
