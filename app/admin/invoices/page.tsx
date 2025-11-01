'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Loader2,
  Receipt,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  AlertTriangle,
  Edit,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: {
    _id: string;
    name: string;
    email: string;
    company: string;
  };
  project: any;
  issueDate: string;
  dueDate: string;
  status: string;
  subtotal: number;
  discount: {
    amount: number;
  };
  tax: {
    amount: number;
  };
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  payments: any[];
  createdAt: string;
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchInvoices();
    }
  }, [status, router]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices');
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'partially-paid':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-purple-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-purple-100 text-purple-700',
      viewed: 'bg-blue-100 text-blue-700',
      'partially-paid': 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.reduce((sum, i) => sum + i.amountPaid, 0),
    outstanding: invoices.reduce((sum, i) => sum + i.amountDue, 0),
  };

  if (loading || status === 'loading') {
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
              <Receipt className="h-8 w-8 text-blue-600" />
              Invoices
            </h1>
            <p className="text-gray-600 mt-2">Manage invoices and track payments</p>
          </div>
          <button
            onClick={() => router.push('/admin/invoices/new')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">{stats.draft}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.sent}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.paid}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.overdue}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">₹{(stats.outstanding / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="partially-paid">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInvoices.map((invoice, index) => (
          <motion.div
            key={invoice._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{invoice.invoiceNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(invoice.status)}
                          {invoice.status.replace('-', ' ')}
                        </div>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Client: {invoice.client?.name}</p>
                    {invoice.client?.company && (
                      <p className="text-xs text-gray-500">{invoice.client.company}</p>
                    )}
                  </div>
                </div>

                {/* Payment Progress */}
                {invoice.amountPaid > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Payment Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {((invoice.amountPaid / invoice.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${(invoice.amountPaid / invoice.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due Date</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Amount</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.currency} {invoice.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Paid</p>
                    <p className="font-semibold text-green-600">₹{invoice.amountPaid.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Due</p>
                    <p className="font-semibold text-orange-600">₹{invoice.amountDue.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/invoices/${invoice._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  {invoice.status !== 'paid' && invoice.amountDue > 0 && (
                    <button
                      onClick={() => router.push(`/admin/invoices/${invoice._id}/payment`)}
                      className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Record Payment
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => router.push('/admin/invoices/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Invoice
          </button>
        </div>
      )}
    </div>
  );
}
