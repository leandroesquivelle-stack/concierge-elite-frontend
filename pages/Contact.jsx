import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_contact')}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4">{t('contact_title')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('contact_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('general_email')}</h3>
                  <p className="text-muted-foreground text-sm">hello@concierge-elite.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('general_phone')}</h3>
                  <p className="text-muted-foreground text-sm">+1 (305) 555-0100</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Offices</h3>
                  <p className="text-muted-foreground text-sm">Miami · London · Dubai</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {submitted ? (
              <div className="glass rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="font-display text-xl font-semibold">{t('plan_success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-xl p-8 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">{t('general_name')}</Label>
                  <Input required className="bg-secondary/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">{t('general_email')}</Label>
                  <Input type="email" required className="bg-secondary/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-foreground/80">{t('contact_message')}</Label>
                  <Textarea required className="bg-secondary/50 border-border/50 min-h-[120px]" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-wider font-medium rounded-lg hover:bg-primary/90 transition-all">
                  <Send className="w-4 h-4" />
                  {t('contact_send')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}