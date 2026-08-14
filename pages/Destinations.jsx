import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import DestinationMap from '@/components/DestinationMap';
import BookingInquiryModal from '@/components/BookingInquiryModal';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const regions = [
  {
    name: { en: 'Europe', es: 'Europa' },
    destinations: [
      { name: 'Santorini', country: { en: 'Greece', es: 'Grecia' }, image: '/images/destino-04.png' },
      { name: 'Swiss Alps', country: { en: 'Switzerland', es: 'Suiza' }, image: '/images/destino-03.png' },
    ]
  },
  {
    name: { en: 'Middle East & Asia', es: 'Medio Oriente y Asia' },
    destinations: [
      { name: 'Dubai', country: { en: 'UAE', es: 'EAU' }, image: '/images/destino-07.png' },
      { name: 'Maldives', country: { en: 'Indian Ocean', es: 'Océano Índico' }, image: '/images/destino-09.png' },
    ]
  },
];

export default function Destinations() {
  const { t, lang } = useTranslation();
  const [bookingDest, setBookingDest] = useState(null);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_destinations')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{t('hero_destinations_title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('hero_destinations_subtitle')}</p>
        </motion.div>

        {/* Interactive Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <h2 className="font-display text-2xl font-semibold mb-2 text-center">Explore Our Destinations</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">Click a pin to discover more. Filter by your travel style.</p>
          <DestinationMap />
        </motion.div>

        {regions.map((region, ri) => (
          <div key={region.name.en} className="mb-16">
            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {region.name[lang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {region.destinations.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setBookingDest({ name: dest.name, country: dest.country[lang], image: dest.image })}
                >
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-1">{dest.country[lang]}</p>
                    <h3 className="font-display text-2xl font-semibold text-white">{dest.name}</h3>
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-[0.2em] border border-primary/60 text-primary px-3 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Inquire Now
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {bookingDest && (
        <BookingInquiryModal destination={bookingDest} onClose={() => setBookingDest(null)} />
      )}
    </div>
  );
}