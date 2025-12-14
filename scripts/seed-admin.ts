#!/usr/bin/env bun
/**
 * Seed script to create initial admin user
 * Run with: bun run scripts/seed-admin.ts
 */

import { createHash } from 'crypto';

// Simple password hashing (in production, Better-Auth will handle this properly)
function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
}

async function promptInput(question: string): Promise<string> {
    process.stdout.write(question);

    return new Promise((resolve) => {
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

async function main() {
    console.log('🔐 Admin User Seed Script\n');
    console.log('This script will create an initial admin user for the CMS.\n');

    // Prompt for user details
    const email = await promptInput('Enter admin email: ');
    const password = await promptInput('Enter admin password (min 8 characters): ');
    const name = await promptInput('Enter admin name (optional): ');

    // Validate input
    if (!email || !email.includes('@')) {
        console.error('❌ Invalid email address');
        process.exit(1);
    }

    if (!password || password.length < 8) {
        console.error('❌ Password must be at least 8 characters');
        process.exit(1);
    }

    // Hash password
    const passwordHash = hashPassword(password);
    const userId = crypto.randomUUID();

    // Generate SQL
    const sql = `-- Admin user seed
INSERT INTO users (id, email, password_hash, name, created_at) VALUES (
  '${userId}',
  '${email.replace(/'/g, "''")}',
  '${passwordHash}',
  '${name ? name.replace(/'/g, "''") : email.split('@')[0]}',
  ${Date.now()}
);
`;

    // Save to file
    const fs = await import('fs');
    const path = await import('path');
    const sqlPath = path.join(process.cwd(), 'seed-admin.sql');
    fs.writeFileSync(sqlPath, sql);

    console.log(`\n✅ Admin user SQL generated: ${sqlPath}`);
    console.log(`\n📋 To create the admin user, run:`);
    console.log(`   bunx wrangler d1 execute cms-db --local --file=seed-admin.sql`);
    console.log(`   bunx wrangler d1 execute cms-db --remote --file=seed-admin.sql`);
    console.log(`\n🔑 Admin credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: [hidden]`);
    console.log(`\n⚠️  Make sure to save these credentials securely!`);

    process.exit(0);
}

// Run seed
main();
