# PR 2 — Hero split + Bento features

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development`.

**Goal:** Replace the home stub with a full hero section (iPhone frame + 2 floating sample cards) and a 6-tile bento grid that explains modes, topics, party, sync, ad-free daily, and the free + IAP model. Site looks like a real product after this PR.

**Architecture:** Pure Astro components, no JS framework. Sample card flip uses CSS-only `:hover`/`:focus-within` + `peer-checked` (hidden input). iPhone bezel is inline SVG. Bento layout uses Tailwind 12-col grid with explicit `col-span-*` and `row-span-*` per tile.

**Tech Stack:** Astro 4.15, Tailwind 3.4, inline SVG, public PNG screenshot. No new deps.

**Spec ref:** §6 sections S1 + S2 in `docs/superpowers/specs/2026-05-15-website-redesign-design.md`.

**Branch:** `feat/pr2-hero-bento` off `main` in worktree `.worktrees/hero-bento`.

**Legal note:** App ships 10 topic packs but 5 are licensed brand names pending the v1.2.0 legal-naming refactor (Paw Patrol, Friends, How I Met Your Mother, Big Bang Theory, Supernatural). The site shows only the 5 generic packs (Art, Science, Nature, Space, General) and mentions extra "fan facts inside" generically.

---

## File Structure

```
mindorfact-website/
├── public/
│   └── screenshots/
│       ├── solo-quiz-uk.png             (copied from iOS fastlane)
│       └── topic-selection-uk.png       (copied from iOS fastlane)
├── src/
│   ├── data/
│   │   ├── topics.ts                    (5 generic topics + emoji + label key)
│   │   └── sample-cards.ts              (6 hand-picked cards, en + uk strings)
│   ├── components/
│   │   ├── PhoneFrame.astro             (SVG iPhone bezel + slot)
│   │   ├── SampleCard.astro             (CSS-only flip card)
│   │   ├── HeroSplit.astro              (full hero S1)
│   │   ├── BentoTile.astro              (one bento tile primitive)
│   │   ├── BentoFeatures.astro          (6 tiles, S2)
│   │   └── TopicPills.astro             (animated emoji pills for bento tile #3)
│   ├── i18n/
│   │   ├── types.ts                     (extend Dictionary type)
│   │   ├── en.ts                        (add hero + bento keys)
│   │   └── uk.ts                        (add hero + bento keys)
│   └── pages/
│       └── [lang]/
│           └── index.astro              (replace stub with HeroSplit + BentoFeatures)
└── tests/
    └── smoke.spec.ts                    (extend with hero + bento assertions)
```

---

## Task 0: Worktree

- [ ] Confirm `.worktrees/hero-bento` is on `feat/pr2-hero-bento` and clean. Run `npm install`. Run `npm run build` to confirm green baseline.

## Task 1: Copy iPhone screenshots into `public/screenshots/`

**Files:** create `public/screenshots/{solo-quiz-uk.png,topic-selection-uk.png}`.

- [ ] Copy from iOS repo:
  ```bash
  mkdir -p public/screenshots
  cp "/Users/kyrylo/Documents/Projects/mindorfact/fastlane/screenshots/uk/iPhone 17 Pro Max-02SoloQuiz.png" public/screenshots/solo-quiz-uk.png
  cp "/Users/kyrylo/Documents/Projects/mindorfact/fastlane/screenshots/uk/iPhone 17 Pro Max-01TopicSelection.png" public/screenshots/topic-selection-uk.png
  ```
- [ ] Verify each PNG opens (`file public/screenshots/*.png` should print PNG image data with valid dims).
- [ ] Commit:
  ```bash
  git add public/screenshots/
  git commit -m "feat(assets): copy iPhone screenshots from iOS fastlane into public/"
  ```

## Task 2: Topics data — `src/data/topics.ts`

**Files:** create `src/data/topics.ts`.

- [ ] Content (5 generic topics + i18n hooks for labels):

```ts
export type TopicSlug = 'general' | 'art' | 'science' | 'nature' | 'space';

export type Topic = {
  slug: TopicSlug;
  emoji: string;
  /** i18n key in dict.topics.{slug} */
  labelKey: TopicSlug;
};

