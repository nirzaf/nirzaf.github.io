/**
 * Auth API route handler for Better-Auth
 * Handles all auth endpoints: /api/auth/*
 */

import { getAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const runtime = 'edge';

const handler = async (request: Request) => {
    const auth = getAuth();
    const nextHandler = toNextJsHandler(auth);
    return nextHandler(request);
};

export { handler as GET, handler as POST };
