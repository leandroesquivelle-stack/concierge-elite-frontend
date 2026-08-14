import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const experiences = [
  { name: { en: 'Yacht Charter', es: 'Charter de Yate' }, desc: { en: 'Sail the Mediterranean on a private superyacht with a dedicated crew.', es: 'Navega el Mediterráneo en un superyate privado con tripulación dedicada.' }, image: '/images/destino-02.png' },
  { name: { en: 'Fine Dining', es: 'Alta Gastronomía' }, desc: { en: 'Exclusive reservations at the world\'s most coveted Michelin-starred restaurants.', es: 'Reservas exclusivas en los restaurantes con estrellas Michelin más codiciados del mundo.' }, image: '/images/destino-06.png' },
  { name: { en: 'Safari Adventure', es: 'Aventura Safari' }, desc: { en: 'Luxury glamping in the Serengeti with private game drives and sundowners.', es: 'Glamping de lujo en el Serengeti con safaris privados y atardeceres.' }, image: '/images/destino-01.png' },
  { name: { en: 'Wellness Retreat', es: 'Retiro de Bienestar' }, desc: { en: 'Rejuvenate at world-class spas and wellness sanctuaries in Bali and beyond.', es: 'Rejuvenece en spas y santuarios de bienestar de clase mundial en Bali y más.' }, image: '/images/destino-05.png' },
];

export default function Experiences() {
  const { t, lang } = useTranslation();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_experiences')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{t('hero_experiences_title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('hero_experiences_subtitle')}</p>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.name.en}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              <div className="w-full md:w-1/2 aspect-[4/3] rounded-xl overflow-hidden">
                <img src={exp.image} alt={exp.name[lang]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-display text-2xl font-semibold">{exp.name[lang]}</h3>
                <p className="text-muted-foreground leading-relaxed">{exp.desc[lang]}</p>
                <Link to="/plan-trip" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all">
                  {t('hero_cta_plan')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}