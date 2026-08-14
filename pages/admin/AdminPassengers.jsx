import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Users, Check, AlertCircle, Search } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function calculateCompletion(p) {
  const fields = ['full_legal_name', 'date_of_birth', 'nationality', 'residence_country', 'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_scan_url', 'email', 'phone', 'emergency_contact_name', 'emergency_contact_phone'];
  const filled = fields.filter(f => p[f] && p[f].toString().trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

export default function AdminPassengers() {
  const { t } = useTranslation();
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadPassengers = async () => {
    const data = await api.entities.PassengerProfile.list('-created_date');
    setPassengers(data);
    setLoading(false);
  };

  useEffect(() => { loadPassengers(); }, []);

  const updateReviewStatus = async (id, status) => {
    await api.entities.PassengerProfile.update(id, { review_status: status });
    loadPassengers();
  };

  const filtered = passengers.filter(p =>
    (p.full_legal_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const reviewColors = {
    pending: 'bg-amber-500/20 text-amber-400',
    approved: 'bg-green-500/20 text-green-400',
    needs_update: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('admin_passengers')}</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('general_search')} className="pl-10 bg-secondary/50 border-border/50" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => {
            const completion = calculateCompletion(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {completion === 100 ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                    <div>
                      <h3 className="font-medium">{p.full_legal_name}</h3>
                      <p className="text-xs text-muted-foreground">{p.email} · {p.nationality} · Client: {p.client_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={p.review_status || 'pending'} onValueChange={v => updateReviewStatus(p.id, v)}>
                      <SelectTrigger className="w-36 h-8 text-xs bg-secondary/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="needs_update">Needs Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={completion} className="h-1.5" />
                  </div>
                  <span className="text-xs text-primary font-medium">{completion}%</span>
                </div>
                {p.passport_expiry_date && (
                  <p className="text-xs text-muted-foreground mt-2">Passport expires: {p.passport_expiry_date}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}