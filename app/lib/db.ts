import { Tag } from './constants';
import episodes from './episodes.json';

export interface Episode {
  id: number;
  title: string;
  description: string;
  cleanedDescription: string;
  podcastLink: string;
  tags: Tag[];
  publishedDate: string;
  duration?: string;
  audioUrl?: string;
  episodeNumber?: number;
}

interface RawEpisode {
  id: number;
  title: string;
  description: string;
  cleaned_description: string;
  podcastLink: string;
  tags: string;
  publishedDate: string;
  duration: string | null;
  audioUrl: string | null;
  episodeNumber: number | null;
}

interface ParsedTags {
  Format: string[];
  Theme: string[];
  Track: string[];
  episode_number: number | null;
}

// Parse the JSON tags field for each episode
export const allEpisodes: Episode[] = (episodes as RawEpisode[]).map(episode => {
  const parsedTags = JSON.parse(episode.tags) as ParsedTags;
  return {
    id: episode.id,
    title: episode.title,
    description: episode.description,
    cleanedDescription: episode.cleaned_description,
    podcastLink: episode.podcastLink,
    tags: [...parsedTags.Format, ...parsedTags.Theme, ...parsedTags.Track] as Tag[],
    publishedDate: episode.publishedDate,
    duration: episode.duration || undefined,
    audioUrl: episode.audioUrl || undefined,
    episodeNumber: episode.episodeNumber || undefined
  };
}); 