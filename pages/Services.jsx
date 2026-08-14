import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, Hotel, Sparkles, Car, Shield, Headphones, ArrowRight } from 'lucide-react';

const services = [
  { key: 'flights', icon: Plane },
  { key: 'hotels', icon: Hotel },
  { key: 'experiences', icon: Sparkles },
  { key: 'transfers', icon: Car },
  { key: 'visa', icon: Shield },
  { key: 'concierge', icon: Headphones },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_services')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{t('hero_services_title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('hero_services_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-8 hover:bg-white/[0.06] transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{t(`service_${svc.key}`)}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{t(`service_${svc.key}_desc`)}</p>
                <Link to="/plan-trip" className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  {t('hero_cta_plan')} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}