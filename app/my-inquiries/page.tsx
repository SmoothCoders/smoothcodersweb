'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  XCircle,
  Send,
  User,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Inquiry {
  _id: string;
  serviceName: string;
  clientName: string;
  projectDescription: string;
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

export default function MyInquiriesPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (email) {
      fetchInquiries();
    }
  }, [email]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`/api/inquiries?email=${email}`);
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
        if (data.data.length > 0) {
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
          sender: 'client',
          message: newMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        fetchInquiries();
        toast.success('Message sent!');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'quoted':
        return 'bg-purple-100 text-purple-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600">Please provide your email to view your inquiries.</p>
        </div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Inquiries Yet</h1>
          <p className="text-gray-600 mb-8">You haven't submitted any service inquiries.</p>
          <Button onClick={() => window.location.href = '/services'} className="bg-blue-600 hover:bg-blue-700">
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Inquiries</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Inquiries List */}
            <div className="lg:col-span-1 space-y-4">
              {inquiries.map((inquiry) => (
                <motion.div
                  key={inquiry._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedInquiry?._id === inquiry._id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${selectedInquiry?._id === inquiry._id ? 'text-white' : 'text-gray-900'}`}>
                      {inquiry.serviceName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedInquiry?._id === inquiry._id 
                        ? 'bg-white/20 text-white' 
                        : getStatusColor(inquiry.status)
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className={`text-sm ${selectedInquiry?._id === inquiry._id ? 'text-blue-100' : 'text-gray-600'}`}>
                    {formatDate(inquiry.createdAt)}
                  </p>
                  <div className={`flex items-center gap-2 mt-2 text-sm ${selectedInquiry?._id === inquiry._id ? 'text-blue-100' : 'text-gray-500'}`}>
                    <MessageSquare className="h-4 w-4" />
                    <span>{inquiry.messages.length} messages</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Interface */}
            {selectedInquiry && (
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedInquiry.serviceName}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Status: <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedInquiry.status)}`}>
                            {selectedInquiry.status}
                          </span>
                        </p>
                      </div>
                      {selectedInquiry.quotedPrice && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Quoted Price</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(selectedInquiry.quotedPrice)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                    {selectedInquiry.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.sender === 'client' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'admin' && <Shield className="h-4 w-4 text-blue-600" />}
                            <span className="text-xs text-gray-500">
                              {msg.sender === 'client' ? 'You' : 'SmoothCoders Team'}
                            </span>
                            {msg.sender === 'client' && <User className="h-4 w-4 text-gray-400" />}
                          </div>
                          <div
                            className={`p-4 rounded-2xl ${
                              msg.sender === 'client'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-2 ${msg.sender === 'client' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {selectedInquiry.quotedDescription && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Quote Details
                        </h4>
                        <p className="text-gray-700 mb-4">{selectedInquiry.quotedDescription}</p>
                        {selectedInquiry.quotedPrice && (
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-purple-900">
                              {formatCurrency(selectedInquiry.quotedPrice)}
                            </span>
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                              Accept Quote
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={sending || !newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {sending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </form>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
