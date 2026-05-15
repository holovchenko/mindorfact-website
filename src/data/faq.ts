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
      uk: "Напишіть на support@mindorfact.com із темою «Ідея топіка» та коротким описом.",
    },
  },
];
