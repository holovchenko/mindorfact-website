export type TopicSlug = 'general' | 'art' | 'science' | 'nature' | 'space';

export type Topic = {
  slug: TopicSlug;
  emoji: string;
  /** i18n key under dict.topics.<slug> */
  labelKey: TopicSlug;
};

export const TOPICS: Topic[] = [
  { slug: 'general', emoji: '🧠', labelKey: 'general' },
  { slug: 'art',     emoji: '🎨', labelKey: 'art' },
  { slug: 'science', emoji: '🧪', labelKey: 'science' },
  { slug: 'nature',  emoji: '🦒', labelKey: 'nature' },
  { slug: 'space',   emoji: '🪐', labelKey: 'space' },
];
