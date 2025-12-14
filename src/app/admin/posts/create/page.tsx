/**
 * Create New Post Page
 */

import { PostEditor } from '../PostEditor';

export const runtime = 'edge';

export default function CreatePostPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Create Post</h1>
                <p className="text-gray-400 mt-1">Add a new blog post</p>
            </div>

            <PostEditor />
        </div>
    );
}
