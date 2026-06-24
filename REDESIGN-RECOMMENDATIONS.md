# INND.com Redesign Recommendations

Prepared for InnerScope Hearing Technologies, Inc. (OTC: INND)
Date: 2026-06-03
Branch: `design/recommendations-2026-06`
Scope: recommendations only. No site rebuild, no changes to `main`, no deploy.

This report walks the live site section by section and proposes upgrades across
four lenses: written content, imagery, voiceover, and motion. Every image
recommendation includes a ready to run generation prompt, a target size, and a
destination path under `assets/`. Voiceover recommendations include a short
script direction and a suggested ElevenLabs voice style. Animation
recommendations name the technique and stay restrained for an investor audience.

## How to read this

Each section has one table. Each row is a single recommendation, tagged by lens
(content, image, VO, or animation), with a priority and a rough effort estimate.

- Priority: P0 is a visible defect or compliance gap to fix first, P1 is high
  impact polish, P2 is nice to have.
- Effort: S is under an hour, M is a half day, L is a day or more.

---

## Pipeline verification

Before the audit, both generation paths were proven end to end through the
Designer skill.

| Path | Result | Notes |
|---|---|---|
| Image generation | PASS via Vertex Imagen 4 (`imagen-4.0-generate-001`). A 1024x1024 PNG rendered cleanly. | The default OpenAI GPT-image-1 route returned `moderation_blocked` twice on entirely benign prompts. This looks like an account level moderation setting, not a prompt problem. Recommendation: route image work through Imagen 4 for now and open a ticket with OpenAI about the moderation flag. |
| Voiceover | PASS via ElevenLabs (`eleven_v3`). A valid MP3 rendered. | Default voice was Rachel (warm female). A lower, calmer narrator voice is recommended for IR copy. See per section notes. |

Three sample assets were generated to show the pipeline working. They live in
`assets/proposed/` and are clearly labeled as proposals, not production art:

1. `sample-hero-soundwave.png`, an abstract brand sound wave motif (Imagen 4).
2. `sample-leader-placeholder.png`, a faceless avatar tile for empty leader slots (Imagen 4).
3. `sample-investor-welcome-vo.mp3`, a compliance checked investor welcome narration (ElevenLabs).

Note on Imagen 4: the model is locked to a 1:1 aspect ratio in the current
skill script, and it tends to insert literal text if a prompt contains hex
color codes or stray labels. Prompts below are written to avoid both. For wide
hero art, generate square and crop, or adjust the script aspect ratio in a later
build pass.

---

## Top five highest impact moves

1. Fill the three empty leadership photos. `leadership.json` ships all three
   leaders with `photo: null`, so the leader cards render as text only on a page
   whose whole story is a family. This is the single most visible gap. Best path
   is real, operator supplied headshots. If those are not ready, ship the
   branded faceless placeholder now so the layout reads as intentional. P0.

2. Fix the broken favicon and the missing social share image. `index.html`
   links `/assets/favicon.svg`, which does not exist, and the Open Graph and
   Twitter image tags are commented out. Every share of innd.com currently
   unfurls with no image. Both are quick, high return fixes. P0.

3. Give Business Highlights real imagery. All four items in
   `business-highlights.json` have `image: null`, so the section is a wall of
   text cards. Even two strong visuals would lift it. P1.

4. Add restrained number count ups to Track Record and Market Opportunity. The
   strongest proof points (three generations, more than 70 clinics, 4,218
   Walmart stores, roughly 45,000 shareholders) currently sit as plain text. A
   tasteful count up on scroll makes them register. P1.

5. Add a short investor welcome voiceover and an About founder narration.
   A 30 to 45 second welcome humanizes the IR story and a founder narration over
   the Legacy section deepens the family throughline. Both keep INND distinct
   from boilerplate penny stock sites. P1.

---

