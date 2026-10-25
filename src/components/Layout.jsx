import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
  Menu,
  X,
  Pill,
  Activity,
  Sparkles,
  User,
  ShoppingBag,
  Crown,
  Bell,
  LogOut,
  Home,
  ScanLine,
  Mic,
  Camera,
  Edit3,
  Droplets,
  Footprints,
  Moon,
  Notebook,
  Cigarette,
  Users,
  BookOpen,
  Plus,
  Home as HomeIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import InstallPWA from './InstallPWA';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState('inbox');
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: t('nav_summary'), icon: LayoutDashboard },
    { to: '/yemek', label: t('nav_food'), icon: UtensilsCrossed },
    { to: '/antrenman', label: t('nav_workout'), icon: Dumbbell },
    { to: '/ilerleme', label: t('nav_progress'), icon: TrendingUp },
  ];

  const drawerLinks = [
    { to: '/dashboard', label: '🏠 Bugünün Özeti', icon: HomeIcon },
    { to: '/yemek', label: '🍽️ Yemek & Barkod', icon: UtensilsCrossed },
    { to: '/antrenman', label: '🏋️ Antrenman Programları', icon: Dumbbell },
    { to: '/mobility', label: '🧘 Mobilite & Esneme', icon: Activity },
    { to: '/ilerleme', label: '📈 İlerleme & Geçmiş', icon: TrendingUp },
    { to: '/supplement', label: '💊 Supplement & GFIT10', icon: Pill },
    { to: '/guc-artisi', label: '🏆 Güç Artışı (1RM)', icon: TrendingUp },
    { to: '/aliskanliklar', label: '👟 Adım & Uyku', icon: Footprints },
    { to: '/sosyal', label: '👥 Sosyal', icon: Users },
    { to: '/pazar', label: '🥗 Beslenme & Tarifler', icon: UtensilsCrossed },
    { to: '/premium', label: '👑 GFitt PRO', icon: Crown, highlight: true },
    { to: '/profil', label: '⚙️ Profil & Ayarlar', icon: User },
  ];

  const quickActions = [
    { icon: ScanLine, label: 'Barkod & Etiket Tara', action: () => navigate('/yemek') },
    { icon: Mic, label: 'Sesli Yemek Ekle', action: () => { setQuickActionOpen(false); navigate('/yemek'); } },
    { icon: Camera, label: 'AI Fotoğraf Analizi', action: () => { setQuickActionOpen(false); navigate('/yemek'); } },
    { icon: Edit3, label: 'Manuel Ekle', action: () => { setQuickActionOpen(false); navigate('/yemek'); } },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C1836] via-[#0E0C1B] to-[#08070F] text-white font-sans selection:bg-purple-500 selection:text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#181528]/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-5 h-5" />
          </button>
          <NavLink
            to="/"
            className="font-black text-lg tracking-tight bg-gradient-to-r from-[#FF8A00] to-[#FFA02E] bg-clip-text text-transparent cursor-pointer"
          >
            GFitt
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex gap-1">
            {['TR', 'EN', 'DE'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang.toLowerCase())}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === lang.toLowerCase()
                    ? 'bg-[#FF8A00] text-slate-950'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setNotificationOpen(true)}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* PRO Button */}
          <NavLink
            to="/premium"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>PRO</span>
          </NavLink>
        </div>
      </header>

      {/* Left Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85%] bg-[#181528]/95 backdrop-blur-xl border-r border-white/10 h-full p-5 flex flex-col shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="font-black text-xl text-white">GFitt Menü</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-1 flex-1 overflow-y-auto">
              {drawerLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      item.highlight
                        ? 'bg-[#FF8A00]/15 text-[#FF8A00] border border-[#FF8A00]/30'
                        : isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label.startsWith('🏠') || item.label.startsWith('🍽️') || item.label.startsWith('🏋️') || item.label.startsWith('🧘') || item.label.startsWith('📈') || item.label.startsWith('💊') || item.label.startsWith('🏆') || item.label.startsWith('👟') || item.label.startsWith('👥') || item.label.startsWith('🥗') || item.label.startsWith('👑') || item.label.startsWith('⚙️') ? (
                      <span className="text-lg">{item.label.split(' ')[0]}</span>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span>{item.label.split(' ').slice(1).join(' ') || item.label}</span>
                  </NavLink>
                );
              })}

              {/* Install PWA Button */}
              <div className="pt-4 border-t border-white/5">
                <InstallPWA />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  signOut?.();
                  navigate('/giris');
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181528] border border-white/10 rounded-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Bildirimler</h3>
              <button
                onClick={() => setNotificationOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {[
                { id: 'inbox', label: 'Gelen Kutusu' },
                { id: 'community', label: 'Topluluk' },
                { id: 'news', label: 'Yenilikler' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNotificationTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    notificationTab === tab.id
                      ? 'bg-[#FF8A00] text-slate-950'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notificationTab === 'inbox' && (
                <>
                  <div className="p-3 bg-[#0B101B] rounded-xl">
                    <p className="text-xs font-semibold text-white">Haftalık Özet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Bu hafta ortalama 2400 kcal aldın, harika!</p>
                  </div>
                  <div className="p-3 bg-[#0B101B] rounded-xl">
                    <p className="text-xs font-semibold text-white">🎯 Hedefine Yaklaştın</p>
                    <p className="text-[11px] text-slate-400 mt-1">Protein hedefinin %90'ına ulaştın</p>
                  </div>
                </>
              )}
              {notificationTab === 'community' && (
                <div className="p-3 bg-[#0B101B] rounded-xl">
                  <p className="text-xs font-semibold text-white">👥 Topluluk</p>
                  <p className="text-[11px] text-slate-400 mt-1">Yakında aktif olacak</p>
                </div>
              )}
              {notificationTab === 'news' && (
                <div className="p-3 bg-[#0B101B] rounded-xl">
                  <p className="text-xs font-semibold text-white">🆕 Yenilikler</p>
                  <p className="text-[11px] text-slate-400 mt-1">Mobilite modülü eklendi!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Sheet */}
      {quickActionOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181528] border-t border-white/10 rounded-t-3xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Hızlı Eylem</h3>
              <button
                onClick={() => setQuickActionOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 p-4 bg-[#0B101B] rounded-2xl hover:bg-[#1E293B] transition-colors"
                >
                  <action.icon className="w-6 h-6 text-[#FF8A00]" />
                  <span className="text-xs font-semibold text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-lg mx-auto px-4 pt-4">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-4 right-4 h-16 bg-[#161326]/90 backdrop-blur-2xl border border-white/10 rounded-full px-6 flex items-center justify-between z-50 max-w-lg mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-[#FF8A00] font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 text-xs font-medium'
              }`}
              style={{ flex: 1 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Center FAB */}
        <button
          onClick={() => setQuickActionOpen(true)}
          className="w-14 h-14 -top-5 relative rounded-full bg-[#FF8A00] shadow-[0_0_25px_rgba(255,138,0,0.45)] text-white flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </nav>

      {/* Global Footer */}
      <div className="text-center text-xs font-semibold text-slate-400 py-4 tracking-wide mt-8">
        Made by Efehan Çetin · GFitt © 2026
      </div>
    </div>
  );
}