import type { SearchIndexEntry } from './searchIndex';

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  pubDate: string;
  contentSnippet?: string;
}

// Cache the search index once loaded
let searchIndexCache: SearchIndexEntry[] | null = null;

/**
 * Fetch the search index from the static JSON file
 */
export async function fetchSearchIndex(): Promise<SearchIndexEntry[]> {
  if (searchIndexCache) {
    return searchIndexCache;
  }

  try {
    // For GitHub Pages, we need to try multiple paths
    const paths = [
      '/search-index.json',
      '/nirzaf.github.io/search-index.json',
      'search-index.json'
    ];
    
    let response = null;
    
    // Try each path until one works
    for (const path of paths) {
      console.log(`Trying to fetch search index from: ${path}`);
      try {
        response = await fetch(path, { cache: 'no-store' });
        if (response.ok) {
          console.log(`Successfully fetched search index from: ${path}`);
          break;
        }
      } catch (e) {
        console.warn(`Error fetching from ${path}:`, e);
      }
    }
    
    if (!response || !response.ok) {
      throw new Error('Failed to fetch search index');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Search index is not an array');
    }
    
    console.log(`Loaded ${data.length} entries from search index`);
    searchIndexCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching search index:', error);
    throw error;
  }
}

/**
 * Check if the search index is available
 */
export async function isSearchAvailable(): Promise<boolean> {
  try {
    await fetchSearchIndex();
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Extract a snippet of text around the first match of the query
 */
function extractSnippet(content: string, query: string): string | undefined {
  if (!content || !query) return undefined;
  
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  const index = lowerContent.indexOf(lowerQuery);
  if (index === -1) return undefined;
  
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  
  let snippet = content.substring(start, end);
  
  // Add ellipsis if we're not at the beginning or end
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  
  return snippet;
}

/**
 * Search for posts matching the query
 */
export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const searchIndex = await fetchSearchIndex();
    const results: SearchResult[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    
    for (const post of searchIndex) {
      // Skip posts without a title
      if (!post.title) continue;
      
      const searchableContent = [
        post.title?.toLowerCase() || '',
        post.description?.toLowerCase() || '',
        post.tags?.map(t => t.toLowerCase()).join(' ') || '',
        post.content?.toLowerCase() || ''
      ].join(' ');
      
      // Check if all query terms are found in the post
      const allTermsFound = queryTerms.every(term => 
        searchableContent.includes(term)
      );
      
      if (allTermsFound) {
        // Find which field matched for better snippet extraction
        let matchField = 'content';
        if (post.title?.toLowerCase().includes(query.toLowerCase())) {
          matchField = 'title';
        } else if (post.description?.toLowerCase().includes(query.toLowerCase())) {
          matchField = 'description';
        } else if (post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
          matchField = 'tag';
        }
        
        // Create a result with a content snippet if available
        results.push({
          slug: post.slug,
          title: post.title,
          description: post.description || '',
          tags: post.tags,
          pubDate: post.pubDate || '',
          contentSnippet: matchField === 'content' ? extractSnippet(post.content, query) : undefined
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}
