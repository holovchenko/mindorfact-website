# Activate de + fr as full locales

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development`.

**Goal:** Move `de` and `fr` from `FUTURE_LOCALES` to `ACTIVE_LOCALES` and ship real translations for the entire site. After this PR, `/de/*` and `/fr/*` serve native German and French content; the locale switcher exposes all 4 languages active.

**Architecture:** TypeScript enforces `Record<ActiveLocale, …>` on every locale-keyed data structure (`SampleCard`, `FAQItem`, `PressCopy`). Moving de/fr into `ActiveLocale` therefore demands de + fr entries for every such record OR the build breaks. We translate proactively and commit per-file.

**Tech Stack:** Astro 4, Tailwind 3, content collections (legal markdown). No new deps.

**Translation quality bar:** Native-sounding, not literal. UK style — domestic-warm, no bureaucratic phrasing — translates to similarly warm de/fr. App name "Mindorfact" stays untranslated. Where iOS already has native copy (fastlane/metadata/{de-DE,fr-FR}/, content/locales/{de,fr}/), use that verbatim.

**Branch:** `feat/activate-de-fr` off `main`. Worktree: `.worktrees/de-fr`.

---

## File Structure

```
src/
├── i18n/
│   ├── locales.ts           (modify — promote de+fr to ACTIVE_LOCALES)
│   ├── de.ts                (rewrite — full Dictionary, no longer alias)
│   └── fr.ts                (rewrite — full Dictionary, no longer alias)
├── data/
│   ├── faq.ts               (extend — add de + fr keys per item)
│   ├── sample-cards.ts      (extend — add de + fr statement/explanation per card)
│   └── press-copy.ts        (extend — add de + fr subtitle/short/medium/long)
├── content/legal/
│   ├── de/
│   │   ├── privacy.md       (create)
│   │   └── terms.md         (create)
│   └── fr/
│       ├── privacy.md       (create)
│       └── terms.md         (create)
├── components/
│   └── LocaleSwitcher.astro (simplify — drop FUTURE_LOCALES, all 4 active)
└── pages/
    └── index.astro          (no change — Vercel redirect rules already include de/fr keys)
```

Plus:
- `astro.config.mjs` — already has all 4 locales in i18n config; no change.
- `vercel.json` — root `/ → /en` redirect stays. Middleware (`src/middleware.ts`) already maps de/fr from Accept-Language. No change.
- `BaseLayout.astro` — uses `ACTIVE_LOCALES.map(...)` for hreflang; will auto-include de+fr. No change.
- `HERO_SCREENSHOT` map already has de + fr keys. No change.
- Sitemap config in `astro.config.mjs` already lists de/fr. No change.

---

## Task 0: Worktree baseline

- [ ] `.worktrees/de-fr` on `feat/activate-de-fr`. `npm install`, `npm run build` — 10 routes baseline. Tests 25/25.

## Task 1: Promote de + fr to ACTIVE_LOCALES

**File:** `src/i18n/locales.ts`.

Replace EXACTLY (preserve existing `LOCALE_*` maps, only change the arrays):

```ts
export const ACTIVE_LOCALES = ['en', 'uk', 'de', 'fr'] as const;
export const FUTURE_LOCALES = [] as const;
export const ALL_LOCALES = [...ACTIVE_LOCALES, ...FUTURE_LOCALES] as const;
```

Build will break here — TypeScript will start enforcing 4-key records everywhere. That's expected; the next tasks fix it.

Commit:
```bash
git add src/i18n/locales.ts
git commit -m "feat(i18n): promote de + fr to ACTIVE_LOCALES (will break build until data files updated)"
```

## Task 2: Write `src/i18n/de.ts` full Dictionary

Replace entire file:

```ts
import type { Dictionary } from './types';

export const de: Dictionary = {
  meta: {
    siteName: 'Mindorfact',
    tagline: 'Kartenspiel: kritisch denken',
    description: 'Mindorfact — ein Kartenspiel über kritisches Denken. Im App Store erhältlich.',
  },
  nav: {
    support: 'Hilfe',
    privacy: 'Datenschutz',
    terms: 'Nutzungs­bedingungen',
    press: 'Presse',
    download: 'Im App Store laden',
    toggleLanguage: 'Sprache wechseln',
    toggleTheme: 'Dunkles Design umschalten',
  },
  home: {
    heroKicker: 'iOS-App',
    heroTitleLine1: 'Ein Kartenspiel',
    heroTitleLine2: 'für kritisches Denken',
    heroLede: 'Neun Themen, 2 850 Karten, vier Sprachen, vier Spielmodi. Allein oder mit Freunden. Komplett offline.',
    heroSecondaryCta: 'So funktioniert es',
    heroMeta: '9 Themen · 2 850 Karten · 4 Sprachen',
    heroDeviceNote: 'Funktioniert auf iPhone und iPad. iOS 17 oder neuer.',
  },
  footer: {
    rights: 'Alle Rechte vorbehalten.',
    appleDisclaimer: 'App Store ist eine Dienstleistungsmarke von Apple Inc.',
    languagesHeading: 'Sprachen',
    legalHeading: 'Rechtliches',
    companyHeading: 'Über',
  },
  emailSignup: {
    heading: 'Bleib auf dem Laufenden',
    placeholder: 'du@mail.de',
    submit: 'Abonnieren',
    privacyNote: 'Kein Spam. Jederzeit abbestellbar.',
  },
  support: {
    title: 'Hilfe',
    intro: 'Fragen, Ideen oder Probleme? Schreib uns an die E-Mail-Adresse unten.',
    faqHeading: 'Häufige Fragen',
    contactHeading: 'Kontakt',
    contactBody: 'Schreib uns an',
    responseTime: 'Wir antworten innerhalb von 1–2 Werktagen.',
  },
  legal: {
    privacyTitle: 'Datenschutz­erklärung',
    termsTitle: 'Nutzungs­bedingungen',
    lastUpdatedPrefix: 'Zuletzt aktualisiert:',
  },
  topics: {
    general: 'Allgemein',
    art: 'Kunst',
    science: 'Wissenschaft',
    nature: 'Natur',
    space: 'Weltall',
    moreFanFacts: '+5 Fan-Fact-Pakete innen',
  },
  hero: { factLabel: 'Fakt', opinionLabel: 'Meinung', tapToFlip: 'Tippen zum Umdrehen' },
  bento: {
    sectionKicker: 'Was du bekommst',
    soloDaily: {
      title: 'Solo + Tägliche Heraus­forderung',
      body: 'Jeden Tag eine frische Karte. Baue eine Serie auf. Im Daily — niemals Werbung.',
      streakLabel: 'Heute',
    },
    party: {
      title: 'Party-Modus',
      body: 'Reicht das Handy am Tisch herum. Freunde rufen ihre Antworten, die App zählt die Punkte.',
    },
    topics: {
      title: '10 Themen­pakete',
      body: 'Kunst, Wissenschaft, Natur, Weltall, Allgemein — plus weitere Fan-Fact-Pakete im Store.',
    },
    icloud: {
      title: 'iCloud-Sync',
      body: 'Keine Konten. Der Fortschritt zieht mit deiner Apple-ID mit.',
    },
    noAds: {
      title: 'Keine Werbung im Daily',
      body: 'Die tägliche Heraus­forderung ist immer werbefrei, auch in der Gratis-Version.',
    },
    freeWithPacks: {
      title: 'Kostenlos spielen. Mehr freischalten.',
      body: 'Beginne mit Hunderten von Gratiskarten. Kaufe einzelne Pakete nur, wenn du mehr willst.',
    },
  },
  cardGallery: {
    heading: 'Probier eine Karte',
    sub: 'Sechs echte Karten aus der App. Tippen, um die Antwort zu sehen.',
    cta: '2 844 weitere Karten im App Store →',
  },
  metrics: {
    heading: 'In Zahlen',
    cards: 'Karten',
    topics: 'Themen­pakete',
    languages: 'Sprachen',
    offline: 'offline',
    cardsValue: '2 850',
    topicsValue: '10',
    languagesValue: '4',
    offlineValue: '100 %',
    madeIn: 'Hergestellt in der Ukraine 🇺🇦, für alle.',
  },
  faq: { heading: 'Häufige Fragen' },
  finalCta: {
    heading: 'Probier Mindorfact heute',
    sub: 'iPhone, iPad. iOS 17 oder neuer. Kostenloser Einstieg.',
    noIosLine: 'Kein iOS? Hinterlass deine E-Mail — wir melden uns, sobald andere Plattformen starten.',
  },
  press: {
    title: 'Pressemappe',
    intro: 'Logos, Screenshots, Textvarianten und Markenfarben für Mindorfact. Frei zur Verwendung in Artikeln und Rezensionen.',
    contactPrefix: 'Presse­kontakt:',
    downloadsHeading: 'Downloads',
    colorsHeading: 'Markenfarben',
    descriptionHeading: 'App-Beschreibung',
    quickFactsHeading: 'Kurzinfo',
    quickFacts: {
      device: 'Solo-iOS-App für iPhone und iPad (iOS 17+).',
      content: '2 850 Karten, 10 Themen­pakete, 4 Sprachen.',
      offline: 'Komplett offline. Keine Konten. iCloud-Sync zwischen den eigenen Geräten.',
      madeIn: 'Hergestellt in der Ukraine 🇺🇦, von Kyrylo Holovchenko.',
      appStoreLine: 'App-Store-Eintrag:',
    },
    appCopySections: {
      nameSubtitle: 'Name & Untertitel',
      short: 'Kurz (~150 Zeichen)',
      medium: 'Mittel',
      long: 'Lang',
    },
    downloads: {
      logoLabel: 'Logo (PNG)',
      logoSublabel: 'Quadratisches Markenzeichen 1024×1024',
      screenshotsLabel: 'Screenshots (ZIP)',
      screenshotsSublabel: 'iPhone 17 Pro Max in 4 Sprachen (uk, en, de, fr)',
      downloadCta: 'Herunterladen →',
    },
  },
};
```

Commit:
```bash
git add src/i18n/de.ts
git commit -m "feat(i18n): real German dictionary"
```

## Task 3: Write `src/i18n/fr.ts` full Dictionary

Replace entire file:

```ts
import type { Dictionary } from './types';

export const fr: Dictionary = {
  meta: {
    siteName: 'Mindorfact',
    tagline: 'Défi de culture & réflexion',
    description: 'Mindorfact — un jeu de cartes pour aiguiser l’esprit critique. Disponible sur l’App Store.',
  },
  nav: {
    support: 'Aide',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    press: 'Presse',
    download: 'Télécharger sur l’App Store',
    toggleLanguage: 'Changer de langue',
    toggleTheme: 'Basculer le mode sombre',
  },
  home: {
    heroKicker: 'Application iOS',
    heroTitleLine1: 'Un jeu de cartes',
    heroTitleLine2: 'pour l’esprit critique',
    heroLede: 'Neuf thèmes, 2 850 cartes, quatre langues, quatre modes de jeu. En solo ou entre amis. Entièrement hors ligne.',
    heroSecondaryCta: 'Comment ça marche',
    heroMeta: '9 thèmes · 2 850 cartes · 4 langues',
    heroDeviceNote: 'Fonctionne sur iPhone et iPad. iOS 17 et versions ultérieures.',
  },
  footer: {
    rights: 'Tous droits réservés.',
    appleDisclaimer: 'App Store est une marque de service d’Apple Inc.',
    languagesHeading: 'Langues',
    legalHeading: 'Mentions légales',
    companyHeading: 'À propos',
  },
  emailSignup: {
    heading: 'Reste au courant',
    placeholder: 'toi@email.fr',
    submit: 'S’abonner',
    privacyNote: 'Pas de spam. Désabonnement à tout moment.',
  },
  support: {
    title: 'Aide',
    intro: 'Une question, une idée, un problème ? Écris-nous à l’adresse ci-dessous.',
    faqHeading: 'Questions fréquentes',
    contactHeading: 'Nous contacter',
    contactBody: 'Écris-nous à',
    responseTime: 'Nous répondons sous 1 à 2 jours ouvrés.',
  },
  legal: {
    privacyTitle: 'Politique de confidentialité',
    termsTitle: 'Conditions d’utilisation',
    lastUpdatedPrefix: 'Dernière mise à jour :',
  },
  topics: {
    general: 'Général',
    art: 'Art',
    science: 'Science',
    nature: 'Nature',
    space: 'Espace',
    moreFanFacts: '+5 packs de fan-facts à l’intérieur',
  },
  hero: { factLabel: 'Fait', opinionLabel: 'Opinion', tapToFlip: 'Touche pour retourner' },
  bento: {
    sectionKicker: 'Ce que tu obtiens',
    soloDaily: {
      title: 'Solo + Défi quotidien',
      body: 'Une nouvelle carte chaque jour. Construis ta série. Le Quotidien — jamais de publicité.',
      streakLabel: 'Aujourd’hui',
    },
    party: {
      title: 'Mode soirée',
      body: 'On se passe le téléphone autour de la table. Les amis crient leur réponse, l’app compte les points.',
    },
    topics: {
      title: '10 packs de thèmes',
      body: 'Art, science, nature, espace, général — plus des packs de fan-facts à débloquer dans la boutique.',
    },
    icloud: {
      title: 'Synchronisation iCloud',
      body: 'Pas de compte. Ta progression suit ton identifiant Apple.',
    },
    noAds: {
      title: 'Aucune pub dans le Quotidien',
      body: 'Le défi quotidien est toujours sans pub, même en version gratuite.',
    },
    freeWithPacks: {
      title: 'Gratuit. Débloque davantage.',
      body: 'Commence avec des centaines de cartes gratuites. Achète des packs uniquement si tu en veux plus.',
    },
  },
  cardGallery: {
    heading: 'Essaie une carte',
    sub: 'Six vraies cartes de l’app. Touche pour retourner et voir la réponse.',
    cta: '2 844 cartes de plus sur l’App Store →',
  },
  metrics: {
    heading: 'En chiffres',
    cards: 'cartes',
    topics: 'packs de thèmes',
    languages: 'langues',
    offline: 'hors ligne',
    cardsValue: '2 850',
    topicsValue: '10',
    languagesValue: '4',
    offlineValue: '100 %',
    madeIn: 'Fabriqué en Ukraine 🇺🇦, pour tout le monde.',
  },
  faq: { heading: 'Questions fréquentes' },
  finalCta: {
    heading: 'Essaie Mindorfact aujourd’hui',
    sub: 'iPhone, iPad. iOS 17 et versions ultérieures. Gratuit pour commencer.',
    noIosLine: 'Pas d’iOS ? Laisse ton e-mail — on te préviendra quand d’autres plateformes seront prêtes.',
  },
  press: {
    title: 'Kit presse',
    intro: 'Logos, captures d’écran, variantes de texte et couleurs de marque pour Mindorfact. Libres d’usage dans articles et critiques.',
    contactPrefix: 'Contact presse :',
    downloadsHeading: 'Téléchargements',
    colorsHeading: 'Couleurs de marque',
    descriptionHeading: 'Description de l’app',
    quickFactsHeading: 'En bref',
    quickFacts: {
      device: 'App iOS solo, disponible sur iPhone et iPad (iOS 17+).',
      content: '2 850 cartes, 10 packs de thèmes, 4 langues.',
      offline: 'Entièrement hors ligne. Pas de compte. Synchronisation iCloud entre tes propres appareils.',
      madeIn: 'Fabriqué en Ukraine 🇺🇦, par Kyrylo Holovchenko.',
      appStoreLine: 'Page App Store :',
    },
    appCopySections: {
      nameSubtitle: 'Nom et sous-titre',
      short: 'Court (~150 caractères)',
      medium: 'Moyen',
      long: 'Long',
    },
    downloads: {
      logoLabel: 'Logo (PNG)',
      logoSublabel: 'Marque carrée 1024×1024',
      screenshotsLabel: 'Captures d’écran (ZIP)',
      screenshotsSublabel: 'iPhone 17 Pro Max en 4 langues (uk, en, de, fr)',
      downloadCta: 'Télécharger →',
    },
  },
};
```

Commit: `feat(i18n): real French dictionary`.

## Task 4: Extend `src/data/sample-cards.ts` with de + fr

Read `/Users/kyrylo/Documents/Projects/mindorfact/content/locales/{de,fr}/{science,nature,space,art}/fact_vs_opinion_easy.json` and look up each existing card id. For every card in `SAMPLE_CARDS`, add `de` and `fr` entries under `statement` and `explanation` using verbatim content from the JSON files.

The 6 ids are (already present in en+uk):
1. `fact-opinion_science_easy_001`
2. `fact-opinion_science_easy_003`
3. `fact-opinion_nature_easy_001`
4. `fact-opinion_nature_easy_002`
5. `fact-opinion_space_easy_001`
6. `fact-opinion_art_easy_002`

If any id is missing from de or fr files, REPORT BLOCKED with the offending id. Do not paraphrase.

Commit: `feat(data): extend sample cards with de + fr statements (verbatim from iOS bundle)`.

## Task 5: Extend `src/data/faq.ts` with de + fr

Add `de` and `fr` keys to each `question` and `answer` for all 6 FAQ items. Use these translations (paste verbatim — provided by the controller):

### FAQ #1 — age

```ts
de: {
  question: 'Für welches Alter ist Mindorfact?',
  answer: 'Für Erwachsene konzipiert, aber familien­freundlich. Themen wie Wissenschaft, Natur und Weltall funktionieren gut mit älteren Kindern und Jugendlichen. Strenge G-Bewertung.',
},
fr: {
  question: 'Mindorfact, c’est pour quel âge ?',
  answer: 'Conçu pour les adultes, mais convient en famille. Des thèmes comme la science, la nature et l’espace marchent bien avec les enfants plus grands et les ados. Classification G stricte.',
},
```

### FAQ #2 — languages

```ts
de: {
  question: 'Welche Sprachen unterstützt die App?',
  answer: 'Ukrainisch, Englisch, Deutsch und Französisch. Alle 2 850 Karten sind in jeder Sprache von Muttersprachlern geschrieben und geprüft — keine Maschinen­übersetzung.',
},
fr: {
  question: 'Quelles langues sont prises en charge ?',
  answer: 'Ukrainien, anglais, allemand et français. Les 2 850 cartes sont écrites et relues par des locuteurs natifs dans chaque langue — pas de traduction automatique.',
},
```

### FAQ #3 — iap

```ts
de: {
  question: 'Wie unterscheidet sich die Gratis-Version von den bezahlten Paketen?',
  answer: 'Du startest mit mehreren Hundert Gratiskarten in allen Modi. Einzelne Themen­pakete schalten zusätzliche Karten innerhalb des Themas frei. Kein Abo. Kauf nur die Pakete, die dich interessieren.',
},
fr: {
  question: 'En quoi la version gratuite diffère-t-elle des packs payants ?',
  answer: 'Tu commences avec plusieurs centaines de cartes gratuites dans tous les modes. Les packs de thèmes débloquent des cartes supplémentaires dans ce thème. Pas d’abonnement. Achète uniquement les packs qui t’intéressent.',
},
```

### FAQ #4 — ipad

```ts
de: {
  question: 'Funktioniert die App auf dem iPad?',
  answer: 'Ja. iPhone und iPad teilen sich dieselbe App und denselben Fortschritt.',
},
fr: {
  question: 'L’app fonctionne-t-elle sur iPad ?',
  answer: 'Oui. iPhone et iPad partagent la même app et la même progression.',
},
```

### FAQ #5 — daily

```ts
de: {
  question: 'Was ist die Tägliche Heraus­forderung?',
  answer: 'Eine kuratierte Karte pro Tag, werbefrei, mit Serien-Zähler. Verpasste Tage setzen die Serie zurück. Innerhalb deiner Region sehen alle dieselbe Tageskarte.',
},
fr: {
  question: 'Qu’est-ce que le Défi quotidien ?',
  answer: 'Une carte sélectionnée chaque jour, sans pub, avec un compteur de série. Un jour manqué remet la série à zéro. Dans ta région, tout le monde voit la même carte du jour.',
},
```

### FAQ #6 — submit_idea

```ts
de: {
  question: 'Wie kann ich ein Thema vorschlagen?',
  answer: 'Schreib eine E-Mail an support@mindorfact.com mit dem Betreff „Themen­vorschlag" und einer kurzen Beschreibung.',
},
fr: {
  question: 'Comment proposer un thème ?',
  answer: 'Envoie un e-mail à support@mindorfact.com avec le sujet « Idée de thème » et une courte description.',
},
```

Commit: `feat(data): extend FAQ with de + fr Q/A`.

## Task 6: Extend `src/data/press-copy.ts` with de + fr

Read `/Users/kyrylo/Documents/Projects/mindorfact/fastlane/metadata/{de-DE,fr-FR}/{subtitle,promotional_text,description}.txt`. Use the verbatim content for:
- `subtitle.de` and `subtitle.fr`
- `short.de` and `short.fr` (= promotional_text)
- `medium.de` and `medium.fr` (= first 2 paragraphs of description.txt)
- `long.de` and `long.fr` (= full description.txt)

If any file is missing, REPORT BLOCKED.

Commit: `feat(data): extend press copy with de + fr (verbatim from iOS fastlane)`.

## Task 7: Add legal markdown for de + fr

Create 4 new files. Content (translate from `src/content/legal/en/{privacy,terms}.md`). Frontmatter mirror existing structure (`title`, `lastUpdated`, `description`, `locale`).

### `src/content/legal/de/privacy.md`

```markdown
---
title: Datenschutzerklärung
lastUpdated: "2025-04-30"
description: Datenschutzerklärung für die Mindorfact-App.
locale: de
---

# Datenschutzerklärung

**Zuletzt aktualisiert: 2025-04-30**

Mindorfact („wir", „unser", „die App") wird von Kyrylo Holovchenko betrieben. Die App funktioniert offline-first und sammelt keine personen­bezogenen Daten auf unseren Servern. Diese Erklärung beschreibt, mit welchen wenigen Daten die App umgeht.

## Was wir nicht sammeln

- Wir betreiben keine eigenen Server.
- Wir speichern weder Name, Adresse, Fotos, Kontakte noch Standort.
- Wir geben keine Daten zu Werbezwecken an Dritte weiter.

## Was auf deinem Gerät bleibt

- Spielfortschritt (gespielte Decks, Serien, Errungen­schaften).
- Design- und Farb­schema-Einstellungen.
- Optionale In-App-Käufe (von Apple abgewickelt, siehe unten).

## iCloud-Sync

Wenn du in iCloud angemeldet bist und **Mindorfact** in den iCloud-Einstellungen aktiviert hast, synchronisiert die App den Spielfortschritt über den iCloud Key-Value Store zwischen deinen Apple-Geräten. Wir haben keinen Zugriff auf diese Daten — sie wandern zwischen deinen Geräten über Apple.

## In-App-Käufe

Käufe werden von Apple über den App Store abgewickelt. Es gelten Apples Richtlinien. Wir erhalten aggregierte, anonymisierte Verkaufs­berichte von Apple — niemals persönliche Zahlungs­daten.

## Analyse und Werbung

Mindorfact zeigt Google-AdMob-Banner und Interstitials außerhalb der Täglichen Heraus­forderung. AdMob kann Geräte-Identifikatoren verarbeiten, wie in Googles Datenschutz­erklärung beschrieben. Mindorfact gibt keine personen­identifizierbaren Daten an AdMob weiter.

Für Analyse nutzen wir auf dieser Website ggf. Vercel Web Analytics (keine Cookies, keine personen­bezogenen Daten).

## Kontakt

Fragen: support@mindorfact.com
```

### `src/content/legal/de/terms.md`

```markdown
---
title: Nutzungsbedingungen
lastUpdated: "2025-04-30"
description: Nutzungsbedingungen der Mindorfact-App.
locale: de
---

# Nutzungs­bedingungen

**Zuletzt aktualisiert: 2025-04-30**

Mit der Installation oder Nutzung von Mindorfact akzeptierst du diese Bedingungen.

## Lizenz

Mindorfact wird lizenziert, nicht verkauft. Du erhältst eine persönliche, nicht-exklusive, nicht übertragbare Lizenz zur Nutzung der App auf Geräten, die dir gehören oder die du kontrollierst.

## In-App-Käufe

In-App-Käufe sind nicht erstattungs­fähig, außer in gesetzlich vorgeschriebenen Fällen und gemäß Apples Standard-Rückerstattungs­richtlinie. Käufe schalten bestimmte Themen­pakete in der App frei.

## Akzeptable Nutzung

Reverse-Engineering, Weiter­verbreitung oder Nutzung der App zur Schädigung anderer sind nicht gestattet.

## Haftungs­ausschluss

Die App wird „wie besehen" ohne jegliche Gewähr­leistung bereitgestellt. Wir haften nicht für Schäden, die aus der Nutzung entstehen.

## Änderungen

Wir können diese Bedingungen aktualisieren. Die fortgesetzte Nutzung nach Änderungen gilt als Annahme der aktualisierten Bedingungen.

## Kontakt

Fragen: support@mindorfact.com
```

### `src/content/legal/fr/privacy.md`

```markdown
---
title: Politique de confidentialité
lastUpdated: "2025-04-30"
description: Politique de confidentialité de l'application Mindorfact.
locale: fr
---

# Politique de confidentialité

**Dernière mise à jour : 2025-04-30**

Mindorfact (« nous », « notre », « l’app ») est exploité par Kyrylo Holovchenko. L’app fonctionne en mode hors ligne et ne collecte aucune donnée personnelle sur nos serveurs. Cette politique explique les rares données que l’app manipule.

## Ce que nous ne collectons pas

- Nous n’hébergeons pas nos propres serveurs.
- Nous ne stockons ni nom, ni adresse, ni photos, ni contacts, ni localisation.
- Nous ne partageons aucune donnée avec des tiers à des fins publicitaires.

## Ce qui reste sur ton appareil

- Progression du jeu (paquets joués, séries, succès).
- Préférences de thème et de mode sombre.
- Achats intégrés optionnels (gérés par Apple, voir ci-dessous).

## Synchronisation iCloud

Si tu es connecté à iCloud et que **Mindorfact** est activé dans les réglages iCloud, l’app synchronise la progression du jeu entre tes appareils Apple via le Key-Value Store iCloud. Nous n’avons pas accès à ces données — elles circulent entre tes appareils via Apple.

## Achats intégrés

Les achats sont traités par Apple via l’App Store. Les politiques d’Apple s’appliquent. Nous recevons des rapports de ventes agrégés et anonymisés d’Apple — jamais de données de paiement personnelles.

## Analyse et publicité

Mindorfact affiche des bannières et interstitiels Google AdMob en dehors du Défi quotidien. AdMob peut collecter des identifiants d’appareil, comme décrit dans la politique de confidentialité de Google. Mindorfact ne transmet aucune information personnellement identifiable à AdMob.

Pour l’analyse, nous pouvons utiliser Vercel Web Analytics sur ce site (pas de cookies, pas de données personnelles).

## Contact

Questions : support@mindorfact.com
```

### `src/content/legal/fr/terms.md`

```markdown
---
title: Conditions d'utilisation
lastUpdated: "2025-04-30"
description: Conditions d'utilisation de l'application Mindorfact.
locale: fr
---

# Conditions d’utilisation

**Dernière mise à jour : 2025-04-30**

En installant ou en utilisant Mindorfact, tu acceptes ces conditions.

## Licence

Mindorfact est concédé sous licence, pas vendu. Tu reçois une licence personnelle, non exclusive, non transférable pour utiliser l’app sur des appareils que tu possèdes ou contrôles.

## Achats intégrés

Les achats intégrés ne sont pas remboursables, sauf si la loi l’exige ou conformément à la politique standard de remboursement d’Apple. Les achats débloquent des packs de thèmes spécifiques dans l’app.

## Usage acceptable

Pas d’ingénierie inverse, pas de redistribution, pas d’usage de l’app pour nuire à autrui.

## Avertissement

L’app est fournie « en l’état », sans garantie d’aucune sorte. Nous ne sommes pas responsables des dommages liés à son utilisation.

## Modifications

Nous pouvons mettre à jour ces conditions. L’utilisation continue après modification vaut acceptation des conditions mises à jour.

## Contact

Questions : support@mindorfact.com
```

Commit: `feat(content): add de + fr legal markdown (privacy + terms)`.

## Task 8: Simplify `LocaleSwitcher.astro`

Since `FUTURE_LOCALES = []` now, the disabled-pill block produces no output. Simplify by removing the second `.map()` entirely.

Final content:

```astro
---
import { ACTIVE_LOCALES, LOCALE_LABELS, type ActiveLocale, type Locale } from '../i18n/locales';
import { dict } from '../i18n/t';

export interface Props {
  current: ActiveLocale;
  path: string;
}

const { current, path } = Astro.props;
const t = dict(current);
const cleanPath = path === '/' ? '' : path;
---

<nav aria-label={t.nav.toggleLanguage} class="flex items-center gap-1 rounded-pill border border-brand-stroke bg-brand-surface/60 px-1 py-1">
  {ACTIVE_LOCALES.map((loc: Locale) => (
    <a
      href={`/${loc}${cleanPath}`}
      aria-current={loc === current ? 'page' : undefined}
      class={`rounded-pill px-3 py-1 text-xs font-semibold no-underline transition-colors ${loc === current ? 'bg-brand-pink text-white' : 'text-brand-mute hover:text-brand-ink'}`}
    >
      {LOCALE_LABELS[loc]}
    </a>
  ))}
</nav>
```

(Drop the import of `FUTURE_LOCALES`; the loop over it; the disabled `<span>`s.)

Commit: `refactor(locale-switcher): drop FUTURE_LOCALES handling now that all 4 are active`.

## Task 9: Update Playwright smoke for de + fr

In `tests/smoke.spec.ts` find the existing loop `for (const locale of LOCALES) { ... }` and update the `LOCALES` array:

```ts
const LOCALES = ['en', 'uk', 'de', 'fr'] as const;
```

This expands the hreflang/canonical test matrix from 8 to 16 cases. The test references `locale === 'uk' ? 'uk-UA' : 'en'` for the `html lang` attribute — that branch needs to handle all four locales correctly:

Replace:
```ts
await expect(pwPage.locator('html')).toHaveAttribute('lang', locale === 'uk' ? 'uk-UA' : 'en');
```
with:
```ts
const HTML_LANG: Record<string, string> = { en: 'en', uk: 'uk-UA', de: 'de', fr: 'fr' };
await expect(pwPage.locator('html')).toHaveAttribute('lang', HTML_LANG[locale]);
```

Also: the `hreflang` count assertion `expect(hreflangs).toBeGreaterThanOrEqual(LOCALES.length + 1)` now expects ≥ 5 — keep the formulation, it scales.

Add two additional smoke tests for de + fr home pages:

```ts
test('DE home renders German hero copy', async ({ page }) => {
  await page.goto('/de');
  await expect(page.locator('h1')).toContainText('Kartenspiel');
});

test('FR home renders French hero copy', async ({ page }) => {
  await page.goto('/fr');
  await expect(page.locator('h1')).toContainText('jeu de cartes');
});
```

Run `npm run test:e2e`. Expect roughly 35-40 tests (the locale × page matrix expands; new home tests add 2; some scoped-by-locale press tests may need updates — handle root-cause without weakening).

If a test fails because of a string mismatch (e.g., a `:has-text` selector that was looking for English), update the selector to scope by section role/id rather than text, OR add locale-conditional matching. Don't loosen assertions.

Commit: `test(smoke): cover de + fr locale routes and home rendering`.

## Task 10: Final verify + push + PR

```bash
rm -rf dist .astro/.cache .vercel/output
npm run build
# Expect: 20 routes (5 page types × 4 locales)

npm run test:e2e
# Expect: all green
```

```bash
git push -u origin feat/activate-de-fr
gh pr create --base main --title "feat: activate de + fr as full locales" --body "$(cat <<'EOF'
## Summary

Moves \`de\` and \`fr\` from \`FUTURE_LOCALES\` to \`ACTIVE_LOCALES\` and ships real translations site-wide:

- **UI dictionaries** (\`src/i18n/{de,fr}.ts\`) — rewritten from \`= en\` aliases to full native Dictionary objects, ~100 strings each. Subtitle and short marketing copy sourced verbatim from iOS \`fastlane/metadata/{de-DE,fr-FR}/\`.
- **Sample cards** (\`src/data/sample-cards.ts\`) — every card now has de + fr statement and explanation copied verbatim from \`content/locales/{de,fr}/\`.
- **FAQ** (\`src/data/faq.ts\`) — 6 questions/answers translated to de + fr.
- **Press copy** (\`src/data/press-copy.ts\`) — subtitle / short / medium / long extended with de + fr from fastlane metadata.
- **Legal markdown** — new \`content/legal/de/{privacy,terms}.md\` and \`content/legal/fr/{privacy,terms}.md\`.
- **Locale switcher** — drops the FUTURE_LOCALES branch; all 4 pills are clickable.
- **Playwright** — locale matrix expanded; +2 home-page tests.

Routes: \`/de\`, \`/de/support\`, \`/de/privacy\`, \`/de/terms\`, \`/de/press\` (and mirror set for \`/fr\`). Build emits 20 routes total.

## Test plan

- [x] \`npm run build\` — 20 routes
- [x] \`npm run test:e2e\` — all green
- [ ] Manual: visit /de and /fr, verify hero, bento, gallery, FAQ, CTA all read natively
- [ ] Manual: locale switcher cycles through all 4 with active state
- [ ] Manual: \`/de/press\` and \`/fr/press\` show localized headings and download labels
- [ ] Lighthouse mobile /de and /fr — Performance ≥ 90, a11y/seo/best-practices ≥ 95

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Capture PR URL.

## Self-Review

- All `Record<ActiveLocale, …>` shapes now have 4 keys (en/uk/de/fr).
- Subtitle, short marketing, sample card content sourced verbatim from iOS — no paraphrasing.
- UI dictionaries provided directly by the controller in this plan — Sonnet does not re-translate.
- Legal markdown translated by controller.
- LocaleSwitcher cleaned up.
- Tests cover de + fr.

## Notes

- Hero screenshot map (`HERO_SCREENSHOT` in HeroSplit) already includes de + fr keys — no change needed.
- `vercel.json` root redirect is `/ → /en`; users hitting `/` whose Accept-Language is de/fr will land on /en. Astro middleware would route them properly in dev/SSR but doesn't fire in static build. Acceptable for v1; future improvement.
