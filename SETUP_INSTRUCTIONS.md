# SmoothCoders Setup Instructions

## 🚀 Quick Setup (Recommended)

Run this single command to set up everything automatically:

```bash
npm run setup
```

This will:
1. ✅ Seed the database with services, cities, and admin user
2. ✅ Generate all city/service pages automatically

**That's it!** Your application is now fully set up and ready to use.

---

## 📋 Manual Setup (Alternative)

If you prefer to run steps individually:

### Step 1: Seed Database

Populate your database with services, cities, and admin user:

```bash
npm run seed
```

**Creates:**
- 🔑 Admin user: `admin@smoothcoders.com` / `SmoothAdmin@2024`
- 🛠️ **6 Services** with complete pricing packages (Basic, Standard, Premium):
  - Website Design & Development
  - Mobile App Development
  - Digital Marketing
  - E-commerce Development
  - SEO Optimization
  - Branding & Design
- 📍 **6 Indian Cities**:
  - Pune, Mumbai, Bangalore, Hyderabad, Delhi, Chennai

### Step 2: Generate Service Pages

Generate all city/service combination pages:

```bash
npm run generate-pages
```

**Creates:**
- 36 dynamic pages (6 cities × 6 services)
- SEO-optimized content for each city/service combination
- Examples: `/pune/website-design-development`, `/mumbai/mobile-app-development`

---

## ✅ Verification

After setup, verify everything works:

1. **Homepage** (`/`): Should display all 6 services
2. **Services Page** (`/services/website-design-development`): Shows pricing tiers and packages
3. **City Pages** (`/pune/website-design-development`): Shows city-specific content with pricing

---

## 🔧 Troubleshooting

### Error: "Cannot read properties of null (reading 'title')"

**Cause:** Service pages haven't been generated yet.

**Solution:**
```bash
npm run generate-pages
```

### Homepage shows "Loading services..."

**Cause:** Database is empty.

**Solution:**
```bash
npm run seed
```

### City pages return 404

**Cause:** Service pages not generated for that city.

**Solution:**
```bash
npm run generate-pages
```

### Want to start fresh?

To reset everything and start over:

```bash
npm run setup
```

This will clear existing data and rebuild everything.

---

## 📊 Database Models

Your application is **100% database-driven**:

| Model | Purpose | Count After Setup |
|-------|---------|-------------------|
| **User** | Admin authentication | 1 admin user |
| **Service** | Service definitions with pricing | 6 services |
| **City** | City information | 6 cities |
| **ServicePage** | Generated SEO pages | 36 pages |

**No hardcoded values on the frontend!**

---

## 🎨 Managing Content

### Add/Edit Services

1. Login at `/admin`
2. Navigate to "Services"
3. Click any service to edit pricing tiers
4. All changes reflect immediately on the website

### Add More Cities

1. Login at `/admin`
2. Go to "Cities" → "Add New City"
3. Fill in city details
4. Run: `npm run generate-pages`

### Modify Pricing

All pricing is in the database. Edit via:
- Admin panel: `/admin/services/[id]/edit`
- Each service has 3 pricing tiers you can customize

---

## 🔐 Admin Credentials

- **Email:** admin@smoothcoders.com
- **Password:** SmoothAdmin@2024
- **Admin URL:** `/admin`

Change these after first login!
