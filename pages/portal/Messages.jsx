import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Messages() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    const sent = await api.entities.Message.filter({ from_email: user?.email }, '-created_date', 50);
    const received = await api.entities.Message.filter({ to_email: user?.email }, '-created_date', 50);
    const all = [...sent, ...received].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    setMessages(all);
    setLoading(false);
  };

  useEffect(() => { if (user?.email) loadMessages(); }, [user]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    await api.entities.Message.create({
      from_email: user?.email,
      to_email: 'concierge@concierge-elite.com',
      body: newMsg,
      subject: 'Client Message',
    });
    setNewMsg('');
    setSending(false);
    loadMessages();
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-semibold mb-8">{t('portal_messages')}</h1>

      <div className="glass rounded-xl p-5 mb-6">
        <Textarea
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder={t('contact_message')}
          className="bg-secondary/50 border-border/50 min-h-[80px] mb-3"
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMsg.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> {t('contact_send')}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : messages.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('general_no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.from_email === user?.email;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass rounded-xl p-5 ${isMe ? 'ml-8' : 'mr-8'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary">{isMe ? 'You' : 'Concierge'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(msg.created_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-foreground/80">{msg.body}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}