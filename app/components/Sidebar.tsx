import { type ThemeTag, type TrackTag } from '../lib/constants';
import FilterButtons from './FilterButtons';

interface SidebarProps {
  isOpen: boolean;
  selectedThemes: ThemeTag[];
  selectedTracks: TrackTag[];
  onThemeChange: (theme: ThemeTag) => void;
  onTrackChange: (track: TrackTag) => void;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen,
  selectedThemes,
  selectedTracks,
  onThemeChange,
  onTrackChange,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop overlay for small screens */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed top-0 left-0 h-screen w-[300px] bg-[#fff4da] dark:bg-gray-800 border-r-2 border-gray-900 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
      >
        <div className="h-[64px]" /> {/* Header spacing */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <FilterButtons
            selectedFormat={null}
            selectedThemes={selectedThemes}
            selectedTracks={selectedTracks}
            onFormatChange={() => {}}
            onThemeChange={onThemeChange}
            onTrackChange={onTrackChange}
            showOnlyFormat={false}
          />
        </div>
      </div>
    </>
  );
}