import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  Mic, 
  Menu, 
  X, 
  Bell, 
  Crown, 
  Smartphone,
  BookOpen, 
  ShoppingBag, 
  Droplet, 
  Footprints, 
  FileText, 
  Cigarette, 
  Users, 
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxTab, setInboxTab] = useState('inbox');
  const [lang, setLang] = useState(() => localStorage.getItem('gfitt_lang') || 'tr');

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('gfitt_lang', newLang);
  };

  const navItems = [
    { label: 'Özet', path: '/', icon: LayoutGrid },
    { label: 'Yemek', path: '/food', icon: Utensils },
    { isAction: true },
    { label: 'Antrenman', path: '/workouts', icon: Dumbbell },
    { label: 'İlerleme', path: '/progress', icon: TrendingUp }
  ];

  const drawerItems = [
    { label: '📊 Günlük Özet', path: '/' },
    { label: '🍽️ Yemek & AI Kamera', path: '/food' },
    { label: '🏋️ Antrenman Programları', path: '/workouts' },
    { label: '🧘 Mobilite & Esneme', path: '/mobility' },
    { label: '📈 Güç Artışı & 1RM', path: '/strength' },
    { label: '💊 Supplement & GFIT10 Mağaza', path: '/supplements' },
    { label: '🥗 Beslenme Planları & Tarifler', path: '/recipes' },
    { label: '💧 Su & 16:8 Oruç', path: '/water' },
    { label: '👟 Adım, Enerji & Uyku', path: '/health' },
    { label: '📝 Kişisel Notlarım', path: '/notes' },
    { label: '🚭 Sigara Bırakma', path: '/habits' },
    { label: '👥 Sosyal Topluluk', path: '/social' },
    { label: '📚 Bilgi & Rehber', path: '/info' },
    { label: '👑 GFitt PRO', path: '/pro', highlight: true },
    { label: '⚙️ Profil & Ayarlar', path: '/profile' }
  ];

  return (
    <div className="min-h-screen bg-[#0E0C1A] text-white flex flex-col w-full max-w-full overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 w-full bg-[#141124]/90 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-[#FF8A00] bg-clip-text text-transparent active:scale-95 transition-transform"
          >
            GFitt
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex bg-[#1E1B38] border border-white/10 rounded-lg p-0.5 text-xs font-bold">
            {['tr', 'en', 'de'].map((l) => (
              <button
                key={l}
                onClick={() => switchLanguage(l)}
                className={`px-2 py-1 rounded uppercase transition-colors ${
                  lang === l ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Inbox Bell */}
          <button 
            onClick={() => setInboxOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 relative active:scale-95 transition-all"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF8A00] rounded-full ring-2 ring-[#141124]"></span>
          </button>

          {/* PRO Button */}
          <button 
            onClick={() => navigate('/pro')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF8A00] text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>PRO</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 pb-40 overflow-x-hidden">
        {children}

        {/* Global Footer Signature */}
        <footer className="mt-12 pt-6 pb-4 border-t border-white/5 text-center">
          <p className="text-xs font-semibold text-slate-500 tracking-wider">
            Made by Efehan Çetin · GFitt © 2026
          </p>
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar (4 Tabs + Center Action FAB) */}
      <nav className="fixed bottom-3 left-3 right-3 h-16 bg-[#161326]/95 backdrop-blur-2xl border border-white/15 rounded-2xl z-40 px-2 grid grid-cols-5 items-center max-w-md mx-auto shadow-2xl shadow-black/80">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <div key={idx} className="flex justify-center -mt-6">
                <button
                  onClick={() => navigate('/food?action=voice')}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF8A00] via-purple-600 to-indigo-600 p-0.5 shadow-xl shadow-purple-600/40 active:scale-90 transition-transform flex items-center justify-center"
                  aria-label="Hızlı Ekle & Sesli Günlük"
                >
                  <div className="w-full h-full bg-[#161326] hover:bg-transparent rounded-full flex items-center justify-center transition-colors">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-colors"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF8A00]' : 'text-slate-400'}`} />
              <span className={`text-[10px] ${isActive ? 'text-white font-bold' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Slide-Out Left Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#141124] h-full shadow-2xl flex flex-col p-5 border-r border-white/10 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-[#FF8A00] bg-clip-text text-transparent">
                GFitt Menü
              </span>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              {drawerItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    item.highlight 
                      ? 'bg-gradient-to-r from-purple-600/30 to-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/40' 
                      : location.pathname === item.path
                        ? 'bg-white/10 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 text-[11px] text-slate-500 text-center">
              Made by Efehan Çetin · 2026
            </div>
          </div>
        </div>
      )}

      {/* Top Inbox 3-Tab Modal */}
      {inboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#18152B] border border-white/15 rounded-3xl w-full max-w-md p-5 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#FF8A00]" />
                Bildirimler & Rehber
              </h3>
              <button onClick={() => setInboxOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-[#120F20] p-1 rounded-xl my-3 text-xs font-bold">
              {[
                { id: 'inbox', label: 'Gelen Kutusu' },
                { id: 'community', label: 'Topluluk' },
                { id: 'news', label: 'Yenilikler' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInboxTab(tab.id)}
                  className={`py-2 rounded-lg transition-colors ${
                    inboxTab === tab.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-sm text-slate-300">
              {inboxTab === 'inbox' && (
                <>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="font-semibold text-white text-xs text-purple-400 mb-1">Haftalık Değerlendirme</p>
                    <p className="text-xs">Bu hafta hedeflerine %85 uyum sağladın. Protein oranını artırmak için sabah öğünlerine yumurta ekleyebilirsin.</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="font-semibold text-white text-xs text-amber-400 mb-1">Beslenme İpucu</p>
                    <p className="text-xs">Bitki bazlı proteinler lif açısından zengindir; sindirimi kolaylaştırmak için mercimek ve kinoayı menüne dahil et.</p>
                  </div>
                </>
              )}
              {inboxTab === 'community' && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Henüz yeni bir beğeni veya yorum bildirimi yok.
                </div>
              )}
              {inboxTab === 'news' && (
                <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-2xl">
                  <p className="font-bold text-white text-xs mb-1">GFitt v2.5 Yayında!</p>
                  <p className="text-xs">Sokak lezzetleri veritabanı, tek halka dashboard ve mobilite rehberi eklendi.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}