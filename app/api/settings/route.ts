import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

// GET - Fetch public settings (no authentication required)
export async function GET() {
  try {
    await connectDB();

    // Get or create settings
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }

    // Return only non-sensitive data
    const publicSettings = {
      siteName: settings.siteName,
      siteTagline: settings.siteTagline,
      headerLogoUrl: settings.headerLogoUrl,
      footerLogoUrl: settings.footerLogoUrl,
      faviconUrl: settings.faviconUrl,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      businessHours: settings.businessHours,
      socialMedia: settings.socialMedia,
      razorpay: {
        enabled: settings.razorpay.enabled,
        keyId: settings.razorpay.keyId, // Key ID is public
      },
      googleAnalytics: {
        enabled: settings.googleAnalytics.enabled,
        measurementId: settings.googleAnalytics.measurementId,
      },
      googleSearchConsole: {
        enabled: settings.googleSearchConsole.enabled,
        verificationCode: settings.googleSearchConsole.verificationCode,
      },
      facebookPixel: {
        enabled: settings.facebookPixel.enabled,
        pixelId: settings.facebookPixel.pixelId,
      },
      features: settings.features,
    };

    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error: any) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
