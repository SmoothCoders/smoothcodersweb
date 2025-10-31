'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IPricingTier } from '@/lib/models/Service';
import { getClientLocation, formatPrice, Currency } from '@/lib/utils/geolocation';

interface PricingComparisonProps {
  tiers: {
    basic: IPricingTier;
    standard: IPricingTier;
    premium: IPricingTier;
  };
  serviceName: string;
  onSelectTier: (tier: 'basic' | 'standard' | 'premium', price: number, currency: Currency) => void;
}

export default function PricingComparison({ tiers, serviceName, onSelectTier }: PricingComparisonProps) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getClientLocation().then(location => {
      setCurrency(location.currency);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const tierKeys: Array<'basic' | 'standard' | 'premium'> = ['basic', 'standard', 'premium'];

  const getPrice = (tier: IPricingTier) => {
    return currency === 'INR' ? tier.priceINR : tier.priceUSD;
  };

  const handleSelectTier = (tierKey: 'basic' | 'standard' | 'premium') => {
    const tier = tiers[tierKey];
    const price = getPrice(tier);
    onSelectTier(tierKey, price, currency);
  };

  // Extract all unique features across tiers
  const allFeatures = Array.from(
    new Set([
      ...tiers.basic.features,
      ...tiers.standard.features,
      ...tiers.premium.features
    ])
  );

  const hasFeature = (tier: IPricingTier, feature: string) => {
    return tier.features.includes(feature);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compare packages</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-gray-500 font-normal min-w-[200px]">Package</th>
              {tierKeys.map((key) => {
                const tier = tiers[key];
                return (
                  <th key={key} className="p-4 text-center border-l border-gray-200 min-w-[220px]">
                    <div>
                      {isLoading ? (
                        <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto w-24" />
                      ) : tier.contactForPricing ? (
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          Custom Quote
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {formatPrice(getPrice(tier), currency)}
                        </div>
                      )}
                      <div className="text-base font-semibold text-gray-700 mb-2">
                        {tier.name}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                        {tier.title}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {tier.description}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
        <tbody>
          {/* Features comparison */}
          {allFeatures.map((feature, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="p-4 text-gray-600 text-sm">{feature}</td>
              {tierKeys.map((key) => {
                const tier = tiers[key];
                const has = hasFeature(tier, feature);
                return (
                  <td key={key} className="p-4 text-center border-l border-gray-100">
                    {has ? (
                      <Check className="h-5 w-5 text-gray-900 mx-auto" strokeWidth={3} />
                    ) : (
                      <Check className="h-5 w-5 text-gray-300 mx-auto" strokeWidth={3} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Revisions */}
          <tr className="border-b border-gray-100">
            <td className="p-4 text-gray-600 text-sm">Revisions</td>
            {tierKeys.map((key) => {
              const tier = tiers[key];
              return (
                <td key={key} className="p-4 text-center text-gray-700 text-sm border-l border-gray-100">
                  {tier.revisions}
                </td>
              );
            })}
          </tr>

          {/* Delivery time */}
          <tr className="border-b border-gray-100">
            <td className="p-4 text-gray-600 text-sm">Delivery Time</td>
            {tierKeys.map((key) => {
              const tier = tiers[key];
              return (
                <td key={key} className="p-4 text-center text-gray-700 text-sm border-l border-gray-100">
                  {tier.deliveryDays} days
                </td>
              );
            })}
          </tr>

          {/* Total price */}
          <tr className="border-b border-gray-200">
            <td className="p-4 text-gray-600 text-sm">Total</td>
            {tierKeys.map((key) => {
              const tier = tiers[key];
              return (
                <td key={key} className="p-4 text-center border-l border-gray-100">
                  {isLoading ? (
                    <div className="h-6 bg-gray-200 animate-pulse rounded mx-auto w-20" />
                  ) : tier.contactForPricing ? (
                    <div className="text-base font-semibold text-gray-900">
                      Custom Quote
                    </div>
                  ) : (
                    <div className="text-base font-semibold text-gray-900">
                      {formatPrice(getPrice(tier), currency)}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>

          {/* CTA Buttons */}
          <tr>
            <td className="p-4"></td>
            {tierKeys.map((key) => {
              const tier = tiers[key];
              return (
                <td key={key} className="p-4 text-center border-l border-gray-100">
                  <button
                    onClick={() => handleSelectTier(key)}
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-gray-800 transition-all"
                  >
                    {tier.contactForPricing ? 'Get Custom Quote' : 'Select'}
                  </button>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      </div>

      {/* Currency Notice */}
      {!isLoading && (
        <p className="text-center text-xs text-gray-500 mt-4">
          All prices shown in {currency === 'INR' ? 'Indian Rupees (₹)' : 'US Dollars ($)'}
        </p>
      )}
    </div>
  );
}
