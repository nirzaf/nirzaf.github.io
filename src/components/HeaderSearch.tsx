'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
}

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search posts when query changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          // Use client-side search instead of API for static exports
          const results = await import('@/lib/simpleSearch').then(module => {
            return module.searchPosts(query);
          });

          setResults(results.slice(0, 5)); // Limit to 5 results for the dropdown
        } catch (error) {
          console.error('Error searching posts:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <label htmlFor="header-search" className="sr-only">Search posts</label>
          <input
            type="text"
            id="header-search"
            name="header-search"
            aria-label="Search posts"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search posts..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </form>

      {/* Search results dropdown */}
      {showResults && query.trim() && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : results.length > 0 ? (
            <>
              <ul>
                {results.map((post) => (
                  <li key={post.slug} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setShowResults(false)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{post.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline p-1"
                  onClick={() => setShowResults(false)}
                >
                  View all results
                </Link>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
