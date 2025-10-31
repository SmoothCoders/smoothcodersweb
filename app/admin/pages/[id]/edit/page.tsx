'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function EditServicePageSEO({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pageId, setPageId] = useState<string>('');
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    serviceName: '',
    cityName: '',
    cityId: '',
    slug: '',
  });

  useEffect(() => {
    params.then(p => {
      setPageId(p.id);
      fetchPage(p.id);
    });
  }, []);

  const fetchPage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/service-pages/${id}`);
      const data = await response.json();

      if (data.success) {
        const page = data.data;
        setFormData({
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          serviceName: page.serviceId.title,
          cityName: page.cityId.name,
          cityId: page.cityId._id,
          slug: page.slug,
        });
      } else {
        toast.error('Page not found');
        router.push('/admin/pages');
      }
    } catch (error) {
      toast.error('Failed to load page');
      router.push('/admin/pages');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/service-pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('SEO settings updated successfully!');
        router.push(`/admin/cities/${formData.cityId}`);
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
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
          onClick={() => router.push(`/admin/cities/${formData.cityId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {formData.cityName}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit SEO Settings</h1>
        <p className="text-gray-600 mt-2">
          {formData.serviceName} in {formData.cityName}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Page Info */}
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service
                  </label>
                  <Input
                    value={formData.serviceName}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    value={formData.cityName}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={`https://smoothcoders.com/${formData.slug}`}
                    disabled
                    className="bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(`/${formData.slug}`, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title * (Max 60 characters)
                </label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Professional Website Development Services"
                  maxLength={60}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  💡 Tip: Include city name and service for better local SEO
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description * (Max 160 characters)
                </label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Get modern, responsive websites built with latest technologies..."
                  maxLength={160}
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  💡 Tip: Make it compelling and include a call-to-action
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📝 SEO Best Practices</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Include the service name and city name in meta title</li>
              <li>Keep meta title under 60 characters for better display</li>
              <li>Write unique, compelling meta descriptions</li>
              <li>Include a call-to-action in the description</li>
              <li>Avoid keyword stuffing - write for humans first</li>
            </ul>
          </div>

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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/cities/${formData.cityId}`)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
