'use client';

import { useState, useEffect } from 'react';
import { allEpisodes, type Episode } from './lib/db';
import { FORMAT_TAGS, THEME_TAGS, TRACK_TAGS, type FormatTag, type ThemeTag, type TrackTag } from './lib/constants';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterButtons from './components/FilterButtons';
import EpisodeCard from './components/EpisodeCard';
import EpisodeModal from './components/EpisodeModal';
import Sidebar from './components/Sidebar';
import SidebarToggle from './components/SidebarToggle';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<FormatTag | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<ThemeTag[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<TrackTag[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set sidebar open state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768); // 768px is the md breakpoint in Tailwind
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter episodes based on search and selected tags
  const filteredEpisodes = allEpisodes.filter(episode => {
    // Search filter (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        episode.title.toLowerCase().includes(query) ||
        episode.description.toLowerCase().includes(query) ||
        (episode.cleanedDescription?.toLowerCase().includes(query) ?? false);
      if (!matchesSearch) return false;
    }

    // Format filter
    if (selectedFormat) {
      if (selectedFormat === 'Bonus Episodes') {
        if (!episode.tags.includes('The RIHC Bonus Track')) return false;
      } else if (selectedFormat === 'Series Episodes') {
        if (!episode.tags.includes(selectedFormat) || episode.tags.includes('The RIHC Bonus Track')) return false;
      } else if (!episode.tags.includes(selectedFormat)) {
        return false;
      }
    }

    // Theme filter
    if (selectedThemes.length > 0) {
      const hasAllSelectedThemes = selectedThemes.every(theme => 
        episode.tags.includes(theme)
      );
      if (!hasAllSelectedThemes) return false;
    }

    // Track filter
    if (selectedTracks.length > 0) {
      const hasAllSelectedTracks = selectedTracks.every(track => 
        episode.tags.includes(track)
      );
      if (!hasAllSelectedTracks) return false;
    }

    return true;
  });

  // Handle filter changes
  const handleFormatChange = (format: FormatTag) => {
    setSelectedFormat(selectedFormat === format ? null : format);
  };

  const handleThemeChange = (theme: ThemeTag) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleTrackChange = (track: TrackTag) => {
    setSelectedTracks(prev =>
      prev.includes(track)
        ? prev.filter(t => t !== track)
        : [...prev, track]
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Header />
      
      <Sidebar
        isOpen={isSidebarOpen}
        selectedThemes={selectedThemes}
        selectedTracks={selectedTracks}
        onThemeChange={handleThemeChange}
        onTrackChange={handleTrackChange}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="transition-all duration-300 pl-0">
        <div className={`max-w-7xl mx-auto px-4 py-8 ${isSidebarOpen ? 'md:ml-[300px]' : ''}`}>
          <div className="flex items-center gap-4 mb-8">
            <SidebarToggle
              isOpen={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="flex-grow">
              <SearchBar onSearch={setSearchQuery} />
            </div>
          </div>
          
          <div className="mb-8">
            <FilterButtons
              selectedFormat={selectedFormat}
              onFormatChange={handleFormatChange}
              showOnlyFormat={true}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEpisodes.map(episode => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onClick={() => setSelectedEpisode(episode)}
              />
            ))}
          </div>
        </div>
        
        {selectedEpisode && (
          <EpisodeModal
            episode={selectedEpisode}
            onClose={() => setSelectedEpisode(null)}
          />
        )}
      </main>
    </div>
  );
}
