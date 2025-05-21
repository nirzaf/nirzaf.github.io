import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/mdxUtils';
import { BlogContent } from '@/components/BlogContent';
import { PostCard } from '@/components/PostCard';
import { JsonLd } from '@/components/JsonLd';

// Simple shuffle utility for randomizing arrays
function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}


// @ts-expect-error: Next.js app directory route handler params are not typed
export async function generateMetadata({ params }) {
  // Ensure params is properly awaited
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Create a URL-friendly version of tags for keywords
  const keywords = post.tags ? [...post.tags, '.NET', 'Programming', 'Software Development'] : ['.NET', 'Programming', 'Software Development'];
  
  // Format the publication date properly if it exists
  const pubDate = post.pubDate ? new Date(post.pubDate).toISOString() : undefined;
  
  // Determine the image URL - use the post's image or a default
  const imageUrl = post.image 
    ? `https://dotnetevangelist.net${post.image}` 
    : 'https://dotnetevangelist.net/images/default-post-image.jpg';

  return {
    title: post.title,
    description: post.description,
    keywords: keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: pubDate,
      authors: ['.NET Evangelist'],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      url: `https://dotnetevangelist.net/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://dotnetevangelist.net/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const slugs = posts.map((post) => post.slug);
  slugs.forEach(slug => {
  const codes = Array.from(slug).map(c => (c as string).charCodeAt(0)).join(',');
  console.log(`[generateStaticParams] Slug: '${slug}' | CharCodes: [${codes}]`);
});
console.log('[generateStaticParams] Slugs:', slugs);
  return slugs.map((slug) => ({ slug }));
}

// @ts-expect-error: Next.js app directory route handler params are not typed
export default async function BlogPostPage({ params }) {
  // Ensure params is properly awaited
  const { slug } = await params;
  const codes = Array.from(slug).map(c => (c as string).charCodeAt(0)).join(',');
  console.log(`[BlogPostPage] Received slug: '${slug}' | CharCodes: [${codes}]`);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch all posts for related/random suggestions
  const allPosts = await getAllPosts();
  // Find related posts by tag, excluding the current post
  const related = allPosts
    .filter(p => p.slug !== slug && p.tags?.some(tag => post.tags?.includes(tag)))
    .slice(0, 2);
  let relatedPosts = related;
  if (relatedPosts.length < 2) {
    // Fill with random posts (excluding current and already included)
    const others = allPosts.filter(
      p => p.slug !== slug && !relatedPosts.some(rp => rp.slug === p.slug)
    );
    relatedPosts = [...relatedPosts, ...shuffle(others).slice(0, 2 - relatedPosts.length)];
  }

  // Create structured data for search engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: '.NET Evangelist',
    },
    publisher: {
      '@type': 'Organization',
      name: '.NET Evangelist Tech Blogs',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dotnetevangelist.net/images/logo.png',
      },
    },
    datePublished: post.pubDate || new Date().toISOString(),
    dateModified: post.pubDate || new Date().toISOString(),
    image: post.image ? `https://dotnetevangelist.net${post.image}` : 'https://dotnetevangelist.net/images/default-post-image.jpg',
    url: `https://dotnetevangelist.net/blog/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dotnetevangelist.net/blog/${slug}`,
    },
    keywords: post.tags?.join(', ') || '',
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <JsonLd data={structuredData} />
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{post.pubDate}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.description && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {post.description}
          </p>
        )}

        {post.image && (
          <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      <BlogContent content={post.content} />

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Share this post</h2>
        <div className="flex space-x-4">
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dotnetevangelist.com'}/blog/${post.slug}`)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            Twitter
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dotnetevangelist.com'}/blog/${post.slug}`)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded flex items-center"
          >
            Facebook
          </a>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dotnetevangelist.com'}/blog/${post.slug}`)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedPosts.map((related) => (
            <PostCard key={related.slug} post={related} />
          ))}
        </div>
      </div>
    </article>
  );
}
