import { FORMAT_TAGS, THEME_TAGS, TRACK_TAGS, type FormatTag, type ThemeTag, type TrackTag } from '../lib/constants';

interface FilterButtonsProps {
  selectedFormat: FormatTag | null;
  selectedThemes: ThemeTag[];
  selectedTracks: TrackTag[];
  onFormatChange: (format: FormatTag) => void;
  onThemeChange: (theme: ThemeTag) => void;
  onTrackChange: (track: TrackTag) => void;
}

export default function FilterButtons({
  selectedFormat,
  selectedThemes,
  selectedTracks,
  onFormatChange,
  onThemeChange,
  onTrackChange,
}: FilterButtonsProps) {
  return (
    <div className="w-full space-y-8 mb-8">
      {/* Format Tags */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Format</h2>
        <div className="flex flex-wrap gap-3">
          {FORMAT_TAGS.map((format) => (
            <button
              key={format}
              onClick={() => onFormatChange(format)}
              className="relative"
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl translate-y-1 translate-x-1"></div>
              {/* Button content */}
              <div className={`relative px-6 py-3 border-3 border-gray-900 rounded-xl font-bold text-gray-900 hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200 ${
                selectedFormat === format ? 'bg-[#ffc480]' : 'bg-[#fff4da]'
              }`}>
                {format}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Tags */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Themes</h2>
        <div className="flex flex-wrap gap-3">
          {THEME_TAGS.map((theme) => (
            <button
              key={theme}
              onClick={() => onThemeChange(theme)}
              className="relative"
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl translate-y-1 translate-x-1"></div>
              {/* Button content */}
              <div className={`relative px-6 py-3 border-3 border-gray-900 rounded-xl font-bold text-gray-900 hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200 ${
                selectedThemes.includes(theme) ? 'bg-[#ffc480]' : 'bg-[#fff4da]'
              }`}>
                {theme}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Track Tags */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Tracks</h2>
        <div className="flex flex-wrap gap-3">
          {TRACK_TAGS.map((track) => (
            <button
              key={track}
              onClick={() => onTrackChange(track)}
              className="relative"
            >
              {/* Shadow */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl translate-y-1 translate-x-1"></div>
              {/* Button content */}
              <div className={`relative px-6 py-3 border-3 border-gray-900 rounded-xl font-bold text-gray-900 hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200 ${
                selectedTracks.includes(track) ? 'bg-[#ffc480]' : 'bg-[#fff4da]'
              }`}>
                {track}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 