import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: { city: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smoothcoders.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityName = params.city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    metadataBase: new URL(siteUrl),
    title: `${cityName} - Digital Services | SmoothCoders`,
    description: `Professional web development and digital marketing services in ${cityName}. Expert solutions for businesses.`,
  };
}

export default function CityPage({ params }: Props) {
  const cityName = params.city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Digital Services in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{cityName}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We provide professional web development, mobile apps, and digital marketing services in {cityName}.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Our Services</h3>
              <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Web Development</li>
                <li>• Mobile App Development</li>
                <li>• Digital Marketing</li>
                <li>• SEO Services</li>
                <li>• E-commerce Solutions</li>
              </ul>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Why Choose Us</h3>
              <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Expert Team</li>
                <li>• Proven Track Record</li>
                <li>• 24/7 Support</li>
                <li>• Competitive Pricing</li>
                <li>• Quick Turnaround</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