## Global and cross cutting

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Favicon | `index.html` line 22, `assets/` | Links `/assets/favicon.svg`, file does not exist. Browser tab shows a default glyph. | Create a real favicon from the INND mark. An SVG plus a 32x32 and 180x180 PNG (apple touch) covers all targets. | image | Prompt: "A minimal app favicon for a hearing technology company. A single teal concentric sound wave arc forming a stylized letter shape on a deep navy rounded square. Flat, crisp at small sizes, no text, no gradients." Target 1024x1024 master, downscale to favicon.svg plus 32x32 and 180x180. Path `assets/favicon.svg` and `assets/icons/`. | P0 | S |
| Social share | `index.html` lines 16, 20, 23 | `og:image` and `twitter:image` are commented out. Shares unfurl with no image. | Build a 1200x630 OG card: the 1989 family clinic photo, the INND wordmark, and a one line ticker label. Then re-enable the meta tags. | image | Compose with `compose-screenshot.mjs` or generate a background then overlay the wordmark. Background prompt: "A warm, premium investor brand banner background. Deep navy field with a faint teal sound wave motif in the lower third, generous clear space in the upper area for a logo. No text, no people." Target 1200x630. Path `assets/og/innd-og-1200x630.png`. | P0 | M |
| Motion system | `styles.css`, `scripts.js` | `data-reveal` fade on scroll plus a Ken Burns hero. Good baseline. No count ups, no stagger. `prefers-reduced-motion` is already honored for the hero. | Standardize a motion layer: stagger child reveals inside grids, add a count up utility, and keep every effect gated behind `prefers-reduced-motion`. | animation | Add a small IntersectionObserver count up helper in `scripts.js` plus a `data-countup` attribute. Stagger via CSS `transition-delay` keyed to `:nth-child`. | P1 | M |
| Typography | `styles.css` | Fraunces display plus Inter body, oxblood and teal accents. Strong, distinctive, already premium. | Keep the type system. No change needed. Optionally tighten hero headline tracking on large screens. | content | None. | P2 | S |

---

## 1. Promo bar (iHEARtest beta)

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Promo bar | `index.html` lines 45 to 67 | Dismissible top bar driving to the iHEARtest beta, 75 tester spots. Clean and functional. | Copy is fine. Consider a subtle live counter of remaining spots if the data is available, otherwise leave static. | content | If tester count is known, swap "one of 75 tester spots" for "X of 75 spots left". Only if the number can be kept current. | P2 | S |
| Promo bar | `styles.css` | Static pill and arrow. | Add a one time gentle slide down on first load only, not on every scroll. Respect reduced motion. | animation | CSS keyframe `translateY(-100%)` to `0` over 300ms on load. Gate behind `prefers-reduced-motion`. | P2 | S |

---

## 2. Hero

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Hero | `data/hero.json`, `index.html` lines 98 to 112 | Strong headline and subhead. Background is the 1989 clinic photo with a Ken Burns pan. TradingView ticker on the right with delay disclosure. | Copy is strong. Keep it. The subhead is slightly long, consider trimming the final clause for rhythm on mobile. | content | Optional: shorten "building patiently, through every cycle, with a long view" to "building patiently, with a long view." | P2 | S |
| Hero | `styles.css` line 208 | Hero photo is good but soft at large widths and the focal point sits center 35 percent. | Layer the abstract sound wave motif as a faint foreground texture above the photo gradient to add depth and tie the brand mark to the masthead. | image | Use `assets/proposed/sample-hero-soundwave.png` as a starting point. Production prompt: "Abstract minimal vector overlay, thin concentric teal sound wave arcs radiating from the lower left across a transparent field, one thin oxblood accent arc, lots of empty space, no people, no text." Target 1600x1000, set low opacity over the existing gradient. Path `assets/hero/soundwave-overlay.png`. | P1 | M |
| Hero | `index.html` line 108 | Ticker widget loads with a plain Loading state. | Add a soft skeleton shimmer while the widget mounts so the masthead never looks empty. | animation | CSS shimmer on `.tv-widget-mount` until the iframe loads. Pure CSS gradient sweep, 1.2s loop, reduced motion safe. | P2 | S |
| Hero | new `assets/proposed/sample-investor-welcome-vo.mp3` | No audio anywhere on the site. | Add an optional, muted by default investor welcome audio control near the hero or in the IR section. 30 to 45 seconds. Never autoplay. | VO | Script direction: warm, calm, measured, lower register male or female narrator, unhurried pace. Must open with the ticker, state the family throughline, note the Ainnova alliance as proposed and active, and close with a forward looking disclaimer pointer. A compliant draft is already rendered in `assets/proposed/sample-investor-welcome-vo.mp3`. ElevenLabs voice style: calm corporate narrator, stability 0.6, style 0.2. | P1 | M |

