# Brand guidelines — Barthez Kenwou

Visual system for the portfolio, blog, social posts, covers, and any publication asset.

**Source of truth in code:** [`src/index.css`](../../src/index.css) · [`tailwind.config.ts`](../../tailwind.config.ts)

Use these values everywhere (Figma, Canva, Notion, LinkedIn, OG images). Do not invent parallel palettes.

---

## 1. Positioning

| Axis        | Direction                                                                 |
| :---------- | :------------------------------------------------------------------------ |
| Tone        | Technical, calm, precise — engineer / builder, not agency flash           |
| Surfaces    | Cold neutrals (slight blue-gray). **No violet tint** on backgrounds       |
| Accent      | Deep violet for CTAs, links, focus, key highlights                        |
| Motion      | Sparse, purposeful (progress, sticky chrome). No glow spam                |
| Density     | Airy prose, clear hierarchy, few chrome borders                           |

---

## 2. Color — quick kit (copy these hex)

### 2.1 Always keep these five (brand kit)

| Role              | Hex       | Use                                              |
| :---------------- | :-------- | :----------------------------------------------- |
| **Brand / CTA**   | `#532791` | Buttons, links (light), focus ring, key accent   |
| **Brand hover**   | `#451F7A` | Hover / pressed CTA (light)                      |
| **Ink**           | `#121217` | Primary text on light surfaces                   |
| **Paper**         | `#FAFAFA` | Page background (light)                          |
| **Card / white**  | `#FFFFFF` | Cards, panels, editorial frames                  |

Spectrum helpers (gradients, decorative bars — already in CSS):

| Token             | Hex       |
| :---------------- | :-------- |
| Spectrum deep     | `#5A2A9D` |
| Spectrum darker   | `#2D2768` |
| Spectrum sheen    | `#B9A0E3` |

### 2.2 Light mode (default for print / Canva / LinkedIn)

| Token                 | Hex       | Hex (alt) | Role                                      |
| :-------------------- | :-------- | :-------- | :---------------------------------------- |
| `background`          | `#FAFAFA` |           | Page                                      |
| `foreground`          | `#121217` |           | Body text                                 |
| `card`                | `#FFFFFF` |           | Elevated surface                          |
| `primary` / `brand`   | `#532791` |           | CTA fill, links, ring                     |
| `brand-hover`         | `#451F7A` |           | CTA hover                                 |
| `primary-foreground`  | `#FFFFFF` |           | Text on brand                             |
| `muted` / `secondary` | `#EFEFF1` |           | Soft fill, chips bg                       |
| `muted-foreground`    | `#2F2F37` |           | Secondary copy (still strong contrast)    |
| `border` / `input`    | `#D3D3D9` |           | Hairlines, inputs                         |
| `destructive`         | `#B81E1E` |           | Errors only                               |

Chart / secondary violet steps (light): `#532791` · `#6946A4` · `#565661` · `#747481` · `#9A9AA2`

### 2.3 Dark mode

| Token                | Hex       | Role                                                                 |
| :------------------- | :-------- | :------------------------------------------------------------------- |
| `background`         | `#050505` | Page                                                                 |
| `foreground`         | `#EFEFF1` | Body text                                                            |
| `card`               | `#0E0E10` | Elevated surface                                                     |
| `primary`            | `#B49ADF` | **Links / accents only** — readable on black                         |
| `brand`              | `#5A2A9D` | **Solid CTA fill** (never use lilac `#B49ADF` as a solid button fill)|
| `brand-hover`        | `#6D36BA` | CTA hover                                                            |
| `muted`              | `#18181B` | Soft fill                                                            |
| `muted-foreground`   | `#9F9FA8` | Secondary copy                                                       |
| `border`             | `#26262B` | Hairlines                                                            |
| `destructive`        | `#D03939` | Errors                                                               |

**Rule:** In dark UI, `primary` (lilac) ≠ `brand` (deep violet CTA). On light, they match (`#532791`).

### 2.4 Opacity shortcuts (overlays)

| Mix                         | Typical use                          |
| :-------------------------- | :----------------------------------- |
| Brand @ 28%                 | Soft highlight / selection           |
| Border @ 40–60%             | Quiet dividers in blog chrome        |
| Foreground @ 55–70%         | Meta (date, read time, captions)     |
| Foreground @ 85–90%         | Supporting paragraphs                |
| Glass light                 | `rgba(255,255,255,0.86)` + blur 12px |
| Glass dark                  | `rgba(14,14,16,0.82)` + blur 12px    |

