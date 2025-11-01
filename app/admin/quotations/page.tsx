'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Loader2,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  XCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Quotation {
  _id: string;
  quotationNumber: string;
  client: {
    _id: string;
    name: string;
    email: string;
    company: string;
  };
  projectName: string;
  projectType: string;
  validUntil: string;
  status: string;
  subtotal: number;
  discount: {
    amount: number;
  };
  tax: {
    amount: number;
  };
  total: number;
  currency: string;
  createdAt: string;
  convertedToProject: any;
}

export default function QuotationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchQuotations();
    }
  }, [status, router]);

  const fetchQuotations = async () => {
    try {
      const response = await fetch('/api/admin/quotations');
      const data = await response.json();
      
      if (data.success) {
        setQuotations(data.data);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'viewed':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'converted':
        return <TrendingUp className="h-4 w-4 text-indigo-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      viewed: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
      converted: 'bg-indigo-100 text-indigo-700',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = 
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quotation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === 'draft').length,
    sent: quotations.filter(q => q.status === 'sent').length,
    approved: quotations.filter(q => q.status === 'approved').length,
    converted: quotations.filter(q => q.status === 'converted').length,
    totalValue: quotations.reduce((sum, q) => sum + q.total, 0),
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
              <FileText className="h-8 w-8 text-blue-600" />
              Quotations
            </h1>
            <p className="text-gray-600 mt-2">Create and manage client quotations</p>
          </div>
          <button
            onClick={() => router.push('/admin/quotations/new')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            New Quotation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
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
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.sent}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
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
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.converted}</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-100">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">₹{(stats.totalValue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
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
                placeholder="Search quotations..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuotations.map((quotation, index) => (
          <motion.div
            key={quotation._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{quotation.quotationNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(quotation.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(quotation.status)}
                          {quotation.status}
                        </div>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{quotation.projectName}</p>
                    <p className="text-xs text-gray-500">Client: {quotation.client?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Valid Until</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(quotation.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Amount</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {quotation.currency} {quotation.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/quotations/${quotation._id}`)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  {quotation.status === 'approved' && !quotation.convertedToProject && (
                    <button
                      onClick={() => router.push(`/admin/quotations/${quotation._id}/convert`)}
                      className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Convert
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredQuotations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No quotations found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => router.push('/admin/quotations/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Quotation
          </button>
        </div>
      )}
    </div>
  );
}
