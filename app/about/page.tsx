'use client';

import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Heart, 
  Zap, 
  Rocket,
  Shield,
  Sparkles,
  Globe,
  Code,
  Palette,
  ArrowRight,
  CheckCircle2,
  Star
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: Target,
    title: 'Mission Driven',
    description: 'We are committed to delivering excellence and helping businesses achieve their digital goals with precision.',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Client Focused',
    description: 'Your success is our success. We build lasting relationships based on trust, transparency, and outstanding results.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'We never compromise on quality. Every project receives our full attention, expertise, and dedication.',
    gradient: 'from-green-500 to-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'We stay ahead of technology trends to provide cutting-edge solutions that give you a competitive advantage.',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love what we do, and it shows in every project we deliver. Passion drives our excellence.',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: Zap,
    title: 'Agility',
    description: 'Fast execution without compromising quality. We adapt quickly to changes and market demands.',
    gradient: 'from-indigo-500 to-purple-600',
  },
];

const team = [
  { 
    name: 'Pradip Vhasale', 
    role: 'Founder & CEO', 
    bio: 'Visionary founder with over a decade of experience in web development and digital marketing. Leading Smooth Coders to serve 1000+ satisfied clients nationwide.',
    gradient: 'from-blue-500 to-purple-600' 
  },
  { 
    name: 'Manan Raj', 
    role: 'Head of Operations & Marketing', 
    bio: 'Expert in operations and marketing, ensuring seamless workflow and driving strategic initiatives for company success.',
    gradient: 'from-purple-500 to-pink-600' 
  },
  { 
    name: 'Santosh Shelke', 
    role: 'Web Developer', 
    bio: 'Skilled website developer passionate about creating aesthetically pleasing and user-friendly websites with attention to detail.',
    gradient: 'from-green-500 to-blue-600' 
  },
  { 
    name: 'Shivam Sharma', 
    role: 'Web Developer', 
    bio: 'Talented WordPress developer dedicated to creating beautiful, user-friendly websites that exceed client expectations.',
    gradient: 'from-orange-500 to-red-600' 
  },
  { 
    name: 'Girish Vadher', 
    role: 'Web Developer', 
    bio: 'Versatile developer proficient in WordPress and Shopify, known for problem-solving skills and timely project delivery.',
    gradient: 'from-teal-500 to-cyan-600' 
  },
  { 
    name: 'Prajwal Nautiyal', 
    role: 'Digital Marketing Specialist', 
    bio: 'Digital marketing expert crafting strategies that drive traffic, engagement, and conversions with expertise in SEO and social media.',
    gradient: 'from-pink-500 to-rose-600' 
  },
  { 
    name: 'Trupti Ubale', 
    role: 'Mobile Apps Developer', 
    bio: 'Expert in iOS and Android development, creating user-friendly and reliable mobile apps tailored to client needs.',
    gradient: 'from-indigo-500 to-purple-600' 
  },
  { 
    name: 'Ankit Paul', 
    role: 'Graphic Designer', 
    bio: 'Creative designer focused on storytelling and visual impact, creating engaging designs that leave lasting impressions.',
    gradient: 'from-amber-500 to-orange-600' 
  },
  { 
    name: 'Kapil Pawar', 
    role: 'Graphic Designer', 
    bio: 'Innovative graphic designer known for attention to detail, creating logos, branding, and promotional graphics.',
    gradient: 'from-lime-500 to-green-600' 
  },
  { 
    name: 'Yash Jasoliya', 
    role: 'Shopify Developer', 
    bio: 'Shopify specialist helping businesses create powerful e-commerce solutions that drive sales and growth.',
    gradient: 'from-violet-500 to-purple-600' 
  },
  { 
    name: 'Suthar Karan', 
    role: 'WordPress Developer', 
    bio: 'Talented WordPress developer focused on responsive design and clean code for optimal performance.',
    gradient: 'from-sky-500 to-blue-600' 
  },
];

const achievements = [
  { icon: Award, title: '50+ Awards', description: 'Industry recognition', color: 'text-yellow-600' },
  { icon: Users, title: '1000+ Clients', description: 'Satisfied nationwide', color: 'text-blue-600' },
  { icon: Rocket, title: '500+ Projects', description: 'Successfully delivered', color: 'text-purple-600' },
  { icon: Shield, title: '10+ Years', description: 'Of excellence', color: 'text-green-600' },
];

