import { Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';

const STORAGE_KEY = 'gfitt_personal_records';
const read = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } };

export default function PRTracker({ exerciseName, current }) {
  const [records, setRecords] = useState(read);
  const [entered, setEntered] = useState(current || '');
  const previous = Number(records[exerciseName] || 0); const currentValue = Number(entered) || 0; const improved = currentValue > previous;
  const save = () => { if (!currentValue) return; const next = { ...records, [exerciseName]: Math.max(previous, currentValue) }; localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setRecords(next); };
  return <div className="rounded-2xl border border-white/10 bg-[#161326] p-4"><div className="flex items-center gap-2 text-sm font-bold text-white"><Trophy size={17} className="text-[#FF8A00]" />{exerciseName} PR</div><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><span className="block text-xs text-white/45">Önceki PR</span><strong className="text-white">{previous || '—'} kg</strong></div><div><label className="block text-xs text-white/45" htmlFor={`pr-${exerciseName}`}>Mevcut (kg)</label><input id={`pr-${exerciseName}`} type="number" min="0" step="0.5" value={entered} onChange={(event) => setEntered(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm text-white outline-none" /></div></div>{improved && <p className="mt-3 text-xs text-emerald-300">🏆 Yeni PR! +{(currentValue - previous).toFixed(1)} kg gelişim</p>}<button type="button" onClick={save} disabled={!currentValue} className="mt-4 w-full rounded-xl bg-[#7C3AED] py-2 text-xs font-bold text-white disabled:opacity-40">Rekoru kaydet</button></div>;
}
