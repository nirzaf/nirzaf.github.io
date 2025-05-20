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

// Function to fetch the search index from the static JSON file
async function fetchSearchIndex(): Promise<SearchIndexEntry[]> {
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
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching search index:', error);
    return [];
  }
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  const searchIndex = await fetchSearchIndex();
  const results: SearchResult[] = [];

  for (const post of searchIndex) {
    // Check title, description, and tags first (fast checks)
    const titleMatch = post.title.toLowerCase().includes(queryLower);
    const descriptionMatch = post.description.toLowerCase().includes(queryLower);
    const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(queryLower));

    if (titleMatch || descriptionMatch || tagMatch) {
      results.push({
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        pubDate: post.pubDate,
        matchType: titleMatch ? 'title' : descriptionMatch ? 'description' : 'tag'
      });
      continue;
    }

    // If no match in metadata, check the content
    if (post.content && post.content.toLowerCase().includes(queryLower)) {
      // Extract a snippet of the content around the match
      const contentLower = post.content.toLowerCase();
      const matchIndex = contentLower.indexOf(queryLower);
      let contentSnippet = '';
      
      if (matchIndex >= 0) {
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(contentLower.length, matchIndex + queryLower.length + 100);
        contentSnippet = '...' + post.content.slice(start, end).replace(/\n/g, ' ').trim() + '...';
      }

      results.push({
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        pubDate: post.pubDate,
        matchType: 'content',
        contentSnippet
      });
    }
  }

  return results;
}
