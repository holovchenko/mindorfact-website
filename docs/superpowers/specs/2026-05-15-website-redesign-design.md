# Mindorfact website redesign — Design Spec

- **Date:** 2026-05-15
- **Owner:** Kyrylo
- **Status:** Draft → awaiting review
- **Implementation target:** uk + en at launch; de + fr in phase 2
- **Code repo:** `github.com/holovchenko/mindorfact-website`
- **Current state:** Astro 4 SSG on Vercel; 4 pages (index/support/privacy/terms), plain CSS (`global.css` 314 lines), single-locale `uk`. Hero is H1 + tagline + one App Store button; rest of the page is `EmailSignup`. Visually under-developed.

---

## 1. Goal

Turn the current placeholder site into a marketing landing + SEO/press surface that:

1. Converts visitors to App Store installs (single dominant CTA).
2. Communicates the product at a glance — modes, topics, languages, family-friendliness.
3. Localizes for `uk` and `en` from day 1; `de` and `fr` from the same i18n framework, shipped in phase 2.
4. Provides a press-kit endpoint for journalists/bloggers (`/press`).

**Non-goals:**
- No blog/CMS in v1 (Astro content collections caveat documented in §10).
- No analytics dashboard, no server-side state, no auth.
- No content authoring tool — copy lives in typed dictionaries in-repo.

## 2. Audience

Primary: Ukrainian-speaking adults (25–55) discovering the app via search, ASA campaigns, word of mouth. Secondary: English-speaking iOS users in EU/US who hit ASO/Apple Search Ads localized to `en`. Tertiary: journalists and bloggers landing on `/press`.

## 3. Visual direction — "Spark Bento"

- **Mood:** playful, warm, modern. Domestic, not corporate. NYT-meets-Notion-meets-iOS-app.
- **Anchor:** the iOS app's `spark` theme — magenta accents on warm pink, with deep ink-violet text. The web extends that with a structured bento section and stronger editorial typography.
- **Anti-patterns to avoid:** purple-gradient AI-startup vibes, neon-on-black gamer aesthetic, generic SaaS hero ("Build X faster").

## 4. Information architecture

| Route | uk | en | Content |
|---|---|---|---|
| `/` | redirect → `/uk` or `/en` | — | Detect via `Accept-Language` header on Vercel edge; fallback `/en` |
| `/uk`, `/en` | ✓ | ✓ | Home (7 sections — §6) |
| `/uk/support`, `/en/support` | ✓ | ✓ | Contact email + FAQ |
| `/uk/privacy`, `/en/privacy` | ✓ | ✓ | Privacy policy |
| `/uk/terms`, `/en/terms` | ✓ | ✓ | Terms |
| `/press` | en-only at launch (universal) | — | Press-kit downloads, screenshots, copy |
| `/de`, `/fr` (incl. subroutes) | scaffolding only | — | Phase 2; routes exist with placeholder + English fallback |

**SEO surface:** `hreflang` alternate links per page, `sitemap.xml` (via `@astrojs/sitemap`), `robots.txt`, OG/Twitter cards, JSON-LD `SoftwareApplication` schema with App Store URL and rating placeholder, canonical URLs.

## 5. Stack and tokens

### Stack additions
- Astro 4 (existing).
- **+ `@astrojs/tailwind`** — bento grid, dark mode, responsive variants.
- **+ `@astrojs/sitemap`** — auto sitemap.
- **+ `astro-icon` + `@iconify-json/lucide`** — icon system.
- **+ `@fontsource/onest`** — self-hosted variable font for headings.
- **No** JS animation library — CSS transforms + Web Animations API only.

### Web tokens (extended from iOS `spark` theme)

```css
:root {
  /* Brand */
  --brand-pink:    #DA1B5C;
  --brand-pink-700:#B41349;   /* hover */
  --brand-indigo:  #3F2DD6;
  --brand-cream:   #FFF0F1;
  --brand-blush:   #FFE0E2;
  --brand-ink:     #1F0E2E;
  --brand-mute:    #6B496F;
  --brand-surface: #FFFFFF;
  --brand-stroke:  #FFC9CD;

  /* Semantic */
  --success:       #0A9F56;
  --danger:        #D8334D;

  /* Type */
  --font-display:  "Onest", system-ui, sans-serif;
  --font-body:     "Inter", system-ui, sans-serif;

  /* Radius */
  --radius-card:   20px;
  --radius-pill:   999px;

  /* Elevation */
  --shadow-card:   0 1px 2px rgba(31,14,46,.04), 0 8px 24px rgba(218,27,92,.08);
  --shadow-lifted: 0 2px 6px rgba(31,14,46,.06), 0 24px 48px rgba(218,27,92,.12);
}

[data-theme="dark"] {
  --brand-cream:   #110510;
  --brand-blush:   #1B0820;
  --brand-ink:     #FFE8EC;
  --brand-mute:    #CFA8BD;
  --brand-surface: #261028;
  --brand-stroke:  #561C5A;
  --brand-pink:    #FF3F7C;
  --brand-pink-700:#E62A6D;
}
```

