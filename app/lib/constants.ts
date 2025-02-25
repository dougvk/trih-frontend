export const FORMAT_TAGS = ['Standalone Episodes', 'Series Episodes', 'Bonus Episodes'] as const;

export const THEME_TAGS = [
  'Ancient & Classical Civilizations',
  'Medieval & Renaissance Europe',
  'Empire, Colonialism & Exploration',
  'Modern Political History & Leadership',
  'Military History & Battles',
  'Cultural, Social & Intellectual History',
  'Science, Technology & Economic History',
  'Religious, Ideological & Philosophical History',
  'Historical Mysteries, Conspiracies & Scandals',
  'Regional & National Histories',
] as const;

export const TRACK_TAGS = [
  'Roman Track',
  'Medieval & Renaissance Track',
  'Colonialism & Exploration Track',
  'American History Track',
  'Military & Battles Track',
  'Modern Political History Track',
  'Cultural & Social History Track',
  'Science, Technology & Economic History Track',
  'Religious & Ideological History Track',
  'Historical Mysteries & Conspiracies Track',
  'British History Track',
  'Global Empires Track',
  'World Wars Track',
  'Ancient Civilizations Track',
  'Regional Spotlight: Latin America Track',
  'Regional Spotlight: Asia & the Middle East Track',
  'Regional Spotlight: Europe Track',
  'Regional Spotlight: Africa Track',
  'Historical Figures Track',
  'The RIHC Bonus Track',
  'Archive Editions Track',
  'Contemporary Issues Through History Track',
] as const;

export type FormatTag = typeof FORMAT_TAGS[number];
export type ThemeTag = typeof THEME_TAGS[number];
export type TrackTag = typeof TRACK_TAGS[number];
export type Tag = FormatTag | ThemeTag | TrackTag; 