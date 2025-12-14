# Cloudflare Setup Instructions

Before running the migration scripts, you need to set up your Cloudflare resources manually.

## Step 1: Authenticate with Wrangler

```bash
bunx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 2: Create D1 Database

```bash
bunx wrangler d1 create cms-db
```

**Important:** Copy the `database_id` from the output and update `wrangler.toml`:
- Replace the empty `database_id = ""` with your actual database ID

Also add to `.env.local`:
```
D1_DATABASE_ID=your_database_id_here
```

## Step 3: Create R2 Bucket

```bash
bunx wrangler r2 bucket create cms-assets
```

## Step 4: Get R2 Access Credentials

1. Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create a new API token with "Object Read & Write" permissions
3. Copy the Access Key ID and Secret Access Key
4. Update `.env.local`:
   ```
   R2_ACCESS_KEY_ID=your_access_key_here
   R2_SECRET_ACCESS_KEY=your_secret_key_here
   ```

## Step 5: Get Cloudflare Account ID

1. Go to Cloudflare Dashboard
2. Copy your Account ID from the right sidebar
3. Update `.env.local`:
   ```
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   ```

## Step 6: Get Cloudflare API Token (for Drizzle Kit)

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Create a new token with "D1 Edit" permissions
3. Copy the token
4. Update `.env.local`:
   ```
   CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

## Step 7: Configure R2 Public URL

After creating the R2 bucket, you need to enable public access:

1. Go to Cloudflare Dashboard → R2 → cms-assets
2. Click "Settings" → "Public Access"
3. Enable "Allow Access" and copy the public URL
4. Update `.env.local`:
   ```
   R2_PUBLIC_URL=https://your-bucket-url.r2.dev
   ```

## Step 8: Generate Better-Auth Secret

```bash
openssl rand -base64 32
```

Update `.env.local`:
```
BETTER_AUTH_SECRET=your_generated_secret_here
```

## Step 9: Run Database Migrations

```bash
# Generate migration files
bun run db:generate

# Apply migrations locally (for testing)
bun run db:migrate:local

# Apply migrations to remote D1 database
bun run db:migrate:remote
```

## Step 10: Seed Admin User

```bash
bun run seed:admin
```

Follow the prompts to create your admin user.

## Step 11: Migrate Content

```bash
bun run migrate:content
```

This will migrate all MDX posts to the D1 database and upload images to R2.

## Next Steps

After completing these steps, you can:
- Run `bun run dev` for local development
- Run `bun run build` to build for Cloudflare Pages
- Run `bun run deploy` to deploy to Cloudflare Pages
