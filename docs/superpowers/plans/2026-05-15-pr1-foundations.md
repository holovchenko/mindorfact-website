# PR 1 — Foundations: Tailwind, tokens, i18n, redesigned chrome

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the foundation for the Spark Bento redesign — Tailwind + design tokens + Onest font + i18n routing (`/uk`, `/en` live; `/de`, `/fr` scaffolded), restyled Header/Footer with locale switcher and theme toggle, locale-aware legal pages, sitemap, and `hreflang`. Site still works end-to-end after this PR; hero/bento sections come in PR 2.

**Architecture:** Astro 4 SSG on Vercel static. Tailwind CSS handles design tokens via `theme.extend`. `@astrojs/sitemap` emits `/sitemap-index.xml`. Astro i18n routing (`prefixDefaultLocale: true`) with default locale `en`. Dictionaries live in typed `src/i18n/<lang>.ts` modules; a `t(lang, key)` helper resolves strings with `en` fallback. Pages are dynamic `src/pages/[lang]/*.astro` with `getStaticPaths` enumerating active locales. Root `/` redirects via Astro middleware reading `Accept-Language` header (Vercel edge).

**Tech Stack:** Astro 4.15, Tailwind 3.4, `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/vercel/static`, `astro-icon` + `@iconify-json/lucide`, `@fontsource-variable/onest`, Playwright 1.x for smoke tests, Node 20.

**Spec reference:** `docs/superpowers/specs/2026-05-15-website-redesign-design.md` (Spark Bento). PR 1 covers §4, §5, §8, §9 (Header/Footer/BaseLayout/Locale/Theme components), §12 PR 1 bullets.

**Branch & worktree:** Work happens in a git worktree off `main` at `.worktrees/foundations` on branch `feat/foundations-i18n-tokens`. The spec doc PR (branch `docs/website-redesign-spec`) is independent — merge order does not block this PR.

---

## File Structure

```
mindorfact-website/
├── astro.config.mjs                            (modify — add Tailwind, sitemap, i18n)
├── tailwind.config.mjs                         (create)
├── package.json                                (modify — deps + scripts)
├── playwright.config.ts                        (create)
├── public/
│   └── (unchanged)
├── src/
│   ├── env.d.ts                                (unchanged)
│   ├── middleware.ts                           (create — root redirect)
│   ├── content/
│   │   ├── config.ts                           (modify — locale field)
│   │   └── legal/
│   │       ├── uk/
│   │       │   ├── privacy.md                  (move from ../privacy.md)
│   │       │   └── terms.md                    (move from ../terms.md)
│   │       └── en/
│   │           ├── privacy.md                  (create — English version)
│   │           └── terms.md                    (create — English version)
│   ├── i18n/
│   │   ├── types.ts                            (create — Dictionary type)
│   │   ├── locales.ts                          (create — locale registry)
│   │   ├── t.ts                                (create — translation helper)
│   │   ├── uk.ts                               (create — Ukrainian dictionary)
│   │   ├── en.ts                               (create — English dictionary)
│   │   ├── de.ts                               (create — German placeholder)
│   │   └── fr.ts                               (create — French placeholder)
│   ├── layouts/
│   │   └── BaseLayout.astro                    (modify — lang/hreflang/JSON-LD)
│   ├── components/
│   │   ├── Header.astro                        (rewrite)
│   │   ├── Footer.astro                        (rewrite)
│   │   ├── LocaleSwitcher.astro                (create)
│   │   ├── ThemeToggle.astro                   (create)
│   │   ├── AppStoreBadge.astro                 (create)
│   │   └── EmailSignup.astro                   (modify — locale-aware copy)
│   ├── pages/
│   │   ├── index.astro                         (delete — replaced by middleware redirect)
│   │   ├── privacy.astro                       (delete)
│   │   ├── terms.astro                         (delete)
│   │   ├── support.astro                       (delete)
│   │   └── [lang]/
│   │       ├── index.astro                     (create — stub home with i18n)
│   │       ├── support.astro                   (create)
│   │       ├── privacy.astro                   (create)
│   │       └── terms.astro                     (create)
│   └── styles/
│       ├── tokens.css                          (create — CSS custom props)
│       └── global.css                          (rewrite — Tailwind layers + base)
└── tests/
    └── smoke.spec.ts                           (create — Playwright smoke)
```

**Responsibility boundaries:**
- `src/i18n/` is pure-data + helpers; no Astro imports. Easy to unit-test.
- `src/styles/tokens.css` is the single source of CSS variables. `tailwind.config.mjs` references the same hex values (no duplication of source — Tailwind colors are declared once with the hex, CSS variables mirror them for runtime theming).
- Components in `src/components/` receive `lang` prop and `t()` strings; no inline hardcoded copy.
- `src/middleware.ts` only handles the bare `/` redirect; all other routing is static.

---

## Task 0: Set up worktree

**Files:** none (filesystem only)

- [ ] **Step 1: Confirm clean main**

Run: `cd /Users/kyrylo/Documents/Projects/mindorfact-website && git checkout main && git pull && git status`
Expected: branch up to date, working tree clean.

- [ ] **Step 2: Create worktree**

Run:
```bash
cd /Users/kyrylo/Documents/Projects/mindorfact-website
git worktree add .worktrees/foundations -b feat/foundations-i18n-tokens
```
Expected: "Preparing worktree (new branch 'feat/foundations-i18n-tokens')" + worktree created.

- [ ] **Step 3: Enter worktree and install Node 20**

Run:
```bash
cd /Users/kyrylo/Documents/Projects/mindorfact-website/.worktrees/foundations
nvm use 20 || nvm install 20
npm install
```
Expected: deps installed, no errors.

- [ ] **Step 4: Verify baseline build still works**

Run: `npm run build`
Expected: "Build complete" with output in `dist/`. No errors.

---

## Task 1: Install Tailwind, sitemap, iconify, Onest font, Playwright

**Files:**
- Modify: `package.json` (npm will update)

- [ ] **Step 1: Install Astro integrations and Tailwind**

Run:
```bash
npm install -D @astrojs/tailwind@^5.1.0 tailwindcss@^3.4.0 @astrojs/sitemap@^3.2.0 astro-icon@^1.1.0 @iconify-json/lucide@^1.2.0
```
Expected: 5 packages added.

- [ ] **Step 2: Install Onest variable font**

Run: `npm install @fontsource-variable/onest@^5.0.0`
Expected: 1 package added.

- [ ] **Step 3: Install Playwright (dev)**

