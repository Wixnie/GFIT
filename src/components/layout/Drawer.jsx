import { Bot, Dumbbell, Home, Languages, LineChart, Settings, User, Utensils, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const links = [
  ['/', 'Özet', Home], ['/food', 'Beslenme', Utensils], ['/workout', 'Antrenman', Dumbbell], ['/progress', 'İlerleme', LineChart], ['/ai-coach', 'AI Koç', Bot], ['/profile', 'Profil', User], ['/settings', 'Ayarlar', Settings],
];

export default function Drawer({ open = false, onClose }) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  return <div className={`fixed inset-0 z-50 md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
    <button type="button" aria-label="Menüyü kapat" onClick={onClose} className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
    <aside className={`absolute bottom-0 left-0 top-0 flex w-[min(84vw,320px)] flex-col bg-[#161326] p-5 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center justify-between"><Link to="/" onClick={onClose} className="text-2xl font-black text-white">GF<span className="text-[#7C3AED]">i</span>tt</Link><button type="button" onClick={onClose} aria-label="Kapat" className="rounded-xl p-2 text-white/70 hover:bg-white/10"><X size={22} /></button></div>
      <nav className="space-y-1">{links.map(([to, label, Icon]) => <Link key={to} to={to} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${location.pathname === to ? 'bg-[#7C3AED]/20 text-white' : 'text-white/65'}`}><Icon size={19} />{label}</Link>)}</nav>
      <div className="mt-8 rounded-2xl border border-white/10 p-4"><div className="mb-3 flex items-center gap-2 text-sm text-white/70"><Languages size={17} /> Dil</div><div className="flex gap-2">{['tr', 'en', 'de'].map((item) => <button key={item} type="button" onClick={() => setLanguage(item)} className={`rounded-lg px-3 py-1.5 text-xs uppercase ${language === item ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-white/50'}`}>{item}</button>)}</div></div>
      <button type="button" className="mt-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#FF8A00] px-4 py-3 text-sm font-bold text-slate-950">✨ GFitt PRO</button>
      <footer className="mt-auto text-xs leading-5 text-white/35">Made by Efehan Çetin · GFitt © 2026</footer>
    </aside>
  </div>;
}
