'use client';

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

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>SmoothCoders - Transforming Ideas Into Digital Success</title>
        <meta name="description" content="Leading web development and digital marketing agency in Pune. We create stunning websites, mobile apps, and drive digital growth for businesses." />
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
