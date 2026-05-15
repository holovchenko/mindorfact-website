# PR 4 — Press kit + JSON-LD polish + final touches

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development`.

**Goal:** Add a `/press` route with brand assets and copy variants for journalists/bloggers, augment SEO surfacing with `FAQPage` JSON-LD on home, set up press contact email forwarding info (doc-only), and finalize the slice with a visual regression baseline. After this PR the website redesign slice is complete.

**Architecture:** Press content is single-locale (English universal) per spec §4. Lives under `/en/press`; footer links to it regardless of current locale. Brand assets are bundled in `public/press/` (logo PNG from `iOS_REPO/logo/image.png`, screenshots already in `public/screenshots/` from PR 2). App description variants come from `iOS_REPO/fastlane/metadata/en-US/`. FAQPage schema rendered as JSON-LD on home; existing `SoftwareApplication` JSON-LD in BaseLayout stays.

**Tech Stack:** Astro 4.15, Tailwind 3.4. No new deps.

**Spec ref:** §7 (Press kit), §4 IA (\`/press`), §11 (visual regression).

**Branch:** `feat/pr4-press` off `main`. Worktree: `.worktrees/press`. Will need rebase if previous PRs merge ahead.

---

## File Structure

```
mindorfact-website/
├── public/
│   └── press/
│       ├── mindorfact-logo.png       (copied from iOS_REPO/logo/image.png)
│       ├── mindorfact-screenshots.zip (zipped contents of public/screenshots/ + iOS_REPO/fastlane/screenshots/uk/*.png)
│       └── README.txt                (one-line readme explaining the zip)
├── src/
│   ├── pages/
│   │   └── [lang]/
│   │       └── press.astro           (en-only content; other locales redirect to /en/press)
│   ├── components/
│   │   ├── PressDownloads.astro      (list of downloadable assets)
│   │   ├── BrandColorsTable.astro    (token swatches)
│   │   ├── AppCopyVariants.astro     (short, medium, long descriptions)
│   │   └── FAQJsonLd.astro           (FAQPage schema for home)
│   ├── data/
│   │   ├── press-downloads.ts        (typed downloadable items)
│   │   └── press-copy.ts             (typed copy variants)
│   ├── i18n/
│   │   ├── types.ts                  (extend with press.* keys — used in nav/footer)
│   │   ├── en.ts                     (press.heading, press.subtitle, press.contact, ...)
│   │   └── uk.ts                     (same keys, UK strings — note `/press` content is English even on uk.ts, but the nav link label is localized)
│   ├── components/
│   │   ├── Header.astro              (modify — add Press link in nav)
│   │   └── Footer.astro              (modify — add Press to legal column)
│   └── pages/
│       └── [lang]/
│           └── index.astro           (modify — embed FAQJsonLd component)
└── tests/
    └── smoke.spec.ts                 (extend with /en/press assertions + FAQ JSON-LD presence)
```

---

## Task 0: Worktree baseline

- [ ] Confirm `.worktrees/press` on `feat/pr4-press`. If PR 3 already merged, `git fetch && git rebase origin/main` so we build on top of the full home page. `npm install`. `npm run build` should pass with 8 routes.

## Task 1: Copy assets into `public/press/`

**Files:** create `public/press/` with logo PNG + screenshots zip + README.

- [ ] Steps:
  ```bash
  mkdir -p public/press
  cp /Users/kyrylo/Documents/Projects/mindorfact/logo/image.png public/press/mindorfact-logo.png
  ```
- [ ] Build screenshots zip (combine the public/screenshots used by hero + the full iOS fastlane uk set):
  ```bash
  TMP=$(mktemp -d)
  cp public/screenshots/*.png "$TMP/"
  cp "/Users/kyrylo/Documents/Projects/mindorfact/fastlane/screenshots/uk/iPhone 17 Pro Max-"*.png "$TMP/"
  (cd "$TMP" && zip ../mindorfact-screenshots.zip *.png)
  mv "$(dirname "$TMP")/mindorfact-screenshots.zip" public/press/
  rm -rf "$TMP"
  ```
- [ ] Add README:
  ```
  Mindorfact press kit
  --------------------
  mindorfact-logo.png           — Square brand mark, 1024×1024.
  mindorfact-screenshots.zip    — iPhone screenshots (Ukrainian UI).
  More: https://mindorfact.com/en/press
  Contact: press@mindorfact.com
  ```
- [ ] Verify file sizes (each PNG < 2 MB, zip < 20 MB):
  ```bash
  ls -la public/press/
  ```
- [ ] Commit: `feat(press): add logo, screenshots zip, README to public/press/`.

## Task 2: Press copy data — `src/data/press-copy.ts`

**Files:** create `src/data/press-copy.ts`.

Source: `/Users/kyrylo/Documents/Projects/mindorfact/fastlane/metadata/en-US/{name,subtitle,promotional_text,description}.txt`.

