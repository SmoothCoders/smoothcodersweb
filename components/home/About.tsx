'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Target, Users, Zap } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { StaggerItem } from '@/components/animations/StaggerContainer';

const features = [
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'We focus on achieving your business objectives with precision.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Skilled professionals dedicated to your project success.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Quick turnaround without compromising on quality.',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Assurance',
    description: 'Rigorous testing ensures flawless execution.',
  },
];

export default function About() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div>
            <FadeIn>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                About SmoothCoders
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Trusted Digital Partner
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <p className="text-lg text-gray-600 mb-6">
                At SmoothCoders, we believe in transforming ideas into digital reality. 
                With over 10 years of experience, we've helped hundreds of businesses 
                establish their online presence and achieve remarkable growth.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <p className="text-lg text-gray-600 mb-8">
                Our team of passionate developers, designers, and marketers work together 
                to deliver solutions that not only meet but exceed expectations. We're 
                not just a service provider; we're your growth partner.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">ISO Certified</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Award Winning</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={0.2 + index * 0.1}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
