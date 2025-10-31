'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  MessageSquare, 
  Send,
  DollarSign,
  Check,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Inquiry {
  _id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectDescription: string;
  tier?: 'basic' | 'standard' | 'premium';
  price?: number;
  currency?: 'INR' | 'USD';
  type?: 'order' | 'chat';
  status: string;
  quotedPrice?: number;
  quotedDescription?: string;
  messages: Array<{
    sender: 'client' | 'admin';
    message: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteData, setQuoteData] = useState({
    quotedPrice: '',
    quotedDescription: '',
    quotedDeliveryTime: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchInquiries();
    }
  }, [status, router]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
        if (data.data.length > 0 && !selectedInquiry) {
          setSelectedInquiry(data.data[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'admin',
          message: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        fetchInquiries();
        const updated = data.data;
        setSelectedInquiry(updated);
        toast.success('Message sent!');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const sendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotedPrice: parseFloat(quoteData.quotedPrice),
          quotedDescription: quoteData.quotedDescription,
          quotedDeliveryTime: quoteData.quotedDeliveryTime,
          status: 'quoted',
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Quote sent successfully!');
        setShowQuoteForm(false);
        fetchInquiries();
        setQuoteData({ quotedPrice: '', quotedDescription: '', quotedDeliveryTime: '' });
      }
    } catch (error) {
      toast.error('Failed to send quote');
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Inquiries & Chat</h1>
        <p className="text-gray-600 mt-2">Manage client inquiries and send custom quotes</p>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No inquiries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-1 space-y-3">
            {inquiries.map((inquiry) => (
              <Card
                key={inquiry._id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`cursor-pointer transition-all ${
                  selectedInquiry?._id === inquiry._id ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{inquiry.clientName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{inquiry.serviceName}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      inquiry.status === 'quoted' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {inquiry.status}
                    </span>
                    <span className="text-gray-500">{inquiry.messages.length} msgs</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chat & Details */}
          {selectedInquiry && (
            <div className="lg:col-span-3 space-y-6">
              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedInquiry.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedInquiry.clientEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedInquiry.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Package Tier</p>
                      <p className="font-medium">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          selectedInquiry.tier === 'premium' ? 'bg-purple-100 text-purple-700' :
                          selectedInquiry.tier === 'standard' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {selectedInquiry.tier?.toUpperCase() || 'N/A'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">
                        {selectedInquiry.price && selectedInquiry.price > 0 
                          ? `${selectedInquiry.currency === 'INR' ? '₹' : '$'}${selectedInquiry.price.toLocaleString()}`
                          : 'Custom Quote'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Inquiry Type</p>
                      <p className="font-medium">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          selectedInquiry.type === 'order' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {selectedInquiry.type === 'order' ? 'Order' : 'Chat'}
                        </span>
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Additional Notes</p>
                      <p className="font-medium">{selectedInquiry.projectDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat */}
              <Card className="h-[400px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Conversation</CardTitle>
                    <Button onClick={() => setShowQuoteForm(!showQuoteForm)} variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Send Quote
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedInquiry.messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%]`}>
                        <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-gray-500">
                            {msg.sender === 'admin' ? 'You' : selectedInquiry.clientName}
                          </span>
                        </div>
                        <div className={`p-4 rounded-2xl ${
                          msg.sender === 'admin'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-900 rounded-tl-none'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-xs mt-2 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="border-t p-4">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={sending}>
                      {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </form>
                </div>
              </Card>

              {/* Quote Form */}
              {showQuoteForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Send Custom Quote</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={sendQuote} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quote Price (₹)
                        </label>
                        <Input
                          type="number"
                          required
                          value={quoteData.quotedPrice}
                          onChange={(e) => setQuoteData({ ...quoteData, quotedPrice: e.target.value })}
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Time
                        </label>
                        <Input
                          required
                          value={quoteData.quotedDeliveryTime}
                          onChange={(e) => setQuoteData({ ...quoteData, quotedDeliveryTime: e.target.value })}
                          placeholder="2 weeks"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quote Description
                        </label>
                        <Textarea
                          required
                          rows={4}
                          value={quoteData.quotedDescription}
                          onChange={(e) => setQuoteData({ ...quoteData, quotedDescription: e.target.value })}
                          placeholder="Describe what's included in this quote..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          <Check className="h-4 w-4 mr-2" />
                          Send Quote
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
