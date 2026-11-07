// Shared behaviour for every MotionCard on the page: one IntersectionObserver
// loads a clip when its card nears the viewport, plays it while visible and
// pauses it when it leaves. Bundled once however many cards a page has.

const cards = [...document.querySelectorAll<HTMLElement>('[data-motion-card]')];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
// Poster only: never fetch a clip for these visitors.
const stillsOnly = reduced || saveData;

function load(video: HTMLVideoElement) {
  if (video.dataset.loaded) return;
  video.dataset.loaded = '1';
  const webm = video.dataset.srcWebm;
  if (webm) {
    const s = document.createElement('source');
    s.src = webm;
    s.type = 'video/webm';
    video.appendChild(s);
  }
  const mp4 = document.createElement('source');
  mp4.src = video.dataset.src!;
  mp4.type = 'video/mp4';
  video.appendChild(mp4);
  video.addEventListener('loadeddata', () => video.classList.add('is-ready'), { once: true });
  video.load();
}

function play(video: HTMLVideoElement) {
  // Autoplay can be refused (low-power mode, browser policy); the poster stays.
  video.play().catch(() => {});
}

if (cards.length) {
  // Section reveal runs for everyone except reduced-motion visitors.
  if (reduced) cards.forEach((c) => c.classList.add('is-in'));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const card = e.target as HTMLElement;
        const video = card.querySelector<HTMLVideoElement>('.mc-video');
        if (e.isIntersecting) {
          card.classList.add('is-in');
          if (!stillsOnly && video) {
            load(video);
            if (!document.hidden) play(video);
          }
        } else if (video && !video.paused) {
          video.pause();
        }
      }
    },
    { rootMargin: '200px 0px', threshold: 0.25 }
  );
  cards.forEach((c) => io.observe(c));

  // Nothing plays in a background tab; resume only the cards still on screen.
  document.addEventListener('visibilitychange', () => {
    cards.forEach((card) => {
      const video = card.querySelector<HTMLVideoElement>('.mc-video');
      if (!video || !video.dataset.loaded) return;
      if (document.hidden) video.pause();
      else {
        const r = card.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) play(video);
      }
    });
  });
}
