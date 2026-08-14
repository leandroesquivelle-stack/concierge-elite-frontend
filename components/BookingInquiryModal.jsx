import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Users, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { api } from '@/api/apiClient';

export default function BookingInquiryModal({ destination, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    start_date: '',
    end_date: '',
    guests: 2,
    special_requests: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = `
New Booking Inquiry for ${destination.name}

From: ${form.name} (${form.email})
Destination: ${destination.name}, ${destination.country}
Travel Dates: ${form.start_date} → ${form.end_date}
Number of Guests: ${form.guests}
Special Requests: ${form.special_requests || 'None'}
    `.trim();

    await api.integrations.Core.SendEmail({
      to: 'hello@elite-concierge.com',
      subject: `Booking Inquiry – ${destination.name}`,
      body,
    });

    setSent(true);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg glass-strong rounded-2xl overflow-hidden z-10"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-36 overflow-hidden">
            {destination.image && (
              <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
            <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {destination.country}
                </p>
                <h2 className="font-display text-2xl font-semibold text-white">{destination.name}</h2>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-8 gap-4"
              >
                <CheckCircle className="w-12 h-12 text-primary" />
                <h3 className="font-display text-xl font-semibold">Inquiry Sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Our concierge team will be in touch within 24 hours to craft your perfect journey.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Departure
                    </label>
                    <input
                      required
                      type="date"
                      value={form.start_date}
                      onChange={e => set('start_date', e.target.value)}
                      className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Return
                    </label>
                    <input
                      required
                      type="date"
                      value={form.end_date}
                      onChange={e => set('end_date', e.target.value)}
                      className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Number of Guests
                  </label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => set('guests', Math.max(1, form.guests - 1))}
                      className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-lg hover:border-primary/60 transition-colors">−</button>
                    <span className="w-6 text-center font-medium">{form.guests}</span>
                    <button type="button" onClick={() => set('guests', Math.min(20, form.guests + 1))}
                      className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-lg hover:border-primary/60 transition-colors">+</button>
                    <span className="text-xs text-muted-foreground ml-1">{form.guests === 1 ? 'traveler' : 'travelers'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={form.special_requests}
                    onChange={e => set('special_requests', e.target.value)}
                    placeholder="Dietary needs, room preferences, celebrations..."
                    className="w-full bg-background/50 border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Send Inquiry</>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}