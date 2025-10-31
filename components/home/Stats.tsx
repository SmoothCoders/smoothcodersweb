'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';

const stats = [
  { label: 'Client Satisfaction', value: '98%', gradient: 'from-blue-500 to-blue-600' },
  { label: 'On-Time Delivery', value: '100%', gradient: 'from-green-500 to-green-600' },
  { label: 'Support Response', value: '<2hrs', gradient: 'from-purple-500 to-purple-600' },
  { label: 'Return Clients', value: '85%', gradient: 'from-pink-500 to-pink-600' },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-md md:shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-5 md:p-6 text-center">
                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
                        className="text-xl md:text-2xl font-bold text-white"
                      >
                        {stat.value.length > 3 ? stat.value.slice(0, 3) : stat.value}
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
