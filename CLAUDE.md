# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Greenfield. No site code exists yet. The repo currently contains only the four planning/reference docs and four raw source photos. The first build session is expected to follow the spec in `INND-website-mega-prompt-v2.md` and produce the deliverables listed in §17 of that document.

The site is **InnerScope Hearing Technologies, Inc. (OTC: INND)** — a corporate + investor-relations site that will deploy to Netlify at https://innd.com. Static HTML/CSS/JS, no frontend framework. Content driven by JSON files in `data/` so a non-engineer can update via Cowork chat without touching code.

## Source-of-truth hierarchy

When facts conflict, **higher in this list wins** — do not silently overwrite from a lower-priority source:

1. `INND-research-pack.md` — verified, sourced facts (press release dates, deal terms, financials, compliance findings).
2. `INND-website-dossier.md` — narrative, voice, soft details.
3. `INND-photo-asset-manifest.md` — image filenames, captions, alt text, treatment notes.
4. `INND-website-mega-prompt-v2.md` — structure, design system, technical spec, compliance copy, deliverables.

If the operator's instructions contradict any of the above, surface the conflict before acting.

## Anti-hallucination rules (load-bearing)

- Do not invent financial projections, partnerships, dates, SKUs, or roadmap items.
- Do not contradict verified press release dates or the Ainnova / OTCHealth deal terms in the research pack.
- For anything uncertain, emit `<!-- TODO: confirm with operator: <what> -->` in the HTML and continue rather than guessing.
- The dossier's financial summary stops at 2022. **Do not extrapolate post-2022 performance** — no audited 2023+ numbers are public.

## Critical narrative pivot (don't get this wrong)

Post-October 2025, the retail relationships InnerScope built (Walmart, CVS, Target, Walgreens, 15,000+ independent pharmacies) **transition to OTCHealth** as part of Ainnova Tech's acquisition. INND becomes an equity + profit-participation holder in both OTCHealth and Ainnova, and refocuses on hearing-technology R&D.

Old framing ("Walmart's largest hearing-aid supplier") is true *historically* but misleading as a current-state claim. Use the §5 "Where INND is today" copy in the mega prompt verbatim (operator may tighten language but not substance), and mark it `<!-- TODO: confirm with IR before publish: language reviewed by counsel -->`.

## Compliance is not optional

INND is a penny-stock issuer. The PSLRA statutory safe harbor (15 U.S.C. §77z-2 / §78u-5) **is not available** to penny-stock companies. The site relies on the judicially-created "bespeaks caution doctrine," which requires meaningful, company-specific cautionary language — boilerplate is insufficient.

- Use the §14.1 forward-looking-statements block verbatim in `data/disclaimers.json`. Do not weaken, shorten, or boilerplate it.
- Mark the disclaimer block with `<!-- TODO: legal review required before publish -->`.
- Above any forward-looking content, render the §14.2 short-form callout linking to the footer.
- Use the §8.6 quote-delay disclosure copy verbatim adjacent to any ticker or chart.

## Build deliverables (mega prompt §17)

When asked to build, produce in a single pass:
