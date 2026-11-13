import React, { useEffect, useRef, useState } from 'react';
import { WireframeGlobe } from './wireframe-globe';
import { useTurnstile } from './use-turnstile';
import { useFadeIn } from './use-fade-in';

// Contact section: details and a wireframe globe on the left, the enquiry
// form on the right. Posts to Formspree.

type Props = {
  email: string;
  phoneDisplay: string;
  phoneTel: string;
  endpoint: string;
  turnstileSiteKey?: string;
  services: string[];
};

type Field = HTMLInputElement | HTMLTextAreaElement;

const MESSAGES: Record<string, string> = {
  name: 'Please tell us your name.',
  email: 'Please enter an email address we can reply to.',
  message: 'Please tell us a little about your project.',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECK_FIELDS = 'Please check the highlighted fields.';

const errorFor = (el: Field): string | null => {
  const value = el.value.trim();
  if (!el.required && !value) return null;
  if (!value) return MESSAGES[el.name] ?? 'This field is required.';
  if (el.type === 'email' && !EMAIL_RE.test(value)) return "That email doesn't look quite right. Please check it.";
  return null;
};

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICON_MAIL = 'M3 6h18v12H3zM3 7l9 6 9-6';
const ICON_PHONE =
  'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2';
const ICON_PIN = 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';

export const ContactWithGlobe: React.FC<Props> = ({
  email,
  phoneDisplay,
  phoneTel,
  endpoint,
  turnstileSiteKey,
  services,
}) => {
  const rootRef = useFadeIn<HTMLDivElement>();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ text: string; error?: boolean }>({ text: '' });
  const [sending, setSending] = useState(false);
  const turnstile = useTurnstile(turnstileSiteKey);

  // Native validation stays on for no-JS visitors; once hydrated we show our own messages.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  // The summary only makes sense while something is still highlighted.
  useEffect(() => {
    if (!Object.keys(errors).length) setStatus((s) => (s.text === CHECK_FIELDS ? { text: '' } : s));
  }, [errors]);

  const fields = () =>
    [...(formRef.current?.querySelectorAll<Field>('input[required], textarea[required], input[type=email]') ?? [])];

  const check = (el: Field) => {
    const msg = errorFor(el);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[el.name] = msg;
      else delete next[el.name];
      return next;
    });
    return !msg;
  };

  const onBlur = (e: React.FocusEvent<Field>) => {
    if (e.target.required || e.target.type === 'email') check(e.target);
  };
  const onInput = (e: React.FormEvent<Field>) => {
    const el = e.currentTarget;
    if (errors[el.name]) check(el);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // aria-disabled (not disabled) keeps focus on the button, so guard repeat clicks here
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get('_gotcha') as string)?.length) {
      setStatus({ text: '' });
      return;
    }

    const bad = fields().filter((el) => !check(el));
    if (bad.length) {
      setStatus({ text: CHECK_FIELDS, error: true });
      bad[0].focus();
      return;
    }

    if (!endpoint) {
      const subject = encodeURIComponent(`Project enquiry: ${data.get('service') || 'general'}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nCompany: ${data.get('company') || '-'}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || '-'}\n\n${data.get('message')}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      return;
    }

    if (turnstile.enabled) {
      const token = turnstile.token();
      if (!token) {
        setStatus({
          text: turnstile.failed
            ? `The security check didn't load. Please refresh the page, or email us at ${email}.`
            : 'Please wait for the security check to finish, then send again.',
          error: true,
        });
        if (turnstile.failed) turnstile.reset();
        return;
      }
      data.set('cf-turnstile-response', token);
    }

    setSending(true);
    setStatus({ text: 'Sending…' });
    try {
      const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const captcha = JSON.stringify(body ?? '').toLowerCase().includes('captcha');
        throw new Error(captcha ? 'captcha' : String(res.status));
      }
      form.reset();
      window.location.href = '/thank-you/';
    } catch (err) {
      const captcha = err instanceof Error && err.message === 'captcha';
      setStatus({
        text: captcha
          ? 'The security check expired. Please wait a moment for it to refresh, then send again.'
          : `Something went wrong sending the form. Please email us at ${email}.`,
        error: true,
      });
      turnstile.reset();
    } finally {
      setSending(false);
    }
  };

  const err = (name: string) =>
    errors[name]
      ? { 'aria-invalid': true as const, 'aria-describedby': `cwg-${name}-error` }
      : {};
  const fieldClass = (name: string) => `form-field${errors[name] ? ' form-field--invalid' : ''}`;
  const errorMsg = (name: string) =>
    errors[name] ? (
      <p className="field-error" id={`cwg-${name}-error`}>
        {errors[name]}
      </p>
    ) : null;
  const req = <span className="cwg-req" aria-hidden="true">*</span>;

  return (
    <div className="cwg" ref={rootRef}>
      <div className="cwg-pill-wrap" data-fade="0">
        <span className="eyebrow cwg-pill">
          <span className="eyebrow-dot" aria-hidden="true" />
          We reply within one working day
        </span>
      </div>

      <div className="cwg-grid">
        <div className="cwg-info" data-fade="0.08">
          <h2 className="section-title cwg-title">
            Get in <em>touch</em>
          </h2>
          <p className="cwg-lede">
            A new website, better rankings or more leads from Google Ads: tell us where you want to be and we'll
            show you how to get there.
          </p>

          <ul className="cwg-links">
            <li>
              <a className="cwg-link" href={`mailto:${email}`}>
                <span className="cwg-icon"><Icon d={ICON_MAIL} /></span>
                <span>
                  <span className="cwg-link-label">Email</span>
                  <span className="cwg-link-value">{email}</span>
                </span>
              </a>
            </li>
            <li>
              <a className="cwg-link" href={`tel:${phoneTel}`}>
                <span className="cwg-icon"><Icon d={ICON_PHONE} /></span>
                <span>
                  <span className="cwg-link-label">Phone</span>
                  <span className="cwg-link-value">{phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <div className="cwg-link">
                <span className="cwg-icon"><Icon d={ICON_PIN} /></span>
                <span>
                  <span className="cwg-link-label">Based in Surrey</span>
                  <span className="cwg-link-value">Monday–Friday, 9am–5:30pm</span>
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div className="cwg-card" data-fade="0.16">
          <h3 className="cwg-card-title">Send a message</h3>
          <hr className="cwg-sep" />

          <form
            ref={formRef}
            className={`contact-form cwg-form${sending ? ' is-sending' : ''}`}
            method="POST"
            action={endpoint || undefined}
            onSubmit={onSubmit}
          >
            <p className="form-alt cwg-req-key">
              <span className="cwg-req" aria-hidden="true">*</span> Required
            </p>

            <div className="form-row">
              <div className={fieldClass('name')}>
                <label htmlFor="cwg-name">Full name {req}</label>
                <input id="cwg-name" name="name" type="text" required autoComplete="name" onBlur={onBlur} onInput={onInput} {...err('name')} />
                {errorMsg('name')}
              </div>
              <div className="form-field">
                <label htmlFor="cwg-company">Company <span className="form-optional">(optional)</span></label>
                <input id="cwg-company" name="company" type="text" autoComplete="organization" />
              </div>
            </div>

            <div className={fieldClass('email')}>
              <label htmlFor="cwg-email">Email {req}</label>
              <input id="cwg-email" name="email" type="email" required autoComplete="email" onBlur={onBlur} onInput={onInput} {...err('email')} />
              {errorMsg('email')}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="cwg-phone">Phone <span className="form-optional">(optional)</span></label>
                <input id="cwg-phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className="form-field">
                <label htmlFor="cwg-service">What do you need?</label>
                <select id="cwg-service" name="service" defaultValue="">
                  <option value="">Not sure yet</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={fieldClass('message')}>
              <label htmlFor="cwg-message">Tell us about your project {req}</label>
              <textarea id="cwg-message" name="message" rows={5} required onBlur={onBlur} onInput={onInput} {...err('message')} />
              {errorMsg('message')}
            </div>

            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="form-honeypot" aria-hidden="true" />

            {turnstile.enabled && <div className="cwg-turnstile" ref={turnstile.ref} />}

            <div className="form-actions">
              <button className="btn btn--primary btn--lg cwg-submit" type="submit" aria-disabled={sending}>
                <span className="form-btn-label">{sending ? 'Sending…' : 'Send message'}</span>
                <svg className="cwg-arrow" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span className="form-spinner" aria-hidden="true" />
              </button>
            </div>

            <noscript>
              <p className="form-alt cwg-nojs">
                JavaScript is needed to send this form. Please email us at <a href={`mailto:${email}`}>{email}</a> instead.
              </p>
            </noscript>

            {/* Two always-mounted live regions: swapping role on one node is announced unreliably. */}
            <div className="form-status">
              <span role="status">{status.error ? '' : status.text}</span>
              <span role="alert" className="form-status--error">{status.error ? status.text : ''}</span>
            </div>
          </form>
        </div>

        <div className="cwg-globe-wrap" data-fade="0.24">
          <WireframeGlobe className="cwg-globe" />
        </div>
      </div>
    </div>
  );
};

export default ContactWithGlobe;
