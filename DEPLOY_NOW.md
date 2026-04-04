# 🚀 DEPLOYMENT QUICK START

Your CRM is **production-ready**! Follow these 5 steps to deploy live.

---

## Step 1: Push to GitHub

```bash
git push origin main
```

That's it! Your code is now on GitHub. ✅

---

## Step 2: Go to vercel.com

1. Sign in with GitHub
2. Click **"Add New..." → "Project"**
3. Select **crm-app** repository
4. Click **"Import"**

---

## Step 3: Add Environment Variables

When Vercel shows the configuration screen, scroll to **"Environment Variables"** and add 3 variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From your `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From your `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | From your `.env.local` |

**Get these from:** Supabase Dashboard → Settings → API

---

## Step 4: Click "Deploy"

⏳ Wait 2-3 minutes for the build to complete.

You'll see:
```
✓ Compiled successfully
✓ Ready
```

---

## Step 5: Test Your Live App

**Copy the URL shown** (e.g., `https://crm-app-abc123.vercel.app`)

Test in browser:
- [ ] Login with test credentials
- [ ] Create customer (admin)
- [ ] View customer (employee)
- [ ] Toggle status
- [ ] Schedule meeting
- [ ] View calendar

---

## ✅ You're Live!

Every time you push to GitHub, Vercel auto-deploys in 2-3 minutes.

---

## Troubleshooting

**If build fails:** Check `.env.local` file is not in git (in `.gitignore` ✅)

**If login doesn't work:** Verify Supabase credentials in Vercel environment variables

**If features missing:** Run database migrations from `MIGRATIONS.md` in Supabase

**See full guide:** Read `DEPLOYMENT.md`

---

**Your CRM is now production-ready. Deploy in 5 minutes!** 🎉
