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
