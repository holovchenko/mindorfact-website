import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const LOCALES = ['en', 'uk', 'de', 'fr'];

export default defineConfig({
  site: 'https://mindorfact.com',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
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
