import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Crown, Star, Award, Plus, TrendingUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const tierIcons = { premium: Star, black: Crown, elite: Award };
const tierColors = { premium: 'text-amber-400', black: 'text-slate-300', elite: 'text-primary' };

export default function AdminLoyalty() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadAccounts = async () => {
    const data = await api.entities.LoyaltyAccount.list('-total_points');
    setAccounts(data);
    setLoading(false);
  };

  useEffect(() => { loadAccounts(); }, []);

  const openEdit = (a) => { setForm(a); setEditingId(a.id); setShowForm(true); };
  const openNew = () => { setForm({ client_email: '', tier: 'premium', total_points: 0, points_earned: 0, points_redeemed: 0, total_spent_usd: 0 }); setEditingId(null); setShowForm(true); };

  const handleSave = async () => {
    if (editingId) {
      await api.entities.LoyaltyAccount.update(editingId, form);
    } else {
      await api.entities.LoyaltyAccount.create(form);
    }
    setShowForm(false);
    loadAccounts();
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">{t('admin_loyalty')}</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> {t('general_create')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc, i) => {
            const Icon = tierIcons[acc.tier] || Star;
            return (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => openEdit(acc)}
                className="glass rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 ${tierColors[acc.tier] || ''}`} />
                  <div>
                    <h3 className="font-medium text-sm">{acc.client_email}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{acc.tier} · {acc.total_points?.toLocaleString()} points</p>
                  </div>
                </div>
                <span className="text-primary font-semibold">${acc.total_spent_usd?.toLocaleString()}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader><DialogTitle className="font-display">{editingId ? 'Adjust' : 'Create'} Loyalty Account</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5"><Label className="text-xs">Client Email *</Label><Input value={form.client_email || ''} onChange={e => updateField('client_email', e.target.value)} className="bg-secondary/50" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Tier</Label>
                <Select value={form.tier || 'premium'} onValueChange={v => updateField('tier', v)}>
                  <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Total Points</Label><Input type="number" value={form.total_points || 0} onChange={e => updateField('total_points', parseInt(e.target.value))} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Points Earned</Label><Input type="number" value={form.points_earned || 0} onChange={e => updateField('points_earned', parseInt(e.target.value))} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Total Spent ($)</Label><Input type="number" value={form.total_spent_usd || 0} onChange={e => updateField('total_spent_usd', parseFloat(e.target.value))} className="bg-secondary/50" /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all">{t('general_save')}</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-border text-sm rounded-lg hover:bg-secondary transition-all">{t('general_cancel')}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}