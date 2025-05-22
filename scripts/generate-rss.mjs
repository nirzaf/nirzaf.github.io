import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Function to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const siteUrl = 'https://dotnetevangelist.net';
const siteTitle = '.NET Evangelist';
const siteDescription = 'A blog about .NET, programming, and software development.';

async function generateRssFeed() {
  const postsDirectory = path.join(process.cwd(), 'data/posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug: filename.replace(/\.mdx?$/, ''),
        frontmatter: data,
        content,
      };
    })
    .sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate));

  const feedItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      // Convert Markdown content to HTML for the description
      const htmlContent = marked(post.content);
      return `
        <item>
          <title>${escapeXml(post.frontmatter.title)}</title>
          <link>${escapeXml(postUrl)}</link>
          <guid>${escapeXml(postUrl)}</guid>
          <pubDate>${new Date(post.frontmatter.pubDate).toUTCString()}</pubDate>
          <description><![CDATA[${escapeXml(post.frontmatter.description || post.content)}]]></description>
        </item>
      `;
    })
    .join('');

  const rssFeed = `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(siteTitle)}</title>
        <link>${escapeXml(siteUrl)}</link>
        <description>${escapeXml(siteDescription)}</description>
        <language>en-us</language>
        <lastBuildDate>${new Date(posts[0].frontmatter.pubDate).toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${feedItems}
      </channel>
    </rss>
  `;

  fs.writeFileSync(path.join(process.cwd(), 'public/rss.xml'), rssFeed.trim());
  console.log('RSS feed generated successfully at public/rss.xml');
}

generateRssFeed();
