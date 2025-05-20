const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to convert various date formats to ISO format (YYYY-MM-DD)
function convertToISODate(dateStr) {
  // Handle non-string values
  if (typeof dateStr !== 'string') {
    // If it's a Date object or can be converted to one
    if (dateStr instanceof Date || (dateStr && dateStr.toString)) {
      const date = new Date(dateStr.toString());
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }
    }
    // Convert to string for further processing
    dateStr = String(dateStr);
  }

  // Remove quotes if present
  dateStr = dateStr.replace(/['"]/g, '').trim();

  // Try parsing as ISO format first (with or without time component)
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(dateStr)) {
    // Extract just the date part if there's a time component
    const datePart = dateStr.split('T')[0].split(' ')[0];
    const [year, month, day] = datePart.split('-').map(num => parseInt(num, 10));
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Handle month name formats
  const months = {
    'jan': 1, 'january': 1,
    'feb': 2, 'february': 2,
    'mar': 3, 'march': 3,
    'apr': 4, 'april': 4,
    'may': 5,
    'jun': 6, 'june': 6,
    'jul': 7, 'july': 7,
    'aug': 8, 'august': 8,
    'sep': 9, 'sept': 9, 'september': 9,
    'oct': 10, 'october': 10,
    'nov': 11, 'november': 11,
    'dec': 12, 'december': 12
  };

  // Try parsing month name formats
  const monthNameRegex = /^([a-zA-Z]+)\s+(\d{1,2})\s+(\d{4})$/i;
  const match = dateStr.match(monthNameRegex);

  if (match) {
    const monthName = match[1].toLowerCase();
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (months[monthName] && day >= 1 && day <= 31 && year >= 2000) {
      return `${year}-${months[monthName].toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }

  // If we can't parse it, try using Date object as a fallback
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  } catch (e) {
    console.error(`Failed to parse date: ${dateStr}`);
  }

  // Return the original if we can't parse it
  return dateStr;
}

// Function to process a single blog post file
function processBlogPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Check if pubDate exists and needs conversion
    if (data.pubDate) {
      const originalDate = data.pubDate;
      const isoDate = convertToISODate(originalDate);

      // Only update if the date format changed
      if (isoDate !== originalDate) {
        data.pubDate = isoDate;

        // Write the updated frontmatter and content back to the file
        const updatedFileContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedFileContent);

        console.log(`Updated date in ${path.basename(filePath)}: ${originalDate} -> ${isoDate}`);
        return true;
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

  console.log(`\nProcessed ${totalCount} blog posts, updated ${updatedCount} dates.`);
}

// Run the script
processAllBlogPosts();
