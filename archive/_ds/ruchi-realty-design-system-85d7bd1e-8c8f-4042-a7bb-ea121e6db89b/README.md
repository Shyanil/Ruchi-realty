# Ruchi Realty — Design System

A reusable, lightweight design system distilled from the official **Ruchi Realty Brand Guidelines (V3, 2024–25)**. It contains the visual foundations, content rules, tokens, and reference component cards suitable for marketing collateral, sales materials, and product surfaces.

> **Tagline:** *Committed to You.*

---

## About the brand

**Ruchi Realty** is a Kolkata-based real-estate developer (registered office: 54, 10 D. C. Dey Road, near ITC Sonar, Tangra, Kolkata 700015, West Bengal, India — `ruchirealty.com`). The brand positions itself as a **"Creator"** — not a builder of products but a maker of *environments*, with intent, care, and longevity. Every word of the brand book returns to one promise: *Committed to You.*

The brand voice is intentional, calm, and human. Visuals are sparse and cinematic — dark, restrained surfaces, with a signature olive-lime accent and a custom **R** monogram that ties to the wordmark.

---

## Sources

This design system was built from a single source document the user provided:

- `uploads/BRAND Guideline_V3.pdf` — Ruchi Realty Brand Guidelines V3 (36 pp).
  Extracted assets (raw, for reference) live in `assets/photography/`.

**No codebase, Figma file, or website was provided.** Everything here is derived from the brand book — tokens, voice rules, and reference component cards in `preview/`. Flag any divergence and we will revise.

---

## Index — what's in this folder

```
README.md                ← you are here
SKILL.md                 ← Agent Skills entry point (Claude Code compatible)
colors_and_type.css      ← all design tokens (colors, type, spacing, motion)
assets/
  logo-lockup.png        ← full stacked lockup (real, transparent PNG)
  logo-horizontal.png    ← mark + RUCHI realty, no tagline (for nav)
  logo-mark.png          ← R monogram only (gradient)
  logo-*-white.png       ← white-knockout versions for dark/photo surfaces
  patterns/
    signature-mark.png           ← oversized gradient monogram (Mark)
    signature-field-rows.png     ← upright monogram rows (Field)
    signature-field-lattice.png  ← mirrored monogram lattice (Field)
    brand-gradient.jpg           ← canonical lime→teal gradient texture
  photography/           ← natural (de-inverted) brand photos
preview/                 ← design-system cards (split per concept)
slides/                  ← (no template was provided — folder absent)
```

---

## Quick start — using the system

```html
<link rel="stylesheet" href="colors_and_type.css">

<body class="rr-content">
  <h1>Committed to <em>you.</em></h1>
  <p class="rr-lead">Every word has purpose. Nothing is filler.</p>
  <button class="rr-btn rr-btn--primary">Reserve a viewing</button>
</body>
```

The default surface is **dark (ink)**. Add `class="rr-light"` to any container to flip to paper.

---

## CONTENT FUNDAMENTALS

Ruchi's voice is the most distinctive thing about the brand. The book is explicit and uncompromising about it — match it before anything else.

### Personality
> "Ruchi Realty speaks like a **Creator**: thoughtful, intentional, and responsible. We don't just communicate. We shape perception the same way we shape spaces."

### Five rules of voice

| Rule | Yes | No |
|---|---|---|
| Intentional, not excessive | Every word earns its place | Filler, decoration, padding |
| Assured, not assertive | "We stand by what we create." | "The best in class." |
| Human, not corporate | "When you choose us, you trust us with your life's value." | "Customer-centric solutions." |
| Clear, not complex | "We build with awareness." | "Holistic synergistic outcomes." |
| Reassuring, not promotional | "Trust is earned." | "Limited time! Reserve today!" |

### Five tonal anchors
**THOUGHTFUL · CALM · CLEAR · GROUNDED · REASSURING**

Before publishing anything, run *the final filter*:
> *"Does this feel designed with care? Does this reinforce that we are committed to you?"*
> If not, it doesn't belong.

