# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- (Optional) Google Cloud Platform account for OAuth
- (Optional) Adzuna API credentials

## Local Development

### 1. Environment Setup

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/career_platform

# Auth
BETTER_AUTH_SECRET=your-random-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Job APIs (optional)
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-api-key

# Cron Secret
CRON_SECRET=your-cron-secret-for-job-syncing

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Push schema to database
npx drizzle-kit push

# (Optional) Seed sample jobs
npx tsx src/scripts/seed-sample-jobs.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy

3. **Environment Variables in Vercel**
   Add these in Project Settings → Environment Variables:
   ```
   DATABASE_URL=your-production-postgres-url
   BETTER_AUTH_SECRET=your-production-secret
   BETTER_AUTH_URL=https://your-app.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ADZUNA_APP_ID=your-adzuna-app-id
   ADZUNA_APP_KEY=your-adzuna-api-key
   CRON_SECRET=your-cron-secret
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Database Migration**
   After deployment, run from your local machine:
   ```bash
   DATABASE_URL=your-production-url npx drizzle-kit push
   ```

5. **Set Up Cron Job**
   - Use Vercel Cron Jobs or external service (cron-job.org)
   - Schedule: `GET https://your-app.vercel.app/api/sync-listings`
   - Add header: `Authorization: Bearer your-cron-secret`
   - Frequency: Every 6 hours

### Option 2: Railway

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Add PostgreSQL database
   - Add Node.js service

2. **Configure Environment**
   Copy environment variables from Railway's PostgreSQL service

3. **Deploy**
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   railway up
   ```

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select Node.js environment

2. **Configure**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Add environment variables

3. **Add Database**
   - Create managed PostgreSQL database
   - Connect to app

## Database Providers

### Recommended PostgreSQL Hosting

1. **Neon** (Free tier available)
   - Serverless PostgreSQL
   - Auto-scaling
   - Free tier: 512 MB storage
   - URL: https://neon.tech

2. **Supabase** (Free tier available)
   - PostgreSQL + additional features
   - Free tier: 500 MB database
   - URL: https://supabase.com

3. **Railway** (Free trial)
   - Simple setup
   - $5/month after trial
   - URL: https://railway.app

4. **Vercel Postgres** (Paid)
   - Integrated with Vercel
   - Pay as you go
   - URL: https://vercel.com/storage/postgres

## Post-Deployment

### 1. Update OAuth Redirect URIs

**Google Cloud Console:**
- Add production URL: `https://your-app.vercel.app/api/auth/callback/google`
- Update in both "Authorized JavaScript origins" and "Authorized redirect URIs"

### 2. Sync Initial Jobs

```bash
curl -X GET \
  -H "Authorization: Bearer your-cron-secret" \
  https://your-app.vercel.app/api/sync-listings
```

### 3. Test Authentication

1. Visit your production URL
2. Try signing up with email
3. Test Google OAuth (if configured)
4. Complete onboarding
5. Verify job listings appear

### 4. Set Up Monitoring

**Error Tracking:**
- Add Sentry: https://sentry.io
- Environment variable: `SENTRY_DSN`

**Analytics:**
- Add Vercel Analytics (automatic on Vercel)
- Or Google Analytics

**Uptime Monitoring:**
- UptimeRobot: https://uptimerobot.com
- Monitor: `https://your-app.vercel.app/api/health`

## Cron Jobs Setup

### Option 1: Vercel Cron (Recommended for Vercel)

Add `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/sync-listings",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Option 2: External Cron Service

**cron-job.org (Free):**
1. Create account at https://cron-job.org
2. Create new cron job
3. URL: `https://your-app.vercel.app/api/sync-listings`
4. Schedule: `0 */6 * * *` (every 6 hours)
5. Add header: `Authorization: Bearer your-cron-secret`

**EasyCron (Free tier):**
Similar setup at https://www.easycron.com

## Security Checklist

- [ ] Update `BETTER_AUTH_SECRET` to a strong random value (32+ characters)
- [ ] Update `CRON_SECRET` to prevent unauthorized job syncing
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Configure CORS if needed
- [ ] Set up rate limiting for auth endpoints
- [ ] Enable database backups
- [ ] Review and limit database permissions
- [ ] Rotate OAuth secrets periodically
- [ ] Monitor for suspicious activity

## Performance Optimization

### 1. Database Indexes

Add indexes for frequently queried fields:
```sql
CREATE INDEX idx_listings_field ON listings(field);
CREATE INDEX idx_listings_created_at ON listings(created_at);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```

### 2. Caching

Add Redis for session caching (optional):
- Upstash Redis (free tier)
- Configure Better Auth to use Redis

### 3. CDN

- Vercel automatically uses CDN
- For static assets, use Cloudflare or similar

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql "your-database-url"

# Check connection pooling
# Add to DATABASE_URL: ?sslmode=require&connection_limit=5
```

### Build Failures

```bash
# Clear cache
rm -rf .next
npm run build

# Check logs
vercel logs your-deployment-url
```

### OAuth Redirect Issues

1. Verify redirect URI in Google Cloud Console
2. Check `BETTER_AUTH_URL` matches your domain
3. Ensure HTTPS in production

### Jobs Not Syncing

1. Check cron job is running
2. Verify `CRON_SECRET` matches
3. Check API logs: `vercel logs --follow`
4. Test manually:
   ```bash
   curl -H "Authorization: Bearer your-secret" \
     https://your-app.vercel.app/api/sync-listings
   ```

## Scaling Considerations

### Database

- Monitor connection pool usage
- Add read replicas for high traffic
- Consider database-specific connection pooling (PgBouncer)

### Application

- Vercel auto-scales by default
- For Railway/DO, increase resources as needed
- Use serverless functions for heavy operations

### Job Syncing

- Implement queue system (Bull, BullMQ)
- Process jobs in background
- Add retry logic for failed syncs

## Backup Strategy

### Database Backups

**Automated (Recommended):**
- Most providers offer automatic backups
- Neon: Point-in-time recovery
- Supabase: Daily backups

**Manual:**
```bash
pg_dump your-database-url > backup-$(date +%Y%m%d).sql
```

### Resume Files Backup

- Store in cloud storage (AWS S3, Cloudflare R2)
- Enable versioning
- Set up lifecycle policies

## Cost Estimation

### Free Tier Setup
- **Hosting**: Vercel (Free)
- **Database**: Neon/Supabase (Free tier)
- **Cron**: Vercel Cron or cron-job.org (Free)
- **Total**: $0/month

### Small Scale (< 1000 users)
- **Hosting**: Vercel Pro ($20/month)
- **Database**: Neon/Supabase ($20/month)
- **Storage**: Cloudflare R2 ($5/month)
- **Total**: ~$45/month

### Medium Scale (1000-10000 users)
- **Hosting**: Vercel Pro ($20/month)
- **Database**: Supabase Pro ($25/month)
- **Storage**: AWS S3 ($10/month)
- **Monitoring**: Sentry ($26/month)
- **Total**: ~$80/month

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Vercel Documentation](https://vercel.com/docs)

## Next Steps

After deployment:
1. Monitor application health
2. Collect user feedback
3. Plan feature updates
4. Optimize based on usage patterns
5. Scale infrastructure as needed
