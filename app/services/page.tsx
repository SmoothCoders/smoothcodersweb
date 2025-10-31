'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Loader2, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Grid3x3,
  List,
  Heart,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';
import { formatCurrency } from '@/lib/utils';

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  features: string[];
  icon: string;
  image?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'popular' | 'price-low' | 'price-high' | 'newest';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?isActive=true');
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
        setFilteredServices(data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort services
  useEffect(() => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(service =>
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Keep original order (newest first from API)
        break;
      default:
        // Popular - keep original order
        break;
    }

    setFilteredServices(filtered);
  }, [services, searchQuery, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Our Services
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Professional digital solutions to help your business grow
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </FadeIn>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <FadeIn delay={0.2} className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <h2 className="font-bold text-lg text-gray-900">Filters</h2>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPriceRange([0, 20000])}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceRange[1] === 20000
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Under ₹20,000
                    </button>
                    <button
                      onClick={() => setPriceRange([20000, 50000])}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceRange[0] === 20000 && priceRange[1] === 50000
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      ₹20,000 - ₹50,000
                    </button>
                    <button
                      onClick={() => setPriceRange([50000, 100000])}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        priceRange[0] === 50000
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      ₹50,000+
                    </button>
                    <button
                      onClick={() => setPriceRange([0, 100000])}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 text-gray-700"
                    >
                      All Prices
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span>Top Rated Services</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span>Quality Guaranteed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Main Content - Services */}
          <div className="lg:col-span-3">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredServices.length}</span> services available
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Services List/Grid */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
              {filteredServices.map((service, index) => (
                <FadeIn key={service._id} delay={0.05 * index}>
                  {viewMode === 'list' ? (
                    <ServiceCardHorizontal service={service} />
                  ) : (
                    <ServiceCardVertical service={service} />
                  )}
                </FadeIn>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 100000]);
                    setSortBy('popular');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Horizontal Card Component (Fiverr style)
function ServiceCardHorizontal({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-2">⚡</div>
              <div className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Professional
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {service.shortDescription}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {service.features.slice(0, 3).map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  {feature}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">4.9</span>
                  <span className="text-sm text-gray-500">(127)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Popular</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Starting at</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(service.price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Vertical Card Component
function ServiceCardVertical({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-2">⚡</div>
          </div>
          <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors">
            <Heart className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {service.shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">4.9</span>
            </div>
            <span className="text-sm text-gray-500">(127 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500 mb-1">Starting at</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(service.price)}
              </div>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
