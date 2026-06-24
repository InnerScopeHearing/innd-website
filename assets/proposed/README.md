# Proposed assets (not production)

These files are sample assets generated during the 2026-06 redesign
recommendations pass to prove the Designer pipeline works and to show direction.
They are proposals only. None are wired into the live site.

| File | What it is | Tool | Status |
|---|---|---|---|
| `sample-hero-soundwave.png` | Abstract brand sound wave motif for the hero or section backgrounds | Vertex Imagen 4 | Proposal |
| `sample-leader-placeholder.png` | Faceless avatar tile for empty leadership photo slots | Vertex Imagen 4 | Proposal |
| `sample-investor-welcome-vo.mp3` | Compliance checked 30 to 45 second investor welcome narration | ElevenLabs | Proposal |

Notes:

- The `.meta.json` siblings record the prompt, model, and estimated cost for each
  asset. No credentials are stored in them.
- The voiceover script is compliant: Ainnova framed as proposed and active, a
  forward looking statements pointer included, no patents, no FDA or clearance
  claims, no FY2022 figures, no em or en dashes.
- Imagen 4 is locked to a 1:1 aspect ratio in the current skill script. For wide
  hero art, generate square and crop, or adjust the aspect ratio in a build pass.
- Do not generate synthetic faces of real, named executives. Leadership headshots
  must be real, operator supplied photography.
