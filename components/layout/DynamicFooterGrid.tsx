'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface City {
  _id: string;
  name: string;
  slug: string;
  state: string;
  isActive?: boolean;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  isActive?: boolean;
}

export default function DynamicFooterGrid() {
  const [cities, setCities] = useState<City[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [citiesRes, servicesRes] = await Promise.all([
        fetch('/api/admin/cities'),
        fetch('/api/admin/services'),
      ]);

      const citiesData = await citiesRes.json();
      const servicesData = await servicesRes.json();

      if (citiesData.success) {
        setCities(citiesData.data.filter((c: City) => c.isActive !== false).slice(0, 10)); // Max 10 cities
      }

      if (servicesData.success) {
        setServices(servicesData.data.filter((s: Service) => s.isActive !== false).slice(0, 5)); // Max 5 services
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
        </div>
      </div>
    );
  }

  if (cities.length === 0 || services.length === 0) {
    return null;
  }

  // Split cities into rows of 5
  const cityRows: City[][] = [];
  for (let i = 0; i < cities.length; i += 5) {
    cityRows.push(cities.slice(i, i + 5));
  }

  return (
    <div className="bg-gray-800 py-16 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Our Services Across India
        </h3>

        <div className="space-y-12">
          {cityRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {row.map((city) => (
                <div key={city._id} className="space-y-3">
                  <h4 className="text-blue-400 font-semibold text-sm">
                    {city.name}, {city.state}
                  </h4>
                  <ul className="space-y-2">
                    {services.map((service) => (
                      <li key={service._id}>
                        <Link
                          href={`/${city.slug}/${service.slug}`}
                          className="text-xs text-gray-400 hover:text-white transition-colors block truncate"
                          title={`${service.title} in ${city.name}`}
                        >
                          {service.title.length > 25
                            ? service.title.substring(0, 22) + '...'
                            : service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {cities.length > 10 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            And many more cities across India...
          </p>
        )}
      </div>
    </div>
  );
}
