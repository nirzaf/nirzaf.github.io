# Cloudflare Deployment Documentation

## Resources Created

| Resource | Name | ID/URL |
|----------|------|--------|
| D1 Database | cms-db | `f3e7fb86-c997-42e7-956e-d273be0035bb` |
| R2 Bucket | cms-assets | Standard storage class |
| Pages Project | nirzaf-cms | https://nirzaf-cms.pages.dev/ |
| Account | FazrinPhcc | `7c2fe1b770e74bbde133e53894bd3ea7` |

## Secrets Configured

| Secret | Location | Description |
|--------|----------|-------------|
| BETTER_AUTH_SECRET | Pages Secrets | Auth session encryption key (auto-generated) |

## Database Schema

Applied migration `0000_neat_tattoo.sql` with 4 tables:
- **users** - Admin authentication (id, email, password_hash, name, created_at)
- **posts** - Blog content (slug, title, description, content, cover_image_url, etc.)
- **tags** - Post categories (id, name)
- **posts_tags** - Many-to-many relationship

## Wrangler Configuration

```toml
name = "nirzaf-cms"
account_id = "7c2fe1b770e74bbde133e53894bd3ea7"
compatibility_date = "2024-12-14"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "cms-db"
database_id = "f3e7fb86-c997-42e7-956e-d273be0035bb"
migrations_dir = "drizzle/migrations"

[[r2_buckets]]
binding = "R2"
bucket_name = "cms-assets"
```

## Deployment Steps

### Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → nirzaf-cms
2. Click "Connect to Git" → Select GitHub → Authorize
3. Select repository: `nirzaf/nirzaf.github.io`
4. Configure build:
   - **Build command:** `bunx @cloudflare/next-on-pages`
   - **Build output directory:** `.vercel/output/static`
   - **Root directory:** `/`
   - **Node.js version:** 18.x or later

### Environment Variables (Set in Pages Settings)

Add these in Cloudflare Dashboard → Pages → nirzaf-cms → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| NODE_ENV | production |
| BETTER_AUTH_URL | https://nirzaf-cms.pages.dev |

### Bindings (Set in Pages Settings)

Add in Cloudflare Dashboard → Pages → nirzaf-cms → Settings → Functions → Bindings:

**D1 Database:**
- Variable name: `DB`
- Database: `cms-db`

**R2 Bucket:**
- Variable name: `R2`
- Bucket: `cms-assets`

## Local Development

```bash
# Install dependencies
bun install

# Generate migrations (if schema changes)
bun run db:generate

# Apply migrations locally
bun run db:migrate:local

# Start dev server
bun run dev
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Local development |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate:local` | Apply migrations to local D1 |
| `bun run db:migrate:remote` | Apply migrations to remote D1 |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run seed:admin` | Create admin user |
| `bun run migrate:content` | Migrate MDX to D1 |

## Admin Panel

After deployment, access:
- **Admin:** https://nirzaf-cms.pages.dev/admin/login
- **Blog:** https://nirzaf-cms.pages.dev/blog

## Next Steps

1. Connect GitHub repository to Cloudflare Pages in dashboard
2. Add D1 and R2 bindings in Pages settings
3. Trigger first deployment by pushing to `master` branch
4. Create admin user via `bun run seed:admin`
5. Migrate existing content via `bun run migrate:content`
