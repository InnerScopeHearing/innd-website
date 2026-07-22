# HANDOFF - innd-website

> Living memory for this project. A fresh Claude Code session reads this first and
> continues from "Next up". Update before you stop.

> **Status catch-up (2026-07-22, doc-hygiene pass):** this doc's "Last updated" line
> below is 2026-06-14 and its "Next up" item ("read the mega prompt, confirm the
> section 17 deliverables with Matt before publishing anything") reads as still
> pending. It is not. Verified directly against the repo (`git log`, `CHANGELOG.md`,
> `index.html`): the site was fully built and committed that same day (2026-05-04,
> per `CHANGELOG.md`'s v1.0.0 entry, "24-file site bundle parsed and committed"),
> then iterated through a v1.1.0 design-polish release and a v1.2.0 "shareholder
> engagement" release (2026-05-21), had its staging `noindex` tag removed in a
> commit titled "Remove noindex from homepage for production launch on innd.com"
> (2026-05-22), and kept receiving live content commits (iHEARtest beta promo, IR
> phone numbers, leadership bios, a One Brain persona block in `CLAUDE.md`) through
> 2026-07-03. `CLAUDE.md`'s "Project state" section has been corrected to reflect
> this in the same pass that added this note. Not independently re-verified this
> pass: whether the public `innd.com` apex DNS has actually been cut over from its
> OTCHealthMart.com redirect to Netlify (see the TODO comment left in `CLAUDE.md`'s
> "Project state" section); that is a live-network fact this session cannot check.
> The `INND-website-mega-prompt-v2.md` / `INND-research-pack.md` /
> `INND-website-dossier.md` / `INND-photo-asset-manifest.md` docs referenced below
> and in `CLAUDE.md`'s source-of-truth hierarchy are not present anywhere in this
> repo's git history; if they still exist, they live outside this repo.

**Last updated:** 2026-06-14 by Claude Code CTO (session kit + toolkit-ready)

## CURRENT STATE
InnerScope (OTC: INND) corporate + IR site. Static HTML/CSS/JS, deploys to Netlify (innd.com),
content driven by JSON in data/. See INND-website-mega-prompt-v2.md for the build spec and the
source-of-truth hierarchy. SECURITIES FIREWALL: all IR-facing copy is attorney + Matt + Capital
gated; the PSLRA safe harbor is NOT available to penny-stock issuers (use bespeaks-caution
language verbatim). Do not invent financials/partnerships/dates; emit TODO comments instead.

## Next up
- Read INND-website-mega-prompt-v2.md and the source-of-truth docs; confirm the build deliverables
  in section 17 with Matt before publishing anything.

## Toolkit
See docs/NEW-SESSION-KICKOFF.md and the note below.
