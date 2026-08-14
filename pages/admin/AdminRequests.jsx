import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statuses = ['new', 'in_review', 'proposal_sent', 'approved', 'completed', 'cancelled'];
const statusColors = {
  new: 'bg-blue-500/20 text-blue-400',
  in_review: 'bg-amber-500/20 text-amber-400',
  proposal_sent: 'bg-purple-500/20 text-purple-400',
  approved: 'bg-green-500/20 text-green-400',
  completed: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminRequests() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    const data = await api.entities.TravelRequest.list('-created_date');
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { loadRequests(); }, []);

  const updateStatus = async (id, status) => {
    await api.entities.TravelRequest.update(id, { status });
    loadRequests();
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('admin_requests')}</h1>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-medium">{req.destinations}</h3>
                  <p className="text-xs text-muted-foreground">{req.client_name || req.client_email} · {new Date(req.created_date).toLocaleDateString()}</p>
                </div>
                <Select value={req.status} onValueChange={v => updateStatus(req.id, v)}>
                  <SelectTrigger className="w-40 h-8 text-xs bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s} className="text-xs">{s.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {req.travel_dates && <span>📅 {req.travel_dates}</span>}
                {req.num_travelers && <span>👤 {req.num_travelers}</span>}
                {req.budget_range && <span>💰 {req.budget_range}</span>}
                {req.priority !== 'normal' && <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-0">{req.priority}</Badge>}
              </div>
              {req.special_requests && <p className="text-xs text-foreground/60 mt-2">{req.special_requests}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}