Run:
```bash
npm install -D @playwright/test@^1.48.0
npx playwright install --with-deps chromium
```
Expected: Playwright installed, Chromium downloaded.

- [ ] **Step 4: Add test script**

Modify `package.json` `scripts` block to:
```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add Tailwind, sitemap, iconify, Onest, Playwright"
```

---

## Task 2: Tailwind config with brand tokens

**Files:**
- Create: `tailwind.config.mjs`

- [ ] **Step 1: Create config**

Create `tailwind.config.mjs`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink:    '#DA1B5C',
          'pink-700': '#B41349',
          indigo:  '#3F2DD6',
          cream:   '#FFF0F1',
          blush:   '#FFE0E2',
          ink:     '#1F0E2E',
          mute:    '#6B496F',
          surface: '#FFFFFF',
          stroke:  '#FFC9CD',
        },
        success: '#0A9F56',
        danger:  '#D8334D',
      },
      fontFamily: {
        display: ['"Onest Variable"', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['2.5rem', { lineHeight: '1.1',  letterSpacing: '-0.015em', fontWeight: '700' }],
        'h2':         ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3':         ['1.375rem', { lineHeight: '1.3',  fontWeight: '600' }],
        'body':       ['1.0625rem', { lineHeight: '1.55' }],
        'caption':    ['0.875rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        card:    '0 1px 2px rgba(31,14,46,.04), 0 8px 24px rgba(218,27,92,.08)',
        lifted:  '0 2px 6px rgba(31,14,46,.06), 0 24px 48px rgba(218,27,92,.12)',
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.mjs
git commit -m "feat(styles): add Tailwind config with Spark Bento brand tokens"
```

---

## Task 3: Update astro.config.mjs (i18n + sitemap + tailwind)

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Rewrite config**

Replace `astro.config.mjs` entirely with:
```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const ACTIVE_LOCALES = ['en', 'uk'];
const FUTURE_LOCALES = ['de', 'fr'];

export default defineConfig({
  site: 'https://mindorfact.com',
  output: 'static',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'en',
    locales: [...ACTIVE_LOCALES, ...FUTURE_LOCALES],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', uk: 'uk-UA', de: 'de', fr: 'fr' },
      },
    }),
    icon({ include: { lucide: ['*'] } }),
  ],
});
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds. Sitemap generated for `en` and `uk` (output mentions `/sitemap-index.xml`).

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(config): enable Tailwind, sitemap, i18n routing (en+uk active)"
```

---

## Task 4: Tokens CSS + rewritten global.css

**Files:**
- Create: `src/styles/tokens.css`
- Rewrite: `src/styles/global.css`

- [ ] **Step 1: Create tokens.css**

Create `src/styles/tokens.css`:
```css
:root {
  --brand-pink:    #DA1B5C;
  --brand-pink-700:#B41349;
  --brand-indigo:  #3F2DD6;
  --brand-cream:   #FFF0F1;
  --brand-blush:   #FFE0E2;
  --brand-ink:     #1F0E2E;
  --brand-mute:    #6B496F;
  --brand-surface: #FFFFFF;
  --brand-stroke:  #FFC9CD;
  --success:       #0A9F56;
  --danger:        #D8334D;
  --shadow-card:   0 1px 2px rgba(31, 14, 46, .04), 0 8px 24px rgba(218, 27, 92, .08);
  --shadow-lifted: 0 2px 6px rgba(31, 14, 46, .06), 0 24px 48px rgba(218, 27, 92, .12);
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

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --brand-cream:   #110510;
    --brand-blush:   #1B0820;
    --brand-ink:     #FFE8EC;
    --brand-mute:    #CFA8BD;
    --brand-surface: #261028;
    --brand-stroke:  #561C5A;
    --brand-pink:    #FF3F7C;
    --brand-pink-700:#E62A6D;
  }
}
```

- [ ] **Step 2: Rewrite global.css**

Replace `src/styles/global.css` entirely with:
```css
@import '@fontsource-variable/onest';
@import './tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background-color: var(--brand-cream);
    color: var(--brand-ink);
    font-family: theme('fontFamily.body');
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }

  h1, h2, h3, h4 {
    font-family: theme('fontFamily.display');
    color: var(--brand-ink);
  }

  a {
    color: var(--brand-indigo);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  a:hover { color: var(--brand-pink); }

  ::selection {
    background: var(--brand-pink);
    color: #fff;
  }
}

