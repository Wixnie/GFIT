import { useState } from 'react';
import { Bell, MessageCircle, Sparkles, X } from 'lucide-react';

const tabs = [
  { id: 'inbox', label: 'Gelen Kutusu', icon: Bell }, { id: 'community', label: 'Topluluk', icon: MessageCircle }, { id: 'updates', label: 'Yenilikler', icon: Sparkles },
];
const notifications = {
  inbox: [{ title: 'Günlük hedefin hazır', text: 'Bugünkü kalori ve makro hedeflerini kontrol et.', time: 'Şimdi' }, { title: 'Serini koru!', text: '3 günlük serine devam etmek için kısa bir antrenman yap.', time: '1 saat önce' }],
  community: [{ title: 'Topluluk meydan okuması', text: 'Bu haftanın 10.000 adım meydan okumasına katıl.', time: 'Bugün' }],
  updates: [{ title: 'GFitt yenilendi', text: 'Yeni beslenme ve antrenman özelliklerini keşfet.', time: 'Bu hafta' }],
};

export default function NotificationModal({ open = false, onClose }) {
  const [activeTab, setActiveTab] = useState('inbox');
  if (!open) return null;
  return <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#161326] shadow-2xl"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h2 className="font-bold text-white">Bildirimler</h2><button type="button" onClick={onClose} aria-label="Kapat" className="text-white/60 hover:text-white"><X size={20} /></button></div><div className="flex border-b border-white/10 px-3">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex flex-1 items-center justify-center gap-1 px-2 py-3 text-xs ${activeTab === id ? 'border-b-2 border-[#7C3AED] text-white' : 'text-white/45'}`}><Icon size={14} />{label}</button>)}</div><div className="space-y-3 p-4">{notifications[activeTab].map((item) => <article key={item.title} className="rounded-xl bg-white/5 p-3"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-white">{item.title}</h3><time className="text-[10px] text-white/35">{item.time}</time></div><p className="mt-1 text-xs text-white/55">{item.text}</p></article>)}</div></div>
  </div>;
}
