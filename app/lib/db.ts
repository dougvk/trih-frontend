import episodes from './episodes.json';

export interface Episode {
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
  guid: string;
  title: string;
  description?: string;
  cleaned_description: string;
  link?: string;
  published_date: string;
  duration?: string;
  audio_url: string;
  tags: {
    Format: string[];
    Theme: string[];
    Track: string[];
    episode_number: number | null;
  };
  cleaning_status?: string;
  cleaning_timestamp?: string;
  created_at?: string;
  updated_at?: string;
}

// Map the raw episodes to our Episode interface
export const allEpisodes: Episode[] = (episodes as RawEpisode[]).map(episode => ({
  guid: episode.guid,
  title: episode.title,
  description: episode.description || episode.cleaned_description,
  cleanedDescription: episode.cleaned_description,
  link: episode.link || '',
  publishedDate: episode.published_date,
  duration: episode.duration || '',
  audioUrl: episode.audio_url,
  episodeNumber: episode.tags.episode_number,
  formatTags: episode.tags.Format || [],
  themeTags: episode.tags.Theme || [],
  trackTags: episode.tags.Track || [],
  cleaningStatus: episode.cleaning_status || 'completed',
  cleaningTimestamp: episode.cleaning_timestamp || '',
  createdAt: episode.created_at || '',
  updatedAt: episode.updated_at || ''
}));

// Sort episodes by published date (newest first)
export const allEpisodesSorted = [...allEpisodes].sort((a, b) => {
  const dateA = new Date(a.publishedDate);
  const dateB = new Date(b.publishedDate);
  return dateB.getTime() - dateA.getTime(); // Newest first
});

// Extract unique format tags from all episodes
export const allFormatTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.formatTags))
).sort();

// Extract unique theme tags from all episodes
export const allThemeTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.themeTags))
).sort();

// Extract unique track tags from all episodes
export const allTrackTags = Array.from(
  new Set(allEpisodes.flatMap(episode => episode.trackTags))
).sort(); 