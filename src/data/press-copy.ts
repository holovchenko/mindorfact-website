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
    de: 'Kartenspiel: kritisch denken',
    fr: 'Défi de culture & réflexion',
  },
  short: {
    en: 'Four ways to play, ten topics, endless conversations — solo, with friends, or as a couple. Now in English, German and French. Tell us what you think.',
    uk: 'Чотири режими гри, десять тем, нескінченні розмови — соло, з друзями чи парою. Тепер і колоди за улюбленими серіалами. Спробуйте, поділіться враженнями.',
    de: 'Vier Spielmodi, zehn Themen, endlose Gespräche — solo, mit Freunden oder zu zweit. Jetzt auf Deutsch, Englisch und Französisch. Sag uns deine Meinung.',
    fr: 'Quatre modes, dix thèmes, des conversations sans fin — en solo, entre amis ou à deux. Maintenant en français, anglais et allemand. Dis-nous ce que tu en penses.',
  },
  medium: {
    en: `Mindorfact is a card game about how we think.

We mix up facts and opinions all the time — in the news, at the dinner table, in our own heads when we try to work out why we agreed to something strange. Mindorfact sorts it out through play, one card at a time.`,
    uk: `Mindorfact — це картки про те, як ми думаємо.

Ми постійно змішуємо факти і думки. У новинах, у розмові за вечерею, у голові, коли намагаємося зрозуміти, чому погодилися на щось дивне. Mindorfact розкладає це по поличках через гру — по одній картці за раз.`,
    de: `Mindorfact ist ein Kartenspiel darüber, wie wir denken.

Wir verwechseln ständig Fakten und Meinungen — in den Nachrichten, beim Abendessen, im eigenen Kopf, wenn wir verstehen wollen, warum wir etwas Seltsamem zugestimmt haben. Mindorfact sortiert das im Spiel, eine Karte nach der anderen.`,
    fr: `Mindorfact est un jeu de cartes sur notre façon de penser.

On confond sans cesse les faits et les opinions — dans les actus, à table, dans sa tête quand on cherche pourquoi on a accepté quelque chose d'étrange. Mindorfact remet de l'ordre par le jeu, une carte à la fois.`,
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
    de: `Mindorfact ist ein Kartenspiel darüber, wie wir denken.

Wir verwechseln ständig Fakten und Meinungen — in den Nachrichten, beim Abendessen, im eigenen Kopf, wenn wir verstehen wollen, warum wir etwas Seltsamem zugestimmt haben. Mindorfact sortiert das im Spiel, eine Karte nach der anderen.

◆ Vier Spielmodi

Solo Quiz — schnelle Fragen mit Antwortauswahl. Gut für fünf freie Minuten im Bus.

Swipe Sort — eine Aussage lesen, nach links wischen (Meinung) oder nach rechts (Fakt). Trainiert die schnelle Intuition.

Discussion — eine Karte mit einer provokanten Frage; du besprichst sie zu zweit oder in der Gruppe. Keine richtigen Antworten — nur Fragen, an denen man schwer vorbeikommt.

Party Mode — Pass-and-Play für 2–6 Leute auf einem Gerät. Karten gehen im Kreis, Punkte gehen an die Teams. Ein schöner Abend, ganz ohne Internet.

◆ Zehn Themen

Allgemein, Weltraum, Natur, Wissenschaft und Kunst sind von Anfang an offen. Fünf weitere Decks folgen bekannten Sitcoms und einer beliebten Kinder-Zeichentrickserie. Jedes Deck hat seinen eigenen Charakter — mal erstaunliche Fakten, mal die Frage „war das wirklich so im Original, oder haben Fans es dazugedichtet?".

◆ Ohne Hetze, ohne Ausbrennen

Du kannst eine Karte pro Tag spielen — die Tagesaufgabe erinnert dich am Abend. Oder du setzt dich hin und machst dreißig am Stück, wenn dir danach ist. Soll es nicht erinnern — ein Schalter in den Einstellungen.

◆ Barrierefreiheit

VoiceOver auf jedem Bildschirm, Dynamic Type bis Largest, Reduce Motion wird respektiert, Kontraste nach WCAG AA. Dunkles und helles Design — nach Kontext wählen, oder dem System folgen.

◆ Datenschutz

Mindorfact sammelt keine persönlichen Daten — nur deine Sitzungshistorie bleibt in deiner iCloud. Wir betreiben keine Analyse. Werbung sind nur AdMob-Banner und -Interstitials, mit einem einzigen Kauf für immer entfernbar. Alle Käufe sind einmalig und unterstützen Family Sharing — einmal zahlen für die ganze Familie. Lehnst du den System-Tracking-Dialog ab, funktioniert die App genauso, ohne Einschränkungen.

◆ Was kommt

Sag uns, was stört oder welches Thema du dir wünschst — support@mindorfact.com. Wir hören zu.

---
Hergestellt in der Ukraine.`,
    fr: `Mindorfact est un jeu de cartes sur notre façon de penser.

On confond sans cesse les faits et les opinions — dans les actus, à table, dans sa tête quand on cherche pourquoi on a accepté quelque chose d'étrange. Mindorfact remet de l'ordre par le jeu, une carte à la fois.

◆ Quatre modes de jeu

Solo Quiz — des questions rapides à choix multiples. Parfait pour cinq minutes dans le bus.

Swipe Sort — tu lis une affirmation, tu glisses à gauche (opinion) ou à droite (fait). Entraîne ton intuition immédiate.

Discussion — une carte avec une question provocante ; tu en discutes à deux ou en groupe. Pas de bonnes réponses — juste des questions difficiles à esquiver.

Party Mode — pass-and-play pour 2 à 6 personnes sur un seul appareil. Les cartes tournent, les points vont aux équipes. Une bonne soirée, sans internet.

◆ Dix thèmes

Général, Espace, Nature, Science et Art sont ouverts dès le départ. Cinq autres jeux suivent des sitcoms populaires et un dessin animé pour enfants. Chaque jeu a son caractère — ici des faits surprenants, là la question « est-ce vraiment arrivé à l'écran, ou est-ce une invention des fans ? ».

◆ Sans précipitation, sans lassitude

Tu peux jouer une carte par jour — le défi quotidien te rappellera vers le dîner. Ou t'asseoir et en enchaîner trente, si l'envie est là. Tu ne veux pas de rappel — un interrupteur dans les Réglages.

◆ Accessibilité

VoiceOver sur chaque écran, Dynamic Type jusqu'à Largest, Reduce Motion respecté, contrastes selon WCAG AA. Thèmes clair et sombre — au choix selon le contexte, ou selon le système.

◆ Confidentialité

Mindorfact ne collecte aucune donnée personnelle — seul l'historique de tes sessions reste dans ton iCloud. Aucune analyse. La publicité se limite aux bannières et interstitiels AdMob, supprimables pour toujours avec un seul achat. Tous les achats sont uniques et compatibles avec le Partage familial — tu paies une fois pour toute la famille. Si tu refuses la demande de suivi du système, l'app fonctionne exactement pareil, sans aucune limite.

◆ La suite

Dis-nous ce qui coince ou quel thème tu aimerais — support@mindorfact.com. On écoute.

---
Conçu en Ukraine.`,
  },
};