@layer components {
  .container-page {
    @apply mx-auto w-full max-w-page px-5 sm:px-8;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: builds without CSS errors. Some pages may look broken (intentional — we will update them next).

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css
git commit -m "feat(styles): introduce design tokens + Tailwind base layer"
```

---

## Task 5: i18n core — locales registry, types, dictionaries, helper

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/locales.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/uk.ts`
- Create: `src/i18n/de.ts`
- Create: `src/i18n/fr.ts`
- Create: `src/i18n/t.ts`

- [ ] **Step 1: Define dictionary shape**

Create `src/i18n/types.ts`:
```ts
export type Dictionary = {
  meta: {
    siteName: string;
    tagline: string;
    description: string;
  };
  nav: {
    support: string;
    privacy: string;
    terms: string;
    press: string;
    download: string;
    toggleLanguage: string;
    toggleTheme: string;
  };
  home: {
    heroKicker: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroLede: string;
    heroSecondaryCta: string;
    heroMeta: string;
    heroDeviceNote: string;
  };
  footer: {
    rights: string;
    appleDisclaimer: string;
    languagesHeading: string;
    legalHeading: string;
    companyHeading: string;
  };
  emailSignup: {
    heading: string;
    placeholder: string;
    submit: string;
    privacyNote: string;
  };
  support: {
    title: string;
    intro: string;
    faqHeading: string;
    contactHeading: string;
    contactBody: string;
    responseTime: string;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
    lastUpdatedPrefix: string;
  };
};
```

- [ ] **Step 2: Define locale registry**

Create `src/i18n/locales.ts`:
```ts
export const ACTIVE_LOCALES = ['en', 'uk'] as const;
export const FUTURE_LOCALES = ['de', 'fr'] as const;
export const ALL_LOCALES = [...ACTIVE_LOCALES, ...FUTURE_LOCALES] as const;

export type ActiveLocale = (typeof ACTIVE_LOCALES)[number];
export type Locale = (typeof ALL_LOCALES)[number];

export const DEFAULT_LOCALE: ActiveLocale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  uk: 'UK',
  de: 'DE',
  fr: 'FR',
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en',
  uk: 'uk-UA',
  de: 'de',
  fr: 'fr',
};

export function isActiveLocale(value: string): value is ActiveLocale {
  return (ACTIVE_LOCALES as readonly string[]).includes(value);
}
```

- [ ] **Step 3: English dictionary**

Create `src/i18n/en.ts`:
```ts
import type { Dictionary } from './types';

export const en: Dictionary = {
  meta: {
    siteName: 'Mindorfact',
    tagline: 'A card game for critical thinking',
    description: 'Mindorfact — a card game for critical thinking. Available on the App Store.',
  },
  nav: {
    support: 'Support',
    privacy: 'Privacy',
    terms: 'Terms',
    press: 'Press',
    download: 'Get on App Store',
    toggleLanguage: 'Change language',
    toggleTheme: 'Toggle dark mode',
  },
  home: {
    heroKicker: 'iOS app',
    heroTitleLine1: 'A card game',
    heroTitleLine2: 'for critical thinking',
    heroLede: 'Nine topics, 2,850 cards, four languages, four play modes. Solo or with friends. Fully offline.',
    heroSecondaryCta: 'How it works',
    heroMeta: '9 topics · 2,850 cards · 4 languages',
    heroDeviceNote: 'Works on iPhone and iPad. iOS 17 and later.',
  },
  footer: {
    rights: 'All rights reserved.',
    appleDisclaimer: 'App Store is a service mark of Apple Inc.',
    languagesHeading: 'Languages',
    legalHeading: 'Legal',
    companyHeading: 'Company',
  },
  emailSignup: {
    heading: 'Stay in the loop',
    placeholder: 'you@email.com',
    submit: 'Subscribe',
    privacyNote: 'No spam. Unsubscribe anytime.',
  },
  support: {
    title: 'Support',
    intro: 'Questions, ideas, or trouble? Reach us at the email below.',
    faqHeading: 'Frequently asked questions',
    contactHeading: 'Get in touch',
    contactBody: 'Email us at',
    responseTime: 'We respond within 1–2 business days.',
  },
  legal: {
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Use',
    lastUpdatedPrefix: 'Last updated:',
  },
};
```

- [ ] **Step 4: Ukrainian dictionary**

Create `src/i18n/uk.ts`:
```ts
import type { Dictionary } from './types';

export const uk: Dictionary = {
  meta: {
    siteName: 'Mindorfact',
    tagline: 'Карткова гра на критичне мислення',
    description: 'Mindorfact — карткова гра на критичне мислення. Доступна в App Store.',
  },
  nav: {
    support: 'Підтримка',
    privacy: 'Конфіденційність',
    terms: 'Умови',
    press: 'Пресс-кіт',
    download: 'Завантажити в App Store',
    toggleLanguage: 'Змінити мову',
    toggleTheme: 'Перемкнути тему',
  },
  home: {
    heroKicker: 'Застосунок для iOS',
    heroTitleLine1: 'Карткова гра',
    heroTitleLine2: 'на критичне мислення',
    heroLede: 'Дев’ять тем, 2 850 карток, чотири мови, чотири режими гри. Самостійно або з друзями. Працює без інтернету.',
    heroSecondaryCta: 'Як це працює',
    heroMeta: '9 топіків · 2 850 карток · 4 мови',
    heroDeviceNote: 'Працює на iPhone і iPad. iOS 17 і новіші.',
  },
  footer: {
    rights: 'Всі права захищено.',
    appleDisclaimer: 'App Store — знак обслуговування Apple Inc.',
    languagesHeading: 'Мови',
    legalHeading: 'Юридичне',
    companyHeading: 'Про нас',
  },
  emailSignup: {
    heading: 'Будь у курсі',
    placeholder: 'ти@пошта.ua',
    submit: 'Підписатися',
    privacyNote: 'Без спаму. Можна відписатись будь-коли.',
  },
  support: {
    title: 'Підтримка',
    intro: 'Питання, ідеї, проблема? Напиши нам на пошту нижче.',
    faqHeading: 'Часті запитання',
    contactHeading: 'Зв’яжіться з нами',
    contactBody: 'Напишіть нам:',
    responseTime: 'Ми відповідаємо протягом 1–2 робочих днів.',
  },
  legal: {
    privacyTitle: 'Політика конфіденційності',
    termsTitle: 'Умови використання',
    lastUpdatedPrefix: 'Останнє оновлення:',
  },
};
```

- [ ] **Step 5: German placeholder (English fallback)**

Create `src/i18n/de.ts`:
```ts
import type { Dictionary } from './types';
import { en } from './en';

// Phase 2: DE copy. Until translated, falls back to English wholesale.
export const de: Dictionary = en;
```

- [ ] **Step 6: French placeholder (English fallback)**

Create `src/i18n/fr.ts`:
```ts
import type { Dictionary } from './types';
import { en } from './en';

// Phase 2: FR copy. Until translated, falls back to English wholesale.
export const fr: Dictionary = en;
```

- [ ] **Step 7: Helper**

Create `src/i18n/t.ts`:
```ts
import type { Dictionary } from './types';
import { en } from './en';
import { uk } from './uk';
import { de } from './de';
import { fr } from './fr';
import { type Locale } from './locales';

const DICTIONARIES: Record<Locale, Dictionary> = { en, uk, de, fr };

export function dict(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? en;
}
```

- [ ] **Step 8: Commit**

```bash
git add src/i18n
git commit -m "feat(i18n): introduce typed dictionaries and locale registry"
```

---

## Task 6: Locale-aware content collection for legal pages

**Files:**
- Modify: `src/content/config.ts`
- Move: `src/content/legal/privacy.md` → `src/content/legal/uk/privacy.md`
- Move: `src/content/legal/terms.md` → `src/content/legal/uk/terms.md`
- Create: `src/content/legal/en/privacy.md`
- Create: `src/content/legal/en/terms.md`

- [ ] **Step 1: Update content schema**

Replace `src/content/config.ts` entirely with:
```ts
import { defineCollection, z } from 'astro:content';

const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
    description: z.string().optional(),
    locale: z.enum(['uk', 'en', 'de', 'fr']),
  }),
});

export const collections = { legal: legalCollection };
```

- [ ] **Step 2: Move existing legal files into `uk/` subdirectory**

Run:
```bash
cd /Users/kyrylo/Documents/Projects/mindorfact-website/.worktrees/foundations
mkdir -p src/content/legal/uk src/content/legal/en
git mv src/content/legal/privacy.md src/content/legal/uk/privacy.md
git mv src/content/legal/terms.md  src/content/legal/uk/terms.md
```

- [ ] **Step 3: Add `locale: uk` to moved files**

Open `src/content/legal/uk/privacy.md` and `terms.md`. In each frontmatter add `locale: uk` line. Example for privacy:
```yaml
---
title: Політика конфіденційності
lastUpdated: "2025-04-30"
description: Політика конфіденційності додатку Mindorfact.
locale: uk
---
```
(Preserve any existing frontmatter fields; only add `locale: uk`.)

- [ ] **Step 4: Create English privacy stub**

Create `src/content/legal/en/privacy.md`:
```markdown
---
title: Privacy Policy
lastUpdated: "2025-04-30"
description: Privacy policy for the Mindorfact app.
locale: en
---

# Privacy Policy

**Last updated: 2025-04-30**

Mindorfact ("we", "our", "the app") is operated by Kyrylo Holovchenko. The app is offline-first and does not collect personal data on our servers. This policy explains what limited data the app handles.

## What we do not collect

- We do not run our own servers.
- We do not store your name, address, photos, contacts, or location.
- We do not share any data with third parties for advertising.

## What stays on your device

- Game progress (decks played, streaks, achievements).
- Theme and color-scheme preferences.
- Optional in-app purchases (handled by Apple, see below).

## iCloud sync

If you are signed into iCloud and have **Mindorfact** enabled in iCloud settings, the app syncs game progress between your Apple devices through Apple's iCloud Key-Value Store. We do not have access to that data — it travels between your devices through Apple.

## In-app purchases

Purchases are processed by Apple through the App Store. Apple's policy applies. We receive aggregate, anonymized sales reports from Apple — never personal payment data.

## Analytics and advertising

Mindorfact includes Google AdMob banner and interstitial ads outside of the Daily Challenge. AdMob may collect device identifiers as described in Google's privacy policy. Mindorfact does not pass any personally identifying information to AdMob.

For analytics, we may use Vercel Web Analytics on this website (no cookies, no personal data).

## Contact

Questions: support@mindorfact.com
```

- [ ] **Step 5: Create English terms stub**

Create `src/content/legal/en/terms.md`:
```markdown
---
title: Terms of Use
lastUpdated: "2025-04-30"
description: Terms of use for the Mindorfact app.
locale: en
---

# Terms of Use

**Last updated: 2025-04-30**

By installing or using Mindorfact, you agree to these terms.

## License

Mindorfact is licensed, not sold. You receive a personal, non-exclusive, non-transferable license to use the app on devices you own or control.

## In-app purchases

In-app purchases are non-refundable except as required by law and Apple's standard refund policy. Purchases unlock specific topic packs in the app.

## Acceptable use

Do not reverse engineer, redistribute, or use the app to harm others.

## Disclaimer

The app is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of the app.

## Changes

We may update these terms. Continued use after changes means you accept the updated terms.

## Contact

Questions: support@mindorfact.com
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: build succeeds. Content collection picks up four legal entries.

- [ ] **Step 7: Commit**

```bash
git add src/content
git commit -m "feat(content): add locale field; split legal collection by locale (uk, en)"
```

---

## Task 7: BaseLayout with lang, hreflang, JSON-LD, theme bootstrap

**Files:**
- Rewrite: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Rewrite BaseLayout**

Replace `src/layouts/BaseLayout.astro` entirely with:
```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { ACTIVE_LOCALES, LOCALE_HTML_LANG, DEFAULT_LOCALE, isActiveLocale, type ActiveLocale } from '../i18n/locales';
import { dict } from '../i18n/t';

export interface Props {
  lang: ActiveLocale;
  title?: string;
  description?: string;
  path: string; // path without leading locale, e.g. "/support" or "/"
  noindex?: boolean;
}

const { lang, title, description, path, noindex = false } = Astro.props;

if (!isActiveLocale(lang)) {
  throw new Error(`BaseLayout: unknown lang prop "${lang}"`);
}

const t = dict(lang);
const computedTitle = title ?? `${t.meta.siteName} — ${t.meta.tagline}`;
const computedDesc  = description ?? t.meta.description;

const site = Astro.site?.toString().replace(/\/$/, '') ?? 'https://mindorfact.com';
const cleanPath = path === '/' ? '' : path;
const canonical = `${site}/${lang}${cleanPath}`;

const alternates = ACTIVE_LOCALES.map((loc) => ({
  hreflang: LOCALE_HTML_LANG[loc],
  href: `${site}/${loc}${cleanPath}`,
}));
alternates.push({ hreflang: 'x-default', href: `${site}/${DEFAULT_LOCALE}${cleanPath}` });

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: t.meta.siteName,
  applicationCategory: 'GameApplication',
  operatingSystem: 'iOS 17 or later',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  url: 'https://apps.apple.com/app/id6765670691',
};
---

<!doctype html>
<html lang={LOCALE_HTML_LANG[lang]}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>{computedTitle}</title>
    <meta name="description" content={computedDesc} />
    {noindex && <meta name="robots" content="noindex" />}
    <link rel="canonical" href={canonical} />
    {alternates.map(({ hreflang, href }) => (
      <link rel="alternate" hreflang={hreflang} href={href} />
    ))}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={computedTitle} />
    <meta property="og:description" content={computedDesc} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={`${site}/og-image.png`} />
    <meta property="og:locale" content={LOCALE_HTML_LANG[lang].replace('-', '_')} />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <script is:inline>
      // Apply stored theme before paint to avoid flash.
      try {
        const stored = localStorage.getItem('mf-theme');
        if (stored === 'dark' || stored === 'light') {
          document.documentElement.setAttribute('data-theme', stored);
        }
      } catch {}
    </script>
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class="bg-brand-cream text-brand-ink antialiased">
    <Header lang={lang} path={path} />
    <main id="main" class="container-page py-12 sm:py-20">
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(layout): locale-aware BaseLayout with hreflang and JSON-LD"
```

---

## Task 8: AppStoreBadge component

**Files:**
- Create: `src/components/AppStoreBadge.astro`

- [ ] **Step 1: Create component**

Create `src/components/AppStoreBadge.astro`:
```astro
---
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props {
  lang: ActiveLocale;
  variant?: 'pill' | 'badge';
  class?: string;
}

const { lang, variant = 'pill', class: extraClass = '' } = Astro.props;
const t = dict(lang);
const APP_STORE_URL = 'https://apps.apple.com/app/id6765670691';
---

{variant === 'pill' ? (
  <a
    href={APP_STORE_URL}
    target="_blank"
    rel="noopener"
    aria-label={t.nav.download}
    class={`inline-flex items-center gap-2 rounded-pill bg-brand-pink px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:bg-brand-pink-700 hover:-translate-y-0.5 ${extraClass}`}
  >
    <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
    <span>{t.nav.download}</span>
  </a>
) : (
  <a
    href={APP_STORE_URL}
    target="_blank"
    rel="noopener"
    aria-label={t.nav.download}
    class={`inline-flex items-center gap-3 rounded-2xl bg-brand-ink px-5 py-3 text-white shadow-card transition-transform hover:-translate-y-0.5 ${extraClass}`}
  >
    <svg viewBox="0 0 24 24" class="h-7 w-7" aria-hidden="true">
      <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
    <span class="flex flex-col leading-tight text-left">
      <span class="text-[10px] uppercase tracking-wider opacity-80">{lang === 'uk' ? 'Завантажити в' : 'Download on the'}</span>
      <span class="text-base font-semibold">App Store</span>
    </span>
  </a>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppStoreBadge.astro
git commit -m "feat(components): add AppStoreBadge with pill and badge variants"
```

---

## Task 9: LocaleSwitcher and ThemeToggle

**Files:**
- Create: `src/components/LocaleSwitcher.astro`
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: LocaleSwitcher**

Create `src/components/LocaleSwitcher.astro`:
```astro
---
import { ACTIVE_LOCALES, FUTURE_LOCALES, LOCALE_LABELS, type ActiveLocale, type Locale } from '../i18n/locales';
import { dict } from '../i18n/t';

export interface Props {
  current: ActiveLocale;
  path: string;
}

const { current, path } = Astro.props;
const t = dict(current);
const cleanPath = path === '/' ? '' : path;
---

<nav aria-label={t.nav.toggleLanguage} class="flex items-center gap-1 rounded-pill border border-brand-stroke bg-brand-surface/60 px-1 py-1">
  {ACTIVE_LOCALES.map((loc: Locale) => (
    <a
      href={`/${loc}${cleanPath}`}
      aria-current={loc === current ? 'page' : undefined}
      class={`rounded-pill px-3 py-1 text-xs font-semibold no-underline transition-colors ${loc === current ? 'bg-brand-pink text-white' : 'text-brand-mute hover:text-brand-ink'}`}
    >
      {LOCALE_LABELS[loc]}
    </a>
  ))}
  {FUTURE_LOCALES.map((loc) => (
    <span
      aria-disabled="true"
      title="Coming soon"
      class="rounded-pill px-3 py-1 text-xs font-semibold text-brand-mute opacity-40"
    >
      {LOCALE_LABELS[loc]}
    </span>
  ))}
</nav>
```

- [ ] **Step 2: ThemeToggle**

Create `src/components/ThemeToggle.astro`:
```astro
---
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---

<button
  type="button"
  data-theme-toggle
  aria-label={t.nav.toggleTheme}
  class="grid h-9 w-9 place-items-center rounded-full border border-brand-stroke bg-brand-surface/60 text-brand-ink transition-colors hover:bg-brand-blush"
>
  <svg data-icon-sun viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
  </svg>
  <svg data-icon-moon viewBox="0 0 24 24" class="hidden h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
  </svg>
</button>

<script is:inline>
  (() => {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    const sun = btn.querySelector('[data-icon-sun]');
    const moon = btn.querySelector('[data-icon-moon]');
    const apply = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('mf-theme', theme); } catch {}
      sun?.classList.toggle('hidden', theme === 'dark');
      moon?.classList.toggle('hidden', theme !== 'dark');
    };
    const stored = (() => { try { return localStorage.getItem('mf-theme'); } catch { return null; } })();
    const initial = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(initial);
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') ?? 'light';
      apply(current === 'dark' ? 'light' : 'dark');
    });
  })();
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LocaleSwitcher.astro src/components/ThemeToggle.astro
git commit -m "feat(components): add LocaleSwitcher and ThemeToggle"
```

---

## Task 10: Redesigned Header

**Files:**
- Rewrite: `src/components/Header.astro`

- [ ] **Step 1: Rewrite Header**

Replace `src/components/Header.astro` entirely with:
```astro
---
import LocaleSwitcher from './LocaleSwitcher.astro';
import ThemeToggle from './ThemeToggle.astro';
import AppStoreBadge from './AppStoreBadge.astro';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props {
  lang: ActiveLocale;
  path: string;
}