export const TOPICS: Topic[] = [
  { slug: 'general', emoji: '🧠', labelKey: 'general' },
  { slug: 'art',     emoji: '🎨', labelKey: 'art' },
  { slug: 'science', emoji: '🧪', labelKey: 'science' },
  { slug: 'nature',  emoji: '🦒', labelKey: 'nature' },
  { slug: 'space',   emoji: '🪐', labelKey: 'space' },
];
```

- [ ] Commit: `feat(data): add generic topics list (legal-safe subset)`.

## Task 3: Sample cards data — `src/data/sample-cards.ts`

**Files:** create `src/data/sample-cards.ts`.

Source: hand-picked from `/Users/kyrylo/Documents/Projects/mindorfact/content/locales/{en,uk}/{science,nature,space,art}/fact_vs_opinion_easy.json`.

- [ ] Content shape:

```ts
import type { ActiveLocale } from '../i18n/locales';

export type SampleCard = {
  id: string;
  topic: 'science' | 'nature' | 'space' | 'art';
  emoji: string;
  statement: Record<ActiveLocale, string>;
  /** A = fact, B = opinion */
  correctAnswer: 'A' | 'B';
  explanation: Record<ActiveLocale, string>;
};
```

- [ ] Pick 6 cards. Use the real ids; do not invent content. Suggested set:
  - `fact-opinion_science_easy_001` (Gravity / Гравітація — A)
  - `fact-opinion_science_easy_003` (Sound faster than light / Звук швидший — B)
  - `fact-opinion_nature_easy_001` (Giraffe tallest / Жираф найвищий — A)
  - `fact-opinion_nature_easy_002` (Swans most graceful / Лебеді найграційніші — B)
  - One from `space/fact_vs_opinion_easy.json` (pick any A-answer card)
  - One from `art/fact_vs_opinion_easy.json` (pick any B-answer card)
- [ ] Build copies: open the iOS JSONs, read the `statement` and `explanation` strings, paste verbatim into the data file. Match emojis to topic: science 🧪, nature 🦒, space 🪐, art 🎨.
- [ ] `export const SAMPLE_CARDS: SampleCard[] = [...]` and `export const HERO_FLOAT_CARDS = SAMPLE_CARDS.slice(0, 2);`.
- [ ] Commit: `feat(data): add 6 sample cards (real content from iOS bundle)`.

## Task 4: Extend Dictionary type + en/uk copy

**Files:** modify `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/uk.ts`. DE/FR aliases inherit automatically.

- [ ] In `types.ts`, EXTEND the `Dictionary` type. ADD these subtrees (do NOT remove existing keys):

```ts
  topics: {
    general: string;
    art: string;
    science: string;
    nature: string;
    space: string;
    moreFanFacts: string;
  };
  hero: {
    /** Used as front of the answer-revealed sample card */
    factLabel: string;
    opinionLabel: string;
  };
  bento: {
    soloDaily: { title: string; body: string; streakLabel: string };
    party: { title: string; body: string };
    topics: { title: string; body: string };
    icloud: { title: string; body: string };
    noAds: { title: string; body: string };
    freeWithPacks: { title: string; body: string };
    sectionKicker: string;
  };
```

- [ ] In `en.ts`, ADD matching keys with English copy. Example:

```ts
  topics: {
    general: 'General',
    art: 'Art',
    science: 'Science',
    nature: 'Nature',
    space: 'Space',
    moreFanFacts: '+5 fan-fact packs inside',
  },
  hero: { factLabel: 'Fact', opinionLabel: 'Opinion' },
  bento: {
    sectionKicker: 'What you get',
    soloDaily: {
      title: 'Solo + Daily challenge',
      body: 'A fresh card every day. Build streaks. No ads in Daily — ever.',
      streakLabel: 'Today',
    },
    party: {
      title: 'Party mode',
      body: 'Pass the phone around the table. Friends shout their answers, the app keeps score.',
    },
    topics: {
      title: '10 topic packs',
      body: 'Art, science, nature, space, general — plus extra fan-fact packs unlocked from the store.',
    },
    icloud: {
      title: 'iCloud sync',
      body: 'No accounts. Progress moves with your Apple ID.',
    },
    noAds: {
      title: 'No ads in Daily',
      body: 'Daily Challenge is always ad-free, even on the free tier.',
    },
    freeWithPacks: {
      title: 'Free to play. Unlock more.',
      body: 'Start with hundreds of free cards. Buy individual packs only if you want more.',
    },
  },
