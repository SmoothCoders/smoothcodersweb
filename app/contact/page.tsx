'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Send, 
  Clock, 
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'contact@smoothcoders.com',
    href: 'mailto:contact@smoothcoders.com',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Drop us a line anytime'
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 9021311559',
    href: 'tel:+919021311559',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Mon-Sat, 9AM-6PM'
  },
  {
    icon: Clock,
    title: 'Working Hours',
    value: 'Mon - Sat: 9AM - 6PM',
    subvalue: 'Sunday: Closed',
    gradient: 'from-green-500 to-green-600',
    description: 'We reply within 24 hours'
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-600' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
];

const faqs = [
  { question: 'How quickly can you start my project?', answer: 'We typically start within 1-2 business days after project agreement.' },
  { question: 'Do you offer free consultations?', answer: 'Yes! We offer a free initial consultation to discuss your project needs.' },
  { question: 'What is your project completion timeline?', answer: 'Timeline varies by project complexity, typically 2-8 weeks for most projects.' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 md:pb-20">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 md:py-20 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Get In Touch
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Let's Start a{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Conversation
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-2 px-3 py-2 md:px-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md md:shadow-lg">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-900">Quick Response</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 md:px-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md md:shadow-lg">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-900">Free Consultation</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 md:px-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md md:shadow-lg">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-900">24/7 Support</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 md:py-12 -mt-8 md:-mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Card className="h-full border-none shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-5 md:p-6 relative">
                        <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-md md:shadow-lg`}>
                          <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                        {item.href ? (
                          <a href={item.href} className="text-gray-700 font-medium hover:text-blue-600 transition-colors block">
                            {item.value}
                          </a>
                        ) : (
                          <>
                            <p className="text-gray-700 font-medium">{item.value}</p>
                            {item.subvalue && <p className="text-sm text-gray-600 mt-1">{item.subvalue}</p>}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Form & Info */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-6 md:gap-12">
              {/* Left Side - Form */}
              <div className="lg:col-span-3">
                <FadeIn delay={0.2}>
                  <Card className="border-none shadow-lg md:shadow-2xl">
                    <CardContent className="p-6 md:p-8 lg:p-10">
                      <div className="mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                        <p className="text-sm md:text-base text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                              Your Name *
                            </label>
                            <Input
                              id="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="John Doe"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="john@example.com"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <Input
                              id="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+91 9876543210"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                              Subject *
                            </label>
                            <Input
                              id="subject"
                              type="text"
                              required
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              placeholder="How can we help?"
                              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                            Message *
                          </label>
                          <Textarea
                            id="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us about your project requirements..."
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                        >
                          {loading ? (
                            <>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>

              {/* Right Side - Additional Info */}
              <div className="lg:col-span-2 space-y-4 md:space-y-8">
                {/* Social Links */}
                <FadeIn delay={0.3}>
                  <Card className="border-none shadow-lg md:shadow-xl">
                    <CardContent className="p-5 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Connect With Us</h3>
                      <p className="text-gray-600 mb-4 md:mb-6 text-sm">Follow us on social media for updates and news</p>
                      <div className="flex gap-4">
                        {socialLinks.map((social) => {
                          const Icon = social.icon;
                          return (
                            <motion.a
                              key={social.label}
                              href={social.href}
                              whileHover={{ scale: 1.1, y: -5 }}
                              className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 ${social.color} transition-colors`}
                            >
                              <Icon className="h-5 w-5" />
                            </motion.a>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Quick FAQs */}
                <FadeIn delay={0.4}>
                  <Card className="border-none shadow-lg md:shadow-xl">
                    <CardContent className="p-5 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Quick Questions?</h3>
                      <div className="space-y-4">
                        {faqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{faq.question}</h4>
                            <p className="text-gray-600 text-sm">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => window.location.href = '/services'}
                        variant="outline"
                        className="w-full mt-6 rounded-xl border-2 hover:border-blue-600 hover:bg-blue-50 group"
                      >
                        <span>View Our Services</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Response Time Badge */}
                <FadeIn delay={0.5}>
                  <Card className="border-none shadow-lg md:shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
                    <CardContent className="p-5 md:p-6 text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                        <Clock className="h-7 w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">24 Hour Response Time</h3>
                      <p className="text-gray-600 text-sm">
                        We typically respond to all inquiries within 24 hours during business days
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