---

## 3. iHEARtest beta showcase band

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| iHEARtest band | `index.html` lines 114 to 138 | Polished band with logo, phone mockup, real app screenshot, glow. Strongest visual block on the page. | Leave the design. Make sure the "Shipping now" and "private beta" framing stays in sync with the actual App Store status so it never overstates. | content | Review before each deploy. Keep "private beta" until public launch. No clearance or medical claims. | P1 | S |
| iHEARtest band | `iheartest/assets/` | Single phone screen shown (`screen-home.webp`). | Rotate two or three of the existing screens (`screen-test`, `screen-results`) in the phone frame on a slow timer or on hover to show range without new art. | animation | CSS crossfade between stacked `img` layers, 4s interval, pause on reduced motion. Uses assets already in the repo. | P2 | M |
| iHEARtest band | `styles.css` | Static glow behind the phone. | Add a slow breathing scale to `.ihb-glow` to make the band feel alive without distraction. | animation | CSS keyframe scale 1.0 to 1.06 over 6s ease in out alternate. Reduced motion safe. | P2 | S |

---

## 4. Legacy (Three generations)

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Legacy | `data/legacy.json` | Two authentic period photos (1950s Posey, 1989 clinic) with strong captions. Warm, well written body copy. | Content is excellent. No rewrite needed. Optionally add one short pull quote to break the prose. | content | Optional pull quote drawn from the existing copy, for example "Treat every patient like a neighbor." Set as a styled blockquote between paragraphs. | P2 | S |
| Legacy | `assets/photos/` | Only two archival images. Both already used. | If the family has more archival photography (clinic storefront, early hearing aids, Florida locations), add a small captioned strip. Do not generate fake archival photos. Real provenance only. | image | No generation. Operator to supply scans. Mark with a TODO if not available. | P1 | M |
| Legacy | `data/legacy.json` | Family throughline is the emotional core of the brand. | Add a founder narration that plays over the Legacy photos as an optional listen. Keep it personal and free of any financial claim. | VO | Script direction: first person reflective tone, gentle, unhurried. Cover the 1950s practice, raising the family inside the clinics, and the conviction that affordable hearing care matters. No numbers, no forward looking statements, no product claims, so it stays outside the disclaimer surface. ElevenLabs voice style: warm, intimate, older narrator, stability 0.65, style 0.25. | P1 | M |
| Legacy | `styles.css`, `scripts.js` | Photos fade in with `data-reveal`. | Add a subtle parallax or slow zoom on the hero archival photo as it enters, echoing the masthead Ken Burns. | animation | Light JS or CSS scroll linked transform, max 4 percent scale. Gate behind reduced motion. | P2 | M |

---

## 5. About us

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| About | `data/about.json` | Three tight paragraphs, well sourced narrative. Correctly frames the 2016 sale as to Helix Hearing Care, the Widex affiliated retail group. | Strong. Keep the Helix framing exactly as written. No direct sale to Widex anywhere. | content | No change. Compliance note: preserve "Helix Hearing Care, the Widex affiliated retail group" wording. | P1 | S |
| About | `index.html` lines 173 to 181 | Pure text section, no visual anchor. | Add one warm, abstract supporting visual or a simple animated timeline ribbon so the section is not text only between two photo rich sections. | image | Prompt: "A warm abstract illustration suggesting three generations and continuity, three soft overlapping circles in cream, teal, and muted oxblood on a light background, minimal, no faces, no text, premium editorial style." Target 1024x1024, crop to a banner. Path `assets/about/continuity.png`. | P2 | M |
| About | `data/about.json` | The founder story is ideal narration material. | Reuse or extend the Legacy founder narration here, or add a 20 second "why we built InnerScope" clip. | VO | Script direction: conviction led, plain spoken. Focus on access and dignity, not financials. ElevenLabs voice style: warm founder narrator. | P2 | S |

---

