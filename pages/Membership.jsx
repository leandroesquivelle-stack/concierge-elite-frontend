import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Crown, Star, Award } from 'lucide-react';

const tiers = [
  {
    key: 'premium',
    icon: Star,
    price: '$2,500',
    features: {
      en: ['Dedicated concierge', 'Priority booking', 'Loyalty points (1x)', 'Trip planning assistance', 'Document support'],
      es: ['Concierge dedicado', 'Reserva prioritaria', 'Puntos de fidelidad (1x)', 'Asistencia en planificación', 'Soporte de documentos']
    }
  },
  {
    key: 'black',
    icon: Crown,
    price: '$7,500',
    featured: true,
    features: {
      en: ['24/7 personal concierge', 'VIP booking access', 'Loyalty points (2x)', 'Private aviation access', 'Document management', 'Complimentary upgrades', 'Event access'],
      es: ['Concierge personal 24/7', 'Acceso a reservas VIP', 'Puntos de fidelidad (2x)', 'Acceso a aviación privada', 'Gestión de documentos', 'Upgrades cortesía', 'Acceso a eventos']
    }
  },
  {
    key: 'elite',
    icon: Award,
    price: '$25,000',
    features: {
      en: ['Dedicated team of concierges', 'Unlimited VIP access', 'Loyalty points (3x)', 'Private jet charter', 'Full document management', 'Exclusive experiences', 'Personal shopper', 'Family coverage'],
      es: ['Equipo dedicado de concierges', 'Acceso VIP ilimitado', 'Puntos de fidelidad (3x)', 'Charter de jet privado', 'Gestión documental completa', 'Experiencias exclusivas', 'Personal shopper', 'Cobertura familiar']
    }
  },
];

export default function Membership() {
  const { t, lang } = useTranslation();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_membership')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{t('membership_title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('membership_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-8 ${tier.featured ? 'glass-strong ring-1 ring-primary/30' : 'glass'}`}
              >
                <Icon className={`w-8 h-8 mb-4 ${tier.featured ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-display text-2xl font-semibold mb-1">{t(`membership_${tier.key}`)}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-primary">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{t('membership_per_year')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features[lang].map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block text-center py-3 text-sm uppercase tracking-wider font-medium rounded-lg transition-all ${
                    tier.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border hover:border-primary/50 text-foreground hover:text-primary'
                  }`}
                >
                  {t('membership_join')}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}