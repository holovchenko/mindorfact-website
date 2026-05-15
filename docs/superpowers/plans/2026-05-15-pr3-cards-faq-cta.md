# PR 3 — Sample cards gallery + Metrics + FAQ + Final CTA

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development`.

**Goal:** Finish the home page below the bento — add the 6-card sample gallery (S3), the metrics block (S4), the FAQ (S5), and the final CTA strip (S6). Home page is fully fleshed out after this PR; press kit lands in PR 4.

**Architecture:** All sections are pure Astro components. FAQ uses native `<details>` (no JS). Final CTA is a full-bleed gradient strip. Reuse `SampleCard` from PR 2 unchanged. Add new dictionary keys + a typed FAQ list per locale. All data is locale-aware via `Record<ActiveLocale, ...>`.

**Tech Stack:** Astro 4.15, Tailwind 3.4. No new deps.

**Spec ref:** §6 sections S3 + S4 + S5 + S6 in `docs/superpowers/specs/2026-05-15-website-redesign-design.md`.

**Branch:** `feat/pr3-cards-faq-cta` off `main` (PR 2 will land separately; if it merges first, rebase). Worktree: `.worktrees/cards-faq`.

**Dependency caveat:** PR 3 reuses `SampleCard.astro`, `SAMPLE_CARDS`, and i18n keys (`t.hero.factLabel`, `t.hero.opinionLabel`) introduced in PR 2. If PR 2 has not been merged when PR 3 work starts, the branch is forked off main without those — so PR 3 build will fail until PR 2 merges. Plan accommodates this by rebasing PR 3 branch onto main after PR 2 merges.

---

## File Structure

```
mindorfact-website/
├── src/
│   ├── components/
│   │   ├── CardGallery.astro        (create — S3, reuses SampleCard)
│   │   ├── MetricsBlock.astro       (create — S4)
│   │   ├── FAQList.astro            (create — S5, <details>)
│   │   └── FinalCTA.astro           (create — S6, full-bleed)
│   ├── data/
│   │   └── faq.ts                   (create — typed FAQ entries en+uk)
│   ├── i18n/
│   │   ├── types.ts                 (extend Dictionary with sections S3-S6 keys)
│   │   ├── en.ts                    (add copy)
│   │   └── uk.ts                    (add copy)
│   └── pages/
│       └── [lang]/
│           └── index.astro          (modify — append S3-S6, drop standalone EmailSignup)
└── tests/
    └── smoke.spec.ts                (extend with gallery + faq + cta assertions)
```

---

## Task 0: Worktree baseline

- [ ] `.worktrees/cards-faq` on `feat/pr3-cards-faq-cta`. If PR 2 already merged on origin/main, `git fetch && git rebase origin/main`. `npm install && npm run build` — baseline must include PR 2's hero+bento for downstream tasks to work. If build fails because PR 2 hasn't merged yet, STOP and report — controller must rebase or wait.

## Task 1: Extend Dictionary + dictionaries (cards/metrics/faq/finalCta)

**Files:** modify `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/uk.ts`.

- [ ] In `types.ts`, ADD these top-level fields to `Dictionary`:

```ts
  cardGallery: {
    heading: string;
    sub: string;
    cta: string;
  };
  metrics: {
    heading: string;
    cards: string;
    topics: string;
    languages: string;
    offline: string;
    cardsValue: string;
    topicsValue: string;
    languagesValue: string;
    offlineValue: string;
    madeIn: string;
  };
  faq: {
    heading: string;
  };
  finalCta: {
    heading: string;
    sub: string;
    noIosLine: string;
  };
```

- [ ] In `en.ts`, ADD matching keys:

```ts
  cardGallery: {
    heading: 'Try a card',
    sub: 'Six real cards from the app. Tap to flip and see the answer.',
    cta: '2,844 more cards in the App Store →',
  },
  metrics: {
    heading: 'By the numbers',
    cards: 'cards',
    topics: 'topic packs',
    languages: 'languages',
    offline: 'offline',
    cardsValue: '2,850',
    topicsValue: '10',
    languagesValue: '4',
    offlineValue: '100%',
    madeIn: 'Made in Ukraine 🇺🇦, for everyone.',
  },
  faq: {
    heading: 'Frequently asked questions',
  },
  finalCta: {
    heading: 'Try Mindorfact today',
    sub: 'iPhone, iPad. iOS 17 and later. Free to start.',
    noIosLine: 'No iOS? Leave your email and we will let you know when other platforms ship.',
  },