const { lang, path } = Astro.props;
const t = dict(lang);
---

<header class="sticky top-0 z-40 border-b border-brand-stroke/60 bg-brand-cream/80 backdrop-blur-lg">
  <div class="container-page flex h-16 items-center justify-between gap-4">
    <a href={`/${lang}`} class="flex items-center gap-2 font-display text-lg font-bold text-brand-ink no-underline">
      <span aria-hidden="true" class="grid h-7 w-7 place-items-center rounded-pill bg-brand-pink text-white text-xs">M</span>
      <span>Mindor<span class="text-brand-pink">fact</span></span>
    </a>
    <nav aria-label="Main" class="hidden items-center gap-5 text-sm font-medium text-brand-mute md:flex">
      <a href={`/${lang}/support`} class="no-underline hover:text-brand-ink">{t.nav.support}</a>
      <a href={`/${lang}/privacy`} class="no-underline hover:text-brand-ink">{t.nav.privacy}</a>
      <a href={`/${lang}/terms`} class="no-underline hover:text-brand-ink">{t.nav.terms}</a>
    </nav>
    <div class="flex items-center gap-2">
      <LocaleSwitcher current={lang} path={path} />
      <ThemeToggle lang={lang} />
      <AppStoreBadge lang={lang} variant="pill" class="hidden sm:inline-flex" />
    </div>
  </div>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat(header): redesign with locale switcher, theme toggle, App Store pill"
