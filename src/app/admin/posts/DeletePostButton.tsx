'use client';

/**
 * Delete Post Button Component
 * Client component for handling post deletion with confirmation
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/app/actions/post-actions';

interface DeletePostButtonProps {
    postId: number;
    postTitle: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePost(postId);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1.5 text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
        >
            Delete
        </button>
    );
}
