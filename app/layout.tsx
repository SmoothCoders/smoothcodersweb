'use client';

import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.data);
          // Update title only
          if (data.data.siteName && data.data.siteTagline) {
            document.title = `${data.data.siteName} - ${data.data.siteTagline}`;
          }
          // Update favicon safely
          if (data.data.faviconUrl) {
            const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
            if (favicon) {
              favicon.href = data.data.faviconUrl;
            }
          }
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>{settings?.siteName && settings?.siteTagline ? `${settings.siteName} - ${settings.siteTagline}` : 'SmoothCoders - Transforming Ideas Into Digital Success'}</title>
        <meta name="description" content="Leading web development and digital marketing agency in Pune. We create stunning websites, mobile apps, and drive digital growth for businesses." />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={inter.className}>
        {!isAdminRoute && <Header />}
        <main className={isAdminRoute ? '' : 'min-h-screen'}>
          {children}
        </main>
        {!isAdminRoute && <Footer />}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
