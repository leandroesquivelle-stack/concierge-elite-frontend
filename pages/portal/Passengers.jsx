import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Plus, User, Check, AlertCircle, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

function calculateCompletion(p) {
  const fields = ['full_legal_name', 'date_of_birth', 'nationality', 'residence_country', 'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_scan_url', 'email', 'phone', 'emergency_contact_name', 'emergency_contact_phone'];
  const filled = fields.filter(f => p[f] && p[f].toString().trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

export default function Passengers() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadPassengers = async () => {
    const data = await api.entities.PassengerProfile.filter({ client_email: user?.email });
    setPassengers(data);
    setLoading(false);
  };

  useEffect(() => { if (user?.email) loadPassengers(); }, [user]);

  const resetForm = () => ({
    full_legal_name: '', date_of_birth: '', nationality: '', residence_country: '',
    passport_number: '', passport_issue_date: '', passport_expiry_date: '',
    email: '', phone: '', frequent_flyer_programs: '', travel_preferences: '',
    dietary_requirements: '', medical_notes: '', emergency_contact_name: '', emergency_contact_phone: '',
  });

  const openNew = () => { setForm(resetForm()); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => { setForm(p); setEditingId(p.id); setShowForm(true); };

  const handleSave = async () => {
    const completion = calculateCompletion(form);
    const data = { ...form, client_email: user?.email, completion_percentage: completion };
    if (editingId) {
      await api.entities.PassengerProfile.update(editingId, data);
    } else {
      await api.entities.PassengerProfile.create(data);
    }
    setShowForm(false);
    loadPassengers();
  };

  const handleFileUpload = async (field, file) => {
    const { file_url } = await api.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, [field]: file_url }));
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t('portal_passengers')}</h1>
          <p className="text-sm text-muted-foreground">{t('passenger_completion')}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> {t('general_create')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : passengers.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passengers.map((p, i) => {
            const completion = calculateCompletion(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openEdit(p)}
                className="glass rounded-xl p-6 cursor-pointer hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{p.full_legal_name}</h3>
                    <p className="text-xs text-muted-foreground">{p.nationality} · {p.email || '—'}</p>
                  </div>
                  {completion === 100 ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('passenger_completion')}</span>
                    <span className="text-primary font-medium">{completion}%</span>
                  </div>
                  <Progress value={completion} className="h-1.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? t('general_edit') : t('general_create')} {t('portal_passengers')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_full_name')} *</Label>
                <Input value={form.full_legal_name || ''} onChange={e => updateField('full_legal_name', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_dob')}</Label>
                <Input type="date" value={form.date_of_birth || ''} onChange={e => updateField('date_of_birth', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_nationality')}</Label>
                <Input value={form.nationality || ''} onChange={e => updateField('nationality', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_residence')}</Label>
                <Input value={form.residence_country || ''} onChange={e => updateField('residence_country', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_passport_number')}</Label>
                <Input value={form.passport_number || ''} onChange={e => updateField('passport_number', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_passport_issue')}</Label>
                <Input type="date" value={form.passport_issue_date || ''} onChange={e => updateField('passport_issue_date', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_passport_expiry')}</Label>
                <Input type="date" value={form.passport_expiry_date || ''} onChange={e => updateField('passport_expiry_date', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_email')}</Label>
                <Input type="email" value={form.email || ''} onChange={e => updateField('email', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_phone')}</Label>
                <Input value={form.phone || ''} onChange={e => updateField('phone', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_frequent_flyer')}</Label>
                <Input value={form.frequent_flyer_programs || ''} onChange={e => updateField('frequent_flyer_programs', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_emergency_contact')}</Label>
                <Input value={form.emergency_contact_name || ''} onChange={e => updateField('emergency_contact_name', e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_phone')}</Label>
                <Input value={form.emergency_contact_phone || ''} onChange={e => updateField('emergency_contact_phone', e.target.value)} className="bg-secondary/50" placeholder="Emergency phone" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('passenger_dietary')}</Label>
              <Input value={form.dietary_requirements || ''} onChange={e => updateField('dietary_requirements', e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('passenger_medical')}</Label>
              <Textarea value={form.medical_notes || ''} onChange={e => updateField('medical_notes', e.target.value)} className="bg-secondary/50 min-h-[60px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('passenger_preferences')}</Label>
              <Textarea value={form.travel_preferences || ''} onChange={e => updateField('travel_preferences', e.target.value)} className="bg-secondary/50 min-h-[60px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_passport_upload')}</Label>
                {form.passport_scan_url ? <p className="text-xs text-green-500">✓ Uploaded</p> : null}
                <label className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-md cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => e.target.files?.[0] && handleFileUpload('passport_scan_url', e.target.files[0])} />
                </label>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{t('passenger_visa_upload')}</Label>
                {form.visa_scan_url ? <p className="text-xs text-green-500">✓ Uploaded</p> : null}
                <label className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-md cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => e.target.files?.[0] && handleFileUpload('visa_scan_url', e.target.files[0])} />
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
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