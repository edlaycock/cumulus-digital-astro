import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Where an ad budget goes before and after a tidy-up: two bars whose teal
// (real enquiries) and grey (wasted clicks) shares animate apart when the
// panel scrolls into view. Figures are deliberately labelled illustrative.
// Server-render shows the finished state.

const BEFORE = 38; // % of spend reaching real enquiries, typical inherited account
const AFTER = 84;

export const BudgetSplit: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true); // SSR: final state
  const armed = useRef(false);

  useEffect(() => {
    if (reduce || armed.current || !ref.current) return;
    armed.current = true;
    setOn(false);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          window.setTimeout(() => setOn(true), 350);
        }
      },
      { threshold: 0.45 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  const bar = (label: string, pct: number) => (
    <div className="bsp-row" aria-hidden="true">
      <span className="bsp-label">{label}</span>
      <div className="bsp-bar">
        <span className="bsp-fill" style={{ width: on ? `${pct}%` : '20%' }} />
      </div>
      <span className="bsp-pct">{on ? pct : 20}%</span>
    </div>
  );

  return (
    <div className="bsp" ref={ref} role="img" aria-label="Illustration: before a tidy-up, roughly a third of ad spend reaches real enquiries; after fixing tracking, match types and negatives, most of it does.">
      {bar('Typical inherited account', BEFORE)}
      {bar('After the tidy-up', AFTER)}
      <div className="bsp-key" aria-hidden="true">
        <span><i className="bsp-swatch bsp-swatch--teal" /> spend reaching real enquiries</span>
        <span><i className="bsp-swatch" /> wasted clicks</span>
      </div>
      <p className="bsp-note">Illustrative shares — the point of the audit is finding your real number.</p>
    </div>
  );
};
