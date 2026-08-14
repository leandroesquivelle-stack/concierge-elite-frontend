import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Shield, Search, BookOpen } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function VisaGuidance() {
  const { t, lang } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await api.entities.KnowledgeBase.filter({ category: 'visa', is_published: true });
      setArticles(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = articles.filter(a => {
    const title = (lang === 'es' && a.title_es ? a.title_es : a.title).toLowerCase();
    return title.includes(search.toLowerCase()) || (a.country || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-2">{t('portal_visa')}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t('service_visa_desc')}</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('general_search')}
          className="pl-10 bg-secondary/50 border-border/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{lang === 'es' && article.title_es ? article.title_es : article.title}</h3>
                  {article.country && <p className="text-xs text-primary mt-0.5">{article.country}</p>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {lang === 'es' && article.content_es ? article.content_es : article.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}