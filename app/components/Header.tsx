import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[#fff4da] border-b-3 border-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Podcast Episode Explorer</h1>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-lg font-medium text-gray-900 hover:text-[#ffc480] transition-colors">
                  Episodes
                </Link>
              </li>
              <li>
                <Link href="/qa" className="text-lg font-medium text-gray-900 hover:text-[#ffc480] transition-colors">
                  Q&A
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}