'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { SearchResult, searchPosts } from '@/lib/searchUtils';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to highlight search terms in text
  const highlightSearchTerms = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    
    const searchTerms = searchQuery.toLowerCase().split(/\s+/);
    let result = text;
    
    // Create a case-insensitive regex for each search term
    searchTerms.forEach(term => {
      if (!term) return;
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    });
    
    return result;
  };

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchPosts(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    }

    // Add a small debounce to avoid too many searches while typing
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      {query ? (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isLoading
              ? 'Searching...'
              : results.length === 0
              ? `No results found for "${query}"`
              : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {results.map((result) => (
                <div
                  key={result.slug}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{new Date(result.pubDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {result.matchType === 'title' ? 'Title match' : 
                       result.matchType === 'description' ? 'Description match' :
                       result.matchType === 'tag' ? 'Tag match' : 'Content match'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/blog/${result.slug}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {result.title}
                    </Link>
                  </h2>
                  <p 
                    className="text-gray-600 dark:text-gray-300 mb-4"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightSearchTerms(result.description, query) 
                    }} 
                  />
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          dangerouslySetInnerHTML={{ 
                            __html: `#${highlightSearchTerms(tag, query)}` 
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Enter a search term to find blog posts.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
