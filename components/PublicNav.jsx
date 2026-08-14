import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { Menu, X, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function PublicNav({ user }) {
  const { t, toggleLang, lang } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const links = [
    { to: '/', label: t('nav_home') },
    { to: '/destinations', label: t('nav_destinations') },
    { to: '/experiences', label: t('nav_experiences') },
    { to: '/membership', label: t('nav_membership') },
    { to: '/services', label: t('nav_services') },
    { to: '/plan-trip', label: t('nav_plan_trip') },
    { to: '/about', label: t('nav_about') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-foreground/60 hover:text-primary transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'ES' : 'EN'}
            </button>

            {user ? (
              <Link
                to={user.role === 'admin' || user.role === 'agent' ? '/admin' : '/portal'}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-primary/90 transition-all"
              >
                {user.role === 'admin' || user.role === 'agent' ? t('nav_admin') : t('nav_portal')}
                <ChevronRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 border border-primary/30 text-primary text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-primary/10 transition-all"
              >
                {t('nav_login')}
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-foreground/80 hover:text-primary transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-20"
          >
            <div className="flex flex-col items-center gap-6 py-12">
              <Logo size="lg" showText={true} />
              <div className="h-px w-16 bg-border/50" />
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className={`text-lg font-display tracking-wide transition-colors ${
                      location.pathname === link.to ? 'text-primary' : 'text-foreground/70 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px w-16 bg-border my-2" />
              {user ? (
                <Link to={user.role === 'admin' ? '/admin' : '/portal'} className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm">
                  {user.role === 'admin' ? t('nav_admin') : t('nav_portal')}
                </Link>
              ) : (
                <Link to="/login" className="px-6 py-3 border border-primary/30 text-primary font-medium rounded-sm">
                  {t('nav_login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}