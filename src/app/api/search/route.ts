import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug } from '@/lib/mdxUtils';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Force dynamic rendering for search API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const posts = await getAllPosts();
    const searchResults = [];
    const queryLower = query.toLowerCase();

    for (const post of posts) {
      // Check title, description, and tags first (fast checks)
      const titleMatch = post.title.toLowerCase().includes(queryLower);
      const descriptionMatch = post.description.toLowerCase().includes(queryLower);
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(queryLower));

      if (titleMatch || descriptionMatch || tagMatch) {
        searchResults.push({
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

        searchResults.push({
          slug: post.slug,
          title: post.title,
          description: contentSnippet || post.description, // Use content snippet if available
          tags: post.tags,
          pubDate: post.pubDate,
          matchType: 'content'
        });
      }
    }

    // Sort results by relevance (title matches first, then description, then content)
    const relevanceScore = (result: any) => {
      if (result.matchType === 'title') return 3;
      if (result.matchType === 'description') return 2;
      if (result.matchType === 'tag') return 1.5;
      return 1; // content match
    };

    searchResults.sort((a, b) => relevanceScore(b) - relevanceScore(a));

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
