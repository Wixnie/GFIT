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
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Özet', icon: LayoutDashboard },
    { to: '/yemek', label: 'Yemek', icon: UtensilsCrossed },
    { to: '/antrenman', label: 'Antrenman', icon: Dumbbell },
    { to: '/ilerleme', label: 'İlerleme', icon: TrendingUp },
  ];

  const drawerLinks = [
    { to: '/supplement', label: 'Supplement & Takviye', icon: Pill },
    { to: '/mobility', label: 'Mobilite & Esneme', icon: Activity },
    { to: '/ai-koc', label: 'AI Koç & Sohbet', icon: Sparkles },
    { to: '/aliskanliklar', label: 'Alışkanlık Takibi', icon: Activity },
    { to: '/guc-artisi', label: 'Güç Artışı (1RM)', icon: Dumbbell },
    { to: '/kilo', label: 'Kilo Geçmişi', icon: TrendingUp },
    { to: '/pazar', label: 'GFitt Market', icon: ShoppingBag },
    { to: '/profil', label: 'Profil & Hedefler', icon: User },
    { to: '/premium', label: 'GFitt PRO Üyelik', icon: Crown, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#0B0914] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Üst Bar (Header) */}
      <header className="sticky top-0 z-40 bg-[#0B0914]/90 backdrop-blur-md border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Menüyü Aç"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            GFitt
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/premium"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>PRO</span>
          </NavLink>

          <NavLink
            to="/profil"
            className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-200"
          >
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'G'}
          </NavLink>
        </div>
      </header>

      {/* Yan Çekmece Menü (Drawer) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-[#120F22] border-r border-white/10 h-full p-5 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="font-black text-xl text-white">GFitt Menü</span>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {drawerLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setDrawerOpen(false)}
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        item.highlight 
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                          : isActive 
                            ? 'bg-purple-600 text-white' 
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
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

      {/* Ana İçerik Alanı (Alt bar payı bırakılmış mobil container) */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-4 pb-20">
        <Outlet />
      </main>

      {/* 4'lü Sabit Mobil Alt Navigasyon Barı */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0F0C1E]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-purple-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200 text-xs font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}