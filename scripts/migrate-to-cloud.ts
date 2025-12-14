#!/usr/bin/env bun
/**
 * Migration script to transfer MDX content to D1 database and images to R2
 * Run with: bun run scripts/migrate-to-cloud.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import readingTime from 'reading-time';

// Configuration from environment
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'cms-assets';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;

// Validate environment variables
if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL || !CLOUDFLARE_ACCOUNT_ID) {
    console.error('❌ Missing required environment variables!');
    console.error('Please ensure the following are set in .env.local:');
    console.error('- R2_ACCESS_KEY_ID');
    console.error('- R2_SECRET_ACCESS_KEY');
    console.error('- R2_PUBLIC_URL');
    console.error('- CLOUDFLARE_ACCOUNT_ID');
    process.exit(1);
}

// Initialize R2 client
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

const postsDirectory = path.join(process.cwd(), 'data/posts');
const imagesDirectory = path.join(process.cwd(), 'public/images');

interface MigratedPost {
    slug: string;
    title: string;
    description: string;
    content: string;
    coverImageUrl: string;
    pubDate: string;
    readingTime: string;
    tags: string[];
    published: boolean;
}

/**
 * Upload image to R2 and return public URL
 */
async function uploadImageToR2(localPath: string, fileName: string): Promise<string> {
    try {
        const fileBuffer = fs.readFileSync(localPath);
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: `images/${fileName}`,
            Body: fileBuffer,
            ContentType: getContentType(fileName),
        });

        await r2Client.send(command);
        const publicUrl = `${R2_PUBLIC_URL}/images/${fileName}`;
        console.log(`  ✓ Uploaded image: ${fileName} → ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error(`  ✗ Failed to upload ${fileName}:`, error);
        throw error;
    }
}

/**
 * Get content type based on file extension
 */
function getContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
    };
    return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Process content and replace local image paths with R2 URLs
 */
async function processContent(content: string, slug: string): Promise<string> {
    // Find all markdown images: ![alt](path)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let processedContent = content;
    const matches = [...content.matchAll(imageRegex)];

    for (const match of matches) {
        const [fullMatch, alt, imagePath] = match;

        // Only process local images (starting with / or relative path)
        if (imagePath.startsWith('/images/') || imagePath.startsWith('images/')) {
            const fileName = path.basename(imagePath);
            const localPath = path.join(imagesDirectory, fileName);

            if (fs.existsSync(localPath)) {
                try {
                    const r2Url = await uploadImageToR2(localPath, fileName);
                    processedContent = processedContent.replace(fullMatch, `![${alt}](${r2Url})`);
                } catch (error) {
                    console.warn(`  ⚠ Keeping original path for ${fileName} due to upload error`);
                }
            } else {
                console.warn(`  ⚠ Image not found: ${localPath}`);
            }
        }
    }

    return processedContent;
}

/**
 * Process cover image from frontmatter
 */
async function processCoverImage(coverImage: string): Promise<string> {
    // If it's already an external URL, return as-is
    if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
        return coverImage;
    }

    // If it's a local image
    if (coverImage.startsWith('/images/') || coverImage.startsWith('images/')) {
        const fileName = path.basename(coverImage);
        const localPath = path.join(imagesDirectory, fileName);

        if (fs.existsSync(localPath)) {
            try {
                return await uploadImageToR2(localPath, fileName);
            } catch (error) {
                console.warn(`  ⚠ Keeping original cover image path due to upload error`);
                return coverImage;
            }
        }
    }

    return coverImage;
}

/**
 * Migrate all MDX posts
 */
async function migratePosts(): Promise<MigratedPost[]> {
    const fileNames = fs.readdirSync(postsDirectory);
    const mdxFiles = fileNames.filter(fileName => fileName.endsWith('.mdx'));

    console.log(`\n📚 Found ${mdxFiles.length} MDX files to migrate\n`);

    const migratedPosts: MigratedPost[] = [];

    for (const fileName of mdxFiles) {
        const slug = fileName.replace(/\.mdx$/, '');
        console.log(`Processing: ${slug}`);

        try {
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // Process content and images
            const processedContent = await processContent(content, slug);

            // Process cover image if exists
            let coverImageUrl = data.image || '';
            if (coverImageUrl) {
                coverImageUrl = await processCoverImage(coverImageUrl);
            }

            // Calculate reading time
            const readingTimeResult = readingTime(content);

            // Create migrated post object
            const migratedPost: MigratedPost = {
                slug,
                title: data.title || slug,
                description: data.description || '',
                content: processedContent,
                coverImageUrl,
                pubDate: data.pubDate || data.date || new Date().toISOString(),
                readingTime: Math.ceil(readingTimeResult.minutes).toString(),
                tags: data.tags || [],
                published: data.draft !== true,
            };

            migratedPosts.push(migratedPost);
            console.log(`  ✓ Migrated: ${slug}\n`);
        } catch (error) {
            console.error(`  ✗ Failed to migrate ${slug}:`, error);
        }
    }

    return migratedPosts;
}

/**
 * Save migrated data to JSON file for manual D1 import
 */
function saveMigratedData(posts: MigratedPost[]) {
    const outputPath = path.join(process.cwd(), 'migrated-posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    console.log(`\n✅ Migrated data saved to: ${outputPath}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Review the migrated data in migrated-posts.json`);
    console.log(`2. Use Wrangler or Drizzle to insert this data into D1`);
    console.log(`3. Run: bunx wrangler d1 execute cms-db --local --file=insert-posts.sql`);
}

/**
 * Generate SQL insert statements
 */
function generateInsertSQL(posts: MigratedPost[]): string {
    let sql = '-- Generated SQL for D1 import\n\n';

    // Collect unique tags
    const allTags = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => allTags.add(tag)));

    // Insert tags
    sql += '-- Insert tags\n';
    allTags.forEach(tag => {
        sql += `INSERT OR IGNORE INTO tags (name) VALUES ('${tag.replace(/'/g, "''")}');\n`;
    });

    sql += '\n-- Insert posts\n';
    posts.forEach((post, index) => {
        const escapedTitle = post.title.replace(/'/g, "''");
        const escapedDescription = post.description.replace(/'/g, "''");
        const escapedContent = post.content.replace(/'/g, "''");
        const escapedCoverImage = post.coverImageUrl.replace(/'/g, "''");

        sql += `INSERT INTO posts (slug, title, description, content, cover_image_url, published, pub_date, reading_time) VALUES (\n`;
        sql += `  '${post.slug}',\n`;
        sql += `  '${escapedTitle}',\n`;
        sql += `  '${escapedDescription}',\n`;
        sql += `  '${escapedContent}',\n`;
        sql += `  '${escapedCoverImage}',\n`;
        sql += `  ${post.published ? 1 : 0},\n`;
        sql += `  '${post.pubDate}',\n`;
        sql += `  '${post.readingTime}'\n`;
        sql += `);\n\n`;

        // Insert post-tag relationships
        if (post.tags.length > 0) {
            post.tags.forEach(tag => {
                sql += `INSERT INTO posts_tags (post_id, tag_id) VALUES (\n`;
                sql += `  (SELECT id FROM posts WHERE slug = '${post.slug}'),\n`;
                sql += `  (SELECT id FROM tags WHERE name = '${tag.replace(/'/g, "''")}')\n`;
                sql += `);\n`;
            });
            sql += '\n';
        }
    });

    return sql;
}

/**
 * Main migration function
 */
async function main() {
    console.log('🚀 Starting migration to Cloudflare...\n');
    console.log('Configuration:');
    console.log(`  R2 Bucket: ${R2_BUCKET_NAME}`);
    console.log(`  R2 Public URL: ${R2_PUBLIC_URL}`);
    console.log(`  Account ID: ${CLOUDFLARE_ACCOUNT_ID}\n`);

    try {
        // Migrate posts
        const migratedPosts = await migratePosts();

        // Save to JSON
        saveMigratedData(migratedPosts);

        // Generate SQL
        const sql = generateInsertSQL(migratedPosts);
        const sqlPath = path.join(process.cwd(), 'insert-posts.sql');
        fs.writeFileSync(sqlPath, sql);
        console.log(`✅ SQL file generated: ${sqlPath}`);

        console.log(`\n🎉 Migration complete!`);
        console.log(`   Migrated ${migratedPosts.length} posts`);
        console.log(`\n📋 To import into D1:`);
        console.log(`   bunx wrangler d1 execute cms-db --local --file=insert-posts.sql`);
        console.log(`   bunx wrangler d1 execute cms-db --remote --file=insert-posts.sql`);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
main();
