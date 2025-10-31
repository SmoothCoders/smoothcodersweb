import Hero from '@/components/home/Hero';
import ServicesPreview from '@/components/home/ServicesPreview';
import About from '@/components/home/About';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import TestimonialsPreview from '@/components/home/TestimonialsPreview';
import CTASection from '@/components/home/CTASection';
import Stats from '@/components/home/Stats';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <ServicesPreview />
      <PortfolioPreview />
      <TestimonialsPreview />
      <CTASection />
    </>
  );
}
