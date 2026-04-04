# 🚀 Deploy Your CRM to Production NOW

## Step-by-Step Deployment Guide

### Prerequisites
✅ Project is built locally and working
✅ Git repository created
✅ GitHub account with your code pushed
✅ Vercel account (free)
✅ Supabase project created

---

## Phase 1: Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Name it: `crm-app`
4. Create a strong password
5. Select free tier region closest to you
6. Wait for creation (2-3 minutes)

### 2. Run Database Migrations
1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy/paste **ALL** SQL from these files (in order):
   - `README.md` (base schema - profiles, customers, interactions)
   - `MIGRATIONS.md` (meetings tables + updated status)

**Important**: Run base schema FIRST, then migrations!

### 3. Enable Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (already enabled)
3. Save settings

### 4. Copy Your Credentials
1. Go to **Settings** → **API**
2. Copy these 3 values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

Keep these values safe! You'll need them for both local and Vercel.

---

## Phase 2: Cloud Deployment (Vercel)

### 1. Connect GitHub to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..."
3. Select "Project"
4. Click "Import Git Repository"
5. Select your CRM repo
6. Click "Import"

### 2. Configure Environment Variables
Before deploying, add your env variables:

**Click "Environment Variables" and add:**
```
NEXT_PUBLIC_SUPABASE_URL        = (from Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (from Supabase)
SUPABASE_SERVICE_ROLE_KEY       = (from Supabase)
GOOGLE_API_KEY                  = (get from makersuite.google.com/app/apikeys)
```

**Important**: The "NEXT_PUBLIC" ones are public (safe). The service role and Google key are secret - Vercel keeps them secure.

### 3. Deploy
1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. You'll see a success message with your live URL!

Example: `https://my-crm.vercel.app`

---

## Phase 3: First Time Setup

### 1. Create Your First Admin User
Go to your live URL: `https://my-crm.vercel.app`

1. Click "Don't have an account? Sign up"
2. Create account with:
   - Email: your email
   - Password: strong password
3. Confirm email
4. You'll be redirected but can't access yet (no profile)

### 2. Create Profile in Supabase
1. Open Supabase dashboard → **profiles table**
2. Click "Insert" → "Insert row"
3. Fill in:
   - `id`: Copy from `auth.users` table (your user ID)
   - `full_name`: Your name
   - `email`: Your email
   - `role`: `ADMIN`
4. Click "Save"

### 3. Refresh and Login
1. Refresh your browser
2. Login with your email/password
3. You should see admin dashboard! ✅

---

## Phase 4: Test All Features

### Admin Dashboard
- [ ] See dashboard stats
- [ ] Create a customer
- [ ] Assign to employee
- [ ] Click "📋 What's for today" → See AI briefing

### Calendar
- [ ] Go to Calendar
- [ ] Schedule a meeting
- [ ] Add attendees
- [ ] See it on calendar grid

### Customer Status
- [ ] Go to admin customers
- [ ] Click customer name
- [ ] Try to change status (admin can't - that's employee's job)

### Create Employee Account
1. Admin → Users
2. Click "Add User"
3. Create employee with:
   - Email: new email
   - Password: temporary password
   - Role: EMPLOYEE

### Login as Employee
1. Logout from admin
2. Signup/login as employee
3. See only assigned customers
4. Click customer → change status
5. Schedule meeting

---

## Phase 5: After Deployment

### High Priority
- [ ] Test login/signup flow works
- [ ] Verify database queries work
- [ ] Check admin can create customers
- [ ] Check employee can see assigned customers
- [ ] Test AI briefing feature (if GOOGLE_API_KEY set)

### Optional Customizations
- [ ] Update landing page (app/page.tsx)
- [ ] Add company logo
- [ ] Customize colors in tailwind.config.js
- [ ] Add email notifications
- [ ] Set up custom domain

---

## 🎯 Quick Checklist

### Before Deploying:
- [ ] All code committed to GitHub
- [ ] `.env.local` NOT committed (in .gitignore)
- [ ] Supabase project created
- [ ] Database migrations run
- [ ] Credentials copied

### During Deployment:
- [ ] Environment variables added to Vercel
- [ ] Vercel deployment successful
- [ ] Live URL accessible

### After Deployment:
- [ ] First admin user created in Supabase
- [ ] Can login and see admin dashboard
- [ ] Calendar works
- [ ] Status changes work
- [ ] AI briefing works (if GOOGLE_API_KEY set)

---

## 🔗 Important Links

| Service | URL |
|---------|-----|
| Supabase | https://app.supabase.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Live App | `https://your-crm-app.vercel.app` |
| Google Gemini Keys | https://makersuite.google.com/app/apikeys |

---

## 📝 Environment Variables Summary

### Local Development (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_API_KEY=AIza_...
```

### Vercel Deployment
Same 4 variables in Project Settings → Environment Variables

---

## ⚠️ Common Issues

### Issue: "Failed to initialize database"
**Solution**: Check that you ran both SQL from README.md and MIGRATIONS.md

### Issue: Login works but sees /unauthorized
**Solution**: Create profile row in Supabase with your user ID

### Issue: Can't schedule meetings
**Solution**: Make sure MIGRATIONS.md was run (creates meetings table)

### Issue: AI briefing not working
**Solution**: Add GOOGLE_API_KEY to Vercel env vars and redeploy

### Issue: Changes not showing after git push
**Solution**: Check Vercel build status in dashboard

---

## 🎉 Congratulations!

Your production CRM is now live! Features working:

✅ User authentication
✅ Role-based access (ADMIN, EMPLOYEE, CLIENT)
✅ Customer management with pipeline
✅ Meeting calendar
✅ AI daily briefings
✅ Automatic scaling (Vercel handles traffic)
✅ Database security (Supabase RLS)

---

## Next Steps

1. **Invite team members**
   - Create employee accounts in Admin → Users
   - Share login link
   - Assign them customers

2. **Import existing data**
   - Customers from CSV/Excel
   - Historical interactions
   - Employee roster

3. **Customize for your business**
   - Update landing page
   - Add company branding
   - Set up email notifications

4. **Monitor performance**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Gather user feedback

---

## 📞 Support

**For Vercel issues**: https://vercel.com/support
**For Supabase issues**: https://supabase.com/docs
**For Google API issues**: https://makersuite.google.com/

Your CRM is production-ready! 🚀
