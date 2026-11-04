import { Minus, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import GuestGuard from '../auth/GuestGuard';

export default function LoggedModal({ food, initialGrams, onClose, onSaved }) {
  const { addFoodLog } = useUserData();
  const [grams, setGrams] = useState(Math.max(10, Number(initialGrams || food?.default_grams || 100)));
  const values = useMemo(() => { const factor = grams / 100; return { kcal: Math.round((Number(food?.kcal_per_100g) || 0) * factor), protein: Math.round((Number(food?.protein) || 0) * factor * 10) / 10, carbs: Math.round((Number(food?.carbs) || 0) * factor * 10) / 10, fat: Math.round((Number(food?.fat) || 0) * factor * 10) / 10, fiber: Math.round((Number(food?.fiber) || 0) * factor * 10) / 10 }; }, [food, grams]);
  if (!food) return null;
  const save = () => { const entry = addFoodLog(food, grams, food.meal || 'snack'); onSaved?.(entry); onClose?.(); };
  return <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm sm:items-center"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#161326] p-5 text-white shadow-2xl"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="text-4xl">{food.emoji || '🍽️'}</span><div><h2 className="text-lg font-bold">{food.name_tr || food.name}</h2><p className="text-xs text-white/45">{food.portion_label || 'Porsiyon'}</p></div></div><button type="button" onClick={onClose} aria-label="Kapat" className="rounded-lg p-1 text-white/55"><X size={20} /></button></div><div className="mt-6 flex items-center justify-between rounded-2xl bg-black/20 p-3"><button type="button" onClick={() => setGrams((value) => Math.max(10, value - 10))} aria-label="Gram azalt" className="rounded-xl bg-white/10 p-2"><Minus size={18} /></button><div className="text-center"><div className="text-2xl font-black">{grams} g</div><div className="text-sm text-[#FF8A00]">{values.kcal} kcal</div></div><button type="button" onClick={() => setGrams((value) => value + 10)} aria-label="Gram artır" className="rounded-xl bg-white/10 p-2"><Plus size={18} /></button></div><div className="mt-4 grid grid-cols-4 gap-2 text-center"><Macro label="P" value={values.protein} color="text-emerald-300" /><Macro label="C" value={values.carbs} color="text-indigo-300" /><Macro label="F" value={values.fat} color="text-orange-300" /><Macro label="Lif" value={values.fiber} color="text-purple-300" /></div><GuestGuard><button type="button" onClick={save} className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] py-3 font-bold">Kaydet</button></GuestGuard></div></div>;
}

function Macro({ label, value, color }) { return <div className="rounded-xl bg-white/5 p-2"><div className={`text-sm font-bold ${color}`}>{label}</div><div className="mt-1 text-xs text-white/60">{value}g</div></div>; }
