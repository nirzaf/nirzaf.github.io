'use client';

/**
 * Post Editor Form Component
 * Shared form for creating and editing posts with markdown editor
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, uploadImage } from '@/app/actions/post-actions';

interface PostEditorProps {
    post?: {
        id: number;
        slug: string;
        title: string;
        description: string;
        content: string;
        coverImageUrl: string;
        published: boolean;
        pubDate: string;
        tags: string[];
    };
}

export function PostEditor({ post }: PostEditorProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [slug, setSlug] = useState(post?.slug || '');
    const [title, setTitle] = useState(post?.title || '');
    const [description, setDescription] = useState(post?.description || '');
    const [content, setContent] = useState(post?.content || '');
    const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || '');
    const [published, setPublished] = useState(post?.published ?? true);
    const [pubDate, setPubDate] = useState(post?.pubDate || new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState(post?.tags?.join(', ') || '');

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Auto-generate slug from title
    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        if (!post) {
            const newSlug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .slice(0, 100);
            setSlug(newSlug);
        }
    };

    // Handle image upload
    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadImage(formData);

            if (result.url) {
                // Insert markdown image at cursor or append
                const imageMarkdown = `![${file.name}](${result.url})`;
                setContent(prev => prev + '\n\n' + imageMarkdown);
            }
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    // Handle drop
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(f => f.type.startsWith('image/'));
        if (imageFile) {
            await handleImageUpload(imageFile);
        }
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('slug', slug);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content);
            formData.append('coverImageUrl', coverImageUrl);
            formData.append('published', String(published));
            formData.append('pubDate', pubDate);
            formData.append('tags', tags);

            if (post) {
                await updatePost(post.id, formData);
            } else {
                await createPost(formData);
            }

            router.push('/admin/posts');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">Slug</label>
                        <div className="flex items-center">
                            <span className="text-gray-400 mr-2">/blog/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="post-url-slug"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-200">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Brief description for SEO and previews"
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-200">Content (Markdown)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : '📷 Add Image'}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            required
                            rows={20}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                            placeholder="Write your post content in Markdown...

Drag and drop images here to upload."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                        <h3 className="font-medium text-white">Publish Settings</h3>

                        {/* Status Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Status</span>
                            <button
                                type="button"
                                onClick={() => setPublished(!published)}
                                className={`px-3 py-1.5 text-sm rounded-lg transition ${published
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                    }`}
                            >
                                {published ? 'Published' : 'Draft'}
                            </button>
                        </div>

                        {/* Publish Date */}
                        <div className="space-y-2">
                            <label className="block text-sm text-gray-300">Publish Date</label>
                            <input
                                type="date"
                                value={pubDate}
                                onChange={(e) => setPubDate(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                        <h3 className="font-medium text-white">Cover Image</h3>
                        <input
                            type="url"
                            value={coverImageUrl}
                            onChange={(e) => setCoverImageUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="https://..."
                        />
                        {coverImageUrl && (
                            <img
                                src={coverImageUrl}
                                alt="Cover preview"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
                        <h3 className="font-medium text-white">Tags</h3>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="React, Next.js, Tutorial"
                        />
                        <p className="text-xs text-gray-400">Separate tags with commas</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/posts')}
                            className="w-full py-3 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
