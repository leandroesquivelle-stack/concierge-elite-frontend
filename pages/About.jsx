import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Globe, Award, Users, Clock } from 'lucide-react';

const stats = [
  { icon: Globe, value: '60+', label: { en: 'Countries', es: 'Países' } },
  { icon: Award, value: '10+', label: { en: 'Years of Excellence', es: 'Años de Excelencia' } },
  { icon: Users, value: '2,000+', label: { en: 'Clients Served', es: 'Clientes Atendidos' } },
  { icon: Clock, value: '24/7', label: { en: 'Concierge Support', es: 'Soporte Concierge' } },
];

export default function About() {
  const { t, lang } = useTranslation();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_about')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{t('about_title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t('about_subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-xl p-8 sm:p-12 mb-16"
        >
          <p className="text-foreground/80 leading-relaxed mb-6">
            {lang === 'en'
              ? 'Elite Concierge was founded with a singular vision: to redefine luxury travel by offering an unparalleled level of personalized service. We believe that true luxury is not about opulence — it\'s about time, access, and the art of anticipation.'
              : 'Elite Concierge fue fundado con una visión singular: redefinir el viaje de lujo ofreciendo un nivel de servicio personalizado sin precedentes. Creemos que el verdadero lujo no se trata de opulencia — se trata de tiempo, acceso y el arte de la anticipación.'
            }
          </p>
          <p className="text-foreground/80 leading-relaxed">
            {lang === 'en'
              ? 'Our team of travel specialists spans three continents, bringing local expertise and global connections to every journey. From private aviation to exclusive cultural experiences, we curate every detail with precision and care.'
              : 'Nuestro equipo de especialistas en viajes abarca tres continentes, aportando experiencia local y conexiones globales a cada viaje. Desde aviación privada hasta experiencias culturales exclusivas, curamos cada detalle con precisión y cuidado.'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label[lang]}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}