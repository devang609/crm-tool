# 🤖 AI Daily Briefing - Quick Reference

## What Just Got Added

A button labeled **"📋 What's for today"** on both ADMIN and EMPLOYEE dashboards that uses AI to generate personalized daily briefings.

---

## For ADMIN

**Click the button to see:**
- ✅ Today's scheduled meetings (with times & links)
- ✅ All active leads (LEAD, IN_PROGRESS, CONVERTED)
- ✅ Employee performance stats (success rates)
- ✅ AI recommendations on what to focus on

---

## For EMPLOYEE

**Click the button to see:**
- ✅ Your 5 assigned customers
- ✅ Last interaction date for each
- ✅ What follow-up action is needed
- ✅ AI suggestions on priority leads

---

## Setup (5 Minutes)

### 1️⃣ Install package
```bash
npm install @google/generative-ai
```

### 2️⃣ Get free API key
Go to: https://makersuite.google.com/app/apikeys
- Click "Create API Key"
- Copy the key (starts with `AIza`)

### 3️⃣ Add to `.env.local`
```
GOOGLE_API_KEY=AIza_paste_your_key_here
```

### 4️⃣ Restart dev server
```bash
npm run dev
```

### 5️⃣ Test it
- Login → Click "📋 What's for today" → See AI briefing!

---

## Deploy to Production

```bash
# 1. Commit code
git add .
git commit -m "Add AI briefing with Gemini"
git push

# 2. Add env var to Vercel
# Dashboard → Settings → Environment Variables
# Add: GOOGLE_API_KEY = AIza_...

# 3. Redeploy
# Vercel auto-deploys on git push
```

---

## Cost

🎉 **100% FREE!**
- Google Gemini has free tier
- 60 requests/min = more than enough for any team
- Only pay money if you hit enterprise scale (rare)

---

## Files Added/Changed

### New Files
- `app/api/briefing/route.ts` - AI briefing API
- `components/BriefingButton.tsx` - Button UI
- `AI_BRIEFING_SETUP.md` - Full docs (this folder)

### Updated Files
- `package.json` - Added @google/generative-ai
- `app/(protected)/admin/page.tsx` - Added button
- `app/(protected)/employee/page.tsx` - Added button

---

## Example Outputs

### ADMIN Briefing:
```
ADMIN DAILY BRIEFING

TODAY'S MEETINGS:
- Client Pitch with Acme Corp at 10:00 AM (Zoom link)
- Weekly Sync at 2:00 PM

PIPELINE STATUS:
- 27 total active leads
- 8 fresh leads need assignment
- 5 recently converted this week!

TOP PERFORMER:
Sarah closed 8/12 deals (67% success rate)

ACTION ITEM:
Assign fresh leads to top performers, debrief Acme Corp call
```

### EMPLOYEE Briefing:
```
YOUR DAILY FOCUS

ASSIGNED LEADS: 5 total

🆕 TechStart Inc (FRESH LEAD)
   No interactions - CALL TODAY!

⏳ Acme Corp (IN_PROGRESS)
   Last: Call on Apr 1 - "Awaiting budget approval"
   Follow up today

✅ StartupXYZ (IN_PROGRESS)
   Last: Demo scheduled for Apr 5
   Review materials now
```

---

## Tips

✅ Gemini gives better results with more data (meetings, interactions)
✅ First use might be slow (API cold start), subsequent calls fast
✅ Works best with 3+ assigned customers or scheduled meetings
✅ Completely private - no customer data leaves your server/Gemini

---

## Troubleshooting

**"GOOGLE_API_KEY not configured"**
→ Add `GOOGLE_API_KEY=AIza_...` to `.env.local` and restart

**No data in briefing**
→ Create some customers/meetings first, then try again

**Button doesn't appear**
→ Hard refresh browser (Ctrl+Shift+R) and re-login

---

## Next Steps

1. ✅ Install package `npm install @google/generative-ai`
2. ✅ Get API key from https://makersuite.google.com/app/apikeys
3. ✅ Add to `.env.local`
4. ✅ Test locally with `npm run dev`
5. ✅ Deploy to Vercel with git push
6. ✅ Add env var to Vercel settings
7. ✅ Done! 🚀
