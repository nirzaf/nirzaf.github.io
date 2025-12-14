/**
 * Edit Post Page
 * Loads post data and renders editor
 */

import { notFound } from 'next/navigation';
import { getD1Database } from '@/lib/cloudflare';
import { posts, tags, postsTags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PostEditor } from '../../PostEditor';

export const runtime = 'edge';

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
        notFound();
    }

    const db = getD1Database();

    // Get post
    const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId));

    if (!post) {
        notFound();
    }

    // Get post tags
    const postTagsResult = await db
        .select({ name: tags.name })
        .from(postsTags)
        .innerJoin(tags, eq(postsTags.tagId, tags.id))
        .where(eq(postsTags.postId, postId));

    const postWithTags = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description || '',
        content: post.content,
        coverImageUrl: post.coverImageUrl || '',
        published: post.published,
        pubDate: post.pubDate,
        tags: postTagsResult.map(t => t.name),
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Edit Post</h1>
                <p className="text-gray-400 mt-1">Update: {post.title}</p>
            </div>

            <PostEditor post={postWithTags} />
        </div>
    );
}
