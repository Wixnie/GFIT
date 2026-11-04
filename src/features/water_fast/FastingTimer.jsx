import { useEffect, useMemo, useState } from 'react';

const KEY = 'gfitt_fast_start';
const phases = [{ until: 8, name: 'Glikojen Tüketimi' }, { until: 12, name: 'Yağ Yakımı Başlar' }, { until: 16, name: 'Ketozis' }, { until: Infinity, name: 'Otofaji' }];
const pad = (value) => String(value).padStart(2, '0');

export default function FastingTimer() {
  const [startedAt, setStartedAt] = useState(() => localStorage.getItem(KEY) || '');
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const elapsed = startedAt ? Math.max(0, (now - new Date(startedAt).getTime()) / 3600000) : 0;
  const hours = Math.min(16, elapsed); const remaining = Math.max(0, 16 * 3600 - elapsed * 3600); const phase = phases.find((item) => elapsed < item.until) || phases[3];
  const toggle = () => { if (startedAt) { localStorage.removeItem(KEY); setStartedAt(''); } else { const value = new Date().toISOString(); localStorage.setItem(KEY, value); setStartedAt(value); } };
  const setStart = (event) => { const value = event.target.value; if (!value) return; const date = new Date(value); localStorage.setItem(KEY, date.toISOString()); setStartedAt(date.toISOString()); };
  const countdown = useMemo(() => `${pad(Math.floor(remaining / 3600))}:${pad(Math.floor((remaining % 3600) / 60))}:${pad(Math.floor(remaining % 60))}`, [remaining]);
  return <section className="rounded-2xl border border-white/10 bg-[#161326] p-5"><div className="flex items-center justify-between"><h2 className="font-bold text-white">16:8 Oruç</h2><span className="rounded-full bg-[#7C3AED]/20 px-3 py-1 text-xs text-[#C4B5FD]">{phase.name}</span></div><div className="my-6 text-center text-5xl font-black tabular-nums text-white">{startedAt ? countdown : '16:00:00'}</div><div className="h-2 overflow-hidden rounded-full bg-[#2A2438]"><div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#FF8A00]" style={{ width: `${Math.min(100, (hours / 16) * 100)}%` }} /></div><label className="mt-5 block text-xs text-white/45" htmlFor="fast-start">Başlangıç zamanı</label><input id="fast-start" type="datetime-local" onChange={setStart} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white" /><button type="button" onClick={toggle} className="mt-4 w-full rounded-xl bg-[#7C3AED] py-3 text-sm font-bold text-white">{startedAt ? 'Orucu durdur' : 'Orucu başlat'}</button></section>;
}
