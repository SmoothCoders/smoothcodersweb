'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const categories = ['All', 'Website', 'Mobile App', 'E-commerce', 'Branding'];

const projects = [
  {
    id: 1,
    title: 'E-commerce Fashion Platform',
    category: 'E-commerce',
    image: '/images/portfolio/project-1.jpg',
    description: 'A fully responsive e-commerce platform with advanced filtering, cart management, and secure payment integration.',
    technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Stripe'],
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: 2,
    title: 'Corporate Website Redesign',
    category: 'Website',
    image: '/images/portfolio/project-2.jpg',
    description: 'Modern corporate website with animations, blog, and contact management system.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    color: 'from-green-500/20 to-blue-500/20',
  },
  {
    id: 3,
    title: 'Mobile Fitness App',
    category: 'Mobile App',
    image: '/images/portfolio/project-3.jpg',
    description: 'iOS and Android fitness tracking app with workout plans, nutrition tracking, and social features.',
    technologies: ['React Native', 'Firebase', 'Node.js'],
    color: 'from-orange-500/20 to-pink-500/20',
  },
  {
    id: 4,
    title: 'Restaurant Website',
    category: 'Website',
    image: '/images/portfolio/project-4.jpg',
    description: 'Beautiful restaurant website with online ordering and table reservation system.',
    technologies: ['WordPress', 'PHP', 'MySQL'],
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 5,
    title: 'Real Estate Platform',
    category: 'Website',
    image: '/images/portfolio/project-5.jpg',
    description: 'Property listing platform with advanced search, filters, and virtual tours.',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    color: 'from-indigo-500/20 to-blue-500/20',
  },
  {
    id: 6,
    title: 'Brand Identity Design',
    category: 'Branding',
    image: '/images/portfolio/project-6.jpg',
    description: 'Complete brand identity including logo, colors, typography, and brand guidelines.',
    technologies: ['Adobe Illustrator', 'Figma', 'Adobe Photoshop'],
    color: 'from-pink-500/20 to-rose-500/20',
  },
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
              Our Portfolio
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Work Speaks</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of successful projects that have helped businesses achieve their digital goals.
            </p>
          </FadeIn>
        </div>

        {/* Category Filter */}
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={0.1 * index}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer h-[500px]"
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  {/* Category Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium rounded-full text-gray-900">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Info */}
                  <div className="transform transition-transform group-hover:translate-y-0 translate-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded-full text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* View Button */}
                    <div className="flex items-center gap-2 text-gray-900 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View Project</span>
                      <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"
                  />
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* CTA Section */}
        <FadeIn delay={0.6}>
          <div className="mt-20 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your vision to life.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              Start Your Project
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
