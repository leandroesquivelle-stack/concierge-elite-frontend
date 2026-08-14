import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Plane, MapPin, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const statusColors = {
  planning: 'bg-blue-500/20 text-blue-400',
  confirmed: 'bg-green-500/20 text-green-400',
  in_progress: 'bg-amber-500/20 text-amber-400',
  completed: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function Trips() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.entities.Trip.filter({ client_email: user?.email }, '-created_date');
      setTrips(data);
      setLoading(false);
    }
    if (user?.email) load();
  }, [user]);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_trips')}</h1>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : trips.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display text-lg font-semibold">{trip.title}</h3>
                <Badge variant="outline" className={`text-xs ${statusColors[trip.status] || ''} border-0`}>
                  {trip.status?.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {trip.destinations}</span>
                {trip.start_date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {trip.start_date} → {trip.end_date}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}