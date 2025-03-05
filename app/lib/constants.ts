export const FORMAT_TAGS = ['Standalone Episodes', 'Series Episodes', 'Bonus Episodes'] as const;

export type FormatTag = typeof FORMAT_TAGS[number];
export type ThemeTag = string;
export type TrackTag = string; 