```

---

## Task 11: Redesigned Footer

**Files:**
- Rewrite: `src/components/Footer.astro`

- [ ] **Step 1: Rewrite Footer**

Replace `src/components/Footer.astro` entirely with:
```astro
---
import LocaleSwitcher from './LocaleSwitcher.astro';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }

const { lang } = Astro.props;
const t = dict(lang);
const year = new Date().getFullYear();
---

<footer class="border-t border-brand-stroke/60 bg-brand-blush/40">
  <div class="container-page grid gap-10 py-12 sm:grid-cols-3">
    <div>
      <p class="font-display text-h3 text-brand-ink">Mindorfact</p>
      <p class="mt-2 max-w-xs text-sm text-brand-mute">{t.meta.description}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider text-brand-mute">{t.footer.legalHeading}</p>
      <ul class="mt-3 space-y-2 text-sm">
        <li><a href={`/${lang}/support`} class="no-underline text-brand-ink hover:text-brand-pink">{t.nav.support}</a></li>
        <li><a href={`/${lang}/privacy`} class="no-underline text-brand-ink hover:text-brand-pink">{t.nav.privacy}</a></li>
        <li><a href={`/${lang}/terms`} class="no-underline text-brand-ink hover:text-brand-pink">{t.nav.terms}</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider text-brand-mute">{t.footer.languagesHeading}</p>
      <div class="mt-3">
        <LocaleSwitcher current={lang} path="/" />
      </div>
    </div>
  </div>
  <div class="border-t border-brand-stroke/60">
    <div class="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-brand-mute sm:flex-row sm:items-center">
      <p>© {year} Kyrylo Holovchenko. {t.footer.rights}</p>
      <p>{t.footer.appleDisclaimer}</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): redesign with three-column layout and locale switcher"
