# Cumulus Digital — Weekly Blog Content Strategy (SEO + AEO)

The weekly article exists to do one thing: put Cumulus Digital in front of
Surrey small-business owners — above all **trades** — at the moment they ask
a question, whether they ask Google, ChatGPT, Perplexity or Gemini. Every
post is a net for enquiries, not a diary entry.

## Who we are writing for

A busy owner-operator in Surrey: a builder in Woking, a plumber in Walton,
an electrician in Guildford, a roofer in Weybridge, a landscaper in Cobham.
Also the wider local SME: café, salon, accountant, lettings agent. They are
not marketers. They search in plain questions and they trust straight,
priced, local answers.

## The four content pillars (rotate, don't stray)

1. **AI search & visibility (AEO)** — how local businesses show up in
   ChatGPT, Gemini, Perplexity and Google AI Overviews. We own this topic
   locally before anyone else in Surrey does.
2. **Trade marketing economics** — costs, returns and comparisons in plain
   numbers: "How much should a plumber's website cost in 2026?", "Google
   Ads vs Checkatrade for a Surrey builder", "How many jobs should a
   website bring a roofer each month?"
3. **Topical changes that affect Surrey SMEs** — algorithm updates, Google
   Business Profile changes, Checkatrade/Trustpilot shifts, new
   regulations touching trades, seasonal demand ("getting booked solid
   before winter boiler season"). Always answer: *what should a Surrey
   business do about it this month?*
4. **Local proof** — lessons drawn from real Cumulus builds and sectors we
   know (trades, travel, local venues), written as advice, linking to the
   relevant case study.

## Non-negotiable format rules (this is the AEO engine)

- **Title = the question a customer actually asks**, with "Surrey" or a
  Surrey town where natural. Model: the live post
  `/how-to-get-cited-by-ai/`.
- **Every H2 is a question in the user's words.** Answer it completely in
  the first 2–3 sentences, then expand.
- **One primary question per article.** 1,200–1,800 words.
- **FAQ section at the end**: 3–5 real follow-up questions, each answered
  self-contained in its opening sentences (the snippet AI lifts).
- **Surrey specificity throughout**: towns, trades, local platforms
  (Checkatrade, Surrey Advertiser, Surrey Chambers), realistic UK prices.
- **At least one blockquote** pull-line; bullet lists over walls of text.
- **Internal links**: minimum two — the most relevant service page
  (/services/web-design/, /services/web-development/, /services/google-ads/,
  /services/trades/) and one other post or case study. End with the
  standard CTA to /contact/.
- **E-E-A-T**: write with first-hand authority ("when we audit…", "on
  builds we've shipped…"). Never invent named clients, statistics or
  review quotes; real examples only, or keep it general.
- **UK English.** No em-dash-studded AI boilerplate; keep the voice of the
  existing posts: plain, confident, a little dry.

## Images

House style: premium editorial 3D illustration, deep navy ground
(#031422), frosted-glass objects, teal (#5dc2d5) light, film grain, no
text or logos, 16:9. One hero minimum, inline images where they earn
their place. If no image tool is available that session, publish without
a frontmatter image — the index card has a brand fallback.

## Mechanics (how a post ships)

- Markdown file in `src/content/blog/<slug>.md` — slug is the question's
  keyword form, short (e.g. `plumber-website-cost-surrey`). Frontmatter:
  `title`, `description` (the question phrasing first, ≤160 chars),
  `pubDate`, optional `image` (file in `src/content/blog/images/`).
- Posts publish at the root: `/<slug>/`. Never reuse or shadow an existing
  route; check `src/pages/` and existing posts first.
- `npx astro build` must pass; view the page on `npx astro preview` before
  shipping.

## Choosing each week's topic

1. Read the existing posts (`src/content/blog/`) — never repeat a primary
   question; link back to relevant earlier ones instead.
2. Search the week's news for anything touching UK small
   businesses, trades, Google/AI search changes, or Surrey's local
   economy. A topical hook beats an evergreen topic when both are available.
3. Pick the pillar least recently served. Trades angle at least every
   other week.
4. Sanity-check the question is one a real customer would ask an AI or
   Google — if it needs industry vocabulary to phrase, it's the wrong
   question.

## Starter backlog (use when no topical hook wins)

- How much should a tradesperson's website cost in Surrey in 2026?
- Google Ads or Checkatrade: where should a Surrey builder spend first?
- Why is my building firm not showing on Google Maps in my town?
- Do WhatsApp-only businesses lose work in Surrey? (web presence basics)
- How many enquiries should a plumber's website generate a month?
- What should a Surrey café/salon website include to actually take bookings?
- Are Google reviews or Checkatrade reviews worth more to a Surrey trade?
- What is Google's latest update and what should Surrey small businesses do?
- How do I get my trade business recommended in local Facebook groups and by AI?
- Website vs social media: where does a Surrey start-up begin?
- How long does a small-business website take to build (and what slows it down)?
- What does "SEO" actually buy a small Surrey business per month?

## Measuring (monthly, not per-post)

Search Console: impressions/clicks on question queries. GA4: referrals
from chatgpt.com, perplexity.ai, gemini.google.com, and form fills with a
blog page in the journey. Spot-check: ask ChatGPT/Gemini the backlog
questions and note when Cumulus starts being the answer.
