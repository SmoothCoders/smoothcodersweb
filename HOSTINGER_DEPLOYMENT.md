# Hostinger Deployment Guide

## ✅ Code Committed Successfully
All your latest changes have been committed to Git:
- Compact checkout form
- Admin panel fixes
- Compare packages table
- Database integration
- Clean, modern UI

---

## 🚀 Deployment Steps

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `smoothcoders-app`
3. **Visibility:** Private (recommended) or Public
4. **DO NOT** initialize with README (we already have code)
5. Click "Create repository"

### Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /Users/mac/Work/Development/SmoothCoders/smoothcoders-app

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/smoothcoders-app.git

# Push code to GitHub
git push -u origin main
```

If prompted, enter your GitHub credentials or use a Personal Access Token.

---

### Step 3: Connect to Hostinger

Based on your screenshot, follow these steps on Hostinger:

1. **In Hostinger Panel:**
   - Go to: Websites → appdove.pro → Advanced → GIT
   - You're already on the right page!

2. **Create a New Repository:**
   - **Repository:** Enter your GitHub repo URL:
     ```
     https://github.com/YOUR_USERNAME/smoothcoders-app.git
     ```
   
   - **Branch:** `main`
   
   - **Directory (optional):** Leave blank (deploys to `public_html`)
   
   - Click "Create"

3. **Configure Build Settings:**
   After connecting, you'll need to set up the build commands.

---

### Step 4: Hostinger Build Configuration

In Hostinger's deployment settings, configure:

**Build Command:**
```bash
npm install && npm run build
```

**Node Version:**
```
18
```

**Environment Variables:**
Add these in Hostinger → Advanced → PHP Configuration → Environment Variables:

```
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://appdove.pro
NEXT_PUBLIC_API_URL=https://appdove.pro
```

---

### Step 5: Deploy

1. In Hostinger GIT panel, click "Pull Changes"
2. Hostinger will automatically:
   - Pull code from GitHub
   - Run `npm install`
   - Run `npm run build`
   - Deploy to your domain

---

## 🔐 Environment Variables Required

Make sure to set these in Hostinger:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/smoothcoders` |
| `NEXTAUTH_SECRET` | Auth secret key | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your domain URL | `https://appdove.pro` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `https://appdove.pro` |

---

## 📋 Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Services pages work (`/services`)
- [ ] Generated city pages work (`/pune/website-design-development`)
- [ ] Admin panel accessible (`/admin`)
- [ ] Database connection works
- [ ] Forms submit successfully
- [ ] Pricing comparison shows correctly
- [ ] Checkout modal works

---

## 🛠️ Troubleshooting

### Issue: Build Fails
**Solution:** Check Node version is 18+ in Hostinger settings

### Issue: Database Connection Error
**Solution:** Verify `MONGODB_URI` is correctly set with your MongoDB Atlas connection string

### Issue: 404 on Generated Pages
**Solution:** 
1. Ensure `next.config.mjs` has `output: 'standalone'`
2. Run page generation after deployment:
   ```bash
   npm run generate:pages
   ```

### Issue: Environment Variables Not Working
**Solution:** Set them in Hostinger's PHP Configuration, not in the code

---

## 🔄 Future Updates

To deploy updates:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. In Hostinger GIT panel, click "Pull Changes"
4. Hostinger will auto-rebuild and deploy

---

## 📞 Support

If you encounter issues:
- Hostinger Support: Live chat in your panel
- Check Hostinger deployment logs for errors
- Verify all environment variables are set correctly

---

## ✅ Your App Features (All Working)

- ✅ Dynamic service pages for all cities
- ✅ Compact checkout form with Place Order/Chat buttons
- ✅ Admin panel with inquiries management
- ✅ Compare packages table (clean Fiverr design)
- ✅ No hardcoded pricing values
- ✅ Complete database integration
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Fast loading with Next.js

**Your app is production-ready!** 🎉
