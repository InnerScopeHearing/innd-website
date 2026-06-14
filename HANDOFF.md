# HANDOFF - innd-website

> Living memory for this project. A fresh Claude Code session reads this first and
> continues from "Next up". Update before you stop.

**Last updated:** 2026-06-14 by Claude Code (v1.3.0 full-stack quality uplift)

## CURRENT STATE
v1.3.0 on feature branch `claude/vibrant-dijkstra-977p5z`, PR pending.
InnerScope (OTC: INND) corporate + IR site. Static HTML/CSS/JS, deploys to Netlify (innd.com),
content driven by JSON in data/. SECURITIES FIREWALL: all IR-facing copy is attorney + Matt + Capital
gated; the PSLRA safe harbor is NOT available to penny-stock issuers. Do not invent
financials/partnerships/dates; emit TODO comments instead.

## v1.3.0 what was done
- Fixed 3 confirmed bugs (favicon 404, duplicate marketCap key, delayedMinutes tautology)
- Security: CORS hardened on signup.js, consent gating, name sanitization
- Mobile nav drawer (was completely absent before)
- Staggered card grid animations (nth-child, 80ms apart, spring easing)
- Leadership cards upgraded to avatar-head layout with monogram fallback
- Hero LCP preload added
- will-change scoped to :hover only
- cache: 'no-store' removed from JSON fetches

## Next up
- Open PRs: #2 (redesign report), #3 (n8n self-host repoint). Review and merge #3 first.
- Generate real OG image (1200x630 PNG): 1989 family clinic + INND wordmark + ticker.
  Re-enable og:image / twitter:image meta tags once image exists at /assets/og/innd-og-1200x630.png
- Wire N8N_SHAREHOLDER_WEBHOOK in Netlify env to activate $50 credit flow.
- Leadership photos: all 3 are null in data/leadership.json — once photos supplied, set
  `photo: "filename"` and they render automatically in the new avatar card.
- CEO LinkedIn URL: confirm Matt's actual LinkedIn profile URL (placeholder exists in HTML).
- Securities gated: data/disclaimers.json and data/current-chapter.json both flagged
  TODO: legal review required before publish. Do NOT alter these without attorney + Matt sign-off.
- DNS cutover innd.com → Netlify after legal sign-off.

## Toolkit
See docs/NEW-SESSION-KICKOFF.md and the note below.
