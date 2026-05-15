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
    icon(),
  ],
});
