'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Smartphone, TrendingUp, ShoppingCart, Search, Palette, LucideIcon } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';

// Icon mapping for services
const iconMap: Record<string, LucideIcon> = {
  'Globe': Globe,
  'Smartphone': Smartphone,
  'TrendingUp': TrendingUp,
  'ShoppingCart': ShoppingCart,
  'Search': Search,
  'Palette': Palette,
};

// Color mapping by service order
const colorMap = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
];

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  icon: string;
  slug: string;
}

export default function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?isActive=true');
      const data = await response.json();
      if (data.success) {
        setServices(data.data.slice(0, 6)); // Show first 6 services
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <FadeIn>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Our Services
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive digital solutions tailored to help your business thrive in the digital age.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Globe;
            const color = colorMap[index % colorMap.length];
            return (
              <FadeIn key={service._id} delay={0.1 * index}>
                <Link href={`/services/${service.slug}`}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.6}>
          <div className="text-center">
            <Link href="/services">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 rounded-full group">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
