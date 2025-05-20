const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to standardize tags format
function standardizeTags(tags) {
  if (!tags) return [];

  // If tags is already an array, ensure each tag is properly formatted
  if (Array.isArray(tags)) {
    return tags.map(tag => {
      // Convert to string if not already
      tag = String(tag).trim();
      // Capitalize first letter of each word
      return tag.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    });
  }

  // If tags is a string, split by commas and format each tag
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => {
      tag = tag.trim();
      // Capitalize first letter of each word
      return tag.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    });
  }

  return [];
}

// Function to process a single blog post file
function processBlogPost(filePath) {
  try {
    // Read the file content
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter to get the tags
    const { data } = matter(fileContent);

    // Check if tags exist
    if (data.tags) {
      const originalTags = data.tags;
      const standardizedTags = standardizeTags(originalTags);

      // Extract the frontmatter section
      const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
      const frontmatterMatch = fileContent.match(frontmatterRegex);

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];

        // Find the tags line in the frontmatter
        const tagsLineRegex = /tags:.*(\n|$)/;
        const tagsLineMatch = frontmatter.match(tagsLineRegex);

        if (tagsLineMatch) {
          // Format tags as ['Tag1', 'Tag2', 'Tag3']
          const tagsArray = standardizedTags.map(tag => `'${tag}'`);
          const newTagsLine = `tags: [${tagsArray.join(', ')}]\n`;

          // Create new frontmatter with updated tags
          const newFrontmatter = frontmatter.replace(tagsLineRegex, newTagsLine);

          // Replace the entire frontmatter section
          const updatedContent = fileContent.replace(frontmatterRegex, `---\n${newFrontmatter}\n---`);

          // Write the updated content back to the file
          fs.writeFileSync(filePath, updatedContent);

          console.log(`Updated tags in ${path.basename(filePath)}: ${JSON.stringify(originalTags)} -> ${JSON.stringify(standardizedTags)}`);
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function to process all blog posts
function processAllBlogPosts() {
  const postsDir = path.join(process.cwd(), 'data', 'posts');
  const files = fs.readdirSync(postsDir);

  let updatedCount = 0;
  let totalCount = 0;

  files.forEach(file => {
    if (file.endsWith('.mdx') || file.endsWith('.md')) {
      totalCount++;
      const filePath = path.join(postsDir, file);
      const updated = processBlogPost(filePath);
      if (updated) {
        updatedCount++;
      }
    }
  });

  console.log(`\nProcessed ${totalCount} blog posts, updated ${updatedCount} tag formats.`);
}

// Run the script
processAllBlogPosts();
