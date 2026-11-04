import { Bot, Dumbbell, Home, LineChart, Settings, User, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const moduleLinks = [
  { to: '/', label: 'Özet', icon: Home }, { to: '/food', label: 'Beslenme', icon: Utensils }, { to: '/workout', label: 'Antrenman', icon: Dumbbell }, { to: '/progress', label: 'İlerleme', icon: LineChart }, { to: '/ai-coach', label: 'AI Koç', icon: Bot }, { to: '/profile', label: 'Profil', icon: User }, { to: '/settings', label: 'Ayarlar', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  return <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 flex-col border-r border-white/10 bg-[#161326] px-4 py-6 md:flex">
    <nav className="space-y-1">{moduleLinks.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${location.pathname === to || (to !== '/' && location.pathname.startsWith(to)) ? 'bg-[#7C3AED]/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><Icon size={19} /><span>{label}</span></Link>)}</nav>
    <footer className="mt-auto px-4 text-xs leading-5 text-white/35">Made by Efehan Çetin · GFitt © 2026</footer>
  </aside>;
}
