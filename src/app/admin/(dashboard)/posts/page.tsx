/**
 * Admin Posts List Page
 * Displays all posts with edit/delete actions
 */

import Link from 'next/link';
import { getD1Database } from '@/lib/cloudflare';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { DeletePostButton } from './DeletePostButton';
import { Card, CardBody, Button, Badge } from '../../components/ui';

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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Posts</h1>
                    <p className="text-gray-400 mt-1">Manage your blog posts</p>
                </div>
                <Link href="/admin/posts/create">
                    <Button variant="primary" size="lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Post
                    </Button>
                </Link>
            </div>

            {/* Posts Table */}
            <Card>
                {allPosts.length === 0 ? (
                    <CardBody>
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-300">No posts yet</h3>
                            <p className="mt-2 text-sm text-gray-400">Get started by creating your first blog post.</p>
                            <Link href="/admin/posts/create" className="mt-6 inline-block">
                                <Button variant="primary">Create Post</Button>
                            </Link>
                        </div>
                    </CardBody>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>Published</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPosts.map((post) => (
                                    <tr key={post.id}>
                                        <td>
                                            <div className="font-medium text-white">{post.title}</div>
                                        </td>
                                        <td>
                                            <code className="text-sm text-gray-400">{post.slug}</code>
                                        </td>
                                        <td>
                                            <Badge variant={post.published ? 'success' : 'warning'}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <span className="text-sm text-gray-400">
                                                {new Date(post.pubDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/posts/${post.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </Button>
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
            </Card>

            {/* Stats */}
            {allPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardBody>
                            <div className="text-sm text-gray-400">Total Posts</div>
                            <div className="text-2xl font-bold text-white mt-1">{allPosts.length}</div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <div className="text-sm text-gray-400">Published</div>
                            <div className="text-2xl font-bold text-green-400 mt-1">
                                {allPosts.filter(p => p.published).length}
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <div className="text-sm text-gray-400">Drafts</div>
                            <div className="text-2xl font-bold text-yellow-400 mt-1">
                                {allPosts.filter(p => !p.published).length}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}