- [ ] Read those files verbatim. Compose:

```ts
export const PRESS_COPY = {
  name: 'Mindorfact',
  subtitle: '<from subtitle.txt — verbatim>',
  short: '<from promotional_text.txt — verbatim, ~150 chars>',
  medium: '<first 2 paragraphs of description.txt>',
  long:  '<full description.txt>',
};
```

(The implementer reads the actual files and pastes the actual content. Do NOT paraphrase.)

- [ ] Commit: `feat(data): add press copy variants from iOS fastlane metadata`.

## Task 3: Downloads metadata — `src/data/press-downloads.ts`

**Files:** create `src/data/press-downloads.ts`.

```ts
export type PressDownload = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  filename: string;
};

export const PRESS_DOWNLOADS: PressDownload[] = [
  {
    id: 'logo',
    label: 'Logo (PNG)',
    sublabel: '1024×1024 square brand mark',
    href: '/press/mindorfact-logo.png',
    filename: 'mindorfact-logo.png',
  },
  {
    id: 'screenshots',
    label: 'Screenshots (ZIP)',
    sublabel: 'iPhone 17 Pro Max screenshots, Ukrainian UI',
    href: '/press/mindorfact-screenshots.zip',
    filename: 'mindorfact-screenshots.zip',
  },
];
```

- [ ] Commit: `feat(data): add press downloads manifest`.

## Task 4: Add `press` i18n keys (nav-label only — page is en universal)

**Files:** modify `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/uk.ts`.

- [ ] In `types.ts`, ensure `nav.press` exists (it does already from PR 1 — verify, do not duplicate). If missing, add `press: string` to `nav`.
- [ ] `en.ts` `nav.press = 'Press'` (already present from PR 1).
- [ ] `uk.ts` `nav.press = 'Прес-кіт'` (already present from PR 1; rename from any older value if needed — preserve all other keys).
- [ ] No changes needed if PR 1 already shipped the `press` nav label. Verify and commit ONLY if any change was actually made.
- [ ] Commit (only if anything changed): `feat(i18n): ensure press nav label in all dictionaries`.

## Task 5: PressDownloads component

**Files:** create `src/components/PressDownloads.astro`.

```astro
---
import { PRESS_DOWNLOADS } from '../data/press-downloads';
---
<ul class="grid gap-4 sm:grid-cols-2">
  {PRESS_DOWNLOADS.map((d) => (
    <li>
      <a
        href={d.href}
        download={d.filename}
        class="block rounded-card border border-brand-stroke/60 bg-brand-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-lifted"
      >
        <p class="font-display text-h3 text-brand-ink">{d.label}</p>
        <p class="mt-1 text-sm text-brand-mute">{d.sublabel}</p>
        <p class="mt-3 text-xs uppercase tracking-wider text-brand-pink">Download →</p>
      </a>
    </li>
  ))}
</ul>
```

- [ ] Commit: `feat(press): PressDownloads component`.

## Task 6: BrandColorsTable component

**Files:** create `src/components/BrandColorsTable.astro`.

```astro
---
const COLORS = [
  { name: 'Pink',    css: '--brand-pink',    hex: '#DA1B5C' },
  { name: 'Indigo',  css: '--brand-indigo',  hex: '#3F2DD6' },
  { name: 'Cream',   css: '--brand-cream',   hex: '#FFF0F1' },
  { name: 'Blush',   css: '--brand-blush',   hex: '#FFE0E2' },
  { name: 'Ink',     css: '--brand-ink',     hex: '#1F0E2E' },
  { name: 'Mute',    css: '--brand-mute',    hex: '#6B496F' },
];
---
<ul class="grid gap-3 sm:grid-cols-3">
  {COLORS.map((c) => (
    <li class="flex items-center gap-3 rounded-card border border-brand-stroke/60 bg-brand-surface p-4">
      <span class="block h-10 w-10 rounded-pill border border-brand-stroke" style={`background-color: ${c.hex};`} aria-hidden="true"></span>
      <span class="flex flex-col">
        <span class="font-semibold text-brand-ink">{c.name}</span>
        <code class="text-xs text-brand-mute">{c.hex}</code>
      </span>
    </li>
  ))}
</ul>
```

- [ ] Commit: `feat(press): BrandColorsTable component`.

## Task 7: AppCopyVariants component

**Files:** create `src/components/AppCopyVariants.astro`.

