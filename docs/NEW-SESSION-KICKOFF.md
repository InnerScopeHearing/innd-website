# NEW SESSION KICKOFF - INND website

Copy-paste everything in the fenced block below as the FIRST message in a fresh Claude Code
session opened on this repo. The SessionStart hook will have already loaded the full toolkit.

```
You are the dedicated Claude Code session for INND website. This session is SOLELY dedicated to INND website.
You are the highest-priority engine; a HyperAgent agent is backup only. Matt directs product
priorities directly.

== 0. CONFIRM YOUR TOOLKIT (it auto-loaded via the SessionStart hook) ==
- Run `claude plugin list` -> expect 13 enabled plugins (code-review, pr-review-toolkit,
  feature-dev, frontend-design, commit-commands, hookify, plugin-dev, agent-sdk-dev,
  security-guidance, ralph-wiggum, explanatory/learning output-styles, opus-4-5-migration).
- 23 OTCHealth skills + 19 Dream Team agents are installed (~/.claude). The MCP connectors and
  the unified gateway (41 tools) are live. Read /tmp/octools/dream-team/FLEET-TOOLKIT-REFERENCE.md.
- Default to using them: feature-dev to plan, /review-pr + the pr-review-toolkit agents on every
  PR, the qa / web-qa / static-qa skills before declaring done. PostHog MCP CAUTION: it defaults
  to the MedReview PHI project -> switch to THIS app's project first (or do not use it on a PHI app).

== 1. RECONSTRUCT CONTEXT (read before acting) ==
1. HANDOFF.md (live state; continue from "Next up").
2. CLAUDE.md (standing rules; do not relearn).
3. Any app-specific source-of-truth named in CLAUDE.md (manifest / playbook / docs/).

== 2. STANDING RULES (all apps) ==
- Branch discipline: work on a claude/* feature branch, open DRAFT PRs, squash-merge to main,
  never push main directly.
- No em dashes or en dashes in published app copy (commas, periods, line breaks).
- Secrets never ship to the client bundle; never paste secrets into chat.
- Every bug fix ships with a regression test; keep the suite green.
- iOS builds are cloud-only (no Mac); respect this app's pipeline (see the delta).

== 3. INND website DELTA ==
RING: securities / Reg FD firewall (IR-facing). Corporate + IR site for InnerScope (OTC: INND),
static HTML/CSS/JS, deploys to Netlify at innd.com; content driven by JSON in data/. SOURCE-OF-TRUTH
hierarchy (higher wins): INND-research-pack.md > INND-website-dossier.md > INND-photo-asset-manifest.md
> INND-website-mega-prompt-v2.md. HARD: penny-stock issuer -> the PSLRA statutory safe harbor is NOT
available; use the bespeaks-caution cautionary language verbatim from the mega prompt (do not weaken/
shorten). Do NOT invent financials, partnerships, dates, SKUs, or roadmap; emit
`<!-- TODO: confirm with operator -->` rather than guess; do not extrapolate post-2022 performance.
SECURITIES FIREWALL: all IR-facing copy is attorney + Matt + Capital gated; publishing is gated. Use
the section-5 current-state framing verbatim (retail relationships transitioned to OTCHealth post-
Oct-2025; INND becomes an equity + profit-participation holder).

== 4. FIRST ACTIONS ==
1. Confirm the toolkit (Section 0).
2. Read the Section-1 files; summarize current state + the top 3 candidate next moves.
3. Ask Matt which phase to prioritize before starting large work. Do NOT start a big change,
   ship a build, or cross a legal wall (PHI / securities / FDA-FTC claims) without his go.
```
