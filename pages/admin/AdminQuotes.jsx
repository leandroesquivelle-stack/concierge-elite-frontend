import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Plus, Package, DollarSign } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function AdminQuotes() {
  const { t } = useTranslation();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadQuotes = async () => {
    const data = await api.entities.Quote.list('-created_date');
    setQuotes(data);
    setLoading(false);
  };

  useEffect(() => { loadQuotes(); }, []);

  const openNew = () => {
    setForm({ client_email: '', title: '', title_es: '', description: '', description_es: '', base_cost: 0, markup_percentage: 15, currency: 'USD', status: 'draft' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (q) => { setForm(q); setEditingId(q.id); setShowForm(true); };

  const handleSave = async () => {
    const totalPrice = form.base_cost * (1 + (form.markup_percentage || 0) / 100);
    const data = { ...form, total_price: totalPrice };
    if (editingId) {
      await api.entities.Quote.update(editingId, data);
    } else {
      await api.entities.Quote.create(data);
    }
    setShowForm(false);
    loadQuotes();
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const statusColors = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">{t('admin_quotes')}</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> {t('general_create')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : quotes.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote, i) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => openEdit(quote)}
              className="glass rounded-xl p-5 cursor-pointer hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{quote.title}</h3>
                  <p className="text-xs text-muted-foreground">{quote.client_email} · {quote.client_name}</p>
                </div>
                <Badge variant="outline" className={`text-xs ${statusColors[quote.status] || ''} border-0`}>
                  {quote.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-primary font-semibold flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />{quote.total_price?.toLocaleString()} {quote.currency}
                </span>
                <span className="text-xs text-muted-foreground">Markup: {quote.markup_percentage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? t('general_edit') : t('general_create')} Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Client Email *</Label>
                <Input value={form.client_email || ''} onChange={e => updateField('client_email', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Client Name</Label>
                <Input value={form.client_name || ''} onChange={e => updateField('client_name', e.target.value)} className="bg-secondary/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Title (EN) *</Label>
                <Input value={form.title || ''} onChange={e => updateField('title', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title (ES)</Label>
                <Input value={form.title_es || ''} onChange={e => updateField('title_es', e.target.value)} className="bg-secondary/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description (EN)</Label>
              <Textarea value={form.description || ''} onChange={e => updateField('description', e.target.value)} className="bg-secondary/50 min-h-[60px]" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Base Cost ($)</Label>
                <Input type="number" value={form.base_cost || 0} onChange={e => updateField('base_cost', parseFloat(e.target.value) || 0)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Markup %</Label>
                <Input type="number" value={form.markup_percentage || 15} onChange={e => updateField('markup_percentage', parseFloat(e.target.value) || 0)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={form.status || 'draft'} onValueChange={v => updateField('status', v)}>
                  <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all">
                {t('general_save')}
              </button>
              <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-border text-sm rounded-lg hover:bg-secondary transition-all">
                {t('general_cancel')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}