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

test('EN home shows English hero screenshot', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText(/card game/i);
  await expect(page.locator('img[src="/screenshots/solo-quiz-en.png"]')).toBeVisible();
});

test('UK home shows Ukrainian hero screenshot', async ({ page }) => {
  await page.goto('/uk');
  await expect(page.locator('img[src="/screenshots/solo-quiz-uk.png"]')).toBeVisible();
});

test('Hero shows at least 2 floating sample cards at desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en');
  const cards = page.locator('.sample-card');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(2);
});

test('Bento section renders 6 tiles', async ({ page }) => {
  await page.goto('/en');
  const tiles = page.locator('section#how-it-works article');
  await expect(tiles).toHaveCount(6);
});

test('UK home renders Ukrainian hero copy', async ({ page }) => {
  await page.goto('/uk');
  await expect(page.locator('h1')).toContainText('Карткова гра');
});

test('Card gallery renders 6 sample cards', async ({ page }) => {
  await page.goto('/en');
  const galleryCards = page.locator('section:has(> p:has-text("Try a card")) .sample-card');
  await expect(galleryCards).toHaveCount(6);
});

test('Metrics block renders 4 stat tiles', async ({ page }) => {
  await page.goto('/en');
  const stats = page.locator('section:has(> p:has-text("By the numbers")) > div > div');
  await expect(stats).toHaveCount(4);
});

test('FAQ has 6 question items via native details', async ({ page }) => {
  await page.goto('/en');
  const items = page.locator('section:has(> h2:has-text("Frequently asked questions")) details');
  await expect(items).toHaveCount(6);
});

test('Final CTA strip contains App Store badge', async ({ page }) => {
  await page.goto('/en');
  await page.setViewportSize({ width: 1280, height: 800 });
  // FinalCTA is the gradient section (from-brand-pink to-brand-indigo); badge link may be
  // visually hidden on mobile so we test at desktop width where it renders inline.
  const finalCta = page.locator('section.bg-gradient-to-br');
  await expect(finalCta.locator('a[href*="apps.apple.com"]')).toBeVisible();
});

test('UK home renders Ukrainian FAQ question', async ({ page }) => {
  await page.goto('/uk');
  const summaries = page.locator('section:has(> h2:has-text("Часті запитання")) details summary span').first();
  await expect(summaries).toContainText(/Mindorfact|вік|віку/i);
});

test('/en/press renders English Press kit', async ({ page }) => {
  await page.goto('/en/press');
  await expect(page.locator('h1')).toHaveText('Press kit');
  await expect(page.locator('a[download]')).toHaveCount(2);
  await expect(page.locator('span[aria-hidden="true"][style*="background-color"]')).toHaveCount(6);
  const facts = page.locator('section:has(> h2:has-text("Quick facts")) ul > li');
  expect(await facts.count()).toBeGreaterThanOrEqual(5);
});

test('/uk/press renders Ukrainian Прес-кіт with localized content', async ({ page }) => {
  await page.goto('/uk/press');
  await expect(page.locator('h1')).toHaveText('Прес-кіт');
  // Ukrainian download labels
  await expect(page.locator('a[download]').first()).toContainText(/Логотип|Скріншоти/);
  // Ukrainian quick facts heading
  await expect(page.locator('h2', { hasText: 'Коротко' })).toBeVisible();
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
