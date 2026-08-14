import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, FileText, Users, FolderOpen, Star, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({ trips: 0, requests: 0, passengers: 0, documents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [trips, requests, passengers, documents] = await Promise.all([
        api.entities.Trip.filter({ client_email: user?.email }),
        api.entities.TravelRequest.filter({ client_email: user?.email }),
        api.entities.PassengerProfile.filter({ client_email: user?.email }),
        api.entities.Document.filter({ client_email: user?.email }),
      ]);
      setStats({
        trips: trips.length,
        requests: requests.length,
        passengers: passengers.length,
        documents: documents.length,
      });
      setLoading(false);
    }
    if (user?.email) loadStats();
  }, [user]);

  const cards = [
    { key: 'portal_trips', icon: Plane, count: stats.trips, path: '/portal/trips', color: 'text-blue-400' },
    { key: 'portal_requests', icon: FileText, count: stats.requests, path: '/portal/requests', color: 'text-emerald-400' },
    { key: 'portal_passengers', icon: Users, count: stats.passengers, path: '/portal/passengers', color: 'text-amber-400' },
    { key: 'portal_documents', icon: FolderOpen, count: stats.documents, path: '/portal/documents', color: 'text-purple-400' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">
          {t('general_welcome')}, {user?.full_name?.split(' ')[0] || 'Guest'}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {t('portal_dashboard')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={card.path} className="block glass rounded-xl p-6 hover:bg-white/[0.06] transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-2xl font-bold mb-1">{loading ? '—' : card.count}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(card.key)}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-xl p-8 text-center">
        <Star className="w-8 h-8 text-primary mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold mb-2">{t('hero_cta_plan')}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t('plan_subtitle')}</p>
        <Link to="/plan-trip" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm uppercase tracking-wider font-medium rounded-lg hover:bg-primary/90 transition-all">
          {t('hero_cta_plan')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}