import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  return (
    <header className="w-full bg-[#fff4da] dark:bg-gray-800 border-b-3 border-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Podcast Episode Explorer</h1>
          <div className="flex items-center mt-4 md:mt-0">
            <nav className="mr-4">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-lg font-medium text-gray-900 dark:text-white hover:text-[#ffc480] dark:hover:text-[#ffc480] transition-colors">
                    Episodes
                  </Link>
                </li>
                <li>
                  <Link href="/qa" className="text-lg font-medium text-gray-900 dark:text-white hover:text-[#ffc480] dark:hover:text-[#ffc480] transition-colors">
                    Q&A
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="text-lg font-medium text-gray-900 dark:text-white hover:text-[#ffc480] dark:hover:text-[#ffc480] transition-colors">
                    Chat
                  </Link>
                </li>
              </ul>
            </nav>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}