const timeline = [
  { year: '2014', event: 'SmoothCoders Founded', description: 'Started with a vision to transform businesses digitally' },
  { year: '2016', event: 'Expanded Team', description: 'Grew to 10+ talented developers and designers' },
  { year: '2018', event: '100+ Projects', description: 'Crossed milestone of 100 successful projects' },
  { year: '2020', event: 'Industry Recognition', description: 'Received Best Digital Agency Award' },
  { year: '2022', event: '50+ Team Members', description: 'Expanded team with diverse expertise' },
  { year: '2024', event: 'Global Reach', description: 'Serving clients across multiple countries' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 md:py-20 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  About SmoothCoders
                </div>
              </FadeIn>
              
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Transforming Ideas Into{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Digital Reality
                  </span>
                </h1>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  We are a passionate team of developers, designers, and digital marketers dedicated to helping businesses succeed in the digital world. Since 2014, we've been crafting exceptional digital experiences that drive real results.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <a href="#story" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all group">
                    <span>Our Story</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all">
                    <span>Get In Touch</span>
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right Visual - Achievement Cards */}
            <FadeIn delay={0.4}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzI1NjNlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[
              { number: '10+', label: 'Years Experience', icon: Award, gradient: 'from-blue-500 to-blue-600' },
              { number: '500+', label: 'Projects Completed', icon: Rocket, gradient: 'from-purple-500 to-purple-600' },
              { number: '1000+', label: 'Happy Clients', icon: Users, gradient: 'from-green-500 to-green-600' },
              { number: '50+', label: 'Team Members', icon: Heart, gradient: 'from-pink-500 to-pink-600' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md md:shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                    <div className="mb-4 inline-block">
                      <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all mb-4 mx-auto shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index, type: 'spring' }}
                      className="text-4xl md:text-5xl font-bold mb-2 text-gray-900"
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section with Visual */}
      <section id="story" className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left - Visual Element */}
              <FadeIn>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-20 blur-3xl" />
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-blue-600 font-semibold mb-6">
                          Since 2014
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">10 Years of Excellence</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">500+</div>
                          <div className="text-sm text-gray-600">Projects</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600">300+</div>
                          <div className="text-sm text-gray-600">Clients</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Right - Content */}
              <div>
                <FadeIn delay={0.2}>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Our Story
                  </h2>
                </FadeIn>
                
                <FadeIn delay={0.3}>
                  <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                    <p>
                      Founded in 2014, SmoothCoders began with a simple mission: to help businesses harness the power of digital technology. What started as a small team of passionate developers has grown into a full-service digital agency.
                    </p>
                    <p>
                      Over the years, we've had the privilege of working with hundreds of clients across various industries. From startups to established enterprises, we've helped them establish their online presence and achieve measurable business growth.
                    </p>
                    <p>
                      Today, we continue to evolve, staying at the forefront of technology trends while maintaining our core values of quality, innovation, and client satisfaction.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Client-Centric Approach</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Cutting-Edge Technology</span>
                      </div>
                      <div className="flex items-center gap-2 text-pink-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Proven Track Record</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <FadeIn>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Our Core Values
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Drives Us Forward
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do and shape our culture
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-none shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-6 md:p-8 relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                      
                      {/* Gradient line */}
                      <div className={`h-1 w-0 group-hover:w-16 bg-gradient-to-r ${value.gradient} rounded-full mt-4 transition-all duration-300`} />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <FadeIn>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
                Meet The Team
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                The People Behind Success
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the talented individuals who bring your vision to life
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="relative inline-block mb-4">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform`}>
                          {member.name.split(' ').map(n => n.charAt(0)).join('')}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-sm font-medium text-blue-600 mb-3">{member.role}</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed text-center">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <FadeIn>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Our Journey
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                A Decade of Growth & Innovation
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Milestones that shaped our journey to excellence
              </p>
            </FadeIn>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Year Badge */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-xl z-10">
                      <span className="text-sm">{item.year}</span>
                    </div>
                    
                    {/* Content Card */}
                    <div className={`ml-24 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                      <motion.div
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.event}
                        </h3>
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -180, 0] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Digital Journey?
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl mb-8 text-blue-100">
                Let's work together to bring your vision to life and achieve extraordinary results
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl group"
                >
                  <span>Get In Touch</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
                >
                  <span>View Services</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
