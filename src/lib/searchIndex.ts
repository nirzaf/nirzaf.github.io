import fs from 'fs';
import path from 'path';
import { getAllPosts } from './mdxUtils';
import type { Post } from './mdxUtils';

export interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  pubDate: string;
  content: string;
}

/**
 * Generates a search index file during build time
 * This will be used for client-side search
 */
export async function generateSearchIndex() {
  try {
    const posts = await getAllPosts();
    
    // Create a simplified version of posts for the search index
    const searchIndex: SearchIndexEntry[] = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      tags: post.tags,
      pubDate: post.pubDate,
      content: post.content.slice(0, 5000) // Limit content size for performance
    }));

    // Create the public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the search index to a JSON file
    fs.writeFileSync(
      path.join(publicDir, 'search-index.json'),
      JSON.stringify(searchIndex)
    );

    console.log('Search index generated successfully');
  } catch (error) {
    console.error('Error generating search index:', error);
  }
}
