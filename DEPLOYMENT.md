# Deployment Guide - Vercel + Supabase

## Overview
This guide deploys your CRM to **Vercel** (free tier, automatic deployments from GitHub).

## Prerequisites
✅ GitHub account (free)
✅ Vercel account (free, sign up with GitHub)
✅ Supabase project with migration SQL run
✅ `.env.local` file with all Supabase credentials

---

## Step 1: Prepare Code for GitHub

### Verify .gitignore
Make sure sensitive files are excluded:

```bash
cat .gitignore
```

Should include:
- `.env.local` ✅
- `node_modules/` ✅
- `.next/` ✅

### Create git commit

```bash
git add .
git commit -m "Ready for deployment - calendar and status features complete"
```

---

## Step 2: Push to GitHub

### If NOT yet on GitHub:
```bash
# Create new repo on github.com (name: crm-app)
git remote add origin https://github.com/YOUR_USERNAME/crm-app.git
git branch -M main
git push -u origin main
```

### If already on GitHub:
```bash
git push origin main
```

**After push, your code is on GitHub and ready for Vercel.**

---

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to **vercel.com** → Sign in with GitHub
2. Click **"Add New..." → "Project"**
3. Find and select **`crm-app`** repository
4. Click **"Import"**

### Configuration Screen
Leave defaults, but scroll to **"Environment Variables"**

---

## Step 4: Add Environment Variables to Vercel

In the Environment Variables section, add **three variables**:

| Variable Name | Value | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Copy from `.env.local` | Supabase Dashboard → Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Copy from `.env.local` | Supabase Dashboard → Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Copy from `.env.local` | Supabase Dashboard → Settings |

### How to find Supabase credentials:
1. Open Supabase project dashboard
2. Go to **Settings** (⚙️) → **API**
3. Copy the three keys shown
4. Paste into Vercel's Environment Variables form

**Important:** `NEXT_PUBLIC_*` variables are public (safe to expose). `SUPABASE_SERVICE_ROLE_KEY` is private (only used server-side).

---

## Step 5: Deploy

Click **"Deploy"** button on Vercel.

⏳ **Wait 2-3 minutes** for build to complete.

You'll see:
```
✓ Building...
✓ Ready
```

**Copy the URL shown** (e.g., `https://crm-app-abc123.vercel.app`)

---

## Step 6: Test Production Deployment

### In browser, visit your live URL:
```
https://your-project-name.vercel.app
```

### Test these flows:
1. ✅ **Login** - Use test admin credentials
2. ✅ **Admin Dashboard** - See stats
3. ✅ **Create Customer** - Assign to employee
4. ✅ **Employee View** - See assigned customer
5. ✅ **Calendar** - Schedule meeting
6. ✅ **Status Toggle** - Change customer status

---

## Step 7: Update Supabase URL (If on Free Tier → Production)

If you move from Supabase free tier to production:

1. Get new production URL from Supabase
2. Update environment variables in Vercel:
   - Go to Vercel Project → Settings → Environment Variables
   - Edit `NEXT_PUBLIC_SUPABASE_URL`
   - Paste new URL
   - **Redeploy** (Vercel does this automatically on next git push)

---

## Troubleshooting

### Build Fails with "Module not found"
```bash
npm install
npm run build
```
Then push to GitHub - Vercel will retry.

### Deployed site shows 404
- Check that root `/` page renders (see `app/page.tsx`)
- Check browser console for errors (F12)

### Login fails in production
1. Check Supabase credentials are correct in Vercel
2. Verify URL matches exactly (no trailing slashes)
3. Check Supabase RLS policies are enabled

### Email/Password Auth not working
Make sure you ran the SQL migrations from `MIGRATIONS.md` in Supabase:
- `profiles` table created ✅
- RLS policies enabled ✅
- Customer status updated ✅

---

## Continuous Deployment

**Automatic after setup:**

1. You make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Fix feature"
   git push origin main
   ```
3. Vercel automatically rebuilds and deploys
4. See live at your Vercel URL in ~2 minutes

---

## Domain Setup (Optional)

To use custom domain (e.g., `crm.mycompany.com`):

1. Vercel Project → Settings → Domains
2. Add your domain
3. Follow DNS instructions from your domain registrar
4. Done ✅

---

## Monitoring

### View Logs
Vercel Project → Deployments → Click deployment → View Logs

### View Errors
- Check Vercel logs (build errors)
- Check browser console (client errors)
- Check Supabase Dashboard → SQL Editor (database errors)

---

## Database Schema on Production

**Before going live, ensure:**

1. ✅ All SQL from `MIGRATIONS.md` run in production Supabase
2. ✅ `meetings` table exists
3. ✅ `meeting_attendees` table exists
4. ✅ Customer status updated to LEAD/IN_PROGRESS/CONVERTED/INACTIVE
5. ✅ RLS policies enabled

---

## Costs

**Free tier:**
- ✅ Vercel: 100 GB bandwidth/month
- ✅ Supabase: 500 MB database, 5 GB bandwidth/month
- ✅ Both free tier is sufficient for 50-100 active users

---

## Next Deployment

After deployment, to add new features:

1. Develop locally (`npm run dev`)
2. Commit changes
3. Push to GitHub
4. Vercel auto-deploys in 2-3 minutes

That's it! Your CRM is now live. 🚀
