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
