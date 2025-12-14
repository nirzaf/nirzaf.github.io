import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// This will be initialized with the D1 binding from Cloudflare Workers
export function getDb(d1Database: D1Database) {
    return drizzle(d1Database, { schema });
}

// Export schema and types
export { schema };
export type * from './schema';
