import { useEffect, useRef, useState } from 'react';

// Cloudflare Turnstile, rendered explicitly so React owns the widget's lifetime.
// Formspree verifies the `cf-turnstile-response` token itself, so no server code.

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  getResponse: (id: string) => string | undefined;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loader: Promise<void> | null = null;

const loadScript = () => {
  if (window.turnstile) return Promise.resolve();
  loader ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loader = null;
      s.remove();
      reject(new Error('turnstile'));
    };
    document.head.appendChild(s);
  });
  return loader;
};

export function useTurnstile(siteKey?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let gone = false;
    loadScript()
      .then(() => {
        if (gone || !ref.current || !window.turnstile) return;
        widget.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          'refresh-expired': 'auto',
          callback: () => setFailed(false),
          'error-callback': () => setFailed(true),
        });
      })
      .catch(() => setFailed(true));
    return () => {
      gone = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  return {
    enabled: !!siteKey,
    ref,
    failed,
    token: () => (widget.current && window.turnstile?.getResponse(widget.current)) || '',
    reset: () => {
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  };
}
