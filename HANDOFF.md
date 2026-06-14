# HANDOFF - innd-website

> Living memory for this project. A fresh Claude Code session reads this first and
> continues from "Next up". Update before you stop.

**Last updated:** 2026-06-14 by Claude Code (v1.3.2 audit complete)

## CURRENT STATE
v1.3.1 on feature branch `claude/vibrant-dijkstra-977p5z`, PR #5 open (draft).
InnerScope (OTC: INND) corporate + IR site. Static HTML/CSS/JS, deploys to Netlify (innd.com),
content driven by JSON in data/. SECURITIES FIREWALL: all IR-facing copy is attorney + Matt + Capital
gated; the PSLRA safe harbor is NOT available to penny-stock issuers. Do not invent
financials/partnerships/dates; emit TODO comments instead.

## v1.3.2 what was done (commits 3-9 on the branch)
- OG image: 1.4MB PNG → 101KB JPEG (14x). og:image + twitter:image updated. Raw gitignored.
- CSP: connect-src fixed (dead Cloud host → automation.otchealth.app self-host).
- iHEARtest webhook repoint: BETA_SIGNUP_WEBHOOK_URL in iheartest/index.html updated (absorbs PR #3).
- Press releases stagger in: .press-list added to nth-child stagger selector + data-reveal on <ul>.
- a11y: skip-to-main on all 3 pages, aria-hidden on all honeypot wrappers, tabindex=-1 on bot-fields.
- a11y/perf: LCP preload on iheartest hero, fix og:image:alt em dash.
- SEO: schema.org expanded (Organization + WebSite + WebPage @graph), SoftwareApplication on iheartest.
  Sitemap updated (lastmod, added iheartest/, removed non-crawlable #hash anchors).
- CSS: .eyebrow rule deduplicated.
- Bugs: email redacted from signup.js console.log; client now shows softer message on deferred/queued.
- thank-you.html: em dashes replaced with commas/pipes in title and aria-label.

## v1.3.0 what was done
- Fixed 3 confirmed bugs (favicon 404, duplicate marketCap key, delayedMinutes tautology)
- Security: CORS hardened on signup.js, consent gating, name sanitization
- Mobile nav drawer (was completely absent before)
- Staggered card grid animations (nth-child, 80ms apart, spring easing)
- Leadership cards upgraded to avatar-head layout with monogram fallback
- Hero LCP preload added
- will-change scoped to :hover only
- cache: 'no-store' removed from JSON fetches
- OG image generated (GPT-image-1 via Azure, 1536x1024 raw cropped to 1200x630)
- leader-grid responsive 3-col at 820px+

## Next up
- Review and merge PR #5 (draft) — v1.3.0 + v1.3.1 changes.
- Open PRs: #2 (redesign report), #3 (n8n self-host repoint iHEARtest CSP). Merge #3 next.
- Wire N8N_SHAREHOLDER_WEBHOOK in Netlify env to activate $50 credit flow.
  signup.js is DARK (runs but doesn't fire webhook) until this env var is set.
- Leadership photos: all 3 are null in data/leadership.json — once photos supplied, set
  `photo: "filename"` and they render automatically in the new avatar card.
- CEO LinkedIn URL: confirm Matt's actual LinkedIn profile URL (placeholder: /in/matthew-moore-innd).
- Securities gated: data/disclaimers.json and data/current-chapter.json both flagged
  TODO: legal review required before publish. Do NOT alter these without attorney + Matt sign-off.
- DNS cutover innd.com -> Netlify after legal sign-off.

## Key asset notes
- OG image: assets/og/innd-og-1200x630.jpg (101KB JPEG, generated 2026-06-14, GPT-image-1 via Azure)
  Raw: assets/og/innd-og-raw.png on local disk only (gitignored — 2.8MB raw, not deployed)
- Favicon: assets/favicon.svg (navy square, cream "IN" lettermark, oxblood rule)
- Photos: assets/photos/ — 4 source photos (01 Marvin Posey 1950s, 02 1989 clinic,
  03 2016 family, 04 Nasdaq 2021). Leadership photos still needed.

## Toolkit
See docs/NEW-SESSION-KICKOFF.md and the note below.
