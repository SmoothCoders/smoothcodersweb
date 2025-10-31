'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight,
  Star,
  Clock,
  Shield,
  Award,
  TrendingUp,
  Users,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookingButton from '@/components/BookingButton';
import ContentRenderer from '@/components/ContentRenderer';
import PricingTiers from '@/components/PricingTiers';
import PricingComparison from '@/components/PricingComparison';
import CheckoutModal from '@/components/CheckoutModal';
import { Currency } from '@/lib/utils/geolocation';

interface ServicePageProps {
  page: any; // Will be properly typed
}

export default function ServicePage({ page }: ServicePageProps) {
  const service = page?.serviceId;
  const city = page?.cityId;
  
  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

  const handleSelectTier = (tier: 'basic' | 'standard' | 'premium', price: number, currency: Currency) => {
    setSelectedTier(tier);
    setSelectedPrice(price);
    setSelectedCurrency(currency);
    setIsCheckoutOpen(true);
  };

  // Inject structured data
  if (typeof window !== 'undefined' && page?.structuredData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(page.structuredData);
    document.head.appendChild(script);

    if (page.faqSchema) {
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.text = JSON.stringify(page.faqSchema);
      document.head.appendChild(faqScript);
    }
  }

  // Show error state if data is missing
  if (!service || !city) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service data could not be loaded. Please try again or contact support.</p>
          <Link href="/services">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-36 bg-gray-50 pb-16 md:pb-8">
      {/* Breadcrumbs - Fiverr Style */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/${city.slug}`} className="hover:text-blue-600 transition-colors">{city.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium truncate">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content - Two Column Layout (Fiverr Style) */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-2 md:space-y-3">
            {/* Service Title & Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg p-4 md:p-6 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                  {city.name}, {city.state}
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-green-600" />
                  Top Rated
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">4.9</span>
                  <span>(127 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>1000+ Orders</span>
                </div>
              </div>
            </motion.div>

            {/* About This Service - Fiverr Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg p-4 md:p-6 border border-gray-100"
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {page.metaDescription}
                </p>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ContentRenderer 
                content={page.content}
                serviceName={service.title}
                cityName={city.name}
                servicePrice={service.price}
              />
            </motion.div>

            {/* Pricing Comparison Table - Below Why Choose SmoothCoders */}
            {service.pricingTiers && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-lg p-4 md:p-6 border border-gray-100 mt-2 md:mt-3"
              >
                <PricingComparison
                  tiers={service.pricingTiers}
                  serviceName={service.title}
                  onSelectTier={handleSelectTier}
                />
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar (Fiverr Style) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Tiers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {service.pricingTiers && (
                  <PricingTiers
                    tiers={service.pricingTiers}
                    serviceName={service.title}
                    onSelectTier={handleSelectTier}
                  />
                )}
              </motion.div>

              {/* Seller Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        SC
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">SmoothCoders</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">4.9</span>
                          <span className="text-gray-500">(127)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Response time</span>
                        <span className="font-semibold text-gray-900">1 hour</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completed orders</span>
                        <span className="font-semibold text-gray-900">1,000+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member since</span>
                        <span className="font-semibold text-gray-900">2014</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                      <a href="tel:+919021311559" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>+91 9021311559</span>
                      </a>
                      <a href="mailto:contact@smoothcoders.com" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>contact@smoothcoders.com</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar - Clean Fiverr Style */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3 md:hidden z-50"
      >
        <div className="flex gap-2">
          <a
            href={`https://wa.me/919021311559?text=Hi, I'm interested in your ${encodeURIComponent(service.title)} service in ${encodeURIComponent(city.name)}. I would like to know more about pricing, timeline, and how you can help my business.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">Chat With Us</span>
          </a>
          <a
            href="/contact"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-all active:scale-95"
          >
            <Mail className="h-4 w-4" />
            <span className="text-sm">Contact</span>
          </a>
        </div>
      </motion.div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        serviceName={service.title}
        serviceId={service._id}
        tier={selectedTier}
        price={selectedPrice}
        currency={selectedCurrency}
      />
    </div>
  );
}
