'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

export default function NewCityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    description: '',
    landmarks: [''] as string[],
    localKeywords: [''] as string[],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          landmarks: formData.landmarks.filter(l => l.trim() !== ''),
          localKeywords: formData.localKeywords.filter(k => k.trim() !== '')
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('City created successfully!');
        router.push('/admin/cities');
      } else {
        toast.error(data.error || 'Failed to create city');
      }
    } catch (error) {
      toast.error('Failed to create city');
    } finally {
      setLoading(false);
    }
  };


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
        <h1 className="text-3xl font-bold text-gray-900">Add New City</h1>
        <p className="text-gray-600 mt-2">Add a city to generate service pages for</p>
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

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Slug will be auto-generated:</strong> {formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'city-name'}
                </p>
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

          {/* Info Box */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">📝 What happens next?</h4>
            <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
              <li>City will be created with auto-generated slug</li>
              <li>You'll be redirected to Cities page</li>
              <li>Click "Generate Pages" to create SEO pages for all services in this city</li>
              <li>Pages will be accessible at: <code>/{'{slug}'}/{'{service-slug}'}</code></li>
            </ol>
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
                  Creating...
                </>
              ) : (
                'Create City'
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
