import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Import models
import User from '../lib/models/User';
import Service from '../lib/models/Service';
import City from '../lib/models/City';
// import Project from '../lib/models/Project';
// import Testimonial from '../lib/models/Testimonial';
// import Blog from '../lib/models/Blog';
// import SeoSettings from '../lib/models/SeoSettings';

const MONGODB_URI = process.env.MONGODB_URI!;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await City.deleteMany({});
    // await Project.deleteMany({});
    // await Testimonial.deleteMany({});
    // await Blog.deleteMany({});
    // await SeoSettings.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('SmoothAdmin@2024', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@smoothcoders.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created');

    // Seed Services
    const services = [
      {
        title: 'Website Design & Development',
        slug: 'website-design-development',
        description: 'Create stunning, responsive websites that engage your audience and drive results. Our expert team builds modern, fast, and SEO-optimized websites using the latest technologies.',
        shortDescription: 'Professional web design and development services',
        icon: 'Globe',
        price: 25000,
        category: 'Web Development',
        features: [
          'Responsive Design',
          'SEO Optimization',
          'Fast Loading Speed',
          'Custom CMS',
          'Security Features',
          'Analytics Integration',
        ],
        pricingTiers: {
          basic: {
            name: 'Basic',
            title: 'ONE PAGE WEBSITE',
            description: 'Perfect for startups and small businesses looking to establish online presence',
            priceINR: 15000,
            priceUSD: 180,
            features: [
              'Single page responsive website',
              'Mobile-friendly design',
              'Contact form integration',
              'Basic SEO setup',
              '1 month free support',
              'Fast loading optimization',
            ],
            deliveryDays: 7,
            revisions: '2',
          },
          standard: {
            name: 'Standard',
            title: 'MULTI-PAGE WEBSITE',
            description: 'Ideal for growing businesses with 5-7 pages including advanced features',
            priceINR: 35000,
            priceUSD: 420,
            features: [
              'Up to 7 pages responsive website',
              'Custom design & branding',
              'Contact & inquiry forms',
              'Google Maps integration',
              'Social media integration',
              'Advanced SEO optimization',
              'Content Management System',
              '3 months free support',
              'SSL certificate setup',
            ],
            deliveryDays: 14,
            revisions: '5',
          },
          premium: {
            name: 'Premium',
            title: 'ENTERPRISE WEBSITE',
            description: 'Custom enterprise solution - Contact us for a tailored quote',
            priceINR: 0,
            priceUSD: 0,
            contactForPricing: true,
            features: [
              'Unlimited pages responsive website',
              'Premium custom design',
              'Advanced animations & interactions',
              'Blog/News section with CMS',
              'Newsletter integration',
              'Live chat integration',
              'Advanced SEO & analytics',
              'Performance optimization',
              '6 months free support',
              'Priority updates',
              'Free domain & hosting setup',
            ],
            deliveryDays: 21,
            revisions: 'Unlimited',
          },
        },
        image: '/images/services/web-development.jpg',
        seo: {
          metaTitle: 'Website Design & Development Services | SmoothCoders',
          metaDescription: 'Professional website design and development services in Pune. Create stunning, responsive websites that drive results.',
          keywords: ['web development', 'website design', 'responsive design', 'pune'],
        },
        seoTitle: 'Website Design & Development Services | SmoothCoders',
        seoDescription: 'Professional website design and development services in Pune. Create stunning, responsive websites that drive results.',
        isActive: true,
        order: 1,
      },
      {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        description: 'Build powerful mobile applications for iOS and Android. We create intuitive, feature-rich apps that users love and businesses need.',
        shortDescription: 'Native and cross-platform mobile app development',
        icon: 'Smartphone',
        price: 50000,
        category: 'Mobile App',
        features: [
          'iOS & Android Development',
          'Cross-Platform Solutions',
          'UI/UX Design',
          'API Integration',
          'Push Notifications',
          'App Store Deployment',
        ],
        pricingTiers: {
          basic: {
            name: 'Basic',
            title: 'SINGLE PLATFORM APP',
            description: 'Essential mobile app for either iOS or Android with core features',
            priceINR: 50000,
            priceUSD: 600,
            features: [
              'iOS or Android (single platform)',
              'Up to 5 screens/pages',
              'Basic UI/UX design',
              'User authentication',
              'Basic API integration',
              'App store submission',
              '2 months support',
            ],
            deliveryDays: 30,
            revisions: '3',
          },
          standard: {
            name: 'Standard',
            title: 'CROSS-PLATFORM APP',
            description: 'Professional app for both iOS and Android with advanced features',
            priceINR: 120000,
            priceUSD: 1440,
            features: [
              'iOS & Android (cross-platform)',
              'Up to 15 screens/pages',
              'Custom UI/UX design',
              'User authentication & profiles',
              'Advanced API integration',
              'Push notifications',
              'In-app messaging',
              'Analytics integration',
              'App store submission (both)',
              '4 months support',
            ],
            deliveryDays: 60,
            revisions: '5',
          },
          premium: {
            name: 'Premium',
            title: 'ENTERPRISE MOBILE APP',
            description: 'Custom enterprise solution - Contact us for a tailored quote',
            priceINR: 0,
            priceUSD: 0,
            contactForPricing: true,
            features: [
              'iOS & Android native development',
              'Unlimited screens/features',
              'Premium custom UI/UX',
              'Advanced backend integration',
              'Real-time features',
              'Payment gateway integration',
              'Social media integration',
              'Advanced analytics & reporting',
              'Admin panel included',
              'Cloud infrastructure setup',
              '12 months priority support',
              'Regular updates & maintenance',
            ],
            deliveryDays: 90,
            revisions: 'Unlimited',
          },
        },
        image: '/images/services/app-development.jpg',
        seo: {
          metaTitle: 'Mobile App Development Services | SmoothCoders',
          metaDescription: 'Professional mobile app development for iOS and Android in Pune. Build powerful apps that users love.',
          keywords: ['mobile app development', 'ios development', 'android development', 'pune'],
        },
        seoTitle: 'Mobile App Development Services | SmoothCoders',
        seoDescription: 'Professional mobile app development for iOS and Android in Pune. Build powerful apps that users love.',
        isActive: true,
        order: 2,
      },
      {
        title: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Grow your business online with our comprehensive digital marketing services. From SEO to social media, we help you reach and engage your target audience.',
        shortDescription: 'Complete digital marketing solutions',
        icon: 'TrendingUp',
        price: 15000,
        category: 'Digital Marketing',
        features: [
          'SEO Optimization',
          'Social Media Marketing',
          'Content Marketing',
          'PPC Advertising',
          'Email Marketing',
          'Analytics & Reporting',
        ],
        pricingTiers: {
          basic: {
            name: 'Basic',
            title: 'STARTER MARKETING PACKAGE',
            description: 'Essential digital marketing for small businesses',
            priceINR: 15000,
            priceUSD: 180,
            features: [
              'Social media management (2 platforms)',
              'Content creation (8 posts/month)',
              'Basic SEO optimization',
              'Monthly performance report',
              'Competitor analysis',
              'Email support',
            ],
            deliveryDays: 30,
            revisions: '2',
          },
          standard: {
            name: 'Standard',
            title: 'GROWTH MARKETING PACKAGE',
            description: 'Comprehensive marketing for growing businesses',
            priceINR: 35000,
            priceUSD: 420,
            features: [
              'Social media management (4 platforms)',
              'Content creation (20 posts/month)',
              'Advanced SEO & content marketing',
              'Google Ads management',
              'Email marketing campaigns',
              'Bi-weekly performance reports',
              'Brand strategy consultation',
              'Priority support',
            ],
            deliveryDays: 30,
            revisions: '5',
          },
          premium: {
            name: 'Premium',
            title: 'ENTERPRISE MARKETING',
            description: 'Custom enterprise solution - Contact us for a tailored quote',
            priceINR: 0,
            priceUSD: 0,
            contactForPricing: true,
            features: [
              'Complete social media management',
              'Premium content creation (40+ posts/month)',
              'Advanced SEO with link building',
              'Multi-channel PPC campaigns',
              'Email marketing automation',
              'Influencer outreach',
              'Weekly analytics & insights',
              'Dedicated account manager',
              'Custom marketing strategies',
              '24/7 priority support',
            ],
            deliveryDays: 30,
            revisions: 'Unlimited',
          },
        },
        image: '/images/services/digital-marketing.jpg',
        seo: {
          metaTitle: 'Digital Marketing Services | SmoothCoders',
          metaDescription: 'Comprehensive digital marketing services in Pune. Grow your business with SEO, social media, and more.',
          keywords: ['digital marketing', 'seo', 'social media marketing', 'pune'],
        },
        seoTitle: 'Digital Marketing Services | SmoothCoders',
        seoDescription: 'Comprehensive digital marketing services in Pune. Grow your business with SEO, social media, and more.',
        isActive: true,
        order: 3,
      },
      {
        title: 'E-commerce Development',
        slug: 'ecommerce-development',
        description: 'Launch your online store with our e-commerce development services. We build secure, scalable online stores that convert visitors into customers.',
        shortDescription: 'Powerful e-commerce solutions',
        icon: 'ShoppingCart',
        price: 40000,
        category: 'E-commerce',
        features: [
          'Custom E-commerce Platforms',
          'Payment Gateway Integration',
          'Inventory Management',
          'Shopping Cart',
          'Order Tracking',
          'Mobile Commerce',
        ],
        pricingTiers: {
          basic: {
            name: 'Basic',
            title: 'BASIC ONLINE STORE',
            description: 'Perfect for startups with up to 50 products',
            priceINR: 40000,
            priceUSD: 480,
            features: [
              'Up to 50 products',
              'Responsive e-commerce website',
              'Shopping cart & checkout',
              'Payment gateway (1 method)',
              'Basic inventory management',
              'Order management',
              'Customer accounts',
              'Email notifications',
              '2 months support',
            ],
            deliveryDays: 21,
            revisions: '3',
          },
          standard: {
            name: 'Standard',
            title: 'PROFESSIONAL ONLINE STORE',
            description: 'Complete solution for growing e-commerce businesses',
            priceINR: 85000,
            priceUSD: 1020,
            features: [
              'Up to 500 products',
              'Custom e-commerce design',
              'Advanced shopping cart',
              'Multiple payment gateways',
              'Advanced inventory system',
              'Order tracking & management',
              'Customer wish lists',
              'Product reviews & ratings',
              'Email & SMS notifications',
              'Coupon & discount system',
              'Basic analytics dashboard',
              '4 months support',
            ],
            deliveryDays: 35,
            revisions: '5',
          },
          premium: {
            name: 'Premium',
            title: 'ENTERPRISE E-COMMERCE',
            description: 'Custom enterprise solution - Contact us for a tailored quote',
            priceINR: 0,
            priceUSD: 0,
            contactForPricing: true,
            features: [
              'Unlimited products',
              'Premium custom design',
              'Multi-vendor marketplace option',
              'Multiple currencies & languages',
              'Advanced payment integrations',
              'Inventory & warehouse management',
              'Advanced shipping integration',
              'Product variants & bundles',
              'Customer loyalty program',
              'Advanced analytics & reporting',
              'SEO optimization',
              'Mobile app integration',
              'Admin panel with CRM',
              '12 months priority support',
            ],
            deliveryDays: 60,
            revisions: 'Unlimited',
          },
        },
        image: '/images/services/ecommerce.jpg',
        seo: {
          metaTitle: 'E-commerce Development Services | SmoothCoders',
          metaDescription: 'Professional e-commerce development in Pune. Build secure, scalable online stores that drive sales.',
          keywords: ['ecommerce development', 'online store', 'shopping cart', 'pune'],
        },
        seoTitle: 'E-commerce Development Services | SmoothCoders',
        seoDescription: 'Professional e-commerce development in Pune. Build secure, scalable online stores that drive sales.',
        isActive: true,
        order: 4,
      },
      {
        title: 'SEO Optimization',
        slug: 'seo-optimization',
        description: 'Improve your search engine rankings and drive organic traffic. Our SEO experts optimize your website for maximum visibility and conversions.',
        shortDescription: 'Advanced SEO services',
        icon: 'Search',
        price: 12000,
        category: 'Digital Marketing',
        features: [
          'Keyword Research',
          'On-Page SEO',
          'Technical SEO',
          'Link Building',
          'Content Optimization',
          'Performance Monitoring',
        ],
        pricingTiers: {
          basic: {
            name: 'Basic',
            title: 'LOCAL SEO PACKAGE',
            description: 'Essential SEO for local businesses and startups',
            priceINR: 12000,
            priceUSD: 144,
            features: [
              'Keyword research (10 keywords)',
              'On-page SEO optimization',
              'Google My Business setup',
              'Local citations (10 listings)',
              'Monthly progress report',
              'Technical SEO audit',
              'Meta tags optimization',
            ],
            deliveryDays: 30,
            revisions: '2',
          },
          standard: {
            name: 'Standard',
            title: 'ADVANCED SEO PACKAGE',
            description: 'Comprehensive SEO for growing businesses',
            priceINR: 25000,
            priceUSD: 300,
            features: [
              'Keyword research (30 keywords)',
              'Complete on-page optimization',
              'Technical SEO fixes',
              'Content optimization (5 pages)',
              'Link building (20 backlinks/month)',
              'Local SEO & citations',
              'Competitor analysis',
              'Google Analytics setup',
              'Bi-weekly reports',
            ],
            deliveryDays: 30,
            revisions: '5',
          },
          premium: {
            name: 'Premium',
            title: 'ENTERPRISE SEO',
            description: 'Custom enterprise solution - Contact us for a tailored quote',
            priceINR: 0,
            priceUSD: 0,
            contactForPricing: true,
            features: [
              'Unlimited keyword targeting',
              'Complete website optimization',
              'Advanced technical SEO',
              'Content creation & optimization',
              'Premium link building (50+ backlinks)',
              'Schema markup implementation',
              'E-commerce SEO (if applicable)',
              'Conversion rate optimization',
              'Dedicated SEO manager',
              'Weekly detailed reports',
              'Priority support',
            ],
            deliveryDays: 30,
            revisions: 'Unlimited',
          },
        },
        image: '/images/services/seo.jpg',
        seo: {
          metaTitle: 'SEO Optimization Services | SmoothCoders',
          metaDescription: 'Professional SEO services in Pune. Improve rankings, drive traffic, and grow your business online.',
          keywords: ['seo optimization', 'search engine optimization', 'seo services', 'pune'],
        },
        seoTitle: 'SEO Optimization Services | SmoothCoders',
        seoDescription: 'Professional SEO services in Pune. Improve rankings, drive traffic, and grow your business online.',
        isActive: true,
        order: 5,
      },
      {
        title: 'Branding & Design',
        slug: 'branding-design',
        description: 'Create a memorable brand identity that resonates with your audience. From logos to complete brand guidelines, we help you stand out.',
        shortDescription: 'Complete branding solutions',
        icon: 'Palette',
        price: 20000,
        category: 'Design',
        features: [
          'Logo Design',
          'Brand Identity',
          'Brand Guidelines',
          'Marketing Materials',
          'Social Media Graphics',
          'Print Design',
        ],
        pricingTiers: {
          basic: {
            name: 'Basic',
            title: 'LOGO DESIGN PACKAGE',
            description: 'Essential branding for startups and new businesses',
            priceINR: 20000,
            priceUSD: 240,
            features: [
              '3 logo design concepts',
              'Logo in multiple formats',
              'Brand color palette',
              'Typography selection',
              'Business card design',
              'Social media profile images',
              'Source files included',
            ],
            deliveryDays: 10,
            revisions: '3',
          },
          standard: {
            name: 'Standard',
            title: 'COMPLETE BRAND IDENTITY',
            description: 'Comprehensive branding for established businesses',
            priceINR: 45000,
            priceUSD: 540,
            features: [
              '5 logo design concepts',
              'Complete brand identity guide',
              'Business stationery design',
              'Social media templates (10 designs)',
              'Email signature design',
              'Brand guidelines document',
              'Marketing collateral (brochure/flyer)',
              'Packaging design mockups',
              'All source files',
            ],
            deliveryDays: 20,
            revisions: '5',
          },
          premium: {
            name: 'Premium',
            title: 'ENTERPRISE BRANDING',
            description: 'Custom enterprise solution - Contact us for a tailored quote',
            priceINR: 0,
            priceUSD: 0,
            contactForPricing: true,
            features: [
              'Unlimited logo concepts',
              'Complete brand strategy',
              'Comprehensive brand guidelines',
              'Full stationery suite',
              'Social media brand kit',
              'Website design mockups',
              'Marketing materials design',
              'Packaging & label design',
              'Brand launch strategy',
              'Brand consultation sessions',
              'Priority revisions',
              'All formats & source files',
            ],
            deliveryDays: 30,
            revisions: 'Unlimited',
          },
        },
        image: '/images/services/branding.jpg',
        seo: {
          metaTitle: 'Branding & Design Services | SmoothCoders',
          metaDescription: 'Professional branding and design services in Pune. Create a memorable brand identity that stands out.',
          keywords: ['branding', 'logo design', 'brand identity', 'pune'],
        },
        seoTitle: 'Branding & Design Services | SmoothCoders',
        seoDescription: 'Professional branding and design services in Pune. Create a memorable brand identity that stands out.',
        isActive: true,
        order: 6,
      },
    ];

    await Service.insertMany(services);
    console.log('✅ Services seeded');

    // Seed Cities
    const cities = [
      {
        name: 'Pune',
        slug: 'pune',
        state: 'Maharashtra',
        landmarks: ['Hinjewadi', 'Baner', 'Koregaon Park', 'Viman Nagar', 'Kothrud'],
        localKeywords: ['IT hub', 'educational city', 'startups', 'tech companies'],
        description: 'The Oxford of the East, known for its IT industry and educational institutions',
        isActive: true,
        pagesGenerated: false,
      },
      {
        name: 'Mumbai',
        slug: 'mumbai',
        state: 'Maharashtra',
        landmarks: ['Andheri', 'Bandra', 'Lower Parel', 'Powai', 'Thane'],
        localKeywords: ['financial capital', 'bollywood', 'startups', 'corporate hub'],
        description: 'The financial capital of India and home to major businesses',
        isActive: true,
        pagesGenerated: false,
      },
      {
        name: 'Bangalore',
        slug: 'bangalore',
        state: 'Karnataka',
        landmarks: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Electronic City'],
        localKeywords: ['silicon valley of India', 'tech hub', 'startups', 'innovation'],
        description: 'India\'s Silicon Valley and the nation\'s leading IT hub',
        isActive: true,
        pagesGenerated: false,
      },
      {
        name: 'Hyderabad',
        slug: 'hyderabad',
        state: 'Telangana',
        landmarks: ['HITEC City', 'Gachibowli', 'Madhapur', 'Banjara Hills', 'Jubilee Hills'],
        localKeywords: ['cyberabad', 'IT corridor', 'pharma city', 'tech companies'],
        description: 'Major IT and pharmaceutical hub with a rich cultural heritage',
        isActive: true,
        pagesGenerated: false,
      },
      {
        name: 'Delhi',
        slug: 'delhi',
        state: 'Delhi',
        landmarks: ['Connaught Place', 'Nehru Place', 'Lajpat Nagar', 'Saket', 'Dwarka'],
        localKeywords: ['national capital', 'business hub', 'startups', 'corporate'],
        description: 'The capital city and a major center for business and governance',
        isActive: true,
        pagesGenerated: false,
      },
      {
        name: 'Chennai',
        slug: 'chennai',
        state: 'Tamil Nadu',
        landmarks: ['OMR', 'Velachery', 'T Nagar', 'Anna Nagar', 'Thoraipakkam'],
        localKeywords: ['automobile hub', 'IT corridor', 'manufacturing', 'healthcare'],
        description: 'Detroit of India, known for automobile and IT industries',
        isActive: true,
        pagesGenerated: false,
      },
    ];

    await City.insertMany(cities);
    console.log('✅ Cities seeded');

    /* // Seed Projects
    const projects = [
      {
        title: 'E-commerce Platform for Fashion Brand',
        slug: 'ecommerce-fashion-brand',
        description: 'A fully responsive e-commerce platform with advanced filtering, cart management, and secure payment integration.',
        category: 'E-commerce',
        image: '/images/projects/fashion-ecommerce.jpg',
        images: ['/images/projects/fashion-1.jpg', '/images/projects/fashion-2.jpg'],
        liveUrl: 'https://example-fashion.com',
        technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Stripe'],
        client: 'Fashion Brand Inc.',
        completedDate: new Date('2024-01-15'),
        featured: true,
        order: 1,
      },
      {
        title: 'Corporate Website Redesign',
        slug: 'corporate-website-redesign',
        description: 'Modern corporate website with animations, blog, and contact management system.',
        category: 'Website',
        image: '/images/projects/corporate-website.jpg',
        images: ['/images/projects/corporate-1.jpg'],
        liveUrl: 'https://example-corporate.com',
        technologies: ['WordPress', 'PHP', 'MySQL'],
        client: 'Corporate Solutions Ltd.',
        completedDate: new Date('2024-02-20'),
        featured: true,
        order: 2,
      },
      {
        title: 'Mobile Fitness App',
        slug: 'mobile-fitness-app',
        description: 'iOS and Android fitness tracking app with workout plans, nutrition tracking, and social features.',
        category: 'Mobile App',
        image: '/images/projects/fitness-app.jpg',
        images: ['/images/projects/fitness-1.jpg', '/images/projects/fitness-2.jpg'],
        technologies: ['React Native', 'Firebase', 'Node.js'],
        client: 'FitLife Wellness',
        completedDate: new Date('2024-03-10'),
        featured: true,
        order: 3,
      },
    ];

    await Project.insertMany(projects);
    console.log('✅ Projects seeded');

    // Seed Testimonials
    const testimonials = [
      {
        name: 'Rajesh Kumar',
        position: 'CEO',
        company: 'Tech Innovations Pvt Ltd',
        feedback: 'SmoothCoders transformed our online presence completely. Their team is professional, creative, and delivered beyond our expectations.',
        rating: 5,
        image: '/images/testimonials/avatar-1.jpg',
        isActive: true,
        order: 1,
      },
      {
        name: 'Priya Sharma',
        position: 'Marketing Director',
        company: 'Fashion Hub',
        feedback: 'Outstanding work on our e-commerce platform! The site is fast, beautiful, and our sales have increased by 40% since launch.',
        rating: 5,
        image: '/images/testimonials/avatar-2.jpg',
        isActive: true,
        order: 2,
      },
      {
        name: 'Amit Patel',
        position: 'Founder',
        company: 'StartupXYZ',
        feedback: 'Working with SmoothCoders was a game-changer for our startup. They understood our vision and brought it to life perfectly.',
        rating: 5,
        image: '/images/testimonials/avatar-3.jpg',
        isActive: true,
        order: 3,
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log('✅ Testimonials seeded');

    // Seed Blog Posts
    const blogs = [
      {
        title: 'Top 10 Web Design Trends in 2024',
        slug: 'top-10-web-design-trends-2024',
        content: '<p>Discover the latest web design trends shaping the digital landscape in 2024...</p>',
        excerpt: 'Explore the most influential web design trends that will dominate 2024 and beyond.',
        featuredImage: '/images/blog/web-design-trends.jpg',
        author: 'SmoothCoders Team',
        category: 'Web Design',
        tags: ['web design', 'trends', 'ui/ux', '2024'],
        seo: {
          metaTitle: 'Top 10 Web Design Trends in 2024 | SmoothCoders Blog',
          metaDescription: 'Discover the latest web design trends shaping the digital landscape in 2024. Stay ahead with modern design practices.',
          keywords: ['web design trends', 'ui trends 2024', 'modern web design'],
        },
        published: true,
        views: 0,
        publishedAt: new Date('2024-01-05'),
      },
      {
        title: 'How to Choose the Right Technology Stack for Your Web Project',
        slug: 'choose-right-technology-stack',
        content: '<p>Choosing the right technology stack is crucial for your project success...</p>',
        excerpt: 'A comprehensive guide to selecting the best technology stack for your web development project.',
        featuredImage: '/images/blog/tech-stack.jpg',
        author: 'SmoothCoders Team',
        category: 'Web Development',
        tags: ['web development', 'technology', 'programming'],
        seo: {
          metaTitle: 'How to Choose the Right Technology Stack | SmoothCoders',
          metaDescription: 'Learn how to select the perfect technology stack for your web development project with our comprehensive guide.',
          keywords: ['technology stack', 'web development', 'programming languages'],
        },
        published: true,
        views: 0,
        publishedAt: new Date('2024-02-12'),
      },
    ];

    await Blog.insertMany(blogs);
    console.log('✅ Blog posts seeded');

    // Seed SEO Settings
    const seoSettings = [
      {
        page: 'home',
        metaTitle: 'SmoothCoders - Transforming Ideas Into Digital Success',
        metaDescription: 'Leading web development and digital marketing agency in Pune. We create stunning websites, mobile apps, and drive digital growth for businesses.',
        keywords: ['web development pune', 'digital marketing', 'mobile app development', 'seo services'],
        ogTitle: 'SmoothCoders - Digital Agency in Pune',
        ogDescription: 'Transforming Ideas Into Digital Success',
        ogImage: '/images/og-home.jpg',
      },
      {
        page: 'about',
        metaTitle: 'About SmoothCoders - Your Digital Partner',
        metaDescription: 'Learn about SmoothCoders, a leading digital agency in Pune specializing in web development, app development, and digital marketing.',
        keywords: ['about smoothcoders', 'digital agency pune', 'web development company'],
        ogTitle: 'About SmoothCoders',
        ogDescription: 'Your trusted digital partner in Pune',
        ogImage: '/images/og-about.jpg',
      },
      {
        page: 'services',
        metaTitle: 'Our Services - Web Development, App Development & More',
        metaDescription: 'Explore our comprehensive services: website development, mobile apps, digital marketing, e-commerce, SEO, and branding solutions.',
        keywords: ['web development services', 'app development', 'digital marketing services'],
        ogTitle: 'SmoothCoders Services',
        ogDescription: 'Comprehensive digital solutions for your business',
        ogImage: '/images/og-services.jpg',
      },
      {
        page: 'portfolio',
        metaTitle: 'Our Portfolio - Projects by SmoothCoders',
        metaDescription: 'Explore our portfolio of successful web development, mobile app, and digital marketing projects for clients across industries.',
        keywords: ['portfolio', 'web projects', 'case studies'],
        ogTitle: 'SmoothCoders Portfolio',
        ogDescription: 'Showcasing our best work',
        ogImage: '/images/og-portfolio.jpg',
      },
      {
        page: 'contact',
        metaTitle: 'Contact SmoothCoders - Get in Touch Today',
        metaDescription: 'Get in touch with SmoothCoders for your web development, app development, and digital marketing needs. Located in Pune, India.',
        keywords: ['contact smoothcoders', 'web development pune contact', 'get quote'],
        ogTitle: 'Contact SmoothCoders',
        ogDescription: 'Let\'s discuss your project',
        ogImage: '/images/og-contact.jpg',
      },
    ];

    await SeoSettings.insertMany(seoSettings);
    console.log('✅ SEO settings seeded'); */

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@smoothcoders.com');
    console.log('   Password: SmoothAdmin@2024\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
