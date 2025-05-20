'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchResult, searchPosts, loadSearchIndex } from '@/lib/flexSearchUtils';

export function ClientSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchIndexStatus, setSearchIndexStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Load search index on mount
  useEffect(() => {
    async function initializeSearchIndex() {
      try {
        const success = await loadSearchIndex();
        if (success) {
          console.log('Search index loaded successfully!');
          setSearchIndexStatus('success');
        } else {
          console.error('Failed to load search index');
          setSearchIndexStatus('error');
          setError('Failed to load search index');
        }
      } catch (err) {
        console.error('Error loading search index:', err);
        setSearchIndexStatus('error');
        setError(`Error loading search index: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    initializeSearchIndex();
  }, []);

  // Function to highlight search terms in text
  const highlightSearchTerms = (text: string) => {
    if (!query.trim()) return text;
    
    const searchTerms = query.toLowerCase().split(/\s+/);
    let result = text;
    
    // Create a case-insensitive regex for each search term
    searchTerms.forEach(term => {
      if (!term) return;
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    });
    
    return result;
  };

  // Handle search
  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Initiating search for query: "${query}"`);
        const searchResults = await searchPosts(query);
        console.log(`Search complete, found ${searchResults.length} results`);
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError(`Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setResults([]);
        
        // If search index status was success but search failed, reset it to try loading again
        if (searchIndexStatus === 'success') {
          console.log('Resetting search index status to retry loading');
          setSearchIndexStatus('loading');
          // Try to reload the search index
          loadSearchIndex().then(success => {
            setSearchIndexStatus(success ? 'success' : 'error');
            if (!success) {
              setError('Failed to reload search index. Please refresh the page and try again.');
            }
          });
        }
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Search status indicator */}
      {searchIndexStatus === 'loading' && (
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg mb-4">
          Checking search functionality...
        </div>
      )}
      
      {searchIndexStatus === 'error' && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
          <p className="font-bold">Search index not available</p>
          <p>{error}</p>
          <p className="mt-2">
            Try these paths:
          </p>
          <ul className="list-disc pl-5 mt-1">
            <li><a href="/search-index.json" target="_blank" className="text-blue-600 dark:text-blue-400 underline">/search-index.json</a></li>
            <li><a href="/nirzaf.github.io/search-index.json" target="_blank" className="text-blue-600 dark:text-blue-400 underline">/nirzaf.github.io/search-index.json</a></li>
          </ul>
        </div>
      )}

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </h2>
          
          {results.map((result) => (
            <div key={result.slug} className="p-4 border rounded-lg hover:shadow-md dark:border-gray-700">
              <Link href={`/blog/${result.slug}`} className="block">
                <h3 className="text-lg font-bold mb-2">
                  <span dangerouslySetInnerHTML={{ __html: highlightSearchTerms(result.title) }} />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {result.pubDate} • {result.tags?.join(', ')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <span dangerouslySetInnerHTML={{ __html: highlightSearchTerms(result.description) }} />
                </p>
                {result.contentSnippet && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    <span dangerouslySetInnerHTML={{ __html: highlightSearchTerms(result.contentSnippet) }} />
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!isLoading && !error && query && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No results found for "{query}"</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && !query && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Enter a search term to find blog posts</p>
        </div>
      )}
    </div>
  );
}
