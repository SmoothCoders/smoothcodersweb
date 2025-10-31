'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [serviceId, setServiceId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    image: '',
    price: '',
    category: 'Web Development',
    features: [''] as string[],
    isActive: true,
    pricingTiers: {
      basic: {
        name: 'Basic',
        title: '',
        description: '',
        priceINR: '',
        priceUSD: '',
        features: [''] as string[],
        deliveryDays: '',
        revisions: '',
        contactForPricing: false,
      },
      standard: {
        name: 'Standard',
        title: '',
        description: '',
        priceINR: '',
        priceUSD: '',
        features: [''] as string[],
        deliveryDays: '',
        revisions: '',
        contactForPricing: false,
      },
      premium: {
        name: 'Premium',
        title: '',
        description: '',
        priceINR: '0', // Always 0 for Premium
        priceUSD: '0', // Always 0 for Premium
        features: [''] as string[],
        deliveryDays: '',
        revisions: '',
        contactForPricing: true,
      },
    },
  });

  const categories = [
    'Web Development',
    'Mobile App',
    'Digital Marketing',
    'E-commerce',
    'Design',
    'Other'
  ];

  useEffect(() => {
    params.then(p => {
      setServiceId(p.id);
      fetchService(p.id);
    });
  }, []);

  const fetchService = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`);
      const data = await response.json();

      if (data.success) {
        const service = data.data;
        setFormData({
          title: service.title,
          description: service.description,
          seoTitle: service.seoTitle || `${service.title} | SmoothCoders`,
          seoDescription: service.seoDescription || (service.description ? service.description.substring(0, 160) : ''),
          image: service.image || '',
          price: service.price.toString(),
          category: service.category,
          features: service.features && service.features.length > 0 ? service.features : [''],
          isActive: service.isActive !== false,
          pricingTiers: {
            basic: {
              name: 'Basic',
              title: service.pricingTiers?.basic?.title || '',
              description: service.pricingTiers?.basic?.description || '',
              priceINR: service.pricingTiers?.basic?.priceINR?.toString() || '',
              priceUSD: service.pricingTiers?.basic?.priceUSD?.toString() || '',
              features: service.pricingTiers?.basic?.features && service.pricingTiers.basic.features.length > 0 ? service.pricingTiers.basic.features : [''],
              deliveryDays: service.pricingTiers?.basic?.deliveryDays?.toString() || '',
              revisions: service.pricingTiers?.basic?.revisions || '',
              contactForPricing: service.pricingTiers?.basic?.contactForPricing || false,
            },
            standard: {
              name: 'Standard',
              title: service.pricingTiers?.standard?.title || '',
              description: service.pricingTiers?.standard?.description || '',
              priceINR: service.pricingTiers?.standard?.priceINR?.toString() || '',
              priceUSD: service.pricingTiers?.standard?.priceUSD?.toString() || '',
              features: service.pricingTiers?.standard?.features && service.pricingTiers.standard.features.length > 0 ? service.pricingTiers.standard.features : [''],
              deliveryDays: service.pricingTiers?.standard?.deliveryDays?.toString() || '',
              revisions: service.pricingTiers?.standard?.revisions || '',
              contactForPricing: service.pricingTiers?.standard?.contactForPricing || false,
            },
            premium: {
              name: 'Premium',
              title: service.pricingTiers?.premium?.title || '',
              description: service.pricingTiers?.premium?.description || '',
              priceINR: '0', // Always 0 for Premium
              priceUSD: '0', // Always 0 for Premium
              features: service.pricingTiers?.premium?.features && service.pricingTiers.premium.features.length > 0 ? service.pricingTiers.premium.features : [''],
              deliveryDays: service.pricingTiers?.premium?.deliveryDays?.toString() || '',
              revisions: service.pricingTiers?.premium?.revisions || '',
              contactForPricing: true, // Always true for Premium
            },
          },
        });
      } else {
        toast.error('Service not found');
        router.push('/admin/services');
      }
    } catch (error) {
      toast.error('Failed to load service');
      router.push('/admin/services');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceId) {
      toast.error('Service ID not loaded yet');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          features: formData.features.filter(f => f.trim() !== ''),
          pricingTiers: {
            basic: {
              name: 'Basic',
              title: formData.pricingTiers.basic.title,
              description: formData.pricingTiers.basic.description,
              priceINR: formData.pricingTiers.basic.contactForPricing ? 0 : parseFloat(formData.pricingTiers.basic.priceINR) || 0,
              priceUSD: formData.pricingTiers.basic.contactForPricing ? 0 : parseFloat(formData.pricingTiers.basic.priceUSD) || 0,
              features: formData.pricingTiers.basic.features.filter(f => f.trim() !== ''),
              deliveryDays: parseInt(formData.pricingTiers.basic.deliveryDays) || 1,
              revisions: formData.pricingTiers.basic.revisions,
              contactForPricing: formData.pricingTiers.basic.contactForPricing,
            },
            standard: {
              name: 'Standard',
              title: formData.pricingTiers.standard.title,
              description: formData.pricingTiers.standard.description,
              priceINR: formData.pricingTiers.standard.contactForPricing ? 0 : parseFloat(formData.pricingTiers.standard.priceINR) || 0,
              priceUSD: formData.pricingTiers.standard.contactForPricing ? 0 : parseFloat(formData.pricingTiers.standard.priceUSD) || 0,
              features: formData.pricingTiers.standard.features.filter(f => f.trim() !== ''),
              deliveryDays: parseInt(formData.pricingTiers.standard.deliveryDays) || 1,
              revisions: formData.pricingTiers.standard.revisions,
              contactForPricing: formData.pricingTiers.standard.contactForPricing,
            },
            premium: {
              name: 'Premium',
              title: formData.pricingTiers.premium.title,
              description: formData.pricingTiers.premium.description,
              priceINR: 0, // Always 0 for Premium
              priceUSD: 0, // Always 0 for Premium
              features: formData.pricingTiers.premium.features.filter(f => f.trim() !== ''),
              deliveryDays: parseInt(formData.pricingTiers.premium.deliveryDays) || 1,
              revisions: formData.pricingTiers.premium.revisions,
              contactForPricing: true, // Always true for Premium
            },
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Service updated successfully!');
        router.push('/admin/services');
      } else {
        toast.error(data.error || 'Failed to update service');
      }
    } catch (error) {
      toast.error('Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  // Package feature management
  const addPackageFeature = (tier: 'basic' | 'standard' | 'premium') => {
    setFormData({
      ...formData,
      pricingTiers: {
        ...formData.pricingTiers,
        [tier]: {
          ...formData.pricingTiers[tier],
          features: [...formData.pricingTiers[tier].features, '']
        }
      }
    });
  };

  const removePackageFeature = (tier: 'basic' | 'standard' | 'premium', index: number) => {
    const newFeatures = formData.pricingTiers[tier].features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      pricingTiers: {
        ...formData.pricingTiers,
        [tier]: {
          ...formData.pricingTiers[tier],
          features: newFeatures
        }
      }
    });
  };

  const updatePackageFeature = (tier: 'basic' | 'standard' | 'premium', index: number, value: string) => {
    const newFeatures = [...formData.pricingTiers[tier].features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      pricingTiers: {
        ...formData.pricingTiers,
        [tier]: {
          ...formData.pricingTiers[tier],
          features: newFeatures
        }
      }
    });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/services')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-2">Update service information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Website Design & Development"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the service..."
                  rows={5}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25000"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/services/web-dev.jpg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Service is active
                </label>
              </div>
            </CardContent>
          </Card>

          {/* SEO Information */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title * (Max 60 characters)
                </label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Professional Website Development Services"
                  maxLength={60}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description * (Max 160 characters)
                </label>
                <Textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Get modern, responsive websites built with latest technologies..."
                  maxLength={160}
                  rows={3}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Features</span>
                <Button
                  type="button"
                  size="sm"
                  onClick={addFeature}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="e.g., Responsive Design"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing Tiers - Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Packages</CardTitle>
              <p className="text-sm text-gray-600 mt-2">Configure Basic, Standard, and Premium packages for this service</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Package */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Package</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Title *
                    </label>
                    <Input
                      value={formData.pricingTiers.basic.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricingTiers: {
                          ...formData.pricingTiers,
                          basic: { ...formData.pricingTiers.basic, title: e.target.value }
                        }
                      })}
                      placeholder="e.g., ONE PRODUCT SHOPIFY STORE"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.pricingTiers.basic.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricingTiers: {
                          ...formData.pricingTiers,
                          basic: { ...formData.pricingTiers.basic, description: e.target.value }
                        }
                      })}
                      placeholder="Brief description of what's included"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price INR (₹) *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.basic.priceINR}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            basic: { ...formData.pricingTiers.basic, priceINR: e.target.value }
                          }
                        })}
                        placeholder="7894"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price USD ($) *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.basic.priceUSD}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            basic: { ...formData.pricingTiers.basic, priceUSD: e.target.value }
                          }
                        })}
                        placeholder="99"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Days *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.basic.deliveryDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            basic: { ...formData.pricingTiers.basic, deliveryDays: e.target.value }
                          }
                        })}
                        placeholder="7"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revisions *
                      </label>
                      <Input
                        value={formData.pricingTiers.basic.revisions}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            basic: { ...formData.pricingTiers.basic, revisions: e.target.value }
                          }
                        })}
                        placeholder="Unlimited or 3"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.pricingTiers.basic.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updatePackageFeature('basic', index, e.target.value)}
                            placeholder="e.g., Functional website"
                          />
                          {formData.pricingTiers.basic.features.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removePackageFeature('basic', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addPackageFeature('basic')}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Package */}
              <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Package</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Title *
                    </label>
                    <Input
                      value={formData.pricingTiers.standard.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricingTiers: {
                          ...formData.pricingTiers,
                          standard: { ...formData.pricingTiers.standard, title: e.target.value }
                        }
                      })}
                      placeholder="e.g., PROFESSIONAL SHOPIFY STORE"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.pricingTiers.standard.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricingTiers: {
                          ...formData.pricingTiers,
                          standard: { ...formData.pricingTiers.standard, description: e.target.value }
                        }
                      })}
                      placeholder="Brief description of what's included"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price INR (₹) *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.standard.priceINR}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            standard: { ...formData.pricingTiers.standard, priceINR: e.target.value }
                          }
                        })}
                        placeholder="26467"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price USD ($) *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.standard.priceUSD}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            standard: { ...formData.pricingTiers.standard, priceUSD: e.target.value }
                          }
                        })}
                        placeholder="299"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Days *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.standard.deliveryDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            standard: { ...formData.pricingTiers.standard, deliveryDays: e.target.value }
                          }
                        })}
                        placeholder="14"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revisions *
                      </label>
                      <Input
                        value={formData.pricingTiers.standard.revisions}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            standard: { ...formData.pricingTiers.standard, revisions: e.target.value }
                          }
                        })}
                        placeholder="Unlimited or 5"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.pricingTiers.standard.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updatePackageFeature('standard', index, e.target.value)}
                            placeholder="e.g., Professional 20-Product Shopify Store"
                          />
                          {formData.pricingTiers.standard.features.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removePackageFeature('standard', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addPackageFeature('standard')}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Package */}
              <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Package</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Title *
                    </label>
                    <Input
                      value={formData.pricingTiers.premium.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricingTiers: {
                          ...formData.pricingTiers,
                          premium: { ...formData.pricingTiers.premium, title: e.target.value }
                        }
                      })}
                      placeholder="e.g., BUSINESS SHOPIFY STORE"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={formData.pricingTiers.premium.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        pricingTiers: {
                          ...formData.pricingTiers,
                          premium: { ...formData.pricingTiers.premium, description: e.target.value }
                        }
                      })}
                      placeholder="Brief description of what's included"
                      rows={2}
                      required
                    />
                  </div>
                  
                  {/* Premium Pricing Info - Contact Only */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          Premium Tier - Custom Pricing Only
                        </h4>
                        <p className="text-sm text-gray-700">
                          Premium packages don't display fixed pricing. Users will see "Get Custom Quote" button and can contact for tailored enterprise solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Days *
                      </label>
                      <Input
                        type="number"
                        value={formData.pricingTiers.premium.deliveryDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            premium: { ...formData.pricingTiers.premium, deliveryDays: e.target.value }
                          }
                        })}
                        placeholder="21"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revisions *
                      </label>
                      <Input
                        value={formData.pricingTiers.premium.revisions}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricingTiers: {
                            ...formData.pricingTiers,
                            premium: { ...formData.pricingTiers.premium, revisions: e.target.value }
                          }
                        })}
                        placeholder="Unlimited"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.pricingTiers.premium.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updatePackageFeature('premium', index, e.target.value)}
                            placeholder="e.g., Business 50-Products + Branding + SEO"
                          />
                          {formData.pricingTiers.premium.features.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removePackageFeature('premium', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addPackageFeature('premium')}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Service'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/services')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
