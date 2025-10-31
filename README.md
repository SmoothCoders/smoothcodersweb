# 🚀 SmoothCoders - Full-Stack Digital Agency Website

A complete, production-ready, and SEO-optimized service-selling website built with **Next.js 14**, **TypeScript**, **MongoDB**, **Razorpay**, and professional animations.

## ✨ Features

### 🎨 Front-End
- **Modern UI/UX** with Framer Motion animations
- **Fully Responsive** design for all devices
- **SEO Optimized** with dynamic meta tags and structured data
- **Professional Animations** using Framer Motion and GSAP
- Pages: Home, About, Services, Portfolio, Testimonials, Blog, Contact

### 🔐 Admin Panel
- **Secure Authentication** with NextAuth.js
- **Dashboard** with analytics and statistics
- **CRUD Operations** for Services, Projects, Testimonials, Blog Posts
- **Contact Management** to view and manage inquiries
- **Payment History** to track Razorpay transactions
- **SEO Settings** for global and per-page SEO management

### 💳 Payment Integration
- **Razorpay Integration** for online payments
- Create orders and verify payments
- Transaction history and analytics

### 🔍 SEO & Performance
- Dynamic meta tags for all pages
- Automatic sitemap.xml generation
- robots.txt configuration
- JSON-LD structured data
- Open Graph and Twitter Card tags
- Optimized images with next/image
- 90+ Lighthouse score ready

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion, GSAP, Lottie
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **Payment:** Razorpay
- **Icons:** Lucide React
- **Form Handling:** React Hook Form with Zod validation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Razorpay account (for payments)

### 1. Clone or Navigate to the Project
```bash
cd smoothcoders-app
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (already created, but update values):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/smoothcoders
# For production: mongodb+srv://username:password@cluster.mongodb.net/smoothcoders

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin Credentials
ADMIN_EMAIL=admin@smoothcoders.com
ADMIN_PASSWORD=SmoothAdmin@2024

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# OpenAI (Optional - for AI SEO features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### 4. Setup MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas.

### 5. Seed the Database
```bash
npm run seed
```

This will create:
- Admin user (admin@smoothcoders.com / SmoothAdmin@2024)
- Sample services, projects, testimonials, blog posts
- SEO settings for all pages

### 6. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🔑 Admin Access

- **URL:** http://localhost:3000/admin/login
- **Email:** admin@smoothcoders.com
- **Password:** SmoothAdmin@2024

## 📁 Project Structure

```
smoothcoders-app/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel pages
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── services/        # Manage services
│   │   ├── contacts/        # View contacts
│   │   └── login/           # Admin login
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── services/       # Services CRUD
│   │   ├── contact/        # Contact form
│   │   └── razorpay/       # Payment endpoints
│   ├── contact/            # Contact page
│   ├── services/           # Services page
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── animations/         # Animation wrappers
│   ├── home/               # Home page sections
│   ├── layout/             # Header, Footer
│   └── ui/                 # UI components
├── lib/                     # Utilities
│   ├── mongodb.ts          # Database connection
│   ├── auth.ts             # NextAuth configuration
│   └── utils.ts            # Helper functions
├── models/                  # Mongoose models
│   ├── Service.ts
│   ├── Project.ts
│   ├── Testimonial.ts
│   ├── Blog.ts
│   ├── Payment.ts
│   ├── Contact.ts
│   └── User.ts
└── scripts/                 # Utility scripts
    └── seed.ts             # Database seeding
```

## 🎯 Key Features Explained

### Payment Flow
1. User selects a service and clicks "Buy Now"
2. Customer details are collected
3. Razorpay order is created via `/api/razorpay/create-order`
4. Razorpay checkout modal opens
5. After payment, verification happens at `/api/razorpay/verify-payment`
6. Transaction is saved in MongoDB

### Admin Panel Features
- **Dashboard:** Overview with stats and quick links
- **Services:** Add, edit, delete services with pricing
- **Projects:** Manage portfolio projects
- **Testimonials:** Add client testimonials
- **Blog:** Create and manage blog posts
- **Contacts:** View contact form submissions
- **Payments:** Track all Razorpay transactions
- **SEO:** Manage meta tags for each page

### SEO Features
- Dynamic meta titles and descriptions
- Automatic sitemap generation
- JSON-LD structured data
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- Image optimization

## 📱 API Endpoints

### Public APIs
- `GET /api/services` - Fetch all active services
- `POST /api/contact` - Submit contact form
- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment

### Admin APIs (Protected)
- `POST /api/services` - Create service
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service
- Similar endpoints for projects, testimonials, blog, etc.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Build command
npm run build

# Output directory
.next
```

### Environment Variables for Production
Make sure to add all variables from `.env.local` to your hosting platform.

## 🔒 Security Features

- HTTPS enforced
- Input sanitization
- CSRF protection
- Secure password hashing with bcrypt
- JWT-based authentication
- Rate limiting ready

## 🎨 Customization

### Update Company Info
Edit `/components/layout/Footer.tsx` and `/components/layout/Header.tsx`

### Change Colors
Modify Tailwind configuration in `tailwind.config.ts`

### Add New Services
Use the admin panel or directly update via MongoDB

## 📊 Performance

- Server-side rendering for SEO
- Image optimization with next/image
- Code splitting and lazy loading
- Optimized bundle size
- Fast page transitions
- Target: 90+ Lighthouse score

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env.local`

### Admin Login Not Working
- Run `npm run seed` to create admin user
- Check NEXTAUTH_SECRET is set

### Razorpay Not Working
- Add valid Razorpay keys
- Ensure keys are in both `.env.local` and exposed as NEXT_PUBLIC_ for client-side

## 📄 License

This project is built for SmoothCoders. All rights reserved.

## 👨‍💻 Support

For issues or questions:
- Email: contact@smoothcoders.com
- Phone: +91 9021311559
- Location: Pune, Maharashtra, India

## 🎉 Features Coming Soon

- Multi-language support
- Advanced analytics dashboard
- Email notifications for contact forms
- Blog categories and tags filtering
- Advanced SEO audit tools
- AI-powered content suggestions

---

**Built with ❤️ by SmoothCoders Team**
# 🚀 Auto-deploy is working!
