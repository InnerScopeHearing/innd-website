# Changelog

All notable changes to the INND.com website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-04-25

Initial public-ready build of INND.com per `INND-website-mega-prompt-v2.md`.

### Added

- Single-page corporate + investor-relations site (10 sections: Hero, Legacy, Growth Timeline, Where INND is Today, Brands & Solutions, Market Opportunity, Leadership, Investor Relations, Contact & Partnerships, Footer).
- JSON-driven content via `data/*.json` (10 files) so non-engineers can update copy without code changes.
- TradingView Tier 1 ticker (hero) + advanced chart (IR section), each with adjacent quote-delay disclosure.
- Netlify Function `quote.js` — Polygon.io primary + Finnhub fallback adapters for Tier 3 real-time quotes (skeleton, inactive at v1 ship).
- Netlify Function `health.js` — build SHA + provider status for ops verification.
- Pre-populated `data/press-releases.json` with 12 verified items spanning May 2021 → October 2025.
- Pre-populated `data/financial-highlights.json` with 2021–2022 figures (no post-2022 extrapolation).
- Verbatim §5 "Where INND is today" copy describing the Ainnova / OTCHealth strategic alliance and INND's R&D refocus.
- Substantive forward-looking-statements block in `data/disclaimers.json` consistent with the "bespeaks caution" doctrine for penny-stock issuers (PSLRA safe harbor unavailable).
- Sub-penny price formatter (4 decimals) with rounding footnote for Tier 3 widget output.
- Photo normalization pipeline producing canonical manifest filenames as JPG + WebP companions.
- `netlify.toml` security headers (HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) and redirects (`www` → apex 301, `/news-releases/*` → `/#ir` 301 catch-all for legacy backlinks).
- `robots.txt`, `sitemap.xml`, `thank-you.html`, `404.html`.
- Netlify Forms for IR inquiries and partnerships (honeypot + thank-you redirect).
- `:focus-visible` styling, skip-to-main link, semantic landmarks, `prefers-reduced-motion` support.
- JSON-LD `Organization` schema in `<head>`.
- README with deploy instructions, env var reference, content-update workflow, and aggregated TODOs blocking public launch.

### Known limitations / aggregated TODOs

- Legal review of forward-looking-statements block required before public launch.
- IR confirmation that "Where INND is today" language has been counsel-reviewed.
- Email addresses (`ir@`, `partnerships@`, `info@innd.com`) need provisioning.
- Open Graph image and favicon are placeholders.
- Leadership section ships with Matt only; additional bios pending.
- Three press release items (HearingAssist on Walgreens.com, Walmart Canada launch, $277K Walmart POs) shipped as a documented micro-note pending canonical wire URLs.
- SEC EDGAR link is a search query (replace with CIK-keyed canonical URL once confirmed).
- Annual report PDFs not yet present in `/assets/filings/`.
- Polygon.io API key required before flipping to Tier 3.
- Original (pre-rename) photo files left in `assets/photos/` — delete once canonical-named copies are verified rendering.
