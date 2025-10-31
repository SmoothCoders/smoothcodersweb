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
          // Update favicon
          if (data.data.faviconUrl) {
            // Remove existing favicon links
            const existingLinks = document.querySelectorAll("link[rel*='icon']");
            existingLinks.forEach(link => link.remove());
            
            // Add new favicon
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.type = 'image/png';
            newLink.href = data.data.faviconUrl;
            document.head.appendChild(newLink);
            
            // Add shortcut icon for older browsers
            const shortcutLink = document.createElement('link');
            shortcutLink.rel = 'shortcut icon';
            shortcutLink.type = 'image/png';
            shortcutLink.href = data.data.faviconUrl;
            document.head.appendChild(shortcutLink);
          }
          // Update title
          if (data.data.siteName && data.data.siteTagline) {
            document.title = `${data.data.siteName} - ${data.data.siteTagline}`;
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
