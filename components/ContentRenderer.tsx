'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Zap,
  Star,
  Shield,
  Award,
  Target,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContentRendererProps {
  content: string;
  serviceName: string;
  cityName: string;
  servicePrice: number;
}

export default function ContentRenderer({ 
  content, 
  serviceName, 
  cityName,
  servicePrice 
}: ContentRendererProps) {
  // Parse content into sections
  const sections = parseContent(content);

  return (
    <div className="space-y-16">
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          {renderSection(section, index, serviceName, cityName, servicePrice)}
        </motion.div>
      ))}
    </div>
  );
}

function parseContent(content: string) {
  const lines = content.split('\n').filter(line => line.trim());
  const sections: any[] = [];
  let currentSection: any = null;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: 'h1', title: line.replace('# ', ''), content: [] };
    } else if (line.startsWith('## ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: 'h2', title: line.replace('## ', ''), content: [] };
    } else if (line.startsWith('### ')) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: 'h3', title: line.replace('### ', ''), content: [] };
    } else if (line.startsWith('**Q:')) {
      if (currentSection && currentSection.type !== 'faq') {
        sections.push(currentSection);
        currentSection = { type: 'faq', title: 'Frequently Asked Questions', items: [] };
      }
      if (!currentSection) {
        currentSection = { type: 'faq', title: 'Frequently Asked Questions', items: [] };
      }
      const question = line.replace('**Q:', '').replace('**', '').trim();
      currentSection.items.push({ question, answer: '' });
    } else if (line.startsWith('A:') && currentSection?.type === 'faq') {
      const lastItem = currentSection.items[currentSection.items.length - 1];
      if (lastItem) {
        lastItem.answer = line.replace('A:', '').trim();
      }
    } else if (line.startsWith('- ') || line.startsWith('✓ ') || line.startsWith('✅ ')) {
      if (currentSection) {
        if (!currentSection.list) currentSection.list = [];
        currentSection.list.push(line.replace(/^[-✓✅]\s*/, ''));
      }
    } else if (line.trim()) {
      if (currentSection) {
        currentSection.content.push(line);
      }
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections;
}

function renderSection(section: any, index: number, serviceName: string, cityName: string, price: number) {
  const isFirst = index === 0;
  const isEven = index % 2 === 0;

  // Hero Section (First H1) - Clean Fiverr Style
  if (section.type === 'h1' && isFirst) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Overview
        </h2>
        <div className="prose prose-gray max-w-none">
          {section.content.map((text: string, i: number) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '$1') }} />
          ))}
        </div>
        {section.list && (
          <div className="grid md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
            {section.list.map((item: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Features/Benefits Section - Clean Fiverr Style
  if (section.type === 'h2' && (section.title.includes('Why Choose') || section.title.includes('Benefits') || section.title.includes("What's Included"))) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
        
        <div className="prose prose-gray max-w-none mb-4">
          {section.content.map((text: string, i: number) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '$1') }} />
          ))}
        </div>

        {section.list && (
          <div className="space-y-2 pt-4 border-t border-gray-100">
            {section.list.map((item: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Process/Steps Section - REMOVED (User requested to not generate this section)
  if (section.type === 'h3' && section.title.includes('Process')) {
    return null; // Skip rendering Process sections
  }

  // FAQ Section - Clean Fiverr Style
  if (section.type === 'faq') {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>

        <div className="space-y-2">
          {section.items && section.items.map((faq: any, i: number) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="group border border-gray-100 rounded-md hover:border-gray-200 transition-all"
            >
              <summary className="cursor-pointer p-3 font-medium text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-md">
                <span className="flex-1 pr-4">{faq.question}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 transform group-open:rotate-90 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-3 pb-3 text-sm text-gray-600">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    );
  }

  // Pricing Section - REMOVED (Now using PricingComparison component instead)
  if (section.title.includes('Pricing')) {
    return null; // Skip rendering Pricing sections
  }

  // Default Section - Clean Fiverr Style
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 md:p-6">
      {section.title && (
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          {section.title}
        </h2>
      )}
      
      <div className="prose prose-gray max-w-none">
        {section.content.map((text: string, i: number) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '$1') }} />
        ))}
      </div>

      {section.list && (
        <div className="mt-4 space-y-2 pt-4 border-t border-gray-100">
          {section.list.map((item: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{item}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
