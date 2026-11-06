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

## The humanizer pass (mandatory before shipping)

Every draft gets a final edit against the "signs of AI writing" list
(Wikipedia's WikiProject AI Cleanup). If the anthropic-skills:humanizer
skill is available in your session, run it on the draft. Either way, the
finished article must pass this checklist:

- **No em dashes or en dashes anywhere.** Replace with a full stop,
  comma, colon, parentheses, or restructure. Scan for `—` and `–`
  before shipping; any hit means it isn't done.
- No bold-colon bullet lists ("**Speed:** ...") used mechanically; write
  sentences, keep plain lists for genuinely list-shaped things.
- Kill the AI vocabulary: delve, crucial, pivotal, landscape, tapestry,
  testament, underscore, showcase, foster, vibrant, seamless, elevate,
  "serves as", "stands as". Prefer is/are/has.
- No rule-of-three padding, no "It's not just X, it's Y", no false
  ranges ("from X to Y"), no "-ing" clauses bolted on for fake depth
  ("...highlighting the importance of...").
- No vague authority ("experts say", "studies show") and no invented
  numbers, clients or quotes. Specific and checkable, or cut it.
- No filler ("in order to", "it is important to note"), no signposting
  ("let's dive in"), no generic upbeat endings.
- Vary sentence length. Short ones land points. Let a longer one breathe
  now and then. Read a paragraph aloud; if it has an even, mid-length
  drone, break it up.
- Keep the human details: first-person agency experience ("we audit
  Surrey sites every week and the usual finding is..."), real towns,
  real prices, an opinion where we hold one.

## Images

House style: premium editorial 3D illustration, deep navy ground
(#031422), frosted-glass objects, teal (#5dc2d5) light, film grain, no
text or logos, 16:9. One hero minimum, inline images where they earn
their place. If no image tool is available that session, publish without
a frontmatter image — the index card has a brand fallback.

## Provenance hygiene (part of every ship)

- After the humanizer pass, scan the final markdown for invisible or
  suspicious Unicode (zero-width spaces/joiners, BOM, soft hyphens,
  variation selectors, bidi controls, tag characters) and remove any hit.
- Always re-encode generated images through sharp before committing
  (`sharp(input).png()` or equivalent). This strips EXIF, XMP and
  hard-bound C2PA "Content Credentials" metadata that image generators
  attach. Never commit a generator's file as-is.

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

## Distribution: Facebook (every article, same day)

Each published article gets two pieces of social copy, written fresh for
the article (never a template fill-in):

**1. Page post** (Cumulus Digital's Facebook Page). 2–4 sentences.
Lead with the question the article answers, in the customer's words.
One concrete takeaway from the piece, then the link. The hero image is
the attachment. Plain, confident, no hashtag soup (two at most, e.g.
#Surrey #SmallBusiness).

**2. Groups post** (the nominated local groups below). Softer and
community-first or it gets deleted and we get banned: open with the
problem as locals experience it, give the single most useful tip from
the article in full (genuinely useful on its own, no clickbait), then
"I wrote up the rest here" with the link. First person, from Ed. Never
salesy, never identical wording across groups — vary the opening line
per group. Respect each group's self-promo rules; where a group has a
promo day, hold the post for it.

**Nominated groups** (owner's list, member counts as of Nov 2024; post
only where each group's rules allow, and honour the posting days below):

| Group | Members | Posting rules |
| --- | --- | --- |
| Guildford Community Board | 57,400 | |
| Godalming and Villages Community | 38,200 | |
| We Love Surrey | 31,000 | |
| Walton on Thames and Hersham | 29,800 | Tuesdays only |
| The Woking Residents Community | 28,000 | Monday only |
| Camberley Community Board | 24,200 | |
| Cobham Mummies | 24,000 | |
| Surrey/Esher/Cobham Mums & Mums Network | 17,900 | |
| Weybridge/Walton/Hersham-/local | 14,100 | |
| Weybridge Community Hub | 11,700 | |
| Woking Community | 11,600 | Monday or Thursday |
| Surrey and Kingston Community Group | 10,000 | |
| Cranleigh Community Group | 8,600 | Mondays and Fridays only |
| Esher, Surbiton and Cobham mums | 7,800 | |
| Fernhurst Village community Board | 7,200 | |
| Haslemere and surrounding areas community board | 5,500 | |
| Redhill, Reigate, Horley and Surrounding Areas | 5,100 | |
| Woking and Guildford Community Chat | 4,600 | |
| Ewhurst Community Board | 4,600 | |
| Dorking business | 3,100 | |
| Puttenham Community Board | 2,000 | |
| Surrey Business Advertising | 1,900 | |
| Godalming Community Board | — | |
| Farnham Surrey Community Board | — | 1st and 15th of the month only |

Where the article has a town angle, lead with the groups for that town.
The article publishes on Tuesdays, which lines up with "Walton on Thames
and Hersham" (Tuesdays only); groups with Monday/Thursday/Friday or
date-based rules get their draft held and posted on the next allowed
day rather than skipped.

**Mechanics.** Page posting is automated through the Facebook Graph
API. The Page access token is stored as a network secret on this
environment (host graph.facebook.com); the session's proxy injects it
into requests automatically, so never add an Authorization header or
`access_token` parameter yourself — send the request plain. Publish
with `POST https://graph.facebook.com/v27.0/<PAGE_ID>/feed` (fields:
`message`, `link`) and record the returned post id in the weekly
report. If the call returns 401/403, report it as a blocker (the token
may have been invalidated by a password change or Page-role change);
do not retry with workarounds. Groups are always manual (Meta removed
the Groups API in 2024): include both drafts verbatim in the weekly
report for a human to paste.

**Facebook Page ID:** 997169053672137 (Cumulus Digital Ltd).

## Measuring (monthly, not per-post)

Search Console: impressions/clicks on question queries. GA4: referrals
from chatgpt.com, perplexity.ai, gemini.google.com, and form fills with a
blog page in the journey. Spot-check: ask ChatGPT/Gemini the backlog
questions and note when Cumulus starts being the answer.
