/**
 * Search API Route
 * D1 SQL-based search replacing static JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { getD1Database } from '@/lib/cloudflare';
import { searchPosts } from '@/lib/services/posts';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const db = getD1Database();
    const results = await searchPosts(db, query);

    // Transform results for frontend
    const searchResults = results.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      pubDate: post.pubDate,
      tags: post.tags,
      image: post.image,
    }));

    return NextResponse.json({ results: searchResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
