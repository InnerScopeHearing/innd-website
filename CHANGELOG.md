# Changelog

All notable changes to the INND.com website are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.2.0] - 2026-05-21 (staging)

The "shareholder engagement" release. Adds a forward-looking vision section,
prominent OTCHealthMart promotion, social links, and a shareholder-updates
signup that issues a personalized $50 OTCHealthMart welcome credit via an
n8n + Customer.io + Shopify pipeline.

### Added
- What's Next vision section (#whats-next): pharmacy-channel thesis, DTC growth,
  teleaudiology, transparent shareholder community. Forward-looking, disclaimered.
- Shareholder Updates section (#shareholder-updates): name + email signup posting
  to /.netlify/functions/signup, $50 OTCHealthMart welcome-credit offer (funded by
  OTCHealth Inc.), Follow-INND links (OTCHealthMart, @inndstock on X, CEO LinkedIn).
- OTCHealthMart hero CTA.
- /.netlify/functions/signup: validates + forwards signup to the n8n shareholder
  webhook (DARK until N8N_SHAREHOLDER_WEBHOOK env var is set).

### Pending (not yet live)
- n8n workflow: CIO upsert + "INND Shareholder List" segment + Shopify $50 unique
  code generation + welcome-event fire.
- Customer.io welcome campaign with personalized credit-code merge field.
- CEO LinkedIn URL (placeholder in #shareholder-updates).

---

## [1.1.0] - 2026-05-04

The "design polish + custom hero ticker" release. Major visual transformation
plus a custom-built hero quote card that pulls live INND data from the same
TradingView feed used by OTC Markets widgets.

### Added

- **Premium typography**: Fraunces (display, serif) for headings, Inter (body)
  for prose. Refined character alternates via `font-feature-settings: "ss01", "cv11"`.
- **Navy / cream / oxblood palette**: replaces flat blue accent system.
  Cream (`#F8F4ED`) for alternating section backgrounds, oxblood (`#8B2635`)
  for primary accent.
- **Ken Burns hero**: 1989 family clinic photo as background with slow 32-second
  zoom (scale 1.00 → 1.08), navy gradient overlay, subtle SVG film-grain noise,
  `prefers-reduced-motion` respected.
- **Photo treatments**:
  - Marvin Posey 1950s: 88% grayscale + 1.06 contrast + film grain
  - 1989 Moore family clinic: 22% sepia + 1.08 saturation
  - 2016 family listing: subtle radial vignette
  - Matt at Nasdaq 2021: bottom-up gradient overlay for caption legibility
- **Microinteractions**: card hover lifts (-2px translateY + shadow upgrade),
  external-link underline animations, oxblood form input focus glow.
- **Skeleton loaders**: shimmer animation while TradingView mounts populate.
- **Custom hero quote card** (replaces TradingView Symbol Overview widget):
  - Sub-penny price formatting ($0.0001 precision)
  - Dollar + percent change with up/down arrow and color-coded directionality
  - Stat grid: Volume, Day range, 52-week range, Market cap
  - LIVE / MOCK / OFFLINE status pill (pulsing teal dot when live)
  - Prominent "View live on OTC Markets →" link
- **`/.netlify/functions/quote`**: server-side quote function with provider
  fallback chain — TradingView scanner (primary) → Yahoo Finance → mock data
- **`?tier=N` URL override**: visit `/?tier=1` to preview the old TradingView
  Symbol Overview widget for comparison; default is now Tier 3 (custom card).
- **Operator-supplied share count**: `SHARES_OUTSTANDING = 889_823_171` constant
  in `quote.js` overrides TradingView's stale 183M figure. Market cap calculated
  as `price × SHARES_OUTSTANDING`.

### Changed

- IR section reorder: "Filings & disclosures" block now appears first,
  ahead of the chart. Correct priority for a public-markets IR page.
- Conservative meta description / og:description / twitter:description copy
  aligned with the conservative messaging in `data/hero.json` and
  `data/current-chapter.json`.
- Footer "Last updated" date dynamically reflects latest deploy.
- Default body tier: `data-tier="3"` (was `"1"`).

### Fixed

- **Squashed TradingView chart**: explicit `height: 480px` on `.tv-chart`
  container plus `height: 100%` chain through intermediate divs (autosize
  needed explicit pixel height, not just min-height).
- **Broken `<source srcset="*.webp">` lines**: removed; the .webp files were
  never generated and the 404s were polluting the network tab.
- **Google Fonts CSP block**: added `fonts.googleapis.com` to `style-src`
  and `fonts.gstatic.com` to `font-src`. New visitors now see Fraunces/Inter
  as designed instead of Times New Roman fallback.
- **TradingView iframe CSP block**: added `*.tradingview-widget.com` to
  `frame-src`. Console no longer throws CSP errors on every page load.

### Security

- Staging-only `<meta name="robots" content="noindex, nofollow">` on
  `innd.netlify.app` prevents Google indexing while site is in pre-launch
  staging. **Must be removed before pointing innd.com at this deploy.**

### Pending (not in this release)

- Custom OG image (1200×630 PNG: 1989 family clinic + INND wordmark + ticker line)
- Securities counsel review of `data/disclaimers.json` and `data/current-chapter.json`
- Press wall (silver-grayscale retailer logos: Walmart, CVS, RiteAid,
  Walgreens, NASDAQ) — pending logo SVG/PNG sourcing
- Live SEC filings feed via OTC Markets `/otcapi/company/sec-filings?symbol=INND`
- DNS cutover from OTCHealthMart redirect → Netlify (after legal sign-off)

---

## [1.0.0] - 2026-05-04 (earlier in same session)

Initial import.

### Added

- 24-file site bundle parsed and committed: HTML scaffold, CSS design system,
  JS runtime with JSON content loaders, Netlify functions skeleton.
- Conservative messaging applied to `data/hero.json` and `data/current-chapter.json`
  (alignment for pending Ainnova / OTCHealth strategic alliance).
- Four canonical Moore family photos placed: Marvin Posey 1950s,
  1989 family clinic, 2016 family listing, Matt at Nasdaq 2021.
- TradingView Tier 1 ticker widgets (Symbol Overview + Advanced Chart).
- Netlify staging deploy at `innd.netlify.app`.
