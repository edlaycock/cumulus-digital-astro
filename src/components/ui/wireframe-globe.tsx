import React, { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from 'd3-geo';

// Decorative navy wireframe globe. Starts facing the UK, turns slowly, and can
// be dragged. Sphere and graticule render on the server; the land outline is
// a bundled world-atlas file loaded after hydration so the form is usable first.

const SIZE = 480;
const HOME: [number, number] = [0.4, -38]; // rotation that centres on Surrey
const SURREY: GeoPermissibleObjects = { type: 'Point', coordinates: [-0.4, 51.3] };
const SPEED = 0.004; // degrees per ms, about 90s a turn
const graticule = geoGraticule10();

export const WireframeGlobe: React.FC<{ className?: string }> = ({ className }) => {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const gratRef = useRef<SVGPathElement>(null);
  const landRef = useRef<SVGPathElement>(null);
  const pinRef = useRef<SVGPathElement>(null);
  const land = useRef<GeoPermissibleObjects | null>(null);
  const rot = useRef<[number, number]>([...HOME]);

  const projection = useMemo(
    () => geoOrthographic().scale(SIZE / 2 - 8).translate([SIZE / 2, SIZE / 2]).clipAngle(90).rotate(HOME),
    []
  );
  const path = useMemo(() => geoPath(projection).pointRadius(5), [projection]);
  const initial = useMemo(
    () => ({ sphere: path({ type: 'Sphere' }) ?? '', grat: path(graticule) ?? '', pin: path(SURREY) ?? '' }),
    [path]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    let last = 0;
    let inView = false;
    let dragging = false;
    let cancelled = false;

    const draw = () => {
      projection.rotate(rot.current);
      gratRef.current?.setAttribute('d', path(graticule) ?? '');
      pinRef.current?.setAttribute('d', path(SURREY) ?? '');
      if (land.current) landRef.current?.setAttribute('d', path(land.current) ?? '');
    };

    const tick = (t: number) => {
      if (last) rot.current = [(rot.current[0] + (t - last) * SPEED) % 360, rot.current[1]];
      last = t;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const shouldRun = () => !reduce && inView && !dragging && !document.hidden;
    const sync = () => {
      if (shouldRun() && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun() && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      wrap.dataset.rotating = String(!!raf);
    };

    const io = new IntersectionObserver((es) => {
      inView = es.some((e) => e.isIntersecting);
      sync();
    });
    io.observe(wrap);
    document.addEventListener('visibilitychange', sync);

    let start: { x: number; y: number; r: [number, number] } | null = null;
    const onDown = (e: PointerEvent) => {
      start = { x: e.clientX, y: e.clientY, r: [...rot.current] };
      dragging = true;
      wrap.setPointerCapture(e.pointerId);
      sync();
    };
    const onMove = (e: PointerEvent) => {
      if (!start) return;
      const k = 180 / wrap.clientWidth;
      rot.current = [
        start.r[0] + (e.clientX - start.x) * k,
        Math.max(-70, Math.min(70, start.r[1] - (e.clientY - start.y) * k)),
      ];
      draw();
    };
    const onUp = () => {
      start = null;
      dragging = false;
      sync();
    };
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);

    Promise.all([import('topojson-client'), import('world-atlas/land-110m.json')]).then(
      ([topo, atlas]) => {
        if (cancelled) return;
        const data = ((atlas as { default?: unknown }).default ?? atlas) as any;
        land.current = topo.feature(data, data.objects.land) as GeoPermissibleObjects;
        draw();
        wrap.dataset.ready = 'true';
      }
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointercancel', onUp);
    };
  }, [reduce, path, projection]);

  return (
    <div ref={wrapRef} className={['wglobe', className].filter(Boolean).join(' ')} aria-hidden="true">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} focusable="false">
        <path className="wglobe-sphere" d={initial.sphere} />
        <path ref={gratRef} className="wglobe-grat" d={initial.grat} />
        <path ref={landRef} className="wglobe-land" />
        <path ref={pinRef} className="wglobe-pin" d={initial.pin} />
      </svg>
    </div>
  );
};

export default WireframeGlobe;
