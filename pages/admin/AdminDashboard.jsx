import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Package, Users, FolderCheck, BarChart3, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [leads, requests, quotes, passengers, documents, offers] = await Promise.all([
        api.entities.CRMLead.list(),
        api.entities.TravelRequest.list(),
        api.entities.Quote.list(),
        api.entities.PassengerProfile.list(),
        api.entities.Document.list(),
        api.entities.Offer.list(),
      ]);
      setStats({
        leads: leads.length,
        requests: requests.length,
        quotes: quotes.length,
        passengers: passengers.length,
        documents: documents.length,
        offers: offers.length,
        pendingDocs: documents.filter(d => d.status === 'pending').length,
        newLeads: leads.filter(l => l.pipeline_stage === 'new').length,
      });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { key: 'admin_leads', icon: Briefcase, count: stats.leads, sub: `${stats.newLeads || 0} new`, path: '/admin/leads', color: 'text-blue-400' },
    { key: 'admin_requests', icon: FileText, count: stats.requests, path: '/admin/requests', color: 'text-emerald-400' },
    { key: 'admin_quotes', icon: Package, count: stats.quotes, path: '/admin/quotes', color: 'text-purple-400' },
    { key: 'admin_passengers', icon: Users, count: stats.passengers, path: '/admin/passengers', color: 'text-amber-400' },
    { key: 'admin_documents', icon: FolderCheck, count: stats.documents, sub: `${stats.pendingDocs || 0} pending`, path: '/admin/documents', color: 'text-rose-400' },
    { key: 'admin_offers', icon: BarChart3, count: stats.offers, path: '/admin/offers', color: 'text-cyan-400' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">{t('admin_dashboard')}</h1>
        <p className="text-sm text-muted-foreground mb-8">Concierge Elite Admin</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={card.path} className="block glass rounded-xl p-6 hover:bg-white/[0.06] transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-2xl font-bold mb-0.5">{loading ? '—' : card.count}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(card.key)}</p>
                {card.sub && <p className="text-xs text-primary mt-1">{loading ? '' : card.sub}</p>}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}