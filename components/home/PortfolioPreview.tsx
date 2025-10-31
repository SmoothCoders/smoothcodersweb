'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';

const projects = [
  {
    title: 'E-commerce Platform',
    category: 'E-commerce',
    image: '/images/portfolio/project-1.jpg',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    title: 'Corporate Website',
    category: 'Website',
    image: '/images/portfolio/project-2.jpg',
    color: 'from-green-500/20 to-blue-500/20',
  },
  {
    title: 'Mobile Fitness App',
    category: 'Mobile App',
    image: '/images/portfolio/project-3.jpg',
    color: 'from-orange-500/20 to-pink-500/20',
  },
  {
    title: 'Restaurant Website',
    category: 'Website',
    image: '/images/portfolio/project-4.jpg',
    color: 'from-purple-500/20 to-pink-500/20',
  },
];

export default function PortfolioPreview() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <FadeIn>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
              Our Work
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of successful projects that have helped businesses achieve their goals.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
          {projects.map((project, index) => (
            <FadeIn key={project.title} delay={0.1 * index}>
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all cursor-pointer h-80"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium rounded-full text-gray-900">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-900 font-medium group-hover:gap-3 transition-all">
                    <span>View Project</span>
                    <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px]"
                />
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="text-center">
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="text-lg px-8 rounded-full border-2 group">
                View Full Portfolio
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
