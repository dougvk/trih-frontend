import { Episode } from '../lib/db';

interface EpisodeModalProps {
  episode: Episode;
  onClose: () => void;
}

export default function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-3xl">
        {/* Background layer */}
        <div className="absolute inset-0 bg-gray-900 dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
        
        {/* Foreground card */}
        <div className="relative z-10 bg-[#fff4da] dark:bg-gray-800 rounded-xl border-3 border-gray-900 dark:border-gray-700 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl font-bold text-gray-900 dark:text-white"
            aria-label="Close modal"
          >
            ×
          </button>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{episode.title}</h2>
          
          <div className="prose prose-lg mb-6 text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-[40vh] overflow-y-auto pr-4">
            {episode.description}
          </div>
          
          {/* Tags */}
          <div className="space-y-4 mb-6">
            {/* Format Tag */}
            <div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Format</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-[#ffc480] dark:bg-amber-600 border-2 border-gray-900 dark:border-gray-700 rounded-full text-sm font-bold text-gray-900 dark:text-white text-center min-w-[180px] md:min-w-[220px] inline-block">
                  {episode.formatTags[0]}
                </span>
              </div>
            </div>
            
            {/* Theme Tags */}
            <div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Themes</h3>
              <div className="flex flex-wrap gap-2">
                {episode.themeTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[#e8e8e8] dark:bg-gray-600 border-2 border-gray-900 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white text-center min-w-[180px] md:min-w-[220px] inline-block">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Track Tags */}
            <div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Tracks</h3>
              <div className="flex flex-wrap gap-2">
                {episode.trackTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white dark:bg-gray-700 border-2 border-gray-900 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white text-center min-w-[180px] md:min-w-[220px] inline-block">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Listen Button */}
          {episode.audioUrl ? (
            <a
              href={episode.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-[#ffc480] dark:bg-amber-600 border-2 border-gray-900 dark:border-gray-700 rounded-lg font-bold text-gray-900 dark:text-white hover:-translate-y-1 transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              Listen
            </a>
          ) : (
            <span className="inline-block px-6 py-2 bg-gray-300 dark:bg-gray-600 border-2 border-gray-900 dark:border-gray-700 rounded-lg font-bold text-gray-600 dark:text-gray-300 cursor-not-allowed">
              No Audio Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}