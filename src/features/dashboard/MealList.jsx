import { Clock3, Trash2 } from 'lucide-react';

const categoryLabels = { breakfast: 'Kahvaltı', lunch: 'Öğle', dinner: 'Akşam', snack: 'Ara öğün' };
const formatTime = (date) => new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

export default function MealList({ meals = [], onDelete }) {
  if (!meals.length) return <div className="rounded-2xl border border-dashed border-white/10 bg-[#161326] p-6 text-center text-sm text-white/50">🎤 Mikrofon butonuna basarak ilk öğününü ekle!</div>;
  return <div className="space-y-3">{meals.map((meal, index) => { const grams = Number(meal.grams || meal.default_grams || 100); const kcal = Math.round((Number(meal.kcal_per_100g) || 0) * grams / 100); return <article key={`${meal.id || meal.name_tr}-${meal.loggedAt || index}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#161326] p-4"><span className="text-2xl">{meal.emoji || '🍽️'}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-semibold text-white">{meal.name_tr || meal.name || 'Öğün'}</h3><span className="rounded-full bg-[#7C3AED]/20 px-2 py-0.5 text-[10px] text-[#C4B5FD]">{categoryLabels[meal.meal] || meal.meal || 'Öğün'}</span></div><div className="mt-1 flex items-center gap-2 text-xs text-white/45"><Clock3 size={12} />{formatTime(meal.loggedAt || Date.now())} · {grams} g · {kcal} kcal</div></div><button type="button" onClick={() => onDelete?.(index)} aria-label="Öğünü sil" className="rounded-lg p-2 text-white/35 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={17} /></button></article>; })}</div>;
}
