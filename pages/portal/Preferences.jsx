import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, CheckCircle } from 'lucide-react';

export default function Preferences() {
  const { t, lang, setLang } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const profiles = await api.entities.ClientProfile.filter({ user_email: user?.email });
      setProfile(profiles[0] || { user_email: user?.email, full_name: user?.full_name || '', preferred_language: lang });
      setLoading(false);
    }
    if (user?.email) load();
  }, [user]);

  const handleSave = async () => {
    if (profile.id) {
      await api.entities.ClientProfile.update(profile.id, profile);
    } else {
      await api.entities.ClientProfile.create(profile);
    }
    if (profile.preferred_language) setLang(profile.preferred_language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field, value) => setProfile(prev => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="p-6 lg:p-10 flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_preferences')}</h1>

      <div className="glass rounded-xl p-6 space-y-5 max-w-xl">
        <div className="space-y-1.5">
          <Label className="text-xs">{t('general_name')}</Label>
          <Input value={profile?.full_name || ''} onChange={e => updateField('full_name', e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t('general_phone')}</Label>
          <Input value={profile?.phone || ''} onChange={e => updateField('phone', e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Language / Idioma</Label>
          <Select value={profile?.preferred_language || 'en'} onValueChange={v => updateField('preferred_language', v)}>
            <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t('passenger_preferences')}</Label>
          <Textarea value={profile?.preferences || ''} onChange={e => updateField('preferences', e.target.value)} className="bg-secondary/50 min-h-[80px]" />
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          {saved ? '✓ Saved' : t('general_save')}
        </button>
      </div>
    </div>
  );
}