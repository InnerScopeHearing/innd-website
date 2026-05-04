# INND.com — InnerScope Hearing Technologies (OTC: INND)

Static corporate + investor-relations website for **InnerScope Hearing Technologies, Inc.**, deployable to Netlify with no build step. Content is JSON-driven so non-engineers can update copy without touching HTML.

## Stack

- Plain HTML, CSS, and vanilla JS — no framework, no bundler.
- Netlify Functions (Node) for the optional Tier 3 real-time quote proxy.
- TradingView embedded widgets for Tier 1 ticker / chart (default).

## Local preview

```bash
python -m http.server 8000
# then open http://localhost:8000
```

The site is fully static — no build, no install. The TradingView widget needs internet but everything else renders offline.

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, "Add new site → Import an existing project" → select the repo.
3. Build settings:
   - **Build command:** _(leave blank)_
   - **Publish directory:** `.`
4. Netlify reads `netlify.toml` for headers, redirects, and the `netlify/functions/` directory.

### Environment variables (set in Netlify UI — never commit)

| Variable | Required | Purpose |
|---|---|---|
| `POLYGON_API_KEY` | Tier 3 only | Polygon.io Stocks Starter ($29/mo). Recommended primary for sub-penny OTC. |
| `FINNHUB_API_KEY` | Tier 3 only | Finnhub fallback. **Free tier OTC coverage is unreliable for INND — staging only.** |
| `QUOTE_PROVIDER` | Tier 3 only | `polygon` (default) or `finnhub`. |

A `/.netlify/functions/health` endpoint reports the build SHA and which provider key is configured.

### DNS cutover (greenfield, simple)

INND.com currently 301-redirects to OTCHealthMart.com (Shopify). To go live with this site:

1. Deploy to Netlify staging URL first; complete the smoke checklist below.
2. At the registrar where INND.com is registered: stop the forward to OTCHealthMart.com; set Netlify's DNS records (apex `ALIAS`/`ANAME`, `www` `CNAME`).
3. Wait for DNS propagation (usually <1h, sometimes up to 24h). SSL is auto-provisioned.
4. Submit `https://innd.com/sitemap.xml` to Google Search Console as a new property.

OTCHealthMart.com (a separate Shopify domain) is unaffected.

## Content updates — the operator workflow

Almost every content change is a JSON edit + commit + push. Netlify auto-deploys in ~2 min.

| Change | File |
|---|---|
| Hero headline / subhead / badges / CTAs | `data/hero.json` |
| Legacy section copy | `data/legacy.json` |
| Growth timeline events | `data/timeline.json` |
| "Where INND is today" copy | `data/current-chapter.json` |
| Brand cards (HearingAssist, iHEAR) | `data/brands.json` |
| Leadership bios | `data/leadership.json` |
| IR financial-highlight cards | `data/financial-highlights.json` |
| Press releases (newest-first by `date`) | `data/press-releases.json` |
| Email addresses | `data/contacts.json` |
| Forward-looking-statements + quote-delay copy | `data/disclaimers.json` |

Photo swaps go in `assets/photos/` using the canonical filenames listed in `INND-photo-asset-manifest.md` (`01-marvin-posey-1950s.{jpg,webp}`, etc.).

PDF filings drop into `assets/filings/`; see that directory's README.

## Switching quote tiers

The site ships at **Tier 1** (TradingView widgets, ~15 min delay). To upgrade:

```html
<!-- in index.html, change: -->
<body data-tier="1">
<!-- to: -->
<body data-tier="3">
```

…and set `POLYGON_API_KEY` + `QUOTE_PROVIDER=polygon` in Netlify env vars.

The Tier 3 custom widget reads `/.netlify/functions/quote`, formats sub-penny prices to 4 decimals, color-codes the change, and degrades gracefully to "Live data temporarily unavailable" on failure.

## Accessibility notes

- Skip-to-main link, semantic landmarks, single H1.
- All interactive elements have `:focus-visible` styling (2px accent outline).
- Images carry meaningful `alt` text and explicit `width`/`height` for CLS.
- `prefers-reduced-motion` disables the scroll-reveal fade.
- Form fields have explicit labels and `autocomplete` hints.
- Color contrast meets WCAG AA on all text/background pairs.

## Aggregated TODOs (block before public launch)

- **Legal review** of `data/disclaimers.json` (penny-stock issuer; no PSLRA safe harbor).
- **IR confirmation** that `data/current-chapter.json` language has been counsel-reviewed.
- **Email provisioning** of `ir@innd.com`, `partnerships@innd.com`, `info@innd.com`.
- **Open Graph image** at `/assets/og/innd-og-1200x630.png` (1200×630 composite).
- **Favicon** at `/assets/favicon.svg`.
- **Additional leadership bios** beyond Matt (operator-supplied).
- **Press release URLs** for HearingAssist on Walgreens.com, Walmart Canada launch, $277K Walmart purchase orders (currently noted in micro-note as pending).
- **SEC EDGAR canonical URL** (currently a search query — replace with the issuer's CIK-keyed page once confirmed).
- **Annual report PDFs** into `/assets/filings/`.
- **Polygon.io subscription** (Stocks Starter, ~$29/mo) before flipping to Tier 3.
- **Delete original photo files** in `assets/photos/` once you've verified the canonical-named copies render correctly: `Marvin-Posey-50s.png`, `Old Family Business Photo Gray-Matt.png`, `family moore.jpg`, `Matthew NASDAQ Interview.jpg`.

## File layout

```
.
├── index.html               # single-page site
├── styles.css               # design system + components
├── scripts.js               # JSON loaders, tier switcher, reveal animation
├── netlify.toml             # publish, headers, CSP, redirects
├── netlify/functions/
│   ├── quote.js             # Tier 3 quote proxy (Polygon + Finnhub adapters)
│   └── health.js            # ops health check
├── data/                    # 10 JSON content files
├── assets/photos/           # canonical-named .jpg + .webp pairs
├── assets/filings/          # PDF disclosures (drop in as published)
├── thank-you.html           # form submit landing
├── 404.html
├── robots.txt
└── sitemap.xml
```

## Reference docs (kept at repo root)

- `INND-website-mega-prompt-v2.md` — full build spec
- `INND-research-pack.md` — verified facts (top of source-of-truth hierarchy)
- `INND-website-dossier.md` — narrative + voice
- `INND-photo-asset-manifest.md` — photo filenames + captions
- `Claude-Code-setup-for-INND.md` — first-time-user setup walkthrough
- `CLAUDE.md` — instructions for future Claude Code sessions in this repo