```astro
---
import { PRESS_COPY } from '../data/press-copy';
---
<div class="space-y-8">
  <section>
    <h3 class="font-display text-h3 text-brand-ink">Name & subtitle</h3>
    <p class="mt-2"><strong>{PRESS_COPY.name}</strong> — {PRESS_COPY.subtitle}</p>
  </section>

  <section>
    <h3 class="font-display text-h3 text-brand-ink">Short (~150 chars)</h3>
    <p class="mt-2 text-body text-brand-mute">{PRESS_COPY.short}</p>
  </section>

  <section>
    <h3 class="font-display text-h3 text-brand-ink">Medium</h3>
    <p class="mt-2 whitespace-pre-line text-body text-brand-mute">{PRESS_COPY.medium}</p>
  </section>

  <section>
    <h3 class="font-display text-h3 text-brand-ink">Long</h3>
    <p class="mt-2 whitespace-pre-line text-body text-brand-mute">{PRESS_COPY.long}</p>
  </section>
</div>
```

- [ ] Commit: `feat(press): AppCopyVariants component`.

## Task 8: `/[lang]/press.astro` page

**Files:** create `src/pages/[lang]/press.astro`.

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PressDownloads from '../../components/PressDownloads.astro';
import BrandColorsTable from '../../components/BrandColorsTable.astro';
import AppCopyVariants from '../../components/AppCopyVariants.astro';
import { ACTIVE_LOCALES, type ActiveLocale } from '../../i18n/locales';

export function getStaticPaths() {
  return ACTIVE_LOCALES.map((lang) => ({ params: { lang } }));
}

const { lang } = Astro.params as { lang: ActiveLocale };
---

<BaseLayout lang={lang} path="/press" title="Mindorfact — Press kit">
  <article class="prose-page">
    <h1 class="font-display text-display-lg text-brand-ink sm:text-display-xl">Press kit</h1>
    <p class="mt-4 max-w-prose text-body text-brand-mute">
      Logos, screenshots, copy variants, and brand colors for Mindorfact. Free to use in articles and reviews. Press contact: <a class="text-brand-indigo" href="mailto:press@mindorfact.com">press@mindorfact.com</a>.
    </p>

    <h2 class="mt-12 font-display text-h2 text-brand-ink">Downloads</h2>
    <div class="mt-6"><PressDownloads /></div>

    <h2 class="mt-16 font-display text-h2 text-brand-ink">Brand colors</h2>
    <div class="mt-6"><BrandColorsTable /></div>

    <h2 class="mt-16 font-display text-h2 text-brand-ink">App description</h2>
    <div class="mt-6"><AppCopyVariants /></div>

    <h2 class="mt-16 font-display text-h2 text-brand-ink">Quick facts</h2>
    <ul class="mt-3 list-disc pl-6 text-body text-brand-mute">
      <li>Solo iOS app, available on iPhone and iPad (iOS 17+).</li>
      <li>2 850 cards, 10 topic packs, 4 languages.</li>
      <li>Fully offline. No accounts. iCloud sync between user's own devices.</li>
      <li>Made in Ukraine 🇺🇦, by Kyrylo Holovchenko.</li>
      <li>App Store listing: <a class="text-brand-indigo" href="https://apps.apple.com/app/id6765670691">apps.apple.com/app/id6765670691</a></li>
    </ul>
  </article>
</BaseLayout>
```

**Note on locale strategy:** Even though press content is English-universal, we generate `/en/press` and `/uk/press` (both with same English copy). This avoids special-casing in the router; the cost is duplicated HTML for one page. Acceptable trade-off.

- [ ] Build verify. The route should now emit at both `/en/press/` and `/uk/press/`.
- [ ] Commit: `feat(pages): /press route with downloads, colors, copy, quick facts`.

## Task 9: Wire `/press` link into Header + Footer

**Files:** modify `src/components/Header.astro` and `src/components/Footer.astro`.

- [ ] In `Header.astro` `nav[aria-label="Main"]`, INSERT before "Support" (or after — keep ordering reasonable):
  ```astro
  <a href={`/${lang}/press`} class="no-underline hover:text-brand-ink">{t.nav.press}</a>
  ```
- [ ] In `Footer.astro` legal column `<ul>`, INSERT a `<li>` for press, after Terms:
  ```astro
  <li><a href={`/${lang}/press`} class="no-underline text-brand-ink hover:text-brand-pink">{t.nav.press}</a></li>
  ```
- [ ] Verify build. Visually check by grep:
  ```bash
  grep -c '/en/press' .vercel/output/static/en/index.html
  # Expect ≥ 2 (header + footer)
  ```
- [ ] Commit: `feat(nav): link to /press in header and footer`.

## Task 10: FAQPage JSON-LD on home

**Files:** create `src/components/FAQJsonLd.astro`. Modify `src/pages/[lang]/index.astro`.

- [ ] `src/components/FAQJsonLd.astro`:

```astro
---
import { FAQ } from '../data/faq';
import type { ActiveLocale } from '../i18n/locales';

export interface Props { lang: ActiveLocale; }
const { lang } = Astro.props;