```

---

## Task 12: Locale-aware `[lang]/index.astro` (stub home)

**Files:**
- Create: `src/pages/[lang]/index.astro`

- [ ] **Step 1: Create stub home**

Create `src/pages/[lang]/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import AppStoreBadge from '../../components/AppStoreBadge.astro';
import EmailSignup from '../../components/EmailSignup.astro';
import { ACTIVE_LOCALES, type ActiveLocale } from '../../i18n/locales';
import { dict } from '../../i18n/t';

export function getStaticPaths() {
  return ACTIVE_LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: ActiveLocale };
const t = dict(lang);
---

<BaseLayout lang={lang} path="/">
  <section class="flex flex-col gap-6">
    <p class="text-xs uppercase tracking-widest text-brand-indigo">{t.home.heroKicker}</p>
    <h1 class="font-display text-display-lg text-brand-ink sm:text-display-xl">
      <span class="block">{t.home.heroTitleLine1}</span>
      <span class="block text-brand-pink">{t.home.heroTitleLine2}</span>
    </h1>
    <p class="max-w-prose text-body text-brand-mute">{t.home.heroLede}</p>
    <div class="flex flex-wrap items-center gap-3">
      <AppStoreBadge lang={lang} variant="badge" />
      <a href="#how-it-works" class="inline-flex items-center gap-2 rounded-pill border border-brand-stroke px-5 py-3 text-sm font-semibold text-brand-ink no-underline transition-colors hover:bg-brand-blush">
        {t.home.heroSecondaryCta}
      </a>
    </div>
    <p class="text-sm text-brand-mute">{t.home.heroMeta}</p>
    <p class="text-xs text-brand-mute">{t.home.heroDeviceNote}</p>
  </section>

  <section id="how-it-works" class="mt-20 rounded-card border border-brand-stroke/50 bg-brand-blush/30 p-8">
    <p class="text-sm text-brand-mute">Hero / bento / sample cards / metrics / FAQ → coming in PR 2 &amp; 3.</p>
  </section>

  <section class="mt-16">
    <EmailSignup lang={lang} />
  </section>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/index.astro
git commit -m "feat(pages): locale-aware home stub with hero copy from dictionaries"
```

---

## Task 13: Locale-aware support, privacy, terms pages

**Files:**
- Create: `src/pages/[lang]/support.astro`
- Create: `src/pages/[lang]/privacy.astro`
- Create: `src/pages/[lang]/terms.astro`

- [ ] **Step 1: Support**

Create `src/pages/[lang]/support.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { ACTIVE_LOCALES, type ActiveLocale } from '../../i18n/locales';
import { dict } from '../../i18n/t';

export function getStaticPaths() {
  return ACTIVE_LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: ActiveLocale };
const t = dict(lang);
---

<BaseLayout lang={lang} path="/support" title={`${t.support.title} — ${t.meta.siteName}`}>
  <article class="prose-page">
    <h1 class="font-display text-display-lg text-brand-ink">{t.support.title}</h1>
    <p class="mt-4 max-w-prose text-body text-brand-mute">{t.support.intro}</p>

    <section class="mt-12">
      <h2 class="font-display text-h2 text-brand-ink">{t.support.contactHeading}</h2>
      <p class="mt-3 text-body text-brand-mute">
        {t.support.contactBody} <a href="mailto:support@mindorfact.com" class="text-brand-indigo">support@mindorfact.com</a>
      </p>
      <p class="mt-2 text-sm text-brand-mute">{t.support.responseTime}</p>
    </section>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Privacy**

Create `src/pages/[lang]/privacy.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { ACTIVE_LOCALES, type ActiveLocale } from '../../i18n/locales';
import { dict } from '../../i18n/t';
import { getEntry } from 'astro:content';

export function getStaticPaths() {
  return ACTIVE_LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: ActiveLocale };
const t = dict(lang);
const entry = await getEntry('legal', `${lang}/privacy`);
if (!entry) throw new Error(`Missing privacy entry for ${lang}`);
const { Content } = await entry.render();
---

<BaseLayout lang={lang} path="/privacy" title={`${t.legal.privacyTitle} — ${t.meta.siteName}`}>
  <article class="prose-page max-w-prose">
    <p class="text-xs uppercase tracking-wider text-brand-mute">{t.legal.lastUpdatedPrefix} {entry.data.lastUpdated}</p>
    <Content />
  </article>
</BaseLayout>
```

- [ ] **Step 3: Terms**

Create `src/pages/[lang]/terms.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { ACTIVE_LOCALES, type ActiveLocale } from '../../i18n/locales';
import { dict } from '../../i18n/t';
import { getEntry } from 'astro:content';

export function getStaticPaths() {
  return ACTIVE_LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: ActiveLocale };
const t = dict(lang);
const entry = await getEntry('legal', `${lang}/terms`);
if (!entry) throw new Error(`Missing terms entry for ${lang}`);
const { Content } = await entry.render();
---

<BaseLayout lang={lang} path="/terms" title={`${t.legal.termsTitle} — ${t.meta.siteName}`}>
  <article class="prose-page max-w-prose">
    <p class="text-xs uppercase tracking-wider text-brand-mute">{t.legal.lastUpdatedPrefix} {entry.data.lastUpdated}</p>
    <Content />
  </article>
</BaseLayout>
```

- [ ] **Step 4: Add prose-page utility to global.css**

