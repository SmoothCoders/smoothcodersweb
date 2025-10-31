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
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch settings with localStorage cache
  useEffect(() => {
    // Try to load from localStorage first for instant display
    const cachedSettings = localStorage.getItem('siteSettings');
    if (cachedSettings) {
      try {
        const parsed = JSON.parse(cachedSettings);
        setSettings(parsed);
        setSettingsLoaded(true);
      } catch (e) {
        console.error('Failed to parse cached settings:', e);
      }
    }

    // Fetch fresh settings from API
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
          setSettingsLoaded(true);
          // Cache settings in localStorage
          localStorage.setItem('siteSettings', JSON.stringify(data.data));
        }
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setSettingsLoaded(true); // Set loaded even on error to show default logo
      });
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-700',
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 border-b border-gray-800'
          : 'bg-gray-900 backdrop-blur-xl'
      )}
    >
      {/* Animated gradient line */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0.5 }}
        transition={{ duration: 0.5 }}
      />

      {/* Premium Top Bar - Pure Black */}
      <motion.div 
        initial={{ height: 36 }}
        animate={{ height: isScrolled ? 0 : 36 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="overflow-hidden bg-black border-b border-gray-800"
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-6">
            <motion.a 
              href={`mailto:${settings?.contactEmail || 'contact@smoothcoders.com'}`}
              className="flex items-center gap-2 hover:text-blue-400 transition-all duration-300 group"
              whileHover={{ x: 2 }}
            >
              <Mail className="h-3.5 w-3.5 group-hover:text-blue-400 transition-colors" />
              <span className="hidden md:inline font-medium">{settings?.contactEmail || 'contact@smoothcoders.com'}</span>
            </motion.a>
            <motion.a 
              href={`tel:${settings?.contactPhone || '+919021311559'}`}
              className="flex items-center gap-2 hover:text-blue-400 transition-all duration-300 group"
              whileHover={{ x: 2 }}
            >
              <Phone className="h-3.5 w-3.5 group-hover:text-blue-400 transition-colors" />
              <span className="hidden md:inline font-medium">{settings?.contactPhone || '+91 9021311559'}</span>
            </motion.a>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-medium">{settings?.businessHours || 'Mon-Sat: 9AM-6PM'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo - Simplified No Animations */}
          <Link href="/" className="flex items-center gap-3">
            {settingsLoaded && settings?.headerLogoUrl ? (
              <img
                src={settings.headerLogoUrl}
                alt={settings?.siteName || 'SmoothCoders'}
                className="h-auto object-contain"
                style={{ width: `${settings?.headerLogoWidth || 180}px` }}
              />
            ) : (
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
                    SMOOTH
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    CODERS
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-medium tracking-wider mt-1 ml-0.5">
                  {settings?.siteTagline || 'Digital Excellence'}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation with Icons */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className={cn(
                    'h-4 w-4',
                    isActive ? 'text-white' : 'text-gray-400'
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-xl transition-all duration-200"
              >
                <span className="font-semibold">Get Started</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-3 rounded-xl transition-all duration-300 relative overflow-hidden',
              isMobileMenuOpen 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/50'
            )}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden"
              style={{ top: isScrolled ? '80px' : '116px' }}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="space-y-2">
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
                            'flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 group relative overflow-hidden',
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50 active:bg-gray-800'
                          )}
                        >
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                              layoutId="mobileBg"
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                          <div className={cn(
                            'w-11 h-11 rounded-lg flex items-center justify-center transition-all relative z-10',
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gray-800 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="flex-1 relative z-10">{item.name}</span>
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
                  className="mt-6 pt-6 border-t border-blue-500/20"
                >
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-purple-500 hover:to-purple-600 text-white py-6 rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/60 transition-all group text-lg font-semibold relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10">Get Started Today</span>
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                      </Button>
                    </motion.div>
                  </Link>

                  {/* Mobile Contact Info */}
                  <div className="mt-4 p-4 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-xl space-y-3 border border-blue-500/20">
                    <a href={`mailto:${settings?.contactEmail || 'contact@smoothcoders.com'}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{settings?.contactEmail || 'contact@smoothcoders.com'}</span>
                    </a>
                    <a href={`tel:${settings?.contactPhone || '+919021311559'}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{settings?.contactPhone || '+91 9021311559'}</span>
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
