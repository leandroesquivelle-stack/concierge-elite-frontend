import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { api } from '@/api/apiClient';
import {
  LayoutDashboard, Plane, FileText, Users, FolderOpen,
  Shield, MessageSquare, Star, Crown, CreditCard,
  Settings, ChevronLeft, ChevronRight, LogOut, Globe, Menu, X
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { key: 'portal_dashboard', icon: LayoutDashboard, path: '/portal' },
  { key: 'portal_trips', icon: Plane, path: '/portal/trips' },
  { key: 'portal_requests', icon: FileText, path: '/portal/requests' },
  { key: 'portal_passengers', icon: Users, path: '/portal/passengers' },
  { key: 'portal_documents', icon: FolderOpen, path: '/portal/documents' },
  { key: 'portal_visa', icon: Shield, path: '/portal/visa' },
  { key: 'portal_messages', icon: MessageSquare, path: '/portal/messages' },
  { key: 'portal_loyalty', icon: Star, path: '/portal/loyalty' },
  { key: 'portal_membership', icon: Crown, path: '/portal/membership' },
  { key: 'portal_preferences', icon: Settings, path: '/portal/preferences' },
];

export default function PortalLayout() {
  const { t, toggleLang, lang } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    api.auth.logout('/');
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <Link to="/">
          {collapsed && !mobile ? <Logo size="sm" showText={false} collapsed /> : <Logo size="sm" showText={true} />}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {(!collapsed || mobile) && <span>{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50 space-y-1">
        <button onClick={toggleLang} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all">
          <Globe className="w-4 h-4" />
          {(!collapsed || mobile) && <span>{lang === 'en' ? 'Español' : 'English'}</span>}
        </button>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-destructive rounded-lg hover:bg-secondary transition-all">
          <LogOut className="w-4 h-4" />
          {(!collapsed || mobile) && <span>{t('nav_logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-border/50 bg-card transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 mx-auto mb-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)} className="text-foreground/80"><Menu className="w-5 h-5" /></button>
        <Logo size="xs" showText={true} />
        <div className="w-5" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-card border-r border-border/50">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-foreground/60"><X className="w-5 h-5" /></button>
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:overflow-y-auto">
        <div className="pt-14 lg:pt-0 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}