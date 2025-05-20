import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdxUtils';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read all the latest blog posts',
};

const POSTS_PER_PAGE = 12;

export default async function BlogPage({ searchParams }: { searchParams?: { page?: string } }) {
  const posts = await getAllPosts();
  const page = parseInt(searchParams?.page || '1', 10);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">No blog posts found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <Link
            href={`/blog?page=${page - 1}`}
            className={`px-4 py-2 rounded border ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-disabled={page === 1}
          >
            Previous
          </Link>
          <span className="text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/blog?page=${page + 1}`}
            className={`px-4 py-2 rounded border ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-disabled={page === totalPages}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}

