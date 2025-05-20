import { Document } from 'flexsearch';
import type { SearchIndexEntry } from './searchIndex';

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  pubDate: string;
  matchType?: 'title' | 'description' | 'tag' | 'content';
  contentSnippet?: string;
}

// Create a document search instance with multiple indices
const searchIndex = new Document({
  document: {
    id: 'slug',
    index: [
      { field: 'title', tokenize: 'forward', resolution: 9 },
      { field: 'description', tokenize: 'forward', resolution: 5 },
      { field: 'tags', tokenize: 'forward', resolution: 7 },
      { field: 'content', tokenize: 'forward', resolution: 3 }
    ],
    store: ['slug', 'title', 'description', 'tags', 'pubDate', 'content']
  }
});

let isIndexLoaded = false;

// Function to fetch the search index from the static JSON file
export async function loadSearchIndex(): Promise<boolean> {
  if (isIndexLoaded) return true;
  
  try {
    // Try multiple paths to handle both GitHub Pages and custom domain deployments
    const possiblePaths = [
      '/search-index.json', // For custom domain
      `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/search-index.json`, // For GitHub Pages
      '/nirzaf.github.io/search-index.json' // Hardcoded GitHub Pages path as fallback
    ];
    
    let response: Response | null = null;
    let error: Error | null = null;
    
    // Try each path until one works
    for (const path of possiblePaths) {
      try {
        console.log(`Trying to fetch search index from: ${path}`);
        response = await fetch(path);
        if (response.ok) {
          console.log(`Successfully fetched search index from: ${path}`);
          break;
        }
      } catch (e) {
        error = e as Error;
        console.warn(`Failed to fetch search index from: ${path}`, e);
      }
    }
    
    if (!response || !response.ok) {
      throw error || new Error('Failed to fetch search index from all possible paths');
    }
    
    const entries = await response.json() as SearchIndexEntry[];
    
    // Add each entry to the search index
    entries.forEach(entry => {
      searchIndex.add({
        slug: entry.slug,
        title: entry.title,
        description: entry.description,
        tags: entry.tags?.join(' ') || '',
        pubDate: entry.pubDate,
        content: entry.content
      });
    });
    
    isIndexLoaded = true;
    console.log(`Search index loaded with ${entries.length} entries`);
    return true;
  } catch (error) {
    console.error('Error loading search index:', error);
    return false;
  }
}

// Function to extract a snippet around a match
function extractSnippet(content: string, query: string): string | undefined {
  if (!content) return undefined;
  
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  const matchIndex = contentLower.indexOf(queryLower);
  
  if (matchIndex === -1) return undefined;
  
  const start = Math.max(0, matchIndex - 50);
  const end = Math.min(contentLower.length, matchIndex + queryLower.length + 100);
  return '...' + content.slice(start, end).replace(/\n/g, ' ').trim() + '...';
}

// Function to determine match type
function determineMatchType(result: any, query: string): 'title' | 'description' | 'tag' | 'content' {
  const queryLower = query.toLowerCase();
  
  if (result.title.toLowerCase().includes(queryLower)) return 'title';
  if (result.description.toLowerCase().includes(queryLower)) return 'description';
  if (result.tags && result.tags.toLowerCase().includes(queryLower)) return 'tag';
  return 'content';
}

// Search function
export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  // Ensure search index is loaded
  const indexLoaded = await loadSearchIndex();
  if (!indexLoaded) {
    console.error('Search index not loaded, cannot perform search');
    return [];
  }
  
  // Perform search across all fields
  const results = await searchIndex.search(query);
  
  // Flatten and deduplicate results
  const slugSet = new Set<string>();
  const searchResults: SearchResult[] = [];
  
  // Process results from all fields
  results.forEach(fieldResults => {
    fieldResults.result.forEach((slug) => {
      const slugStr = String(slug); // Convert to string to handle both string and number IDs
      if (!slugSet.has(slugStr)) {
        slugSet.add(slugStr);
        
        // Get the full document from the store
        const doc = searchIndex.get(slugStr) as any;
        
        if (doc) {
          const matchType = determineMatchType(doc, query);
          const contentSnippet = matchType === 'content' ? extractSnippet(doc.content, query) : undefined;
          
          searchResults.push({
            slug: doc.slug,
            title: doc.title,
            description: doc.description,
            tags: doc.tags ? doc.tags.split(' ').filter(Boolean) : [],
            pubDate: doc.pubDate,
            matchType,
            contentSnippet
          });
        }
      }
    });
  });
  
  return searchResults;
}
