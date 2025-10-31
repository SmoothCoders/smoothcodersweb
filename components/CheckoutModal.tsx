'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice, Currency } from '@/lib/utils/geolocation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceId: string;
  tier: 'basic' | 'standard' | 'premium';
  price: number;
  currency: Currency;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  serviceName,
  serviceId,
  tier,
  price,
  currency
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent, type: 'order' | 'chat' = 'order') => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Send to inquiries API instead of orders
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId,
          serviceName,
          tier,
          price,
          currency,
          type, // 'order' or 'chat'
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.notes || `Interested in ${serviceName} - ${tier.toUpperCase()} package`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to WhatsApp after 2 seconds
        setTimeout(() => {
          const isPremium = tier === 'premium';
          const priceText = isPremium ? 'Custom Quote' : formatPrice(price, currency);
          const message = type === 'chat' 
            ? `Hi! I have some questions about ${serviceName} (${tier.toUpperCase()} package). ${formData.notes || ''}`
            : `Hi! I'm interested in ${serviceName} (${tier.toUpperCase()} package) - ${priceText}. ${formData.notes ? `Notes: ${formData.notes}` : ''}`;
          window.open(`https://wa.me/919021311559?text=${encodeURIComponent(message)}`, '_blank');
          onClose();
          // Reset form
          setFormData({ name: '', email: '', phone: '', notes: '' });
          setSuccess(false);
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit inquiry');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {tier === 'premium' ? 'Get Custom Quote' : 'Complete Your Order'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {serviceName} - {tier.toUpperCase()} Package
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {success ? (
                // Success State
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
                  <p className="text-gray-600 mb-4">
                    We're redirecting you to WhatsApp to confirm your order details...
                  </p>
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
                </div>
              ) : (
                // Form
                <form onSubmit={handleSubmit} className="p-4">
                  {/* Price Summary */}
                  {tier !== 'premium' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-medium">Total Amount:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(price, currency)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {tier === 'premium' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-700">
                        Premium packages are customized to your needs. Share your requirements and we'll provide a tailored quote.
                      </p>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-3">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={2}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Any specific requirements..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="space-y-3 mt-4">
                    {/* Primary Button - Black with Arrow */}
                    <button
                      type="submit"
                      onClick={(e) => handleSubmit(e, tier === 'premium' ? 'chat' : 'order')}
                      disabled={isSubmitting}
                      className="w-full bg-black text-white hover:bg-gray-900 py-3 px-6 rounded-lg font-medium text-sm transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-center">
                            {tier === 'premium' ? 'Chat With Us' : 'Place Order'}
                          </span>
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>

                    {/* Secondary Chat Button for Basic/Standard - White with Border */}
                    {(tier === 'basic' || tier === 'standard') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(e as any, 'chat');
                        }}
                        disabled={isSubmitting}
                        className="w-full bg-white text-gray-900 border-2 border-black hover:bg-gray-50 py-3 px-6 rounded-lg font-medium text-sm transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Chat With Us
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    {tier === 'premium' 
                      ? "We'll discuss your requirements and provide a custom quote."
                      : "After submitting, you'll be redirected to WhatsApp to confirm details with our team."}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
