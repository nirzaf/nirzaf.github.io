import { getAllPosts, getPostBySlug } from './mdxUtils';

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  pubDate: string;
  matchType?: 'title' | 'description' | 'tag' | 'content';
  contentSnippet?: string;
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  const posts = await getAllPosts();
  const results: SearchResult[] = [];

  for (const post of posts) {
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

    // If no match in metadata, check the full content
    const fullPost = await getPostBySlug(post.slug);
    if (fullPost && fullPost.content.toLowerCase().includes(queryLower)) {
      // Extract a snippet of the content around the match
      const contentLower = fullPost.content.toLowerCase();
      const matchIndex = contentLower.indexOf(queryLower);
      let contentSnippet = '';
      
      if (matchIndex >= 0) {
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(contentLower.length, matchIndex + queryLower.length + 100);
        contentSnippet = '...' + fullPost.content.slice(start, end).replace(/\n/g, ' ').trim() + '...';
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
