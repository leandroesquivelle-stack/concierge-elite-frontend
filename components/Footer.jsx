import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import Logo from './Logo';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <Logo size="md" showText={true} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {t('hero_subtitle').substring(0, 80)}...
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4 font-medium">{t('nav_services')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/destinations" className="text-sm text-foreground/70 hover:text-primary transition-colors">{t('nav_destinations')}</Link>
              <Link to="/experiences" className="text-sm text-foreground/70 hover:text-primary transition-colors">{t('nav_experiences')}</Link>
              <Link to="/services" className="text-sm text-foreground/70 hover:text-primary transition-colors">{t('nav_services')}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4 font-medium">{t('nav_about')}</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-sm text-foreground/70 hover:text-primary transition-colors">{t('nav_about')}</Link>
              <Link to="/membership" className="text-sm text-foreground/70 hover:text-primary transition-colors">{t('nav_membership')}</Link>
              <Link to="/contact" className="text-sm text-foreground/70 hover:text-primary transition-colors">{t('nav_contact')}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4 font-medium">{t('nav_contact')}</h4>
            <div className="flex flex-col gap-2.5 text-sm text-foreground/70">
              <span>hello@elite-concierge.com</span>
              <span>+1 (305) 555-0100</span>
              <span>Miami · London · Dubai</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {year} Elite Concierge. {t('footer_rights')}</p>
          <div className="flex gap-6">
            <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">{t('footer_privacy')}</span>
            <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">{t('footer_terms')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}