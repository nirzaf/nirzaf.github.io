import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/mdxUtils';

// Format date for consistent display
function formatDate(pubDateStr: string): string {
  try {
    const date = new Date(pubDateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return pubDateStr; // Return original string if parsing fails
  } catch (error) {
    return pubDateStr; // Return original string if any error occurs
  }
}

interface PostCardProps {
  post: Post;
  highlightTag?: string;
}

export function PostCard({ post, highlightTag }: PostCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {post.image && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{formatDate(post.pubDate)}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className={`text-xs px-2 py-1 rounded-full ${tag === highlightTag
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