```

- [ ] In `uk.ts`, ADD same keys with Ukrainian copy. Match domestic-tone guideline (no bureaucratic verbs, concrete domestic scenes). Example:

```ts
  topics: {
    general: 'Загальні',
    art: 'Мистецтво',
    science: 'Наука',
    nature: 'Природа',
    space: 'Космос',
    moreFanFacts: '+5 пакетів фан-фактів усередині',
  },
  hero: { factLabel: 'Факт', opinionLabel: 'Думка' },
  bento: {
    sectionKicker: 'Що всередині',
    soloDaily: {
      title: 'Соло + щоденний виклик',
      body: 'Нова картка щодня. Тримай серію днів. У "Щоденному" — без реклами назавжди.',
      streakLabel: 'Сьогодні',
    },
    party: {
      title: 'Режим вечірки',
      body: 'Передавай телефон по колу. Друзі вигукують відповіді — додаток рахує бали.',
    },
    topics: {
      title: '10 пакетів тем',
      body: 'Мистецтво, наука, природа, космос, загальні — плюс додаткові фан-факти в магазині.',
    },
    icloud: {
      title: 'Синхронізація через iCloud',
      body: 'Без аккаунтів. Прогрес тримається на твоєму Apple ID.',
    },
    noAds: {
      title: 'У "Щоденному" без реклами',
      body: 'Щоденний виклик завжди без реклами, навіть у безкоштовній версії.',
    },
    freeWithPacks: {
      title: 'Грай безкоштовно. Розблоковуй більше.',
      body: 'Старт із сотень безкоштовних карток. Купуй окремі пакети, якщо хочеш ще.',
    },
  },
```

- [ ] Verify TypeScript: `npm run build` succeeds. Mismatched keys will surface as a type error.
- [ ] Commit: `feat(i18n): add hero + bento + topics copy (en, uk)`.

## Task 5: SampleCard component

**Files:** create `src/components/SampleCard.astro`.

- [ ] CSS-only flip via `<input type="checkbox">` hidden behind a label. Keyboard-accessible via the input being focusable.

```astro
---
import type { SampleCard } from '../data/sample-cards';
import type { ActiveLocale } from '../i18n/locales';
import { dict } from '../i18n/t';

export interface Props {
  card: SampleCard;
  lang: ActiveLocale;
  /** Tilt in degrees applied to the OUTER wrapper; the inner flip face is not tilted. */
  tilt?: number;
  /** Width in rem at default breakpoint. */
  width?: number;
  class?: string;
}

const { card, lang, tilt = 0, width = 18, class: extra = '' } = Astro.props;
const t = dict(lang);
const answerLabel = card.correctAnswer === 'A' ? t.hero.factLabel : t.hero.opinionLabel;
const checkboxId = `sc-${card.id}`;
---

<div class={`sample-card ${extra}`} style={`--tilt:${tilt}deg; --w:${width}rem;`}>
  <input id={checkboxId} type="checkbox" class="peer sr-only" />
  <label for={checkboxId} class="block w-[var(--w)] cursor-pointer select-none">
    <div class="sc-flip relative aspect-[5/6] [transform-style:preserve-3d] transition-transform duration-500 peer-checked/parent:[transform:rotateY(180deg)]">
      <!-- front -->
      <div class="absolute inset-0 [backface-visibility:hidden] rounded-card border border-brand-stroke bg-brand-surface p-5 shadow-card flex flex-col gap-3">
        <span class="text-2xl">{card.emoji}</span>
        <p class="text-body text-brand-ink leading-snug">{card.statement[lang]}</p>
        <span class="mt-auto text-xs uppercase tracking-wider text-brand-mute">Tap to flip</span>
      </div>
      <!-- back -->
      <div class="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-card border border-brand-stroke bg-brand-blush p-5 shadow-card flex flex-col gap-3">
        <span class="inline-flex w-fit rounded-pill bg-brand-pink px-3 py-1 text-xs font-semibold text-white">{answerLabel}</span>
        <p class="text-caption text-brand-ink leading-snug">{card.explanation[lang]}</p>
      </div>
    </div>
  </label>
</div>

