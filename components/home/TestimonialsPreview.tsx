'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    position: 'CEO',
    company: 'Tech Innovations Pvt Ltd',
    feedback: 'SmoothCoders transformed our online presence completely. Their team is professional, creative, and delivered beyond our expectations.',
    rating: 5,
    color: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Priya Sharma',
    position: 'Marketing Director',
    company: 'Fashion Hub',
    feedback: 'Outstanding work on our e-commerce platform! The site is fast, beautiful, and our sales have increased by 40% since launch.',
    rating: 5,
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Amit Patel',
    position: 'Founder',
    company: 'StartupXYZ',
    feedback: 'Working with SmoothCoders was a game-changer for our startup. They understood our vision and brought it to life perfectly.',
    rating: 5,
    color: 'from-green-500 to-blue-600',
  },
  {
    name: 'Sneha Reddy',
    position: 'Operations Manager',
    company: 'Logistics Pro',
    feedback: 'The team delivered an exceptional web application for our logistics business. Their technical expertise is top-notch.',
    rating: 5,
    color: 'from-orange-500 to-red-600',
  },
  {
    name: 'Vikram Singh',
    position: 'Business Owner',
    company: 'Restaurant Chain',
    feedback: 'SmoothCoders created a stunning website with integrated online ordering. We\'ve seen significant increase in online orders.',
    rating: 5,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Anita Desai',
    position: 'Head of Marketing',
    company: 'EduTech Solutions',
    feedback: 'Their digital marketing services have been instrumental in growing our online presence. True professionals!',
    rating: 5,
    color: 'from-pink-500 to-rose-600',
  },
];

export default function TestimonialsPreview() {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsToShow = 3;

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <FadeIn>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Testimonials
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Hear from the businesses we've helped grow.
            </p>
          </FadeIn>
        </div>

        {/* Testimonials Grid */}
        <div 
          className="max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {visibleTestimonials.map((testimonial, index) => {
              const globalIndex = (startIndex + index) % testimonials.length;
              return (
                <motion.div
                  key={`${testimonial.name}-${globalIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
                    {/* Background Quote */}
                    <div className="absolute -top-4 -right-4 opacity-5">
                      <Quote className="h-32 w-32 text-blue-600 transform rotate-12" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Feedback */}
                    <p className="text-gray-700 mb-6 leading-relaxed flex-grow relative z-10">
                      "{testimonial.feedback}"
                    </p>

                    {/* Divider */}
                    <div className={`h-1 w-16 bg-gradient-to-r ${testimonial.color} rounded-full mb-4`} />

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.position}
                        </div>
                        <div className="text-xs text-gray-500">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={previous}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === startIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
