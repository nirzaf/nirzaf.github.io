/**
 * Auth API route handler for Better-Auth
 * Handles all auth endpoints: /api/auth/*
 */

import { getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const runtime = 'edge';

const apiHandler = async (request: Request) => {
    try {
        const auth = getAuth();
        const handlers = toNextJsHandler(auth);

        // Use GET handler for GET requests, POST for POST requests
        if (request.method === 'POST') {
            return await handlers.POST(request);
        }
        return await handlers.GET(request);
    } catch (error) {
        console.error('Auth API Error:', error);
        return new Response('Internal Server Error: ' + (error instanceof Error ? error.message : String(error)), { status: 500 });
    }
};

export { apiHandler as GET, apiHandler as POST };