<style>
  .sample-card { transform: rotate(var(--tilt)); }
  /* Tailwind doesn't ship :has-style flips out of the box for sibling-input; use a small CSS bridge: */
  .sample-card:has(input:checked) .sc-flip { transform: rotateY(180deg); }
</style>
```

> NOTE: The Tailwind class `peer-checked/parent:[transform:rotateY(180deg)]` is incorrect syntactically (no `peer/parent` setup); the `:has(input:checked)` rule in the `<style>` block is what actually drives the flip. Remove the inline `peer-checked` class to avoid the dead utility — keep the `peer sr-only` on the input only. Update the inner div to drop the unused class.

**Cleaned version** of the inner div:
```astro
    <div class="sc-flip relative aspect-[5/6] transition-transform duration-500" style="transform-style:preserve-3d">
```

- [ ] Commit: `feat(components): add SampleCard with CSS-only flip interaction`.

## Task 6: PhoneFrame component

**Files:** create `src/components/PhoneFrame.astro`.

- [ ] SVG bezel of an iPhone (rounded rectangle with notch), slot for image. Aspect 9:19.5 (typical iPhone), max-width 19rem.

```astro
---
export interface Props {
  src: string;
  alt: string;
  width?: number;
  class?: string;
}
const { src, alt, width = 19, class: extra = '' } = Astro.props;
---
<div class={`phone-frame relative isolate ${extra}`} style={`width:${width}rem`}>
  <div class="aspect-[9/19.5] rounded-[2.6rem] bg-brand-ink p-[0.45rem] shadow-lifted">
    <div class="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-brand-cream">
      <!-- dynamic island -->
      <div class="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-20 rounded-pill bg-brand-ink z-10"></div>
      <img src={src} alt={alt} loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" />
    </div>
  </div>
</div>
```

- [ ] Commit: `feat(components): add PhoneFrame with iPhone bezel and dynamic island`.

## Task 7: HeroSplit component (S1)

**Files:** create `src/components/HeroSplit.astro`.

- [ ] Layout: 12-col grid. Left 6 (lg+) = copy + CTAs; right 6 = phone + two floating sample cards (`-rotate-6` and `+rotate-3`). Mobile: stack.

```astro
---
import AppStoreBadge from './AppStoreBadge.astro';
import PhoneFrame from './PhoneFrame.astro';
import SampleCard from './SampleCard.astro';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';
import { HERO_FLOAT_CARDS } from '../data/sample-cards';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---

<section class="grid grid-cols-1 gap-12 py-6 sm:py-10 lg:grid-cols-12 lg:gap-8">
  <div class="lg:col-span-6 flex flex-col gap-6 lg:justify-center">
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
  </div>

  <div class="lg:col-span-6 relative grid place-items-center min-h-[28rem]">
    <PhoneFrame src="/screenshots/solo-quiz-uk.png" alt="Mindorfact" />
    <div class="absolute -top-2 -left-2 sm:left-0 sm:-translate-x-1/2">
      <SampleCard card={HERO_FLOAT_CARDS[0]} lang={lang} tilt={-6} width={14} class="opacity-95" />
    </div>
    <div class="absolute -bottom-2 -right-2 sm:right-0 sm:translate-x-1/3">
      <SampleCard card={HERO_FLOAT_CARDS[1]} lang={lang} tilt={4} width={14} class="opacity-95" />
    </div>
  </div>
</section>
```

- [ ] Commit: `feat(home): hero split layout with phone frame and floating cards`.

## Task 8: BentoTile primitive

**Files:** create `src/components/BentoTile.astro`.

- [ ] Props: `colSpan` (1-12), `rowSpan` (1-3), `accent` (`pink` | `indigo` | `cream`). Slot for visual.

```astro
---
export interface Props {
  colSpan?: number;
  rowSpan?: number;
  accent?: 'pink' | 'indigo' | 'cream';
  class?: string;
}
const { colSpan = 6, rowSpan = 1, accent = 'cream', class: extra = '' } = Astro.props;
const bg = accent === 'pink' ? 'bg-brand-pink/10' : accent === 'indigo' ? 'bg-brand-indigo/10' : 'bg-brand-blush/60';
---
<article
  class={`group rounded-card border border-brand-stroke/60 ${bg} p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lifted ${extra}`}
  style={`grid-column: span ${colSpan} / span ${colSpan}; grid-row: span ${rowSpan} / span ${rowSpan};`}
