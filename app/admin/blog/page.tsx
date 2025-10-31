'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Blog Posts</h1>
          <p className="text-gray-600 mt-2">Create and manage blog content</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Create New Post
        </Button>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 mb-4">Blog management coming soon</p>
          <p className="text-sm text-gray-400">
            You can add blog posts directly to MongoDB or use the API endpoints
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
