import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alexandra K.',
    role: { en: 'Elite Member', es: 'Miembro Elite' },
    quote: {
      en: 'Concierge Elite transformed our anniversary trip into something we could never have imagined. Every detail was flawless.',
      es: 'Concierge Elite transformó nuestro viaje de aniversario en algo que nunca hubiéramos imaginado. Cada detalle fue impecable.'
    }
  },
  {
    name: 'James R.',
    role: { en: 'Black Member', es: 'Miembro Black' },
    quote: {
      en: 'The level of access and discretion is unmatched. From private aviation to exclusive dining, they deliver beyond expectations.',
      es: 'El nivel de acceso y discreción es inigualable. Desde aviación privada hasta gastronomía exclusiva, superan las expectativas.'
    }
  },
  {
    name: 'Sofia M.',
    role: { en: 'Premium Member', es: 'Miembro Premium' },
    quote: {
      en: 'Having a personal concierge who knows my preferences and anticipates my needs has made travel effortless and luxurious.',
      es: 'Tener un concierge personal que conoce mis preferencias y anticipa mis necesidades ha hecho que viajar sea lujoso y sin esfuerzo.'
    }
  },
];

export default function TestimonialsSection() {
  const { t, lang } = useTranslation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Testimonials</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{t('hero_testimonials_title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, i) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">
                "{test.quote[lang]}"
              </p>
              <div>
                <p className="font-medium text-sm">{test.name}</p>
                <p className="text-xs text-primary">{test.role[lang]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}