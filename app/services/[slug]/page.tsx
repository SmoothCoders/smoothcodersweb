'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Loader2,
  Star,
  Clock,
  MessageSquare,
  Users,
  Award,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Send,
  Check,
  X,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface PricingTier {
  name: string;
  title: string;
  description: string;
  priceINR: number;
  priceUSD: number;
  features: string[];
  deliveryDays: number;
  revisions: string;
  isPopular?: boolean;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  features: string[];
  image: string;
  pricingTiers?: {
    basic: PricingTier;
    standard: PricingTier;
    premium: PricingTier;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

const whyChooseUs = [
  { icon: Award, title: 'Expert Team', description: '10+ years of experience' },
  { icon: Shield, title: 'Quality Guaranteed', description: '100% satisfaction promise' },
  { icon: Clock, title: 'Fast Delivery', description: 'Quick turnaround time' },
  { icon: TrendingUp, title: 'Proven Results', description: '500+ successful projects' },
];


export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Standard');
  
  const [inquiryData, setInquiryData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    projectDescription: '',
    budget: '',
    timeline: '',
  });

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      if (data.success) {
        const foundService = data.data.find((s: Service) => {
          const serviceSlug = s.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          return serviceSlug === slug;
        });
        setService(foundService || null);
      }
    } catch (error) {
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.title,
          ...inquiryData,
          projectDescription: `${inquiryData.projectDescription}\n\nSelected Package: ${selectedPackage}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setShowInquiryForm(false);
        setInquiryData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          clientCompany: '',
          projectDescription: '',
          budget: '',
          timeline: '',
        });
        
        // Redirect to inquiries page or chat
        setTimeout(() => {
          router.push(`/my-inquiries?email=${inquiryData.clientEmail}`);
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <FadeIn>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/services" className="hover:text-blue-600">Services</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{service.title}</span>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Service Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <FadeIn>
                <Card className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h1>
                      <p className="text-xl text-gray-600">{service.shortDescription}</p>
                    </div>
                  </div>
                </Card>
              </FadeIn>

              {/* Seller Info Card */}
              <FadeIn delay={0.1}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">SC</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">SmoothCoders Team</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">4.9</span>
                            <span className="text-gray-500 text-sm">(500+ reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <Users className="h-4 w-4" />
                            <span>300+ clients served</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* About Service */}
              <FadeIn delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      About This Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* What's Included */}
              <FadeIn delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Package Options - Only show if pricing tiers exist */}
              {service.pricingTiers && (
                <FadeIn delay={0.4}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        Choose Your Package
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {['basic', 'standard', 'premium'].map((tierKey) => {
                          const tier = service.pricingTiers![tierKey as keyof typeof service.pricingTiers];
                          return (
                            <motion.div
                              key={tierKey}
                              whileHover={{ y: -5 }}
                              onClick={() => setSelectedPackage(tier.name)}
                              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedPackage === tier.name
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <h4 className="font-semibold text-lg mb-1">{tier.name}</h4>
                              <p className="text-sm text-gray-600 mb-3">{tier.title}</p>
                              <div className="text-2xl font-bold text-gray-900 mb-3">
                                ₹{tier.priceINR.toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                <Clock className="h-4 w-4" />
                                <span>{tier.deliveryDays} days delivery</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-4">
                                <strong>Revisions:</strong> {tier.revisions}
                              </div>
                              <ul className="space-y-2">
                                {tier.features.map((feat, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              )}

              {/* Compare Packages Section */}
              {service.pricingTiers && (
                <FadeIn delay={0.45}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Compare Packages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-4 font-semibold text-gray-700">Package</th>
                              <th className="text-center p-4 font-semibold text-gray-700">Basic</th>
                              <th className="text-center p-4 font-semibold text-gray-700 bg-blue-50">Standard</th>
                              <th className="text-center p-4 font-semibold text-gray-700">Premium</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-4 font-medium text-gray-900">Price (INR)</td>
                              <td className="text-center p-4">₹{service.pricingTiers.basic.priceINR.toLocaleString('en-IN')}</td>
                              <td className="text-center p-4 bg-blue-50">₹{service.pricingTiers.standard.priceINR.toLocaleString('en-IN')}</td>
                              <td className="text-center p-4">₹{service.pricingTiers.premium.priceINR.toLocaleString('en-IN')}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-4 font-medium text-gray-900">Price (USD)</td>
                              <td className="text-center p-4">${service.pricingTiers.basic.priceUSD}</td>
                              <td className="text-center p-4 bg-blue-50">${service.pricingTiers.standard.priceUSD}</td>
                              <td className="text-center p-4">${service.pricingTiers.premium.priceUSD}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-4 font-medium text-gray-900">Title</td>
                              <td className="text-center p-4 text-sm">{service.pricingTiers.basic.title}</td>
                              <td className="text-center p-4 bg-blue-50 text-sm">{service.pricingTiers.standard.title}</td>
                              <td className="text-center p-4 text-sm">{service.pricingTiers.premium.title}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-4 font-medium text-gray-900">Description</td>
                              <td className="text-center p-4 text-sm text-gray-600">{service.pricingTiers.basic.description}</td>
                              <td className="text-center p-4 bg-blue-50 text-sm text-gray-600">{service.pricingTiers.standard.description}</td>
                              <td className="text-center p-4 text-sm text-gray-600">{service.pricingTiers.premium.description}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-4 font-medium text-gray-900">Delivery Time</td>
                              <td className="text-center p-4">{service.pricingTiers.basic.deliveryDays} days</td>
                              <td className="text-center p-4 bg-blue-50">{service.pricingTiers.standard.deliveryDays} days</td>
                              <td className="text-center p-4">{service.pricingTiers.premium.deliveryDays} days</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-4 font-medium text-gray-900">Revisions</td>
                              <td className="text-center p-4">{service.pricingTiers.basic.revisions}</td>
                              <td className="text-center p-4 bg-blue-50">{service.pricingTiers.standard.revisions}</td>
                              <td className="text-center p-4">{service.pricingTiers.premium.revisions}</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-medium text-gray-900 align-top">Features</td>
                              <td className="p-4 align-top">
                                <ul className="text-sm space-y-1">
                                  {service.pricingTiers.basic.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="p-4 bg-blue-50 align-top">
                                <ul className="text-sm space-y-1">
                                  {service.pricingTiers.standard.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="p-4 align-top">
                                <ul className="text-sm space-y-1">
                                  {service.pricingTiers.premium.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              )}

              {/* Why Choose Us */}
              <FadeIn delay={0.5}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Why Choose SmoothCoders?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {whyChooseUs.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Right Column - Pricing & Inquiry */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <FadeIn delay={0.3}>
                  <Card className="border-2 border-blue-200 shadow-xl">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600 mb-2">Starting from</p>
                        <p className="text-5xl font-bold text-gray-900 mb-1">
                          {service.pricingTiers 
                            ? `₹${service.pricingTiers.basic.priceINR.toLocaleString('en-IN')}`
                            : formatCurrency(service.price)
                          }
                        </p>
                        <p className="text-sm text-gray-500">*Custom pricing based on requirements</p>
                      </div>

                      {!showInquiryForm ? (
                        <div className="space-y-3">
                          <Button
                            onClick={() => setShowInquiryForm(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
                          >
                            <MessageSquare className="mr-2 h-5 w-5" />
                            <span>Request Custom Quote</span>
                          </Button>
                          
                          <Link href="/contact">
                            <Button variant="outline" className="w-full py-6 rounded-xl border-2">
                              Contact Us First
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitInquiry} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Name *
                            </label>
                            <Input
                              required
                              value={inquiryData.clientName}
                              onChange={(e) =>
                                setInquiryData({ ...inquiryData, clientName: e.target.value })
                              }
                              placeholder="John Doe"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <Input
                              type="email"
                              required
                              value={inquiryData.clientEmail}
                              onChange={(e) =>
                                setInquiryData({ ...inquiryData, clientEmail: e.target.value })
                              }
                              placeholder="john@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone *
                            </label>
                            <Input
                              type="tel"
                              required
                              value={inquiryData.clientPhone}
                              onChange={(e) =>
                                setInquiryData({ ...inquiryData, clientPhone: e.target.value })
                              }
                              placeholder="+91 9876543210"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company (Optional)
                            </label>
                            <Input
                              value={inquiryData.clientCompany}
                              onChange={(e) =>
                                setInquiryData({ ...inquiryData, clientCompany: e.target.value })
                              }
                              placeholder="Your Company"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Project Description *
                            </label>
                            <Textarea
                              required
                              rows={4}
                              value={inquiryData.projectDescription}
                              onChange={(e) =>
                                setInquiryData({ ...inquiryData, projectDescription: e.target.value })
                              }
                              placeholder="Tell us about your project requirements..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget
                              </label>
                              <Input
                                value={inquiryData.budget}
                                onChange={(e) =>
                                  setInquiryData({ ...inquiryData, budget: e.target.value })
                                }
                                placeholder="₹50,000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timeline
                              </label>
                              <Input
                                value={inquiryData.timeline}
                                onChange={(e) =>
                                  setInquiryData({ ...inquiryData, timeline: e.target.value })
                                }
                                placeholder="2 weeks"
                              />
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Selected Package:</strong> {selectedPackage}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 rounded-xl"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-5 w-5" />
                                  Send Inquiry
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowInquiryForm(false)}
                              className="px-4"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </form>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Free consultation included</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Quick response within 24 hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Money-back guarantee</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Contact Info */}
                <FadeIn delay={0.4}>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Need Help?</h3>
                      <div className="space-y-3 text-sm">
                        <a href="mailto:contact@smoothcoders.com" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                          <MessageSquare className="h-4 w-4" />
                          <span>contact@smoothcoders.com</span>
                        </a>
                        <a href="tel:+919021311559" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                          <Phone className="h-4 w-4" />
                          <span>+91 9021311559</span>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
