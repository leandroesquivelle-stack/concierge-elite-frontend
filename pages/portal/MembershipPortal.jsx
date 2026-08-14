import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MembershipPortal() {
  const { t, lang } = useTranslation();

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_membership')}</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-8 text-center max-w-lg mx-auto">
        <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold mb-2">{t('membership_title')}</h2>
        <p className="text-sm text-muted-foreground mb-6">{t('membership_subtitle')}</p>
        <Link to="/membership" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all">
          {t('general_view')} {t('nav_membership')}
        </Link>
      </motion.div>
    </div>
  );
}