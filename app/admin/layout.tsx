'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FolderOpen, 
  FileText, 
  Receipt, 
  Activity,
  BarChart3,
  Code,
  Settings, 
  LogOut,
  Menu,
  X,
  Briefcase,
  MapPin,
  MessageSquare,
  CreditCard,
  Globe,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';

// Navigation sections
const businessManagement = [
  { name: 'Dashboard', href: '/admin/dashboard-new', icon: LayoutDashboard },
  { name: 'Developers', href: '/admin/developers', icon: Code },
  { name: 'Clients', href: '/admin/clients', icon: Building2 },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Quotations', href: '/admin/quotations', icon: FileText },
  { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
  { name: 'Activity Log', href: '/admin/activity', icon: Activity },
];

const websiteManagement = [
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Cities', href: '/admin/cities', icon: MapPin },
  { name: 'Generated Pages', href: '/admin/pages', icon: Globe },
  { name: 'Inquiries & Chat', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
];

const systemSettings = [
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'SEO Settings', href: '/admin/seo', icon: Search },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <div>{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <Link href="/admin/dashboard-new" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold">SC</span>
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SmoothCoders
                </div>
                <div className="text-xs text-gray-400">Admin Panel</div>
              </div>
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Business Management Section */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
              Business Management
            </div>
            {businessManagement.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* Website Management Section */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mt-6 mb-3">
              Website Management
            </div>
            {websiteManagement.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* System Settings Section */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mt-6 mb-3">
              System Settings
            </div>
            {systemSettings.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
            <Link 
              href="/admin/profile" 
              className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors">{session?.user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-400 truncate">{ session?.user?.email}</div>
              </div>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
            >
              <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-red-500/20">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <p className="text-sm text-gray-500">Current Page</p>
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
              >
                <span>View Website</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
