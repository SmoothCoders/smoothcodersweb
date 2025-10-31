/**
 * Geolocation utility to detect user location and currency
 * Uses IP-based geolocation without requiring user permission
 */

export type Currency = 'INR' | 'USD';

export interface UserLocation {
  country: string;
  countryCode: string;
  currency: Currency;
  isIndia: boolean;
}

/**
 * Detect user location based on IP address
 * Uses multiple free geolocation APIs for reliability
 */
export async function detectUserLocation(): Promise<UserLocation> {
  try {
    // Try primary API: ipapi.co (free, no key required, 30k requests/month)
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      const isIndia = data.country_code === 'IN';
      
      return {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'US',
        currency: isIndia ? 'INR' : 'USD',
        isIndia
      };
    }
  } catch (error) {
    console.error('Primary geolocation API failed:', error);
  }

  // Fallback 1: Try ip-api.com (free, 45 requests/minute)
  try {
    const response = await fetch('http://ip-api.com/json/', {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      const isIndia = data.countryCode === 'IN';
      
      return {
        country: data.country || 'Unknown',
        countryCode: data.countryCode || 'US',
        currency: isIndia ? 'INR' : 'USD',
        isIndia
      };
    }
  } catch (error) {
    console.error('Fallback geolocation API failed:', error);
  }

  // Default to USD for international users if all APIs fail
  return {
    country: 'International',
    countryCode: 'US',
    currency: 'USD',
    isIndia: false
  };
}

/**
 * Get user location from client-side
 * This runs in the browser
 */
export async function getClientLocation(): Promise<UserLocation> {
  // Check localStorage first for cached location
  const cached = localStorage.getItem('userLocation');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Cache for 24 hours
      const cacheTime = new Date(parsed.timestamp).getTime();
      const now = new Date().getTime();
      const hoursPassed = (now - cacheTime) / (1000 * 60 * 60);
      
      if (hoursPassed < 24) {
        return parsed.location;
      }
    } catch (e) {
      // Invalid cache, continue
    }
  }

  // Detect location
  const location = await detectUserLocation();
  
  // Cache the result
  localStorage.setItem('userLocation', JSON.stringify({
    location,
    timestamp: new Date().toISOString()
  }));
  
  return location;
}

/**
 * Format price based on currency
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  } else {
    return `$${amount.toLocaleString('en-US')}`;
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return currency === 'INR' ? '₹' : '$';
}

/**
 * Server-side function to detect location from request headers
 * Can be used in API routes
 */
export function detectLocationFromHeaders(headers: Headers): UserLocation {
  // Try to get country from Cloudflare headers (if using Cloudflare)
  const cfCountry = headers.get('cf-ipcountry');
  if (cfCountry) {
    const isIndia = cfCountry === 'IN';
    return {
      country: cfCountry,
      countryCode: cfCountry,
      currency: isIndia ? 'INR' : 'USD',
      isIndia
    };
  }

  // Try to get country from Vercel headers (if using Vercel)
  const vercelCountry = headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    const isIndia = vercelCountry === 'IN';
    return {
      country: vercelCountry,
      countryCode: vercelCountry,
      currency: isIndia ? 'INR' : 'USD',
      isIndia
    };
  }

  // Default to USD
  return {
    country: 'International',
    countryCode: 'US',
    currency: 'USD',
    isIndia: false
  };
}