## 6. Track Record

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Track record | `data/track-record.json` | Ten strong bullet proof points. Plain unordered list. | Restructure the list visually into a proof grid, and split the quantified claims so the numbers can animate. Keep all wording. | content | No copy change. Group into a grid of cards or a two column list for scannability. | P1 | M |
| Track record | `index.html` line 190 | Static `ul`. | Add count up animation to the four quantified claims: three generations, more than 70 clinics, 4,218 Walmart stores at the 2023 launch, roughly 45,000 shareholders. | animation | `data-countup` on each number, IntersectionObserver triggers once, 1.2s ease out, respects reduced motion. Keep the qualifier words ("more than", "roughly") static so precision claims stay accurate. | P1 | M |
| Track record | none | Text only section. | Optional: a small set of monochrome retailer wordmark chips (where usage rights allow) to visually anchor the distribution claim. Confirm trademark usage rights first. | image | No generation. Use official brand assets only with permission. Mark TODO for legal sign off. | P2 | M |

---

## 7. Growth Timeline

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Timeline | `data/timeline.json` | Eight clear milestones from 1950s to 2025. Well written. The 2025 Ainnova entry correctly says "announced acquisition" and "receiving equity and profit participation rights." | Content is accurate and compliant. Keep the pending framing on the Ainnova milestone. | content | No change. Compliance note: never upgrade "announced" or "proposed" to "completed" on the Ainnova milestone. | P1 | S |
| Timeline | `index.html` line 201, `styles.css` | Renders as an ordered list, reveals as one block. | Animate the timeline as a progressive draw: the connecting line grows and each node fades in in sequence as the user scrolls. | animation | Scroll linked line draw via CSS `scaleY` on a pseudo element plus staggered node reveals with `transition-delay`. Reduced motion falls back to a static list. | P1 | M |
| Timeline | none | No icons or imagery per milestone. | Add a small consistent icon per milestone era (practice, family, public markets, acquisitions, OTC rule, retail, ecommerce, alliance). A style locked icon batch keeps them consistent. | image | Use `gen-icon-batch.mjs` for one matching set. Prompt seed: "A set of minimal line icons in a single consistent style, teal stroke on transparent, for a corporate timeline: a storefront, a family, a stock chart, a handshake, a document, a retail shelf, a shopping cart, an alliance link. No text." Target 256x256 each. Path `assets/icons/timeline/`. | P2 | M |

---

## 8. Where INND is today (current chapter)

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Current | `data/current-chapter.json` | Disciplined, compliant copy. Forward looking callout present. October 2025 Ainnova alliance described as proposed and active. Counsel review TODO present. | Keep as is. This is the most compliance sensitive prose on the site and it is well handled. Do not weaken the disciplined tone. | content | No change. Keep the forward looking callout and the counsel review TODO until sign off. | P0 | S |
| Current | `index.html` lines 206 to 217 | Text plus link list. Visually plain. | Add a quiet visual divider, the brand sound wave motif at low opacity, to separate this disciplined section from the more promotional ones around it. | image | Reuse `assets/proposed/sample-hero-soundwave.png` at low opacity as a section background. No new generation required. | P2 | S |
| Current | none | No motion. | Keep this section deliberately still. Restraint here signals seriousness to investors. At most, the standard reveal fade. | animation | No extra animation. Intentional. | P2 | S |

---

## 9. Brands and solutions

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Brands | `data/brands.json` | Two brand cards, HearingAssist and iHEAR plus iHEAR Matrix. Correctly routes purchase through OTCHealth and OTCHealthMart. No patent language. | Content is solid and compliant. Keep the OTCHealth operating framing. | content | No change. Compliance note: keep "operated today by OTCHealth" and avoid any patent or clearance claims. | P1 | S |
| Brands | `index.html` line 227, `scripts.js` `renderBrands` | Brand cards are text only. No logos or product imagery. | Add a brand logo or a clean product visual to each card. If official brand logos exist, use those. Otherwise a neutral product silhouette. | image | If no official logos, prompt: "A clean studio product visual of a small modern over the counter hearing aid and charging case on a soft neutral background, premium ecommerce style, no text, no logos, no packaging claims." Target 1024x1024. Path `assets/brands/`. Confirm any product shown matches a real SKU before publish, otherwise keep it abstract. | P1 | M |
| Brands | `scripts.js` `renderBrands` | Cards reveal together. | Stagger the two cards on entry and add a gentle lift on hover. | animation | CSS `transition-delay` stagger plus a 2px translateY hover with shadow. Reduced motion safe. | P2 | S |

