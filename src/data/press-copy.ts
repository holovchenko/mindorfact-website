import type { ActiveLocale } from '../i18n/locales';

export type PressCopy = {
  /** App name is brand-neutral and stays "Mindorfact" in all locales. */
  name: string;
  subtitle: Record<ActiveLocale, string>;
  short: Record<ActiveLocale, string>;
  medium: Record<ActiveLocale, string>;
  long: Record<ActiveLocale, string>;
};

export const PRESS_COPY: PressCopy = {
  name: 'Mindorfact',
  subtitle: {
    en: 'Critical thinking card game',
    uk: 'Тренажер критичного мислення',
  },
  short: {
    en: 'Four ways to play, ten topics, endless conversations — solo, with friends, or as a couple. Now in English, German and French. Tell us what you think.',
    uk: 'Чотири режими гри, десять тем, нескінченні розмови — соло, з друзями чи парою. Тепер і колоди за улюбленими серіалами. Спробуйте, поділіться враженнями.',
  },
  medium: {
    en: `Mindorfact is a card game about how we think.

We mix up facts and opinions all the time — in the news, at the dinner table, in our own heads when we try to work out why we agreed to something strange. Mindorfact sorts it out through play, one card at a time.`,
    uk: `Mindorfact — це картки про те, як ми думаємо.

Ми постійно змішуємо факти і думки. У новинах, у розмові за вечерею, у голові, коли намагаємося зрозуміти, чому погодилися на щось дивне. Mindorfact розкладає це по поличках через гру — по одній картці за раз.`,
  },
  long: {
    en: `Mindorfact is a card game about how we think.

We mix up facts and opinions all the time — in the news, at the dinner table, in our own heads when we try to work out why we agreed to something strange. Mindorfact sorts it out through play, one card at a time.

◆ Four ways to play

Solo Quiz — quick multiple-choice questions. Good for five spare minutes on the bus.

Swipe Sort — read a statement, swipe left (opinion) or right (fact). Trains your snap intuition.

Discussion — a card with a provocative question; you talk it through with a partner or a group. No right answers — just questions that are hard to walk past.

Party Mode — pass-and-play for 2–6 people on one device. Cards go around the circle, points go to teams. A fun evening, no internet needed.

◆ Ten topics

General, Space, Nature, Science and Art are open from the start. Five more decks follow hit sitcoms and a popular kids' cartoon. Each deck has its own character — somewhere surprising facts, somewhere the question "did that really happen on screen, or did fans make it up?".

◆ No rush, no burnout

Play one card a day — the daily challenge will remember you around dinner time. Or sit down and run thirty in a row if you're in the mood. Want it to stop reminding you — one switch in Settings.

◆ Accessibility

VoiceOver on every screen, Dynamic Type up to Largest, Reduce Motion respected, contrast to WCAG AA. Dark and light themes — pick by context, or follow the system.

◆ Privacy

Mindorfact collects no personal data — only your session history stays in your iCloud. We run no analytics. Ads are AdMob banners and interstitials only, removable forever with a single purchase. All purchases are one-time and support Family Sharing — pay once for the whole family. Decline the system tracking prompt and the app works exactly the same, with no limits.

◆ What's next

Tell us what grates or what topic you'd like — support@mindorfact.com. We listen.

---
Made in Ukraine.`,
    uk: `Mindorfact — це картки про те, як ми думаємо.

Ми постійно змішуємо факти і думки. У новинах, у розмові за вечерею, у голові, коли намагаємося зрозуміти, чому погодилися на щось дивне. Mindorfact розкладає це по поличках через гру — по одній картці за раз.

◆ Чотири режими

Solo Quiz — швидкі питання з варіантами. Зручно, коли є 5 хвилин у транспорті.

Swipe Sort — побачили твердження, тягнете вліво (думка) чи вправо (факт). Тренує миттєву інтуїцію.

Discussion — карточка з провокаційним питанням, ви з кимось у парі або групі обговорюєте. Без правильних відповідей — лише питання, які важко проминути.

Party Mode — пас-енд-плей для 2-6 людей на одному пристрої. Картки переходять по колу, бали йдуть командам. Веселий вечір без потреби в інтернеті.

◆ Десять тем

Загальна, Космос, Природа, Наука, Мистецтво — відкриті від початку. Ще п'ять колод за популярними сіткомами та дитячим мультсеріалом. Кожна колода зі своїм характером — десь дивовижні факти, десь питання «це справді було на екрані чи вигадка фанатів?».

◆ Без поспіху, без вигорання

Можна грати по одній картці на день — щоденне завдання згадає вас о вечері. Можна сісти і пройти 30 поспіль, якщо настрій. Хочете, щоб не нагадувало — вимикається в Settings одним перемикачем.

◆ Доступність

VoiceOver на всі екрани, Dynamic Type до Largest, Reduce Motion поважається, контрасти за WCAG AA. Темна і світла теми — обираєте за контекстом, або системна.

◆ Приватність

Mindorfact не збирає особистих даних — лише історія ваших сесій лишається у вашому iCloud. Аналітики не ведемо. Реклама — лише банери і вставки від AdMob, з можливістю прибрати назавжди (одна покупка). Усі покупки одноразові та підтримують Family Sharing — платите один раз для всієї родини. Якщо відмовите системному діалогу про трекінг — апка працює так само, без жодних обмежень.

◆ Що далі

Це перша версія. Якщо щось ріже око або хочеться іншу тему — пишіть на support@mindorfact.com. Прислухаємось.

---
Mindorfact створено в Україні. Українською. Тому що рідною думати приємніше.`,
  },
};
