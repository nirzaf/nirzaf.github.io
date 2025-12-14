'use server';

/**
 * Server Actions for Post Management
 * CRUD operations with D1 database and R2 storage
 */

import { revalidatePath } from 'next/cache';
import { getD1Database } from '@/lib/cloudflare';
import { posts, tags, postsTags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

    const { env } = getRequestContext();
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || 'cms-assets';
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    if (!accountId || !r2AccessKeyId || !r2SecretAccessKey || !r2PublicUrl) {
        throw new Error('R2 configuration is missing');
    }

    // Create S3 client for R2
    const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: r2AccessKeyId,
            secretAccessKey: r2SecretAccessKey,
        },
    });

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `uploads/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type,
    }));

    const publicUrl = `${r2PublicUrl}/${fileName}`;

    return { success: true, url: publicUrl };
}
