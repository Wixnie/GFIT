import { MessageCircle, Sparkles } from 'lucide-react';

export default function AICoachMessage({ calories = 0, targetCalories = 2000, protein = 0, targetProtein = 150, onSuggestion }) {
  const kcal = Math.max(0, Number(calories) || 0);
  const target = Math.max(1, Number(targetCalories) || 2000);
  const proteinValue = Math.max(0, Number(protein) || 0);
  const ratio = kcal / target;
  let message = 'Bugün ilk öğününü ekleyerek başlayalım. Küçük bir adım, güçlü bir gün!';
  if (ratio > 0 && ratio < 0.5) message = `Güzel başlangıç! Hedefine ${Math.round(target - kcal)} kcal ve yaklaşık ${Math.max(0, Math.round(targetProtein - proteinValue))} g protein kaldı.`;
  else if (ratio >= 0.9 && ratio <= 1.05) message = 'Harika gidiyorsun! Bugünkü enerji hedefini dengeli şekilde tamamladın.';
  else if (ratio > 1.05) message = 'Hedefini aştın; kalan öğünlerde su, sebze ve hafif proteinlere odaklan.';
  const suggestions = ['Izgara tavuk', 'Süzme yoğurt', 'Mercimek salatası'];
  return <div className="rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#161326] to-[#21183B] p-4"><div className="flex items-start gap-3"><div className="rounded-xl bg-[#7C3AED]/20 p-2 text-[#C4B5FD]"><MessageCircle size={18} /></div><div className="flex-1"><div className="flex items-center gap-2 text-sm font-bold text-white"><Sparkles size={14} className="text-[#FF8A00]" />AI Koç</div><p className="mt-2 text-sm leading-5 text-white/70">{message}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => onSuggestion?.(suggestion)} className="rounded-full bg-[#FF8A00] px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-orange-300">+ {suggestion}</button>)}</div></div>;
}
