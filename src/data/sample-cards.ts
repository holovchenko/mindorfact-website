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
      de: 'Gravitation zieht alle Gegenstände zur Erde hin.',
      fr: 'La gravité attire les objets vers la Terre.',
    },
    explanation: {
      en: "Fact: gravity acts on every object with mass and pulls it toward Earth's center. Throw a ball up — it always comes back down. Newton confirmed this as a physical law.",
      uk: "Це факт: сила гравітації діє на всі тіла з масою і притягує їх до центру Землі. Кинь м'яч угору — він обов'язково впаде. Це фізичний закон, перевірений ще Ньютоном.",
      de: 'Fakt: Die Schwerkraft wirkt auf alle Körper mit Masse und zieht sie zum Erdmittelpunkt. Wirf einen Ball hoch — er fällt immer zurück. Das ist ein physikalisches Gesetz, das Newton schon nachgewiesen hat.',
      fr: 'Fait : la force de gravité agit sur tous les corps ayant une masse et les attire vers le centre de la Terre. Lance une balle en l\'air — elle retombera forcément. C\'est une loi physique, vérifiée par Newton.',
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
      de: 'Schall ist schneller als Licht.',
      fr: 'Le son est plus rapide que la lumière.',
    },
    explanation: {
      en: "Opinion: light is far faster than sound. That's why you see lightning before you hear thunder. Claiming the opposite is simply wrong.",
      uk: 'Це думка, що суперечить факту: насправді світло значно швидше за звук. Саме тому блискавку видно раніше, ніж чути грім. Стверджувати навпаки — помилка.',
      de: 'Meinung: Das widerspricht dem Fakt. Licht ist viel schneller als Schall — deshalb siehst du den Blitz, bevor du den Donner hörst. Das Gegenteil zu behaupten ist schlicht falsch.',
      fr: 'Opinion : en réalité, la lumière est bien plus rapide que le son. C\'est pour ça qu\'on voit l\'éclair avant d\'entendre le tonnerre. Prétendre l\'inverse est une erreur scientifique.',
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
      de: 'Die Giraffe ist das größte Landtier der Erde.',
      fr: 'La girafe est le plus grand animal sur Terre.',
    },
    explanation: {
      en: 'Fact: an adult giraffe stands 5–6 meters tall — taller than any other land animal. Zoologists have measured and confirmed this repeatedly.',
      uk: 'Це факт: дорослий жираф сягає 5–6 метрів у висоту — більше за будь-яку іншу наземну тварину. Це вимірюється і підтверджено зоологами.',
      de: 'Fakt: Ein erwachsenes Tier erreicht 5–6 Meter Höhe — mehr als jedes andere Landtier. Zoologen haben das gemessen und bestätigt.',
      fr: 'Fait : une girafe adulte mesure entre 5 et 6 mètres — c\'est plus que n\'importe quel autre animal terrestre. Les zoologues l\'ont mesuré et confirmé.',
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
      de: 'Schwäne sind die anmutigsten Vögel überhaupt.',
      fr: 'Les cygnes sont les oiseaux les plus gracieux.',
    },
    explanation: {
      en: 'Opinion: "most graceful" is a subjective call. Plenty of people are just as struck by cranes or herons. Beauty in motion is in the eye of the beholder.',
      uk: 'Це думка: «найграційніші» — суб\'єктивна оцінка краси руху. Хтось захоплюється журавлями чи чаплями не менше. Краса польоту сприймається індивідуально.',
      de: 'Meinung: „Anmutigste" ist eine persönliche Bewertung von Schönheit und Bewegung. Viele schwärmen genauso für Kraniche oder Reiher — Schönheit liegt im Auge des Betrachters.',
      fr: 'Opinion : « les plus gracieux » est une appréciation subjective. Certains admirent tout autant les grues ou les hérons. La beauté d\'un vol est perçue individuellement.',
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
      de: 'Im Sonnensystem gibt es acht Planeten.',
      fr: 'Il y a huit planètes dans le système solaire.',
    },
    explanation: {
      en: 'Fact: in 2006, the IAU officially defined eight planets — Mercury through Neptune. Pluto was reclassified as a dwarf planet. The number is documented and verifiable.',
      uk: 'Це факт: МАС у 2006 році офіційно визначив вісім планет — від Меркурія до Нептуна. Плутон перевели у клас карликових планет. Число задокументоване й перевіряється.',
      de: 'Fakt: Die IAU legte 2006 offiziell acht Planeten fest — von Merkur bis Neptun. Pluto wurde in die Klasse der Zwergplaneten versetzt. Die Zahl ist dokumentiert und überprüfbar.',
      fr: 'Fait : l\'UAI a officiellement défini huit planètes en 2006 — de Mercure à Neptune. Pluton a été reclassée en planète naine. Ce chiffre est documenté et vérifiable.',
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
      de: 'Van Gogh ist der beste Maler aller Zeiten.',
      fr: 'Van Gogh est le meilleur peintre de tous les temps.',
    },
    explanation: {
      en: 'Opinion: "greatest" is a judgment call. Different experts put Rembrandt, Michelangelo, or Picasso at the top. There\'s no objective way to measure the "best" painter.',
      uk: 'Це думка: «найкращий» — оцінне слово. Різні знавці мистецтва ставлять на перше місце Рембрандта, Мікеланджело або Пікассо. Об\'єктивно виміряти «найкращого» художника неможливо.',
      de: 'Meinung: „Bester" ist ein Werturteil. Verschiedene Kunstkenner setzen Rembrandt, Michelangelo oder Picasso auf Platz eins. Einen „besten" Maler lässt sich nicht objektiv messen.',
      fr: 'Opinion : « meilleur » est un mot subjectif. Différents experts placent Rembrandt, Michel-Ange ou Picasso à la première place. Il est impossible de mesurer objectivement qui est le « meilleur » artiste.',
    },
  },
];

export const HERO_FLOAT_CARDS = SAMPLE_CARDS.slice(0, 2);
