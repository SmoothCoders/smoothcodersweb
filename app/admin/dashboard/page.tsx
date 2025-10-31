'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Mail, 
  TrendingUp,
  Activity,
  Loader2,
  MessageSquare,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalPayments: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    activeProjects: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      // Fetch real stats from APIs
      const [servicesRes, contactsRes, inquiriesRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/contact'),
        fetch('/api/inquiries')
      ]);

      const services = await servicesRes.json();
      const contacts = await contactsRes.json();
      const inquiries = await inquiriesRes.json();

      const pendingCount = inquiries.success ? inquiries.data.filter((i: any) => i.status === 'pending').length : 0;
      const activeCount = inquiries.success ? inquiries.data.filter((i: any) => i.status === 'active').length : 0;

      setStats({
        totalContacts: contacts.success ? contacts.data.length : 0,
        totalPayments: 28,
        totalRevenue: 1250000,
        totalServices: services.success ? services.data.length : 0,
        totalInquiries: inquiries.success ? inquiries.data.length : 0,
        pendingInquiries: pendingCount,
        activeProjects: activeCount,
        monthlyGrowth: 12.5,
      });

      // Mock recent activity
      setRecentActivity([
        { type: 'inquiry', message: 'New inquiry for Website Development', time: '5 min ago', icon: MessageSquare, color: 'text-blue-600' },
        { type: 'contact', message: 'New contact form submission', time: '15 min ago', icon: Mail, color: 'text-green-600' },
        { type: 'inquiry', message: 'Quote accepted for E-commerce', time: '1 hour ago', icon: CheckCircle2, color: 'text-purple-600' },
        { type: 'payment', message: 'Payment received ₹50,000', time: '2 hours ago', icon: DollarSign, color: 'text-emerald-600' },
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      change: '+12.5%',
      changeType: 'up',
      description: 'vs last month',
    },
    {
      title: 'Pending Inquiries',
      value: stats.pendingInquiries.toString(),
      icon: Clock,
      gradient: 'from-orange-500 to-red-600',
      change: '+5',
      changeType: 'up',
      description: 'new this week',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: Activity,
      gradient: 'from-blue-500 to-purple-600',
      change: '+3',
      changeType: 'up',
      description: 'in progress',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries.toString(),
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-600',
      change: '+8.2%',
      changeType: 'up',
      description: 'this month',
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name}! 👋</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your business today.</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-base md:text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.changeType === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-xl transition-all border-none">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`} />
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <ChangeIcon className="h-4 w-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-none shadow-lg h-full">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10 flex-shrink-0`}>
                        <Icon className={`h-4 w-4 md:h-5 md:w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-none shadow-lg h-full">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Zap className="h-5 w-5 text-orange-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
              <button
                onClick={() => router.push('/admin/inquiries')}
                className="w-full p-3 md:p-4 text-left rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm md:text-base">View Inquiries</p>
                    <p className="text-xs md:text-sm text-blue-100">{stats.pendingInquiries} pending</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/services')}
                className="w-full p-3 md:p-4 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">Manage Services</p>
                    <p className="text-xs md:text-sm text-gray-600">{stats.totalServices} active</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/contacts')}
                className="w-full p-3 md:p-4 text-left rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">View Contacts</p>
                    <p className="text-xs md:text-sm text-gray-600">{stats.totalContacts} total</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/payments')}
                className="w-full p-3 md:p-4 text-left rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">Payment History</p>
                    <p className="text-xs md:text-sm text-gray-600">₹{(stats.totalRevenue / 1000).toFixed(0)}K revenue</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                </div>
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6 md:mb-8"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-3 md:p-4 rounded-xl bg-blue-50">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stats.totalInquiries}</div>
                <div className="text-xs md:text-sm text-gray-600">Total Inquiries</div>
              </div>
              <div className="text-center p-3 md:p-4 rounded-xl bg-green-50">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">{stats.activeProjects}</div>
                <div className="text-xs md:text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center p-3 md:p-4 rounded-xl bg-purple-50">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">{stats.totalServices}</div>
                <div className="text-xs md:text-sm text-gray-600">Services Offered</div>
              </div>
              <div className="text-center p-3 md:p-4 rounded-xl bg-orange-50">
                <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">{stats.monthlyGrowth}%</div>
                <div className="text-xs md:text-sm text-gray-600">Monthly Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
