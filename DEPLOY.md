# 🚀 Complete Deployment Guide

Deploy your CRM app to production in 15 minutes using Vercel + Supabase (both free tier).

---

## ✅ Checklist Before Deploying

- [ ] Code committed to GitHub
- [ ] Supabase project created and migrations run
- [ ] Environment variables ready
- [ ] Google API key created (optional, for AI briefing)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure Git is initialized
```bash
cd /c/Users/admin/Desktop/Ignatiuz
git status
```

### 1.2 Make sure `.env.local` is in `.gitignore`
```bash
cat .gitignore | grep env
# Should show: .env.local
```

### 1.3 Commit all code
```bash
git add .
git commit -m "Add AI briefing feature with Gemini API"
git push origin main
```

---

## Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up or login
3. Create a new project
4. Copy project URL and keys to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
```

### 2.2 Run Database Migrations
1. In Supabase Dashboard, go to SQL Editor
2. Create new query and paste all SQL from `MIGRATIONS.md`
3. Execute (wait for success message)

### 2.3 Create First Admin User
1. In Supabase, go to Authentication → Users
2. Create new user with email/password
3. Copy the user ID
4. Go to Table Editor → profiles
5. Insert new row:
   - `id`: paste the user ID
   - `full_name`: "Admin"
   - `email`: your email
   - `role`: "ADMIN"

### 2.4 Test Locally
```bash
npm run dev
# Open http://localhost:3000/login
# Test login works
```

---

## Step 3: Set Up Google Gemini API (Optional but Recommended)

The "📋 What's for Today" button uses Gemini AI for intelligent briefings.

### 3.1 Create Google API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key

### 3.2 Add to Environment
In `.env.local`:
```
GOOGLE_API_KEY=AIzaSy...
```

Test it locally by clicking "What's for Today" button on admin/employee dashboard.

---

## Step 4: Deploy to Vercel

### 4.1 Connect GitHub
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Select your repository
5. Click "Import"

### 4.2 Add Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
GOOGLE_API_KEY=AIzaSy...
```

**Make sure to set each variable to all environments** (Production, Preview, Development)

### 4.3 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a production URL like: `https://your-app.vercel.app`

---

## Step 5: Post-Deployment Testing

### 5.1 Test Login
1. Visit your deployed URL
2. Login with admin credentials
3. Should see admin dashboard

### 5.2 Test AI Briefing
1. Click "📋 What's for Today" button
2. Should see AI-generated briefing (if GOOGLE_API_KEY is set)

### 5.3 Test Key Features
- [ ] Create customer
- [ ] Assign to employee
- [ ] Employee changes status
- [ ] Schedule meeting
- [ ] View calendar

---

## Troubleshooting

### Issue: "GOOGLE_API_KEY not configured"
**Solution**: Add GOOGLE_API_KEY to Vercel environment variables

### Issue: Briefing shows error "Failed to generate briefing"
**Solution**:
1. Check API key is valid at https://aistudio.google.com/app/apikey
2. Verify it's added to Vercel env vars
3. Check rate limits (free tier: 60 requests/min)

### Issue: "Not authenticated" when clicking briefing button
**Solution**: Make sure you're logged in

### Issue: Build fails on Vercel
**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are installed: `npm install`
3. Verify TypeScript has no errors: `npm run build`

---

## Environment Variables Reference

| Variable | Where to Get | Required? | Notes |
|----------|-------------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings > API | ✅ Yes | Exposed to browser (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API | ✅ Yes | Exposed to browser (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings > API | ✅ Yes | Server-only (never expose) |
| `GOOGLE_API_KEY` | aistudio.google.com/app/apikey | ⚠️ Optional | For AI briefing feature |

---

## Monitoring & Maintenance

### Check Deployment Status
1. Visit Vercel dashboard
2. See deployment history and logs

### View Server Logs
In Vercel dashboard → Logs → Function Logs

### Monitor Supabase
In Supabase dashboard:
- Check database stats
- View authentication logs
- Monitor API usage

---

## Auto-Deploy on Every Git Push

When you push to `main` branch, Vercel automatically:
1. Detects the push
2. Builds your app
3. Deploys to production (2-3 minutes)

No manual deployment needed!

---

## Production Checklist

- [ ] All environment variables added to Vercel
- [ ] Database migrations completed
- [ ] First admin user created
- [ ] Login works on production URL
- [ ] "What's for Today" button works
- [ ] Calendar feature works
- [ ] Customer creation works
- [ ] Status changes work

---

## Support

**Error messages?** Check:
1. Browser console (F12 > Console tab)
2. Vercel Function Logs
3. Supabase API logs

Need help? Check:
- `FEATURES.md` - Feature overview
- `MIGRATIONS.md` - Database schema
- `README.md` - General documentation