---

## 3. Typography

### 3.1 Families

| Role        | Family             | Source                         | CSS / Tailwind        |
| :---------- | :----------------- | :----------------------------- | :-------------------- |
| Body        | **Switzer**        | Fontshare                      | `font-sans`           |
| Display H1  | **Clash Display**  | Fontshare                      | `font-display` / `h1` |
| Section H2+ | **Cabinet Grotesk**| Fontshare                      | `font-heading`        |
| Code / eyebrow | **JetBrains Mono** | Google Fonts                | `font-mono` / `.eyebrow` |
| Greeting only | **Allura**       | Google Fonts                   | `font-greeting`       |

Fallbacks: `ui-sans-serif` / `ui-monospace` / `cursive` as declared in CSS.

**Do not** use Inter, Roboto, Arial, or system UI as the designed look for brand assets.

### 3.2 Type roles & sizes

| Role              | Font              | Weight | Size (ref)        | Tracking     | Notes                          |
| :---------------- | :---------------- | :----- | :---------------- | :----------- | :----------------------------- |
| Hero / page H1    | Clash Display     | 700    | 28–40px (web)     | −0.03em      | Line-height ~1.05–1.2          |
| Article H1        | Clash Display     | 700    | ~23→32px responsive | tight      | Blog detail title              |
| Section H2        | Cabinet Grotesk   | 600    | 18–22px           | −0.015em     | Article sections               |
| Section H3        | Cabinet Grotesk   | 600    | 16–17px           | −0.015em     | With left border accent OK     |
| Body              | Switzer           | 400    | **17px** (1.0625rem) | 0         | Line-height **1.65**           |
| Small / meta      | Switzer           | 400–500| 11–12px           | normal       | `foreground` @ 55–70%          |
| Eyebrow / label   | JetBrains Mono    | 500    | 12px              | 0.08em       | UPPERCASE                      |
| Inline code       | JetBrains Mono    | 500    | ~0.85em           | 0            | Muted chip bg                  |
| Caption           | Switzer           | 400    | 11–12px           | 0            | Centered under figures         |

### 3.3 Pairing for off-site designs (Canva / LinkedIn)

If Fontshare fonts are unavailable, approximate:

| Need     | Acceptable substitute (external only) |
| :------- | :------------------------------------ |
| Display  | Satoshi / General Sans Bold           |
| Heading  | Satoshi Medium / Space Pro Medium     |
| Body     | Satoshi / Inter *only as last resort* |
| Mono     | JetBrains Mono / IBM Plex Mono        |

Prefer uploading Clash Display + Cabinet Grotesk + Switzer into the design tool when possible.

---

## 4. Shape, space, chrome

| Token        | Value                         | Use                                      |
| :----------- | :---------------------------- | :--------------------------------------- |
| Radius base  | **8px** (`0.5rem`)            | Cards, inputs, share rail, TOC           |
| Radius sm    | 4px                           | Chips, small controls                    |
| Radius md    | 6px                           | Intermediate                             |
| Borders      | 1px solid `#D3D3D9` (light) / `#26262B` (dark) | Prefer quiet borders over shadows |
| Shadows      | Minimal — soft `shadow-sm` max| No multi-layer glow                      |
| Content max  | ~`max-w-6xl` page / prose column | Blog: 8/12 cols content, 3–4 TOC     |
| Page padding | 12–32px responsive            | Keep generous bottom on mobile (sticky CTA) |

**Cards:** use sparingly. Prefer border + background, not heavy elevation. Interactive surfaces may use a light card; decorative content usually should not.

---

## 5. Blog & publication assets

### 5.1 Cover / Open Graph

| Spec            | Value                                      |
| :-------------- | :----------------------------------------- |
| Size            | **1200 × 630 px**                          |
| Safe zone       | Keep title & face inside center 1000×540   |
| Background      | `#FAFAFA` or `#050505` — or soft spectrum  |
| Accent bar/line | `#532791` or gradient `#5A2A9D` → `#2D2768`|
| Title           | Clash Display, white or `#121217`          |
| Subline         | Switzer / Cabinet, muted ink               |
| Logo / name     | Small, corner — never louder than title    |
| Export          | JPG or PNG, &lt; ~300 KB when possible     |