>
  <slot />
</article>
```

> NOTE: We rely on inline `style` for col/row span instead of Tailwind utility classes because Tailwind purges unused class names; dynamically computed spans wouldn't be reachable by the JIT scanner.

- [ ] Commit: `feat(components): add BentoTile primitive with col/row span and accent`.

## Task 9: TopicPills (small atom used inside bento "topics" tile)

**Files:** create `src/components/TopicPills.astro`.

- [ ] Render 5 generic emoji pills + one "more fan facts" pill. Subtle marquee not needed in v1.

```astro
---
import { TOPICS } from '../data/topics';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---
<ul class="flex flex-wrap gap-2">
  {TOPICS.map((topic) => (
    <li class="inline-flex items-center gap-1.5 rounded-pill bg-brand-surface px-3 py-1.5 text-sm shadow-card">
      <span aria-hidden="true">{topic.emoji}</span>
      <span class="font-medium text-brand-ink">{t.topics[topic.labelKey]}</span>
    </li>
  ))}
  <li class="inline-flex items-center gap-1.5 rounded-pill border border-dashed border-brand-stroke px-3 py-1.5 text-sm text-brand-mute">
    {t.topics.moreFanFacts}
  </li>
</ul>
```

- [ ] Commit: `feat(components): add TopicPills`.

## Task 10: BentoFeatures (S2)

**Files:** create `src/components/BentoFeatures.astro`.

- [ ] Six tiles in a 12-col grid, three visual rows. Use BentoTile + TopicPills.

```astro
---
import BentoTile from './BentoTile.astro';
import TopicPills from './TopicPills.astro';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---
<section id="how-it-works" class="mt-24">
  <p class="text-xs uppercase tracking-widest text-brand-indigo">{t.bento.sectionKicker}</p>
  <h2 class="mt-2 font-display text-h2 text-brand-ink sm:text-display-lg">{t.home.heroSecondaryCta}</h2>

  <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[minmax(140px,_auto)]">
    <BentoTile colSpan={8} rowSpan={2} accent="pink">
      <p class="text-xs uppercase tracking-wider text-brand-pink">{t.bento.soloDaily.streakLabel}</p>
      <h3 class="mt-2 font-display text-h3 text-brand-ink">{t.bento.soloDaily.title}</h3>
      <p class="mt-2 text-body text-brand-mute">{t.bento.soloDaily.body}</p>
    </BentoTile>

    <BentoTile colSpan={4} rowSpan={2} accent="indigo">
      <h3 class="font-display text-h3 text-brand-ink">{t.bento.party.title}</h3>
      <p class="mt-2 text-body text-brand-mute">{t.bento.party.body}</p>
    </BentoTile>

    <BentoTile colSpan={6} rowSpan={2} accent="cream">
      <h3 class="font-display text-h3 text-brand-ink">{t.bento.topics.title}</h3>
      <p class="mt-2 text-body text-brand-mute">{t.bento.topics.body}</p>
      <div class="mt-4">
        <TopicPills lang={lang} />
      </div>
    </BentoTile>

    <BentoTile colSpan={3} rowSpan={1} accent="cream">
      <h3 class="font-display text-base font-semibold text-brand-ink">{t.bento.icloud.title}</h3>
      <p class="mt-1 text-caption text-brand-mute">{t.bento.icloud.body}</p>
    </BentoTile>

    <BentoTile colSpan={3} rowSpan={1} accent="cream">
      <h3 class="font-display text-base font-semibold text-brand-ink">{t.bento.noAds.title}</h3>
      <p class="mt-1 text-caption text-brand-mute">{t.bento.noAds.body}</p>
    </BentoTile>

    <BentoTile colSpan={12} rowSpan={1} accent="pink">
      <h3 class="font-display text-h3 text-brand-ink">{t.bento.freeWithPacks.title}</h3>
      <p class="mt-2 text-body text-brand-mute">{t.bento.freeWithPacks.body}</p>
    </BentoTile>
  </div>
</section>
```

- [ ] Commit: `feat(home): bento features section with 6 tiles`.

## Task 11: Wire into `[lang]/index.astro`

**Files:** modify `src/pages/[lang]/index.astro`.

- [ ] Replace the existing `<section>` (hero stub) with `<HeroSplit>`. Replace the existing `#how-it-works` placeholder section with `<BentoFeatures>`. Keep the `<EmailSignup>` block at the bottom. Imports adjust accordingly.