---

## 10. Business Highlights

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Highlights | `data/business-highlights.json` | Four strong proof items. All four have `image: null`. Two already have `image_alt` written, ready for art. The renderer in `scripts.js` already supports an image per item. | Add imagery to at least the two items that already have alt text. This is the biggest "would land harder with a visual" gap on the page. | image | Item "HearingAssist on the Walmart shelf": prompt "A clean retail shelf scene of an over the counter hearing aid product display in a bright modern pharmacy aisle, no readable brand text, no logos, no people, soft realistic lighting." Item "iHEAR Matrix in national retail": prompt "A modern over the counter hearing aid retail display stand in a large store, clean, bright, no readable text, no logos, no people." Target 1200x900 each. Path `assets/photos/` so the existing `renderBusinessHighlights` picks them up by filename. Note: the renderer expects a `.jpg` filename in the `image` field. | P1 | M |
| Highlights | `data/business-highlights.json` | "The iHEARtest at-home hearing screener" item has no image. | Reuse an existing iHEARtest app screenshot from `iheartest/assets/` rather than generating new art for this one. | image | Point the item image at an existing `screen-test.webp` style asset, or copy one into `assets/photos/`. No generation cost. | P2 | S |
| Highlights | `index.html` line 239 | Cards reveal as one block, text heavy. | Once images are added, stagger card reveals and let each image do a subtle zoom in on entry. | animation | Staggered reveal plus a 3 percent image scale on enter. Reduced motion safe. | P2 | S |

---

## 11. Market Opportunity

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Market | `index.html` lines 243 to 265 | Three column copy block. Hardcoded in HTML, not in a JSON file like the rest of the site. Copy is careful: "tens of millions" rather than a hard number, OTC tailwind framed correctly. | Move this copy into a `data/market.json` file for consistency with the data driven pattern, so a non engineer can edit it. Keep the cautious framing. | content | New `data/market.json` plus a `renderMarket` function mirroring the others. Keep "tens of millions" soft phrasing. | P2 | M |
| Market | `index.html` line 250 | Plain three column text. | Add count ups to any figure that becomes a hard number (for example the 90,000 pharmacy locations cited in the next section). Keep soft phrasings static. | animation | Same `data-countup` utility. Only attach to defensible hard numbers with a source. | P1 | S |
| Market | none | No supporting visual. | A single restrained data visual, for example a simple stylized bar contrast of adults with hearing loss versus adults using hearing aids, would make the underserved market claim land. Keep it schematic, not a fake precise chart. | image | Prefer a hand built SVG over a generated image so the proportions are accurate and not invented. Mark the data source inline. | P2 | M |

---

## 12. What's next (Where we're headed)

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| What's next | `index.html` lines 267 to 295 | Four column forward looking block with the correct forward looking callout. Cites more than 90,000 pharmacy locations. Hardcoded in HTML. | Move to `data/whats-next.json` for editability. Keep the forward looking callout. Keep the pharmacy ambition framed as a goal, not a commitment. | content | New JSON plus renderer. Preserve the callout and the "white space we are most focused on" framing. | P2 | M |
| What's next | `index.html` line 293 | Links to the shareholder signup and the 50 dollar credit. | Keep. The CTA bridge to the signup is good. Ensure the 50 dollar credit terms stay consistent with the footer micro note. | content | No change. Keep credit terms aligned across sections. | P1 | S |
| What's next | none | Text only. | A single forward leaning but abstract visual, the pharmacy counter as the next hearing counter, would anchor the lead idea. Keep it conceptual, no real storefront, no claims. | image | Prompt: "A warm abstract illustration of a friendly pharmacy counter concept, soft shapes, a subtle hearing wave motif above the counter, cream and teal palette, no readable text, no logos, no people." Target 1024x1024. Path `assets/whats-next/`. | P2 | M |

---

