'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone,
  ArrowRight,
  Github,
  Youtube
} from 'lucide-react';
import DynamicFooterGrid from './DynamicFooterGrid';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Testimonials', href: '/testimonials' },
  ],
  services: [
    { name: 'Web Development', href: '/services/website-design-development' },
    { name: 'App Development', href: '/services/mobile-app-development' },
    { name: 'Digital Marketing', href: '/services/digital-marketing' },
    { name: 'E-commerce', href: '/services/ecommerce-development' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Cancellation & Refund', href: '/cancellation-refund' },
  ],
};

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: settings?.socialMedia?.facebook || 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: settings?.socialMedia?.twitter || 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, href: settings?.socialMedia?.instagram || 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, href: settings?.socialMedia?.linkedin || 'https://linkedin.com' },
    ...(settings?.socialMedia?.youtube ? [{ name: 'YouTube', icon: Youtube, href: settings.socialMedia.youtube }] : []),
    ...(settings?.socialMedia?.github ? [{ name: 'GitHub', icon: Github, href: settings.socialMedia.github }] : []),
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Dynamic City-Service Grid */}
      <DynamicFooterGrid />
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {settings?.footerLogoUrl ? (
                <motion.img
                  src={settings.footerLogoUrl}
                  alt={settings.siteName || 'SmoothCoders'}
                  className="h-12 w-auto object-contain"
                  whileHover={{ scale: 1.05 }}
                />
              ) : (
                <motion.h3
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                >
                  {settings?.siteName || 'SmoothCoders'}
                </motion.h3>
              )}
            </Link>
            <p className="text-sm text-gray-400">
              Transforming Ideas Into Digital Success. Your trusted partner for web development, mobile apps, and digital marketing.
            </p>
            <div className="space-y-2">
              <a href={`mailto:${settings?.contactEmail || 'contact@smoothcoders.com'}`} className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Mail className="h-4 w-4" />
                {settings?.contactEmail || 'contact@smoothcoders.com'}
              </a>
              <a href={`tel:${settings?.contactPhone || '+919021311559'}`} className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <Phone className="h-4 w-4" />
                {settings?.contactPhone || '+91 9021311559'}
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SmoothCoders. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Link */}
      <div className="bg-gray-950 py-2">
        <div className="container mx-auto px-4 text-center">
          <Link 
            href="/admin" 
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
