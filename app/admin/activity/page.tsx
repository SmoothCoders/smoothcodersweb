'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Search,
  Loader2,
  Filter,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ActivityLog {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  action: string;
  module: string;
  description: string;
  createdAt: string;
  metadata: any;
}

export default function ActivityLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 50 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchLogs();
    }
  }, [status, router, page, filterModule, filterAction]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });
      
      if (filterModule !== 'all') params.append('module', filterModule);
      if (filterAction !== 'all') params.append('action', filterAction);

      const response = await fetch(`/api/admin/activity-logs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const colors = {
      create: 'bg-green-100 text-green-700',
      update: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700',
      login: 'bg-purple-100 text-purple-700',
      logout: 'bg-gray-100 text-gray-700',
      send: 'bg-indigo-100 text-indigo-700',
      approve: 'bg-green-100 text-green-700',
      reject: 'bg-red-100 text-red-700',
      'payment-received': 'bg-emerald-100 text-emerald-700',
      'payment-sent': 'bg-orange-100 text-orange-700',
      'status-change': 'bg-yellow-100 text-yellow-700',
      assignment: 'bg-blue-100 text-blue-700',
      comment: 'bg-purple-100 text-purple-700',
      upload: 'bg-indigo-100 text-indigo-700',
      download: 'bg-cyan-100 text-cyan-700',
    };
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getModuleBadge = (module: string) => {
    const colors = {
      project: 'bg-indigo-100 text-indigo-700',
      developer: 'bg-blue-100 text-blue-700',
      client: 'bg-purple-100 text-purple-700',
      quotation: 'bg-pink-100 text-pink-700',
      invoice: 'bg-green-100 text-green-700',
      payment: 'bg-emerald-100 text-emerald-700',
      user: 'bg-orange-100 text-orange-700',
      system: 'bg-gray-100 text-gray-700',
    };
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    return (
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading && logs.length === 0 || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              Activity Logs
            </h1>
            <p className="text-gray-600 mt-2">Track all system activities and changes</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>{pagination.total} total activities</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterModule}
              onChange={(e) => { setFilterModule(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Modules</option>
              <option value="project">Projects</option>
              <option value="developer">Developers</option>
              <option value="client">Clients</option>
              <option value="quotation">Quotations</option>
              <option value="invoice">Invoices</option>
              <option value="payment">Payments</option>
              <option value="user">Users</option>
              <option value="system">System</option>
            </select>

            <select
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="send">Send</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="payment-received">Payment Received</option>
              <option value="payment-sent">Payment Sent</option>
              <option value="status-change">Status Change</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {log.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadge(log.action)}`}>
                      {log.action.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleBadge(log.module)}`}>
                      {log.module}
                    </span>
                  </div>

                  <p className="text-gray-900 font-medium mb-1">{log.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{log.user?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(log.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                        View details
                      </summary>
                      <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Page {page} of {pagination.pages} ({pagination.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity logs found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
