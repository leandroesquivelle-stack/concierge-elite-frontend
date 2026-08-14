import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { FolderCheck, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminDocuments() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadDocs = async () => {
    const data = await api.entities.Document.list('-created_date');
    setDocuments(data);
    setLoading(false);
  };

  useEffect(() => { loadDocs(); }, []);

  const approve = async (id) => {
    await api.entities.Document.update(id, { status: 'approved' });
    setSelected(null);
    loadDocs();
  };

  const reject = async (id) => {
    await api.entities.Document.update(id, { status: 'rejected', rejection_reason: rejectReason });
    setSelected(null);
    setRejectReason('');
    loadDocs();
  };

  const statusIcons = {
    pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    approved: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('admin_documents')}</h1>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : documents.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FolderCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, i) => {
            const si = statusIcons[doc.status] || statusIcons.pending;
            const Icon = si.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(doc)}
                className="glass rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 ${si.color}`} />
                  <div>
                    <h3 className="font-medium text-sm">{doc.file_name || doc.document_type}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{doc.document_type?.replace('_', ' ')} · {doc.client_email}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${si.bg} ${si.color} border-0`}>
                  {doc.status}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Document Review</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Type:</span> <span className="capitalize">{selected.document_type?.replace('_', ' ')}</span></p>
                <p><span className="text-muted-foreground">Client:</span> {selected.client_email}</p>
                <p><span className="text-muted-foreground">Status:</span> <span className="capitalize">{selected.status}</span></p>
                {selected.expiry_date && <p><span className="text-muted-foreground">Expiry:</span> {selected.expiry_date}</p>}
                <a href={selected.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                  View File <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {selected.status === 'pending' && (
                <div className="space-y-3 pt-2">
                  <Textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Rejection reason (optional)"
                    className="bg-secondary/50 min-h-[60px]"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => approve(selected.id)} className="flex-1 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {t('doc_approve')}
                    </button>
                    <button onClick={() => reject(selected.id)} className="flex-1 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" /> {t('doc_reject')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}