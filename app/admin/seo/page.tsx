'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Settings, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminSeoPage() {
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
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
        </div>
        <p className="text-gray-600">Manage meta tags, sitemaps, and SEO configuration</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 mb-4">SEO management coming soon</p>
          <p className="text-sm text-gray-400">
            You can manage SEO settings directly in MongoDB or use the API endpoints
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
