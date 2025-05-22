import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SearchResult } from '@/lib/simpleSearch';

// Server-side search implementation
async function serverSearchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    // Read the search index directly from the file system
    const searchIndexPath = path.join(process.cwd(), 'public', 'search-index.json');
    const fileContents = fs.readFileSync(searchIndexPath, 'utf8');
    const searchIndex = JSON.parse(fileContents);

    if (!Array.isArray(searchIndex)) {
      throw new Error('Search index is not an array');
    }

    const results: SearchResult[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    for (const post of searchIndex) {
      // Skip posts without a title
      if (!post.title) continue;

      const searchableContent = [
        post.title?.toLowerCase() || '',
        post.description?.toLowerCase() || '',
        post.tags?.map((t: string) => t.toLowerCase()).join(' ') || '',
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
        } else if (post.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) {
          matchField = 'tag';
        }

        // Extract a snippet if the match is in the content
        let contentSnippet: string | undefined = undefined;
        if (matchField === 'content' && post.content) {
          const lowerContent = post.content.toLowerCase();
          const lowerQuery = query.toLowerCase();

          const index = lowerContent.indexOf(lowerQuery);
          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(post.content.length, index + query.length + 50);

            contentSnippet = post.content.substring(start, end);

            // Add ellipsis if we're not at the beginning or end
            if (start > 0) contentSnippet = '...' + contentSnippet;
            if (end < post.content.length) contentSnippet = contentSnippet + '...';
          }
        }

        // Create a result with a content snippet if available
        results.push({
          slug: post.slug,
          title: post.title,
          description: post.description || '',
          tags: post.tags,
          pubDate: post.pubDate || '',
          contentSnippet
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching posts on server:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const results = await serverSearchPosts(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
