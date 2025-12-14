/**
 * Data access service layer for posts using D1 database
 * This replaces the file system-based mdxUtils functions
 */

import { eq, desc, like, sql, and } from 'drizzle-orm';
import { getDb } from '@/db';
import { posts, tags, postsTags, type Post as DbPost } from '@/db/schema';

// Interface matching the existing Post type from mdxUtils
export interface Post {
    slug: string;
    title: string;
    pubDate: string;
    description: string;
    image?: string;
    tags?: string[];
    readingTime: string;
    content: string;
    contentPreview?: string;
    draft?: boolean;
    sortDate?: number;
}

/**
 * Get D1 database instance from Cloudflare binding
 * This will be called with the D1 binding from the request context
 */
function getDatabase() {
    // In Cloudflare Workers/Pages, this will come from the request context
    // For now, we'll need to pass it as a parameter
    throw new Error('Database must be provided from request context');
}

/**
 * Get all published posts with their tags
 */
export async function getAllPosts(db: ReturnType<typeof getDb>): Promise<Post[]> {
    try {
        // Query all published posts with their tags
        const postsWithTags = await db
            .select({
                post: posts,
                tag: tags.name,
            })
            .from(posts)
            .leftJoin(postsTags, eq(posts.id, postsTags.postId))
            .leftJoin(tags, eq(postsTags.tagId, tags.id))
            .where(eq(posts.published, true))
            .orderBy(desc(posts.pubDate), desc(posts.title));

        // Group posts with their tags
        const postsMap = new Map<number, Post>();

        for (const row of postsWithTags) {
            const postId = row.post.id;

            if (!postsMap.has(postId)) {
                // Create content preview (first 600 chars)
                const contentPreview = row.post.content
                    .replace(/---[\s\S]*?---/, '') // Remove frontmatter
                    .replace(/import.*?;/g, '') // Remove imports
                    .replace(/<div.*?>[\s\S]*?<\/div>/g, '') // Remove div blocks
                    .replace(/<Image.*?\/?>|<img.*?\/?>/g, '[image]') // Replace images
                    .trim()
                    .split('\n\n')
                    .slice(0, 3)
                    .join('\n\n')
                    .slice(0, 600);

                postsMap.set(postId, {
                    slug: row.post.slug,
                    title: row.post.title,
                    pubDate: row.post.pubDate,
                    description: row.post.description || '',
                    image: row.post.coverImageUrl || undefined,
                    tags: [],
                    readingTime: row.post.readingTime || '5',
                    content: '', // Don't include full content in list view
                    contentPreview,
                    draft: !row.post.published,
                    sortDate: new Date(row.post.pubDate).getTime(),
                });
            }

            // Add tag to post
            if (row.tag) {
                postsMap.get(postId)!.tags!.push(row.tag);
            }
        }

        return Array.from(postsMap.values());
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

/**
 * Get a single post by slug with full content
 */
export async function getPostBySlug(
    db: ReturnType<typeof getDb>,
    slug: string
): Promise<Post | null> {
    try {
        // Query post with tags
        const postsWithTags = await db
            .select({
                post: posts,
                tag: tags.name,
            })
            .from(posts)
            .leftJoin(postsTags, eq(posts.id, postsTags.postId))
            .leftJoin(tags, eq(postsTags.tagId, tags.id))
            .where(eq(posts.slug, slug));

        if (postsWithTags.length === 0) {
            return null;
        }

        const firstRow = postsWithTags[0];
        const postTags = postsWithTags
            .map(row => row.tag)
            .filter((tag): tag is string => tag !== null);

        // Create content preview
        const contentPreview = firstRow.post.content
            .replace(/---[\s\S]*?---/, '')
            .replace(/import.*?;/g, '')
            .replace(/<div.*?>[\s\S]*?<\/div>/g, '')
            .replace(/<Image.*?\/?>|<img.*?\/?>/g, '[image]')
            .trim()
            .split('\n\n')
            .slice(0, 3)
            .join('\n\n')
            .slice(0, 600);

        return {
            slug: firstRow.post.slug,
            title: firstRow.post.title,
            pubDate: firstRow.post.pubDate,
            description: firstRow.post.description || '',
            image: firstRow.post.coverImageUrl || undefined,
            tags: postTags,
            readingTime: firstRow.post.readingTime || '5',
            content: firstRow.post.content, // Full content for detail view
            contentPreview,
            draft: !firstRow.post.published,
        };
    } catch (error) {
        console.error(`Error fetching post ${slug}:`, error);
        return null;
    }
}

/**
 * Get all tags with post counts
 */
export async function getAllTags(
    db: ReturnType<typeof getDb>
): Promise<Record<string, number>> {
    try {
        const tagCounts = await db
            .select({
                name: tags.name,
                count: sql<number>`count(${postsTags.postId})`,
            })
            .from(tags)
            .leftJoin(postsTags, eq(tags.id, postsTags.tagId))
            .leftJoin(posts, and(eq(postsTags.postId, posts.id), eq(posts.published, true)))
            .groupBy(tags.name);

        const result: Record<string, number> = {};
        for (const tag of tagCounts) {
            result[tag.name] = tag.count;
        }

        return result;
    } catch (error) {
        console.error('Error fetching tags:', error);
        return {};
    }
}

/**
 * Get posts filtered by tag
 */
export async function getPostsByTag(
    db: ReturnType<typeof getDb>,
    tagName: string
): Promise<Post[]> {
    try {
        const postsWithTags = await db
            .select({
                post: posts,
                tag: tags.name,
            })
            .from(posts)
            .innerJoin(postsTags, eq(posts.id, postsTags.postId))
            .innerJoin(tags, eq(postsTags.tagId, tags.id))
            .where(and(eq(tags.name, tagName), eq(posts.published, true)))
            .orderBy(desc(posts.pubDate));

        // Group posts with all their tags
        const postsMap = new Map<number, Post>();

        for (const row of postsWithTags) {
            const postId = row.post.id;

            if (!postsMap.has(postId)) {
                const contentPreview = row.post.content
                    .replace(/---[\s\S]*?---/, '')
                    .replace(/import.*?;/g, '')
                    .replace(/<div.*?>[\s\S]*?<\/div>/g, '')
                    .replace(/<Image.*?\/?>|<img.*?\/?>/g, '[image]')
                    .trim()
                    .split('\n\n')
                    .slice(0, 3)
                    .join('\n\n')
                    .slice(0, 600);

                postsMap.set(postId, {
                    slug: row.post.slug,
                    title: row.post.title,
                    pubDate: row.post.pubDate,
                    description: row.post.description || '',
                    image: row.post.coverImageUrl || undefined,
                    tags: [],
                    readingTime: row.post.readingTime || '5',
                    content: '',
                    contentPreview,
                    draft: !row.post.published,
                });
            }

            if (row.tag) {
                postsMap.get(postId)!.tags!.push(row.tag);
            }
        }

        return Array.from(postsMap.values());
    } catch (error) {
        console.error(`Error fetching posts for tag ${tagName}:`, error);
        return [];
    }
}

/**
 * Search posts by query (title, description, content)
 */
export async function searchPosts(
    db: ReturnType<typeof getDb>,
    query: string
): Promise<Post[]> {
    try {
        const searchTerm = `%${query}%`;

        const postsWithTags = await db
            .select({
                post: posts,
                tag: tags.name,
            })
            .from(posts)
            .leftJoin(postsTags, eq(posts.id, postsTags.postId))
            .leftJoin(tags, eq(postsTags.tagId, tags.id))
            .where(
                and(
                    eq(posts.published, true),
                    sql`(
            ${posts.title} LIKE ${searchTerm} OR
            ${posts.description} LIKE ${searchTerm} OR
            ${posts.content} LIKE ${searchTerm}
          )`
                )
            )
            .orderBy(desc(posts.pubDate));

        // Group posts with their tags
        const postsMap = new Map<number, Post>();

        for (const row of postsWithTags) {
            const postId = row.post.id;

            if (!postsMap.has(postId)) {
                const contentPreview = row.post.content
                    .replace(/---[\s\S]*?---/, '')
                    .replace(/import.*?;/g, '')
                    .replace(/<div.*?>[\s\S]*?<\/div>/g, '')
                    .replace(/<Image.*?\/?>|<img.*?\/?>/g, '[image]')
                    .trim()
                    .split('\n\n')
                    .slice(0, 3)
                    .join('\n\n')
                    .slice(0, 600);

                postsMap.set(postId, {
                    slug: row.post.slug,
                    title: row.post.title,
                    pubDate: row.post.pubDate,
                    description: row.post.description || '',
                    image: row.post.coverImageUrl || undefined,
                    tags: [],
                    readingTime: row.post.readingTime || '5',
                    content: '',
                    contentPreview,
                    draft: !row.post.published,
                });
            }

            if (row.tag) {
                postsMap.get(postId)!.tags!.push(row.tag);
            }
        }

        return Array.from(postsMap.values());
    } catch (error) {
        console.error(`Error searching posts for "${query}":`, error);
        return [];
    }
}
