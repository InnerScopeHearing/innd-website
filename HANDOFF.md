# HANDOFF - innd-website

> Living memory for this project. A fresh Claude Code session reads this first and
> continues from "Next up". Update before you stop.

**Last updated:** 2026-06-20 by Claude Code (v1.3.3 audit complete)

## CURRENT STATE
v1.3.3 on feature branch `claude/vibrant-dijkstra-977p5z`, PR #5 open (draft).
InnerScope (OTC: INND) corporate + IR site. Static HTML/CSS/JS, deploys to Netlify (innd.com),
content driven by JSON in data/. SECURITIES FIREWALL: all IR-facing copy is attorney + Matt + Capital
gated; the PSLRA safe harbor is NOT available to penny-stock issuers. Do not invent
financials/partnerships/dates; emit TODO comments instead.

## v1.3.3 what was done (commits 10-12 on the branch, 2026-06-20)
- site.webmanifest: new file, PWA manifest (name, short_name, theme_color, background_color, SVG icon)
- index.html + thank-you.html: manifest link added
- thank-you.html: favicon + theme-color meta added (were missing)
- 404.html: em dash -> pipe in title, em dash -> comma in aria-label, skip-to-main added,
  id="main" on <main>, favicon + theme-color + manifest link added (matching thank-you.html)
- netlify.toml: Cross-Origin-Opener-Policy header added (same-origin-allow-popups, XS-Leak mitigation),
  payment=() added to Permissions-Policy, /iheartest/assets/* long-cache headers added
- iheartest/index.html: og-card.jpg (41KB JPEG, 1200x630) generated via Azure GPT-image-1 +
  sharp. The og-card.png was referenced but DID NOT EXIST -- social shares to /iheartest/ were broken.
  og:image + twitter:image updated to .jpg. Also: escapeHtml() helper added; body.message from
  server is now HTML-escaped before stateBox.innerHTML assignment (second-order XSS fix).
  submitBtn reset now uses textContent + Unicode arrow instead of innerHTML + HTML entities.
- scripts.js: status pill querySelector null-guarded (if (pill) pill.textContent = ...) in both
  success and error paths. Source label extracted to variable with 'OTC Markets' fallback so
  unrecognized q.source values never leak to the user.
- scripts.js: em dash removed from queued form status message (CLAUDE.md: no em dashes in copy)
- netlify/functions/signup.js: email domain removed from queued-path console.log (was PII in logs)
- styles.css: .contact-form label.consent overrides flex-direction to row + accent-color +
  focus-visible outline for the checkbox (the base .contact-form label uses column, which was
  stacking the checkbox alone on its own row above the label text)

## v1.3.2 what was done (commits 3-9 on the branch)
- OG image: 1.4MB PNG -> 101KB JPEG (14x). og:image + twitter:image updated. Raw gitignored.
- CSP: connect-src fixed (dead Cloud host -> automation.otchealth.app self-host).
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

## KNOWN INFRASTRUCTURE ISSUE (action required by Matt, not code)
Netlify PR deploy previews fail with "Unsupported repository type." (error before build starts).
Main/production deploys work fine (main branch is live). Root cause: the Netlify GitHub App
does not have PR preview / pull-request permission for the private repo innerscopehearing/innd-website.
Fix: Netlify app.netlify.com/projects/innd -> Site settings -> Build & deploy -> Unlink + re-link
GitHub. OR: GitHub Settings -> Applications -> Netlify -> Repository access -> add innd-website.
This is NOT a code error and does NOT block PR review.

## Next up (all operator-gated -- no code change will unblock these)
- Matt: fix Netlify GitHub App permission (see KNOWN INFRASTRUCTURE ISSUE above) so PR previews work.
- Matt + attorney: review and merge PR #5 (draft) -- v1.3.0 + v1.3.2 + v1.3.3 changes.
- Matt: close PR #3 (absorbed into PR #5; iHEARtest webhook + CSP both covered).
- Matt: set N8N_SHAREHOLDER_WEBHOOK env var in Netlify to activate $50 credit flow.
  signup.js is DARK (queues silently with ok:true) until this env var is set.
- Matt: supply leadership photos. All 3 leaders have photo: null in data/leadership.json.
  Once photos supplied, set photo: "filename" and they render automatically.
- Matt: confirm CEO LinkedIn URL (placeholder: /in/matthew-moore-innd).
- Attorney: review data/disclaimers.json + data/current-chapter.json before DNS cutover.
  Both are marked TODO: legal review required before publish. DO NOT ALTER without sign-off.
- Matt: DNS cutover innd.com -> Netlify after legal sign-off.
- Matt: confirm EDGAR URL, contact emails (ir@, partnerships@, info@), and pending retail launch
  wire URLs (see TODO comments in index.html).

## Key asset notes
- OG image (main): assets/og/innd-og-1200x630.jpg (101KB JPEG, generated 2026-06-14)
- OG image (iHEARtest): iheartest/assets/og-card.jpg (41KB JPEG, 1200x630, teal brand, 2026-06-20)
- Favicon: assets/favicon.svg (navy square, cream "IN" lettermark, oxblood rule)
- Photos: assets/photos/ -- 4 source photos (01 Marvin Posey 1950s, 02 1989 clinic,
  03 2016 family, 04 Nasdaq 2021). Leadership photos still needed.

## Toolkit
See docs/NEW-SESSION-KICKOFF.md and the note below.
