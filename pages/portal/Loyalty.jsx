import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Star, Crown, Award, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const tierConfig = {
  premium: { icon: Star, color: 'text-amber-400', next: 'black', threshold: 50000 },
  black: { icon: Crown, color: 'text-slate-300', next: 'elite', threshold: 150000 },
  elite: { icon: Award, color: 'text-primary', next: null, threshold: null },
};

export default function Loyalty() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const accounts = await api.entities.LoyaltyAccount.filter({ client_email: user?.email });
      setAccount(accounts[0] || null);
      setLoading(false);
    }
    if (user?.email) load();
  }, [user]);

  if (loading) {
    return <div className="p-6 lg:p-10 flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!account) {
    return (
      <div className="p-6 lg:p-10">
        <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_loyalty')}</h1>
        <div className="glass rounded-xl p-12 text-center">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">{t('general_no_results')}</p>
          <p className="text-xs text-muted-foreground">Complete your first trip to start earning points.</p>
        </div>
      </div>
    );
  }

  const tier = tierConfig[account.tier] || tierConfig.premium;
  const TierIcon = tier.icon;
  const progress = tier.threshold ? Math.min((account.total_spent_usd / tier.threshold) * 100, 100) : 100;

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_loyalty')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 text-center">
          <TierIcon className={`w-8 h-8 ${tier.color} mx-auto mb-3`} />
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('loyalty_tier')}</p>
          <p className="font-display text-2xl font-semibold capitalize">{account.tier}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('loyalty_balance')}</p>
          <p className="font-display text-2xl font-semibold">{account.total_points?.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 text-center">
          <Star className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('loyalty_earned')}</p>
          <p className="font-display text-2xl font-semibold">{account.points_earned?.toLocaleString()}</p>
        </motion.div>
      </div>

      {tier.next && (
        <div className="glass rounded-xl p-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="capitalize">{account.tier}</span>
            <span className="capitalize text-primary">{tier.next}</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            ${account.total_spent_usd?.toLocaleString()} / ${tier.threshold?.toLocaleString()} spent
          </p>
        </div>
      )}
    </div>
  );
}