Open `src/styles/global.css`. In the `@layer components` block, add:
```css
  .prose-page :is(h1, h2, h3) {
    @apply font-display text-brand-ink;
  }
  .prose-page h2 { @apply mt-10 text-h2; }
  .prose-page h3 { @apply mt-6 text-h3; }
  .prose-page p,
  .prose-page li { @apply mt-3 text-body text-brand-mute; }
  .prose-page a { @apply text-brand-indigo; }
  .prose-page ul { @apply mt-3 list-disc pl-6; }
  .prose-page strong { @apply text-brand-ink; }
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/[lang] src/styles/global.css
git commit -m "feat(pages): locale-aware support, privacy, terms with prose styles"
```

---

## Task 14: EmailSignup — locale-aware copy

**Files:**
- Rewrite: `src/components/EmailSignup.astro`

- [ ] **Step 1: Rewrite**

Replace `src/components/EmailSignup.astro` entirely with:
```astro
---
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---

<section class="rounded-card border border-brand-stroke/60 bg-brand-surface p-6 shadow-card sm:p-8">
  <h2 class="font-display text-h2 text-brand-ink">{t.emailSignup.heading}</h2>
  <form action="/api/subscribe" method="post" class="mt-4 flex flex-col gap-3 sm:flex-row">
    <label class="sr-only" for="email-input">{t.emailSignup.placeholder}</label>
    <input
      id="email-input"
      type="email"
      name="email"
      required
      placeholder={t.emailSignup.placeholder}
      class="w-full flex-1 rounded-pill border border-brand-stroke bg-brand-cream px-5 py-3 text-base text-brand-ink placeholder:text-brand-mute focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/40"
    />
    <button
      type="submit"
      class="rounded-pill bg-brand-indigo px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-pink"
    >
      {t.emailSignup.submit}
    </button>
  </form>
  <p class="mt-3 text-xs text-brand-mute">{t.emailSignup.privacyNote}</p>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EmailSignup.astro
git commit -m "feat(email-signup): locale-aware copy and Tailwind restyle"
```

---

## Task 15: Delete legacy non-localized pages

**Files:**
- Delete: `src/pages/index.astro`
- Delete: `src/pages/support.astro`
- Delete: `src/pages/privacy.astro`
- Delete: `src/pages/terms.astro`

- [ ] **Step 1: Remove**

Run:
```bash
cd /Users/kyrylo/Documents/Projects/mindorfact-website/.worktrees/foundations
git rm src/pages/index.astro src/pages/support.astro src/pages/privacy.astro src/pages/terms.astro
```

- [ ] **Step 2: Verify build still succeeds**

Run: `npm run build`
Expected: builds; only `/en/*` and `/uk/*` pages emitted; no root `/`, `/support`, `/privacy`, `/terms` in `dist/`.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore(pages): remove legacy non-localized pages"
```

---

## Task 16: Astro middleware for `/` root redirect

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

Create `src/middleware.ts`:
```ts
import { defineMiddleware } from 'astro:middleware';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, type ActiveLocale } from './i18n/locales';

function pickLocale(acceptLanguage: string | null): ActiveLocale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, qPart] = part.trim().split(';');
      const q = qPart?.startsWith('q=') ? Number(qPart.slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if ((ACTIVE_LOCALES as readonly string[]).includes(base)) {
      return base as ActiveLocale;
    }
  }
  return DEFAULT_LOCALE;
}

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  if (url.pathname === '/' || url.pathname === '') {
    const locale = pickLocale(context.request.headers.get('accept-language'));
    return Response.redirect(new URL(`/${locale}`, url.origin), 302);
  }
  return next();
});
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(middleware): redirect / to locale based on Accept-Language"
```

> **Note:** For `output: 'static'`, Astro middleware runs at build time only and won't fire for runtime requests. The root `/` redirect at runtime is handled by `vercel.json` in the next task. The middleware is retained so behavior is consistent when running `astro dev`.

---

## Task 17: Vercel root redirect + sitemap surface

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add redirect to vercel.json**

Open `vercel.json`. Add a top-level `redirects` array (preserve existing `headers`):
```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/en",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; form-action 'self'; frame-ancestors 'none';" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

(Note: `font-src` extended to include `data:` to permit base64 font fallback if any tooling injects it.)

- [ ] **Step 2: Build and inspect output**

Run: `npm run build`
Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist; pages under `dist/en/` and `dist/uk/` exist; no root `dist/index.html`.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat(vercel): redirect bare / to /en at runtime"
```

---

## Task 18: Playwright smoke test for locale routes and hreflang

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/smoke.spec.ts`

- [ ] **Step 1: Playwright config**

Create `playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    port: 4321,
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
```

- [ ] **Step 2: Smoke test**

Create `tests/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

const LOCALES = ['en', 'uk'] as const;
const PAGES = ['', '/support', '/privacy', '/terms'] as const;

for (const locale of LOCALES) {
  for (const page of PAGES) {
    test(`/${locale}${page} renders with hreflang alternates`, async ({ page: pwPage }) => {
      await pwPage.goto(`/${locale}${page}`);
      await expect(pwPage.locator('html')).toHaveAttribute('lang', locale === 'uk' ? 'uk-UA' : 'en');
      const hreflangs = await pwPage.locator('link[rel="alternate"][hreflang]').count();
      expect(hreflangs).toBeGreaterThanOrEqual(LOCALES.length + 1); // active locales + x-default
      const canonical = await pwPage.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain(`/${locale}${page === '' ? '' : page}`);
    });
  }
}

test('Header has locale switcher with active locale marked', async ({ page }) => {
  await page.goto('/en');
  const active = page.locator('header a[aria-current="page"]');
  await expect(active).toHaveText('EN');
});

test('App Store CTA links to apps.apple.com', async ({ page }) => {
  await page.goto('/en');
  const cta = page.locator('header a[href*="apps.apple.com"]').first();
  await expect(cta).toBeVisible();
});

test('Theme toggle flips data-theme attribute', async ({ page }) => {
  await page.goto('/en');
  const html = page.locator('html');
  const before = (await html.getAttribute('data-theme')) ?? 'light';
  await page.locator('[data-theme-toggle]').click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);
});
```

- [ ] **Step 3: Run tests**

