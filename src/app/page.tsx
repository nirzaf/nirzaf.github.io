import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdxUtils';
import { PostCard } from '@/components/PostCard';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { HeaderSearch } from '@/components/HeaderSearch';

export const metadata: Metadata = {
  title: '.NET Evangelist',
  description: 'Exploring modern software development with .NET, web technologies, and cloud solutions',
};

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 7); // Get the 7 most recent posts
  const featuredPost = recentPosts[0]; // The most recent post as featured

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          .NET Evangelist Tech Blogs
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400 leading-relaxed max-w-3xl mx-auto">
          Exploring modern software development with .NET, web technologies, and cloud solutions
        </h2>
        {/* Mobile logo and search input - only visible on mobile */}
        <div className="md:hidden mx-auto max-w-md px-4 mb-6">
          <HeaderSearch />
        </div>
      </div>

      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              {featuredPost.image && (
                <div className="md:w-2/5 h-64 md:h-auto relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 md:w-3/5 md:max-h-[500px] overflow-y-auto">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{featuredPost.pubDate}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredPost.readingTime} min read</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {featuredPost.title}
                  </Link>
                </h3>
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                    {featuredPost.description}
                  </p>
                  <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-6 overflow-hidden">
                    <MarkdownPreview content={featuredPost.contentPreview || ''} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All Posts →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.length > 1 ? (
            // Skip the first post (featured) and show the next 8
            recentPosts.slice(1).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No blog posts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
