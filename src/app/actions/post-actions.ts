'use server';

/**
 * Server Actions for Post Management
 * CRUD operations with D1 database and R2 storage
 */

import { revalidatePath } from 'next/cache';
import { getD1Database, CloudflareEnv } from '@/lib/cloudflare';
import { posts, tags, postsTags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Create a new post
 */
export async function createPost(formData: FormData) {
    const db = getD1Database();

    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const coverImageUrl = formData.get('coverImageUrl') as string;
    const published = formData.get('published') === 'true';
    const pubDate = formData.get('pubDate') as string || new Date().toISOString().split('T')[0];
    const tagsInput = formData.get('tags') as string;

    // Validate required fields
    if (!slug || !title || !content) {
        throw new Error('Slug, title, and content are required');
    }

    // Insert post
    const [newPost] = await db
        .insert(posts)
        .values({
            slug,
            title,
            description: description || '',
            content,
            coverImageUrl: coverImageUrl || '',
            published,
            pubDate,
            readingTime: Math.ceil(content.split(/\s+/).length / 200).toString(),
        })
        .returning();

    // Handle tags
    if (tagsInput) {
        const tagNames = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

        for (const tagName of tagNames) {
            // Insert or get existing tag
            await db
                .insert(tags)
                .values({ name: tagName })
                .onConflictDoNothing();

            const [tag] = await db
                .select()
                .from(tags)
                .where(eq(tags.name, tagName));

            if (tag) {
                await db
                    .insert(postsTags)
                    .values({ postId: newPost.id, tagId: tag.id })
                    .onConflictDoNothing();
            }
        }
    }

    revalidatePath('/blog');
    revalidatePath('/admin/posts');

    return { success: true, postId: newPost.id };
}

/**
 * Update an existing post
 */
export async function updatePost(postId: number, formData: FormData) {
    const db = getD1Database();

    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const coverImageUrl = formData.get('coverImageUrl') as string;
    const published = formData.get('published') === 'true';
    const pubDate = formData.get('pubDate') as string;
    const tagsInput = formData.get('tags') as string;

    // Validate required fields
    if (!slug || !title || !content) {
        throw new Error('Slug, title, and content are required');
    }

    // Update post
    await db
        .update(posts)
        .set({
            slug,
            title,
            description: description || '',
            content,
            coverImageUrl: coverImageUrl || '',
            published,
            pubDate,
            readingTime: Math.ceil(content.split(/\s+/).length / 200).toString(),
            updatedAt: new Date(),
        })
        .where(eq(posts.id, postId));

    // Clear existing tags and add new ones
    await db
        .delete(postsTags)
        .where(eq(postsTags.postId, postId));

    if (tagsInput) {
        const tagNames = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

        for (const tagName of tagNames) {
            await db
                .insert(tags)
                .values({ name: tagName })
                .onConflictDoNothing();

            const [tag] = await db
                .select()
                .from(tags)
                .where(eq(tags.name, tagName));

            if (tag) {
                await db
                    .insert(postsTags)
                    .values({ postId, tagId: tag.id })
                    .onConflictDoNothing();
            }
        }
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/posts');
    revalidatePath(`/admin/posts/${postId}/edit`);

    return { success: true };
}

/**
 * Delete a post
 */
export async function deletePost(postId: number) {
    const db = getD1Database();

    // Get post slug for revalidation
    const [post] = await db
        .select({ slug: posts.slug })
        .from(posts)
        .where(eq(posts.id, postId));

    // Delete post (cascade will handle posts_tags)
    await db
        .delete(posts)
        .where(eq(posts.id, postId));

    revalidatePath('/blog');
    if (post) {
        revalidatePath(`/blog/${post.slug}`);
    }
    revalidatePath('/admin/posts');

    return { success: true };
}

/**
 * Upload image to R2
 */
export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file provided');
    }

    const { env } = getRequestContext() as unknown as { env: CloudflareEnv };

    // Check if R2 binding exists
    if (!env.R2) {
        throw new Error('R2 binding not found in environment');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `uploads/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to R2 using native binding
    const arrayBuffer = await file.arrayBuffer();
    await env.R2.put(fileName, arrayBuffer, {
        httpMetadata: {
            contentType: file.type,
        },
    });

    // Construct public URL
    // Use configured R2_PUBLIC_URL or fallback to a relative path if serving from same domain (though usually R2 needs a domain)
    const publicUrlBase = process.env.R2_PUBLIC_URL || 'https://pub-r2.dotnetevangelist.net'; // Fallback or env var
    const publicUrl = `${publicUrlBase}/${fileName}`;

    return { success: true, url: publicUrl };
}