Run: `npm run test:e2e`
Expected: all tests pass. If any fail, fix the underlying component/page, do not weaken the assertions.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/smoke.spec.ts
git commit -m "test(smoke): Playwright smoke covering locale routes, hreflang, theme, CTA"
```

---

## Task 19: Final build verification + push + PR

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

Run:
```bash
rm -rf dist .astro/.cache
npm run build
```
Expected: build completes; emitted pages: `/en/`, `/en/support/`, `/en/privacy/`, `/en/terms/`, `/uk/`, `/uk/support/`, `/uk/privacy/`, `/uk/terms/`, `/sitemap-index.xml`, `/sitemap-0.xml`.

- [ ] **Step 2: Preview and visually inspect**

Run: `npm run preview -- --port 4321`
Open in browser: http://localhost:4321/en and http://localhost:4321/uk
Verify by eye:
- Header sticky, locale switcher present, theme toggle flips colors.
- Hero stub text reads naturally in both languages.
- Footer three-column layout renders on desktop.
- `/en/privacy` and `/uk/privacy` show different copy.
- Mobile viewport (DevTools 375px): nav collapses gracefully, no horizontal scroll.

Stop preview (Ctrl+C).

- [ ] **Step 3: Lighthouse quick check**

Run:
```bash
npx --yes lighthouse http://localhost:4321/en --only-categories=performance,accessibility,seo,best-practices --form-factor=mobile --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json --quiet
node -e "const r=require('/tmp/lh.json').categories; console.log({perf:r.performance.score, a11y:r.accessibility.score, seo:r.seo.score, best:r['best-practices'].score});"
```
Expected: all four ≥ 0.95. Fix any regressions before continuing.

> Reminder: start preview again in another terminal before running Lighthouse if Step 2 was stopped.

- [ ] **Step 4: Push branch**

Run:
```bash
cd /Users/kyrylo/Documents/Projects/mindorfact-website/.worktrees/foundations
git push -u origin feat/foundations-i18n-tokens
```

- [ ] **Step 5: Open PR**

Run:
```bash
gh pr create --base main --title "PR 1 — Foundations: Tailwind, tokens, i18n, redesigned chrome" --body "$(cat <<'EOF'
## Summary

- Adds Tailwind, Onest font, design tokens (Spark theme palette).
- Introduces Astro i18n routing with active locales `en` + `uk`; `de` + `fr` scaffolded with English fallback.
- Splits legal collection by locale; adds English privacy and terms.
- Rewrites Header (locale switcher, theme toggle, App Store pill) and Footer (3-col layout).
- Adds `BaseLayout` with `hreflang` alternates, canonical, OG, JSON-LD `SoftwareApplication`.
- Adds `@astrojs/sitemap`; root `/` redirects to `/en` via `vercel.json`.
- Adds Playwright smoke tests for locale routes, hreflang, theme, CTA.

## Spec

`docs/superpowers/specs/2026-05-15-website-redesign-design.md` — this is PR 1 of 4 in the slice plan.

## Test plan

- [ ] CI: `npm run build` succeeds
- [ ] CI: `npm run test:e2e` smoke passes
- [ ] Manual: visit `/`, `/en`, `/uk`, `/en/privacy`, `/uk/privacy`, verify localized content and hreflang
- [ ] Manual: toggle theme — flips light/dark and persists across reload
- [ ] Manual: Lighthouse ≥ 95 across all four categories on `/en`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL returned.

- [ ] **Step 6: Report PR URL back to user**

Output the PR URL to the user so they can review.

---

## Self-Review

**Spec coverage** — checked §-by-§ against `docs/superpowers/specs/2026-05-15-website-redesign-design.md`:

| Spec section | Covered by | Notes |
|---|---|---|
| §4 IA — `/uk`, `/en`, `/uk/{support,privacy,terms}`, `/en/{...}` | Tasks 12, 13 | ✓ |
| §4 IA — `/de`, `/fr` scaffolding | Task 5 (dictionaries) + astro.config locales | ✓ scaffolded; pages NOT generated until copy lands (acceptable per spec phase 2) |
| §4 IA — `/press` | not in PR 1 | Deferred to PR 4 per slice plan §12 |
| §5 Stack — Astro, Tailwind, fonts, sitemap, icons | Tasks 1, 2, 3, 4 | ✓ |
| §5 Web tokens | Tasks 2, 4 | ✓ both CSS variables and Tailwind theme |
| §6 Sections S0 — sticky nav | Task 10 Header | ✓ foundations; visual polish continues PR 2 |
| §6 Sections S1–S7 home | not in PR 1 | Stub only (Task 12); detail in PR 2–3 per slice plan |
| §7 Sub-pages support/privacy/terms | Task 13 | ✓ |
| §7 `/press` | not in PR 1 | PR 4 |
| §8 i18n — dictionaries, hreflang, root redirect | Tasks 5, 7, 16, 17 | ✓ |
| §9 Component map — Header, Footer, BaseLayout, AppStoreBadge, LocaleSwitcher, ThemeToggle, EmailSignup | Tasks 7–14 | ✓ remaining components (HeroSplit, BentoTile, etc.) in PR 2–3 |
| §11 Testing — Lighthouse, hreflang, a11y, Playwright | Tasks 18, 19 Step 3 | ✓ smoke covers locales + hreflang; Lighthouse manual gate |
| §13 Open questions | Out of scope | All 5 deferred until user confirms; defaults chosen in this plan are: sample cards skipped (PR 3 territory), screenshots from `fastlane/screenshots/uk-UA/` planned for PR 2, EmailSignup endpoint remains stub. |

**Placeholder scan:** No "TBD"/"TODO"/"fill in"/"appropriate error handling"/etc. patterns. Every code block contains the actual code.

**Type consistency:**
- `ActiveLocale` used consistently across Header, Footer, BaseLayout, LocaleSwitcher, ThemeToggle, EmailSignup, AppStoreBadge, page files.
- `path` prop format ('/', '/support', '/privacy', '/terms') matches between BaseLayout, Header, LocaleSwitcher.
- `dict(lang)` import path stable: `'../i18n/t'` from components, `'../../i18n/t'` from `[lang]/` pages.
- `t.nav.download`, `t.home.heroKicker`, etc. — all keys referenced exist in the `Dictionary` type and in `en.ts` / `uk.ts`.
- `LOCALE_HTML_LANG['uk']` = `'uk-UA'` consistent in BaseLayout output and Playwright assertion.

**One known caveat (logged, not a blocker):** Astro middleware does not run at runtime in `output: 'static'`. The `vercel.json` redirect (Task 17) handles the runtime `/` redirect; the middleware (Task 16) handles dev preview and any future `output: 'server'` migration. This is documented inline in Task 16.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-15-pr1-foundations.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task (or per small group), review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
