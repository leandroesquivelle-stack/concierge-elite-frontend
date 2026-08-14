import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const statusIcons = {
  pending: { icon: Clock, color: 'text-amber-400' },
  approved: { icon: CheckCircle, color: 'text-green-500' },
  rejected: { icon: XCircle, color: 'text-red-400' },
};

export default function Documents() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('passport');

  const loadDocs = async () => {
    const data = await api.entities.Document.filter({ client_email: user?.email }, '-created_date');
    setDocuments(data);
    setLoading(false);
  };

  useEffect(() => { if (user?.email) loadDocs(); }, [user]);

  const handleUpload = async (file) => {
    setUploading(true);
    const { file_url } = await api.integrations.Core.UploadFile({ file });
    await api.entities.Document.create({
      client_email: user?.email,
      document_type: docType,
      file_url,
      file_name: file.name,
      status: 'pending',
    });
    setUploading(false);
    loadDocs();
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_documents')}</h1>

      <div className="glass rounded-xl p-6 mb-8">
        <h3 className="font-medium mb-4">{t('doc_upload')}</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Label className="text-xs mb-1.5 block">Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="travel_insurance">Travel Insurance</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="text-xs mb-1.5 block">File</Label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/50 rounded-lg cursor-pointer text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all border border-dashed border-border">
              <Upload className="w-4 h-4" />
              {uploading ? t('general_loading') : t('doc_upload')}
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : documents.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, i) => {
            const StatusIcon = statusIcons[doc.status]?.icon || Clock;
            const statusColor = statusIcons[doc.status]?.color || 'text-muted-foreground';
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                  <div>
                    <h3 className="font-medium text-sm">{doc.file_name || doc.document_type}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{doc.document_type?.replace('_', ' ')} · {t(`doc_status_${doc.status}`)}</p>
                    {doc.rejection_reason && <p className="text-xs text-red-400 mt-1">{doc.rejection_reason}</p>}
                  </div>
                </div>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}