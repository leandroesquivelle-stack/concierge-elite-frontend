import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  new: { color: 'bg-blue-500/20 text-blue-400', icon: Clock },
  in_review: { color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  proposal_sent: { color: 'bg-purple-500/20 text-purple-400', icon: FileText },
  approved: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  completed: { color: 'bg-emerald-500/20 text-emerald-300', icon: CheckCircle },
  cancelled: { color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

export default function Requests() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.entities.TravelRequest.filter({ client_email: user?.email }, '-created_date');
      setRequests(data);
      setLoading(false);
    }
    if (user?.email) load();
  }, [user]);

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">{t('portal_requests')}</h1>
        <Link to="/plan-trip" className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
          + {t('general_create')}
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req, i) => {
            const config = statusConfig[req.status] || statusConfig.new;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{req.destinations}</h3>
                  <Badge variant="outline" className={`text-xs ${config.color} border-0`}>
                    {req.status?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {req.travel_dates && <span>📅 {req.travel_dates}</span>}
                  {req.num_travelers && <span>👤 {req.num_travelers} travelers</span>}
                  {req.budget_range && <span>💰 {req.budget_range}</span>}
                </div>
                {req.special_requests && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{req.special_requests}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}