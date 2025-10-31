'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Loader2, FileText, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

interface ServicePage {
  _id: string;
  title: string;
  metaTitle: string;
  slug: string;
  isGenerated: boolean;
  serviceId: {
    title: string;
    slug: string;
  };
  cityId: {
    name: string;
    slug: string;
    state: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminPagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'generated' | 'manual'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPages();
    }
  }, [status]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/service-pages');
      const data = await response.json();
      if (data.success) {
        setPages(data.data);
      }
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/service-pages/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Page deleted successfully');
        fetchPages();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const filteredPages = pages.filter((page) => {
    if (filter === 'generated') return page.isGenerated;
    if (filter === 'manual') return !page.isGenerated;
    return true;
  });

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
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generated Service Pages</h1>
          <p className="text-gray-600 mt-2">View and manage all SEO-optimized service pages</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('all')}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('generated')}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {pages.filter(p => p.isGenerated).length}
            </div>
            <div className="text-sm text-gray-600">Auto-Generated</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilter('manual')}>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {pages.filter(p => !p.isGenerated).length}
            </div>
            <div className="text-sm text-gray-600">Manually Edited</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Pages ({pages.length})
        </Button>
        <Button
          variant={filter === 'generated' ? 'default' : 'outline'}
          onClick={() => setFilter('generated')}
        >
          Auto-Generated ({pages.filter(p => p.isGenerated).length})
        </Button>
        <Button
          variant={filter === 'manual' ? 'default' : 'outline'}
          onClick={() => setFilter('manual')}
        >
          Manually Edited ({pages.filter(p => !p.isGenerated).length})
        </Button>
      </div>

      {filteredPages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No pages found</p>
            <p className="text-sm text-gray-400">
              Go to Cities and click "Generate Pages" to create SEO-optimized service pages
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPages.map((page) => (
            <Card key={page._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {page.title}
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
                    <p className="text-sm text-gray-600 mb-3">
                      {page.metaTitle}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>
                        <strong>Service:</strong> {page.serviceId.title}
                      </span>
                      <span>
                        <strong>City:</strong> {page.cityId.name}, {page.cityId.state}
                      </span>
                      <span>
                        <strong>URL:</strong> /{page.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                      title="View Page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePage(page._id, page.title)}
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
    </div>
  );
}
