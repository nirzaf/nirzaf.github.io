// ESM script to generate search index for static site
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsDirectory = path.join(__dirname, '../data/posts');
const outputPath = path.join(__dirname, '../public/search-index.json');

// Make sure the public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory: ${publicDir}`);
}

/**
 * Generate a search index from all MDX files
 */
async function generateSearchIndex() {
  console.log('Generating search index...');
  console.log(`Posts directory: ${postsDirectory}`);
  console.log(`Output path: ${outputPath}`);
  
  // Create the posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    console.log('Posts directory not found, creating...');
    fs.mkdirSync(postsDirectory, { recursive: true });
    console.log('No posts to index');
    // Write an empty array as the search index
    fs.writeFileSync(outputPath, JSON.stringify([]));
    console.log('Created empty search index');
    return;
  }

  // Get all MDX files from the posts directory
  const mdxFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));
  console.log(`Found ${mdxFiles.length} MDX files`);

  // Map each file to a search index entry
  const searchIndex = [];
  
  for (const fileName of mdxFiles) {
    try {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Skip files without required frontmatter
      if (!data.title) {
        console.log(`Skipping ${fileName}: Missing title in frontmatter`);
        continue;
      }
      
      // Debug log
      console.log(`Processing: ${fileName} - "${data.title}"`);
      
      const entry = {
        slug,
        title: data.title || '',
        description: data.description || '',
        tags: data.tags || [],
        pubDate: data.pubDate || '',
        content: content
          .replace(/import.*?from.*?;/g, '') // Remove import statements
          .replace(/export.*?;/g, '') // Remove export statements
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\n/g, ' ') // Replace newlines with spaces
          .slice(0, 5000) // Limit content size for performance
      };
      
      searchIndex.push(entry);
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error);
    }
  }

  console.log(`\nPreparing to write ${searchIndex.length} entries to search index`);
  
  // Debug: List all posts being indexed
  searchIndex.forEach((post, index) => {
    console.log(`${index + 1}. ${post.slug} - "${post.title}"`);
  });

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write the search index to a JSON file
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex));
  console.log(`Search index with ${searchIndex.length} entries written to ${outputPath}`);
  
  // Log the first few entries for debugging
  if (searchIndex.length > 0) {
    console.log('First search index entry sample:');
    console.log(JSON.stringify(searchIndex[0], null, 2).substring(0, 300) + '...');
  }
}

// Run the function
generateSearchIndex().catch(err => {
  console.error('Error generating search index:', err);
  process.exit(1);
});
