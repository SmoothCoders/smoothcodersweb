'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Loader2, FileText, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  description?: string;
  landmarks?: string[];
  localKeywords?: string[];
  pagesGenerated: boolean;
}

interface ServicePage {
  _id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  serviceId: {
    _id: string;
    title: string;
    slug: string;
  };
  updatedAt: string;
  isGenerated: boolean;
}

export default function CityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [city, setCity] = useState<City | null>(null);
  const [pages, setPages] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityId, setCityId] = useState<string>('');

  useEffect(() => {
    // Unwrap params promise
    params.then(p => {
      setCityId(p.id);
      fetchCityDetails(p.id);
    });
  }, []);

  const fetchCityDetails = async (id: string) => {
    try {
      // Fetch city
      const cityResponse = await fetch(`/api/admin/cities/${id}`);
      const cityData = await cityResponse.json();

      if (cityData.success) {
        setCity(cityData.data);
      }

      // Fetch service pages for this city
      const pagesResponse = await fetch(`/api/admin/service-pages?cityId=${id}`);
      const pagesData = await pagesResponse.json();

      if (pagesData.success) {
        setPages(pagesData.data);
      }
    } catch (error) {
      toast.error('Failed to load city details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="p-8">
        <p>City not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/cities')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cities
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                {city.name}, {city.state}
              </h1>
            </div>
            {city.description && (
              <p className="text-gray-600 mt-2">{city.description}</p>
            )}
          </div>

          <Button
            onClick={() => router.push(`/admin/cities/${cityId}/edit`)}
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit City
          </Button>
        </div>
      </div>

      {/* City Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{pages.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Landmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              {city.landmarks && city.landmarks.length > 0
                ? city.landmarks.join(', ')
                : 'None added'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              {city.localKeywords && city.localKeywords.length > 0
                ? city.localKeywords.join(', ')
                : 'None added'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Pages */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Service Pages ({pages.length})
          </h2>
        </div>

        {pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No service pages generated yet</p>
              <Button onClick={() => router.push('/admin/cities')}>
                Go back and click "Generate Pages"
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {page.serviceId.title}
                        </h3>
                        {page.isGenerated ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Auto-Generated
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Manually Edited
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Meta Title:</p>
                          <p className="text-sm text-gray-900">{page.metaTitle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Meta Description:</p>
                          <p className="text-sm text-gray-700">{page.metaDescription}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Slug: <strong>/{page.slug}</strong></span>
                        <span>
                          Updated: {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit SEO
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                      >
                        View Page
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
