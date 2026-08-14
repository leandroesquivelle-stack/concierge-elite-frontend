import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const experiences = [
  { name: { en: 'Yacht Charter', es: 'Charter de Yate' }, image: '/images/destino-02.png' },
  { name: { en: 'Fine Dining', es: 'Alta Gastronomía' }, image: '/images/destino-06.png' },
  { name: { en: 'Safari Adventure', es: 'Aventura Safari' }, image: '/images/destino-01.png' },
  { name: { en: 'Wellness Retreat', es: 'Retiro de Bienestar' }, image: '/images/destino-05.png' },
];

export default function ExperiencesSection() {
  const { t, lang } = useTranslation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_experiences')}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">{t('hero_experiences_title')}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{t('hero_experiences_subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.name.en}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to="/experiences" className="group relative block aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={exp.image}
                alt={exp.name[lang]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-lg font-semibold text-white">{exp.name[lang]}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}