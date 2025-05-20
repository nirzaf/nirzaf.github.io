const fs = require('fs');
const path = require('path');

// Function to standardize tags format
function standardizeTags(tags) {
  if (!tags || tags.length === 0) return [];
  
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
    
    // Find the tags line in the frontmatter
    const tagsRegex = /tags:.*?(\n|$)/;
    const tagsMatch = fileContent.match(tagsRegex);
    
    if (tagsMatch) {
      const tagsLine = tagsMatch[0];
      
      // Extract tags from the line
      let tags = [];
      
      // Check if tags are in array format with square brackets
      const arrayTagsRegex = /tags:\s*\[(.*?)\]/;
      const arrayTagsMatch = tagsLine.match(arrayTagsRegex);
      
      if (arrayTagsMatch) {
        // Parse tags from array format
        const tagsString = arrayTagsMatch[1];
        tags = tagsString.split(',').map(tag => {
          // Remove quotes and trim
          return tag.replace(/['"]/g, '').trim();
        });
      } else {
        // Check if tags are in YAML list format with dashes
        const listTagsRegex = /tags:\s*\n(\s*-\s*.+\n)+/;
        const listTagsMatch = fileContent.match(listTagsRegex);
        
        if (listTagsMatch) {
          const listTagsString = listTagsMatch[0];
          // Extract tags from list format
          const tagLines = listTagsString.match(/\s*-\s*(.+)/g);
          if (tagLines) {
            tags = tagLines.map(line => {
              // Remove dash, quotes, and trim
              return line.replace(/\s*-\s*/, '').replace(/['"]/g, '').trim();
            });
          }
        }
      }
      
      // Standardize tags
      const standardizedTags = standardizeTags(tags);
      
      // Format tags as ['Tag1', 'Tag2', 'Tag3']
      const tagsArray = standardizedTags.map(tag => `'${tag}'`);
      const newTagsStr = `tags: [${tagsArray.join(', ')}]`;
      
      // Replace the tags line in the file
      const updatedContent = fileContent.replace(tagsRegex, `${newTagsStr}\n`);
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`Updated tags in ${path.basename(filePath)}: ${JSON.stringify(tags)} -> ${JSON.stringify(standardizedTags)}`);
      return true;
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
