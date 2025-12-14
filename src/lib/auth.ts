/**
 * Better-Auth configuration for admin authentication
 * Uses D1 database for session storage
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Get auth instance - must be called within request context
export function getAuth() {
    const { env } = getRequestContext();
    const db = drizzle(env.DB as D1Database, { schema });

    return betterAuth({
        database: drizzleAdapter(db, {
            provider: 'sqlite',
            usePlural: true,
        }),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
        },
        trustedOrigins: [
            process.env.BETTER_AUTH_URL || 'http://localhost:3000',
        ],
    });
}

// Auth types
export type Auth = ReturnType<typeof getAuth>;
