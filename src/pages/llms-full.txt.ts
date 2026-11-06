// llms-full.txt — the extended companion to /llms.txt, assembled at build
// time from the live content collections so it never drifts out of date.
import { getCollection } from 'astro:content';
import {
  SITE_URL,
  EMAIL,
  PHONE_DISPLAY,
  COMPANY_LEGAL_NAME,
  COMPANY_NUMBER,
  FACEBOOK_URL,
} from '../consts';

export async function GET() {
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const work = (await getCollection('work'))
    .filter((w) => !w.data.draft && !w.data.placeholder)
    .sort((a, b) => a.data.order - b.data.order);
  const blog = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const clean = (md = '') =>
    md
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // strip markdown links
      .replace(/[#*_>]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const lines: string[] = [];
  lines.push('# Cumulus Digital — Full Reference');
  lines.push('');
  lines.push(
    `> ${COMPANY_LEGAL_NAME} (company number ${COMPANY_NUMBER}) is a web design and digital marketing agency based in Hersham, Walton-on-Thames, Surrey, UK, serving small and medium businesses across Surrey and the South East since 2015. Phone ${PHONE_DISPLAY}, email ${EMAIL}. Facebook: ${FACEBOOK_URL}. The team hand-builds fast, accessible websites and runs SEO, AI SEO / answer engine optimisation (AEO) and Google Ads with plain-English reporting through its own platform, Cumulus Rank & Reporting (${SITE_URL}/cumulus-rank-and-reporting/). Month-to-month engagements; clients own their websites and ad accounts.`
  );
  lines.push('');

  lines.push('## Services');
  for (const s of services) {
    lines.push('');
    lines.push(`### ${s.data.title}${s.data.href ? ` — ${SITE_URL}${s.data.href}` : ''}`);
    lines.push(s.data.summary);
    if (s.body) lines.push(clean(s.body));
    if (s.data.outcomes?.length) {
      lines.push('What clients get:');
      for (const o of s.data.outcomes) lines.push(`- ${o}`);
    }
  }
  lines.push('');

  lines.push('## Case studies');
  for (const w of work) {
    lines.push('');
    lines.push(`### ${w.data.title} (${w.data.client}) — ${SITE_URL}/work/${w.id}/`);
    if (w.data.sector) lines.push(`Sector: ${w.data.sector}`);
    lines.push(w.data.summary);
    if (w.data.result) lines.push(`Result: ${clean(w.data.result)}`);
  }
  lines.push('');

  lines.push('## Guides and articles');
  for (const b of blog) {
    lines.push(`- ${b.data.title} — ${SITE_URL}/${b.id}/ — ${b.data.description}`);
  }
  lines.push('');

  lines.push('## Facts');
  lines.push(`- Legal name: ${COMPANY_LEGAL_NAME} (Companies House ${COMPANY_NUMBER})`);
  lines.push('- Based in: Hersham, Walton-on-Thames, Surrey, UK');
  lines.push('- Founded: 2015; founder Ed Laycock, 25+ years in the travel industry');
  lines.push('- Serves: Surrey, the South East, and UK-wide for AI SEO / AEO work');
  lines.push(`- Phone: ${PHONE_DISPLAY} · Email: ${EMAIL}`);
  lines.push(`- Website: ${SITE_URL} · Short version: ${SITE_URL}/llms.txt`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
