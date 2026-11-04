import { useState } from 'react';
import { Bell, Crown, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import NotificationModal from './NotificationModal';

export default function Header({ onMenuClick }) {
  const { language, setLanguage } = useLanguage();
  const { user, guestMode } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount] = useState(2);
  const languages = [
    { code: 'tr', label: 'TR', name: 'Türkçe' },
    { code: 'en', label: 'EN', name: 'English' },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-white/10 bg-[#161326]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onMenuClick} aria-label="Menüyü aç" className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 md:hidden">
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
              <span className="text-[#FFE500]">GFIT</span><span className="text-white/80">App</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/10 p-1" aria-label="Dil seçimi">
              {languages.map((item) => <button key={item.code} type="button" aria-pressed={language === item.code} title={item.name} onClick={() => setLanguage(item.code)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase transition ${language === item.code ? 'bg-[#7C3AED] text-slate-950' : 'text-white/50 hover:text-white'}`}>{item.label}</button>)}
            </div>
            <button type="button" onClick={() => setNotificationsOpen(true)} aria-label="Bildirimler" className="relative rounded-xl p-2 text-white/80 transition hover:bg-white/10">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF8A00] px-1 text-[9px] font-bold text-white">{unreadCount}</span>}
            </button>
            <Link to="/pro" className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] px-3 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-yellow-950/30">
              <Crown size={14} /> PRO
            </Link>
            <Link to={user ? '/profile' : '/login'} className="hidden max-w-28 truncate text-sm text-white/70 lg:block">{user?.email || (guestMode ? 'Demo' : 'Giriş yap')}</Link>
          </div>
        </div>
      </header>
      <NotificationModal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
