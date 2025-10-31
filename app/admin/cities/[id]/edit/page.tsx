'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [cityId, setCityId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    description: '',
    landmarks: [''] as string[],
    localKeywords: [''] as string[],
    isActive: true,
  });

  const addLandmark = () => {
    setFormData({ ...formData, landmarks: [...formData.landmarks, ''] });
  };

  const removeLandmark = (index: number) => {
    const newLandmarks = formData.landmarks.filter((_, i) => i !== index);
    setFormData({ ...formData, landmarks: newLandmarks });
  };

  const updateLandmark = (index: number, value: string) => {
    const newLandmarks = [...formData.landmarks];
    newLandmarks[index] = value;
    setFormData({ ...formData, landmarks: newLandmarks });
  };

  const addKeyword = () => {
    setFormData({ ...formData, localKeywords: [...formData.localKeywords, ''] });
  };

  const removeKeyword = (index: number) => {
    const newKeywords = formData.localKeywords.filter((_, i) => i !== index);
    setFormData({ ...formData, localKeywords: newKeywords });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.localKeywords];
    newKeywords[index] = value;
    setFormData({ ...formData, localKeywords: newKeywords });
  };

  useEffect(() => {
    params.then(p => {
      setCityId(p.id);
      fetchCity(p.id);
    });
  }, []);

  const fetchCity = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cities/${id}`);
      const data = await response.json();

      if (data.success) {
        const city = data.data;
        setFormData({
          name: city.name,
          state: city.state,
          description: city.description || '',
          landmarks: city.landmarks && city.landmarks.length > 0 ? city.landmarks : [''],
          localKeywords: city.localKeywords && city.localKeywords.length > 0 ? city.localKeywords : [''],
          isActive: city.isActive !== false,
        });
      } else {
        toast.error('City not found');
        router.push('/admin/cities');
      }
    } catch (error) {
      toast.error('Failed to load city');
      router.push('/admin/cities');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cityId) {
      toast.error('City ID not loaded yet');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/cities/${cityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          landmarks: formData.landmarks.filter(l => l.trim() !== ''),
          localKeywords: formData.localKeywords.filter(k => k.trim() !== '')
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('City updated successfully!');
        router.push('/admin/cities');
      } else {
        toast.error(data.error || 'Failed to update city');
      }
    } catch (error) {
      toast.error('Failed to update city');
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
          onClick={() => router.push('/admin/cities')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cities
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit City</h1>
        <p className="text-gray-600 mt-2">Update city information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>City Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Pune"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g., Maharashtra"
                    required
                  />
                </div>
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
                  City is active
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Local Information */}
          <Card>
            <CardHeader>
              <CardTitle>Local Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the city for SEO content generation..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Landmarks / Areas
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Add popular areas or landmarks (e.g., "Baner", "Viman Nagar", "Kothrud")
                </p>
                {formData.landmarks.map((landmark, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={landmark}
                      onChange={(e) => updateLandmark(index, e.target.value)}
                      placeholder="e.g., Baner"
                    />
                    {formData.landmarks.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeLandmark(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLandmark}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Landmark
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Keywords
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Add keywords specific to this city for better SEO
                </p>
                {formData.localKeywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      placeholder="e.g., Pune IT hub"
                    />
                    {formData.localKeywords.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeKeyword(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeyword}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Keyword
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Warning Box */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
            <p className="text-sm text-yellow-800">
              If you've already generated pages for this city, consider regenerating them after making changes to ensure SEO content is up to date.
            </p>
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
                  Updating...
                </>
              ) : (
                'Update City'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/cities')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