Type scale: `display-xl` 56/72, `display-lg` 40/48, `h2` 28/36, `h3` 22/28, `body` 17/26, `caption` 14/20. Mobile down-step −20%.

## 6. Home sections (`/uk`, `/en`)

### S0 — Sticky nav
- Wordmark "Mindorfact" (logotype, indigo).
- Right cluster: locale switcher (UK/EN), color-scheme toggle, App Store pill (magenta, primary CTA).
- Backdrop-blur 16px on scroll, sticky at top.

### S1 — Hero (split layout, 12-col grid)
- **Left (6 cols, md+):** kicker label "iOS app" (small caps, indigo) → H1 two-line "Карткова гра / на критичне мислення" → 17/26 lede paragraph → primary App Store badge + outline secondary "Як це працює" (anchors to S2) → meta-row "9 топіків · 2 850 карток · 4 мови".
- **Right (6 cols, md+):** SVG iPhone bezel hosting real localized App Store screenshot (`fastlane/screenshots/uk-UA/iPhone-6.7…png`). Two real-content sample cards float beside the phone at −6° / +4° rotation. Parallax-shift on scroll (transform: translateY). On load: cards slide in with stagger (250ms each, ease-out-back).
- Mobile: stack vertically, phone first at 70% width, cards below.

### S2 — Bento features (12-col grid, 3 visual rows)
Six tiles, varying sizes. All clay-soft cards on `--brand-blush`.

| # | Tile | Size | Visual |
|---|---|---|---|
| 1 | Solo + Daily challenge | 8×2 | Mini stylized card with streak ring + "Сьогодні" pill |
| 2 | Party mode | 4×2 | Illustrated avatar bubbles connected by dashed lines |
| 3 | 9 topics | 6×2 | Animated emoji-pills carousel of real topic display names |
| 4 | iCloud sync | 3×1 | Cloud icon + "Без аккаунтів" |
| 5 | No ads in Daily | 3×1 | Crossed-out megaphone icon |
| 6 | Free with optional topics | 12×1 | Cards row + price tag — explains free + IAP model |

Each tile: 16px padding, `--radius-card`, hover-lift (translateY −2px, shadow boost), 200ms ease.

### S3 — Sample cards gallery
Six real cards pulled from `content/locales/uk/<topic>/<mode>_<difficulty>.json`. Layout: 3×2 grid (md+), horizontal scroll-snap (mobile). Each card is a real `<button>` that flips on click via `transform: rotateY(180deg)` (CSS only — `:checked`+`<input type="checkbox">` for state, no JS). Front: question + topic emoji. Back: answer + tiny "Spoiler 👀" label.

CTA below: "Ще 2 844 карти в App Store →".

### S4 — Social proof / metrics
4 oversized numbers, each in a colored circle on `--brand-cream`:
- 2 850 — карток
- 9 — топіків
- 4 — мови
- 100% — офлайн

Caption: "Зроблено в Україні, ⌃ для всього світу" (uk) / "Made in Ukraine, for everyone" (en).

### S5 — FAQ
6–8 items in native `<details>` (no JS). Topics: child age, languages, IAP unlock model, iPad support, daily challenge mechanics, party rules, how to submit a topic idea, data privacy.

### S6 — Final CTA + email signup
Full-bleed pink/indigo gradient strip. Big "Спробуй сьогодні" + App Store badge. Below: smaller "Без iOS? Залиш email — повідомимо коли запустимо для інших платформ" + existing `EmailSignup` (kept; restyled).

### S7 — Footer (replaces current minimal footer)
Three columns: legal (Privacy, Terms, Support, Press), languages (UK · EN · DE · FR with phase-2 ones disabled), company (© Kyrylo, Apple disclaimer "App Store is a service mark of Apple Inc.").

## 7. Sub-pages

- **`/uk/support` and `/en/support`:** restyled current page. Contact email + FAQ extended to 8 items. Localized.
- **`/uk/privacy`, `/en/privacy`:** existing markdown content moved into Astro Content Collections with locale field; layout restyled.
- **`/uk/terms`, `/en/terms`:** same pattern.
- **`/press`:** hero with logo + "Mindorfact press kit" → grid of downloadables (logos zip, screenshots zip, app icons) → copy variants (short/medium/long, three languages) → brand colors table → contact "press@mindorfact.com" (set up forwarding to current support email separately — outside repo scope).

## 8. Internationalization

- **Strategy:** Astro built-in i18n routing (`astro.config.mjs` `i18n` block) with `prefixDefaultLocale: true`.
- **Default locale:** `en` (broader reach).
- **Locale dictionaries:** `src/i18n/{uk,en,de,fr}.ts` exporting typed objects. One file per locale. Phase-2 locales (`de`, `fr`) ship with English values to start; translation PRs swap them in.
- **Helper:** `src/i18n/t.ts` exporting `t(locale, key)`. Compile-time check via TypeScript on key access.
- **Component pattern:** every component receives `lang` prop; reads strings via `t(lang, "...")`. No `<slot>` for translatable copy.
- **Root `/`:** Vercel edge middleware reads `Accept-Language`, 302-redirects to `/uk`, `/en`, `/de`, or `/fr` (fallback `/en`). For phase 2, `de`/`fr` initially redirect back to `/en` until copy lands.
- **`hreflang`:** every page emits `<link rel="alternate" hreflang="<locale>" href="<url>" />` for all available locales, plus `x-default` pointing to `/en`.

