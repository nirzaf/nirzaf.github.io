/**
 * Admin Posts List Page
 * Displays all posts with edit/delete actions
 */

import Link from 'next/link';
import { getD1Database } from '@/lib/cloudflare';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { DeletePostButton } from './DeletePostButton';

export const runtime = 'edge';

export default async function AdminPostsPage() {
    const db = getD1Database();

    const allPosts = await db
        .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            published: posts.published,
            pubDate: posts.pubDate,
        })
        .from(posts)
        .orderBy(desc(posts.pubDate));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Posts</h1>
                    <p className="text-gray-400 mt-1">Manage your blog posts</p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg transition-all"
                >
                    + New Post
                </Link>
            </div>

            {allPosts.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
                    <p className="text-gray-400 text-lg">No posts yet</p>
                    <Link
                        href="/admin/posts/create"
                        className="text-purple-400 hover:text-purple-300 mt-2 inline-block"
                    >
                        Create your first post →
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Title</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Slug</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {allPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-800/50 transition">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-white">{post.title}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded">{post.slug}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.published ? (
                                            <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(post.pubDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition"
                                                target="_blank"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="px-3 py-1.5 text-sm bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition"
                                            >
                                                Edit
                                            </Link>
                                            <DeletePostButton postId={post.id} postTitle={post.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
