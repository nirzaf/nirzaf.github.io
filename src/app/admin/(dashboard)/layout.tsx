/**
 * Admin Layout
 * Wraps all admin pages with sidebar navigation
 */

import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800/80 backdrop-blur-xl border-b border-gray-700 z-50">
                <div className="flex items-center justify-between h-full px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/posts" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            CMS Admin
                        </Link>
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/admin/posts"
                                className="px-3 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                            >
                                Posts
                            </Link>
                            <Link
                                href="/admin/posts/create"
                                className="px-3 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                            >
                                Create Post
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-sm text-gray-400 hover:text-white transition"
                        >
                            View Blog →
                        </Link>
                        <form action="/api/auth/sign-out" method="POST">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-600/30 transition text-sm"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 px-6 pb-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
