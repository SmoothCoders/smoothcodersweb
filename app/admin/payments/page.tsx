'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Download, Search, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Payment {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'success' | 'failed';
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // In a real implementation, fetch from API
      // For now, using mock data
      setPayments([
        {
          _id: '1',
          razorpayOrderId: 'order_MhN8bvGjkLm123',
          razorpayPaymentId: 'pay_MhN8bvGjkLm456',
          amount: 25000,
          currency: 'INR',
          status: 'success',
          serviceName: 'Website Development',
          customerName: 'Rajesh Kumar',
          customerEmail: 'rajesh@example.com',
          customerPhone: '+91 9876543210',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          razorpayOrderId: 'order_MhN8bvGjkLm789',
          amount: 15000,
          currency: 'INR',
          status: 'pending',
          serviceName: 'Digital Marketing',
          customerName: 'Priya Sharma',
          customerEmail: 'priya@example.com',
          customerPhone: '+91 9876543211',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
      setLoading(false);
    }
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'created':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredPayments = payments
    .filter(payment => filter === 'all' || payment.status === filter)
    .filter(payment => 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const successfulPayments = payments.filter(p => p.status === 'success').length;

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">Track all payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {successfulPayments}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {payments.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by customer, service, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'pending', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPayments.map((payment) => (
            <Card key={payment._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {payment.customerName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{payment.serviceName}</p>
                    <p className="text-sm text-gray-500">Order ID: {payment.razorpayOrderId}</p>
                    {payment.razorpayPaymentId && (
                      <p className="text-sm text-gray-500">Payment ID: {payment.razorpayPaymentId}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{payment.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{payment.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Currency</p>
                    <p className="text-sm text-gray-900">{payment.currency}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