## 9. Component map

| File | Type | Notes |
|---|---|---|
| `src/layouts/BaseLayout.astro` | layout | extends current; adds JSON-LD slot, locale meta, theme toggle script |
| `src/components/Header.astro` | nav | adds locale switcher, theme toggle, App Store pill |
| `src/components/Footer.astro` | nav | restructured to 3 cols + lang list |
| `src/components/AppStoreBadge.astro` | atom | reusable badge with size variant |
| `src/components/SectionContainer.astro` | layout | section padding/width primitive |
| `src/components/HeroSplit.astro` | section | hero with phone frame |
| `src/components/PhoneFrame.astro` | atom | SVG iPhone bezel + slot for screenshot |
| `src/components/SampleCard.astro` | atom | flip card, used in hero floats + S3 gallery |
| `src/components/BentoFeatures.astro` | section | 6-tile bento grid |
| `src/components/BentoTile.astro` | atom | one tile, props: `size`, `title`, slot for visual |
| `src/components/CardGallery.astro` | section | S3 gallery |
| `src/components/MetricsBlock.astro` | section | S4 |
| `src/components/FAQList.astro` | section | S5 `<details>` list |
| `src/components/FinalCTA.astro` | section | S6 |
| `src/components/EmailSignup.astro` | existing | keep, restyle |
| `src/components/LocaleSwitcher.astro` | atom | UK/EN/DE/FR list |
| `src/components/ThemeToggle.astro` | atom | inline `<script>` toggling `data-theme` |
| `src/components/PressCardGrid.astro` | section | `/press` downloadables |
| `src/i18n/{uk,en,de,fr}.ts` | data | locale dictionaries |
| `src/data/topics.ts` | data | typed topic list (matches iOS `IAPCatalog.swift`) |
| `src/data/sample-cards.ts` | data | 6 hand-picked cards (id, topic, question, answer, locale) sourced from iOS `content/locales/<locale>/` |
| `src/data/faq.ts` | data | localized FAQ entries |
| `src/styles/tokens.css` | css | the `:root` block from §5 |
| `tailwind.config.mjs` | config | maps brand tokens to Tailwind theme |

## 10. Out of scope (explicit)

- Blog / news / fact-of-the-day feed (would benefit from Astro Content Collections; deferred until we have a content rhythm).
- Comment system or community.
- A/B testing infrastructure.
- Analytics beyond Vercel Web Analytics (already free).
- Cookie banner — site has no tracking cookies; we'll keep it that way and disclose plainly in privacy policy.
- Newsletter automation (current `EmailSignup` action is a stub; wiring to Formspree/Vercel KV is a separate task).
- DE/FR copy (scaffold only at launch).
- CMS — copy lives in repo for v1.

## 11. Testing & acceptance

- Visual regression: Playwright screenshots of `/uk`, `/en`, `/uk/support`, `/press` at 360 / 768 / 1280 / 1920 widths, light + dark.
- Lighthouse targets (mobile): Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95.
- a11y: keyboard nav covers all interactive elements; focus visible; flip-card has aria; locale switcher exposes `aria-current`.
- `hreflang` validated by Google's hreflang checker.
- Build under 250 KB JS first-party (Tailwind purge + zero JS libs makes this trivial).
- All copy passes a manual native-speaker pass before merge.

## 12. Rollout

Single PR is too big. Suggested 4-PR slice:

1. **PR 1 — Foundations:** Tailwind setup, tokens, fonts, i18n routing scaffolding, locale-aware existing pages (current pages move to `/uk/*` and `/en/*` with stub copy). Header + Footer redesigned. Sitemap + hreflang.
2. **PR 2 — Home sections S1–S2:** Hero + Bento. Sample card component, phone frame.
3. **PR 3 — Home sections S3–S7:** Card gallery, metrics, FAQ, final CTA, restyled EmailSignup.
4. **PR 4 — Press kit + final polish:** `/press` route, JSON-LD, OG image refresh, Lighthouse pass, visual regression.

Phase 2 (separate PRs, not in this spec's scope): DE + FR copy fill-in.

## 13. Open questions (please confirm before plan-writing)

- [ ] Domain: is `mindorfact.com` the live one? Press contact `press@mindorfact.com` needs MX or forwarding — outside this repo, just confirm we'll set it up.
- [ ] Logo lockup: do we have a horizontal wordmark SVG separate from the icon? If not, I'll vectorize from current text wordmark.
- [ ] Sample cards: OK to pick 6 cards from `content/locales/uk/` of the iOS repo and hand-translate to en? Or do you want me to pick from the existing en/de/fr translations already in the iOS repo?
- [ ] Phone-frame screenshot source: use `fastlane/screenshots/uk-UA/` directly, or do we want fresh non-localized "marketing" screenshots without the device chrome?
- [ ] Email signup endpoint: stay a stub for now, or wire to Formspree as part of this redesign?
