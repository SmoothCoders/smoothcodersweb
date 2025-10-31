'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Info, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  FileText, 
  Send,
  Menu,
  X,
  Mail,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react';

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

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch settings once
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem('siteSettings');
        if (cached) {
          setSettings(JSON.parse(cached));
        }
        
        // Fetch fresh data
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
          localStorage.setItem('siteSettings', JSON.stringify(data.data));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-xl' : 'bg-gray-900'
    )}>
      {/* Top Bar */}
      {!isScrolled && (
        <div className="bg-black border-b border-gray-800">
          <div className="container mx-auto px-4 h-9 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <a href={`mailto:${settings?.contactEmail || 'contact@smoothcoders.com'}`} className="flex items-center gap-2 hover:text-blue-400">
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{settings?.contactEmail || 'contact@smoothcoders.com'}</span>
              </a>
              <a href={`tel:${settings?.contactPhone || '+919021311559'}`} className="flex items-center gap-2 hover:text-blue-400">
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{settings?.contactPhone || '+91 9021311559'}</span>
              </a>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>{settings?.businessHours || 'Mon-Sat: 9AM-6PM'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {settings?.headerLogoUrl ? (
              <img
                src={settings.headerLogoUrl}
                alt={settings.siteName || 'SmoothCoders'}
                style={{ width: `${settings.headerLogoWidth || 180}px` }}
                className="h-auto object-contain"
              />
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SMOOTH
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-white">
                    CODERS
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 tracking-wider">
                  {settings?.siteTagline || 'Digital Excellence'}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              isMobileMenuOpen ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
            )}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link href="/contact" className="block pt-4">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
