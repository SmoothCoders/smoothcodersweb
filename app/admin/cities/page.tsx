'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Loader2, MapPin, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  description?: string;
  landmarks?: string[];
  localKeywords?: string[];
  isActive: boolean;
  pagesGenerated: boolean;
  generatedAt?: string;
}

export default function AdminCitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCities();
    }
  }, [status]);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/admin/cities');
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      toast.error('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const generatePages = async (cityId: string, cityName: string) => {
    if (!confirm(`Generate SEO pages for all services in ${cityName}?`)) return;

    setGenerating(cityId);
    try {
      const response = await fetch('/api/admin/generate-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchCities(); // Refresh to show updated status
      } else {
        toast.error(data.error || 'Failed to generate pages');
      }
    } catch (error) {
      toast.error('Failed to generate pages');
    } finally {
      setGenerating(null);
    }
  };

  const regeneratePages = async (cityId: string, cityName: string) => {
    if (!confirm(`Regenerate all SEO pages for ${cityName}? This will update existing pages.`)) return;

    setGenerating(cityId);
    try {
      const response = await fetch('/api/admin/generate-pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchCities();
      } else {
        toast.error(data.error || 'Failed to regenerate pages');
      }
    } catch (error) {
      toast.error('Failed to regenerate pages');
    } finally {
      setGenerating(null);
    }
  };

  const deleteCity = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will also delete all generated pages for this city.`)) return;

    try {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('City deleted successfully');
        fetchCities();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete city');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Cities</h1>
          <p className="text-gray-600 mt-2">Add cities and generate SEO pages for each service</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/admin/cities/new')}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New City
        </Button>
      </div>

      {cities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No cities found</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/admin/cities/new')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First City
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {cities.map((city) => (
            <Card 
              key={city._id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/cities/${city._id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {city.name}, {city.state}
                      </h3>
                      {city.pagesGenerated ? (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          Pages Generated
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <XCircle className="h-3 w-3" />
                          Not Generated
                        </span>
                      )}
                    </div>
                    {city.description && (
                      <p className="text-gray-600 mb-3 text-sm">
                        {city.description}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Slug: <strong>{city.slug}</strong></span>
                      {city.generatedAt && (
                        <span>Last Generated: {new Date(city.generatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    {city.pagesGenerated ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regeneratePages(city._id, city.name)}
                        disabled={generating === city._id}
                        title="Regenerate Pages"
                      >
                        {generating === city._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regenerate
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => generatePages(city._id, city.name)}
                        disabled={generating === city._id}
                      >
                        {generating === city._id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Generate Pages
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/cities/${city._id}/edit`)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCity(city._id, city.name)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cities.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> After adding a city, click "Generate Pages" to automatically create SEO-optimized pages for all your services in that city.
          </p>
        </div>
      )}
    </div>
  );
}
