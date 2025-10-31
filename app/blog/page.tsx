'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Web Design Trends in 2024',
    excerpt: 'Discover the latest web design trends shaping the digital landscape in 2024 and beyond.',
    author: 'SmoothCoders Team',
    date: 'Jan 5, 2024',
    category: 'Web Design',
    image: '/images/blog/web-design-trends.jpg',
    readTime: '5 min read',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: 2,
    title: 'How to Choose the Right Technology Stack',
    excerpt: 'A comprehensive guide to selecting the best technology stack for your web development project.',
    author: 'SmoothCoders Team',
    date: 'Feb 12, 2024',
    category: 'Web Development',
    image: '/images/blog/tech-stack.jpg',
    readTime: '7 min read',
    color: 'from-green-500/20 to-blue-500/20',
  },
  {
    id: 3,
    title: 'SEO Best Practices for 2024',
    excerpt: 'Learn the latest SEO strategies to improve your website ranking and drive organic traffic.',
    author: 'SmoothCoders Team',
    date: 'Mar 10, 2024',
    category: 'SEO',
    image: '/images/blog/seo-practices.jpg',
    readTime: '6 min read',
    color: 'from-orange-500/20 to-pink-500/20',
  },
  {
    id: 4,
    title: 'Mobile-First Design Principles',
    excerpt: 'Why mobile-first design is crucial and how to implement it effectively in your projects.',
    author: 'SmoothCoders Team',
    date: 'Apr 15, 2024',
    category: 'Mobile Development',
    image: '/images/blog/mobile-first.jpg',
    readTime: '5 min read',
    color: 'from-purple-500/20 to-pink-500/20',
  },
];

const categories = ['All', 'Web Design', 'Web Development', 'SEO', 'Mobile Development'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Our Blog
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Insights</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trends, tips, and insights in web development and digital marketing.
            </p>
          </FadeIn>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <FadeIn delay={0.3}>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPosts.map((post, index) => (
            <FadeIn key={post.id} delay={0.1 * index}>
              <motion.article
                whileHover={{ y: -10 }}
                className="group cursor-pointer h-full"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full flex flex-col">
                  {/* Image */}
                  <div className={`relative h-48 bg-gradient-to-br ${post.color} overflow-hidden`}>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium rounded-full text-gray-900">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
          </div>
        )}

        {/* CTA Section */}
        <FadeIn delay={0.6}>
          <div className="mt-20 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Want to Stay Updated?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