### 5.2 In-article images

| Spec            | Guidance                                                   |
| :-------------- | :--------------------------------------------------------- |
| Markdown        | `![Caption text](https://…)`                               |
| Admin           | Editor **+ image** uploads and inserts at cursor           |
| Public render   | Full column width, light border, rounded **md**, caption centered |
| Max display H   | ~`min(70vh, 36rem)` — avoid giant vertical dumps           |
| Badges / shields| Stay **inline** (auto-detected)                            |
| Alt = caption   | Write a real caption; empty alt = no figcaption            |

### 5.3 Editorial chrome (site)

| Element           | Treatment                                              |
| :---------------- | :----------------------------------------------------- |
| Progress bar      | 2px, `primary`                                         |
| TOC (desktop)     | Sticky, glass/blur, border `@60%`, radius sm           |
| Share rail        | Fixed right, glass panel, icon 28–32px                 |
| Tags              | Quiet text / chips — no rainbow pills                  |
| Code blocks       | Card border, theme-aware Shiki (light high-contrast / dark dimmed) |
| Callouts          | Left border `primary/50`, no filled purple boxes       |

### 5.4 Social share copy (tone)

- Title + short excerpt + URL  
- Hashtags: few, CamelCase, no spaces  
- No emoji decoration in professional posts unless intentional  

---

## 6. Do / Don’t

### Do

- Use **deep violet `#532791`** as the single brand accent on light designs  
- Keep surfaces **neutral gray** (`#FAFAFA` / `#FFFFFF` / `#EFEFF1`)  
- Hierarchy: one display title → one supporting line → one CTA  
- Prefer borders and spacing over shadows and glow  
- Match light/dark rules when designing UI screenshots  

### Don’t

- Purple-on-white gradient wallpaper as the whole brand  
- Cream / terracotta / “AI default” palettes  
- Flat Inter + purple button as a substitute identity  
- Lilac (`#B49ADF`) as a solid CTA on dark mockups — use `#5A2A9D`  
- Dense pill clusters, emoji rows, neon glow on cards  
- Inset hero media cards when a full-bleed cover is expected  

---

## 7. Figma / Canva starter swatches

Paste as solid styles:

```
Brand          #532791
Brand Hover    #451F7A
Spectrum Deep  #5A2A9D
Spectrum Dark  #2D2768
Spectrum Soft  #B9A0E3
Ink            #121217
Muted Ink      #2F2F37
Paper          #FAFAFA
White          #FFFFFF
Soft Fill      #EFEFF1
Border         #D3D3D9
Error          #B81E1E
Dark BG        #050505
Dark Card      #0E0E10
Dark Border    #26262B
Dark Accent    #B49ADF
Dark CTA       #5A2A9D
```

Suggested text styles (name them the same in the file):

1. `Display/H1` — Clash Display Bold 32–40 / −3%  
2. `Heading/H2` — Cabinet Grotesk SemiBold 20 / −1.5%  
3. `Body/17` — Switzer Regular 17 / 165%  
4. `Meta/12` — Switzer Medium 12 / color Muted Ink or 55% Ink  
5. `Eyebrow/Mono` — JetBrains Mono 12 UPPERCASE / +8%  

---

## 8. CSS variable cheat sheet (dev)

```css
/* Light brand CTA */
background: hsl(var(--brand));
color: hsl(var(--brand-foreground));

/* Link / accent (adapts in .dark) */
color: hsl(var(--primary));

/* Surfaces */
background: hsl(var(--background));
color: hsl(var(--foreground));
border-color: hsl(var(--border));
```

Tailwind: `bg-background`, `text-foreground`, `bg-primary`, `text-primary`, `border-border`, `font-display`, `font-heading`, `font-sans`, `font-mono`, `rounded-lg` (= `--radius`).

---

## 9. Maintenance

When changing brand colors or fonts:

1. Update tokens in [`src/index.css`](../../src/index.css)  
2. Update this document’s hex tables  
3. Refresh Figma/Canva shared library swatches  

Last aligned with code tokens: **2026-10-10**.