Final page body:

```astro
<BaseLayout lang={lang} path="/">
  <HeroSplit lang={lang} />
  <BentoFeatures lang={lang} />
  <section class="mt-24">
    <EmailSignup lang={lang} />
  </section>
</BaseLayout>
```

- [ ] Commit: `feat(home): replace stub with HeroSplit + BentoFeatures`.

## Task 12: Extend Playwright smoke

**Files:** modify `tests/smoke.spec.ts`.

- [ ] Add after existing tests:

```ts
test('Home shows hero with phone frame and 2 floating cards', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText(/card game/i);
  // Phone screenshot is loaded
  await expect(page.locator('img[src="/screenshots/solo-quiz-uk.png"]')).toBeVisible();
  // At least 2 SampleCards in hero region (more in S3 later — this just guards presence)
  const cards = page.locator('.sample-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(2);
});

test('Bento section renders 6 tiles', async ({ page }) => {
  await page.goto('/en');
  const tiles = page.locator('section#how-it-works article');
  expect(await tiles.count()).toBe(6);
});

test('UK home renders Ukrainian hero copy', async ({ page }) => {
  await page.goto('/uk');
  await expect(page.locator('h1')).toContainText('Карткова гра');
});
```

- [ ] Run: `npm run test:e2e`. Expect 14/14 (11 existing + 3 new) passing. Fix components if any fail.
- [ ] Commit: `test(smoke): assert hero + bento render on home`.

## Task 13: Build verification + push + open PR

- [ ] `rm -rf dist .astro/.cache .vercel/output && npm run build`. Confirm 8 routes still emit, no warnings.
- [ ] Run Lighthouse on `/en`. Expect Performance ≥ 90 (hero adds image weight; 95 in PR 1 may slip a bit but should hold ≥ 90). a11y/seo/best-practices still ≥ 95.
- [ ] Push: `git push -u origin feat/pr2-hero-bento`.
- [ ] PR via `gh pr create`:

```
Title: PR 2 — Hero split + Bento features
Body:
## Summary
- Replaces home stub with full hero (split layout, iPhone frame from the iOS app, 2 floating real-content sample cards with CSS-only flip).
- Adds bento features section: Solo+Daily, Party, 10 topic packs (5 generic + fan-facts tease), iCloud sync, no-ads-in-Daily, free-with-packs.
- Topic naming is legal-safe: only the 5 generic packs surface by name; the 5 licensed brand packs are referenced generically per the pending v1.2.0 legal-naming refactor.
- Sample card content is real, sourced from `/Users/kyrylo/Documents/Projects/mindorfact/content/locales/{en,uk}/`.

## Spec & Plan
- Spec: `docs/superpowers/specs/2026-05-15-website-redesign-design.md` (§6 S1 + S2)
- Plan: `docs/superpowers/plans/2026-05-15-pr2-hero-bento.md`

## Test plan
- [x] `npm run build` — 8 localized routes
- [x] `npm run test:e2e` — 14/14
- [ ] Manual: visit `/en` and `/uk`, verify hero phone shows screenshot, both floating cards are visible and flip on click/tap, bento tiles all render
- [ ] Lighthouse mobile `/en` ≥ 90 perf, ≥ 95 a11y/seo/best-practices
```

## Self-Review

- §6 S1 hero: covered by tasks 1, 5, 6, 7.
- §6 S2 bento: covered by tasks 8, 9, 10.
- Real card content sourced from iOS bundle: task 3.
- Legal-safe topic surfacing: tasks 2, 4 (`moreFanFacts` key), 10.
- Phone frame uses real screenshot from iOS fastlane: task 1, 6, 7.
- i18n: every string flows through `dict(lang)` → `t.bento.*`, `t.hero.*`, `t.topics.*`. No hardcoded copy. Task 4.
- Tests: tasks 12.
- No new deps. Pure Astro + Tailwind + CSS.
- Known caveat: only `uk` screenshot exists in iOS repo; both `/en` and `/uk` use it in PR 2. PR 3 or later will add `en` screenshot or generate a non-localized stylized mockup.

## Execution

Will run via `superpowers:subagent-driven-development` after this plan is committed.
