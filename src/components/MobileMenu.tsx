'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        {isOpen ? (
          // X icon when menu is open
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon when menu is closed
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className={`block px-4 py-2 text-sm ${pathname === '/'
                ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 font-medium'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`block px-4 py-2 text-sm ${pathname === '/blog'
                ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 font-medium'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            Blog
          </Link>

          <Link
            href="/about"
            className={`block px-4 py-2 text-sm ${pathname === '/about'
                ? 'text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-700 font-medium'
                : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            About
          </Link>
          {/* Search form removed from mobile menu as it's now directly on the home page */}
        </div>
      )}
    </div>
  );
}
