import { Episode } from '../lib/db';
import { FORMAT_TAGS, THEME_TAGS, TRACK_TAGS, type FormatTag, type ThemeTag, type TrackTag } from '../lib/constants';

interface EpisodeCardProps {
  episode: Episode;
  onClick: () => void;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export default function EpisodeCard({ episode, onClick }: EpisodeCardProps) {
  return (
    <div className="h-full">
      <div className="relative group cursor-pointer h-full" onClick={onClick}>
        {/* Background layer */}
        <div className="absolute inset-0 bg-gray-900 rounded-xl translate-y-2 translate-x-2 transition-transform group-hover:translate-y-3 group-hover:translate-x-3"></div>
        
        {/* Foreground card */}
        <div className="relative z-10 bg-[#fff4da] rounded-xl border-3 border-gray-900 p-8 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 h-full flex flex-col">
          <h3 className="text-xl font-bold mb-3 text-gray-900">{episode.title}</h3>
          
          <p className="text-gray-700 mb-4">
            {truncateText(episode.description, 150)}
          </p>
          
          {/* Tags */}
          <div className="space-y-2 mb-4">
            {/* Format Tag */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#ffc480] border-2 border-gray-900 rounded-full text-sm font-bold text-gray-900">
                {episode.tags.find(tag => FORMAT_TAGS.includes(tag as FormatTag))}
              </span>
            </div>
            
            {/* Theme Tags */}
            <div className="flex flex-wrap gap-2">
              {episode.tags
                .filter(tag => THEME_TAGS.includes(tag as ThemeTag))
                .map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#e8e8e8] border-2 border-gray-900 rounded-full text-sm text-gray-900">
                    {tag}
                  </span>
                ))}
            </div>
            
            {/* Track Tags */}
            <div className="flex flex-wrap gap-2">
              {episode.tags
                .filter(tag => TRACK_TAGS.includes(tag as TrackTag))
                .map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border-2 border-gray-900 rounded-full text-sm text-gray-900">
                    {tag}
                  </span>
                ))}
            </div>
          </div>
          
          {/* Listen Button */}
          <a
            href={episode.podcastLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-[#ffc480] border-2 border-gray-900 rounded-lg font-bold text-gray-900 hover:-translate-y-1 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            Listen
          </a>
          
          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
} 