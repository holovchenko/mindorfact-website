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
      de: 'Für welches Alter ist Mindorfact?',
      fr: 'Mindorfact, c'est pour quel âge ?',
    },
    answer: {
      en: 'Designed for adults but family-friendly. Topics like science, nature, and space work well for older kids and teens. Strict G content rating.',
      uk: 'Зроблено для дорослих, але підходить і для родинної гри. Теми про науку, природу й космос добре йдуть зі старшими дітьми та підлітками. Сторого G-рейтинг.',
      de: 'Für Erwachsene konzipiert, aber familien­freundlich. Themen wie Wissenschaft, Natur und Weltall funktionieren gut mit älteren Kindern und Jugendlichen. Strenge G-Bewertung.',
      fr: 'Conçu pour les adultes, mais convient en famille. Des thèmes comme la science, la nature et l'espace marchent bien avec les enfants plus grands et les ados. Classification G stricte.',
    },
  },
  {
    id: 'languages',
    question: {
      en: 'Which languages does the app support?',
      uk: 'Які мови підтримує додаток?',
      de: 'Welche Sprachen unterstützt die App?',
      fr: 'Quelles langues sont prises en charge ?',
    },
    answer: {
      en: 'Ukrainian, English, German, and French. All 2,850 cards are written and reviewed natively in each language — no machine translation.',
      uk: 'Українська, англійська, німецька, французька. Усі 2 850 карток написані й виправлені носіями кожної мови — без машинного перекладу.',
      de: 'Ukrainisch, Englisch, Deutsch und Französisch. Alle 2 850 Karten sind in jeder Sprache von Muttersprachlern geschrieben und geprüft — keine Maschinen­übersetzung.',
      fr: 'Ukrainien, anglais, allemand et français. Les 2 850 cartes sont écrites et relues par des locuteurs natifs dans chaque langue — pas de traduction automatique.',
    },
  },
  {
    id: 'iap',
    question: {
      en: 'How does the free version differ from paid packs?',
      uk: 'Чим відрізняється безкоштовна версія від платних пакетів?',
      de: 'Wie unterscheidet sich die Gratis-Version von den bezahlten Paketen?',
      fr: 'En quoi la version gratuite diffère-t-elle des packs payants ?',
    },
    answer: {
      en: 'You start with several hundred free cards across all play modes. Individual topic packs unlock extra cards inside that topic. No subscription. Buy only the packs that interest you.',
      uk: 'На старті — кілька сотень безкоштовних карток у всіх режимах. Окремі тематичні пакети розблоковують додаткові картки в темі. Без підписки. Купуй лише те, що цікаво.',
      de: 'Du startest mit mehreren Hundert Gratiskarten in allen Modi. Einzelne Themen­pakete schalten zusätzliche Karten innerhalb des Themas frei. Kein Abo. Kauf nur die Pakete, die dich interessieren.',
      fr: 'Tu commences avec plusieurs centaines de cartes gratuites dans tous les modes. Les packs de thèmes débloquent des cartes supplémentaires dans ce thème. Pas d'abonnement. Achète uniquement les packs qui t'intéressent.',
    },
  },
  {
    id: 'ipad',
    question: {
      en: 'Does it work on iPad?',
      uk: 'Чи працює на iPad?',
      de: 'Funktioniert die App auf dem iPad?',
      fr: 'L'app fonctionne-t-elle sur iPad ?',
    },
    answer: {
      en: 'Yes. iPhone and iPad share the same app and progress.',
      uk: 'Так. iPhone і iPad ділять один додаток і прогрес.',
      de: 'Ja. iPhone und iPad teilen sich dieselbe App und denselben Fortschritt.',
      fr: 'Oui. iPhone et iPad partagent la même app et la même progression.',
    },
  },
  {
    id: 'daily',
    question: {
      en: 'What is the Daily Challenge?',
      uk: 'Що таке щоденний виклик?',
      de: 'Was ist die Tägliche Heraus­forderung?',
      fr: 'Qu'est-ce que le Défi quotidien ?',
    },
    answer: {
      en: 'One curated card per day, ad-free, with a streak counter. Misses reset the streak. Daily is the same card for everyone in your region.',
      uk: 'Одна підібрана картка на день, без реклами, із лічильником серії днів. Пропуск обнуляє серію. У межах регіону всі бачать однакову денну картку.',
      de: 'Eine kuratierte Karte pro Tag, werbefrei, mit Serien-Zähler. Verpasste Tage setzen die Serie zurück. Innerhalb deiner Region sehen alle dieselbe Tageskarte.',
      fr: 'Une carte sélectionnée chaque jour, sans pub, avec un compteur de série. Un jour manqué remet la série à zéro. Dans ta région, tout le monde voit la même carte du jour.',
    },
  },
  {
    id: 'submit_idea',
    question: {
      en: 'How can I suggest a topic?',
      uk: 'Як запропонувати тему?',
      de: 'Wie kann ich ein Thema vorschlagen?',
      fr: 'Comment proposer un thème ?',
    },
    answer: {
      en: 'Email support@mindorfact.com with subject "Topic idea" and a short description.',
      uk: "Напишіть на support@mindorfact.com із темою «Ідея топіка» та коротким описом.",
      de: 'Schreib eine E-Mail an support@mindorfact.com mit dem Betreff „Themen­vorschlag" und einer kurzen Beschreibung.',
      fr: 'Envoie un e-mail à support@mindorfact.com avec le sujet « Idée de thème » et une courte description.',
    },
  },
];
