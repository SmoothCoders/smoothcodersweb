'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, RotateCcw, ArrowRight, ChevronDown, ChevronUp, Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IPricingTier } from '@/lib/models/Service';
import { getClientLocation, formatPrice, Currency } from '@/lib/utils/geolocation';

interface PricingTiersProps {
  tiers: {
    basic: IPricingTier;
    standard: IPricingTier;
    premium: IPricingTier;
  };
  serviceName: string;
  onSelectTier: (tier: 'basic' | 'standard' | 'premium', price: number, currency: Currency) => void;
}

export default function PricingTiers({ tiers, serviceName, onSelectTier }: PricingTiersProps) {
  const [activeTier, setActiveTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);

  useEffect(() => {
    // Detect user location on component mount
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tier Tabs - Compact */}
      <div className="flex border-b border-gray-200">
        {tierKeys.map((key) => {
          const tier = tiers[key];
          return (
            <button
              key={key}
              onClick={() => setActiveTier(key)}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-all relative ${
                activeTier === key
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tier.name}
              {activeTier === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tier Content - Compact */}
      <motion.div
        key={activeTier}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-gray-200 p-6"
      >
        {/* Tier Title & Price */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {tiers[activeTier].title}
          </h3>
          <div className="text-right">
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : tiers[activeTier].contactForPricing ? (
              <div className="flex items-center gap-1 text-gray-700">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Custom Quote</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(getPrice(tiers[activeTier]), currency)}
                </span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {tiers[activeTier].description}
        </p>

        {/* Delivery & Revisions - Compact */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{tiers[activeTier].deliveryDays}-day delivery</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">{tiers[activeTier].revisions} Revisions</span>
          </div>
        </div>

        {/* Collapsible Features */}
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
        >
          <span className="text-sm">What's Included</span>
          {showFeatures ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 py-3">
                {tiers[activeTier].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button - Compact */}
        <Button
          onClick={() => handleSelectTier(activeTier)}
          className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded text-base font-medium transition-all group mt-4"
        >
          {tiers[activeTier].contactForPricing ? (
            <>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Get Custom Quote</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Currency Notice */}
        {!isLoading && !tiers[activeTier].contactForPricing && (
          <p className="text-center text-xs text-gray-500 mt-3">
            {currency === 'INR' ? 'Prices in ₹ INR' : 'Prices in $ USD'}
          </p>
        )}
      </motion.div>

    </div>
  );
}
