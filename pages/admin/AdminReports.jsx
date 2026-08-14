import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Users, Plane } from 'lucide-react';

export default function AdminReports() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [leads, requests, quotes, trips] = await Promise.all([
        api.entities.CRMLead.list(),
        api.entities.TravelRequest.list(),
        api.entities.Quote.list(),
        api.entities.Trip.list(),
      ]);

      const totalQuoteValue = quotes.reduce((sum, q) => sum + (q.total_price || 0), 0);
      const wonLeads = leads.filter(l => l.pipeline_stage === 'won').length;
      const conversionRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

      setStats({
        totalLeads: leads.length,
        wonLeads,
        conversionRate,
        totalRequests: requests.length,
        totalQuotes: quotes.length,
        totalQuoteValue,
        totalTrips: trips.length,
        activeTrips: trips.filter(t => t.status === 'in_progress' || t.status === 'confirmed').length,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-6 lg:p-10 flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  const cards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-400' },
    { label: 'Won Leads', value: stats.wonLeads, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: BarChart3, color: 'text-amber-400' },
    { label: 'Total Requests', value: stats.totalRequests, icon: Users, color: 'text-purple-400' },
    { label: 'Total Quotes', value: stats.totalQuotes, icon: DollarSign, color: 'text-cyan-400' },
    { label: 'Quote Pipeline', value: `$${stats.totalQuoteValue?.toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Trips', value: stats.totalTrips, icon: Plane, color: 'text-rose-400' },
    { label: 'Active Trips', value: stats.activeTrips, icon: Plane, color: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('admin_reports')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <Icon className={`w-5 h-5 ${card.color} mb-3`} />
              <p className="text-2xl font-bold mb-0.5">{card.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}