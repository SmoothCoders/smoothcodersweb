# 🚀 Deployment Guide - SmoothCoders Website

Complete guide to deploy your SmoothCoders website to production.

## 📋 Pre-Deployment Checklist

- [ ] Update `.env.local` with production values
- [ ] Test all features locally
- [ ] Run `npm run build` to check for build errors
- [ ] Set up MongoDB Atlas (production database)
- [ ] Create Razorpay account and get live API keys
- [ ] Prepare custom domain (optional)

## 🌐 Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/smoothcoders.git
   git push -u origin main
   ```

2. **Check Build Locally**
   ```bash
   npm run build
   npm start
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

4. **Add Environment Variables**
   Go to Project Settings → Environment Variables and add:

   ```env
   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smoothcoders?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=generate-a-strong-secret-key-here

   # Admin
   ADMIN_EMAIL=admin@smoothcoders.com
   ADMIN_PASSWORD=YourStrongPassword123!

   # Razorpay LIVE Keys
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_secret_key

   # OpenAI (Optional)
   OPENAI_API_KEY=sk-your-openai-key

   # Site URL
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site is live! 🎉

### Step 3: Post-Deployment

1. **Seed Production Database**
   ```bash
   # Update MONGODB_URI in .env.local to production
   npm run seed
   ```

2. **Test Everything**
   - Test all pages
   - Test contact form
   - Test payment flow with Razorpay test mode first
   - Test admin login
   - Check SEO tags (View Page Source)

3. **Enable Razorpay Live Mode**
   - Switch to live keys in Razorpay dashboard
   - Update environment variables in Vercel
   - Redeploy

## 🔧 Deploy to Other Platforms

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build for Netlify**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`

### Deploy to Railway

1. **Create account at [railway.app](https://railway.app)**

2. **Create New Project**
   - Connect GitHub repository
   - Railway auto-detects Next.js

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all environment variables

4. **Deploy**
   - Railway will auto-deploy on git push

### Deploy to DigitalOcean App Platform

1. **Create DigitalOcean Account**

2. **Create New App**
   - Connect GitHub
   - Select repository

3. **Configure**
   ```
   Build Command: npm install --legacy-peer-deps && npm run build
   Run Command: npm start
   ```

4. **Add Environment Variables**

5. **Deploy**

## 🗄️ MongoDB Atlas Setup (Production Database)

### Step 1: Create Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (M0 Free tier is sufficient to start)

### Step 2: Configure Database

1. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Save username and password

2. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Or add Vercel's IP ranges

3. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://admin:mypassword@cluster0.xxxxx.mongodb.net/smoothcoders`

4. **Update Environment Variables**
   - Update `MONGODB_URI` in Vercel/your platform
   - Redeploy

## 💳 Razorpay Production Setup

### Step 1: Account Activation

1. Complete KYC on [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Activate your account (usually takes 1-2 business days)

### Step 2: Get Live API Keys

1. Go to Settings → API Keys
2. Generate Live Keys
3. Copy Key ID and Key Secret
4. **IMPORTANT:** Keep secret key secure, never commit to git

### Step 3: Webhook Setup (Optional)

1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/razorpay/webhook`
3. Select events to listen for
4. Save webhook secret

### Step 4: Update Environment

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

## 🌐 Custom Domain Setup

### For Vercel

1. **Go to Project Settings → Domains**
2. **Add your domain**
   - Example: `smoothcoders.com`
   - Example: `www.smoothcoders.com`

3. **Configure DNS**
   - Add A record: `76.76.21.21`
   - Add CNAME: `cname.vercel-dns.com`

4. **Wait for DNS Propagation** (~5 minutes to 48 hours)

5. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Your site will be HTTPS

## 🔐 Security Best Practices

### Before Going Live

1. **Change Admin Password**
   ```typescript
   // In admin panel or via MongoDB
   ```

2. **Secure API Routes**
   - Ensure protected routes check authentication
   - Add rate limiting

3. **Update CORS Settings**
   ```typescript
   // In next.config.js if needed
   ```

4. **Enable Security Headers**
   ```javascript
   // Already configured in next.config.js
   ```

5. **Environment Variables**
   - Never commit `.env.local`
   - Use strong secrets
   - Rotate keys periodically

## 📊 Post-Deployment Monitoring

### Analytics Setup

1. **Google Analytics**
   - Add tracking code in `app/layout.tsx`

2. **Vercel Analytics**
   - Enable in project settings
   - Free for personal projects

### Error Monitoring

1. **Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   - Add DSN to environment variables
   - Initialize in `app/layout.tsx`

### Performance Monitoring

1. **Vercel Speed Insights**
   - Automatically enabled
   - View in Vercel dashboard

2. **Lighthouse CI**
   - Run regular audits
   - Maintain 90+ score

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

1. **Vercel**
   - Auto-deploys on push to main branch
   - Preview deployments for PRs

2. **GitHub Actions** (Optional)
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: vercel/action@v1
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
   ```

## 🐛 Troubleshooting Production Issues

### Build Failures

```bash
# Check build locally
npm run build

# Clear cache
rm -rf .next
rm -rf node_modules
npm install --legacy-peer-deps
npm run build
```

### Database Connection Errors

- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection with MongoDB Compass

### Payment Issues

- Verify Razorpay keys are correct
- Check webhook configuration
- Test with Razorpay test mode first

### SEO Issues

- Verify meta tags in page source
- Check robots.txt: `https://your-domain.com/robots.txt`
- Submit sitemap to Google Search Console

## 📱 Progressive Web App (Optional)

Convert to PWA:

```bash
npm install next-pwa
```

Configure in `next.config.js`:
```javascript
const withPWA = require('next-pwa');

module.exports = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});
```

## 🎯 Performance Optimization

### Image Optimization

- Use `next/image` for all images
- Serve images from CDN
- Use WebP format

### Code Splitting

- Already handled by Next.js
- Dynamic imports for heavy components

### Caching

- Configure cache headers
- Use CDN (Vercel Edge Network)

### Database Indexing

```javascript
// In MongoDB
db.services.createIndex({ slug: 1 })
db.blog.createIndex({ published: 1, publishedAt: -1 })
```

## 📈 Scaling Considerations

### Database

- Monitor MongoDB Atlas metrics
- Upgrade to paid tier when needed
- Add indexes for frequent queries

### API Rate Limiting

```typescript
// Implement in middleware
export function middleware(request) {
  // Rate limiting logic
}
```

### CDN

- Vercel Edge Network (included)
- Cloudflare (optional)
- AWS CloudFront (enterprise)

## ✅ Launch Checklist

- [ ] Domain configured and SSL active
- [ ] Database seeded with production data
- [ ] All environment variables set
- [ ] Razorpay in live mode
- [ ] Admin panel accessible
- [ ] Contact form working
- [ ] Payment flow tested
- [ ] All pages loading correctly
- [ ] Mobile responsive verified
- [ ] SEO tags present
- [ ] Sitemap submitted to Google
- [ ] Analytics tracking active
- [ ] Error monitoring setup
- [ ] Backup strategy in place

## 🎉 You're Live!

Your SmoothCoders website is now live and ready to accept clients!

### Next Steps

1. **Marketing**
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools
   - Share on social media

2. **Monitoring**
   - Check analytics daily
   - Monitor error logs
   - Track conversion rates

3. **Maintenance**
   - Regular backups
   - Security updates
   - Content updates

## 📞 Support

Need help with deployment?
- Email: contact@smoothcoders.com
- Phone: +91 9021311559

---

**Good luck with your launch! 🚀**
