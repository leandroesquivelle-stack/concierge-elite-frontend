import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const destinations = [
  { name: 'Santorini', country: 'Greece', image: '/images/destino-04.png' },
  { name: 'Maldives', country: 'Indian Ocean', image: '/images/destino-09.png' },
  { name: 'Swiss Alps', country: 'Switzerland', image: '/images/destino-03.png' },
  { name: 'Dubai', country: 'UAE', image: '/images/destino-07.png' },
];

export default function DestinationsGrid() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_destinations')}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">{t('hero_destinations_title')}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{t('hero_destinations_subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link to="/destinations" className="group relative block aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={dest.image}
                alt={`${dest.name}, ${dest.country}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-1">{dest.country}</p>
                <h3 className="font-display text-xl font-semibold text-white">{dest.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}