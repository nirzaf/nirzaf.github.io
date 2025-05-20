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
let searchIndex: Document<any, any> | null = null;

// Initialize the search index
function initSearchIndex() {
  if (searchIndex) return; // Already initialized
  
  try {
    searchIndex = new Document({
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
    console.log('FlexSearch index initialized successfully');
  } catch (error) {
    console.error('Error initializing FlexSearch index:', error);
    throw new Error(`Failed to initialize search index: ${error instanceof Error ? error.message : String(error)}`);
  }
}

let isIndexLoaded = false;

// Function to fetch the search index from the static JSON file
export async function loadSearchIndex(): Promise<boolean> {
  if (isIndexLoaded) {
    console.log('Search index already loaded, skipping');
    return true;
  }
  
  try {
    // Initialize the search index first
    initSearchIndex();
    
    if (!searchIndex) {
      throw new Error('Search index initialization failed');
    }
    
    // Try multiple paths to handle both GitHub Pages and custom domain deployments
    const possiblePaths = [
      '/search-index.json', // For custom domain
      `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/search-index.json`, // For GitHub Pages
      '/nirzaf.github.io/search-index.json' // Hardcoded GitHub Pages path as fallback
    ];
    
    let response: Response | null = null;
    let lastError: Error | null = null;
    let successPath = '';
    
    // Try each path until one works
    for (const path of possiblePaths) {
      try {
        console.log(`Trying to fetch search index from: ${path}`);
        response = await fetch(path, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-cache' // Avoid caching issues
        });
        
        if (response.ok) {
          console.log(`Successfully fetched search index from: ${path}`);
          successPath = path;
          break;
        } else {
          console.warn(`Failed to fetch search index from: ${path}, status: ${response.status}`);
          lastError = new Error(`HTTP error ${response.status}`);
        }
      } catch (e) {
        lastError = e as Error;
        console.warn(`Error fetching search index from: ${path}`, e);
      }
    }
    
    if (!response || !response.ok) {
      throw lastError || new Error('Failed to fetch search index from all possible paths');
    }
    
    // Parse the JSON response
    let entries: SearchIndexEntry[];
    try {
      const text = await response.text();
      console.log(`Received ${text.length} bytes from ${successPath}`);
      entries = JSON.parse(text) as SearchIndexEntry[];
      console.log(`Parsed ${entries.length} entries from search index`);
    } catch (e) {
      console.error('Error parsing search index JSON:', e);
      throw new Error(`Failed to parse search index JSON: ${e instanceof Error ? e.message : String(e)}`);
    }
    
    // Add each entry to the search index
    try {
      console.log(`Adding ${entries.length} entries to search index`);
      entries.forEach((entry, index) => {
        if (!entry.slug) {
          console.warn(`Entry at index ${index} has no slug, skipping`);
          return;
        }
        
        searchIndex!.add({
          slug: entry.slug,
          title: entry.title || '',
          description: entry.description || '',
          tags: entry.tags?.join(' ') || '',
          pubDate: entry.pubDate || '',
          content: entry.content || ''
        });
      });
      
      isIndexLoaded = true;
      console.log(`Search index loaded with ${entries.length} entries`);
      return true;
    } catch (e) {
      console.error('Error adding entries to search index:', e);
      throw new Error(`Failed to add entries to search index: ${e instanceof Error ? e.message : String(e)}`);
    }
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
  
  try {
    // Ensure search index is loaded
    const indexLoaded = await loadSearchIndex();
    if (!indexLoaded || !searchIndex) {
      console.error('Search index not loaded, cannot perform search');
      return [];
    }
    
    console.log(`Searching for: "${query}"`);
    
    // Perform search across all fields
    const results = await searchIndex.search(query);
    console.log(`Search returned ${results.length} field result sets`);
    
    // Flatten and deduplicate results
    const slugSet = new Set<string>();
    const searchResults: SearchResult[] = [];
    
    // Process results from all fields
    results.forEach((fieldResults, index) => {
      console.log(`Field ${index} returned ${fieldResults.result.length} results`);
      
      fieldResults.result.forEach((slug) => {
        const slugStr = String(slug); // Convert to string to handle both string and number IDs
        if (!slugSet.has(slugStr)) {
          slugSet.add(slugStr);
          
          try {
            // Get the full document from the store
            const doc = searchIndex!.get(slugStr) as any;
            
            if (doc) {
              const matchType = determineMatchType(doc, query);
              const contentSnippet = matchType === 'content' ? extractSnippet(doc.content, query) : undefined;
              
              searchResults.push({
                slug: doc.slug,
                title: doc.title || '',
                description: doc.description || '',
                tags: doc.tags ? doc.tags.split(' ').filter(Boolean) : [],
                pubDate: doc.pubDate || '',
                matchType,
                contentSnippet
              });
            } else {
              console.warn(`Document with slug ${slugStr} not found in store`);
            }
          } catch (e) {
            console.error(`Error processing search result for slug ${slugStr}:`, e);
          }
        }
      });
    });
    
    console.log(`Returning ${searchResults.length} deduplicated search results`);
    return searchResults;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error; // Rethrow to allow proper error handling in the UI
  }
}
