'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  DollarSign, 
  Briefcase, 
  FileText, 
  Receipt,
  TrendingUp,
  Activity,
  Loader2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Code,
  Building2,
  Eye,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function EnhancedDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    } else if (status === 'authenticated') {
      fetchAnalytics();
      fetchActivityLogs();
    }
  }, [status, router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/overview');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/admin/activity-logs?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setActivityLogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  if (loading || status === 'loading' || !analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const { overview, monthlyRevenue, projectsByStatus, topClients, topDevelopers, recent } = analytics;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="h-8 w-8 text-blue-600" />
          Business Overview
        </h1>
        <p className="text-gray-600 mt-2">Complete insights into your business operations</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Developers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push('/admin/developers')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Developers</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.developers.total}</p>
                  <p className="text-sm text-green-600 mt-2">
                    {overview.developers.active} active
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-100">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clients */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push('/admin/clients')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Clients</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.clients.total}</p>
                  <p className="text-sm text-green-600 mt-2">
                    {overview.clients.active} active
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-purple-100">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push('/admin/projects')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{overview.projects.total}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    {overview.projects.active} in progress
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-100">
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{(overview.financial.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-orange-600 mt-2">
                    ₹{(overview.financial.outstandingAmount / 1000).toFixed(0)}K pending
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-100">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-lg cursor-pointer" onClick={() => router.push('/admin/quotations')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quotations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overview.quotations.total}</p>
                <p className="text-xs text-green-600 mt-1">{overview.quotations.approved} approved</p>
              </div>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg cursor-pointer" onClick={() => router.push('/admin/invoices')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{overview.invoices.total}</p>
                <p className="text-xs text-green-600 mt-1">{overview.invoices.paid} paid</p>
              </div>
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Project Budget</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹{(overview.financial.totalProjectBudget / 1000).toFixed(0)}K</p>
              </div>
              <Target className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {overview.quotations.total > 0 
                    ? Math.round((overview.quotations.approved / overview.quotations.total) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {monthlyRevenue.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center mx-2">
                  <div
                    className="w-12 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                    style={{ height: `${(item.revenue / Math.max(...monthlyRevenue.map((m: any) => m.revenue))) * 200}px` }}
                  />
                  <p className="text-xs text-gray-600 mt-2">{item.month.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Top Clients by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.slice(0, 5).map((client: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.projects} projects</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">₹{(client.revenue / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Developers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Developers */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDevelopers.slice(0, 5).map((dev: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {dev.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dev.name}</p>
                      <p className="text-xs text-gray-500">{dev.role} • {dev.projects} projects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">⭐ {dev.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">₹{(dev.earnings / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLogs.slice(0, 8).map((log: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{log.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <button
          onClick={() => router.push('/admin/clients/new')}
          className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
        >
          + Add Client
        </button>
        <button
          onClick={() => router.push('/admin/quotations/new')}
          className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
        >
          + Create Quotation
        </button>
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
        >
          + New Project
        </button>
        <button
          onClick={() => router.push('/admin/invoices/new')}
          className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
        >
          + Generate Invoice
        </button>
        <button
          onClick={() => router.push('/admin/developers/new')}
          className="px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-center"
        >
          + Add Developer
        </button>
      </div>
    </div>
  );
}
