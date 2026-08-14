import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Plus, Star, DollarSign, Eye, Copy, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AdminOffers() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadOffers = async () => {
    const data = await api.entities.Offer.list('-created_date');
    setOffers(data);
    setLoading(false);
  };

  useEffect(() => { loadOffers(); }, []);

  const openNew = () => {
    setForm({
      title: '', title_es: '', description: '', description_es: '', destinations: '',
      duration_days: 7, includes_flights: false, includes_hotels: true, includes_transfers: false,
      includes_experiences: false, base_cost: 0, markup_percentage: 20, currency: 'USD',
      visibility: 'public', status: 'draft', category: '',
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (o) => { setForm(o); setEditingId(o.id); setShowForm(true); };

  const handleSave = async () => {
    const finalPrice = form.base_cost * (1 + (form.markup_percentage || 0) / 100);
    const data = { ...form, final_price: finalPrice };
    if (editingId) {
      await api.entities.Offer.update(editingId, data);
    } else {
      await api.entities.Offer.create(data);
    }
    setShowForm(false);
    loadOffers();
  };

  const duplicate = async (offer) => {
    const { id, created_date, updated_date, created_by, ...rest } = offer;
    await api.entities.Offer.create({ ...rest, title: `${rest.title} (Copy)`, status: 'draft', version: (rest.version || 1) + 1 });
    loadOffers();
  };

  const deleteOffer = async (offerId) => {
    await api.entities.Offer.delete(offerId);
    loadOffers();
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">{t('admin_offers')}</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> {t('general_create')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div onClick={() => openEdit(offer)} className="cursor-pointer">
                  <h3 className="font-medium">{offer.title}</h3>
                  <p className="text-xs text-muted-foreground">{offer.destinations} · {offer.duration_days} days</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs border-0 ${offer.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {offer.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-primary font-semibold text-lg">${offer.final_price?.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  <Eye className="w-3 h-3 inline mr-1" />{offer.visibility}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(offer)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t('general_edit')}</button>
                <button onClick={() => duplicate(offer)} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><Copy className="w-3 h-3" />Duplicate</button>
                <button onClick={() => deleteOffer(offer.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" />{t('general_delete')}</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? t('general_edit') : t('general_create')} Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Title (EN) *</Label><Input value={form.title || ''} onChange={e => updateField('title', e.target.value)} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Title (ES)</Label><Input value={form.title_es || ''} onChange={e => updateField('title_es', e.target.value)} className="bg-secondary/50" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Destinations</Label><Input value={form.destinations || ''} onChange={e => updateField('destinations', e.target.value)} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Duration (days)</Label><Input type="number" value={form.duration_days || 7} onChange={e => updateField('duration_days', parseInt(e.target.value))} className="bg-secondary/50" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Description (EN)</Label><Textarea value={form.description || ''} onChange={e => updateField('description', e.target.value)} className="bg-secondary/50 min-h-[60px]" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Itinerary (EN)</Label><Textarea value={form.itinerary || ''} onChange={e => updateField('itinerary', e.target.value)} className="bg-secondary/50 min-h-[80px]" placeholder="Day 1: ...\nDay 2: ..." /></div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center justify-between"><Label className="text-xs">Flights</Label><Switch checked={form.includes_flights || false} onCheckedChange={v => updateField('includes_flights', v)} /></div>
              <div className="flex items-center justify-between"><Label className="text-xs">Hotels</Label><Switch checked={form.includes_hotels || false} onCheckedChange={v => updateField('includes_hotels', v)} /></div>
              <div className="flex items-center justify-between"><Label className="text-xs">Transfers</Label><Switch checked={form.includes_transfers || false} onCheckedChange={v => updateField('includes_transfers', v)} /></div>
              <div className="flex items-center justify-between"><Label className="text-xs">Experiences</Label><Switch checked={form.includes_experiences || false} onCheckedChange={v => updateField('includes_experiences', v)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Base Cost ($)</Label><Input type="number" value={form.base_cost || 0} onChange={e => updateField('base_cost', parseFloat(e.target.value))} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Markup %</Label><Input type="number" value={form.markup_percentage || 20} onChange={e => updateField('markup_percentage', parseFloat(e.target.value))} className="bg-secondary/50" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs">Visibility</Label>
                <Select value={form.visibility || 'public'} onValueChange={v => updateField('visibility', v)}>
                  <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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