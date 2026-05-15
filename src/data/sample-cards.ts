import type { ActiveLocale } from '../i18n/locales';

export type SampleCard = {
  id: string;
  topic: 'science' | 'nature' | 'space' | 'art';
  emoji: string;
  /** A = fact, B = opinion */
  correctAnswer: 'A' | 'B';
  statement: Record<ActiveLocale, string>;
  explanation: Record<ActiveLocale, string>;
};

export const SAMPLE_CARDS: SampleCard[] = [
  {
    id: 'fact-opinion_science_easy_001',
    topic: 'science',
    emoji: '🧪',
    correctAnswer: 'A',
    statement: {
      en: 'Gravity pulls objects toward the Earth.',
      uk: 'Гравітація притягує предмети до Землі.',
    },
    explanation: {
      en: "Fact: gravity acts on every object with mass and pulls it toward Earth's center. Throw a ball up — it always comes back down. Newton confirmed this as a physical law.",
      uk: 'Це факт: сила гравітації діє на всі тіла з масою і притягує їх до центру Землі. Кинь м'яч угору — він обов'язково впаде. Це фізичний закон, перевірений ще Ньютоном.',
    },
  },
  {
    id: 'fact-opinion_science_easy_003',
    topic: 'science',
    emoji: '🧪',
    correctAnswer: 'B',
    statement: {
      en: 'Sound is faster than light.',
      uk: 'Звук швидший за світло.',
    },
    explanation: {
      en: "Opinion: light is far faster than sound. That's why you see lightning before you hear thunder. Claiming the opposite is simply wrong.",
      uk: 'Це думка, що суперечить факту: насправді світло значно швидше за звук. Саме тому блискавку видно раніше, ніж чути грім. Стверджувати навпаки — помилка.',
    },
  },
  {
    id: 'fact-opinion_nature_easy_001',
    topic: 'nature',
    emoji: '🦒',
    correctAnswer: 'A',
    statement: {
      en: 'The giraffe is the tallest animal on Earth.',
      uk: 'Жираф — найвища тварина на Землі.',
    },
    explanation: {
      en: 'Fact: an adult giraffe stands 5–6 meters tall — taller than any other land animal. Zoologists have measured and confirmed this repeatedly.',
      uk: 'Це факт: дорослий жираф сягає 5–6 метрів у висоту — більше за будь-яку іншу наземну тварину. Це вимірюється і підтверджено зоологами.',
    },
  },
  {
    id: 'fact-opinion_nature_easy_002',
    topic: 'nature',
    emoji: '🦒',
    correctAnswer: 'B',
    statement: {
      en: 'Swans are the most graceful birds.',
      uk: 'Лебеді — найграційніші птахи.',
    },
    explanation: {
      en: 'Opinion: "most graceful" is a subjective call. Plenty of people are just as struck by cranes or herons. Beauty in motion is in the eye of the beholder.',
      uk: 'Це думка: «найграційніші» — суб\'єктивна оцінка краси руху. Хтось захоплюється журавлями чи чаплями не менше. Краса польоту сприймається індивідуально.',
    },
  },
  {
    id: 'fact-opinion_space_easy_001',
    topic: 'space',
    emoji: '🪐',
    correctAnswer: 'A',
    statement: {
      en: 'There are eight planets in the Solar System.',
      uk: 'У Сонячній системі вісім планет.',
    },
    explanation: {
      en: 'Fact: in 2006, the IAU officially defined eight planets — Mercury through Neptune. Pluto was reclassified as a dwarf planet. The number is documented and verifiable.',
      uk: 'Це факт: МАС у 2006 році офіційно визначив вісім планет — від Меркурія до Нептуна. Плутон перевели у клас карликових планет. Число задокументоване й перевіряється.',
    },
  },
  {
    id: 'fact-opinion_art_easy_002',
    topic: 'art',
    emoji: '🎨',
    correctAnswer: 'B',
    statement: {
      en: 'Van Gogh is the greatest painter of all time.',
      uk: 'Ван Гог — найкращий художник усіх часів.',
    },
    explanation: {
      en: 'Opinion: "greatest" is a judgment call. Different experts put Rembrandt, Michelangelo, or Picasso at the top. There\'s no objective way to measure the "best" painter.',
      uk: 'Це думка: «найкращий» — оцінне слово. Різні знавці мистецтва ставлять на перше місце Рембрандта, Мікеланджело або Пікассо. Об\'єктивно виміряти «найкращого» художника неможливо.',
    },
  },
];

export const HERO_FLOAT_CARDS = SAMPLE_CARDS.slice(0, 2);
