import { Dumbbell, Home, LineChart, Mic, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Özet', icon: Home },
  { to: '/food', label: 'Yemek', icon: Utensils },
  { to: '/workout', label: 'Antrenman', icon: Dumbbell },
  { to: '/progress', label: 'İlerleme', icon: LineChart },
];

export default function BottomNav({ onMicClick }) {
  const location = useLocation();
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid h-20 grid-cols-5 items-center border-t border-white/10 bg-[#161326]/95 px-2 pb-safe backdrop-blur-xl md:hidden">
    <Link to={links[0].to} className={`flex flex-col items-center gap-1 text-[10px] ${location.pathname === '/' ? 'text-[#A78BFA]' : 'text-white/50'}`}><Home size={20} /><span>{links[0].label}</span></Link>
    <Link to={links[1].to} className={`flex flex-col items-center gap-1 text-[10px] ${location.pathname.startsWith('/food') ? 'text-[#A78BFA]' : 'text-white/50'}`}><Utensils size={20} /><span>{links[1].label}</span></Link>
    <button type="button" onClick={onMicClick} aria-label="GFitt AI sesli koç" className="mx-auto -mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF8A00] text-slate-950 shadow-[0_0_28px_rgba(124,58,237,.65)] transition hover:scale-105 active:scale-95"><Mic size={25} className="animate-pulse" /></button>
    <Link to={links[2].to} className={`flex flex-col items-center gap-1 text-[10px] ${location.pathname.startsWith('/workout') ? 'text-[#A78BFA]' : 'text-white/50'}`}><Dumbbell size={20} /><span>{links[2].label}</span></Link>
    <Link to={links[3].to} className={`flex flex-col items-center gap-1 text-[10px] ${location.pathname.startsWith('/progress') ? 'text-[#A78BFA]' : 'text-white/50'}`}><LineChart size={20} /><span>{links[3].label}</span></Link>
  </nav>;
}