## 13. Leadership

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Leadership | `data/leadership.json` | All three leaders have `photo: null`. The family group hero photo is present, but the individual cards render as text only. This is the most visible content gap on a site whose whole identity is a family. | Add a headshot for each of Matthew, Kimberly, and Mark Moore. Strongly prefer real, operator supplied photography. Do not generate synthetic faces of real, named executives. | image | No generation of real people. Operator to supply three headshots, ideally a matched set, around 800x800, square, neutral background. Path `assets/photos/leaders/`. Wire each into the `photo` field and update `renderLeadership` to render the image. | P0 | M |
| Leadership | `data/leadership.json`, `scripts.js` `renderLeadership` | The renderer does not currently output an image element for leaders even if `photo` were set. | Until real headshots arrive, ship a branded faceless placeholder so the cards look intentional rather than broken. A sample is in `assets/proposed/sample-leader-placeholder.png`. | image | Use the proposed placeholder tile. Update `renderLeadership` to render `photo` when present and fall back to the placeholder when null. Replace with real photos when supplied. | P0 | S |
| Leadership | `data/leadership.json` `additional_leaders_note` | Carries a TODO: operator to supply names, titles, photos, and bios for the rest of the leadership and advisory team. | Collect and add the remaining leadership and advisory bios, or remove the note before publish if the three named leaders are the full team. | content | Operator action. Either populate or remove. Do not invent names or titles. | P1 | S |
| Leadership | `data/leadership.json` | Bios are detailed and well written. Mark Moore bio mentions a private label line licensed to Oticon, ReSound, and Widex. | Confirm this licensing history is accurate and approved for the public site, since it names third parties. Keep if verified. | content | Operator and counsel to confirm the named licensing relationships before publish. | P1 | S |
| Leadership | `index.html` line 313 | Leader cards reveal together. | Stagger the three cards on entry and align the new headshots to a consistent crop and ring treatment. | animation | Staggered reveal plus a consistent circular crop. Reduced motion safe. | P2 | S |

---

## 14. Investor Relations

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| IR | `index.html` lines 318 to 399 | Rich section: filings links, TradingView chart, stock at a glance, financial results pointer, press list, a real Nasdaq photo, and an inquiry form. Quote delay disclosures present. | Strong and compliant. Keep the delayed quote disclosures adjacent to every quote and chart. | content | No change. Keep delay disclosure copy adjacent to all market data. | P0 | S |
| IR | `index.html` line 331 | SEC EDGAR link has a TODO to confirm the canonical URL. Annual report PDFs are "coming soon" with a TODO to drop them into `assets/filings/`. | Confirm the canonical EDGAR URL and add the annual report PDFs to `assets/filings/`, then link them. The directory already exists with a README. | content | Operator to supply PDFs and confirm EDGAR URL. Do not link financial figures without the underlying filing. | P1 | M |
| IR | `data/press-releases.json`, `index.html` line 365 | Twelve press releases. A micro note flags that several historical retail launches lack canonical wire URLs. | Source the canonical wire URLs for the pending releases (Walgreens.com, Walmart Canada, additional Walmart purchase orders) and add them, or leave the honest micro note. | content | Operator to supply URLs. Never link to a non canonical or dead source. | P1 | M |
| IR | `index.html` line 369 | One real photo, Matthew Moore at Nasdaq 2021. Good. | Keep the real photo. If more authentic IR or event photography exists, add a small gallery. No synthetic event photos. | image | No generation. Operator to supply real photography only. | P2 | M |
| IR | new | The IR section is text and data heavy. | Add the optional investor welcome voiceover here as a small, clearly labeled audio control. Muted by default, never autoplay. Reuse the sample in `assets/proposed/`. | VO | Script already drafted and rendered in `assets/proposed/sample-investor-welcome-vo.mp3`. Keep the forward looking disclaimer pointer in the script. ElevenLabs voice style: calm corporate narrator. | P1 | S |
| IR | `index.html` line 336, `scripts.js` | TradingView chart and the custom quote card. Quote card has a live dot and status pill. | Add a count up on the headline price when the quote first loads, and a soft pulse on the live dot only. Keep it subtle so it never looks like a meme stock site. | animation | Count up the price over about 600ms on first load. Slow opacity pulse on the `.live-dot`. Reduced motion safe. Do not animate the chart itself. | P2 | S |

---