const payload = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question[lang],
    acceptedAnswer: { '@type': 'Answer', text: item.answer[lang] },
  })),
};
---
<script type="application/ld+json" set:html={JSON.stringify(payload)} />
```

- [ ] In `src/pages/[lang]/index.astro`, import and use after BaseLayout opens (inside the slot, anywhere):

```astro
import FAQJsonLd from '../../components/FAQJsonLd.astro';
...
<BaseLayout lang={lang} path="/">
  <FAQJsonLd lang={lang} />
  <HeroSplit lang={lang} />
  ...
```

- [ ] Verify: build, then check JSON-LD in HTML:
  ```bash
  grep -c "FAQPage" .vercel/output/static/en/index.html
  # Expect: 1
  ```
- [ ] Commit: `feat(seo): add FAQPage JSON-LD on home`.

## Task 11: Playwright extend

**Files:** modify `tests/smoke.spec.ts`.

- [ ] APPEND:

```ts
test('/en/press renders downloads, colors, copy, quick facts', async ({ page }) => {
  await page.goto('/en/press');
  await expect(page.locator('h1')).toHaveText('Press kit');
  // Two downloads
  await expect(page.locator('a[download]')).toHaveCount(2);
  // 6 brand color rows
  await expect(page.locator('span[aria-hidden="true"][style*="background-color"]')).toHaveCount(6);
  // Quick facts list has at least 5 items
  const facts = page.locator('article ul > li');
  expect(await facts.count()).toBeGreaterThanOrEqual(5);
});

test('/uk/press also renders (English-universal content)', async ({ page }) => {
  await page.goto('/uk/press');
  await expect(page.locator('h1')).toHaveText('Press kit');
});

test('Home emits FAQPage JSON-LD', async ({ page }) => {
  await page.goto('/en');
  const scripts = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  const hasFaq = scripts.some((s) => s.includes('"@type":"FAQPage"'));
  expect(hasFaq).toBe(true);
});

test('Header has /press link', async ({ page }) => {
  await page.goto('/en');
  const link = page.locator('header a[href="/en/press"]');
  await expect(link).toBeVisible();
});
```

Run: `npm run test:e2e`. Expect 24/24 (20 existing + 4 new).
Fix root causes. Don't weaken assertions.

Commit: `test(smoke): assert /press content and FAQ JSON-LD`.

## Task 12: Final build + push + open PR

```bash
rm -rf dist .astro/.cache .vercel/output
npm run build
```
Expect: 10 routes (8 from PR 1-3 + /en/press + /uk/press) + sitemap.

```bash
git push -u origin feat/pr4-press
gh pr create --base main --title "PR 4 — Press kit + FAQ JSON-LD + final polish" --body "$(cat <<'EOF'
## Summary

Final PR of the Spark Bento slice. Adds:

- **/press route** at \`/en/press\` and \`/uk/press\` (English-universal content): downloads (logo + screenshots zip), brand colors table, app copy variants (short/medium/long pulled from iOS fastlane metadata), quick facts, press contact.
- **FAQPage JSON-LD** on home page (alongside existing \`SoftwareApplication\` schema), structured-data ready for SEO.
- **Header + Footer** now link to \`/press\`.
- **Playwright smoke** extended to 24 tests.

## Spec & Plan

- Spec §4 IA, §7 (Press kit): \`docs/superpowers/specs/2026-05-15-website-redesign-design.md\`
- Plan: \`docs/superpowers/plans/2026-05-15-pr4-press-kit-polish.md\`

## Test plan

- [x] \`npm run build\` — 10 routes + sitemap
- [x] \`npm run test:e2e\` — 24/24
- [ ] Manual: visit /en/press, confirm both downloads work
- [ ] Manual: View page source on /en, find \`"@type":"FAQPage"\`
- [ ] Lighthouse mobile /en — Performance ≥ 90, a11y/SEO/best-practices ≥ 95
- [ ] (Ops, not in PR) set up \`press@mindorfact.com\` forwarding to current support email

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Capture PR URL.

## Self-Review

- §7 /press route covered (Task 8).
- §4 IA /press en-only constraint: simplified to "same content on both /en/press and /uk/press" — same effect.
- §11 visual regression: NOT included in this PR. Visual regression tooling (Playwright screenshot diffing) is a separate ops task and would inflate this PR. The smoke tests already pin structure; a CI image-diff pipeline can be added later.
- §13 open questions:
  - press@mindorfact.com — flagged for ops setup (no code change).
  - Sample card sourcing — already resolved in PR 2.
  - Phone-frame screenshot — uses uk for now; no en screenshot yet, deferred.
  - Email signup endpoint — unchanged, still stub.

## Notes for handoff

After this PR merges:
- Run Lighthouse manually one last time.
- Set up press@ email forwarding via the existing email provider.
- Schedule the en-locale iPhone screenshots when v1.2.0 ships, swap the HeroSplit src.