### Casing & punctuation
- Brand name is **Ruchi Realty** (Title Case) in body copy; the wordmark sets it as `RUCHI / realty`.
- Tagline is always **"Committed to You"** (sentence case in copy) or **`COMMITTED TO YOU`** (letterspaced uppercase) in the lockup and badging.
- Periods end every full sentence — including most pull-quotes. No exclamation marks. Em-dashes are fine; ellipses are rare.
- Voice is **second-person ("you")**, plural collective **"we"** for Ruchi. Never *us vs. them*.

### Emoji & decoration
- **No emoji.** Anywhere.
- No exclamation marks. No urgency words (*now, today, hurry, limited*).
- No real-estate clichés the book explicitly bans: *luxury, lifestyle, upgrade, dream home, opulent, premium living*.
- No decorative storytelling without substance.

### Patterns to use
- **Lead with meaning** — say *why* before *what*. ("Because trust is earned, not claimed. That is why we…")
- **Show, don't say** — proof, specifics, photographs over adjectives.
- **Stay minimal** — short sentences, generous breaks between lines, big silence around important phrases.

#### Specimens from the book
> "What truly shapes a life is rarely visible. It is built in moments of resolve. In each decision that matters."

> "We don't just build structures. We build with a responsibility to everything they represent."

> "So when we say, Committed To You — we don't just mean you. We mean everything you are committed to."

---

## VISUAL FOUNDATIONS

### 1. Palette

| Token | Hex | Role |
|---|---|---|
| `--rr-indigo` | `#2e3192` | **Primary brand colour** — the wordmark, headings, primary CTAs |
| `--rr-lime` | `#bed747` | Signature accent — the "loud" highlight (eyebrows, active states) |
| Brand gradient | — | Diagonal **lime → teal** (the R monogram fill); `--rr-gradient-brand` |
| `--rr-ink` | `#231f20` | Text on light; optional dark surface |
| `--rr-paper` | `#f5f4f1` | Warm paper surface (default light surface) |
| `--rr-mist` | `#e6e7e8` | Light neutral / secondary surface |
| `--rr-bronze` | `#a8782a` | Warm metallic, sparingly on print collateral |
| `--rr-emerald` | `#4ab969` | Success / vitality, rare |

**Indigo is the primary voice** (it is the wordmark colour), with **lime** as the single high-leverage highlight and the **lime→teal gradient** for hero/brand moments. Surfaces are predominantly **light (paper/white)**; ink is available as an optional dark surface. Avoid lime as a large fill — it is a highlight, not a wash.

### 2. Typography

- **Primary family:** **Gotham** (self-hosted in `fonts/`). Used at three personalities: **Light** (display headings, editorial), **Medium** (body, UI), **Black** (the `RUCHI` half of the wordmark, key call-outs). The full Gotham family ships — Thin→Ultra plus Condensed / Narrow / XNarrow / Rounded / Office cuts.
- **Type stack:** `--rr-font-sans` is wired to the self-hosted **Gotham** `@font-face` set in `colors_and_type.css`.
- **Official type scale:** H1 62 · H2 52 · H3 40 · H5 24 · H6/Lead 18 · Body 16 (px). See `--rr-fs-*` tokens.
- Cap-only treatments are letterspaced ~0.28em (`--rr-ls-eyebrow`) — this is the "COMMITTED TO YOU" treatment, reused for eyebrows and badges.
- Headlines are predominantly **Light weight** at large sizes — not bold. Bold is reserved for the wordmark's RUCHI half.

### 3. Backgrounds & imagery

- Photography is **natural, warm, and real** — candid moments of real people (parent + child, an executive portrait), in honest daylight. Single soft light source, gentle contrast.
- **No chromatic inversion / "x-ray" filter.** Early brand-book spreads showed an inverted purple/cyan treatment; per the brand owner this is **not** part of the guideline. Use natural colour. (The supplied photos were de-inverted to recover their natural state.)
- Prefer **suitable Indian subjects and settings** that read as authentic and lived-in.
- Always full-bleed when imagery is used. No image with a CSS border. No image with a drop-shadow unless on print collateral.

### 4. Logo & monogram

