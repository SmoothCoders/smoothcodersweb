'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Phone, 
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  Home,
  Info,
  Briefcase,
  FolderOpen,
  MessageSquare,
  FileText,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: FolderOpen },
  { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Contact', href: '/contact', icon: Send },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-gradient-to-b from-white/95 to-white/50 backdrop-blur-sm'
      )}
    >
      {/* Premium Top Bar */}
      <motion.div 
        initial={{ height: 40 }}
        animate={{ height: isScrolled ? 0 : 40 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600"
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-6">
            <motion.a 
              href={`mailto:${settings?.contactEmail || 'contact@smoothcoders.com'}`}
              className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden md:inline font-medium">{settings?.contactEmail || 'contact@smoothcoders.com'}</span>
            </motion.a>
            <motion.a 
              href={`tel:${settings?.contactPhone || '+919021311559'}`}
              className="flex items-center gap-2 hover:text-blue-200 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden md:inline font-medium">{settings?.contactPhone || '+91 9021311559'}</span>
            </motion.a>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">{settings?.businessHours || 'Mon-Sat: 9AM-6PM'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo with Animation */}
          <Link href="/" className="flex items-center gap-2 group">
            {settings?.headerLogoUrl ? (
              <motion.img
                src={settings.headerLogoUrl}
                alt={settings.siteName || 'SmoothCoders'}
                className="h-12 md:h-14 w-auto object-contain"
                whileHover={{ scale: 1.02 }}
              />
            ) : (
              <div className="flex flex-col leading-none">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-baseline gap-0.5"
                >
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 bg-clip-text text-transparent tracking-tight">
                    SMOOTH
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    CODERS
                  </span>
                </motion.div>
                <div className="text-[10px] text-gray-500 font-medium tracking-wide mt-0.5 ml-0.5">
                  {settings?.siteTagline || 'Digital Excellence'}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation with Icons */}
          <div className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className={cn(
                      'h-4 w-4 transition-all',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    )} />
                    <span>{item.name}</span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-2.5 rounded-xl transition-all duration-300',
              isMobileMenuOpen 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
              style={{ top: isScrolled ? '80px' : '120px' }}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 lg:hidden bg-white border-t border-gray-100 shadow-2xl"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="space-y-1">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group',
                            isActive
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                          )}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                            isActive 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="flex-1">{item.name}</span>
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navigation.length * 0.05 }}
                  className="mt-6 pt-6 border-t border-gray-100"
                >
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group text-lg font-semibold">
                      <span>Get Started Today</span>
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  {/* Mobile Contact Info */}
                  <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl space-y-2">
                    <a href="mailto:contact@smoothcoders.com" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                      <Mail className="h-4 w-4" />
                      <span>contact@smoothcoders.com</span>
                    </a>
                    <a href="tel:+919021311559" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                      <Phone className="h-4 w-4" />
                      <span>+91 9021311559</span>
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
