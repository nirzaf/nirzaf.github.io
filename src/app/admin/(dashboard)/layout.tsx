/**
 * Admin Layout
 * Modern CMS layout with sidebar navigation
 */

import '../admin-ui.css';
import { AdminSidebar } from '../components/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-breadcrumb">
                        <span>Admin</span>
                        <span className="admin-breadcrumb-separator">/</span>
                        <span>Dashboard</span>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