## 15. Shareholder updates and 50 dollar credit

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Signup | `index.html` lines 403 to 434 | Email capture with consent, a 50 dollar OTCHealthMart welcome credit, honeypot, and a compliant micro note that updates contain only public information and are not investment advice. | Keep the compliance micro note exactly. It is doing important work. | content | No change. Preserve the "only publicly available information and are not investment advice" line. | P0 | S |
| Signup | `index.html` line 408 | The 50 dollar credit is a strong hook but visually plain. | Add a small, honest visual badge for the welcome credit. Keep terms consistent with the footer micro note. | image | Prompt: "A small flat badge graphic, a soft teal rosette or tag shape, no text baked in, premium and restrained, transparent background." Target 512x512. Path `assets/badges/`. Render the dollar amount as live HTML text over it, not baked into the image, so terms can change. | P2 | S |
| Signup | `scripts.js` lines 477 to 506 | On submit, the form swaps to a thank you message. Functional. | Add a gentle success transition (fade and check mark) instead of an instant text swap, so the reward moment feels earned. | animation | CSS fade plus a simple animated SVG check. Reduced motion shows the static confirmation. | P2 | S |

---

## 16. Contact and partnerships

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Contact | `index.html` lines 436 to 477, `data/contacts.json` | Three contact lanes (IR, partnerships, general) with emails and phones, plus a partnerships form. Clean. `contacts.json` carries a TODO to confirm the inboxes are provisioned and monitored. | Confirm all three inboxes are live and monitored before publish, then clear the TODO. | content | Operator to confirm ir@, partnerships@, info@ are provisioned and monitored. | P1 | S |
| Contact | `index.html` line 444 | Three text columns, no visual. | Optional: a small location or map motif for Roseville, California, kept abstract and lightweight. Low priority. | image | Prefer a simple static styled element over a generated map image to avoid stale or inaccurate map art. | P2 | S |
| Contact | `index.html` line 462 | Form reveals as a block. | Light field focus transitions and a submit success state consistent with the shareholder form. | animation | Shared form interaction styles. Reduced motion safe. | P2 | S |

---

## 17. Footer and disclaimers

| Section | File | Current state | Recommendation | Lens | Suggested spec or prompt | Priority | Effort |
|---|---|---|---|---|---|---|---|
| Footer | `data/disclaimers.json`, `index.html` lines 481 to 508 | Full forward looking statements block, penny stock and safe harbor caution, quote delay disclosure, last updated date. Legal review TODO present. Correctly states the PSLRA safe harbor may not apply. | Do not touch the disclaimer copy except through counsel. Keep the legal review TODO until sign off. Keep the bespeaks caution style, company specific language. | content | No change without legal. This block is load bearing for compliance. | P0 | S |
| Footer | `index.html` line 506 | `last-updated` is hardcoded to 2026-05-04 in the markup while the year span is dynamic. | Confirm the last updated date is refreshed on each publish, or wire it to build time so it never goes stale. | content | Small build step or manual discipline. Keep it accurate. | P1 | S |
| Footer | `styles.css` | Static footer. | No animation. The footer should stay calm. At most, keep the existing reveal. | animation | No change. Intentional restraint. | P2 | S |

---

## Compliance checklist applied to this report

Every recommendation above was written against these constraints.

- Zero patents. No mention of any patents anywhere in this report or in any
  generated copy or voiceover.
- Ainnova is treated as a proposed and active transaction, never completed.
- No FDA clearance or 510(k) language tied to current entities.
- Widex appears only as Helix Hearing Care, the Widex affiliated retail group,
  never as a direct sale to Widex.
- No FY2022 dollar figures appear. Any financial figure must be quoted exactly
  as reported with a link to the filing.
- INND is not described as a shell company.
- No em dashes and no en dashes appear in this report, in the generated copy
  suggestions, or in the voiceover script. Commas, periods, and line breaks only.

## Suggested sequencing

1. P0 visible and compliance items first: leadership photos or placeholder,
   favicon, OG image. These are quick and high return.
2. P1 content completeness: business highlights imagery, count ups on proof
   points, EDGAR and PDF links, investor welcome and founder voiceover.
3. P2 polish: motion refinements, brand motif overlays, JSON migration of the
   two hardcoded sections, icon batches.

None of these should be built in this pass. This is the recommendation phase.
