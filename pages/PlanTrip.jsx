import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle } from 'lucide-react';

export default function PlanTrip() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destinations: '',
    travel_dates: '',
    num_travelers: '',
    budget_range: '',
    interests: '',
    special_requests: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.entities.TravelRequest.create({
      client_email: user?.email || 'guest@concierge-elite.com',
      client_name: user?.full_name || 'Guest',
      destinations: form.destinations,
      travel_dates: form.travel_dates,
      num_travelers: parseInt(form.num_travelers) || 1,
      budget_range: form.budget_range,
      interests: form.interests,
      special_requests: form.special_requests,
      status: 'new',
    });
    setLoading(false);
    setSubmitted(true);
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl font-semibold mb-4">{t('plan_success')}</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{t('nav_plan_trip')}</p>
          <h1 className="font-display text-4xl font-semibold mb-4">{t('plan_title')}</h1>
          <p className="text-muted-foreground">{t('plan_subtitle')}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass rounded-xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">{t('plan_destination')}</Label>
            <Input value={form.destinations} onChange={e => updateField('destinations', e.target.value)} required className="bg-secondary/50 border-border/50" placeholder="e.g. Maldives, Dubai" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80">{t('plan_dates')}</Label>
              <Input value={form.travel_dates} onChange={e => updateField('travel_dates', e.target.value)} className="bg-secondary/50 border-border/50" placeholder="e.g. Dec 20-30, 2026" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80">{t('plan_travelers')}</Label>
              <Input type="number" min="1" value={form.num_travelers} onChange={e => updateField('num_travelers', e.target.value)} className="bg-secondary/50 border-border/50" placeholder="2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">{t('plan_budget')}</Label>
            <Input value={form.budget_range} onChange={e => updateField('budget_range', e.target.value)} className="bg-secondary/50 border-border/50" placeholder="e.g. $15,000 - $25,000" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">{t('plan_interests')}</Label>
            <Textarea value={form.interests} onChange={e => updateField('interests', e.target.value)} className="bg-secondary/50 border-border/50 min-h-[80px]" placeholder="Private dining, cultural tours, beach, adventure..." />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-foreground/80">{t('plan_special')}</Label>
            <Textarea value={form.special_requests} onChange={e => updateField('special_requests', e.target.value)} className="bg-secondary/50 border-border/50 min-h-[80px]" placeholder="Anniversary celebration, dietary needs, accessibility..." />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.15em] font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            {t('plan_submit')}
          </button>
        </motion.form>
      </div>
    </div>
  );
}