export type Dictionary = {
  meta: {
    siteName: string;
    tagline: string;
    description: string;
  };
  nav: {
    support: string;
    privacy: string;
    terms: string;
    press: string;
    download: string;
    downloadPrefix: string;
    toggleLanguage: string;
    toggleTheme: string;
  };
  home: {
    heroKicker: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroLede: string;
    heroSecondaryCta: string;
    heroMeta: string;
    heroDeviceNote: string;
  };
  footer: {
    rights: string;
    appleDisclaimer: string;
    languagesHeading: string;
    legalHeading: string;
    companyHeading: string;
  };
  emailSignup: {
    heading: string;
    placeholder: string;
    submit: string;
    privacyNote: string;
  };
  support: {
    title: string;
    intro: string;
    faqHeading: string;
    contactHeading: string;
    contactBody: string;
    responseTime: string;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
    lastUpdatedPrefix: string;
  };
  topics: {
    general: string;
    art: string;
    science: string;
    nature: string;
    space: string;
    moreFanFacts: string;
  };
  hero: {
    factLabel: string;
    opinionLabel: string;
    tapToFlip: string;
  };
  bento: {
    sectionKicker: string;
    soloDaily: { title: string; body: string; streakLabel: string };
    party: { title: string; body: string };
    topics: { title: string; body: string };
    icloud: { title: string; body: string };
    noAds: { title: string; body: string };
    freeWithPacks: { title: string; body: string };
  };
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
  press: {
    title: string;
    intro: string;
    contactPrefix: string;
    downloadsHeading: string;
    colorsHeading: string;
    descriptionHeading: string;
    quickFactsHeading: string;
    quickFacts: {
      device: string;
      content: string;
      offline: string;
      madeIn: string;
      appStoreLine: string;
    };
    appCopySections: {
      nameSubtitle: string;
      short: string;
      medium: string;
      long: string;
    };
    downloads: {
      logoLabel: string;
      logoSublabel: string;
      screenshotsLabel: string;
      screenshotsSublabel: string;
      downloadCta: string;
    };
  };
};
