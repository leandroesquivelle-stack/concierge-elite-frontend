import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Plus, User, DollarSign, Calendar, Tag } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const stages = ['new', 'contacted', 'proposal', 'won', 'lost'];
const stageColors = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-amber-500/20 text-amber-400',
  proposal: 'bg-purple-500/20 text-purple-400',
  won: 'bg-green-500/20 text-green-400',
  lost: 'bg-red-500/20 text-red-400',
};

export default function CRMLeads() {
  const { t } = useTranslation();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [viewMode, setViewMode] = useState('pipeline');

  const loadLeads = async () => {
    const data = await api.entities.CRMLead.list('-created_date');
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { loadLeads(); }, []);

  const openNew = () => {
    setForm({ name: '', email: '', phone: '', source: 'website', pipeline_stage: 'new', notes: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (lead) => {
    setForm(lead);
    setEditingId(lead.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (editingId) {
      await api.entities.CRMLead.update(editingId, form);
    } else {
      await api.entities.CRMLead.create(form);
    }
    setShowForm(false);
    loadLeads();
  };

  const updateStage = async (leadId, stage) => {
    await api.entities.CRMLead.update(leadId, { pipeline_stage: stage });
    loadLeads();
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="p-6 lg:p-10 flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">{t('admin_leads')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'pipeline' ? 'list' : 'pipeline')}
            className="px-3 py-2 text-xs border border-border rounded-lg hover:bg-secondary transition-all"
          >
            {viewMode === 'pipeline' ? 'List' : 'Pipeline'}
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" /> {t('general_create')}
          </button>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
          {stages.map(stage => {
            const stageLeads = leads.filter(l => l.pipeline_stage === stage);
            return (
              <div key={stage} className="min-w-[200px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <Badge variant="outline" className={`text-xs ${stageColors[stage]} border-0`}>
                    {t(`crm_${stage}`)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => openEdit(lead)}
                      className="glass rounded-lg p-4 cursor-pointer hover:bg-white/[0.06] transition-all"
                    >
                      <h4 className="font-medium text-sm mb-1">{lead.name}</h4>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                      {lead.estimated_value && (
                        <p className="text-xs text-primary mt-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />{lead.estimated_value?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => openEdit(lead)}
              className="glass rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-4">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-sm">{lead.name}</h4>
                  <p className="text-xs text-muted-foreground">{lead.email} · {lead.source}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-xs ${stageColors[lead.pipeline_stage]} border-0`}>
                {t(`crm_${lead.pipeline_stage}`)}
              </Badge>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? t('general_edit') : t('general_create')} Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('general_name')} *</Label>
                <Input value={form.name || ''} onChange={e => updateField('name', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('general_email')} *</Label>
                <Input type="email" value={form.email || ''} onChange={e => updateField('email', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('general_phone')}</Label>
                <Input value={form.phone || ''} onChange={e => updateField('phone', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Source</Label>
                <Select value={form.source || 'website'} onValueChange={v => updateField('source', v)}>
                  <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Pipeline Stage</Label>
                <Select value={form.pipeline_stage || 'new'} onValueChange={v => updateField('pipeline_stage', v)}>
                  <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stages.map(s => <SelectItem key={s} value={s}>{t(`crm_${s}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Est. Value ($)</Label>
                <Input type="number" value={form.estimated_value || ''} onChange={e => updateField('estimated_value', parseFloat(e.target.value) || 0)} className="bg-secondary/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('general_notes')}</Label>
              <Textarea value={form.notes || ''} onChange={e => updateField('notes', e.target.value)} className="bg-secondary/50 min-h-[60px]" />
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