```

- [ ] In `uk.ts`, ADD matching keys (natural Ukrainian tone — no school abstractions, no bureaucratic verbs):

```ts
  cardGallery: {
    heading: 'Спробуй картку',
    sub: 'Шість справжніх карток із додатка. Натисни, щоб розкрити відповідь.',
    cta: 'Ще 2 844 картки в App Store →',
  },
  metrics: {
    heading: 'У цифрах',
    cards: 'карток',
    topics: 'пакетів тем',
    languages: 'мови',
    offline: 'офлайн',
    cardsValue: '2 850',
    topicsValue: '10',
    languagesValue: '4',
    offlineValue: '100%',
    madeIn: 'Зроблено в Україні 🇺🇦, для всього світу.',
  },
  faq: {
    heading: 'Часті запитання',
  },
  finalCta: {
    heading: 'Спробуй Mindorfact сьогодні',
    sub: 'iPhone, iPad. iOS 17 і новіші. Безкоштовно для старту.',
    noIosLine: 'Не на iOS? Залиш пошту — повідомимо, коли запустимо для інших платформ.',
  },
```

- [ ] Verify: `npm run build` — TypeScript validates all locales conform.
- [ ] Commit: `feat(i18n): add card-gallery, metrics, faq, finalCta copy (en, uk)`.

## Task 2: FAQ data — `src/data/faq.ts`

**Files:** create `src/data/faq.ts`.

- [ ] Content — 6 questions per locale:

```ts
import type { ActiveLocale } from '../i18n/locales';

export type FAQItem = {
  id: string;
  question: Record<ActiveLocale, string>;
  answer: Record<ActiveLocale, string>;
};

export const FAQ: FAQItem[] = [
  {
    id: 'age',
    question: {
      en: 'What age is Mindorfact for?',
      uk: 'Для якого віку Mindorfact?',
    },
    answer: {
      en: 'Designed for adults but family-friendly. Topics like science, nature, and space work well for older kids and teens. Strict G content rating.',
      uk: 'Зроблено для дорослих, але підходить і для родинної гри. Теми про науку, природу й космос добре йдуть зі старшими дітьми та підлітками. Сторого G-рейтинг.',
    },
  },
  {
    id: 'languages',
    question: {
      en: 'Which languages does the app support?',
      uk: 'Які мови підтримує додаток?',
    },
    answer: {
      en: 'Ukrainian, English, German, and French. All 2,850 cards are written and reviewed natively in each language — no machine translation.',
      uk: 'Українська, англійська, німецька, французька. Усі 2 850 карток написані й виправлені носіями кожної мови — без машинного перекладу.',
    },
  },
  {
    id: 'iap',
    question: {
      en: 'How does the free version differ from paid packs?',
      uk: 'Чим відрізняється безкоштовна версія від платних пакетів?',
    },
    answer: {
      en: 'You start with several hundred free cards across all play modes. Individual topic packs unlock extra cards inside that topic. No subscription. Buy only the packs that interest you.',
      uk: 'На старті — кілька сотень безкоштовних карток у всіх режимах. Окремі тематичні пакети розблоковують додаткові картки в темі. Без підписки. Купуй лише те, що цікаво.',
    },
  },
  {
    id: 'ipad',
    question: {
      en: 'Does it work on iPad?',
      uk: 'Чи працює на iPad?',
    },
    answer: {
      en: 'Yes. iPhone and iPad share the same app and progress.',
      uk: 'Так. iPhone і iPad ділять один додаток і прогрес.',
    },
  },
  {
    id: 'daily',
    question: {
      en: 'What is the Daily Challenge?',
      uk: 'Що таке щоденний виклик?',
    },
    answer: {
      en: 'One curated card per day, ad-free, with a streak counter. Misses reset the streak. Daily is the same card for everyone in your region.',
      uk: 'Одна підібрана картка на день, без реклами, із лічильником серії днів. Пропуск обнуляє серію. У межах регіону всі бачать однакову денну картку.',
    },
  },
  {
    id: 'submit_idea',
    question: {
      en: 'How can I suggest a topic?',
      uk: 'Як запропонувати тему?',
    },
    answer: {
      en: 'Email support@mindorfact.com with subject "Topic idea" and a short description.',
      uk: 'Напишіть на support@mindorfact.com із темою «Ідея топіка» та коротким описом.',
    },
  },
];
```

- [ ] Commit: `feat(data): add FAQ list (6 entries en+uk)`.

## Task 3: `CardGallery.astro` (S3)

**Files:** create `src/components/CardGallery.astro`.

- [ ] Reuses `SampleCard` from PR 2. Renders all 6 cards in a 3-col grid (1 col mobile, 2 col tablet, 3 col desktop). No tilt, slightly bigger width than hero floats.

```astro
---
import SampleCard from './SampleCard.astro';
import { SAMPLE_CARDS } from '../data/sample-cards';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
const APP_STORE_URL = 'https://apps.apple.com/app/id6765670691';
---
<section class="mt-24">
  <p class="text-xs uppercase tracking-widest text-brand-indigo">{t.cardGallery.heading}</p>
  <h2 class="mt-2 font-display text-h2 text-brand-ink sm:text-display-lg">{t.cardGallery.heading}</h2>
  <p class="mt-3 max-w-prose text-body text-brand-mute">{t.cardGallery.sub}</p>

  <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
    {SAMPLE_CARDS.map((card) => (
      <SampleCard card={card} lang={lang} width={18} />
    ))}
  </div>

  <p class="mt-10 text-center">
    <a href={APP_STORE_URL} target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-brand-indigo no-underline hover:text-brand-pink">
      {t.cardGallery.cta}
    </a>
  </p>
