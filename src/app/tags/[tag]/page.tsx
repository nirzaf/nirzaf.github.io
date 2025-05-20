import Link from 'next/link';
import { getPostsByTag, getAllTags } from '@/lib/mdxUtils';
import { PostCard } from '@/components/PostCard';


// @ts-expect-error: Next.js app directory route handler params are not typed
export async function generateMetadata({ params }) {
  return {
    title: `#${params.tag}`,
    description: `Blog posts tagged with #${params.tag}`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return Object.keys(tags).map((tag) => ({
    tag,
  }));
}

// @ts-expect-error: Next.js app directory route handler params are not typed
export default async function TagPage({ params }) {
  const { tag } = params;
  const posts = await getPostsByTag(tag);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/tags" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← All Tags
        </Link>
        <h1 className="text-3xl font-bold mt-4">
          Posts tagged with <span className="text-blue-600 dark:text-blue-400">#{tag}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} highlightTag={tag} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">No posts found with this tag.</p>
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
