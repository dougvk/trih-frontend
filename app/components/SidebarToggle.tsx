interface SidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className="relative h-10 w-10 focus:outline-none"
      aria-label={isOpen ? "Close filters" : "Open filters"}
    >
      {/* Shadow layer */}
      <div className="absolute inset-0 bg-gray-900 dark:bg-gray-700 rounded-lg translate-y-1 translate-x-1" />
      
      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center h-full w-full bg-[#fff4da] dark:bg-gray-800 rounded-lg border-2 border-gray-900 dark:border-gray-700 hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </div>
    </button>
  );
}