</section>
```

- [ ] Build verify. Commit: `feat(home): card gallery section (S3) with 6 real cards`.

## Task 4: `MetricsBlock.astro` (S4)

**Files:** create `src/components/MetricsBlock.astro`.

- [ ] Four big numbers in a 4-col grid. Each in a soft pill with semantic accent.

```astro
---
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);

const stats = [
  { value: t.metrics.cardsValue,     label: t.metrics.cards,     accent: 'bg-brand-pink/10 text-brand-pink' },
  { value: t.metrics.topicsValue,    label: t.metrics.topics,    accent: 'bg-brand-indigo/10 text-brand-indigo' },
  { value: t.metrics.languagesValue, label: t.metrics.languages, accent: 'bg-brand-pink/10 text-brand-pink' },
  { value: t.metrics.offlineValue,   label: t.metrics.offline,   accent: 'bg-brand-indigo/10 text-brand-indigo' },
];
---
<section class="mt-24">
  <p class="text-xs uppercase tracking-widest text-brand-indigo">{t.metrics.heading}</p>

  <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
    {stats.map((s) => (
      <div class={`rounded-card border border-brand-stroke/60 p-6 text-center ${s.accent.split(' ')[0]}`}>
        <p class={`font-display text-display-lg ${s.accent.split(' ')[1]}`}>{s.value}</p>
        <p class="mt-1 text-sm text-brand-mute">{s.label}</p>
      </div>
    ))}
  </div>

  <p class="mt-6 text-center text-sm text-brand-mute">{t.metrics.madeIn}</p>
</section>
```

- [ ] Commit: `feat(home): metrics block section (S4)`.

## Task 5: `FAQList.astro` (S5)

**Files:** create `src/components/FAQList.astro`.

- [ ] Uses native `<details>` for zero-JS accordion behavior. Pulls data from `src/data/faq.ts`.

```astro
---
import { FAQ } from '../data/faq';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---
<section class="mt-24">
  <h2 class="font-display text-h2 text-brand-ink sm:text-display-lg">{t.faq.heading}</h2>

  <ul class="mt-10 divide-y divide-brand-stroke/60 border-y border-brand-stroke/60">
    {FAQ.map((item) => (
      <li>
        <details class="group py-5">
          <summary class="flex cursor-pointer items-center justify-between gap-4 list-none text-body font-semibold text-brand-ink">
            <span>{item.question[lang]}</span>
            <span aria-hidden="true" class="text-brand-pink transition-transform group-open:rotate-45">+</span>
          </summary>
          <p class="mt-3 max-w-prose text-body text-brand-mute">{item.answer[lang]}</p>
        </details>
      </li>
    ))}
  </ul>
</section>

<style>
  details > summary::-webkit-details-marker { display: none; }
</style>
```

- [ ] Commit: `feat(home): FAQ section (S5) with native details accordion`.

## Task 6: `FinalCTA.astro` (S6)

**Files:** create `src/components/FinalCTA.astro`.

- [ ] Full-bleed gradient strip, big CTA + App Store, includes email signup variant for non-iOS visitors.

```astro
---
import AppStoreBadge from './AppStoreBadge.astro';
import EmailSignup from './EmailSignup.astro';
import { dict } from '../i18n/t';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;
const t = dict(lang);
---
<section class="mt-24 -mx-5 sm:-mx-8 rounded-none bg-gradient-to-br from-brand-pink to-brand-indigo px-5 py-16 text-white sm:px-12 sm:py-20">
  <div class="mx-auto max-w-page text-center">
    <h2 class="font-display text-display-lg text-white sm:text-display-xl">{t.finalCta.heading}</h2>
    <p class="mt-4 text-body opacity-90">{t.finalCta.sub}</p>
    <div class="mt-8 flex justify-center">
      <AppStoreBadge lang={lang} variant="badge" />
    </div>
  </div>

  <div class="mx-auto mt-12 max-w-page">
    <div class="rounded-card bg-white/10 p-6 backdrop-blur-sm sm:p-8">
      <p class="text-sm text-white/90">{t.finalCta.noIosLine}</p>
      <div class="mt-4">
        <EmailSignup lang={lang} />
      </div>
    </div>
  </div>
