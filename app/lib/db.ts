import episodes from './episodes.json';

export interface Episode {
  id: number;
  guid: string;
  title: string;
  description: string;
  cleanedDescription: string;
  link: string;
  publishedDate: string;
  duration: string;
  audioUrl: string;
  episodeNumber: number | null;
  formatTags: string[];
  themeTags: string[];
  trackTags: string[];
  cleaningStatus: string;
  cleaningTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface RawEpisode {
  id: number;
  guid: string;
  title: string;
  description: string;
  cleaned_description: string;
  link: string;
  published_date: string;
  duration: string;
  audio_url: string;
  episode_number: number | null;
  format_tags: string[];
  theme_tags: string[];
  track_tags: string[];
  cleaning_status: string;
  cleaning_timestamp: string;
  created_at: string;
  updated_at: string;
}

// Map the raw episodes to our Episode interface
export const allEpisodes: Episode[] = (episodes as RawEpisode[]).map(episode => ({
  id: episode.id,
  guid: episode.guid,
  title: episode.title,
  description: episode.description,
  cleanedDescription: episode.cleaned_description,
  link: episode.link,
  publishedDate: episode.published_date,
  duration: episode.duration,
  audioUrl: episode.audio_url,
  episodeNumber: episode.episode_number,
  formatTags: episode.format_tags,
  themeTags: episode.theme_tags,
  trackTags: episode.track_tags,
  cleaningStatus: episode.cleaning_status,
  cleaningTimestamp: episode.cleaning_timestamp,
  createdAt: episode.created_at,
  updatedAt: episode.updated_at
}));

// Extract unique theme tags from all episodes
export const allThemeTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.themeTags))
).sort();

// Extract unique track tags from all episodes
export const allTrackTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.trackTags))
).sort(); 