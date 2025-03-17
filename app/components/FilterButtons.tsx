import { useState } from 'react';
import { FORMAT_TAGS, type FormatTag, type ThemeTag, type TrackTag } from '../lib/constants';
import { allThemeTags, allTrackTags } from '../lib/db';

interface FilterButtonsProps {
  selectedFormat: FormatTag | null;
  selectedThemes?: ThemeTag[];
  selectedTracks?: TrackTag[];
  onFormatChange: (format: FormatTag) => void;
  onThemeChange?: (theme: ThemeTag) => void;
  onTrackChange?: (track: TrackTag) => void;
  showOnlyFormat?: boolean;
}

export default function FilterButtons({
  selectedFormat,
  selectedThemes = [],
  selectedTracks = [],
  onFormatChange,
  onThemeChange,
  onTrackChange,
  showOnlyFormat = false,
}: FilterButtonsProps) {
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);

  const FilterButton = ({ 
    onClick, 
    isSelected, 
    children 
  }: { 
    onClick: () => void; 
    isSelected: boolean; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="relative"
    >
      <div className="absolute inset-0 bg-gray-900 dark:bg-gray-700 rounded-lg translate-y-1 translate-x-1" />
      <div className={`relative z-10 px-4 py-2 rounded-lg border-2 border-gray-900 dark:border-gray-700 font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-gray-900 dark:bg-gray-700 text-white translate-y-1 translate-x-1'
          : 'bg-[#fff4da] dark:bg-gray-800 text-gray-900 dark:text-white hover:-translate-y-0.5 hover:-translate-x-0.5'
      }`}>
        {children}
      </div>
    </button>
  );

  if (showOnlyFormat) {
    return (
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Format</h2>
          <div className="flex flex-wrap gap-4">
            {FORMAT_TAGS.map(format => (
              <FilterButton
                key={format}
                onClick={() => onFormatChange(format)}
                isSelected={selectedFormat === format}
              >
                {format}
              </FilterButton>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {onThemeChange && (
        <section>
          <button 
            onClick={() => setIsThemesOpen(!isThemesOpen)}
            className="w-full flex items-center justify-between text-xl font-bold mb-4 text-gray-900 dark:text-white hover:opacity-75"
          >
            <span>Themes</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 transform transition-transform ${isThemesOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="space-y-4">
            {/* Selected themes when collapsed */}
            {!isThemesOpen && selectedThemes.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {allThemeTags.filter(theme => selectedThemes.includes(theme)).map(theme => (
                  <FilterButton
                    key={theme}
                    onClick={() => onThemeChange(theme)}
                    isSelected={true}
                  >
                    {theme}
                  </FilterButton>
                ))}
              </div>
            )}
            
            {/* All themes when expanded */}
            {isThemesOpen && (
              <div className="flex flex-wrap gap-4">
                {allThemeTags.map(theme => (
                  <FilterButton
                    key={theme}
                    onClick={() => onThemeChange(theme)}
                    isSelected={selectedThemes.includes(theme)}
                  >
                    {theme}
                  </FilterButton>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {onTrackChange && (
        <section>
          <button 
            onClick={() => setIsTracksOpen(!isTracksOpen)}
            className="w-full flex items-center justify-between text-xl font-bold mb-4 text-gray-900 dark:text-white hover:opacity-75"
          >
            <span>Tracks</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 transform transition-transform ${isTracksOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="space-y-4">
            {/* Selected tracks when collapsed */}
            {!isTracksOpen && selectedTracks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {allTrackTags.filter(track => selectedTracks.includes(track)).map(track => (
                  <FilterButton
                    key={track}
                    onClick={() => onTrackChange(track)}
                    isSelected={true}
                  >
                    {track}
                  </FilterButton>
                ))}
              </div>
            )}
            
            {/* All tracks when expanded */}
            {isTracksOpen && (
              <div className="flex flex-wrap gap-4">
                {allTrackTags.map(track => (
                  <FilterButton
                    key={track}
                    onClick={() => onTrackChange(track)}
                    isSelected={selectedTracks.includes(track)}
                  >
                    {track}
                  </FilterButton>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}