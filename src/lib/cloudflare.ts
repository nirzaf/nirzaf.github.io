/**
 * Helper to get D1 database instance in Next.js server components
 * For Cloudflare Pages with @cloudflare/next-on-pages
 */

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';

/**
 * Get D1 database instance from Cloudflare Workers binding
 * This should be called in Server Components or API routes
 */
export function getD1Database() {
    try {
        const context = getRequestContext();
        const db = context.env.DB as D1Database;

        if (!db) {
            throw new Error('D1 database binding not found. Make sure DB is configured in wrangler.toml');
        }

        return getDb(db);
    } catch (error) {
        console.error('Failed to get D1 database:', error);
        throw error;
    }
}

/**
 * Type for Cloudflare environment bindings
 */
export interface CloudflareEnv {
    DB: D1Database;
    R2: R2Bucket;
}
