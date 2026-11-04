import { Barcode, Camera, Mic, Pencil } from 'lucide-react';

const actions = [{ key: 'barcode', label: 'Barkod Tara', icon: Barcode }, { key: 'voice', label: 'Sesli Ekle', icon: Mic }, { key: 'photo', label: 'AI Fotoğraf', icon: Camera }, { key: 'manual', label: 'Manuel Ekle', icon: Pencil }];

export default function QuickAddPanel({ onSelect }) {
  return <div className="grid grid-cols-2 gap-3">{actions.map(({ key, label, icon: Icon }) => <button type="button" key={key} onClick={() => onSelect?.(key)} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#161326] p-3 text-center text-sm text-white/75 transition hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10"><Icon size={23} className="text-[#A78BFA]" /><span>{label}</span></button>)}</div>;
}
