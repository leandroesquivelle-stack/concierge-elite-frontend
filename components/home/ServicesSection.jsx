import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Plane, Hotel, Sparkles, Car, Shield, Headphones } from 'lucide-react';

const services = [
  { key: 'flights', icon: Plane },
  { key: 'hotels', icon: Hotel },
  { key: 'experiences', icon: Sparkles },
  { key: 'transfers', icon: Car },
  { key: 'visa', icon: Shield },
  { key: 'concierge', icon: Headphones },
];

export default function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_services')}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">{t('hero_services_title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('hero_services_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group glass rounded-xl p-8 hover:bg-white/[0.06] transition-all duration-500 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{t(`service_${svc.key}`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`service_${svc.key}_desc`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}