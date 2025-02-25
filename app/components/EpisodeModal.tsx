import { Episode } from '../lib/db';
import { FORMAT_TAGS, THEME_TAGS, TRACK_TAGS, type FormatTag, type ThemeTag, type TrackTag } from '../lib/constants';

interface EpisodeModalProps {
  episode: Episode;
  onClose: () => void;
}

export default function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-3xl">
        {/* Background layer */}
        <div className="absolute inset-0 bg-gray-900 rounded-xl translate-y-2 translate-x-2"></div>
        
        {/* Foreground card */}
        <div className="relative z-10 bg-[#fff4da] rounded-xl border-3 border-gray-900 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl font-bold text-gray-900"
            aria-label="Close modal"
          >
            ×
          </button>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{episode.title}</h2>
          
          <div className="prose prose-lg mb-6 text-gray-700 whitespace-pre-line max-h-[40vh] overflow-y-auto pr-4">
            {episode.description}
          </div>
          
          {/* Tags */}
          <div className="space-y-4 mb-6">
            {/* Format Tag */}
            <div>
              <h3 className="font-bold mb-2 text-gray-900">Format</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#ffc480] border-2 border-gray-900 rounded-full text-sm font-bold text-gray-900">
                  {episode.tags.find(tag => FORMAT_TAGS.includes(tag as FormatTag))}
                </span>
              </div>
            </div>
            
            {/* Theme Tags */}
            <div>
              <h3 className="font-bold mb-2 text-gray-900">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {episode.tags
                  .filter(tag => THEME_TAGS.includes(tag as ThemeTag))
                  .map(tag => (
                    <span key={tag} className="px-3 py-1 bg-[#e8e8e8] border-2 border-gray-900 rounded-full text-sm text-gray-900">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
            
            {/* Track Tags */}
            <div>
              <h3 className="font-bold mb-2 text-gray-900">Tracks</h3>
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
          </div>
          
          {/* Listen Button */}
          <a
            href={episode.podcastLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#ffc480] border-2 border-gray-900 rounded-lg font-bold text-gray-900 hover:-translate-y-1 transition-transform"
          >
            Listen to Episode
          </a>
        </div>
      </div>
    </div>
  );
} 