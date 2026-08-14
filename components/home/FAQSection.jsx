import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: { en: 'What destinations do you cover?', es: '¿Qué destinos cubren?' },
    a: { en: 'We operate globally, with specialized expertise in Europe, Middle East, Asia-Pacific, Africa, and the Americas. Our network of local partners ensures premium service everywhere.', es: 'Operamos globalmente, con experiencia especializada en Europa, Medio Oriente, Asia-Pacífico, África y las Américas. Nuestra red de socios locales garantiza un servicio premium en todas partes.' }
  },
  {
    q: { en: 'How does the membership work?', es: '¿Cómo funciona la membresía?' },
    a: { en: 'Our membership tiers — Premium, Black, and Elite — offer escalating levels of access, priority service, and exclusive benefits. Each tier includes dedicated concierge support and loyalty rewards.', es: 'Nuestros niveles de membresía — Premium, Black y Elite — ofrecen niveles crecientes de acceso, servicio prioritario y beneficios exclusivos. Cada nivel incluye soporte de concierge dedicado y recompensas de fidelidad.' }
  },
  {
    q: { en: 'Can you handle visa and documentation?', es: '¿Pueden manejar visas y documentación?' },
    a: { en: 'Yes. Our team provides comprehensive guidance on visa requirements, passport validity, entry requirements, and travel documentation for every destination in your itinerary.', es: 'Sí. Nuestro equipo proporciona orientación integral sobre requisitos de visa, validez de pasaporte, requisitos de entrada y documentación de viaje para cada destino en su itinerario.' }
  },
  {
    q: { en: 'How far in advance should I book?', es: '¿Con cuánta anticipación debo reservar?' },
    a: { en: 'For optimal availability, we recommend 4-8 weeks for standard luxury travel and 3-6 months for peak season or exclusive experiences. However, our team excels at last-minute arrangements.', es: 'Para disponibilidad óptima, recomendamos 4-8 semanas para viajes de lujo estándar y 3-6 meses para temporada alta o experiencias exclusivas. Sin embargo, nuestro equipo se destaca en arreglos de último momento.' }
  },
];

export default function FAQSection() {
  const { t, lang } = useTranslation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{t('hero_faq_title')}</h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-lg px-6 border-0">
              <AccordionTrigger className="text-sm font-medium text-left hover:text-primary py-5">
                {faq.q[lang]}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a[lang]}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}