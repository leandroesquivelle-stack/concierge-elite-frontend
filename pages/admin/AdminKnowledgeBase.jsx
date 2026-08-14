import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function AdminKnowledgeBase() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const loadArticles = async () => {
    const data = await api.entities.KnowledgeBase.list('-created_date');
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => { loadArticles(); }, []);

  const openNew = () => {
    setForm({ category: 'visa', country: '', title: '', title_es: '', content: '', content_es: '', tags: '', is_published: true });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (a) => { setForm(a); setEditingId(a.id); setShowForm(true); };

  const handleSave = async () => {
    if (editingId) {
      await api.entities.KnowledgeBase.update(editingId, form);
    } else {
      await api.entities.KnowledgeBase.create(form);
    }
    setShowForm(false);
    loadArticles();
  };

  const handleDelete = async (id) => {
    await api.entities.KnowledgeBase.delete(id);
    loadArticles();
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">{t('admin_visa_kb')}</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> {t('general_create')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-5 flex items-center justify-between"
            >
              <div onClick={() => openEdit(article)} className="cursor-pointer flex-1">
                <h3 className="font-medium text-sm">{article.title}</h3>
                <p className="text-xs text-muted-foreground capitalize">{article.category} · {article.country || 'General'} · {article.is_published ? 'Published' : 'Draft'}</p>
              </div>
              <button onClick={() => handleDelete(article.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? t('general_edit') : t('general_create')} Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={form.category || 'visa'} onValueChange={v => updateField('category', v)}>
                  <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="travel_tips">Travel Tips</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="customs">Customs</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Country</Label><Input value={form.country || ''} onChange={e => updateField('country', e.target.value)} className="bg-secondary/50" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Title (EN) *</Label><Input value={form.title || ''} onChange={e => updateField('title', e.target.value)} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Title (ES)</Label><Input value={form.title_es || ''} onChange={e => updateField('title_es', e.target.value)} className="bg-secondary/50" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Content (EN) *</Label><Textarea value={form.content || ''} onChange={e => updateField('content', e.target.value)} className="bg-secondary/50 min-h-[120px]" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Content (ES)</Label><Textarea value={form.content_es || ''} onChange={e => updateField('content_es', e.target.value)} className="bg-secondary/50 min-h-[80px]" /></div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Published</Label>
              <Switch checked={form.is_published !== false} onCheckedChange={v => updateField('is_published', v)} />
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