</section>
```

> Note: `EmailSignup` already has its own `<section>` wrapper with white card. Nested here it'll have a double card look — that's OK on the pink/indigo strip, makes the form pop. If visually too busy after preview, revisit in PR 4 polish.

- [ ] Commit: `feat(home): final CTA section (S6) with email signup variant`.

## Task 7: Wire into `[lang]/index.astro`

**Files:** modify `src/pages/[lang]/index.astro`.

- [ ] Replace the previous home composition. New body:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import HeroSplit from '../../components/HeroSplit.astro';
import BentoFeatures from '../../components/BentoFeatures.astro';
import CardGallery from '../../components/CardGallery.astro';
import MetricsBlock from '../../components/MetricsBlock.astro';
import FAQList from '../../components/FAQList.astro';
import FinalCTA from '../../components/FinalCTA.astro';
import { ACTIVE_LOCALES, type ActiveLocale } from '../../i18n/locales';

export function getStaticPaths() {
  return ACTIVE_LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: ActiveLocale };
---

<BaseLayout lang={lang} path="/">
  <HeroSplit lang={lang} />
  <BentoFeatures lang={lang} />
  <CardGallery lang={lang} />
  <MetricsBlock lang={lang} />
  <FAQList lang={lang} />
  <FinalCTA lang={lang} />
</BaseLayout>
```

(Note: the standalone `EmailSignup` is now inside FinalCTA — drop the trailing `<section><EmailSignup /></section>`.)

- [ ] Build + spot grep:

```bash
grep -c 'id="how-it-works"' .vercel/output/static/en/index.html  # → 1 (bento)
grep -c 'rounded-pill bg-brand-pink' .vercel/output/static/en/index.html  # → multiple (CTAs, pills)
grep -o 'details' .vercel/output/static/en/index.html | wc -l  # → 12+ (6 FAQ × 2 tags)
```

- [ ] Commit: `feat(home): compose full home page (hero, bento, gallery, metrics, faq, cta)`.

## Task 8: Playwright extend

**Files:** modify `tests/smoke.spec.ts`.

- [ ] Append:

```ts
test('Card gallery renders 6 sample cards', async ({ page }) => {
  await page.goto('/en');
  // Hero has 2 floating cards (sm+); gallery adds 6 = 8 total minimum at desktop.
  // We just assert the gallery section directly via a stable hook.
  const galleryCards = page.locator('section:has(> p:has-text("Try a card")) .sample-card');
  await expect(galleryCards).toHaveCount(6);
});

test('Metrics block renders 4 stats', async ({ page }) => {
  await page.goto('/en');
  const stats = page.locator('section:has(> p:has-text("By the numbers")) [class*="rounded-card"]');
  await expect(stats).toHaveCount(4);
});

test('FAQ has at least 6 questions', async ({ page }) => {
  await page.goto('/en');
  const items = page.locator('section:has(> h2:has-text("Frequently asked questions")) details');
  await expect(items).toHaveCount(6);
});

test('Final CTA strip has App Store badge', async ({ page }) => {
  await page.goto('/en');
  // Last section on the page, gradient background — the App Store badge should be inside it.
  const finalCta = page.locator('section').last();
  await expect(finalCta.locator('a[href*="apps.apple.com"]')).toBeVisible();
});

test('UK home renders Ukrainian FAQ question', async ({ page }) => {
  await page.goto('/uk');
  await expect(page.locator('details summary').first()).toContainText(/Mindorfact|вік|віку/i);
});
```

- [ ] Run `npm run test:e2e` — expect 20/20 (15 existing + 5 new).
- [ ] Fix root cause for any failure; don't weaken assertions.
- [ ] Commit: `test(smoke): assert gallery, metrics, faq, final CTA, UK FAQ`.

## Task 9: Final build + push + PR

- [ ] `rm -rf dist .astro/.cache .vercel/output && npm run build`. 8 routes still.
- [ ] `git push -u origin feat/pr3-cards-faq-cta`.
- [ ] `gh pr create --base main --title "PR 3 — Sample cards gallery + Metrics + FAQ + Final CTA"` with appropriate body referencing spec/plan. Surface PR URL.

## Self-Review

- §6 S3 covered (Task 3 — CardGallery with 6 real cards via PR 2's SampleCard).
- §6 S4 covered (Task 4 — MetricsBlock with 4 numbers).
- §6 S5 covered (Tasks 2 + 5 — FAQ data + FAQList with native details).
- §6 S6 covered (Task 6 — FinalCTA full-bleed gradient + email signup variant).
- i18n: all copy through dict(lang). Tasks 1.
- Tests: Tasks 8.
- Spec §13 open question on email endpoint stays a stub (no change vs PR 1) — that's a separate ops task.
- No press kit (`/press`) — explicitly scoped to PR 4.
