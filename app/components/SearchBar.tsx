interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 bg-gray-900 dark:bg-gray-700 rounded-xl translate-y-2 translate-x-2"></div>
        
        {/* Foreground input */}
        <input
          type="search"
          placeholder="Search episodes by title or description..."
          className="relative z-10 w-full px-6 py-3 bg-white dark:bg-gray-800 border-3 border-gray-900 dark:border-gray-700 rounded-xl text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffc480] dark:focus:ring-amber-600 focus:border-gray-900 dark:focus:border-gray-700 transition-transform hover:-translate-y-1 hover:-translate-x-1"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}