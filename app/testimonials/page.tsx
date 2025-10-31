'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    position: 'CEO',
    company: 'Tech Innovations Pvt Ltd',
    feedback: 'SmoothCoders transformed our online presence completely. Their team is professional, creative, and delivered beyond our expectations. The website they built has significantly increased our customer engagement and conversion rates.',
    rating: 5,
    image: '/images/testimonials/avatar-1.jpg',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    position: 'Marketing Director',
    company: 'Fashion Hub',
    feedback: 'Outstanding work on our e-commerce platform! The site is fast, beautiful, and our sales have increased by 40% since launch. Their attention to detail and commitment to our success is remarkable. Highly recommended!',
    rating: 5,
    image: '/images/testimonials/avatar-2.jpg',
  },
  {
    id: 3,
    name: 'Amit Patel',
    position: 'Founder',
    company: 'StartupXYZ',
    feedback: 'Working with SmoothCoders was a game-changer for our startup. They understood our vision and brought it to life perfectly. The mobile app they developed is exactly what we needed to scale our business.',
    rating: 5,
    image: '/images/testimonials/avatar-3.jpg',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    position: 'Operations Manager',
    company: 'Logistics Pro',
    feedback: 'The team at SmoothCoders delivered an exceptional web application for our logistics business. Their technical expertise and project management skills are top-notch. We couldn\'t be happier with the results.',
    rating: 5,
    image: '/images/testimonials/avatar-4.jpg',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    position: 'Business Owner',
    company: 'Restaurant Chain',
    feedback: 'SmoothCoders created a stunning website for our restaurant chain with an integrated online ordering system. The user experience is seamless, and we\'ve seen a significant increase in online orders. Excellent work!',
    rating: 5,
    image: '/images/testimonials/avatar-5.jpg',
  },
  {
    id: 6,
    name: 'Anita Desai',
    position: 'Head of Marketing',
    company: 'EduTech Solutions',
    feedback: 'Their digital marketing services have been instrumental in growing our online presence. The SEO strategy they implemented has doubled our organic traffic in just 6 months. True professionals!',
    rating: 5,
    image: '/images/testimonials/avatar-6.jpg',
  },
];

export default function TestimonialsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Testimonials
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Clients Say</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Hear from the businesses we've helped grow and succeed.
            </p>
          </FadeIn>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 opacity-10">
                  <Quote className="h-32 w-32 text-blue-600" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed relative z-10">
                  "{testimonials[currentIndex].feedback}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentIndex].position}, {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={previous}
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all ${
                      index === currentIndex
                        ? 'w-8 h-2 bg-blue-600 rounded-full'
                        : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={next}
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              More Success Stories
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={testimonial.id} delay={0.1 * index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-gray-700 mb-6 line-clamp-4">
                    "{testimonial.feedback}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.position}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <FadeIn delay={0.6}>
          <div className="mt-20 text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's work together to transform your business and achieve remarkable results.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
