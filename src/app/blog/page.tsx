import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdxUtils';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read all the latest blog posts',
};

const POSTS_PER_PAGE = 12;

// Static generation for blog page
// Note: We'll handle pagination client-side instead of using searchParams

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  // For static export, we'll include all posts and handle pagination client-side
  const allPosts = posts;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

