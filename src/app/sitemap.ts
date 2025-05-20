import { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/mdxUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://myblog.com'; // Replace with your actual domain
  
  // Get all posts
  const posts = await getAllPosts();
  const postUrls = posts.map((post) => {
  let lastModified: Date;
  if (post.pubDate && !isNaN(Date.parse(post.pubDate))) {
    lastModified = new Date(post.pubDate);
  } else {
    lastModified = new Date();
  }
  return {
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  };
});
  
  // Get all tags
  const tags = await getAllTags();
  const tagUrls = Object.keys(tags).map((tag) => ({
    url: `${baseUrl}/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));
  
  // Add static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];
  
  return [...staticPages, ...postUrls, ...tagUrls];
}
