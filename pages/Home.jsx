import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plane, Hotel, Sparkles, Car, Shield, Headphones } from 'lucide-react';
import DestinationsGrid from '../components/home/DestinationsGrid';
import ExperiencesSection from '../components/home/ExperiencesSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/logo.png"
            alt="Luxury private jet over Mediterranean"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary/90 mb-6 font-medium">
              Elite Concierge
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-tight mb-6">
              {t('hero_title')}
            </h1>
            <p className="text-foreground/70 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/plan-trip"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.15em] font-medium hover:bg-primary/90 transition-all duration-300"
              >
                {t('hero_cta_plan')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground/20 text-foreground text-sm uppercase tracking-[0.15em] font-medium hover:border-primary/50 hover:text-primary transition-all duration-300"
              >
                {t('hero_cta_member')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-foreground/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Destinations */}
      <DestinationsGrid />

      {/* Services */}
      <ServicesSection />

      {/* Experiences */}
      <ExperiencesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-6">{t('hero_cta_plan')}</h2>
          <p className="text-muted-foreground mb-8 text-lg">{t('hero_subtitle')}</p>
          <Link
            to="/plan-trip"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.15em] font-medium hover:bg-primary/90 transition-all"
          >
            {t('hero_cta_plan')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}