The logo is a **stacked wordmark** — `RUCHI` (heavy) over `realty` (lighter), set in **indigo `#2e3192`** — paired to the right of a custom **R** monogram. The monogram is a clever construction: a large **R** with a smaller **r** nested in its negative space, filled with the **lime→teal brand gradient** (lime at top-right, teal-blue at bottom-left). The tagline **`COMMITTED TO YOU`** sits in letterspaced caps below.

**Real logo files** (provided by the brand owner) live in `assets/`: `logo-lockup.png` (full stacked lockup, transparent), `logo-horizontal.png` (mark + wordmark, no tagline — for nav), `logo-mark.png` (monogram only), plus white-knockout versions (`*-white.png`) for dark/photo/gradient surfaces. The monogram alone is used as a graphic device (oversized on apparel, embossed on boxes).

### 4b. Signature graphics

Three pieces of official artwork (the brand's *Signature Graphics*), all built from the **R monogram** in the **lime→teal brand gradient**:

1. **Monogram Mark** (`signature-mark.png`) — a single **oversized gradient monogram**, used cropped and **bleeding off an edge**. The hero device (apparel, ID card, diary, gift box).
2. **Field · Rows** (`signature-field-rows.png`) — upright monograms repeating in rows across a gradient band. The simpler, calmer field.
3. **Field · Lattice** (`signature-field-lattice.png`) — mirrored, interlocking monograms forming a denser decorative texture.

Use the Mark big and confident; use either Field as a background texture, picking rows (calmer) or lattice (richer) to suit the surface.

Reusable helpers live in `colors_and_type.css`:

```html
<!-- gradient mark, bleeding off a corner -->
<div class="rr-sig-mark" style="--rr-sig-size:74%">…</div>
<!-- monogram field: lattice (default) or rows -->
<div class="rr-sig-field">…</div>
<div class="rr-sig-field rr-sig--rows">…</div>
```

Modifiers: `.rr-sig--rows` (switch the field from lattice to rows), `--rr-sig-opacity`, `--rr-sig-size` / `--rr-sig-x` / `--rr-sig-y` and `.rr-sig--left` / `.rr-sig--top` (resize / anchor the mark). The fields carry the gradient baked in and render `cover`. Preview card: `preview/signature-graphics.html`.

### 5. Layout

- Grid: generous. A 12-col grid with **>=64px gutters** on desktop and large outer margins. Never edge-to-edge type.
- Vertical rhythm: prefer **big silence**. A headline often sits alone for the full viewport.
- Asymmetry over center alignment. Left-aligned text is the default; centered text is reserved for tagline moments.
- Fixed elements: a slim top nav, never full-width hero overlays. The wordmark is small (height ≤ 32px in UI).

### 6. Borders, radii, cards

- **Radii are small.** `2px` is the workhorse, `8px` is the max. No pill shapes except small chips and the rare CTA.
- Cards on dark are flat fills (`--rr-bg-elev`) with a 1px hairline (`--rr-line`) — never drop shadows. Cards on paper use a subtle outer shadow (`--rr-elev-1`) and no border.
- Borders are hairlines (1px, `rgba(245,244,241,0.14)` on dark; `rgba(35,31,32,0.10)` on paper). Heavier borders only on the focus ring.

### 7. Shadows & elevation

- On ink: elevation reads as a 1px inset highlight on top + a deep cast shadow below (`--rr-elev-1`, `--rr-elev-2`). Never coloured glows except the **lime focus glow** for emphasis (`--rr-glow-lime`).
- On paper: a soft warm shadow (`0 8px 24px rgba(0,0,0,0.06)`).

### 8. Hover & press

- **Hover** is a *brightness lift*, not a colour shift. Primary CTAs (lime fill on ink) get a +6% deepen (`--rr-lime-deep`); ghost buttons brighten the foreground. Underlines on links go from 40% to 100% opacity.
- **Press** is a 1px translateY down + a brief brightness dip (~150ms). Never scale, never bounce.
- **Focus** is a 2px lime ring with `--rr-glow-lime` halo. Never a browser-default outline.

### 9. Transparency & blur

- Used sparingly. Headers may use `backdrop-filter: blur(10px)` over a `rgba(35,31,32,0.7)` scrim when overlaid on imagery.
- Modal scrims are `rgba(0,0,0,0.6)` — never tinted, no blur on the page underneath.

### 10. Motion

- **Easing:** `cubic-bezier(.2,.7,.2,1)` for entrances, sharper `cubic-bezier(.6,0,.8,.2)` for exits.
- **Durations:** 180ms (micro), 320ms (UI default), 560ms (entrances / hero reveals).
- **No bounces, springs, or overshoot.** No tilting cards on hover. Slow, considered fades and small translations. Anything that draws attention to *itself* rather than the content is wrong.

### 11. Layout chrome rules of thumb

- Section padding: `var(--rr-s-9)` (96 px) top/bottom on desktop, `var(--rr-s-7)` (48 px) on mobile.
- Max content width: 1200 px; reading column max 62 ch.
- Sticky nav is `var(--rr-ink)` at 70% with a 10 px backdrop blur.

---

## ICONOGRAPHY

The brand book does **not** define a proprietary icon set. Print collateral uses a small number of utilitarian glyphs (phone, mail, web, pin) at low visual weight.

This system uses **[Lucide](https://lucide.dev)** (CDN-linked) as the substitute:

- **Why Lucide:** thin stroke, geometric, no fill — sits well next to the geometric grotesque type. Matches Ruchi's "intentional, restrained" register far better than Heroicons (softer) or Material (heavier).
- **Style rules:** 1.5 px stroke, 24 px default size, colour `currentColor`, never filled, never multicolour.
- **Sparingly!** Icons accompany type — they never carry meaning alone (no icon-only nav, no decorative icon strips). The brand voice is "Show, don't say" — icons are an aid to the *say*, never decoration.

```html
<!-- usage -->
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="map-pin" style="width:18px;height:18px;stroke-width:1.5"></i>
```

> **Flagged substitution:** Lucide is not specified in the brand book. If Ruchi has a preferred icon family (or sketched glyph set), please attach and we will swap.

### Emoji & unicode
- **No emoji** in any UI surface. Period.
- Unicode symbols are fine only when they are typographic (·, —, →, ↗) and used as part of running copy — never as decoration.

### Logos & illustration
- The custom **R monogram** (`assets/logo-mark.png`, gradient fill) is the only illustration the brand owns. It is treated as type — no shadows, no recolouring of the gradient, no animation. Use the white-knockout (`logo-mark-white.png`) on dark/photo/gradient surfaces.
- No illustrations, no isometrics, no hand-drawn elements anywhere.

---

## Components

Reference component cards live in `preview/` and populate the Design System tab — logo lockups, colour palettes, type scale, spacing, buttons, form inputs, badges, project tile, nav header, footer, and the signature graphics (two monogram patterns). These are the building blocks; compose them directly in HTML for any deliverable.

> No full product UI kit is included (none was requested). If you later want an interactive site, app, or portal mock, attach references and we'll build one against these tokens.

---

## Caveats & to-do

- **Fonts:** ✅ Gotham font files provided and self-hosted from `fonts/`; `--rr-font-sans` now resolves to Gotham (Montserrat substitute removed).
- **Logo:** ✅ Real logo provided and integrated (`assets/logo-lockup.png`, `logo-horizontal.png`, `logo-mark.png` + white knockouts). The old hand-built `.svg` approximations are retained only as legacy and should not be used.
- **Photography:** the brand photos were **de-inverted** to remove the x-ray filter and recover their natural state, then tone-corrected. They are at the brand book's embedded resolution. For production, supply a dedicated library of natural, real Indian lifestyle/architecture photography and we'll re-link.
- **Theme:** surfaces default to **light** (paper/white). A dark/ink surface is available via the `--rr-*` ink tokens if needed.
- **No product UI kit:** none was requested, so the system ships tokens + reference cards only. We can build an interactive kit against these tokens whenever you want one.

---

*This file pairs with `colors_and_type.css` (tokens) and the preview cards (`preview/*.html`). Start there.*
